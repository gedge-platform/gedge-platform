# GM-Center Database API Server

A RESTful API for GM-Center Database with Go

## Installation & Run

```bash
# Download this project
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

PORT=8010
CORS=CORS_ORIGIN

SIGNINGKEY=YOUR_SIGNINGKEY

#Spider
SPIDER_URL="여기에 https 를 뺀 IP 주소 입력"

# PROMETHEUS
PROMETHEUS="url"
INFLUXDB="influxdb"
INFLUX_TOKEN="influx token"

# CEPH
CEPH="url"
CEPH_ID="id"
CEPH_PW="pw"

# GEOCODER
# https://www.vworld.kr/ 통해 발급
GEO_KEY="key"
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
│   └── common
│   └── controller
│   └── database
│   └── model
│   └── routes
├── config
├── docs
└── .env.sample
└── Dockerfile
└── README.md
└── docker-compose.yml
└── go.mod
└── go.test.sh
└── main.go
```

## API

#### Lists

- members
- clusters
- workspaces
- projects
  - user
  - system
- request
- deployments
- pods
- jobs
- cronjobs
- services
- pvs
- pvcs
- secrets
- storageclasses
- clusterroles
- roles
- configmaps
- daemonsets
- statefulsets
- serviceaccounts
- clusterrolebindings
- network
- monitoring

<br />

### members, clusters, workspaces, projects, deployments, pods, jobs, cronjobs, services, pvs, pvcs, secrets, storageclasses, clusterroles, roles, configmaps, daemonsets, statefulsets, serviceaccounts, clusterrolebindings

---

#### /gmcapi/v1/{lists_name}

- `GET` : Get all {lists_name}
- `POST` : Create a new {lists_name}

#### /api/v1/{lists_name}/:{id or name}

- `GET` : Get a {lists_name}/:{id or name}
- `PUT` : Update a {lists_name}/:{id or name}
- `DELETE` : Delete a {lists_name}/:{id or name}

<br />

### monitoring

---

#### /kube/v1/monitoring

- `GET` : Get a /monitoring/

#### /kube/v1/monitoring/:kind

- `GET` : Get a /monitoring/:{kind}

#### /kube/v1/monitoring/realtime

- `GET` : Get a /monitoring/realtime

#### /kube/v1/monitoring/realtime/:kind

- `GET` : Get a /monitoring/realtime/:{kind}

---

### To do ✓

- [ ] PACAKGEING_DEPLOY
- [ ] REFACTORING

### In Progress

- [x] Virtual Machine Control

### Done ✓

- [x] First Commit
- [x] DATABASE API
- [x] KUBERNETES API
- [x] MONITORING API
- [x] MEMBER_INFO
- [x] CLUSTER_INFO
- [x] PROJECT_INFO
- [x] WORKSPACE_INFO
