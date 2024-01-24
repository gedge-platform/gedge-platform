# vnode 
virtual node의 줄임말로, vk8s를 띄우기 위한 파드를 말합니다. vnode의 이미지 빌드를 위한 스크립트, dockerfile 등이 있습니다.

## Build Image
1. kink  
    - `build.sh` 스크립트를 사용하여 쿠버네티스 버전 별로 kink 이미지를 빌드할 수 있습니다. **실행 전 registry와 이미지명을 알맞게 수정하시고 실행시켜주세요**
        ```
        # 옵션
        -r : 이미지 레지스트리 (default: 10.40.103.111:15001)
        -v : 쿠버네티스 버전 명시. 이때 패치 버전까지 적어줘야 합니다. (default: latest)
        -f : Dockerfile 명시. (default: Dockerfile)
        -t : kink 이미지 태그. 생략하면 쿠버네티스 버전의 마이너 버전까지 자동으로 붙게 됩니다. 
            (default: (k8s 버전 latest) -> latest, (k8s 버전 v1.22.10) -> v1.22)

        ex)
        ./build.sh -r 192.168.202.201:15001 -v v1.23.0 -f Dockerfile.gpu -t v1.23-gpu => kink:v1.23-gpu
        ./build.sh => kink:latest
        ./build.sh -v v1.22.10 => kink:v1.22
        ```
    - `build-bulk.sh` 스크립트를 이용하여 모든 쿠버네티스 버전을 빌드할 수 있습니다.
        ```bash
        # ./build-bulk.sh <image-registry>
        ./build-bulk.sh 10.40.103.111:15001
        ```
        백그라운드로 실행되기 때문에 아래 명령어를 통해서 로그를 확인할 수 있습니다.  
        ```bash
        tail nohup.out
        ```
        모든 버전의 빌드 로그가 한 파일에 나오기 때문에 종료여부는 아래 명령어로 확인합니다.  
        아직 진행 중인 명령어들이 조회됩니다. 아무것도 나오지 않는다면 모든 버전의 빌드가 끝난 것입니다.
        ```bash
        ps -ef | grep build.sh
        ```


1. access pod
    ```bash
    # --build-arg K8S_RELEASE_VERSION={쿠버네티스 릴리즈 버전}
    sudo docker build -t dudaji/kubectl:devel --build-arg K8S_RELEASE_VERSION=v1.23.0 -f dockerfiles/Dockerfile.access .
    ```