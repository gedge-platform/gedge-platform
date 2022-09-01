package model

import (
	"time"
)

type SERVICEACCOUNT struct {
	Name        string      `json:"name"`
	NameSpace   string      `json:"namespace"`
	Cluster     string      `json:"cluster"`
	Workspace   string      `json:"workspace,omitempty"`
	UserName    string      `json:"user,omitempty"`
	Secrets     interface{} `json:"secrets, omitempty"`
	SecretCnt   int         `json:"secretCnt"`
	Label       interface{} `json:"label,omitempty"`
	Annotations interface{} `json:"annotations, omitempty"`
	CreateAt    time.Time   `json:"createAt"`
}

type SERVICEACCOUNTs []SERVICEACCOUNTs

func (SERVICEACCOUNT) TableName() string {
	return "SERVICEACCOUNT_INFO"
}
