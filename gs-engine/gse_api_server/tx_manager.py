# tx_manager
"""
gse api server의 tx 처리를 담당한다.

problem:
> gse/service/create는 아래 5가지 리소스를 생성(삭제)한다.
> 이때, 5가지를 하나의 트랜잭션(all or nothing)으로 처리해야 한다.
> 하지만, 제공된 기능만으로는 트랜잭션을 보장하는 처리를 할 수 없다.
* k8s/deployment
* k8s/service
* k8s/serviceMonitor
* schedulehint_db/scheduleHint
* service_db/service

solution:
> all or nothing 좋지만
> k8s 클러스터 lock, isolation, consistency, durability 등을 어떻게 보장할 수 있는가?
> difficult? or impossible?

현실적인 접근 방법
>> eventually consistent 정책으로 tx를 완화해야 할듯
5단계를 모두 실행하고, 모두 성공하면 성공 반환 (이때, k8s에는 부분적으로 commit 발생)
5단계중 하나라도 실패하면, 성공처리된 명령에 대한 rollback을 보장하는 tx manager 작성
"""

