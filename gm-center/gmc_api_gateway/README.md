# GM-Center Database API Server
A RESTful API for GM-Center Database with Go

## Installation & Run
```bash
# Download this project
# (not yet) go get github.com/gedge-platform/gm-center/main/gmc_api_gateway
git clone https://github.com/gedge-platform/gm-center.git
```

Before running API server, you should set the .env file with yours or set the your .env with my values on [.env](github.com/gedge-platform/gm-center/blob/main/gmc_api_gateway/config/config.go)
```go
DB_DIALECT=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password
DB_NAME=gedge
DB_CHARSET=utf8

PORT=:8010
CORS=CORS_ORIGIN

SIGNINGKEY=YOUR_SIGNINGKEY
```

```bash
# Build and Run
cd gmc_api_gateway
go mod tidy
go build && ./main
# or
go run main.go

# API Endpoint : http://127.0.0.1:8010
```

## Structure
```
├── app
│   ├── api
│   │   ├── account.go
│   │   ├── apps.go
│   │   ├── auth.go
│   │   ├── callListModel.go
│   │   ├── clusters.go
│   │   ├── cronjob.go
│   │   ├── custom.go
│   │   ├── deployment.go
│   │   ├── event.go
│   │   ├── job.go
│   │   ├── members.go
│   │   ├── monitoring.go
│   │   ├── namespace.go
│   │   ├── nowMonit.go
│   │   ├── pod.go
│   │   ├── projects.go
│   │   ├── realMonitoring.go
│   │   ├── service.go
│   │   ├── workspaces.go
│   └── common
│       └── error.go
│       └── httpUtil.go
│       └── Util.go
│   └── db
│       └── db.go
│       └── db.sql
│   └── model
│       └── apps.go
│       └── auth.go
│       └── authorize.go
│       └── clusters.go
│       └── cronjob.go
│       └── deployment.go
│       └── event.go
│       └── job.go
│       └── kubernetes.go
│       └── members.go
│       └── monitoring.go
│       └── ownerReferences.go
│       └── params.go
│       └── pod.go
│       └── projects.go
│       └── service.go
│       └── workspaces.go
│   └── routes
│       └── routes.go
├── config
│   └── config.go
├── docs
│   └── docs.go
│   └── swagger.json
│   └── swagger.yaml
└── .env.sample
└── main.go
└── go.mod
└── README.md
```

## API

#### Lists
- members
- apps
- clusters
- projects
- deployments
- workspaces
- pods
- jobs
- cronjobs
- services
- monitoring

<br />

### members, apps, clusters, projects, deployments, workspaces, pods, jobs, cronjobs, services
---
#### /gmcapi/v1/{lists_name}
* `GET` : Get all {lists_name}
* `POST` : Create a new {lists_name}

#### /api/v1/{lists_name}/:{id or name}
* `GET` : Get a {lists_name}/:{id or name}
* `PUT` : Update a {lists_name}/:{id or name}
* `DELETE` : Delete a {lists_name}/:{id or name}


<br />

### monitoring
---

#### /kube/v1/monitoring
* `GET` : Get a /monitoring/

#### /kube/v1/monitoring/:kind
* `GET` : Get a /monitoring/:{kind}

#### /kube/v1/monitoring/realtime
* `GET` : Get a /monitoring/realtime

#### /kube/v1/monitoring/realtime/:kind
* `GET` : Get a /monitoring/realtime/:{kind}

---

### To do ✓
- [x] MEMBER_INFO
- [x] CLUSTER_INFO
- [X] PROJECT_INFO
- [x] WORKSPACE_INFO
- [x] APPSTORE_INFO
- [x] KUBERNETES
- [ ] APP_DETAIL
- [ ] REFACTORING


### In Progress
- [x] APP_DETAIL

### Done ✓
- [x] First Commit
- [x] DATABASE API
- [x] KUBERNETES API