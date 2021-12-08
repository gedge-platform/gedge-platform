/*==============================================================================
 *
 *  ELECTRONICS AND TELECOMMUNICATIONS RESEARCH INSTITUTE
 *
 *  COPYRIGHT(c)2021 ELECTRONICS AND TELECOMMUNICATIONS RESEARCH INSTITUTE,
 *  P.O. Box 106, YOUSONG, TAEJON, KOREA
 *  All rights are reserved, No part of this work covered by the copyright
 *  hereon may be reproduced, stored in retrieval systems, in any form or by
 *  any means, electronic, mechanical, photocopying, recording or otherwise,
 *  without the prior permission of ETRI.
 *
 *==============================================================================*/

package plugin

import (
	"context"
	"flag"
	"fmt"
	"time"

	apiv1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"

	"github.com/spf13/cobra"
	"k8s.io/apimachinery/pkg/api/errors"

	"net/http"
	"os"
	"path/filepath"
	"strings"

	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/tools/clientcmd"
)

const (
	example = `
	 # Checkpoint a Pod
	 kubectl migrate POD_NAME destHost
	 kubectl migrate POD_NAME --namespace string destHost
 `
	longDesc = `
 migrate POD_NAME to destHost
 `
)

type MigrateArgs struct {
	Namespace string
	PodName   string
	DestHost  string
}

func NewPluginCmd() *cobra.Command {
	fmt.Printf("[KDW] Cmd NewPlugincmd Called!\n")
	var Margs MigrateArgs
	Margs.DestHost = "kubeetri1"
	Margs.Namespace = "default"
	Margs.PodName = "simple"
	cmd := &cobra.Command{
		Use:     "migrate [OPTIONS] POD_NAME destHost",
		Short:   "migrate a Pod",
		Long:    longDesc,
		Example: example,
		Run: func(c *cobra.Command, args []string) {
			if err := Margs.Complete(c, args); err != nil {
				fmt.Println(err)
			}
			if err := Margs.Run(); err != nil {
				fmt.Println(err)
			}
		},
	}
	cmd.Flags().StringVar(&Margs.Namespace, "namespace", "default",
		"default namespace is \"default\"")
	return cmd
}

func (a *MigrateArgs) Complete(cmd *cobra.Command, args []string) error {
	fmt.Printf("[KDW] Cmd Migrate Argument check completed Called!\n")
	if len(args) == 0 {
		return fmt.Errorf("error pod not specified")
	}
	if len(args) == 1 {
		return fmt.Errorf("destHost not specified")
	}

	a.PodName = args[0]
	a.DestHost = args[1]
	return nil
}

func (a *MigrateArgs) Run() error {
	fmt.Printf("[KDW] Cmd Migration Run Called!\n")

	var kubeconfig *string
	if home := homeDir(); home != "" {
		kubeconfig = flag.String("kubeconfig", filepath.Join(home, ".kube", "config"), "(optional) absolute path to the kubeconfig file")
	} else {
		kubeconfig = flag.String("kubeconfig", "", "absolute path to the kubeconfig file")
	}
	flag.Parse()

	config, err := clientcmd.BuildConfigFromFlags("", *kubeconfig)
	if err != nil {
		panic(err.Error())
	}

	clientset, err := kubernetes.NewForConfig(config)
	if err != nil {
		panic(err.Error())
	}

	ctx := context.Background()

	var errVal error

	pod, err := clientset.CoreV1().Pods(a.Namespace).Get(context.TODO(), a.PodName, metav1.GetOptions{})

	if errors.IsNotFound(err) {
		fmt.Printf("Pod %s in namespace %s not found\n", a.PodName, a.Namespace)
		return errVal
	} else if statusError, isStatus := err.(*errors.StatusError); isStatus {
		fmt.Printf("Error getting pod %s in namespace %s: %v\n",
			a.PodName, a.Namespace, statusError.ErrStatus.Message)
		return errVal
	} else if err != nil {
		panic(err.Error())
		return errVal
	}

	hostIP := pod.Status.HostIP
	fmt.Printf("[kdw] HostIP : %s\n", hostIP)

	//TODO: should get IP address from Gdege Manager
	var hostAddrs = [...]string{"10.244.0.0", "10.244.1.0"}
	for _, addr := range hostAddrs {
		fmt.Printf("[KDW]Addr:%s toclear called!\n", addr)
		toclear(addr)
	}

	url := "http://" + hostIP + ":15213/migratePod"

	body := strings.NewReader("containerId=" + strings.TrimPrefix(pod.Status.ContainerStatuses[0].ContainerID, "docker://") + "&" + "destHost=" + a.DestHost)
	req, err := http.NewRequest("POST", url, body)

	if err != nil {
		fmt.Println(err)
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		fmt.Println(err)
	}
	defer resp.Body.Close()

	pods, err := clientset.CoreV1().Pods(a.Namespace).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		fmt.Println("list error")
	}
	fmt.Printf("There are %d pods in the cluster\n", len(pods.Items))

	err = clientset.CoreV1().Pods(a.Namespace).Delete(context.TODO(), a.PodName, metav1.DeleteOptions{})
	if err != nil {
		fmt.Println("delete error")
	}

	for ; err == nil; _, err = clientset.CoreV1().Pods("default").Get(ctx, pod.Name, metav1.GetOptions{}) {
		time.Sleep(1 * time.Second)
	}

	newPod := &apiv1.Pod{
		TypeMeta:   metav1.TypeMeta{"Pod", "v1"},
		ObjectMeta: metav1.ObjectMeta{Name: pod.ObjectMeta.Name, Namespace: pod.ObjectMeta.Namespace},
		Spec:       *pod.Spec.DeepCopy(),
		Status:     *pod.Status.DeepCopy(),
	}

	newPod.Spec = apiv1.PodSpec{
		Containers: make([]apiv1.Container, len(pod.Spec.Containers)),
	}

	for i := 0; i < len(pod.Spec.Containers); i++ {
		newPod.Spec.Containers[i].Name = pod.Spec.Containers[i].Name
		newPod.Spec.Containers[i].Image = pod.Spec.Containers[i].Image
		newPod.Spec.Containers[i].Command = pod.Spec.Containers[i].Command
	}

	newPod.Spec.NodeSelector = make(map[string]string)
	newPod.Spec.NodeSelector["kubernetes.io/hostname"] = a.DestHost

	_, err = clientset.CoreV1().Pods(a.Namespace).Create(ctx, newPod, metav1.CreateOptions{})
	if err != nil {
		fmt.Println("create error")
	}

	time.Sleep(2 * time.Second)
	_, err = clientset.CoreV1().Pods("default").UpdateStatus(ctx, newPod, metav1.UpdateOptions{})
	fmt.Printf("ContainerID:%s\n", newPod.Status.ContainerStatuses[0].ContainerID)
	time.Sleep(2 * time.Second)
	newPod, err = clientset.CoreV1().Pods("default").Get(ctx, a.PodName, metav1.GetOptions{})
	fmt.Printf("ContainerID:%s\n", newPod.Status.ContainerStatuses[0].ContainerID)
	fmt.Printf("Get Pod Info: %s\n", newPod.Status.ContainerStatuses[0].ContainerID)

	containerids := make([]string, 10)
	containerName := make([]string, 10)
	for i := 0; i < len(newPod.Spec.Containers); i++ {
		containerids[i] = strings.TrimPrefix(newPod.Status.ContainerStatuses[i].ContainerID, "docker://")
		fmt.Printf("ContainerID:%s\n", containerids[i])
		containerName[i] = newPod.Spec.Containers[i].Name
		fmt.Printf("ContainerName:%s\n", containerName[i])
		fmt.Println(containerids)
	}

	restoreurl := "http://" + newPod.Status.HostIP + ":15213/restorePod"
	payload := strings.NewReader("containerId=" + containerids[0] + "&" + "containerNames=" + containerName[0])
	restorereq, err := http.NewRequest("POST", restoreurl, payload)

	if err != nil {
		fmt.Println(err)
	}
	restorereq.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	restoreresp, err := http.DefaultClient.Do(restorereq)
	if err != nil {
		fmt.Println(err)
	}
	fmt.Print(restoreresp.Status)

	defer restoreresp.Body.Close()

	return nil

}

func toclear(hostIP string) {
	fmt.Printf("[KDW] Cmd toclear Called!\n")
	url := "http://" + hostIP + ":15213/clear"

	body := strings.NewReader("")
	req, err := http.NewRequest("POST", url, body)

	if err != nil {
		fmt.Println("to Clear request error", req)
		os.Exit(3)
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		fmt.Println("to Clear response error", err)
		os.Exit(3)
	}
	defer resp.Body.Close()
}

func homeDir() string {
	fmt.Printf("[KDW] Cmd homeDri Called!\n")
	if h := os.Getenv("HOME"); h != "" {
		fmt.Println("homeDir error", h)
		return h
	}
	return os.Getenv("USERPROFILE") // windows
}
