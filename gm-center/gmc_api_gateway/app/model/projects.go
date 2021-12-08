package model

import (
	"time"
)

type Project struct {
	Num           int       `gorm:"column:projectNum; primary_key" json:"projectNum"`
	Name          string    `gorm:"column:projectName; not null; default:null" json:"projectName"`
	Description   string    `gorm:"column:projectDescription; not null; default:null" json:"projectDescription"`
	Type          string    `gorm:"column:projectType; not null; default:null" json:"projectType"`
	Owner         string    `gorm:"column:projectOwner; not null; default:null" json:"projectOwner"`
	Creator       string    `gorm:"column:projectCreator; not null; default:null" json:"projectCreator"`
	CreateAt      time.Time `gorm:"column:created_at" json:"created_at"`
	WorkspaceName string    `gorm:"column:workspaceName; not null; default:null" json:"workspaceName"`
	SelectCluster string    `gorm:"column:selectCluster; not null; default:null" json:"selectCluster"`
	IstioCheck string  `gorm:"column:istioCheck; not null; default:null" json:"istioCheck"`
}

type PROJECT struct {
	Project
	Status        string           `json:"status,omitempty"`
	ClusterName   string           `json:"clusterName,omitempty"`
	Resource      PROJECT_RESOURCE `json:"resource,omitempty"`
	Label         interface{}      `json:"labels,omitempty",`
	Annotation    interface{}      `json:"annotations,omitempty"`
	ResourceUsage interface{}      `json:"resourceUsage,omitempty"`
	Events        []EVENT          `json:"events"`
}

// type PROJECT_DETAIL struct {
// 	Name        string                 `json:"name"`
// 	Status      string                 `json:"status"`
// 	Label       map[string]interface{} `json:"labels"`
// 	Description string                 `json:"description"`
// 	Creator     string                 `json:"creator"`
// 	Owner       string                 `json:"owner"`
// 	CreatedAt   string                 `json:"createAt"`
// 	Resource    PROJECT_RESOURCE       `json:"resource"`
// 	Lable       map[string]interface{} `json:"lables"`
// 	Annotation  map[string]interface{} `json:"annotations"`
// 	Events      []EVENT                `json:"events"`
// }

type PROJECT_RESOURCE struct {
	DeploymentCount int `json:"deployment_count"`
	PodCount        int `json:"pod_count"`
	ServiceCount    int `json:"service_count"`
	CronjobCount    int `json:"cronjob_count"`
	JobCount        int `json:"job_count"`
	VolumeCount     int `json:"volume_count"`
}

type PROJECTS []PROJECT

func (Project) TableName() string {
	return "PROJECT_INFO"
}
