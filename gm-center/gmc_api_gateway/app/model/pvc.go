package model

import (
	"time"
)

type PVC struct {
	Name         string      `json:"name"`
	Namespace    string      `json:"namespace"`
	UserName     string      `json:"user,omitempty"`
	Capacity     string      `json:"capacity"`
	AccessMode   []string    `json:"accessMode"`
	Status       interface{} `json:"status"`
	Volume       interface{} `json:"volume"`
	StorageClass string      `json:"storageClass"`
	Cluster      string      `json:"clusterName"`
	Workspace    string      `json:"workspaceName,omitempty"`
	// Reason        []EVENT          `json:"events"`
	Lable       interface{} `json:"label,omitempty"`
	Annotations interface{} `json:"annotations,omitempty"`
	CreateAt    time.Time   `json:"createAt"`
	Finalizers  []string    `json:"finalizers,omitempty"`
	Events      []EVENT     `json:"events"`
}

type PVCs []PVC

func (PVC) TableName() string {
	return "PVC_INFO"
}
