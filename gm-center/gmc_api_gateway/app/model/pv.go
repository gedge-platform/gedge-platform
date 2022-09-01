package model

import (
	"time"
)

type PV struct {
	Name          string      `json:"name"`
	UserName      string      `json:"user,omitempty"`
	Capacity      string      `json:"capacity"`
	AccessMode    []string    `json:"accessMode"`
	ReclaimPolicy string      `json:"reclaimPolicy",`
	Status        interface{} `json:"status"`
	Claim         interface{} `json:"claim"`
	StorageClass  string      `json:"storageClass"`
	// Reason        []EVENT          `json:"events"`
	VolumeMode string `json:"volumeMode"`
	Cluster    string `json:"cluster"`
	// Workspace string `json:"workspace"`
	CreateAt    time.Time   `json:"createAt"`
	Lable       interface{} `json:"label,omitempty"`
	Annotations interface{} `json:"annotations,omitempty"`
	Events      []EVENT     `json:"events"`
}

type PVs []PVs

func (PV) TableName() string {
	return "PV_INFO"
}
