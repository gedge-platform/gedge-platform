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

package v1alpha1

import (
	"gitlab.tde.sktelecom.com/SCALEBACK/vk8s/typing"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

// NOTE: json tags are required.  Any new fields you add must have json tags for the fields to be serialized.

// Vk8sSpec defines the desired state of Vk8s
type Vk8sSpec struct {
	// Nodes are virtual nodes' spec. image, resource, etc.
	Nodes []NodePod `json:"nodes"`
	// Ports are port list that user want to expose
	// +optional
	Ports []corev1.ServicePort `json:"ports,omitempty"`
	// AccessPodImage is image of access pod for vk8s cluster
	// +optional
	AccessPodImage string `json:"accessPodImage,omitempty"`
	// AccessPodPort is ssh export port number of access pod
	// +optional
	AccessPodPort int32 `json:"accessPodPort,omitempty"`
	// Kubeflow is kubeflow's version to install
	// +optional
	Kubeflow KubeflowSpec `json:"kubeflow,omitempty"`

	// Kubernetes is options for kubeadm init command
	// +optional
	Kubernetes KubernetesSpec `json:"kubernetes,omitempty"`
}

// NodePod defines the desired state of pod which is used for virtual k8s node
type NodePod struct {
	// Name is name of virtual node pod
	Name string `json:"name"`
	// Image is image of virtual node pod
	Image string `json:"image"`
	// Role is kubernetes role of virtual node. Possible values are master|worker
	Role typing.Role `json:"role"`
	// Resources is virtual node pod's resource. requests and limit will always same.
	Resources corev1.ResourceRequirements `json:"resources"`
	// Tolerations are tolerations for taints of nodes
	Tolerations []corev1.Toleration `json:"tolerations,omitempty"`
}

type KubernetesSpec struct {
	// PodNetworkCidr is pod network cidr of vk8s cluster.
	// Must be different from pod network cidr of host kubernetes cluster
	// +optional
	PodNetworkCidr string `json:"podNetworkCidr,omitempty"`
	// ServiceCidr is service cidr if vk8s cluster.
	// Must be different from service cidr of host kubernetes cluster
	// +optional
	ServiceCidr string `json:"serviceCidr,omitempty"`
}

// KubeflowSpec defines kubeflow install configuration
type KubeflowSpec struct {
	// Version is version of kubeflow
	Version string `json:"version,omitempty"`

	// Email is email of kubeflow
	Email string `json:"email"`

	// Password is password of kubeflow
	Password string `json:"password"`
}

// Vk8sStatus defines the observed state of Vk8s
type Vk8sStatus struct {
	// Phase is current phase among vk8s initializing process
	Phase string `json:"phase,omitempty"`
	// Message regarding why the vk8s is in the current phase
	Message string `json:"message,omitempty"`
	// VNodeKubernetesSetupStatuses is vnode pod status and whether pod is set for kubernetes
	VNodeKubernetesSetupStatuses map[string]VNodeStatus `json:"vnodeKubernetesSetupStatuses,omitempty"`

	Conditions []Condition `json:"conditions,omitempty"`
}

type Condition struct {
	// Phase is stage of initializing vk8s
	// +optional
	Phase string `json:"phase,omitempty"`
	// Last time we probed the condition
	// +optional
	LastProbTime metav1.Time `json:"lastProbeTime,omitempty"`
	// Message regarding result of the phase
	// +optional
	Message string `json:"message,omitempty"`
}

type VNodeStatus struct {
	// Status is the pod status of vnode
	// +optional
	Status string `json:"status,omitempty"`
	// Message regarding why the pod is in the current status
	// +optional
	Message string `json:"message,omitempty"`
	// IsK8sSet whether setup is completed for kubernetes
	// +optional
	IsKubernetesSetup string `json:"isKubernetesSetup,omitempty"`
}

//+kubebuilder:object:root=true
//+kubebuilder:subresource:status

// Vk8s is the Schema for the vk8s API
type Vk8s struct {
	metav1.TypeMeta   `json:",inline"`
	metav1.ObjectMeta `json:"metadata,omitempty"`

	Spec   Vk8sSpec   `json:"spec,omitempty"`
	Status Vk8sStatus `json:"status,omitempty"`
}

//+kubebuilder:object:root=true

// Vk8sList contains a list of Vk8s
type Vk8sList struct {
	metav1.TypeMeta `json:",inline"`
	metav1.ListMeta `json:"metadata,omitempty"`
	Items           []Vk8s `json:"items"`
}

func init() {
	SchemeBuilder.Register(&Vk8s{}, &Vk8sList{})
}
