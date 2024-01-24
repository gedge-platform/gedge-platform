#!/bin/bash
if [ $# -ne 2 ]; then
  echo "Usage: ./build.sh <image-registry> <tag>"
  exit -1
fi

registry=$1
tag=$2
image=$registry/scale/workflow/vk8s/host-device-plugin:$tag

sudo docker build -t $image -f docker/Dockerfile .
sudo docker push $image