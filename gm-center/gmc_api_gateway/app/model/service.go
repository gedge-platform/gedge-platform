package model

import (
	"time"
)

type SERVICE struct {
	Name            string      `json:"name"`
	Workspace       string      `json:"workspace,omitempty"`
	Cluster         string      `json:"cluster"`
	Project         string      `json:"project"`
	User            string      `json:"user"`
	Type            string      `json:"type"`
	Ports           interface{} `json:"port"`
	ClusterIp       string      `json:"clusterIp"`
	ExternalIp      string      `json:"externalIp,omitempty"`
	Selector        interface{} `json:"selector,omitempty"`
	Label           interface{} `json:"label,omitempty"`
	Annotation      interface{} `json:"annotation,omitempty"`
	SessionAffinity string      `json:"sessionAffinity,omitempty"`
	Events          []EVENT     `json:"events,omitempty"`
	CreateAt        time.Time   `json:"createAt"`
	// UpdateAt        time.Time   `json:"updateAt"`
}

type SERVICELISTS struct {
	Pods      []SERVICEPOD `json:"pods"`
	Workloads interface{}  `json:"workloads"`
}

type SERVICEDEPLOYMENT struct {
	Name     string    `json:"name"`
	UpdateAt time.Time `json:"updateAt"`
}

type SERVICEPOD struct {
	Ip       string `json:"ip"`
	NodeName string `json:"nodeName"`
	Name     string `json:"name"`
}
