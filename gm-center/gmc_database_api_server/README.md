# GM-Center Database API Server
A RESTful API for GM-Center Database with Go

## Installation & Run
```bash
# Download this project
go get github.com/gedge-platform/gm-center/main/gmc_database_api_server
```

Before running API server, you should set the database config with yours or set the your database config with my values on [config.go](github.com/gedge-platform/gm-center/main/gmc_database_api_server/blob/main/config/config.go)
```go
func GetConfig() *Config {
	return &Config{
		DB: &DBConfig{
			Dialect:  "mysql",
			Username: "username",
			Password: "userpassword",
			Name:     "gedge",
			Charset:  "utf8",
		},
	}
}
```

```bash
# Build and Run
cd gmc_database_api_server
go build
./gmc_database_api_server

# API Endpoint : http://127.0.0.1:8000
```

## Structure
```
├── app
│   ├── app.go
│   ├── handler          // Our API core handlers
│   │   ├── common.go    // Common response functions
│   │   ├── members.go  // APIs for Member model
│   │   ├── clusters.go  // APIs for clusters model
│   │   ├── projects.go  // APIs for clusters model
│   │   ├── workspaces.go  // APIs for clusters model
│   │   ├── apps.go  // APIs for clusters model
│   └── model
│       └── model.go     // Models for our application
├── config
│   └── config.go        // Configuration
└── main.go
└── go.mod
└── README.md
```

## API

#### Lists
- members
- clusters
- projects
- workspaces
- apps

#### /{lists_name}
* `GET` : Get all {lists_name}
* `POST` : Create a new {lists_name}

#### /{lists_name}/:{id or name}
* `GET` : Get a {lists_name}
* `PUT` : Update a {lists_name}
* `DELETE` : Delete a {lists_name}

#### /members/:id/enabled
* `PUT` : Enabled a members
* `DELETE` : Disabled a members


---

### To do ✓
- [x] MEMBER_INFO
- [x] CLUSTER_INFO
- [X] PROJECT_INFO
- [x] WORKSPACE_INFO
- [x] APPSTORE_INFO
- [ ] APP_DETAIL


### In Progress
- [x] APP_DETAIL

### Done ✓
- [x] First Commit
- [x] MEMBER_INFO
  - [x] GetAllMembers(GET, "/members")
  - [x] CreateMember(POST, "/members")
```
{
    "memberId": "memberId",
    "memberName": "memberName",
    "memberEmail": "member@gedge.com",
    "memberPassword": "memberPassword"
}
```
  - [x] GetMember(GET, "/members/{id}")
  - [x] UpdateMember(PUT, "/members/{id}")
```
{
    "memberId": "memberId",
    "memberName": "memberName",
    "memberEmail": "member@gedge.com",
    "memberPassword": "memberPassword"
}
```
  - [x] DeleteMember(DELETE, "/members/{id}")

- [x] CLUSTER_INFO
  - [x] GetAllClusters(GET, "/clusters")
  - [x] CreateCluster(POST, "/clusters")
```
{
	"ipAddr": "127.0.0.1",
	"clusterName": "value",
	"clusterRole": "value",
	"clusterType": "value",
	"clusterEndpoint": "10.10.10.10",
	"clusterCreator": "value",
}
```
  - [x] GetCluster(GET, "/clusters/{name}")
  - [x] UpdateCluster(PUT, "/clusters/{name}")
```
{
	"ipAddr": "127.0.0.1",
	"clusterName": "value",
	"clusterRole": "value",
	"clusterType": "value",
	"clusterEndpoint": "10.10.10.10",
	"clusterCreator": "value",
}
```
  - [x] DeleteCluster(DELETE, "/clusters/{name}")


- [x] WORKSPACE_INFO
  - [x] GetAllWorkspaces(GET, "/workspaces")
  - [x] CreateWorkspace(POST, "/workspaces")
```
{
	"clusterName": "value",
	"workspaceName": "value",
	"workspaceDescription": "value",
	"selectCluster": "1,3",
	"workspaceOwner": "value",
	"workspaceCreator": "value"
}
```
  - [x] GetWorkspace(GET, "/workspaces/{name}")
  - [x] UpdateWorkspace(PUT, "/workspaces/{name}")
```
{
	"clusterName": "value",
	"workspaceName": "value",
	"workspaceDescription": "value",
	"selectCluster": "1,3",
	"workspaceOwner": "value",
	"workspaceCreator": "value"
}
```
  - [x] DeleteWorkspace(DELETE, "/workspaces/{name}")


- [x] PROJECT_INFO
  - [x] GetAllProjects(GET, "/projects")
  - [x] CreateProject(POST, "/projects")
```
{
	"projectName": "value",
	"projectPostfix": "value",
	"projectDescription": "value",
	"projectType": "value",
	"projectOwner": "value",
	"projectCreator": "value",
	"workspaceName": "value"
}
```
  - [x] GetProject(GET, "/projects/{name}")
  - [x] UpdateProject(PUT, "/projects/{name}")
```
{
	"projectName": "value",
	"projectPostfix": "value",
	"projectDescription": "value",
	"projectType": "value",
	"projectOwner": "value",
	"projectCreator": "value",
	"workspaceName": "value"
}
```
  - [x] DeleteProject(DELETE, "/projects/{name}")

- [x] APPSTORE_INFO
  - [x] GetAllApps(GET, "/apps")
  - [x] CreateApp(POST, "/apps")
```
{
	"appName": "value",
	"appDescription": "value",
	"appCategory": "value",
	"appInstalled": 0
}
```
  - [x] GetApp(GET, "/apps/{name}")
  - [x] UpdateApp(PUT, "/apps/{name}")
```
{
	"appName": "value",
	"appDescription": "value",
	"appCategory": "value",
	"appInstalled": 0
}
```
  - [x] DeleteApp(DELETE, "/apps/{name}")

