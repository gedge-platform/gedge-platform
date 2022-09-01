package model

import (
	"time"
)

type SECRET struct {
	Name            string      `json:"name"`
	Namespace       string      `json:"namespace"`
	UserName        string      `json:"user"`
	Type            string      `json:"type"`
	DataCnt         int         `json:"dataCnt,omitempty"`
	Data            interface{} `json:"data,omitempty"`
	Cluster         string      `json:"clusterName"`
	Workspace       string      `json:"workspaceName"`
	OwnerReferences interface{} `json:"ownerReferences,omitempty"`
	Lable           interface{} `json:"label,omitempty"`
	Annotations     interface{} `json:"annotations,omitempty"`
	CreateAt        time.Time   `json:"createAt"`
	Events          []EVENT     `json:"events"`
}

type SECRETS []SECRET

func (SECRET) TableName() string {
	return "SECRET_INFO"
}
