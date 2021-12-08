package model

import (
	"time"
)

type Cluster struct {
	Num        int       `gorm:"column:clusterNum; primary_key" json:"clusterNum,omitempty"`
	Ip         string    `gorm:"column:ipAddr; not null; default:null" json:"ipAddr,omitempty"`
	Name       string    `gorm:"column:clusterName; not null; default:null" json:"clusterName,omitempty"`
	Type       string    `gorm:"column:clusterType; not null; default:null" json:"clusterType,omitempty"`
	Endpoint   string    `gorm:"column:clusterEndpoint; not null; default:null" json:"clusterEndpoint,omitempty"`
	Creator    string    `gorm:"column:clusterCreator; not null; default:null" json:"clusterCreator,omitempty"`
	Created_at time.Time `gorm:"column:created_at" json:"created_at,omitempty"`
	Token      string    `gorm:"column:token; not null; default:null" json:"token,omitempty"`
	// Monitoring []MONITOR `json:"monitoring"`
}

type CLUSTER struct {
	Cluster
	Gpu                     []map[string]interface{} `json:"gpu,omitempty"`
	Version                 string                   `json:"kubeVersion"`
	Status                  string                   `json:"status"`
	Network                 string                   `json:"network"`
	Os                      string                   `json:"os"`
	Kernel                  string                   `json:"kernel"`
	Label                   interface{}              `json:"labels"`
	Annotation              interface{}              `json:"annotations"`
	CreateAt                time.Time                `json:"created_at"`
	ResourceUsage           interface{}              `json:"resourceUsage"`
	Allocatable             interface{}              `json:"allocatable"`
	Capacity                interface{}              `json:"capacity"`
	Resource                PROJECT_RESOURCE         `json:"resource"`
	ContainerRuntimeVersion interface{}              `json:"containerRuntimeVersion"`
	Events                  []EVENT                  `json:"events"`
	Addresses               []ADDRESSES              `json:"addresses,omitempty"`
}
type GPU struct {
	Name string `json:"name"`
}
type ADDRESSES struct {
	Address string `json:"address,omitempty"`
	Type    string `json:"type,omitempty"`
}

// type CLUSTER struct {
// 	// Cluster
// 	Name       string            `json:"name"`
// 	Status     string            `json:"status"`
// 	IP         string            `json:"ip"`
// 	Role       string            `json:"role"`
// 	Network    string            `json:"network"`
// 	Os         string            `json:"os"`
// 	Type       string            `json:"type"`
// 	Kernel     string            `json:"kernel"`
// 	kubernetes string            `json:"kubernetes"`
// 	Lable      map[string]string `json:"lables"`
// 	Annotation map[string]string `json:"annotations"`
// 	CreatedAt  time.Time         `json:"created_at"`
// 	// Pod        []Pod    `json:"pods"`
// 	// Metadata   Metadata `json:"metadata"`
// 	Events []EVENT `json:"events"`
// 	// Monitoring model.monitoring `json:"monitoring"`
// }

// Set Cluster table name to be `CLUSTER_INFO`
func (Cluster) TableName() string {
	return "CLUSTER_INFO"
}

type CLUSTERS []CLUSTER
