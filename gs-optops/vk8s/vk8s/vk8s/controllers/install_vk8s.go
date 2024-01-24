package controllers

import (
	"context"
	"fmt"
	"os"
	"reflect"
	"regexp"
	"strconv"
	"strings"
	"time"

	"gitlab.tde.sktelecom.com/SCALEBACK/vk8s/api/v1alpha1"
	"gitlab.tde.sktelecom.com/SCALEBACK/vk8s/typing"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	ctrl "sigs.k8s.io/controller-runtime"
	"sigs.k8s.io/controller-runtime/pkg/log"
)

func (r *Vk8sReconciler) InstallVk8s(
	ctx context.Context,
	vk8s *v1alpha1.Vk8s,
	vnodes []v1alpha1.NodePod,
	masterVNode v1alpha1.NodePod) (
	ctrl.Result, error) {

	masterPodName := makePodName(masterVNode.Name)
	// Setup Master VNode
	masterVnodeStatus, ok := vk8s.Status.VNodeKubernetesSetupStatuses[masterVNode.Name]
	if masterVnodeStatus.Status != RUNNING {
		return ctrl.Result{Requeue: true}, nil
	}
	if ok && masterVnodeStatus.IsKubernetesSetup == "" {
		if updateErr := r.updateVk8sPhase(ctx,
			vk8s,
			VK8S_INSTALLING,
			"configuring master node"); updateErr != nil {
			return ctrl.Result{}, updateErr
		}
		err := r.init(ctx, vk8s.Namespace, masterPodName)
		if err != nil {
			if updateErr := r.updateVk8sPhase(
				ctx,
				vk8s,
				VK8S_FAIL,
				fmt.Sprintf("error on configuring master node %s", masterVNode.Name)); updateErr != nil {
				return ctrl.Result{}, updateErr
			}
			masterVnodeStatus.IsKubernetesSetup = FAILED
			if updateErr := r.updateKubernetesSetup(
				ctx,
				vk8s,
				masterVNode.Name,
				&masterVnodeStatus); updateErr != nil {
				return ctrl.Result{}, updateErr
			}
			return ctrl.Result{}, err
		}
		err = r.initVirtualKubernetes(ctx, vk8s, masterPodName)
		if err != nil {
			if updateErr := r.updateVk8sPhase(
				ctx,
				vk8s,
				VK8S_FAIL,
				"error on initializing kubernetes"); updateErr != nil {
				return ctrl.Result{}, updateErr
			}
			masterVnodeStatus.IsKubernetesSetup = FAILED
			if updateErr := r.updateKubernetesSetup(
				ctx,
				vk8s,
				masterVNode.Name,
				&masterVnodeStatus); updateErr != nil {
				return ctrl.Result{}, updateErr
			}
			return ctrl.Result{}, err
		}
	}

	// vk8s가 성공 혹은 실패 했을 때 또 다시 시도하지 않도록 하기 위한 조건
	// masterVnodeStatus := vk8s.Status.VNodeKubernetesSetupStatuses[masterVNode.Name]
	// Setup Worker VNodes
	for _, vnode := range vnodes {
		if vnode.Role.IsMaster() {
			continue
		}
		vnodeStatus, ok := vk8s.Status.VNodeKubernetesSetupStatuses[vnode.Name]
		if !ok || vnodeStatus.IsKubernetesSetup == SUCCESS || vnodeStatus.Status != RUNNING {
			continue
		}
		if masterVnodeStatus.IsKubernetesSetup != "" {
			log.Log.Info(fmt.Sprintf("%s cluster is already setup or failed", vk8s.Name))
			continue
		}
		if updateErr := r.updateVk8sPhase(
			ctx,
			vk8s,
			VK8S_INSTALLING,
			"configuring worker node"); updateErr != nil {
			return ctrl.Result{}, updateErr
		}
		podName := makePodName(vnode.Name)
		err := r.init(ctx, vk8s.Namespace, podName)
		if err != nil {
			if updateErr := r.updateVk8sPhase(
				ctx,
				vk8s,
				VK8S_FAIL,
				fmt.Sprintf("error on configuring worker node %s", vnode.Name)); updateErr != nil {
				return ctrl.Result{}, updateErr
			}
			vnodeStatus.IsKubernetesSetup = FAILED
			if updateErr := r.updateKubernetesSetup(
				ctx,
				vk8s,
				vnode.Name,
				&vnodeStatus); updateErr != nil {
				return ctrl.Result{}, updateErr
			}
			return ctrl.Result{}, err
		}
		// if err := r.updateVk8sPhase(ctx, vk8s, JOINING, ""); err != nil {
		// 	return ctrl.Result{}, err
		// }
		err = r.joinKubernetes(ctx, masterPodName, vk8s.Namespace, podName)
		if err != nil {
			if updateErr := r.updateVk8sPhase(
				ctx,
				vk8s,
				VK8S_FAIL,
				fmt.Sprintf("error on joining worker node %s to kubernetes", vnode.Name)); updateErr != nil {
				return ctrl.Result{}, updateErr
			}
			vnodeStatus.IsKubernetesSetup = FAILED
			if updateErr := r.updateKubernetesSetup(
				ctx,
				vk8s,
				vnode.Name,
				&vnodeStatus); updateErr != nil {
				return ctrl.Result{}, updateErr
			}
			return ctrl.Result{}, err
		}
		vnodeStatus.IsKubernetesSetup = SUCCESS
		if updateErr := r.updateKubernetesSetup(
			ctx,
			vk8s,
			vnode.Name,
			&vnodeStatus); updateErr != nil {
			return ctrl.Result{}, err
		}
		// vk8s.Status.VNodeKubernetesSetupStatuses[vnode.Name] = vnodeStatus
		// if err := r.Status().Update(ctx, vk8s); err != nil {
		// 	log.Log.Error(err, "error on updating vk8s")
		// }
	}

	return ctrl.Result{}, nil
}

func (r *Vk8sReconciler) ConfigureVk8s(
	ctx context.Context,
	vk8s *v1alpha1.Vk8s,
	vnodes []v1alpha1.NodePod,
	masterVNode v1alpha1.NodePod,
	accessPodName string,
	isAccessPodExists bool,
	isSingle bool) (
	ctrl.Result, error) {

	isKubeflow := !reflect.DeepEqual(vk8s.Spec.Kubeflow, v1alpha1.KubeflowSpec{})
	masterPodName := makePodName(masterVNode.Name)
	// execute below logic if and only if initial setting
	if vk8s.Status.VNodeKubernetesSetupStatuses[masterVNode.Name].IsKubernetesSetup == "" {
		// Check vk8s is available
		if isAccessPodExists {
			err := r.makeKubeConfigInAccessPod(ctx, vk8s, masterPodName, accessPodName)
			if err != nil {
				if updateErr := r.updateVk8sPhase(
					ctx,
					vk8s,
					VK8S_FAIL,
					"error on configuring ssh"); updateErr != nil {
					return ctrl.Result{}, updateErr
				}
				return ctrl.Result{}, err
			}
		}
		err := r.labelNodes(ctx, vk8s.Namespace, masterPodName)
		if err != nil {
			if updateErr := r.updateVk8sPhase(
				ctx,
				vk8s,
				VK8S_FAIL,
				"error on configuring kubernetes"); updateErr != nil {
				return ctrl.Result{}, updateErr
			}
			return ctrl.Result{}, err
		}
		// enable internet
		// log.Log.Info(fmt.Sprintf("[%s] Checking external internet...", vk8s.Name))
		// err = r.checkInternet(ctx, vk8s.Namespace, masterPodName)
		// if err != nil {
		// 	if updateErr := r.updateVk8sPhase(
		// 		ctx,
		// 		vk8s,
		// 		VK8S_FAIL,
		// 		"error on checking internet of kubernetes"); updateErr != nil {
		// 		return ctrl.Result{}, updateErr
		// 	}
		// 	return ctrl.Result{}, err
		// }
		// taint if multi node cluster
		if !isSingle {
			err = r.taintMasterNode(ctx, vk8s.Namespace, masterPodName)
			if err != nil {
				if updateErr := r.updateVk8sPhase(
					ctx,
					vk8s,
					VK8S_FAIL,
					"error on configuring multi node cluster"); updateErr != nil {
					return ctrl.Result{}, updateErr
				}
				return ctrl.Result{}, err
			}
		}

		if isKubeflow {
			// if err := r.updateVk8sPhase(ctx, vk8s, KUBEFLOW_INITIALIZING, ""); err != nil {
			// 	return ctrl.Result{}, err
			// }
			kubeflowPort := getKubeflowPort(vk8s.Spec.Ports)
			if kubeflowPort < 0 {
				return ctrl.Result{}, typing.ErrKubeflowPort
			}
			if updateErr := r.updateVk8sPhase(ctx,
				vk8s,
				VK8S_INSTALLING,
				"installing kubeflow"); updateErr != nil {
				return ctrl.Result{}, updateErr
			}
			rxp, _ := regexp.Compile("v[0-9].[0-9]+")
			k8sVersion, _ := strconv.Atoi(strings.Split(rxp.FindString(vk8s.Spec.Nodes[0].Image), ".")[1])
			// config kube apiserver for istio SDS
			if k8sVersion < 20 {
				err = r.configApiServer(ctx, vk8s.Namespace, masterPodName)
				if err != nil {
					if updateErr := r.updateVk8sPhase(
						ctx,
						vk8s,
						VK8S_FAIL,
						"error on installing kubeflow"); updateErr != nil {
						return ctrl.Result{}, updateErr
					}
					return ctrl.Result{}, err
				}
			}
			err = r.installKubeflow(
				ctx,
				vk8s.Namespace,
				masterPodName,
				vk8s.Spec.Kubeflow.Version,
				int(kubeflowPort),
				vk8s.Spec.Kubeflow.Email,
				vk8s.Spec.Kubeflow.Password)
			if err != nil {
				if updateErr := r.updateVk8sPhase(
					ctx,
					vk8s,
					VK8S_FAIL,
					"error on installing kubeflow"); updateErr != nil {
					return ctrl.Result{}, updateErr
				}
				return ctrl.Result{}, err
			}
		}
		err = r.reserveVk8sResource(ctx, vk8s.Namespace, vnodes)
		if err != nil {
			if updateErr := r.updateVk8sPhase(
				ctx,
				vk8s,
				VK8S_FAIL,
				"error on allocating resource"); updateErr != nil {
				return ctrl.Result{}, updateErr
			}
			return ctrl.Result{}, err
		}
		// 모든 설정이 끝나야 master의 k8s setup이 끝났다고 간주
		masterVnodeStatus, _ := vk8s.Status.VNodeKubernetesSetupStatuses[masterVNode.Name]
		masterVnodeStatus.IsKubernetesSetup = SUCCESS

		if updateErr := r.updateKubernetesSetup(
			ctx,
			vk8s,
			masterVNode.Name,
			&masterVnodeStatus); updateErr != nil {
			log.Log.Error(updateErr, "failed to update k8s setup status")
			return ctrl.Result{}, updateErr
		}
	}
	if vk8s.Status.Phase != VK8S_RUNNING {
		if isKubeflow {
			result, err := r.checkRunningState(ctx, vk8s.Namespace, masterPodName)
			if err != nil {
				if updateErr := r.updateVk8sPhase(
					ctx,
					vk8s,
					VK8S_FAIL,
					"error on checking kubeflow state"); updateErr != nil {
					return ctrl.Result{}, updateErr
				}
				return ctrl.Result{}, err
			}
			if result == "False" {
				log.Log.Info(fmt.Sprintf("[%s] kubeflow is not ready", vk8s.Name))
				return ctrl.Result{RequeueAfter: 30 * time.Second}, nil
			}
		}
		if vk8s.Status.Phase != VK8S_FAIL {
			if updateErr := r.updateVk8sPhase(
				ctx,
				vk8s,
				VK8S_RUNNING,
				"Running"); updateErr != nil {
				return ctrl.Result{}, updateErr
			}
		}
	}
	return ctrl.Result{}, nil
}

// initVirtualKubernetes initialize virtual kubernetes
func (r *Vk8sReconciler) initVirtualKubernetes(
	ctx context.Context,
	v *v1alpha1.Vk8s,
	podName string) error {
	log.Log.Info(fmt.Sprintf("[%s] Init Kubernetes in master node...", v.Name))
	podNetworkCidr, serviceCidr := getKubernetesOption(v.Spec.Kubernetes)
	result := make(chan typing.ExecResult)
	go r.exec(
		v.Namespace,
		podName,
		[]string{INITKUBERNETES, podNetworkCidr, serviceCidr},
		result)
	_, _, err := selectExecResult(ctx, result)
	if err != nil {
		return err
	}
	go r.exec(
		v.Namespace,
		podName,
		[]string{"/bin/sh", "-c",
			"kubectl taint nodes --all node-role.kubernetes.io/master-"},
		result)
	_, _, err = selectExecResult(ctx, result)
	if err != nil {
		return err
	}
	go r.exec(
		v.Namespace,
		podName,
		[]string{"/bin/sh", "-c",
			fmt.Sprintf("kubectl label nodes %s role=master", podName)},
		result)
	_, _, err = selectExecResult(ctx, result)
	if err != nil {
		return err
	}
	return nil
}

// init inits master pod for virtual kubernetes
func (r *Vk8sReconciler) init(ctx context.Context, namespace string, podName string) error {
	result := make(chan typing.ExecResult)
	go r.exec(namespace, podName, []string{INIT}, result)
	_, _, err := selectExecResult(ctx, result)
	if err != nil {
		return err
	}
	return nil
}

// joinKubernetes join worker pods to virtual kubernetes
func (r *Vk8sReconciler) joinKubernetes(
	ctx context.Context,
	masterPodName string,
	namespace string,
	podName string) error {
	kubeJoinCmd, err := r.getKubeJoinCmd(ctx, namespace, masterPodName)
	if err != nil {
		return err
	}
	kubeJoinCmd = strings.Join([]string{kubeJoinCmd, "--skip-phases=preflight"}, " ")
	log.Log.Info(kubeJoinCmd)
	result := make(chan typing.ExecResult)
	go r.exec(
		namespace,
		podName,
		[]string{"/bin/sh", "-c", kubeJoinCmd},
		result)
	_, _, err = selectExecResult(ctx, result)
	if err != nil {
		return err
	}
	return nil
}

// getKubeJoinCmd create new k8s token and get join command
func (r *Vk8sReconciler) getKubeJoinCmd(
	ctx context.Context,
	namespace string,
	podName string) (string, error) {
	var joinCmd string
	result := make(chan typing.ExecResult)
	go r.exec(
		namespace,
		podName,
		[]string{"/bin/sh", "-c", "kubeadm token create --print-join-command"},
		result,
		true)
	stdout, stderr, err := selectExecResult(ctx, result)
	if err != nil {
		log.Log.Error(err, stderr)
		joinCmd = stderr
	} else {
		joinCmd = stdout
	}
	return joinCmd, err
}

// makeKubeConfigInAccessPod copy & paste kubeconfig to access pod
func (r *Vk8sReconciler) makeKubeConfigInAccessPod(
	ctx context.Context,
	v *v1alpha1.Vk8s,
	masterPodName string,
	accessPodName string) error {
	result := make(chan typing.ExecResult)
	go r.exec(
		v.Namespace,
		masterPodName,
		[]string{"/bin/sh", "-c", "cat /etc/kubernetes/admin.conf"},
		result,
		true)
	stdout, _, err := selectExecResult(ctx, result)
	if err != nil {
		log.Log.Error(err, "Failed to get kubeconfig")
		return err
	} else {
		go r.exec(
			v.Namespace,
			accessPodName,
			[]string{"/bin/sh", "-c",
				fmt.Sprintf(`mkdir -p ~/.kube && echo "%s" > ~/.kube/config`,
					stdout)},
			result)
		_, _, err = selectExecResult(ctx, result)
		if err != nil {
			log.Log.Error(err, "Failed to create kubeconfig")
		}
		return err
	}
}

// labelNodes label virtual k8s nodes for masq-agent
func (r *Vk8sReconciler) labelNodes(
	ctx context.Context,
	namespace string,
	podName string) error {
	result := make(chan typing.ExecResult)
	labelCmd := "for node in $(kubectl get no -o=jsonpath='{.items[*].metadata.name}'); do kubectl label nodes $node beta.kubernetes.io/masq-agent-ds-ready=true; done"
	go r.exec(namespace, podName, []string{"/bin/sh", "-c", labelCmd}, result)
	_, _, err := selectExecResult(ctx, result)
	return err
}

// checkInternet connect to external internet right after virtual k8s is up
func (r *Vk8sReconciler) checkInternet(
	ctx context.Context,
	namespace string,
	masterPodName string) error {
	result := make(chan typing.ExecResult)
	go r.exec(namespace, masterPodName, []string{"./setting-internet.sh"}, result)
	_, _, err := selectExecResult(ctx, result)
	return err
}

// taintMasterNode taint master virtual node when multi cluster
func (r *Vk8sReconciler) taintMasterNode(
	ctx context.Context,
	namespace string,
	podName string) error {
	result := make(chan typing.ExecResult)
	go r.exec(
		namespace,
		podName,
		[]string{"/bin/sh", "-c",
			fmt.Sprintf("kubectl taint node %s node-role.kubernetes.io/master:NoSchedule", podName)},
		result)
	_, _, err := selectExecResult(ctx, result)
	return err
}

// installKubeflow install latest kubeflow
func (r *Vk8sReconciler) installKubeflow(
	ctx context.Context,
	namespace string,
	podName string,
	kubeflowVersion string,
	kubeflowPort int,
	email string,
	password string) error {
	result := make(chan typing.ExecResult)
	reg, _ := regexp.Compile("v[0-9].[0-9].[0-9]")
	if reg.MatchString(kubeflowVersion) {
		go r.exec(
			namespace,
			podName,
			[]string{"/bin/sh", "-c",
				strings.Join([]string{
					INSTALLKUBEFLOW,
					kubeflowVersion,
					os.Getenv("REGISTRY"),
					strconv.Itoa(kubeflowPort),
					email,
					fmt.Sprintf("'%s'", password)}, " ")},
			result)
		_, _, err := selectExecResult(ctx, result)
		return err
	} else {
		log.Log.Error(typing.ErrKubeflowVersion, "Mismatch format of kubeflow version. Ex) v1.3.1")
		return typing.ErrKubeflowVersion
	}
}

// checkRunningState check kubeflow is ready
func (r *Vk8sReconciler) checkRunningState(
	ctx context.Context,
	namespace string,
	podName string) (string, error) {
	result := make(chan typing.ExecResult)
	cmd := "./check-running-state.sh"
	go r.exec(namespace, podName, []string{"/bin/sh", "-c", cmd}, result, true)
	stdout, stderr, err := selectExecResult(ctx, result)
	if err != nil {
		log.Log.Error(err, stderr)
		return stderr, err
	}
	return stdout, nil
}

// getKubeflowPort get kubflow port from port named "kubeflow"
func getKubeflowPort(ports []corev1.ServicePort) int {
	for _, port := range ports {
		if port.Name == "kubeflow" {
			return int(port.TargetPort.IntVal)
		}
	}
	return -1
}

func (r *Vk8sReconciler) configApiServer(
	ctx context.Context,
	namespace string,
	podName string) error {

	result := make(chan typing.ExecResult)
	cmd := `sed -i 's/--secure-port=6443/--secure-port=6443\n    - --service-account-signing-key-file=\/etc\/kubernetes\/pki\/sa.key\n    - --service-account-issuer=kubernetes.default.svc/' /etc/kubernetes/manifests/kube-apiserver.yaml`
	go r.exec(namespace, podName, []string{"/bin/bash", "-c", cmd}, result)
	_, _, err := selectExecResult(ctx, result)
	return err
}

func (r *Vk8sReconciler) updateKubernetesSetup(
	ctx context.Context,
	vk8s *v1alpha1.Vk8s,
	vnodeName string,
	vnodeStatus *v1alpha1.VNodeStatus) error {

	origin := vk8s.DeepCopy()
	vk8s.Status.VNodeKubernetesSetupStatuses[vnodeName] = *vnodeStatus
	return r.patchVk8s(ctx, origin, vk8s)
}

// getKubernetesOption get kubeadm init option
func getKubernetesOption(k8s v1alpha1.KubernetesSpec) (string, string) {
	emptyK8s := v1alpha1.KubernetesSpec{}
	var podNetwowrkCidr, serviceCidr string
	if k8s == emptyK8s {
		podNetwowrkCidr = POD_NETWORK_CIDR
		serviceCidr = SERVICE_CIDR
	} else if k8s.PodNetworkCidr == "" {
		podNetwowrkCidr = POD_NETWORK_CIDR
		serviceCidr = k8s.ServiceCidr
	} else if k8s.ServiceCidr == "" {
		podNetwowrkCidr = k8s.PodNetworkCidr
		serviceCidr = SERVICE_CIDR
	} else {
		podNetwowrkCidr = k8s.PodNetworkCidr
		serviceCidr = k8s.ServiceCidr
	}
	return podNetwowrkCidr, serviceCidr
}

// makeContainerPort make container port list
func makeContainerPort(node v1alpha1.NodePod, ports []corev1.ServicePort) (
	containerPort []corev1.ContainerPort, err error) {

	if err != nil {
		return nil, err
	}
	for i, port := range ports {
		containerPort = append(containerPort, corev1.ContainerPort{
			ContainerPort: port.TargetPort.IntVal,
			Name:          fmt.Sprintf("service-%d", i),
		})
	}
	return containerPort, nil
}

// isStopAnnotationSet check whether vk8s stop annotations is set
func isStopAnnotationSet(meta metav1.ObjectMeta) bool {
	if meta.GetAnnotations() == nil {
		return false
	}

	if _, ok := meta.GetAnnotations()[STOP_ANNOTATION]; ok {
		return true
	} else {
		return false
	}
}
