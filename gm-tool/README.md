# GM-Tool

Gedge Management Dashboard \
클라우드 및 엣지 클라우드 관리를 위한 관리 플랫폼

<img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=React&logoColor=white"/> <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=HTML5&logoColor=white"/> <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=CSS3&logoColor=white"/> <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=Node.js&logoColor=white"/> <img src="https://img.shields.io/badge/npm-CB3837?style=flat-square&logo=npm&logoColor=white"/>

## 목차

- GM-Tool의 구조
- GM-Tool의 기능
- 설치 방법

## GM-Tool의 구조

1. Platform Admin

- 통합 대시보드
- 플랫폼
  - 대시보드
  - 엣지존
  - 클라우드존
- 인프라
  - 네트워크
  - 스토리지클래스
    - 대시보드
    - 스토리지클래스
- 서비스
  - 워크스페이스
  - 프로젝트
  - 템플릿
- 사용자
- 모니터링
- 시스템 환경설정
- 인증

2. Service Admin

- 통합 대시보드
- 워크스페이스
- 프로젝트
- 워크로드
- 볼륨

## GM-Tool의 기능

1. Login

![image](https://user-images.githubusercontent.com/96764768/187580059-e72428b8-8f96-48c1-96fb-794814a891bd.png)

2. Platform Admin

![image](https://user-images.githubusercontent.com/96764768/189065214-b203610c-c8f8-4c38-b398-783eaf93ae18.png)

- 통합 대시보드
  - 클라우드의 전반적인 내용을 요약
  - 전체 클러스터 개수, 클라우드 개수, 엣지 개수, 전체 워크스페이스 개수, 전체 프로젝트 개수
  - 실행 중인 클라우드를 아이콘으로 표현 및 상태를 표시
  - 실행 중인 엣지를 아이콘으로 표현 및 위치와 상태를 지도에 표시
  - CPU 및 Memory 사용량 Top 5를 표시

3. Service Admin

![image](https://user-images.githubusercontent.com/96764768/187577884-9bfc49ab-9eb9-4362-a141-8e72caf9b117.png)

- 통합 대시보드
  - 서비스 어드민 통합 대시보드
  - 각각의 유저가 사용중인 리소스를 요약
  - 유저가 만든 전체 워크스페이스 개수, 전체 프로젝트 개수를 표현
  - Project의 CPU와 Memory, Pod의 CPU와 Memory 사용량 Top 5를 표시
  - 워크스페이스를 선택 시 이에 따른 각각의 리소스를 확인할 수 있게 표현
  - 워크스페이스 총 개수, 프로젝트 총 개수, 파드 총 개수 모니터링 가능

## Getting Started

This is an example of how you may give instructions on setting up your project locally. To get a local copy up and running follow these simple example steps.

### Prerequisites

```
"engines" : {
  "npm" : ">=7.0.0",
  "node" : ">=16.0.0",
  "yarn" : ">=1.20.0"
}
```

### Installation

- Clone the repository

```
https://github.com/gedge-platform/gm-tool.git
```

- Install dependencies

```
yarn install
```

- Run the app

```
yarn run start
```

## Contributing

If you're interested in being a contributor and want to get involved in developing the GEdge Platform code, please see DOCUMENTATIONs for details on submitting patches and the contribution workflow.

## Community

We have a project site for the GEdge Platform. If you're interested in being a contributor and want to get involved in developing the Cloud Edge Platform code, please visit <a href="https://gedge-platform.github.io/">GEdge Plaform</a> Project site
