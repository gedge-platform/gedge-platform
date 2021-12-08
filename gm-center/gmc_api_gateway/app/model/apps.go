package model

import (
	"time"
)

type App struct {
	Num         int       `gorm:"column:appNum; primary_key" json:"appNum"`
	Name        string    `gorm:"column:appName; not null" json:"appName"`
	Description string    `gorm:"column:appDescription; not null" json:"appDescription"`
	Category    string    `gorm:"column:appCategory; not null" json:"appCategory"`
	Installed   int       `gorm:"column:appInstalled; not null" json:"appInstalled"`
	Created_at  time.Time `gorm:"column:created_at" json:"created_at"`
}

// Set Cluster table name to be `CLUSTER_INFO`
func (App) TableName() string {
	return "APPSTORE_INFO"
}
