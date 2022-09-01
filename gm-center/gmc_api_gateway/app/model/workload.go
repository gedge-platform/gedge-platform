package model

import "time"

type WORKLOAD struct {
	Name          string      `json:"name"`
	Namespace     string      `json:"project"`
	ClusterName   string      `json:"cluster"`
	WorkspaceName string      `json:"workspace,omitempty"`
	UserName      string      `json:"user,omitempty"`
	READY         string      `json:"ready,omitempty"`
	NodeSelector  interface{} `json:"NodeSelector,omitempty"`
	CreateAt      time.Time   `json:"createAt,omitempty"`
}
type DEPLOYMENT_DETAIL struct {
	WORKLOAD
	Replica    REPLICA     `json:"replica"`
	Strategy   interface{} `json:"strategy,omitempty"`
	Containers interface{} `json:"containers,omitempty"`
	Label      interface{} `json:"labels,omitempty"`
	Events     []EVENT     `json:"events"`
	Annotation interface{} `json:"annotations,omitempty"`
	UpdateAt   time.Time   `json:"updateAt"`
}
type DAEMONSET_DETAIL struct {
	WORKLOAD
	Status     interface{} `json:"status"`
	Strategy   interface{} `json:"strategy,omitempty"`
	Containers interface{} `json:"containers,omitempty"`
	Labels     interface{} `json:"label,omitempty"`
	Events     []EVENT     `json:"events"`
	Annotation interface{} `json:"annotations,omitempty"`
	CreateAt   time.Time   `json:"createAt,omitempty"`
}
type STATEFULSET_DETAIL struct {
	WORKLOAD
	Status          interface{} `json:"status"`
	Containers      interface{} `json:"containers,omitempty"`
	OwnerReferences interface{} `json:"ownerReferences,omitempty"`
	Labels          interface{} `json:"label,omitempty"`
	Events          []EVENT     `json:"events"`
	Annotation      interface{} `json:"annotations,omitempty"`
	CreateAt        time.Time   `json:"createAt,omitempty"`
}

type REPLICA struct {
	Replicas            int `json:"replicas"`
	ReadyReplicas       int `json:"readyReplicas"`
	UpdatedReplicas     int `json:"updatedReplicas"`
	AvailableReplicas   int `json:"availableReplicas"`
	UnavailableReplicas int `json:"unavailableReplicas"`
	// jwt.StandardClaim
}
type DEPLOYMENTLISTS struct {
	// Pods     []DEPLOYMENTPOD `json:"pods"`
	Pods        interface{} `json:"pods"`
	Services    interface{} `json:"services"`
	ReplicaName string      `json:"replicaName,omitempty"`
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

func (WORKLOAD) TableName() string {
	return "DEPLOYMENT_INFO"
}

type WORKLOADS []WORKLOAD
