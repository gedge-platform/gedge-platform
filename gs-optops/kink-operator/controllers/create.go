package controllers

import (
	"context"
	"fmt"
	"strconv"
	"strings"

	odkv1alpha1 "gitlab.com/dudaji/odk/api/v1alpha1"
	corev1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/api/errors"
	"k8s.io/apimachinery/pkg/api/resource"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/types"
	"k8s.io/apimachinery/pkg/util/intstr"
	"sigs.k8s.io/controller-runtime/pkg/controller/controllerutil"
	"sigs.k8s.io/controller-runtime/pkg/log"
)

// createInnerKubernetes creates node pods and execute scripts for install inner kubernetes.
func (r *MaterReconciler) createInnerKubernetes(m odkv1alpha1.Mater) {
	err := r.createIfNotPresent(&m, m.Spec.Nodes)
	if err != nil {
		log.Log.Error(err, fmt.Sprintf("[%s] Failed to create Innter Kubernetes. Delete %s mater object", m.Name, m.Name))
		deleteErr := r.Delete(context.TODO(), &m)
		if deleteErr != nil {
			log.Log.Error(deleteErr, fmt.Sprintf("[%s] Failed to delete %s mater object", m.Name, m.Name))
		}
		// errCh <- err
	} else {
		log.Log.Info(fmt.Sprintf("[%s] Successfully install inner kubernetes", m.Name))
	}
	// errCh <- nil
}

// createIfNotPresent creates node pods if not present. If present, skip all steps.
func (r *MaterReconciler) createIfNotPresent(m *odkv1alpha1.Mater, nodes []odkv1alpha1.NodePod) error {
	masterPodName := extractMasterPodName(nodes)
	for idx, node := range nodes {
		found := &corev1.Pod{}
		err := r.Get(context.TODO(), types.NamespacedName{Namespace: m.Namespace, Name: node.Name}, found)
		// create node pod
		if err != nil && errors.IsNotFound(err) {
			po := r.getNodePodSpec(m, node)
			log.Log.Info("Creating a new Pod", "Pod.Namespace", po.Namespace, "Pod.Name", po.Name)
			err = r.Create(context.TODO(), po)
			if err != nil {
				log.Log.Error(err, fmt.Sprintf("[%s] Failed to create %s Pod", m.Name, node.Name))
				return err
			}
			// create master pod
			// assume there is only one master pod
			if node.Role == MASTER {
				svc := r.getNodePortSpec(m)
				err := r.Create(context.TODO(), svc)
				if err != nil {
					log.Log.Error(err, fmt.Sprintf("[%s] Failed to create service", m.Name))
					return err
				}
				// init master pod
				log.Log.Info(fmt.Sprintf("[%s] Init Master pod...", m.Name))
				err = r.init(m.Namespace, node.Name)
				if err != nil {
					return err
				}
				// init kubernetes
				log.Log.Info(fmt.Sprintf("[%s] Init Kubernetes in master node...", m.Name))
				err = r.initKubernetes(m.Namespace, node.Name)
				if err != nil {
					return err
				}
			} else if node.Role == WORKER { // create worker pod
				err := r.joinKubernetes(masterPodName, m.Namespace, node.Name)
				if err != nil {
					return err
				}
				// after all worker pods are joined
				if idx == len(nodes)-1 {
					// label nodes for ip-masq-agent
					err := r.labelNodes(m.Namespace, masterPodName)
					if err != nil {
						return err
					}
					// enable internet
					log.Log.Info(fmt.Sprintf("[%s] Setting external internet...", m.Name))
					err = r.checkInternet(m.Namespace, masterPodName)
					if err != nil {
						return err
					}
					// install kubeflow
					if m.Spec.Kubeflow {
						log.Log.Info(fmt.Sprintf("[%s] Installing Kubeflow...", m.Name))
						err = r.installKubeflow(m, masterPodName)
						if err != nil {
							return err
						}
					}
				}
			}
		} else if err != nil { // 파드를 가지고 오는 과정에서 에러 발생
			log.Log.Error(err, fmt.Sprintf("[%s] Failed to get Pod", m.Name))
			return err
		}
	}

	return nil
}

// extractMasterPodName extract master pod's name. ALso assume master pod is only one.
func extractMasterPodName(nodes []odkv1alpha1.NodePod) string {
	for _, node := range nodes {
		if node.Role == MASTER {
			return node.Name
		}
	}
	return ""
}

// getNodePodSpec make pod yaml based on request
func (r *MaterReconciler) getNodePodSpec(m *odkv1alpha1.Mater, node odkv1alpha1.NodePod) *corev1.Pod {
	ls := labelsForMater(m.Name)
	containerPort, requests, limits := makeSpecByRole(node, m.Spec.BrowserPort, ls)
	privileged := true
	po := &corev1.Pod{
		ObjectMeta: metav1.ObjectMeta{
			Name:      node.Name,
			Namespace: m.Namespace,
			Labels:    ls,
		},
		Spec: corev1.PodSpec{
			Containers: []corev1.Container{{
				Image: node.Image,
				Name:  CONTAINERNAME,
				Ports: containerPort,
				Env: []corev1.EnvVar{{
					Name:  "KUBE_NODE_TYPE",
					Value: "INNER",
				}},
				SecurityContext: &corev1.SecurityContext{
					Privileged: &privileged,
				},
				VolumeMounts: []corev1.VolumeMount{{
					Name:      "lib-modules",
					MountPath: MODULEPATH,
				}, {
					Name:      "usr-src",
					MountPath: SRCPATH,
				}},
				Resources: corev1.ResourceRequirements{
					Requests: requests,
					Limits:   limits,
				},
			}},
			Volumes: []corev1.Volume{{
				Name: "lib-modules",
				VolumeSource: corev1.VolumeSource{
					HostPath: &corev1.HostPathVolumeSource{
						Path: MODULEPATH,
					},
				},
			}, {
				Name: "usr-src",
				VolumeSource: corev1.VolumeSource{
					HostPath: &corev1.HostPathVolumeSource{
						Path: SRCPATH,
					},
				},
			}},
		},
	}
	controllerutil.SetControllerReference(m, po, r.Scheme)
	return po
}

// makeSpecByRole make different label by role.
func makeSpecByRole(node odkv1alpha1.NodePod, port int32, label map[string]string) (
	containerPort []corev1.ContainerPort, requests corev1.ResourceList, limits corev1.ResourceList) {

	if node.Role == MASTER {
		label["role"] = MASTER
	}
	containerPort = append(containerPort, corev1.ContainerPort{
		ContainerPort: port,
		Name:          "browser",
	})
	requests = makeResourceMap(&node.Resources.Requests)
	limits = makeResourceMap(&node.Resources.Limits)
	return containerPort, requests, limits
}

// makeResourceMap make resource struct based on mater
func makeResourceMap(resources *odkv1alpha1.Resource) corev1.ResourceList {
	ret := make(corev1.ResourceList)
	if resources.CPU != "" {
		ret["cpu"] = resource.MustParse(resources.CPU)
	}
	if resources.MEM != "" {
		ret["memory"] = resource.MustParse(resources.MEM)
	}
	if resources.GPU != 0 {
		ret["nvidia.com/gpu"] = *resource.NewQuantity(resources.GPU, resource.DecimalSI)
	}
	return ret
}

// getNodePortSpec make NodePort Resource yaml
func (r *MaterReconciler) getNodePortSpec(m *odkv1alpha1.Mater) *corev1.Service {
	svc := &corev1.Service{
		ObjectMeta: metav1.ObjectMeta{
			Name:      m.Name,
			Namespace: m.Namespace,
		},
		Spec: corev1.ServiceSpec{
			Selector: map[string]string{
				"clusterName": m.Name,
			},
			Type: corev1.ServiceTypeNodePort,
			Ports: []corev1.ServicePort{{
				Protocol:   "TCP",
				Port:       m.Spec.BrowserPort,
				TargetPort: intstr.FromInt(int(m.Spec.BrowserPort)),
				NodePort:   m.Spec.BrowserPort,
			}},
		},
	}
	controllerutil.SetControllerReference(m, svc, r.Scheme)
	return svc
}

// init inits master pod for inner kubernetes
func (r *MaterReconciler) init(namespace string, podName string) error {
	if _, _, err := r.exec(namespace, podName, []string{INIT}); err != nil {
		log.Log.Error(err, "Failed to init kubernetes")
		return err
	}
	return nil
}

// initKubernetes init inner kubernetes in master pod
func (r *MaterReconciler) initKubernetes(namespace string, podName string) error {
	if _, _, err := r.exec(namespace, podName, []string{INITKUBERNETES}); err != nil {
		log.Log.Error(err, "Failed to init kubernetes")
		return err
	}
	if _, _, err := r.exec(namespace, podName, []string{"/bin/sh", "-c", "kubectl taint nodes --all node-role.kubernetes.io/master-"}); err != nil {
		log.Log.Error(err, "Failed to untaint master node")
		return err
	}
	if _, _, err := r.exec(namespace, podName, []string{"/bin/sh", "-c", fmt.Sprintf("kubectl label nodes %s role=master", podName)}); err != nil {
		log.Log.Error(err, "Failed to label master node")
		return err
	}
	return nil
}

// joinKubernetes join worker pods to inner kubernetes
func (r *MaterReconciler) joinKubernetes(masterPodName string, namespace string, podName string) error {
	// token, err := r.getKubeadmToken(namespace, masterPodName)
	// if err != nil {
	// 	return err
	// }
	// masterIP, err := r.getMasterIP(namespace, masterPodName)
	// if err != nil {
	// 	return err
	// }
	// sha, err := r.getKubeadmSha(namespace, masterPodName)
	// if err != nil {
	// 	return err
	// }
	// kubeJoin := fmt.Sprintf("kubeadm join %s:6443 --token %s --discovery-token-ca-cert-hash sha256:%s", masterIP, token, sha)
	kubeJoinCmd, err := r.getKubeJoinCmd(namespace, masterPodName)
	if err != nil {
		return err
	}
	log.Log.Info(kubeJoinCmd)
	if _, _, err := r.exec(namespace, podName, []string{"/bin/sh", "-c", kubeJoinCmd}); err != nil {
		log.Log.Error(err, "Failed to join kubernetes")
		return err
	}
	return nil
}

// getKubeJoinCmd create new k8s token and get join command
func (r *MaterReconciler) getKubeJoinCmd(namespace string, podName string) (string, error) {
	var cmd string
	if stdout, _, err := r.exec(namespace, podName, []string{"/bin/sh", "-c", "kubeadm token create --print-join-command"}, true); err != nil {
		log.Log.Error(err, "Failed to create inner k8s token")
		return "", err
	} else {
		cmd = stdout
	}
	return cmd, nil
}

// Deprecated getKubeadmToken get inner k8s existing token
func (r *MaterReconciler) getKubeadmToken(namespace string, podName string) (string, error) {
	var token string
	if stdout, stderr, err := r.exec(namespace, podName, []string{"/bin/sh", "-c", "kubeadm token list -o json | jq -r '.token'"}, true); err != nil {
		log.Log.Error(err, "Failed to exec kubeadm token list")
		return "", err
	} else {
		token = stdout
		if len(stderr) > 0 {
			tokenErr := fmt.Errorf("Failed to get token")
			log.Log.Error(tokenErr, stderr)
			return "", tokenErr
		}
	}
	return strings.Trim(token, "\n"), nil
}

// Deprecated getMasterIP get master pod IP address
func (r *MaterReconciler) getMasterIP(namespace string, podName string) (string, error) {
	var masterIP string
	po := &corev1.Pod{}
	err := r.Get(context.TODO(), types.NamespacedName{Namespace: namespace, Name: podName}, po)
	if err != nil {
		log.Log.Error(err, fmt.Sprintf("Failed to get %s Pod\n", podName))
		return "", err
	}
	masterIP = po.Status.PodIP
	return strings.Trim(masterIP, "\n"), nil
}

// Deprecated getKubeadmSha get inner k8s sha token
func (r *MaterReconciler) getKubeadmSha(namespace string, podName string) (string, error) {
	var sha string
	shaCmd := "openssl x509 -pubkey -in /etc/kubernetes/pki/ca.crt | openssl rsa -pubin -outform der 2>/dev/null | openssl dgst -sha256 -hex | sed 's/^.* //'"
	if stdout, stderr, err := r.exec(namespace, podName, []string{"/bin/sh", "-c", shaCmd}, true); err != nil {
		log.Log.Error(err, "Failed to exec openssl")
		return "", err
	} else {
		sha = stdout
		if len(stderr) > 0 {
			shaErr := fmt.Errorf("Failed to get sha")
			log.Log.Error(shaErr, stderr)
			return "", shaErr
		}
	}
	return strings.Trim(sha, "\n"), nil
}

// labelNodes label inner k8s nodes for masq-agent
func (r *MaterReconciler) labelNodes(namespace string, podName string) error {
	labelCmd := "for node in $(kubectl get no -o=jsonpath='{.items[*].metadata.name}'); do kubectl label nodes $node beta.kubernetes.io/masq-agent-ds-ready=true; done"
	if _, _, err := r.exec(namespace, podName, []string{"/bin/sh", "-c", labelCmd}); err != nil {
		log.Log.Error(err, "Failed to exec openssl")
		return err
	}
	return nil
}

// checkInternet connect to external internet right after inner k8s is up
func (r *MaterReconciler) checkInternet(namespace string, masterPodName string) error {
	if _, _, err := r.exec(namespace, masterPodName, []string{"./setting-internet.sh"}); err != nil {
		log.Log.Error(err, "Failed to exec checking all pod running")
		return err
	}
	return nil
}

// installKubeflow install latest kubeflow
func (r *MaterReconciler) installKubeflow(m *odkv1alpha1.Mater, podName string) error {
	if _, _, err := r.exec(m.Namespace, podName, []string{"/bin/sh", "-c",
		strings.Join([]string{INSTALLKUBEFLOW, m.Spec.NfsServer, m.Spec.NfsMountPath, strconv.Itoa(int(m.Spec.BrowserPort))}, " ")}); err != nil {
		log.Log.Error(err, "Failed to install kubeflow")
		return err
	}
	return nil
}
