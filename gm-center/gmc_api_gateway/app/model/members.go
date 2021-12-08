package model

import (
	"time"
)

type Member struct {
	Num         int       `gorm:"column:memberNum; primary_key" json:"memberNum"`
	Id          string    `gorm:"column:memberId; not null" json:"memberId" validate:"required"`
	Name        string    `gorm:"column:memberName; not null" json:"memberName" validate:"required"`
	Email       string    `gorm:"column:memberEmail; not null" json:"memberEmail" validate:"required"`
	Contact     string    `gorm:"column:memberContact; not null" json:"memberContact,omitempty"`
	Description string    `gorm:"column:memberDescription" json:"memberDescription,omitempty"`
	Enabled     int       `gorm:"column:memberEnabled; DEFAULT:0" json:"memberEnabled,omitempty"`
	RoleName    string    `gorm:"column:memberRole; DEFAULT:''" json:"memberRole"`
	Created_at  time.Time `gorm:"column:created_at; DEFAULT:''" json:"created_at"`
	Logined_at  time.Time `gorm:"column:logined_at" json:"logined_at,omitempty"`
}

type MemberWithPassword struct {
	Member
	Password string `gorm:"column:memberPassword" json:"memberPassword" validate:"required"`
}

// Set Member table name to be `MEMBER_INFO`
func (Member) TableName() string {
	return "MEMBER_INFO"
}

// Set Member table name to be `MEMBER_INFO`
func (MemberWithPassword) TableName() string {
	return "MEMBER_INFO"
}

func (m *Member) Enable() {
	m.Enabled = 1
}

func (m *Member) Disable() {
	m.Enabled = 0
}
