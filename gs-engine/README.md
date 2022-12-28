# GS-Engine
Software and infrastructure technology to support AI services with low latency on edge computing nodes.

> *GS-Engine: 초저지연 데이터 처리 프레임워크*

[![Generic badge](https://img.shields.io/badge/python-3.6-brightgreen.svg)](https://www.python.org/downloads/release/python-360/)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Generic badge](https://img.shields.io/badge/release-v3.0-blueviolet.svg)](https://github.com/gedge-platform/gs-engine/releases)

## 목차
1. [GS-Engine 구조 및 기능](https://github.com/cynpna/gs-engine/blob/main/README.md#gs-engine-%EA%B5%AC%EC%A1%B0-%EB%B0%8F-%EA%B8%B0%EB%8A%A5)
2. [GSE API Server](https://github.com/cynpna/gs-engine/blob/main/README.md#gse-api-server)
3. [GSE Infra-Interface](https://github.com/cynpna/gs-engine/blob/main/README.md#gse-infra-interface)

## GS-Engine 구조 및 기능
- 데이터 처리 가속 모듈
    - Low Latency Data Path, Acceleration HW Plugin, Service Pre-Warming
    - Resource/Topology Manager, Shared Message Queue, gRPC Data Stream Interface
    - [*GEdge Scheduler*](https://github.com/gedge-platform/gs-scheduler)
- 응용 실행환경 오케스트레이션/플랫폼 호환성 모듈
    - GS-Engine Interface Server    
- 데이터 고속 저장 및 공유 모듈
    - Geo Distributed Storage
    - Distributed Data Management
- 데이터 전송 가속모듈
    - Low Latency Container Network
- 실행환경 최적화 모듈
    - Execution Environment
    - Resource Auto Scaling
- 이종 단말 프로토콜 연동 모듈
    - [*Message Broker*](https://github.com/gedge-platform/gs-broker)

## GSE API Server
GSE API Server는 초저지연 데이터 처리 프레임워크의 사용 편의성 제공을 위한 서비스 실행 인프라 관리, 서비스 실행관리, 서비스 오토 스케일링 관리 등의 기능을 제공한다.

- 구조
<img src="https://user-images.githubusercontent.com/74389889/145032837-02260de7-a098-4cc8-b799-c5b9b9e295d7.png" width="80%">

- 구성요소
    - user
        - gse api server 사용자
        - gse api는 shell 환경에서 curl 등의 shell 명령을 호출하거나 프로그램에서 http 라이브러리를 이용하여 호출
    - gse api server
        - GS-Engine 사용 편의성 제공을 위한 서비스 실행 인프라 관리, 서비스 실행 관리, 서비스 오토 스케일링 관리 제공
        - controller(사용자 요청 처리), service(k8s와의 연계), sql(DB metadata 연계), tools(schema 기반 서비스 변환), logs 등으로 구성
    - kubernetes cluster
        - GS-Engine 사용을 위한 resource metric server(cpu, memory), prometheus server 로 구성
        - metric server와 prometheus server를 통해 수집된 데이터를 오토스케일링 컨트롤에게 제공
        - 지능형 서비스 가속을 위한 gpu, 네트워크 가속을 위한 CNI(flannel, multus, sr-iov 등) 실행
    - metalb
        - gse api server를 통해 실행된 서비스의 접근을 위한 gateway 에 public ip 할당
    - gse gateway 
        - gse api server를 통해 실행된 서비스의 요청 라우팅
    - envoy/pv
        - gse api server를 통해 실행된 service mesh 를 이루는 microservice 구조의 응용간 트래픽 모니터링(제어는 추후 예정)
        
## GSE Infra-Interface
GSE Infra-Interface는 여러 개의 쿠버네티스 클러스터를 구성 및 운영하고, 이를 기반으로 컴퓨팅/네트워크 가속 자원 활용에 따른 시스템 성능을 분석하기 위한 기능을 제공한다.  

- 구조  
    ![gse infra-interface-2 5 구조](https://user-images.githubusercontent.com/29933947/186815689-54b9b014-f99e-49ab-9e8f-8fdb4dd6d477.png)

- 구성요소
    - Kubernetes Interface
      - Node Manager
      - Pod Manager
    - Initialization Manager 
      - Set Kubernetes Cluster Information
      - Get Kubernetes Cluster Information
      - Reset Kubernetes Cluster
      - Get Access Key
    - Network Manager
      - Network Interface Manager
      - Policy Manager
    - Utility
      - Log Manager
      - Kubernetes Clinet
      - Login    
    - MicroService
    - DataBase Interface  
 
- 웹기반 시험도구
    - GSE Infra-Interface로 구성되는 클러스터 형상 및 정보 확인  

        ![gse infra-interface-cluster info](https://user-images.githubusercontent.com/29933947/186820597-df0f981d-c6e9-4db0-adfa-da08babc0f38.png)


    - 클러스터 구성 형상에 따른 컴퓨팅/네트워크 성능을 측정
        ![gse-infra-webtool-example](https://user-images.githubusercontent.com/29933947/145136152-f2c6e6a0-fe66-4934-ad4a-c61d7a2078cd.png)   

    - 동작 예) 
      - 클러스터 오버레이 네트워크 선택/설정
      - 포드 내 멀티 네트워크 선택/설정
      - 포드 내 네트워크 가속 선택/설정
      - 포드 배포 및 네트워크 성능 측정
      - 테스트용 마이크로서비스 구성,배포 및 서비스 Topology 확인  
