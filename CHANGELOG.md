# Changelog

- __[v1.5 Release](https://github.com/gedge-platform/gedge-platform/blob/master/CHANGELOG.md#v15-release)__
- __[v1.0 Release](https://github.com/gedge-platform/gedge-platform/blob/master/CHANGELOG.md#v10-release)__

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


