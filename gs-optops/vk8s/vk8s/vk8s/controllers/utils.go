package controllers

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"net/url"
	"os"
	"path/filepath"
	"strings"

	"gitlab.tde.sktelecom.com/SCALEBACK/vk8s/api/v1alpha1"
	"gitlab.tde.sktelecom.com/SCALEBACK/vk8s/typing"
	corev1 "k8s.io/api/core/v1"
	v1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"
	"k8s.io/client-go/tools/remotecommand"
	"k8s.io/kubectl/pkg/scheme"
	"sigs.k8s.io/controller-runtime/pkg/client"
	"sigs.k8s.io/controller-runtime/pkg/log"
)

// makeLabels make label map for vnode pod
func makeLabels(
	vk8s *v1alpha1.Vk8s,
	vnodeName string,
	role typing.Role) (map[string]string, error) {
	if !role.IsValid() {
		return nil, typing.ErrRoleNotFound
	}
	ret := make(map[string]string)
	if vk8s.Labels != nil {
		ret = vk8s.Labels
	}

	ret["app"] = "vk8s"
	ret["clusterName"] = vk8s.Name
	ret["role"] = role.ToString()
	ret["sidecar.istio.io/inject"] = "false"
	ret["vnode"] = vnodeName
	return ret, nil
}

// makePodName make vnode pod name of statefulset
func makePodName(vnodeName string) string {
	return fmt.Sprintf("%s-0", vnodeName)
}

// accessPodLabel return label for access pod
func accessPodLabel(name string) map[string]string {
	return map[string]string{"kubectl": name}
}

// copyServiceFields copy only service labels and annotations
func copyServiceFields(from, to *corev1.Service) bool {
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

	// if !reflect.DeepEqual(to.Spec.Ports, from.Spec.Ports) {
	// 	requireUpdate = true
	// }
	// to.Spec.Ports = from.Spec.Ports

	return requireUpdate
}

func (r *Vk8sReconciler) updateVk8sPhase(
	ctx context.Context,
	v *v1alpha1.Vk8s,
	phase string,
	msg string) error {
	log.Log.Info("Updating Status", "namespace", v.Namespace, "name", v.Name)
	origin := v.DeepCopy()
	v.Status.Phase = phase
	v.Status.Message = msg
	v.Status.Conditions = append(v.Status.Conditions, v1alpha1.Condition{
		Phase:        phase,
		Message:      msg,
		LastProbTime: metav1.Now(),
	})
	err := r.patchVk8s(ctx, origin, v)
	if v.Status.VNodeKubernetesSetupStatuses == nil {
		v.Status.VNodeKubernetesSetupStatuses = make(map[string]v1alpha1.VNodeStatus)
	}
	return err
}

func (r *Vk8sReconciler) patchVk8s(ctx context.Context, origin client.Object, new client.Object) error {
	patch := client.MergeFrom(origin)
	if err := r.Status().Patch(ctx, new, patch); err != nil {
		log.Log.Error(err, "error on patching vk8s")
		return err
	} else {
		return nil
	}
}

// exec exec to running pod
func (r *Vk8sReconciler) exec(
	namespace,
	podName string,
	cmd []string,
	result chan typing.ExecResult,
	needOutput ...bool) {

	var config *rest.Config
	var err error
	if _, err = os.Stat("/var/run/secrets/kubernetes.io/serviceaccount/token"); os.IsNotExist(err) {
		kubeconfig := filepath.Join(homeDir(), ".kube", "config")
		config, err = clientcmd.BuildConfigFromFlags("", kubeconfig)
	} else {
		config, err = rest.InClusterConfig()
	}
	if err != nil {
		log.Log.Error(err, "Failed to get default kubeconfig")
		result <- typing.ExecResult{Stdout: "", Stderr: "", Err: err}
		return
	}

	kubeClient, err := kubernetes.NewForConfig(config)
	if err != nil {
		log.Log.Error(err, "Failed to get kubeClient")
		result <- typing.ExecResult{Stdout: "", Stderr: "", Err: err}
		return
	}
	execReq := kubeClient.CoreV1().RESTClient().Post().
		Resource("pods").
		Name(podName).
		Namespace(namespace).
		SubResource("exec")
	execReq.VersionedParams(&v1.PodExecOptions{
		Container: podName,
		Command:   cmd,
		Stdin:     false,
		Stdout:    true,
		Stderr:    true,
		TTY:       false,
	}, scheme.ParameterCodec)
	var stdout, stderr io.ReadWriter
	var stdo, stde []byte
	if len(needOutput) == 1 && needOutput[0] {
		stdout, stderr = &bytes.Buffer{}, &bytes.Buffer{}
	} else {
		stdout, stderr = os.Stdout, os.Stderr
	}
	err = executeExec("POST", execReq.URL(), config, nil, stdout, stderr, false)
	if err != nil {
		log.Log.Error(err, "Failed to exec pod")
		result <- typing.ExecResult{Stdout: "", Stderr: "", Err: err}
		return
	}
	if len(needOutput) == 1 && needOutput[0] {
		stdo, err = io.ReadAll(stdout)
		if err != nil {
			log.Log.Error(err, "Failed to read exec stdout")
			// return "", "", err
			result <- typing.ExecResult{Stdout: "", Stderr: "", Err: err}
			return
		}
		stde, err = io.ReadAll(stderr)
		if err != nil {
			log.Log.Error(err, "Failed to read exec stderr")
			result <- typing.ExecResult{Stdout: "", Stderr: "", Err: err}
			// return "", "", err
			return
		}
		result <- typing.ExecResult{
			Stdout: strings.Trim(string(stdo), " \n"),
			Stderr: strings.Trim(string(stde), " \n"),
			Err:    nil}
		// return strings.Trim(string(stde), " \n"), strings.Trim(string(stde), " \n"), nil
	} else {
		result <- typing.ExecResult{Stdout: "", Stderr: "", Err: err}
		// return "", "", nil
		return
	}
}

// executeExec send exec command to pod and get result
func executeExec(
	method string,
	url *url.URL,
	config *rest.Config,
	stdin io.Reader,
	stdout, stderr io.Writer,
	tty bool) error {

	exec, err := remotecommand.NewSPDYExecutor(config, method, url)
	if err != nil {
		return err
	}
	return exec.Stream(remotecommand.StreamOptions{
		Stdin:  stdin,
		Stdout: stdout,
		Stderr: stderr,
		Tty:    tty,
	})
}

func selectExecResult(
	ctx context.Context,
	result chan typing.ExecResult) (string, string, error) {

	select {
	case execResult := <-result:
		if execResult.Err != nil {
			log.Log.Error(execResult.Err,
				"error on receiving exec result")
			return "", "", execResult.Err
		} else {
			return execResult.Stdout, execResult.Stderr, nil
		}
	case <-ctx.Done():
		log.Log.Error(typing.ErrCancelled,
			"error on receiving exec result")
		return "", "", typing.ErrCancelled
	}
}

func homeDir() string {
	if h := os.Getenv("HOME"); h != "" {
		return h
	}
	return os.Getenv("USERPROFILE") // windows
}

func getMapKeys(m map[string]string) []string {
	keys := make([]string, 0, len(m))
	for k := range m {
		keys = append(keys, k)
	}
	return keys
}
