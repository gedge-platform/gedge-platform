#!/bin/bash
if [ $# -ne 2 ]; then
  echo "Usage: ./build.sh <image-registry> <tag>"
  exit -1
fi

registry=$1
tag=$2

image=$registry/scale/workflow/vk8s/controller:$tag

IMG=$image make docker-build
IMG=$image make docker-push
