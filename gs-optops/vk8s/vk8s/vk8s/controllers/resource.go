package controllers

import (
	"context"
	"fmt"
	"time"

	"gitlab.tde.sktelecom.com/SCALEBACK/vk8s/api/v1alpha1"
	"gitlab.tde.sktelecom.com/SCALEBACK/vk8s/typing"
	corev1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/types"
	"sigs.k8s.io/controller-runtime/pkg/log"
)

func (r *Vk8sReconciler) reserveVk8sResource(
	ctx context.Context,
	namespace string,
	vnodeList []v1alpha1.NodePod) error {

	allocatedHostMap, err := r.getVNodeAllocatedHostName(namespace, vnodeList)
	if err != nil {
		return err
	}
	for hostname, vnodes := range allocatedHostMap {
		node := &corev1.Node{}
		err = r.Get(
			context.TODO(),
			types.NamespacedName{Namespace: namespace, Name: hostname},
			node)
		if err != nil {
			log.Log.Error(err, "Failed to get node")
			return err
		}
		for _, vnode := range vnodes {
			vnodePodName := makePodName(vnode.Name)
			isReserved, err := r.isAlreadyReserved(ctx, namespace, vnodePodName)
			if err != nil {
				log.Log.Error(err, fmt.Sprintf("%s vnode is already reserved", vnodePodName))
				continue
			}
			cpuReserved, memReserved, err := r.calcReservedResource(*node, vnode)
			if err != nil {
				return err
			}
			if !isReserved {
				if err = r.reserveResource(
					ctx,
					namespace,
					vnodePodName,
					cpuReserved,
					memReserved); err != nil {
					return err
				}
			}
			if err = r.restartKubelet(ctx, namespace, vnodePodName); err != nil {
				return err
			}
			log.Log.Info(fmt.Sprintf("Reserve %s vnode Resource", vnode.Name))
		}
	}
	return nil
}

func (r *Vk8sReconciler) reserveResource(
	ctx context.Context,
	namespace string,
	podName string,
	cpuReserved int64,
	memReserved int64) error {
	result := make(chan typing.ExecResult)
	Gi := int64(1024 * 1024 * 1024)
	go r.exec(
		namespace,
		podName,
		[]string{"/bin/sh", "-c", fmt.Sprintf(
			`sed -i '$ a systemReserved:\n  cpu: "%d"\n  memory: %s' /var/lib/kubelet/config.yaml`,
			cpuReserved, fmt.Sprintf("%dGi", memReserved/Gi)),
		},
		result)
	_, _, err := selectExecResult(ctx, result)
	if err != nil {
		log.Log.Error(err, "Failed to write kubelet config")
	}
	return err
}

func (r *Vk8sReconciler) isAlreadyReserved(
	ctx context.Context,
	namespace string,
	podName string) (bool, error) {
	result := make(chan typing.ExecResult)
	go r.exec(
		namespace,
		podName,
		[]string{
			"/bin/sh",
			"-c",
			"grep -q systemReserved /var/lib/kubelet/config.yaml; echo $?",
		},
		result,
		true)
	isReserved, _, err := selectExecResult(ctx, result)
	if err != nil {
		log.Log.Error(err, "Failed to check resource reserved")
		return true, err
	}
	if isReserved == RESERVED {
		log.Log.Info(fmt.Sprintf("%s resource is already reserved", podName))
		return true, nil
	}
	return false, nil
}

func (r *Vk8sReconciler) restartKubelet(
	ctx context.Context,
	namespace string,
	podName string) error {
	result := make(chan typing.ExecResult)
	go r.exec(
		namespace,
		podName,
		[]string{"/bin/sh", "-c", "systemctl restart kubelet"},
		result)
	_, _, err := selectExecResult(ctx, result)
	if err != nil {
		log.Log.Error(err, "Failed to restart kubelet")
		return err
	}
	time.Sleep(500 * time.Millisecond)
	go r.exec(
		namespace,
		podName,
		[]string{
			"/bin/sh",
			"-c",
			`systemctl status kubelet | awk '$1 == "Active:" {print $2}'`},
		result,
		true)
	kubeletStatus, _, err := selectExecResult(ctx, result)
	if err != nil {
		log.Log.Error(err, "Failed to get kubelet status")
		return err
	}
	if kubeletStatus != KUBELET_ACTIVE {
		log.Log.Error(typing.ErrKubeletStatus, "Kubelet is unhealthy")
		return typing.ErrKubeletStatus
	}
	return nil
}

func (r *Vk8sReconciler) calcReservedResource(node corev1.Node, vnode v1alpha1.NodePod) (
	int64, int64, error) {
	capacity := node.Status.Capacity
	cpuCapacity, success := capacity.Cpu().AsInt64()
	if !success {
		log.Log.Error(typing.ErrResourceConvert, "failed to convert cpu capacity")
		return -1, -1, typing.ErrResourceConvert
	}
	memoryCapacity, success := capacity.Memory().AsInt64()
	if !success {
		log.Log.Error(typing.ErrResourceConvert, "failed to convert memory capacity")
		return -1, -1, typing.ErrResourceConvert
	}
	cpuLimit := vnode.Resources.Limits[corev1.ResourceCPU]
	memoryLimit := vnode.Resources.Limits[corev1.ResourceMemory]
	cpuLimitVal, success := cpuLimit.AsInt64()
	if !success {
		log.Log.Error(typing.ErrResourceConvert, "failed to convert cpu limit")
		return -1, -1, typing.ErrResourceConvert
	}
	memoryLimitVal, success := memoryLimit.AsInt64()
	if !success {
		log.Log.Error(typing.ErrResourceConvert, "failed to convert memory limit")
		return -1, -1, typing.ErrResourceConvert
	}
	cpuReserved := cpuCapacity - cpuLimitVal
	memReserved := memoryCapacity - memoryLimitVal
	return cpuReserved, memReserved, nil
}

func (r *Vk8sReconciler) getVNodeAllocatedHostName(namespace string,
	vnodeList []v1alpha1.NodePod) (map[string][]v1alpha1.NodePod, error) {
	ret := make(map[string][]v1alpha1.NodePod)
	for _, vnode := range vnodeList {
		po := &corev1.Pod{}
		err := r.Get(context.TODO(), types.NamespacedName{Namespace: namespace,
			Name: makePodName(vnode.Name)}, po)
		if err != nil {
			log.Log.Error(err, "Failed to get vnode pod")
			return nil, err
		}
		ret[po.Spec.NodeName] = append(ret[po.Spec.NodeName], vnode)
	}
	return ret, nil
}
