package controllers

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"io/ioutil"
	"net/url"
	"os"
	"time"

	v1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/types"
	"k8s.io/apimachinery/pkg/util/wait"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/remotecommand"
	"k8s.io/kubectl/pkg/scheme"
	"sigs.k8s.io/controller-runtime/pkg/log"
)

// labelsForMater make label map for nodepod
func labelsForMater(name string) map[string]string {
	return map[string]string{"app": "mater", "clusterName": name, "role": WORKER,
		"sidecar.istio.io/inject": "false"}
}

// exec exec to running pod
func (r *MaterReconciler) exec(namespace, podName string, cmd []string, needOutput ...bool) (string, string, error) {
	if err := r.waitForPodRunning(namespace, podName, 10*time.Minute); err != nil {
		log.Log.Error(err, "Timeout for waiting pod running")
		return "", "", err
	}
	config, err := rest.InClusterConfig()
	if err != nil {
		log.Log.Error(err, "Failed to get default kubeconfig")
		return "", "", err
	}
	kubeClient, err := kubernetes.NewForConfig(config)
	if err != nil {
		log.Log.Error(err, "Failed to get kubeClient")
		return "", "", err
	}
	execReq := kubeClient.CoreV1().RESTClient().Post().
		Resource("pods").
		Name(podName).
		Namespace(namespace).
		SubResource("exec")
	execReq.VersionedParams(&v1.PodExecOptions{
		Container: "node",
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
		return "", "", err
	}
	if len(needOutput) == 1 && needOutput[0] {
		stdo, err = ioutil.ReadAll(stdout)
		if err != nil {
			log.Log.Error(err, "Failed to read exec stdout")
			return "", "", err
		}
		stde, err = ioutil.ReadAll(stderr)
		if err != nil {
			log.Log.Error(err, "Failed to read exec stderr")
			return "", "", err
		}
		return string(stdo), string(stde), nil
	} else {
		return "", "", nil
	}
}

// waitForPodRunning waits until pod becomes running state
func (r MaterReconciler) waitForPodRunning(namespace, podName string, timeout time.Duration) error {
	return wait.PollImmediate(10*time.Second, timeout, r.isPodRunning(podName, namespace))
}

// isPodRunning check whether the pod is running state
func (r MaterReconciler) isPodRunning(podName, namespace string) wait.ConditionFunc {
	return func() (bool, error) {
		log.Log.Info(fmt.Sprintf("Waiting for %s Pod Running...\n", podName)) // progress bar!
		found := &v1.Pod{}
		err := r.Get(context.TODO(), types.NamespacedName{Namespace: namespace, Name: podName}, found)
		if err != nil {
			return false, err
		}

		switch found.Status.Phase {
		case v1.PodRunning:
			return true, nil
		case v1.PodFailed, v1.PodSucceeded:
			return false, fmt.Errorf("Pod is not Running. There is something wrong")
		}
		return false, nil
	}
}

//executeExec send exec command to pod and get result
func executeExec(method string, url *url.URL, config *rest.Config,
	stdin io.Reader, stdout, stderr io.Writer, tty bool) error {

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
