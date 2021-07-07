# GSE-Scheduler
![GSE-Scheduler1 5](https://user-images.githubusercontent.com/74521072/124426921-ad31da80-dda5-11eb-8a42-56601b744ae0.png)
## 스케줄러 적용 Namespace 확대
- Default -> Any Namespace 
## 로컬 스케줄러 관련 POD 생성을 위한 도커 생성  
## 스케줄러 관련 모듈 모두 POD화 
- ClusterRole
- Redis
- 워커 에이전트
- 스케줄러
## 관련 서비스 검색을 위한 관련 API 제공 
## 로컬 스케줄러 관련 POD들 일괄 실행을 위한 Deploy 작업
## 새로운 로컬 스케줄러 정책
- Low latency 확대
    - Node -> Pod 
# 2LT-Scheduler(진행중)
![GSE-2LT Scheduler](https://user-images.githubusercontent.com/74521072/124427893-f7678b80-dda6-11eb-986a-a340026a0a72.png)
## 모니터링 모듈 독립성 제공 
- 타 모듈과 결합이 용이한 형태로 개발
- GPU 자원 처리 방안 구체화
- 클러스터별, 통합 자원 현황 관리 방안 구체화
## 스케줄링 요구 메시지 큐 제어 모듈 필요
- 큐에 대한 우선순위 제어 필요
## 스케줄링 정책별로 독립적인 처리 가능
- 요구 메시지 별(정책)로 독립 처리 가능
- Kubernetes scaler을 이용한 유동적인 처리 모듈 수 제어 가능
## 관련 인터페이스 구체화
- 사용자 생성, 권한 생성/부여, 서비스 인스턴스 생성, 
## 성능 비교를 위한 로그나 인터페이스 구체화 


