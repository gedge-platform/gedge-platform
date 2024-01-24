package controllers

import (
	"context"
	"fmt"

	"gitlab.tde.sktelecom.com/SCALEBACK/vk8s/api/v1alpha1"
	corev1 "k8s.io/api/core/v1"
	apierrors "k8s.io/apimachinery/pkg/api/errors"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/types"
	"k8s.io/apimachinery/pkg/util/intstr"
	ctrl "sigs.k8s.io/controller-runtime"
	"sigs.k8s.io/controller-runtime/pkg/controller/controllerutil"
	"sigs.k8s.io/controller-runtime/pkg/log"
)

func (r *Vk8sReconciler) ReconcileAccessPo(
	ctx context.Context,
	vk8s *v1alpha1.Vk8s,
	accessPodName *string,
	isAccessPodExists *bool) (
	ctrl.Result, error) {

	if vk8s.Spec.AccessPodImage != "" && vk8s.Spec.AccessPodPort != 0 {
		*isAccessPodExists = true
		*accessPodName = fmt.Sprintf("%s-access-pod", vk8s.Name)
		labels := accessPodLabel(vk8s.Name)
		accessPod := &corev1.Pod{
			ObjectMeta: metav1.ObjectMeta{
				Labels:    labels,
				Name:      *accessPodName,
				Namespace: vk8s.Namespace,
			},
			Spec: corev1.PodSpec{
				Containers: []corev1.Container{
					{
						Image: vk8s.Spec.AccessPodImage,
						Name:  *accessPodName,
						Ports: []corev1.ContainerPort{
							{
								ContainerPort: SSH_PORT,
							},
						},
					},
				},
			},
		}
		if err := controllerutil.SetControllerReference(vk8s, accessPod, r.Scheme); err != nil {
			return ctrl.Result{}, err
		}
		foundAccessPod := &corev1.Pod{}
		err := r.Get(ctx, types.NamespacedName{
			Namespace: accessPod.Namespace,
			Name:      accessPod.Name},
			foundAccessPod,
		)
		if err != nil {
			// Create Access Pod
			if apierrors.IsNotFound(err) {
				err = r.Create(ctx, accessPod)
				if err != nil {
					log.Log.Error(err, "error creating pod")
					return ctrl.Result{}, err
				}
			} else {
				log.Log.Error(err, "error getting pod")
				return ctrl.Result{}, err
			}
		} else {
			// Update Access Pod
			if copyPodFields(accessPod, foundAccessPod) {
				log.Log.Info("Updating Access Pod", "namespace", foundAccessPod.Namespace, "name", foundAccessPod.Name)
				err = r.Update(ctx, foundAccessPod)
				if err != nil {
					log.Log.Error(err, "error updating pod")
					return ctrl.Result{}, err
				}
			}
		}
		accessSvc := &corev1.Service{
			ObjectMeta: metav1.ObjectMeta{
				Name:      fmt.Sprintf("%s-access-svc", vk8s.Name),
				Namespace: vk8s.Namespace,
				Labels:    labels,
			},
			Spec: corev1.ServiceSpec{
				Type:     corev1.ServiceTypeNodePort,
				Selector: labels,
				Ports: []corev1.ServicePort{
					{
						Port:       SSH_PORT,
						TargetPort: intstr.FromInt(SSH_PORT),
					},
				},
			},
		}
		if err := controllerutil.SetControllerReference(vk8s, accessSvc, r.Scheme); err != nil {
			return ctrl.Result{}, err
		}
		foundAccessSvc := &corev1.Service{}
		err = r.Get(ctx, types.NamespacedName{
			Namespace: accessSvc.Namespace,
			Name:      accessSvc.Name},
			foundAccessSvc,
		)
		if err != nil {
			// Create Access Pod
			if apierrors.IsNotFound(err) {
				err = r.Create(ctx, accessSvc)
				if err != nil {
					log.Log.Error(err, "error creating service")
					return ctrl.Result{}, err
				}
			} else {
				log.Log.Error(err, "error getting service")
				return ctrl.Result{}, err
			}
		} else {
			// Update Access Service
			if copyServiceFields(accessSvc, foundAccessSvc) {
				log.Log.Info("Updating Access Service", "namespace", foundAccessPod.Namespace, "name", foundAccessPod.Name)
				err = r.Update(ctx, foundAccessSvc)
				if err != nil {
					log.Log.Error(err, "error updating service")
					return ctrl.Result{}, err
				}
			}
		}
	}
	return ctrl.Result{}, nil
}

// copyPodFields copy only pod labels and annotations
func copyPodFields(from, to *corev1.Pod) bool {
	requireUpdate := false
	for k, v := range to.Labels {
		if from.Labels[k] != v {
			requireUpdate = true
		}
	}
	to.Labels = from.Labels
	for k, v := range to.Annotations {
		if from.Annotations[k] != v {
			requireUpdate = true
		}
	}
	to.Annotations = from.Annotations

	return requireUpdate
}
