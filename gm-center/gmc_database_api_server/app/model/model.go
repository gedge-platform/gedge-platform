package model

import (
	"time"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
)

type Member struct {
	Num 				int 			`gorm:"column:memberNum; primary_key" json:"memberNum"`
	Id 					string 			`gorm:"column:memberId; not null" json:"memberId"`
	Name 				string 			`gorm:"column:memberName; not null" json:"memberName"`
	Email 				*string 		`gorm:"column:memberEmail; not null" json:"memberEmail"`
	Contact 			string 			`gorm:"column:memberContact; not null" json:"memberContact,omitempty"`
	Description 		string 			`gorm:"column:memberDescription" json:"memberDescription,omitempty"`
	Enabled 			int				`gorm:"column:memberEnabled; DEFAULT:0" json:"memberEnabled,omitempty"`
	RoleName 			string 			`gorm:"column:memberRole; DEFAULT:''" json:"memberRole"`
	Created_at 			time.Time 		`gorm:"column:created_at; DEFAULT:''" json:"created_at"`
	Logined_at 			time.Time 		`gorm:"column:logined_at" json:"logined_at,omitempty"`
  }


  type MemberWithPassword struct {
	Member
	Password				string 			`gorm:"column:memberPassword" json:"memberPassword"`
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

  type Cluster struct {
	Num				int			`gorm:"column:clusterNum; primary_key" json:"clusterNum"`
	Ip				string			`gorm:"column:ipAddr; not null; default:null" json:"ipAddr"`
	extIp				string			`gorm:"column:extIpAddr" json:"extIpAddr"`
	Name 				string 			`gorm:"column:clusterName; not null; default:null" json:"clusterName"`
	Role 				*string 			`gorm:"column:clusterRole; not null; default:null" json:"clusterRole"`
	Type				string			`gorm:"column:clusterType; not null; default:null" json:"clusterType"`
	Endpoint				string			`gorm:"column:clusterEndpoint; not null; default:null" json:"clusterEndpoint"`
	Creator				string			`gorm:"column:clusterCreator; not null; default:null" json:"clusterCreator"`
	State				string			`gorm:"column:clusterState; not null; default:null; DEFAULT:'pending'" json:"clusterState"`
	Version				string			`gorm:"column:kubeVersion" json:"kubeVersion"`
	Created_at 			time.Time 		`gorm:"column:created_at" json:"created_at"`
  }

// Set Cluster table name to be `CLUSTER_INFO`
func (Cluster) TableName() string {
	return "CLUSTER_INFO"
  }

  type Workspace struct {
	Num				int			`gorm:"column:workspaceNum; primary_key" json:"workspaceNum"`
	Name 				string 			`gorm:"column:workspaceName; not null; default:null" json:"workspaceName"`
	Description 				string 			`gorm:"column:workspaceDescription; not null; default:null" json:"workspaceDescription"`
	SelectCluster				string			`gorm:"column:selectCluster; not null; default:null" json:"selectCluster"`
	Owner				string			`gorm:"column:workspaceOwner; not null; default:null" json:"workspaceOwner"`
	Creator				string			`gorm:"column:workspaceCreator; not null; default:null" json:"workspaceCreator"`
	Created_at 			time.Time 		`gorm:"column:created_at" json:"created_at"`
  }

// Set Cluster table name to be `CLUSTER_INFO`
func (Workspace) TableName() string {
	return "WORKSPACE_INFO"
  }

  type Project struct {
	Num				int			`gorm:"column:projectNum; primary_key" json:"projectNum"`
	Name 				string 			`gorm:"column:projectName; not null; default:null" json:"projectName"`
	Postfix 				string 			`gorm:"column:projectPostfix; not null; default:null" json:"projectPostfix"`
	Description 				string 			`gorm:"column:projectDescription; not null; default:null" json:"projectDescription"`
	Type 				string 			`gorm:"column:projectType; not null; default:null" json:"projectType"`
	Owner				string			`gorm:"column:projectOwner; not null; default:null" json:"projectOwner"`
	Creator				string			`gorm:"column:projectCreator; not null; default:null" json:"projectCreator"`
	Created_at 			time.Time 		`gorm:"column:created_at" json:"created_at"`
	WorkspaceName				string			`gorm:"column:workspaceName; not null; default:null" json:"workspaceName"`
  }

// Set Cluster table name to be `CLUSTER_INFO`
func (Project) TableName() string {
	return "PROJECT_INFO"
  }

  type App struct {
	Num				int			`gorm:"column:appNum; primary_key" json:"appNum"`
	Name 				string 			`gorm:"column:appName; not null; default:null" json:"appName"`
	Description 				string 			`gorm:"column:appDescription; not null; default:null" json:"appDescription"`
	Category 				string 			`gorm:"column:appCategory; not null; default:null" json:"appCategory"`
	Installed				int			`gorm:"column:appInstalled; not null; default:null" json:"appInstalled"`
	Created_at 			time.Time 		`gorm:"column:created_at" json:"created_at"`
  }

// Set Cluster table name to be `CLUSTER_INFO`
func (App) TableName() string {
	return "APPSTORE_INFO"
  }


// DBMigrate will create and migrate the tables, and then make the some relationships if necessary
func DBMigrate(db *gorm.DB) *gorm.DB {
	db.AutoMigrate(&Member{})
	return db
}
