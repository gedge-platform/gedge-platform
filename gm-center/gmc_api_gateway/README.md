# GM-Center API Gateway
GM-Center API Gateway with Krakend OSS

## Installation & Run
```bash
# Require
docker & docker-compose
```

Before running API Gateway, you should set the API Endpoint config with yours or set the your endpoint config with my values on [service.json](https://github.com/gedge-platform/gm-center/blob/main/gmc_api_gateway/config/settings/service.json)
```go
{
    "port": 8080,
    "default_hosts": [
        "https://endpoint url"
    ]
}
```

```bash
# Run
cd ${PWD}/gm-center/gmc_api_gateway
docker-compose up -d
```


## Structure
```
├── config
│   └── gm-center.json
│   ├── partials
│   │   ├── kubernetes_exclusion.tmpl
│   │   ├── monitoring_exclusion.tmpl
│   │   ├── custom_exclusion.tmpl
│   │   ├── status_custom_error.tmpl
│   └── settings
│       └── api_endpoint.json
│       └── service.json
└── docker-compose.yaml
└── README.md
```

## API

```
Progessing
```

---

### To do ✓
- [x] KUBERNETES
- [ ] MONITORING
- [ ] PROJECT
- [ ] WORKSPACES


### In Progress
- [x] MONITORING

### Done ✓
- [x] First Commit
- [x] KUBERNETES
