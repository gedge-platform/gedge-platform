/*
Copyright 2021.

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
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

// EDIT THIS FILE!  THIS IS SCAFFOLDING FOR YOU TO OWN!
// NOTE: json tags are required.  Any new fields you add must have json tags for the fields to be serialized.

// type NodePodInfo struct {
// 	Image string    `json:"image,omitempty"`
// 	Nodes []NodePod `json:"master"`
// }

//+kubebuilder:object:root=true
//+kubebuilder:subresource:status

// Mater is the Schema for the maters API
type Mater struct {
	metav1.TypeMeta   `json:",inline"`
	metav1.ObjectMeta `json:"metadata,omitempty"`

	Spec   MaterSpec   `json:"spec,omitempty"`
	Status MaterStatus `json:"status,omitempty"`
}

//+kubebuilder:object:root=true

// MaterList contains a list of Mater
type MaterList struct {
	metav1.TypeMeta `json:",inline"`
	metav1.ListMeta `json:"metadata,omitempty"`
	Items           []Mater `json:"items"`
}

// MaterSpec defines the desired state of Mater
type MaterSpec struct {
	// INSERT ADDITIONAL SPEC FIELDS - desired state of cluster
	// Important: Run "make" to regenerate code after modifying this file

	Nodes        []NodePod `json:"nodes"`
	BrowserPort  int32     `json:"browserPort"`
	NfsServer    string    `json:"nfsServer"`
	NfsMountPath string    `json:"nfsMountPath"`
	Kubeflow     bool      `json:"kubeflow"`
}

// NodePod defines the desired state of pod which is used for inner k8s node
type NodePod struct {
	Name      string       `json:"name"`
	Image     string       `json:"image"`
	Role      string       `json:"role"`
	Resources ResourceInfo `json:"resources,omitempty"`
}

// ResourceInfo defines the requests and limits of resource
type ResourceInfo struct {
	Requests Resource `json:"requests,omitempty"`
	Limits   Resource `json:"limits,omitempty"`
}

// Resource defines cpu, memory and gpu resource
type Resource struct {
	CPU string `json:"cpu,omitempty"`
	MEM string `json:"memory,omitempty"`
	GPU int64  `json:"gpu,omitempty"`
}

// MaterStatus defines the observed state of Mater
type MaterStatus struct {
	// INSERT ADDITIONAL STATUS FIELD - define observed state of cluster
	// Important: Run "make" to regenerate code after modifying this file

	// Maters are the names of the mater pods
	Maters []string `json:"maters"`
}

func init() {
	SchemeBuilder.Register(&Mater{}, &MaterList{})
}
