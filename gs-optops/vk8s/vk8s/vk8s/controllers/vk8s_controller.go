/*
Copyright 2023.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

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
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/apimachinery/pkg/types"
	ctrl "sigs.k8s.io/controller-runtime"
	"sigs.k8s.io/controller-runtime/pkg/builder"
	"sigs.k8s.io/controller-runtime/pkg/client"
	"sigs.k8s.io/controller-runtime/pkg/controller"
	"sigs.k8s.io/controller-runtime/pkg/event"
	"sigs.k8s.io/controller-runtime/pkg/handler"
	"sigs.k8s.io/controller-runtime/pkg/log"
	"sigs.k8s.io/controller-runtime/pkg/predicate"
	"sigs.k8s.io/controller-runtime/pkg/reconcile"
	"sigs.k8s.io/controller-runtime/pkg/source"

	vk8sv1alpha1 "gitlab.tde.sktelecom.com/SCALEBACK/vk8s/api/v1alpha1"
)

// Vk8sReconciler reconciles a Vk8s object
type Vk8sReconciler struct {
	client.Client
	Scheme *runtime.Scheme
}

const connectionAnnoKey = "cluster-network-connection-status"

//+kubebuilder:rbac:groups=vk8s.sktelecom.com,resources=vk8s,verbs=get;list;watch;create;update;patch;delete
//+kubebuilder:rbac:groups=vk8s.sktelecom.com,resources=vk8s/status,verbs=get;update;patch
//+kubebuilder:rbac:groups=vk8s.sktelecom.com,resources=vk8s/finalizers,verbs=update
// +kubebuilder:rbac:groups=core,resources=events,verbs=get;list;watch;create;patch
//+kubebuilder:rbac:groups=core,resources=pods,verbs=get;list;create;watch;update;patch;delete
//+kubebuilder:rbac:groups=core,resources=nodes,verbs=get;list;watch
//+kubebuilder:rbac:groups=apps,resources=statefulsets,verbs=get;list;create;watch;update;patch;delete
//+kubebuilder:rbac:groups=core,resources=services,verbs=get;list;create;watch;update;patch;delete
//+kubebuilder:rbac:groups=core,resources=pods/exec,verbs=create;
//+kubebuilder:rbac:groups=core,resources=persistentvolumeclaims,verbs=get;list;watch

// Reconcile is part of the main kubernetes reconciliation loop which aims to
// move the current state of the cluster closer to the desired state.
// the Vk8s object against the actual cluster state, and then
// perform operations to make the cluster state reflect the state specified by
// the user.
//
// For more details, check Reconcile and its Result here:
// - https://pkg.go.dev/sigs.k8s.io/controller-runtime@v0.9.2/pkg/reconcile
func (r *Vk8sReconciler) Reconcile(ctx context.Context, req ctrl.Request) (ctrl.Result, error) {
	ctx, cancel := context.WithTimeout(ctx, 20*time.Minute)
	defer func() { cancel() }()
	_ = log.FromContext(ctx)

	vk8s := &vk8sv1alpha1.Vk8s{}
	err := r.Get(ctx, req.NamespacedName, vk8s)
	if err != nil {
		// check vk8s resource is delete
		if apierrors.IsNotFound(err) {
			log.Log.Info(fmt.Sprintf("Vk8s %s resource not found. Ignoring since object must be deleted", req.Name))
			return ctrl.Result{}, nil
		}
		log.Log.Error(err, "Failed to get Vk8s")
		return ctrl.Result{}, err
	}

	if vk8s.DeletionTimestamp != nil {
		origin := vk8s.DeepCopy()
		vk8s.Status.Phase = VK8S_TERMINATING
		vk8s.Status.Message = ""
		if err := r.patchVk8s(ctx, origin, vk8s); err != nil {
			return ctrl.Result{}, err
		}
	}

	// reconcile vnodes
	vnodes := vk8s.Spec.Nodes
	masterVNode := getMasterVNode(vnodes)
	isAccessPodExists := false
	origin := vk8s.DeepCopy()
	if vk8s.Status.VNodeKubernetesSetupStatuses == nil {
		vk8s.Status.VNodeKubernetesSetupStatuses = make(map[string]vk8sv1alpha1.VNodeStatus)
	}
	for _, vnode := range vnodes {
		if vnode.Role.IsMaster() {
			masterVNode = vnode
		}

		// Reconcile Statefulset
		result, err := r.ReconcileSts(ctx, vk8s, vnode)
		if err != nil {
			return result, err
		}
	}
	if err := r.patchVk8s(ctx, origin, vk8s); err != nil {
		return ctrl.Result{}, err
	}
	// Reconcile Service
	result, err := r.ReconcileSvc(ctx, vk8s)
	if err != nil {
		return result, err
	}

	// Reconcile Access Pod
	accessPodName := ""
	result, err = r.ReconcileAccessPo(ctx, vk8s, &accessPodName, &isAccessPodExists)
	if err != nil {
		return result, err
	}

	// check all pod running for initialize virtual kuberntetes
	if ok, err := r.allPodRunning(ctx, vk8s); err != nil {
		return ctrl.Result{}, err
	} else if !ok {
		return ctrl.Result{Requeue: true}, nil
	}
	if vk8s.Status.Phase == VK8S_RESTARTING {
		if updateErr := r.updateVk8sPhase(ctx,
			vk8s,
			VK8S_RUNNING,
			"Running"); updateErr != nil {
			return ctrl.Result{}, updateErr
		}
	}

	if connected, ok := vk8s.Annotations[connectionAnnoKey]; !ok || connected == "false" {
		log.Log.Info("Network Connection is not established yet...")
		if vk8s.Status.Phase != VK8S_WAITING_NETWORK {
			if updateErr := r.updateVk8sPhase(ctx,
				vk8s,
				VK8S_WAITING_NETWORK,
				"Connecting Network"); updateErr != nil {
				return ctrl.Result{}, updateErr
			}
		}
		return ctrl.Result{}, nil
	}
	// Setup Vk8s after network connection is established
	isSingle := false
	if len(vnodes) == 1 {
		isSingle = true
	}
	result, err = r.InstallVk8s(ctx, vk8s, vnodes, masterVNode)
	if err != nil {
		return result, err
	}

	return r.ConfigureVk8s(ctx, vk8s, vnodes, masterVNode, accessPodName, isAccessPodExists, isSingle)
}

func (r *Vk8sReconciler) allPodRunning(
	ctx context.Context,
	vk8s *v1alpha1.Vk8s) (bool, error) {

	origin := vk8s.DeepCopy()
	allPodRunning := true
	vnodeList := vk8s.Spec.Nodes
	for _, vnode := range vnodeList {
		vnodeStatus, err := r.getVNodeStatus(ctx, vk8s.Namespace, vnode)
		if err != nil {
			return false, err
		}
		if _, ok := vk8s.Status.VNodeKubernetesSetupStatuses[vnode.Name]; !ok {
			vnodeStatus.IsKubernetesSetup = ""
		} else {
			vnodeStatus.IsKubernetesSetup = vk8s.Status.VNodeKubernetesSetupStatuses[vnode.Name].IsKubernetesSetup
		}
		vk8s.Status.VNodeKubernetesSetupStatuses[vnode.Name] = vnodeStatus
		if vnodeStatus.Status != RUNNING {
			allPodRunning = false
		}
	}
	if err := r.patchVk8s(ctx, origin, vk8s); err != nil {
		return false, err
	}
	return allPodRunning, nil
}

func (r *Vk8sReconciler) getVNodeStatus(
	ctx context.Context,
	namespace string,
	vnode vk8sv1alpha1.NodePod) (vk8sv1alpha1.VNodeStatus, error) {
	foundPo := &corev1.Pod{}
	podName := makePodName(vnode.Name)
	ret := vk8sv1alpha1.VNodeStatus{}
	err := r.Get(ctx, types.NamespacedName{Namespace: namespace, Name: podName}, foundPo)
	if err != nil {
		if apierrors.IsNotFound(err) {
			// wait 25 seconds for new statefulset creation
			err = backoff.Retry(
				func() error {
					return r.Get(ctx, types.NamespacedName{
						Namespace: namespace,
						Name:      podName},
						foundPo)
				},
				backoff.WithMaxRetries(backoff.NewConstantBackOff(5*time.Second), 5),
			)
			if err != nil {
				if apierrors.IsNotFound(err) {
					ret.Status = NOTFOUND
					ret.Message = fmt.Sprintf("pod %s is not found", podName)
					return ret, nil
				} else {
					log.Log.Error(err, "error on getting pod")
					return vk8sv1alpha1.VNodeStatus{}, err
				}
			}
		} else {
			log.Log.Error(err, "error on getting pod")
			return vk8sv1alpha1.VNodeStatus{}, err
		}
	}
	if len(foundPo.Status.ContainerStatuses) > 0 {
		currentState := foundPo.Status.ContainerStatuses[0].State
		if currentState.Running != nil {
			ret.Status = RUNNING
		} else if currentState.Waiting != nil {
			ret.Status = WAITING
			ret.Message = currentState.Waiting.Reason
		} else if currentState.Terminated != nil {
			ret.Status = TERMINATING
			ret.Message = currentState.Terminated.Reason
		} else {
			ret.Status = string(foundPo.Status.Phase)
			ret.Message = foundPo.Status.Message
		}
		if foundPo.DeletionTimestamp != nil {
			ret.Status = TERMINATING
			ret.Message = "pausing or deleting or get error"
		}
	} else {
		ret.Status = string(foundPo.Status.Phase)
		ret.Message = foundPo.Status.Message
	}
	return ret, nil
}

// getMasterVNode extract master pod's name. Also assume master pod is only one.
func getMasterVNode(nodes []vk8sv1alpha1.NodePod) vk8sv1alpha1.NodePod {
	for _, node := range nodes {
		if node.Role.IsMaster() {
			return node
		}
	}
	return vk8sv1alpha1.NodePod{}
}

func predVk8sIsLabeled() predicate.Funcs {
	checkVk8sLabel := func() func(object client.Object) bool {
		return func(object client.Object) bool {
			_, labelExists := object.GetLabels()["clusterName"]
			return labelExists
		}
	}
	return predicate.NewPredicateFuncs(checkVk8sLabel())
}

func predVk8sEvents(r *Vk8sReconciler) predicate.Funcs {
	checkEvent := func() func(object client.Object) bool {
		return func(object client.Object) bool {
			event := object.(*corev1.Event)
			vk8sName, err := vk8sNameFromInvolvedObject(r.Client, &event.InvolvedObject)
			if err != nil {
				return false
			}
			return isStsOrPodEvent(event) &&
				vk8sNameExists(r.Client, vk8sName, object.GetNamespace())
		}
	}

	predicates := predicate.NewPredicateFuncs(checkEvent())

	predicates.DeleteFunc = func(e event.DeleteEvent) bool {
		return false
	}
	return predicates
}

func vk8sNameExists(client client.Client, vk8sName string, namespace string) bool {
	if err := client.Get(
		context.Background(),
		types.NamespacedName{
			Namespace: namespace,
			Name:      vk8sName,
		},
		&v1alpha1.Vk8s{},
	); err != nil {
		return !apierrors.IsNotFound(err)
	}
	return true
}

func vk8sNameFromInvolvedObject(
	c client.Client,
	object *corev1.ObjectReference) (string, error) {
	name, namespace := object.Name, object.Namespace
	if object.Kind == "StatefulSet" {
		return name, nil
	}
	if object.Kind == "Pod" {
		pod := &corev1.Pod{}
		err := c.Get(
			context.TODO(),
			types.NamespacedName{
				Namespace: namespace,
				Name:      name,
			},
			pod,
		)
		if err != nil {
			return "", err
		}
		if vk8sName, ok := pod.Labels["clusterName"]; ok {
			return vk8sName, nil
		}
	}
	return "", fmt.Errorf("object isn't related to a Vk8s")
}

func isStsOrPodEvent(event *corev1.Event) bool {
	return event.InvolvedObject.Kind == "Pod" || event.InvolvedObject.Kind == "StatefulSet"
}

// SetupWithManager sets up the controller with the Manager.
func (r *Vk8sReconciler) SetupWithManager(mgr ctrl.Manager) error {
	// Map Function to convert pod events to reconciliation requests
	mapPodToRequest := func(object client.Object) []reconcile.Request {
		return []reconcile.Request{{
			NamespacedName: types.NamespacedName{
				Name:      object.GetLabels()["clusterName"],
				Namespace: object.GetNamespace(),
			},
		}}
	}

	mapEventToRequest := func(object client.Object) []reconcile.Request {
		return []reconcile.Request{{
			NamespacedName: types.NamespacedName{
				Name:      object.GetName(),
				Namespace: object.GetNamespace(),
			},
		}}
	}

	return ctrl.NewControllerManagedBy(mgr).
		For(&vk8sv1alpha1.Vk8s{}).
		Owns(&appsv1.StatefulSet{}).
		Owns(&corev1.Service{}).
		Watches(
			&source.Kind{Type: &corev1.Pod{}},
			handler.EnqueueRequestsFromMapFunc(mapPodToRequest),
			builder.WithPredicates(predVk8sIsLabeled())).
		Watches(
			&source.Kind{Type: &corev1.Event{}},
			handler.EnqueueRequestsFromMapFunc(mapEventToRequest),
			builder.WithPredicates(predVk8sEvents(r))).
		WithOptions(controller.Options{MaxConcurrentReconciles: 50}).
		Complete(r)
}
