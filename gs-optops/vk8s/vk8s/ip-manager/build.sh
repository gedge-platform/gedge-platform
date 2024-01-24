#!/bin/bash
if [ $# -ne 2 ]; then
    echo "Usage: ./build.sh <registry> <tag>"
    exit -1
fi

# registry="223.62.245.138:15001/scale/workflow/vk8s"
# registry="223.62.245.134:5001/scale/workflow/vk8s"
# registry="registry.gocap.kr/vk8s"
registry=$1/scale/workflow/vk8s
image_tag=$2
echo "registry: $registry"
echo "image tag : $image_tag"

sudo docker build -t $registry/ip-manager:$image_tag -f dockerfiles/Dockerfile .
sudo docker push $registry/ip-manager:$image_tag
