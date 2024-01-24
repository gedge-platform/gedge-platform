package controllers

import (
	"context"
	"fmt"
	"time"

	"github.com/cenkalti/backoff"
	"gitlab.tde.sktelecom.com/SCALEBACK/vk8s/api/v1alpha1"
	appsv1 "k8s.io/api/apps/v1"
	corev1 "k8s.io/api/core/v1"
	apierrors "k8s.io/apimachinery/pkg/api/errors"
	"k8s.io/apimachinery/pkg/api/resource"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/types"
	ctrl "sigs.k8s.io/controller-runtime"
	"sigs.k8s.io/controller-runtime/pkg/controller/controllerutil"
	"sigs.k8s.io/controller-runtime/pkg/log"
)

func (r *Vk8sReconciler) ReconcileSts(ctx context.Context, vk8s *v1alpha1.Vk8s, vnode v1alpha1.NodePod) (ctrl.Result, error) {
	sts, err := generateStatefulSet(vk8s, vnode)
	if err != nil {
		return ctrl.Result{}, err
	}
	if err := controllerutil.SetControllerReference(vk8s, sts, r.Scheme); err != nil {
		log.Log.Error(err, "error setting ControllerReference")
		return ctrl.Result{}, err
	}
	foundSts := &appsv1.StatefulSet{}
	err = r.Get(ctx, types.NamespacedName{
		Namespace: vk8s.Namespace,
		Name:      vnode.Name},
		foundSts)
	if err != nil {
		// Create StatefulSet
		if apierrors.IsNotFound(err) {
			log.Log.Info("Creating VNode StatefulSet: " + sts.Name)
			if updateErr := r.updateVk8sPhase(ctx,
				vk8s,
				VK8S_WAITING,
				"creating node"); updateErr != nil {
				return ctrl.Result{}, updateErr
			}
			freeIP, err := getFreeIP()
			if err != nil {
				return ctrl.Result{}, err
			}
			if sts.Spec.Template.Annotations == nil {
				sts.Spec.Template.Annotations = make(map[string]string)
			}
			sts.Spec.Template.Annotations["cni.projectcalico.org/ipAddrs"] = fmt.Sprintf(`["%s"]`, freeIP.PodIP)
			err = r.Create(ctx, sts)
			if err != nil {
				log.Log.Error(err, "error creating statefulset")
				return ctrl.Result{}, err
			}
			// wait 25 seconds for new statefulset creation
			err = backoff.Retry(
				func() error {
					return r.Get(ctx, types.NamespacedName{
						Namespace: vk8s.Namespace,
						Name:      vnode.Name},
						foundSts)
				},
				backoff.WithMaxRetries(backoff.NewConstantBackOff(5*time.Second), 5),
			)
			if err != nil {
				log.Log.Error(err, "error statefulset create completion")
				return ctrl.Result{}, err
			}
			log.Log.Info("Create StatefulSet: " + foundSts.Name)
		} else {
			log.Log.Error(err, "error reading statefulset")
			return ctrl.Result{}, err
		}
	} else {
		// Update Statefulset
		if copyStatefulSetFields(sts, foundSts) {
			if *sts.Spec.Replicas == 0 {
				if updateErr := r.updateVk8sPhase(
					ctx,
					vk8s,
					VK8S_PAUSED,
					fmt.Sprintf("%s is paused", vk8s.Name)); updateErr != nil {
					return ctrl.Result{}, updateErr
				}
			} else {
				if updateErr := r.updateVk8sPhase(
					ctx,
					vk8s,
					VK8S_RESTARTING,
					"resume kubeflow"); updateErr != nil {
					return ctrl.Result{}, updateErr
				}
			}
			log.Log.Info("Updating StatefulSet", "namespace", sts.Namespace, "name", sts.Name)
			err = r.Update(ctx, foundSts)
			if err != nil {
				log.Log.Error(err, "error updating statefulset")
				return ctrl.Result{}, err
			}

		}
	}
	vnodeStatus, err := r.getVNodeStatus(ctx, vk8s.Namespace, vnode)
	if err != nil {
		return ctrl.Result{}, err
	}
	if _, ok := vk8s.Status.VNodeKubernetesSetupStatuses[vnode.Name]; !ok {
		vnodeStatus.IsKubernetesSetup = ""
	} else {
		vnodeStatus.IsKubernetesSetup = vk8s.Status.VNodeKubernetesSetupStatuses[vnode.Name].IsKubernetesSetup
	}
	if vk8s.Status.VNodeKubernetesSetupStatuses == nil {
		vk8s.Status.VNodeKubernetesSetupStatuses = make(map[string]v1alpha1.VNodeStatus)
	}
	vk8s.Status.VNodeKubernetesSetupStatuses[vnode.Name] = vnodeStatus
	return ctrl.Result{}, nil
}

// generateStatefulSet generate vnode statefulset object
func generateStatefulSet(
	vk8s *v1alpha1.Vk8s,
	node v1alpha1.NodePod) (*appsv1.StatefulSet, error) {
	ls, err := makeLabels(vk8s, node.Name, node.Role)
	if err != nil {
		log.Log.Error(err, "Failed to make labels for virtual node")
		return nil, err
	}
	containerPort, err := makeContainerPort(node, vk8s.Spec.Ports)
	if err != nil {
		return nil, err
	}
	privileged := true
	replicas := int32(1)
	if isStopAnnotationSet(vk8s.ObjectMeta) {
		replicas = 0
	}
	vnodeName := node.Name
	storageClassName := "local-path"
	nodeSelector := make(map[string]string)
	envList := []corev1.EnvVar{{
		Name:  "KUBE_NODE_TYPE",
		Value: "INNER"}}
	gpuType, ok := vk8s.Annotations[vnodeName]
	if ok {
		nodeSelector[GPUNODESELECTOR] = gpuType
		envList = append(envList, corev1.EnvVar{Name: "NVIDIA_VISIBLE_DEVICES", Value: "all"})
	}
	sts := &appsv1.StatefulSet{
		ObjectMeta: metav1.ObjectMeta{
			Name:        vnodeName,
			Namespace:   vk8s.Namespace,
			Labels:      ls,
			Finalizers:  []string{FOREGROUNDDELETION},
			Annotations: vk8s.Annotations,
		},
		Spec: appsv1.StatefulSetSpec{
			Replicas: &replicas,
			Selector: &metav1.LabelSelector{
				MatchLabels: map[string]string{
					"vnode": vnodeName,
				},
			},
			ServiceName: "",
			Template: corev1.PodTemplateSpec{
				ObjectMeta: metav1.ObjectMeta{
					Labels: ls,
				},
				Spec: corev1.PodSpec{
					Tolerations:  node.Tolerations,
					NodeSelector: nodeSelector,
					Containers: []corev1.Container{
						{
							Name:            makePodName(vnodeName),
							Image:           node.Image,
							ImagePullPolicy: corev1.PullAlways,
							Ports:           containerPort,
							Env:             envList,
							SecurityContext: &corev1.SecurityContext{
								Privileged: &privileged,
							},
							Lifecycle: &corev1.Lifecycle{
								PostStart: &corev1.LifecycleHandler{
									Exec: &corev1.ExecAction{
										Command: []string{"/bin/sh", "-c", "./post-start.sh"},
									},
								},
							},
							Resources: corev1.ResourceRequirements{
								Requests: node.Resources.Requests,
								Limits:   node.Resources.Limits,
							},
							VolumeMounts: []corev1.VolumeMount{{
								Name:      MODULEPATHNAME,
								MountPath: MODULEPATH,
								ReadOnly:  true,
							}, {
								Name:      SRCPATHNAME,
								MountPath: SRCPATH,
								ReadOnly:  true,
							}, {
								Name:      VK8SBACKUPNAME,
								MountPath: VK8SBACKUPPATH,
							}},
						},
					},
					Volumes: []corev1.Volume{{
						Name: MODULEPATHNAME,
						VolumeSource: corev1.VolumeSource{
							HostPath: &corev1.HostPathVolumeSource{
								Path: MODULEPATH,
							},
						},
					}, {
						Name: SRCPATHNAME,
						VolumeSource: corev1.VolumeSource{
							HostPath: &corev1.HostPathVolumeSource{
								Path: SRCPATH,
							},
						},
					}},
				},
			},
			VolumeClaimTemplates: []corev1.PersistentVolumeClaim{{
				ObjectMeta: metav1.ObjectMeta{
					Name:      VK8SBACKUPNAME,
					Namespace: vk8s.Namespace,
				},
				Spec: corev1.PersistentVolumeClaimSpec{
					AccessModes: []corev1.PersistentVolumeAccessMode{
						corev1.ReadWriteOnce,
					},
					Resources: corev1.ResourceRequirements{
						Requests: corev1.ResourceList{
							corev1.ResourceStorage: resource.MustParse("10Gi"),
						},
					},
					StorageClassName: &storageClassName,
				},
			}},
		},
	}
	return sts, nil
}

// copyStatefulSetFields copy statefulset except calico static ip address
func copyStatefulSetFields(from, to *appsv1.StatefulSet) bool {
	requireUpdate := false

	if len(getMapKeys(from.Labels)) != len(getMapKeys(to.Labels)) {
		requireUpdate = true
	}
	for k, v := range from.Labels {
		if val, ok := to.Labels[k]; !ok || val != v {
			requireUpdate = true
		}
	}
	to.Labels = from.Labels

	// to.Annotations = from.Annotations

	if *from.Spec.Replicas != *to.Spec.Replicas {
		*to.Spec.Replicas = *from.Spec.Replicas
		requireUpdate = true
	}
	to.Spec.Replicas = from.Spec.Replicas

	// to.Spec.Template.Spec = from.Spec.Template.Spec // -> Block updating pod resource

	return requireUpdate
}
