# GM-Center
코어 클라우드 및 클라우드 엣지 클러스터 관리를 위한 관리 프레임워크

> *GM-Center: 코어 클라우드 및 클라우드 엣지 관리 프레임워크*

[![PkgGoDev](https://pkg.go.dev/badge/golang.org/x/tools)](https://pkg.go.dev/golang.org/x/tools)


## 목차
- [GM-Center 구조 및 기능](https://github.com/gedge-platform/gm-center/blob/develop/README.md)
- [플랫폼 관리 프레임 워크](https://github.com/gedge-platform/gm-center/blob/develop/README.md)


## GM-Center 구조 및 기능


- Cloud Edge 관리 프레임워크
  - Gedge API
    - GM Center 서비스 이용을 위한 RESTful API 제공 
  - 플랫폼 관리
    - 사용자 관리, Cloud Edge 관리, 서비스 및 시스템 모니터링, 서비스 배포 관리 기능 제공
  - Kubernetes Echosystem
    - Kubernetes 클러스터 등록 관리, 실시간 모니터링, 서비스 매시 플랫폼 환경 구성 및 관리
- 웹 기반 서비스 포탈
  - GM-Tool



## 플랫폼 관리 프레임 워크

GSE API Server는 초저지연 데이터 처리 프레임워크의 사용 편의성 제공을 위한 서비스 실행, 인프라 관리, 모니터링, 사용자 인증 관리 등의 기능을 제공한다.

- 구조

![GM-Center-architecture](https://github.com/gedge-platform/gm-center/blob/develop/imgs/01_architecture.png)


- 구성요소
  - API Gateway
    - GM Center 기능 이용을 위한 API 제공
  - Service Management
    - 서비스 배포 관리 기능 제공
  - App Management
    - 서비스 등록 관리 기능 제공
  - User Management
    - 사용자 등록 관리 기능 제공
  - Platform Management
    - 사용자 워크스페이스 및 프로젝트 관리 기능 제공
  - Infra Management
    - Cloud Edge 및 Core Cloud 등록 관리 기능 제공
  - Monitoring
    - 시스템 및 서비스의 모니터링 기능 제공
  - Storage
    - 데이터 저장 및 관리를 위한 스토리지 기능 제공
  - Etc.
    - Kubernetes
    - Database
    - Thanos
