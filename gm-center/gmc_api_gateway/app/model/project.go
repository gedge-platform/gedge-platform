package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Project struct {
	_id           primitive.ObjectID `json:"objectId,omitempty" bson:"_id"`
	Name          string             `json:"projectName,omitempty" bson:"projectName" validate:"required"`
	Description   string             `json:"projectDescription,omitempty" bson:"projectDescription"`
	Type          string             `json:"projectType,omitempty" bson:"projectType" validate:"required"`
	Owner         primitive.ObjectID `json:"projectOwner,omitempty" bson:"projectOwner"`
	Creator       primitive.ObjectID `json:"projectCreator,omitempty" bson:"projectCreator"`
	MemberName    string             `json:"memberName,omitempty" bson:"memberName" validate:"required"`
	WorkspaceName string             `json:"workspaceName,omitempty" bson:"workspaceName" validate:"required"`
	Workspace     primitive.ObjectID `json:"workspace,omitempty" bson:"workspace"`
	Selectcluster []ProjectClusters  `json:"selectCluster,omitempty" bson:"selectCluster"`
	ClusterName   []string           `json:"clusterName,omitempty" bson:"selectCluster2"`
	IstioCheck    string             `json:"istioCheck,omitempty" bson:"istioCheck"`
	Created_at    time.Time          `json:"created_at,omitempty"`
}

type ProjectClusters struct {
	Cluster primitive.ObjectID `json:"cluster,omitempty" bson:"cluster"`
}

type RequestProject struct {
	_id           primitive.ObjectID   `json:"objectId,omitempty" bson:"_id"`
	Name          string               `json:"projectName,omitempty" bson:"projectName"`
	Description   string               `json:"projectDescription,omitempty" bson:"projectDescription"`
	Type          string               `json:"projectType,omitempty" bson:"projectType"`
	Owner         primitive.ObjectID   `json:"projectOwner,omitempty" bson:"projectOwner"`
	Creator       primitive.ObjectID   `json:"projectCreator,omitempty" bson:"projectCreator"`
	MemberName    string               `json:"memberName,omitempty" bson:"memberName"`
	WorkspaceName string               `json:"workspaceName,omitempty" bson:"workspaceName"`
	Workspace     primitive.ObjectID   `json:"workspace,omitempty" bson:"workspace"`
	Selectcluster []primitive.ObjectID `json:"selectCluster,omitempty" bson:"selectCluster"`
	ClusterName   []string             `json:"clusterName,omitempty" bson:"selectCluster2"`
	Created_at    time.Time            `json:"created_at,omitempty"`
	IstioCheck    string               `json:"istioCheck,omitempty" bson:"istioCheck"`
}

type NewProject struct {
	_id           primitive.ObjectID   `json:"objectId,omitempty" bson:"_id"`
	Name          string               `json:"projectName,omitempty" bson:"projectName" validate:"required"`
	Description   string               `json:"projectDescription,omitempty" bson:"projectDescription"`
	Type          string               `json:"projectType,omitempty" bson:"projectType" validate:"required"`
	Owner         primitive.ObjectID   `json:"projectOwner,omitempty" bson:"projectOwner" validate:"required"`
	Creator       primitive.ObjectID   `json:"projectCreator,omitempty" bson:"projectCreator" validate:"required"`
	Workspace     primitive.ObjectID   `json:"workspace,omitempty" bson:"workspace" validate:"required"`
	Tag string             `json:"projectTag,omitempty" bson:"projectTag" validate:"required"`
	Selectcluster []primitive.ObjectID `json:"selectCluster,omitempty" bson:"selectCluster" validate:"required"`
	IstioCheck    string               `json:"istioCheck,omitempty" bson:"istioCheck"`
	Created_at    time.Time            `json:"created_at,omitempty"`
}

type DBProject struct {
	ObjectID    primitive.ObjectID `json:"objectId,omitempty" bson:"_id"`
	Name        string             `json:"projectName" bson:"projectName" validate:"required"`
	Description string             `json:"projectDescription" bson:"projectDescription" validate:"required"`
	Type        string             `json:"projectType" bson:"projectType" validate:"required"`
	// Owner         primitive.ObjectID `json:"projectOwner,omitempty" bson:"projectOwner"`
	// Creator       primitive.ObjectID `json:"projectCreator,omitempty" bson:"projectCreator"`
	Tag string             `json:"projectTag,omitempty" bson:"projectTag" validate:"required"`
	MemberName    string      `json:"memberName,omitempty" bson:"memberName" validate:"required"`
	Workspace     DBWorkspace `json:"workspace,omitempty" bson:"workspace"`
	Selectcluster []Cluster   `json:"selectCluster,omitempty" bson:"selectCluster"`
	Created_at    time.Time   `json:"created_at,omitempty"`
	IstioCheck    string      `json:"istioCheck,omitempty" bson:"istioCheck"`
}

type USERPROJECT struct {
	DBProject
	Events interface{} `json:"events"`
	// Status        string           `json:"status,omitempty"`
	Detail []PROJECT_DETAIL `json:"DetailInfo,omitempty"`
	// Resource      PROJECT_RESOURCE `json:"resource,omitempty"`
	// Label         interface{}      `json:"labels,omitempty",`
	// Annotation    interface{}      `json:"annotations,omitempty"`
	// ResourceUsage interface{}      `json:"resourceUsage,omitempty"`
	// Events        []EVENT          `json:"events"`
}
type SYSTEMPROJECT struct {
	Name        string         `json:"projectName"`
	ClusterName string         `json:"clusterName,omitempty"`
	CreateAt    time.Time      `json:"created_at"`
	Status      string         `json:"status"`
	Events      interface{}    `json:"events,omitempty"`
	Detail      PROJECT_DETAIL `json:"DetailInfo,omitempty"`
}
type PROJECT_DETAIL struct {
	// Project
	ClusterName   string                 `json:"clusterName,omitempty"`
	ProjectName   string                 `json:"Name,omitempty"`
	CreateAt      time.Time              `json:"created_at,omitempty"`
	Status        string                 `json:"status,omitempty"`
	Label         interface{}            `json:"labels,omitempty"`
	Annotation    interface{}            `json:"annotations,omitempty"`
	Resource      map[string]interface{} `json:"resource,omitempty"`
	ResourceUsage interface{}            `json:"resourceUsage,omitempty"`
}

type POST_PROJECT struct {
	MemberName         string   `json:"memberName,omitempty"`
	ProjectName        string   `json:"projectName,omitempty"`
	ProjectDescription string   `json:"projectDescription,omitempty"`
	ProjectType        string   `json:"projectType,omitempty"`
	WorkspaceName      string   `json:"workspaceName,omitempty"`
	ClusterName        []string `json:"clusterName,omitempty"`
	IstioCheck         bool     `json:"istioCheck,omitempty"`
}
