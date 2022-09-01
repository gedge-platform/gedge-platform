package model

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Request struct {
	_id           primitive.ObjectID `json:"objectId,omitempty" bson:"_id"`
	Id            string             `json:"request_id,omitempty" bson:"request_id" validate:"required"`
	Status        string             `json:"status,omitempty" bson:"status"`
	Message       string             `json:"message,omitempty" bson:"message"`
	WorkspaceName string             `json:"workspaceName,omitempty" bson:"workspaceName" validate:"required"`
	Workspace     primitive.ObjectID `json:"workspace,omitempty" bson:"workspace"`
	ProjectName   string             `json:"projectName,omitempty" bson:"projectName" validate:"required"`
	Project       primitive.ObjectID `json:"project,omitempty" bson:"project"`
	Date          primitive.DateTime `json:"date,omitempty" bson:"date" validate:"required"`
	ClusterName   string             `json:"clusterName,omitempty" bson:"clusterName"`
	Cluster       primitive.ObjectID `json:"cluster,omitempty" bson:"cluster"`
	Name          string             `json:"name,omitempty" bson:"name"`
	Reason        string             `json:"reason,omitempty" bson:"reason"`
	Type          string             `json:"type,omitempty" bson:"type"`
	MemberName    primitive.ObjectID `json:"memberName,omitempty" bson:"requestCreator"`
}

type RequestUpdate struct {
	_id         primitive.ObjectID `json:"objectId,omitempty" bson:"_id"`
	Id          string             `json:"request_id,omitempty" bson:"request_id"`
	Status      string             `json:"status,omitempty" bson:"status"`
	Message     string             `json:"message,omitempty" bson:"message"`
	Workspace   primitive.ObjectID `json:"workspace,omitempty" bson:"workspace"`
	Project     primitive.ObjectID `json:"project,omitempty" bson:"project"`
	Date        primitive.DateTime `json:"date,omitempty" bson:"date"`
	Code        int                `json:"code,omitempty" bson:"code"`
	ClusterName string             `json:"cluster_name,omitempty" bson:"cluster_name"`
	Cluster     primitive.ObjectID `json:"cluster,omitempty" bson:"cluster"`
	Name        string             `json:"name,omitempty" bson:"name"`
	Reason      string             `json:"reason,omitempty" bson:"reason"`
	Type        string             `json:"type,omitempty" bson:"type"`
	MemberName  primitive.ObjectID `json:"memberName,omitempty" bson:"requestCreator"`
}

type NewRequest struct {
	_id        primitive.ObjectID `json:"objectId,omitempty" bson:"_id"`
	Id         string             `json:"request_id,omitempty" bson:"request_id" validate:"required"`
	Status     string             `json:"status,omitempty" bson:"status" validate:"required"`
	Message    string             `json:"message,omitempty" bson:"message"`
	Workspace  primitive.ObjectID `json:"workspace,omitempty" bson:"workspace" validate:"required"`
	Project    primitive.ObjectID `json:"project,omitempty" bson:"project" validate:"required"`
	Date       primitive.DateTime `json:"date,omitempty" bson:"date"`
	Cluster    primitive.ObjectID `json:"cluster,omitempty" bson:"cluster"`
	Name       string             `json:"name,omitempty" bson:"name"`
	Reason     string             `json:"reason,omitempty" bson:"reason"`
	Type       string             `json:"type,omitempty" bson:"type"`
	MemberName string             `json:"memberName,omitempty" bson:"requestCreator"`
}

type DBRequest struct {
	ObjectID   interface{}        `json:"objectId" bson:"_id"`
	Id         string             `json:"request_id"`
	Status     string             `json:"status" `
	Message    string             `json:"message" `
	Workspace  string             `json:"workspace" `
	Project    string             `json:"project" `
	Date       primitive.DateTime `json:"date" `
	Cluster    string             `json:"cluster" `
	Name       string             `json:"name" `
	Reason     string             `json:"reason" `
	Type       string             `json:"type" `
	MemberName string             `json:"memberName" `
}
