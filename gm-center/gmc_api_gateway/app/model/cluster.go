package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Cluster struct {
	_id        primitive.ObjectID `json:"objectId,omitempty" bson:"_id"`
	Endpoint   string             `json:"clusterEndpoint,omitempty" bson:"clusterEndpoint" validate:"required"`
	Type       string             `json:"clusterType,omitempty" bson:"clusterType" validate:"required"`
	Name       string             `json:"clusterName,omitempty" bson:"clusterName" validate:"required"`
	Token      string             `json:"token,omitempty" bson:"token" validate:"required"`
	Status     string             `json:"status,omitempty" bson:"status" `
	CloudType  string             `json:"cloudType,omitempty" bson:"cloudType" `
	Address    string             `json:"address,omitempty" bson:"address" `
	Point      interface{}        `json:"point,omitempty" bson:"point" `
	Created_at time.Time          `json:"created_at,omitempty"`
}

type RequestCluster struct {
	_id       primitive.ObjectID `json:"objectId,omitempty" bson:"_id"`
	Endpoint  string             `json:"clusterEndpoint,omitempty" bson:"clusterEndpoint"`
	Type      string             `json:"clusterType,omitempty" bson:"clusterType"`
	Name      string             `json:"clusterName,omitempty" bson:"clusterName"`
	Token     string             `json:"token,omitempty" bson:"token"`
	Status    string             `json:"status,omitempty" bson:"status" `
	Address   string             `json:"address,omitempty" bson:"address" `
	CloudType string             `json:"cloudType,omitempty" bson:"cloudType" `
}

type CLUSTER struct {
	Cluster
	// Status                  string                   `json:"status"`
	// Network                 string                   `json:"network"`
	GpuCnt int `json:"gpuCnt"`
	// Gpu           []map[string]interface{} `json:"gpu,omitempty"`
	ResourceUsage interface{} `json:"resourceUsage"`
	NodeCnt       int         `json:"nodeCnt"`
}

type CLUSTER_DETAIL struct {
	Cluster
	Gpu      []map[string]interface{} `json:"gpu"`
	Resource interface{}              `json:"resource"`
	Nodes    []NODE                   `json:"nodes"`
	Events   []EVENT                  `json:"events"`
}

type NODE struct {
	Name                    string      `json:"name"`
	NodeType                string      `json:"type"`
	IP                      string      `json:"nodeIP"`
	Version                 string      `json:"kubeVersion"`
	Os                      string      `json:"os,omitempty"`
	Kernel                  string      `json:"kernel,omitempty"`
	Label                   interface{} `json:"labels,omitempty"`
	Annotation              interface{} `json:"annotations,omitempty"`
	CreateAt                time.Time   `json:"created_at"`
	Allocatable             interface{} `json:"allocatable,omitempty"`
	Capacity                interface{} `json:"capacity,omitempty"`
	ContainerRuntimeVersion interface{} `json:"containerRuntimeVersion"`

	Addresses []ADDRESSES `json:"addresses,omitempty"`
}
type GPU struct {
	Name string `json:"name"`
}
type ADDRESSES struct {
	Address string `json:"address,omitempty"`
	Type    string `json:"type,omitempty"`
}
