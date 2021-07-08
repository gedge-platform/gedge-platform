# GS-Engine
Software and infrastructure technology to support AI services with low latency on edge computing nodes.

> *GS-Engine: 초저지연 데이터 처리 프레임워크*

[![Generic badge](https://img.shields.io/badge/python-3.6-brightgreen.svg)](https://www.python.org/downloads/release/python-360/)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Generic badge](https://img.shields.io/badge/release-v1.0-blueviolet.svg)](https://github.com/gedge-platform/gs-engine/releases)

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
<img src="https://user-images.githubusercontent.com/29933947/124077983-a98b1480-da82-11eb-849b-9754c4cc5ccd.png" width="80%">

- 구성요소
    - user
        - gse api server 사용자
        - gse api는 shell 환경에서 curl 등의 shell 명령을 호출하거나 프로그램에서 http 라이브러리를 이용하여 호출
    - gse utility(cli)
        - gse api server 사용을 위한 utility 도구
        - curl을 활용하여 사용
    - gse api server
        - GS-Engine 사용 편의성 제공을 위한 서비스 실행 인프라 관리, 서비스 실행 관리, 서비스 오토 스케일링 관리 제공
        - data(데이터 저장소), conf(설정 파일), logs 등으로 구성
    - kubernetes cluster
        - GS-Engine 사용을 위한 resource metric server(cpu, memory), custom metric server 로 구성
        - metric server로 수집된 데이터를 오토스케일링 컨트롤에게 제공

## GSE Infra-Interface
GSE Infra-Interface는 GEdge Platform 활용을 위한 쿠버네티스 클러스터를 구성하고 이를 운영하기 위한 기능을 제공한다.
- 구조
![gse-infra-architecture](https://user-images.githubusercontent.com/29933947/124078020-abed6e80-da82-11eb-89d5-4dc135416fa0.png)

- 구성요소
    - Resource Manager
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

