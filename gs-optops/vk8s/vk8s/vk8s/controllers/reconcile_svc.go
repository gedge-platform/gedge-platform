package controllers

import (
	"context"

	"gitlab.tde.sktelecom.com/SCALEBACK/vk8s/api/v1alpha1"
	corev1 "k8s.io/api/core/v1"
	apierrors "k8s.io/apimachinery/pkg/api/errors"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/types"
	ctrl "sigs.k8s.io/controller-runtime"
	"sigs.k8s.io/controller-runtime/pkg/controller/controllerutil"
	"sigs.k8s.io/controller-runtime/pkg/log"
)

func (r *Vk8sReconciler) ReconcileSvc(ctx context.Context, vk8s *v1alpha1.Vk8s) (ctrl.Result, error) {
	svc, err := generateService(vk8s)
	if err != nil {
		return ctrl.Result{}, err
	}
	if svc == nil {
		return ctrl.Result{}, nil
	}
	if err := controllerutil.SetControllerReference(vk8s, svc, r.Scheme); err != nil {
		return ctrl.Result{}, err
	}
	foundSvc := &corev1.Service{}
	err = r.Get(ctx, types.NamespacedName{
		Namespace: svc.Namespace,
		Name:      svc.Name},
		foundSvc,
	)
	if err != nil {
		if apierrors.IsNotFound(err) {
			// Create Service
			log.Log.Info("Creating VNode Service: " + svc.Name)
			err = r.Create(ctx, svc)
			if err != nil {
				log.Log.Error(err, "error creating service")
				return ctrl.Result{}, err
			}
		} else {
			log.Log.Error(err, "error getting service")
			return ctrl.Result{}, err
		}
	} else {
		// Update Service
		if copyServiceFields(svc, foundSvc) {
			log.Log.Info("Updating service", "namespace", svc.Namespace, "name", svc.Name)
			err = r.Update(ctx, foundSvc)
			if err != nil {
				log.Log.Error(err, "error updating service")
				return ctrl.Result{}, err
			}
		}
	}
	return ctrl.Result{}, nil
}

// generateService generate vnode service object
func generateService(v *v1alpha1.Vk8s) (*corev1.Service, error) {
	ports := v.Spec.Ports
	if len(ports) == 0 {
		// log.Log.Error(typing.ErrEmptyService, "error defining service")
		// return &corev1.Service{}, typing.ErrEmptyService
		// log.Log.Info("No Service Defined...")
		return nil, nil
	}
	svc := &corev1.Service{
		ObjectMeta: metav1.ObjectMeta{
			Name:      v.Name,
			Namespace: v.Namespace,
		},
		Spec: corev1.ServiceSpec{
			Selector: map[string]string{
				"clusterName": v.Name,
			},
			Type:  corev1.ServiceTypeNodePort,
			Ports: ports,
		},
	}
	return svc, nil
}
