package model

import "time"

type DEPLOYMENT struct {
	Name          string      `json:"name"`
	Namespace     string      `json:"project"`
	ClusterName   string      `json:"cluster"`
	WorkspaceName string      `json:"workspace,omitempty"`
	Stauts        string      `json:"status"`
	Replica       REPLICA     `json:"replica"`
	Strategy      interface{} `json:"strategy,omitempty"`
	Containers    interface{} `json:"containers,omitempty"`
	// Workspace     string      `json:"workspace,omitempty"`
	// PodInfo     []model.Pod     `json:"pods"`
	// ServiceInfo []model.Service `json:"services"`
	Label      interface{} `json:"labels,omitempty"`
	Events     []EVENT     `json:"events,omitempty"`
	Annotation interface{} `json:"annotations,omitempty"`
	CreateAt   time.Time   `json:"createAt,omitempty"`
	UpdateAt   time.Time   `json:"updateAt"`
	// Resource   []DEPLOYMENT_RESOURCE `json:"resource"`
	// jwt.StandardClaim
}

type REPLICA struct {
	Replicas            int `json:"replicas"`
	ReadyReplicas       int `json:"readyReplicas"`
	UpdatedReplicas     int `json:"updatedReplicas"`
	AvailableReplicas   int `json:"availableReplicas"`
	UnavailableReplicas int `json:"unavailableReplicas"`
	// jwt.StandardClaim
}

// type CONTAINER struct {
// 	Image    string `json:"image"`
// 	Name     string `json:"name"`
// 	Resource struct {
// 		Limit struct {
// 			Cpu    string `json:"cpu"`
// 			Memory string `json:"memory"`
// 		} `json:"limits"`
// 		Request struct {
// 			Cpu    string `json:"cpu"`
// 			Memory string `json:"memory"`
// 		} `json:"requests"`
// 	} `json:"resources"`
// }

// type DEPLOYMENT_RESOURCE struct {
// }

type DEPLOYMENTLISTS struct {
	// Pods     []DEPLOYMENTPOD `json:"pods"`
	Pods        interface{} `json:"pods"`
	Services    interface{} `json:"services"`
	ReplicaName string      `json:"replicaName"`
}
type DEPLOYMENTPOD struct {
	Name         string `json:"name"`
	Status       string `json:"status"`
	Node         string `json:"node"`
	PodIP        string `json:"podIP"`
	RestartCount int    `json:"restart"`
}

type DEPLOYMENTSVC struct {
	Name string `json:"name"`
	// ClusterIP string      `json:"clusterIP"`
	// Type      string      `json:"type"`
	Port interface{} `json:"port"`
}

type DEPLOYMENTTEST struct {
	Metadata struct {
		Name string `json:"name"`
	} `json:"metadata"`
	Status struct {
		HostIP string `json:"hostIP"`
		Phase  string `json:"phase"`
		PodIP  string `json:"podIP"`
	} `json:"status"`
}

type DEPLOYMENTTEST2 struct {
	Name string `json:"name"`

	HostIP string `json:"hostIP"`
	Phase  string `json:"phase"`
	PodIP  string `json:"podIP"`
}
