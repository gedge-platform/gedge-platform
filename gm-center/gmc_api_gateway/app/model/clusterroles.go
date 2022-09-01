package model

import (
	"time"
)

type CLUSTERROLE struct {
	Name        string      `json:"name"`
	Lable       interface{} `json:"label,omitempty"`
	Annotations interface{} `json:"annotations,omitempty"`
	Rules       interface{} `json:"rules"`
	Cluster     string      `json:"cluster"`
	Workspace   string      `json:"workspace,omitempty"`
	UserName    string      `json:"user,omitempty"`
	CreateAt    time.Time   `json:"createAt"`
}

type CLUSTERROLEs []CLUSTERROLEs

func (CLUSTERROLE) TableName() string {
	return "CLUSTERROLE_INFO"
}
