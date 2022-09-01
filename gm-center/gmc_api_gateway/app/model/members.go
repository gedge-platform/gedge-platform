package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Member struct {
	ObjectId   primitive.ObjectID `json:"objectId,omitempty" bson:"_id"`
	Id         string             `json:"memberId,omitempty" bson:"memberId" validate:"required"`
	Name       string             `json:"memberName,omitempty" bson:"memberName" validate:"required"`
	Password   string             `json:"password,omitempty" bson:"password" validate:"required,gte=0,lte=10"`
	Email      string             `json:"email,omitempty" bson:"email" validate:"required,email"`
	Contact    string             `json:"contact,omitempty" bson:"contact"`
	Enabled    bool               `json:"enabled,omitempty" bson:"enabled"`
	RoleName   string             `json:"memberRole,omitempty" bson:"memberRole"`
	Created_at time.Time          `json:"created_at,omitempty bson:"created_at"`
	Logined_at primitive.DateTime `json:"logined_at,omitempty"`
}

type RequestMember struct {
	// _id        primitive.ObjectID `json:"objectId,omitempty" bson:"_id"`
	Id         string    `json:"memberId,omitempty" bson:"memberId"`
	Name       string    `json:"memberName,omitempty" bson:"memberName"`
	Password   string    `json:"password,omitempty" bson:"password" validate:"gte=0,lte=10"`
	Email      string    `json:"email,omitempty" bson:"email"`
	Contact    string    `json:"contact,omitempty" bson:"contact"`
	Enabled    bool      `json:"enabled,omitempty" bson:"enabled"`
	RoleName   string    `json:"memberRole,omitempty" bson:"memberRole"`
	Created_at time.Time `json:"created_at,omitempty" bson:"created_at"`
	// Logined_at primitive.DateTime `json:"logined_at,omitempty"`
}

type MemberWithPassword struct {
	Member
	Password string `gorm:"column:memberPassword" json:"memberPassword" validate:"required"`
}

// func (m *Member) Enable() {
// 	m.Enabled = true
// }

// func (m *Member) Disable() {
// 	m.Enabled = false
// }
