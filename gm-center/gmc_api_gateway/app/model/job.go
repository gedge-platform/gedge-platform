package model

import "time"

type JOB struct {
	Workspace      string           `json:"workspace,omitempty"`
	Cluster        string           `json:"cluster"`
	Namespace      string           `json:"project"`
	Name           string           `json:"name"`
	Kind           string           `json:"kind,omitempty"`
	Status         int              `json:"status,omitempty"`
	CreationTime   time.Time        `json:"created_at,omitempty"`
	Lable          interface{}      `json:"label,omitempty"`
	Annotations    interface{}      `json:"annotations,omitempty"`
	Containers     []Containers     `json:"containers,omitempty"`
	BackoffLimit   int              `json:"backoffLimit,omitempty"`
	Completions    int              `json:"completions,omitempty"`
	Parallelism    int              `json:"parallelism,omitempty"`
	OwnerReference []OwnerReference `json:"ownerReferences,omitempty"`
	Conditions     []Conditions     `json:"conditions,omitempty"`
	StartTime      time.Time        `json:"startTime,omitempty"`
	CompletionTime time.Time        `json:"completionTime,omitempty"`
	Events         []EVENT          `json:"events,omitempty"`
}

// type JOBALL struct {
// 	Metadata struct {
// 		Name           string           `json:"name"`
// 		Namespace      string           `json:"namespace"`
// 		OwnerReference []OwnerReference `json:"ownerReferences,omitempty"`
// 	} `json:"metadata"`
// 	Sepc struct {
// 		Template struct {
// 			Spec struct {
// 				Containers []Containers `json:"containers,omitempty"`
// 			} `json:"spec"`
// 		} `json:"template"`
// 	} `json:"spec"`
// 	Status struct {
// 		Succeeded int `json:"succeeded"`
// 	} `json:"status"`
// }

type Containers struct {
	Name  string `json:"name"`
	Image string `json:"image"`
}
type Conditions struct {
	Status        string    `json:"status,omitempty"`
	Type          string    `json:"type,omitempty"`
	LastProbeTime time.Time `json:"lastProbeTime,omitempty"`
}
type JOBEvent struct {
	Reason  string `json:"reson,omitempty"`
	Message string `json:"type,omitempty"`
}
type ReferDataJob struct {
	ReferPodList []ReferPodList `json:"podList"`
	Event        []EVENT1       `json:"event"`
}
type ReferPodList struct {
	Metadata struct {
		Name string `json:"name,omitempty"`
	} `json:"metadata"`
	Status struct {
		Phase  string `json:"phase,omitempty"`
		HostIP string `json:"hostIP,omitempty"`
		PodIP  string `json:"podIP,omitempty"`
	} `json:"status"`
	Spec struct {
		NodeName string `json:"nodeName,omitempty"`
	} `json:"spec"`
}
