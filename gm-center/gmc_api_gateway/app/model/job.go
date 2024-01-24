package model

import "time"

type JOB struct {
	Workspace    string      `json:"workspace,omitempty"`
	Cluster      string      `json:"cluster"`
	UserName     string      `json:"user,omitempty"`
	Namespace    string      `json:"project"`
	Name         string      `json:"name"`
	Completions  string      `json:"completions,omitempty"`
	Duration     interface{} `json:"duration"`
	CreationTime time.Time   `json:"created_at,omitempty"`
}
type JOB_DETAIL struct {
	JOB
	Status       int         `json:"status,omitempty"`
	Lable        interface{} `json:"label,omitempty"`
	Annotations  interface{} `json:"annotations,omitempty"`
	Containers   interface{} `json:"containers,omitempty"`
	BackoffLimit int         `json:"backoffLimit,omitempty"`
	Voluems      int         `json:"volume,omitempty"`
	Parallelism  int         `json:"parallelism,omitempty"`
	// OwnerReference []OwnerReference `json:"ownerReferences,omitempty"`
	Conditions     []Conditions `json:"conditions,omitempty"`
	StartTime      time.Time    `json:"startTime,omitempty"`
	CompletionTime time.Time    `json:"completionTime,omitempty"`
	Events         []EVENT      `json:"events"`
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

//	type JOBEvent struct {
//		Reason  string `json:"reson,omitempty"`
//		Message string `json:"type,omitempty"`
//	}
type ReferDataJob struct {
	ReferPodList []ReferPodList `json:"podList"`
	// OnwerReferInfo
	OnwerReferInfo OnwerReferInfo `json:"ownerReferences,omitempty"`
}
type OnwerReferInfo struct {
	Kind string `json:"kind,omitempty"`
	Name string `json:"name,omitempty"`
}
type ReferPodList struct {
	Name     string `json:"name,omitempty"`
	Status   string `json:"status,omitempty"`
	HostIP   string `json:"hostIP,omitempty"`
	PodIP    string `json:"podIP,omitempty"`
	NodeName string `json:"nodeName,omitempty"`
}
