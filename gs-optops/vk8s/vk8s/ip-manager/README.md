# IP Manager
calico static IP assignment를 자동화하기 위해서 할당 중인 IP, 할당 가능한 IP들을 관리하는 서비스입니다.

# Prerequisite
- python == 3.8.13

# Run on Local
## Install Packages
```bash
pip install -r requirements.txt
```
## Run
```bash
python run.py
```
# Build
```bash
# ./build.sh <image-registry> <tag>
./build.sh 10.40.103.111:15001 latest
```

# Deploy
```bash
# ./install.sh <namespace> <image-registry> <ip-resservation-range>
./install.sh vk8s-system 10.40.103.111:15001 192.168.100.0/24
```

# Uninstall
```bash
# ./uninstall.sh <namespace>
./uninstall.sh vk8s-system
```