package model

import (
	"time"
)

type ROLE struct {
	Name        string      `json:"name"`
	Project     string      `json:"project"`
	Cluster     string      `json:"cluster"`
	Workspace   string      `json:"workspace,omitempty"`
	UserName    string      `json:"user,omitempty"`
	Lable       interface{} `json:"label,omitempty"`
	Annotations interface{} `json:"annotations,omitempty"`
	Rules       interface{} `json:"rules"`
	CreateAt    time.Time   `json:"createAt"`
}

type ROLEs []ROLEs

func (ROLE) TableName() string {
	return "ROLE_INFO"
}
