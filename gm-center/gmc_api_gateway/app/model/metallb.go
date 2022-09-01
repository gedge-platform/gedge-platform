package model

import (
	"time"
)

type METALLB struct {
	Name       string      `json:"name"`
	NameSpace  string      `json:"namespace"`
	Cluster    string      `json:"cluster"`
	Addresses  interface{} `json:"addresses,omitempty"`
	AutoAssign interface{} `json:"autoAssign,omitempty"`
	// Annotations interface{} `json:"annotations,omitempty"`
	// DataCnt     int         `json:"dataCnt"`
	CreateAt time.Time `json:"createAt"`
}
type METALLB_DETAIL struct {
	METALLB
	Service []LoadBalancerService `json:"services,omitempty"`
}
type LoadBalancerService struct {
	Name       string      `json:"name"`
	Workspace  string      `json:"workspace,omitempty"`
	Cluster    string      `json:"cluster"`
	Project    string      `json:"project"`
	User       string      `json:"user,omitempty"`
	Type       string      `json:"type"`
	ClusterIp  string      `json:"clusterIp"`
	ExternalIp interface{} `json:"externalIp"`
}

// type METALLB []CONFIGMAPs

func (METALLB) TableName() string {
	return "METALLB_INFO"
}
