# GM-Tool

코어 클라우드 및 클라우드 엣지 클러스터 서비스 이용을 위한 웹 서비스 포탈

> *GM-Tool: Gedge 서비스 포탈*

[![PkgDev](https://img.shields.io/badge/spring-reference-green)](https://spring.io/) [![License](https://camo.githubusercontent.com/2a2157c971b7ae1deb8eb095799440551c33dcf61ea3d965d86b496a5a65df55/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f4c6963656e73652d417061636865253230322e302d626c75652e737667)](https://opensource.org/licenses/Apache-2.0) [![Generic badge](https://camo.githubusercontent.com/80b42f4ff3d27b79821c9807e31a3807d7ff886a6aab5c1740d811af75740cf4/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f72656c656173652d76312e302d626c756576696f6c65742e737667)](https://github.com/gedge-platform/gm-tool)



## 목차

- [GM-Tool 구조 및 기능](https://github.com/gedge-platform/gm-center/blob/develop/README.md)



## GM-Center 구조 및 기능


- 웹 기반 서비스 포탈
  - Platform Admin
    - 대상 : Gedge 플랫폼을 관리하는 관리자
    - 주요 기능 : Cloud Edge, Core Cloud 등록 관리 및 사용자 관리 기능을 제공
  - Service Admin
    - 대상 : Gedge 서비스를 이용하는 일반 사용자 및 개발자
    - 주요 기능 : 필요한 자원 요청, 서비스 배포 및 운영, 모니터링 기능을 제공
  - 공통 기능
    - 시스템 대시보드 및 서비스 이용 관리, 모니터링 기능 제공
- Cloud Edge 관리 프레임워크
  - GM-Center



#### GM-Tool 서비스 포탈

GM-Tool 서비스 포탈은 초저지연 클라우드 엣지 관리 플랫폼의 구성 및 관리를 위한 Platform Admin 기능과 Gedge 시스템을 이용하여 서비스를 배포하고 관리하는 Service Admin을 위한 웹 기반 대시보드 기능을 제공한다. 

- 구조

![GM-Tool-architecture](https://github.com/gedge-platform/gm-tool/blob/master/docs/01_architecture.png)



- 구성요소
  - Platform Admin
    - Gedge 서비스 사용자 계정 관리
    - Cloud Edge 및 Core Cloud 관리
    - 서비스 어플리케이션 템플릿 관리
    - 시스템 저장소 관리
  - Service Admin
    - 사용자 서비스 배포 관리
    - 사용자 워크스페이스 관리
    - 서비스 워크로드 관리
    - 사용자 네임스페이스 관리
  - Observability
    - 시스템 및 서비스 모니터링, 로깅, 이벤트 감지 및 추적 기능
