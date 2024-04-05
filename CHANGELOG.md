# Changelog

- __[v4.0 Release](https://github.com/gedge-platform/gedge-platform/blob/master/CHANGELOG.md#v40-release)__
- __[v3.5 Release](https://github.com/gedge-platform/gedge-platform/blob/master/CHANGELOG.md#v35-release)__
- __[v3.0 Release](https://github.com/gedge-platform/gedge-platform/blob/master/CHANGELOG.md#v30-release)__
- __[v2.5 Release](https://github.com/gedge-platform/gedge-platform/blob/master/CHANGELOG.md#v25-release)__
- __[v2.0 Release](https://github.com/gedge-platform/gedge-platform/blob/master/CHANGELOG.md#v20-release)__
- __[v1.5 Release](https://github.com/gedge-platform/gedge-platform/blob/master/CHANGELOG.md#v15-release)__
- __[v1.0 Release](https://github.com/gedge-platform/gedge-platform/blob/master/CHANGELOG.md#v10-release)__

## v4.0 Release
### GS-AIFLOW
- 사용자 기능
  - 프로젝트 관리
  - 스토리지 관리
  - DAG 구성 
  - Task 런칭, 모니터링
- 관리자 기능
  - 사용자 관리
  - 프로젝트 관리
- backend
  - GM-Center 연동
### GS-LinkHQ
- 성능 테스트용 코드 Dockerfile 마이그레이션
  - [vedge](https://github.com/gedge-platform/gs-linkhq/tree/main/vedge)
  - [agent](https://github.com/gedge-platform/gs-linkhq/tree/main/agent)
  - [task-generator](https://github.com/gedge-platform/gs-linkhq/tree/main/task-generator)
- Compose 파일 수정
- 강화학습 모델 다양화
  - DQN
  - PPO
- 컨테이너간 통신을 위한 API 작성
- 정책 생성용 리소스 요구사항 추가
  - CPU
  - Memory
  - GPU
  - Deadline
### GM-Center
- gm-center 기능 고도화
  - GS-Scheduler 연동
  - 버그 수정 및 안정성 개선
### GM-Tool
- gm-tool 고도화
  - Deployment 생성 기능 업데이트
  - Pod 생성 기능 업데이트
  - FasS 기능 추가
### GM-Center
- gm-center 기능 고도화
  - GS-Scheduler 연동
  - 버그 수정 및 안정성 개선
### GM-Scheduler
- 다중 엣지 클러스터와 클라우드 클러스터 고려
  - 3L Clusters (Edge Cluster / Near Edge Cluster / Cloud Cluster)에 대한 yaml 파일 적용 기능 업데이트
  - Center Management Cluster 업데이트
- 플랫폼 서비스를 위한 Gedge Configmap 추가
  - gedge-system-scheduler-configmap.yaml 추가
  - platform service server ip 추가
  - platform service port 추가
- Gedge Scheduler 코어 업데이트
  - Center Management Cluster에 새로운 Platform info Pod 추가
  - kafka message module 코드 수정
  - 멀티 클러스터 환경의 리소스에 대한 Rest API 처리 추가
  - Front Server Pod와 GEdge Scheduler Policy Pod의 동시 실행 업데이트
- 다중 유저, 워크스페이스, 프로젝트를 위한 코드 업데이트
  - 다중 유저 기능 추가
    - 관리자 계정 / 일반 유저 분리
    - 로그인 관리 추가
  - 사용자가 선택한 클러스터에 워크스페이스 생성
  - 프로젝트 단위의 유저 어플리케이션 분리
- 개발 시스템을 위한 클러스터 버전
  - K8s의 버전을 1.22.x로 고정
  - docker와 containerd를 런타임 환경에서 지원
- 새로운 스케쥴러 정책 추가
  - (G)MostRequestedPriority for 3LT
  - (G)LowLatencyPriority for 3LT
  - GSetClusters for 3LT
  - GSelectCluster for 3LT
### GS-Link
- gs-linkgw 아키텍처 설명 
- gs-linkgw 다중 클러스터 마이그레이션을 위한 제어기 프로그램 업로드 
## v3.5 Release
### GS-AIFLOW
- 사용자 기능
  - 프로젝트 관리
  - 스토리지 관리
  - DAG 구성 
  - Task 런칭, 모니터링
- 관리자 기능
  - 사용자 관리
  - 프로젝트 관리
- backend
  - GM-Center 연동
### GS-LinkHQ
- 성능 테스트용 코드 Dockerfile 마이그레이션
  - [vedge](https://github.com/gedge-platform/gs-linkhq/tree/main/vedge)
  - [agent](https://github.com/gedge-platform/gs-linkhq/tree/main/agent)
  - [task-generator](https://github.com/gedge-platform/gs-linkhq/tree/main/task-generator)
- Compose 파일 수정
- 강화학습 모델 다양화
  - DQN
  - PPO
- 컨테이너간 통신을 위한 API 작성
- 정책 생성용 리소스 요구사항 추가
  - CPU
  - Memory
  - GPU
  - Deadline
### GM-Center
- gm-center 기능 고도화
  - GS-Scheduler 연동
  - 버그 수정 및 안정성 개선
### GM-Tool
- gm-tool 고도화
  - Deployment 생성 기능 업데이트
  - Pod 생성 기능 업데이트
  - FasS 기능 추가
### GM-Scheduler
- 다중 엣지 클러스터와 클라우드 클러스터 고려
  - 3L Clusters (Edge Cluster / Near Edge Cluster / Cloud Cluster)에 대한 yaml 파일 적용 기능 업데이트
  - Center Management Cluster 업데이트
- 플랫폼 서비스를 위한 Gedge Configmap 추가
  - gedge-system-scheduler-configmap.yaml 추가
  - platform service server ip 추가
  - platform service port 추가
- Gedge Scheduler 코어 업데이트
  - Center Management Cluster에 새로운 Platform info Pod 추가
  - kafka message module 코드 수정
  - 멀티 클러스터 환경의 리소스에 대한 Rest API 처리 추가
  - Front Server Pod와 GEdge Scheduler Policy Pod의 동시 실행 업데이트
- 다중 유저, 워크스페이스, 프로젝트를 위한 코드 업데이트
  - 다중 유저 기능 추가
    - 관리자 계정 / 일반 유저 분리
    - 로그인 관리 추가
  - 사용자가 선택한 클러스터에 워크스페이스 생성
  - 프로젝트 단위의 유저 어플리케이션 분리
- 개발 시스템을 위한 클러스터 버전
  - K8s의 버전을 1.22.x로 고정
  - docker와 containerd를 런타임 환경에서 지원
- 새로운 스케쥴러 정책 추가
  - (G)MostRequestedPriority for 3LT
  - (G)LowLatencyPriority for 3LT
  - GSetClusters for 3LT
  - GSelectCluster for 3LT
### GS-Link
- gs-linkgw 아키텍처 설명 
- gs-linkgw 다중 클러스터 마이그레이션을 위한 제어기 프로그램 업로드 


## v3.0 Release

### GS-Engine
- gse_api_server
  - bug fix
- gse_infra_interface
  - 파일 및 디렉토리 구조 변경
  - 공유 스토리지(Ceph) 관련 설정 기능 추가
  - Swagger 기반 API 확인 기능 추가
  - K8s Pod 형태의 infra_interface 구성
  - bug fix
### GM-Center
- gm-center 기능 고도화
  - OpenAPI 3.0 update
  - Swagger 기능 추가
  - 쿠버네티스 모니터링 추가 및 수정
  - 대시보드 API 추가
  - VM 생성 및 삭제 기능 추가
  - Cluster Health check scheduler 기능 추가
### GM-Tool
- gm-tool 화면 고도화
- Platform Admin에 스토리지 대시보드 화면 추가
- Platform Admin에 클라우드 대시보드 화면 추가
- Service Admin에 지도(pod ) 대시보드 화면 추가
- Platform Admin에 클라우드 인증 정보 및 VM 생성 및 삭제 기능 추가

## v2.5 Release

### GS-Engine
- gse_api_server
    - bug fix
- gse_infra_interface
    - 멀티 클러스터 환경의 시험 테스트 기능 추가
    - 시험 테스트용 멀티 클러스터 모니터링 기능 추가
    - 마이크로서비스 시험 테스트 기능 추가
    - 기능 변경에 따른 테스트 도구 UI 수정
    - bug fix
### GM-Center
- gm-center API 기능 고도화
    - gm-center 아키텍처 변경
    - 쿠버네티스 API 기능 추가
    - VM 관리 기능 추가
### GM-Tool
- gm-tool 아키텍처 변경 
- 통합 대시보드 수정 및 플랫폼 대시보드, 서비스 어드민 대시보드 추가
- 쿠버네티스 클러스터 모니터링 기능 추가
- PVC 생성 
- 스토리지클래스 생성
### GS-Broker
- 신규 코드 업데이트(기능 추가 및 버그 수정)


## v2.0 Release

### GS-Engine
- gse_api_server
    - service template 제공
    - template 기반 service mesh 생성 지원
    - service 스키마 확장: 자원 acceleration 추가
    - MySQL, envoy 연동 포함
- gse_infra_interface
    - 네트워크 및 성능 시험 테스트 API 수정
    - 네트워크 및 성능 시험 테스트 웹기반 도구 추가

### GS-Scheduler
- Multiple Cluster 적용을 위한 버전으로 gedge scheduler 기능 확대
    - 다수 개의 Edge Cluster / Cloud Cluster 을 Target Cluster로 적용
    - Center Management Cluster와 통합
- GE-Global Scheduler 요청 작업 Request Queue 3Level로 관리
    - 빠른 처리를 위한 Fast Option 적용을 위한 특수 Queue 적용
    - Request Queue Lifecycle을 통한 효율적인 관리
- GE-Global Scheduler Prewarmer 기능 제공
    - Request Queue을 처리 요청 규모에 따른 빠른 처리를 위해 Prewarming 기능 제공
    - Request Policy Queue에 따른 ScalUp/Down이 가능하도록 개발
- Storage Service을 위한 Storage Server 운용
    - Center Management Cluster에 NFS Server 적용
    - Dynamic Volume Provisior 제공
    - Dynamically Provision NFS Persistent Volumes 제공
- 다양한 Data Storage Service 제공
    - Memory 기반 Redis 서비스 제공
    - Meta Data Storage을 위한 MongoDB Service 제공
- 새로운 스케줄러 정책 추가
    - (G)MostRequestedPriority
    - (G)LowLatencyPriority
    - GSelectCluster

### GS-Link
- 서비스 이동을 위한 GEdge 쿠버네티스 플러그인
    - 실행환경 마이그레이션을 위한 명령 구동 테스트 모듈
- 서비스 이동을 위한 GEdge 실행 서버
    - 실행환경 마이그레이션을 위한 API 수준 명령어 수행 모듈

## v1.5 Release

### GS-Engine
- gse_api_server
    - gse 서비스 스키마 API bugfix
- gse_infra_interface
    - 쿠버네티스 클러스터 초기화 스크립트/API
    - 네트워크 및 성능 시험 테스트 툴

### GS-Scheduler
- 스케줄러 적용 Namespace 확대
    - Default -> Any Namespace
- 로컬 스케줄러 관련 POD 생성을 위한 도커 생성
- 스케줄러 관련 모듈 모두 POD화
    - ClusterRole
    - Redis
    - 워커 에이전트
    - 스케줄러
- 관련 서비스 검색을 위한 관련 API 제공
- 로컬 스케줄러 관련 POD들 일괄 실행을 위한 Deploy 작업
- 새로운 로컬 스케줄러 정책
    - Low latency 확대
        - Node -> Pod

### GM-Center
- gm-center API 기능 고도화
    - golang 기반 API 서버로 변경
    - 쿠버네티스 API 연동 및 필터링 설정 추가
    - 모니터링 API 연동 업데이트

### GS-Broker
기존 Gs-Broker에 이종 프로토콜(HTTP) 통신이 가능한 로직 추가 및 게이트웨이 내부 통신을 gRPC로 변경 구성

- PB(Proto Buffer) 폴더 생성 및 업로드
    - gs-gateway.proto
        - Gedge 게이트웨이 내부와 gRPC 통신을 하기 위한 proto 정의 파일
    - gs-gateway_pb2.py
        - proto 함수를 python3에서 사용하기 위해 컴파일한 파일
    - gs-gateway_pb2_grpc.py
        - proto 함수를 python3에서 gRPC 통신에도 지원하기 위한 컴파일 파일
    - pb와 관련된 gs-broker 코드 변경
        - 기존 코드에 HTTP 프로토콜로 통신할 수 있는 로직 추가
        - 게이트웨이 내부 통신을 gRPC로 변경하는 구성 추가


## v1.0 Release

### GS-Engine
- gse_api_server
    - gse 서비스 스키마 API
    - 오토스케일링 프로토타입
- gse_infro_configuration
    - 쿠버네티스 클러스터 설정 API
    - 다채널 네트워크 구성 기능
    - 하드웨어 가속(SR-IOV) 구성 기능

### GS-Scheduler
- previous jods
    - Install Kubernetes cluster
    - deploy redis yaml file
    - run worker agent each work node
    - run local scheduler
- requirement
    - Kubernetes
    - redis
    - pythonping
    - flask

### GM-Center
- gm-center API 서비스 프로토타입
    - 쿠버네티스 프록시 서버 기능 연동 기능 프로토타입
    - 모니터링 서버 연동 기능 프로토타입

### GM-Tool
- gm-tool
    - 서비스 대시보드 프로토타입
    - 쿠버네티스 클러스터 모니터링 기능

### GS-Broker
- gedge-platform에서 활용할 수 있는 Gs-Broker 개념정의
- gs-broker.py 릴리즈 : 메시지 브로커를 지원하는 (MQTT) 기능을 Gedge 게이트웨이와 연결하는 구조의 파일


