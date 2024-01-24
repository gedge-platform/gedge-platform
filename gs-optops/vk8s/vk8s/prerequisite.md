# vk8s on centos
centos에 virtual kubernetes를 구성하기 전에 해야할 것들을 정리해놓은 문서입니다.  
  
## nvidia-driver 설치
(optional) 기존에 설치된 nvidia-driver 삭제

```bash
sudo ./NVIDIA-Linux-x86_64-460.32.03.run --uninstall
```

사용하는 gpu에 맞는 nvidia-driver 설치

```bash
wget https://kr.download.nvidia.com/tesla/470.82.01/NVIDIA-Linux-x86_64-470.82.01.run
sudo chmod +x NVIDIA-Linux-x86_64-470.82.01.run
sudo ./NVIDIA-Linux-x86_64-470.82.01.run
```

## 호스트 도커 storage-driver 확인
호스트 도커의 storage-driver가 overlay2를 사용하고 있는지 확인합니다.
```bash
sudo docker info | grep Storage

Storage Driver: overlay2
```
만약 overlay2가 아니라면 */etc/docker/daemon.json* 파일을 수정하여 overlay2로 바꿔줍니다.
```bash
sudo vi /etc/docker/daemon.json

{
    ...
    "storage-driver": "overlay2", # 추가
    ...
}

sudo systemctl restart docker
sudo docker info | grep Storage
```

## 호스트 쿠버네티스 설치
---
어떤 방식이든 상관없이 호스트에 쿠버네티스를 설치해줍니다. 이 때 `pod-network-cidr`을 호스트 네트워크 대역대와 완전히 다르게 세팅해줘야 합니다.  
```bash 
ex)
sudo kubeadm init --pod-network-cidr=10.244.0.0/16
```
> **:bulb:주의!!**  
>  
> virtual 쿠버네티스에서 gpu를 사용할 시, 호스트에 설치된 nivida-device-plugin의 이미지를 변경해주어야 합니다.  
> ex) nvcr.io/nvidia/k8s-device-plugin:v0.10.0 -> dudaji/host-device-plugin:latest