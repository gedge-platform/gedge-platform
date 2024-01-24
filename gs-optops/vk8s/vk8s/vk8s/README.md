# Vk8s Custom Resource and Operator
vk8s 커스텀 리소스와 오퍼레이터를 구현, 빌드 그리고 배포까지 진행합니다.  
## Prerequisite
- golang >= 1.19
- operator-sdk == v1.32.0


## 구현
### Vk8s 스펙 정의
- **api/v1alpha1/vk8s_types.go** 파일 수정
- 스펙 수정 후 `make generate` 실행
### 오퍼레이터 구현
- **controllers/vk8s_controller.go**의 Reconcile 함수 수정
- Reconcile함수가 오퍼레이터의 핵심 로직입니다.
## QuickStart
### Test on Local
- local에서 접근가능한 쿠버네티스 클러스터가 반드시 있어야 합니다. 
- ip-manager에 의존성이 있어서, 실행 전 클러스터에 ip-manager를 먼저 배포해야 합니다.
```bash
# optional
make install # vk8s관련 리소스가 클러스터에 아무것도 설치되어 있지 않을 경우

# vk8s-controller 실행
make run
```
### build
```bash
# operator 이미지 명
export IMG=192.168.202.201:15001/scale/workflow/vk8s/controller:latest

# operator 이미지 빌드
make docker-build

# operator 이미지 푸시
make docker-push
```

### deploy
```bash
# 오퍼레이터 yaml 파일 생성
make generate
make manifests
make create-manifests
kubectl apply -f vk8s-controller.yaml

# 또는
# 바로 쿠버네티스에 배포
make deploy

# 또는 스크립트 사용
# ./install.sh <image-registry>
./install.sh 10.40.103.111:15001
```

### undeploy
```bash
./uninstall.sh
# 또는
make undeploy
```

## End-to-End Test
```bash
make test-e2e
```

## Vk8s Spec
Custom Resource이며, Vk8s yaml 작성 후 kubectl로 배포만 하면 virtual 쿠버네티스를 쉽게 구성할 수 있습니다.  
### Vk8s yaml example
```yaml
apiVersion: vk8s.sktelecom.com/v1alpha1
kind: Vk8s
metadata:
  name: sample
spec:
  nodes:
  - name: sample-master
    image: 192.168.202.201:15001/scale/workflow/vk8s/kink:v1.20
    role: master
    resources:
      requests:
        cpu: "8"
        memory: "16Gi"
      limits:
        cpu: "8"
        memory: "16Gi"
  - name: sample-worker
    image: 192.168.202.201:15001/scale/workflow/vk8s/kink:v1.20-gpu
    role: worker 
    resources:
      requests:
        cpu: "8"
        memory: "16Gi"
        nvidia.com/gpu: "2"
      limits:
        cpu: "8"
        memory: "32Gi"
        nvidia.com/gpu: "2"
  accessPodImage: 192.168.202.201:15001/scale/workflow/vk8s/kubectl:devel
  accessPodPort: 30006
  kubernetes:
    podNetworkCidr: 80.244.0.0/16
    serviceCidr: 80.96.0.0/12
  kubeflow:
    version: v1.3.0
  ports:
  - name: kubeflow
    port: 30000
    targetPort: 30000
  - port: 8080
    targetPort: 8080
    name: test-1
  - port: 3000
    targetPort: 3000
    name: test-2
  - port: 30002
    targetPort: 30002
    name: test-3

---
accessPodImage: 가상 쿠버네티스에 접근할 수 있는 파드입니다.
accessPodPort: 접근용 파드에 ssh 접속할 포트번호입니다. (포트 범위: 30000-32767)
nodes: virtual 쿠버네티스의 노드 정보입니다. 호스트 쿠버네티스 입장에선 파드입니다.
    name: 노드 이름이자 파드 이름이기 때문에 기존 파드의 이름과 겹치지 않도록합니다.
    image: 파드 이미지를 명시합니다. gpu를 사용하고 싶다면 gpu 이미지를 사용해야 합니다.
    role: 해당 파드가 마스터 역할을 할 지, 워커 역할을 할 지 결정합니다. 이 때 마스터는 항상 제일 첫 번째에 명시해야합니다.
    resources: 파드의 리소스를 결정합니다. 쿠버네티스 파드 리소스 문법과 동일합니다. scale에서는 requests와 limits을 항상 똑같이 가져갑니다.  
kubeflow: 설치할 kubeflow의 정보입니다.  
    version: kubeflow의 버전입니다. "v1.3.0"과 같이 맨 앞에 v를 붙이고 뒤에 패치버전까지 써줘야 합니다.  
kubernetes: virtual kubernetes 설치할 때 넣을 사용자 옵션정보입니다.  
    podNetworkCidr: virtual kubernetes의 pod network cidr입니다. host kubernetes의 pod network cidr과 겹치지 않게 설정해야 합니다.  
    serviceCidr: virtual kubernetes의 service cidr입니다. 마찬가지로 host kubernetes의 service cidr과 겹치지 않게 설정합니다.  
ports: virtual kubernetes에 사용자가 띄운 서비스를 외부에서 접속할 수 있도록 뚫는 용도
    port: 사용자가 띄운 서비스의 포트번호
    targetPort: port와 항상 동일
    name: 포트번호의 이름이며, 이름이 kubeflow인 경우엔 해당포트가 kubeflow UI 접속할 때 사용됩니다.

        
```