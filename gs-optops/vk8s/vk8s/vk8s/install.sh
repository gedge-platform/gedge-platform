#!/bin/bash
if [ $# -ne 1 ]; then
  echo "Usage: ./install.sh <image-registry>"
  exit -1
fi
registry=$1
./build.sh $registry latest
sed "s@registry@$registry@g" vk8s-controller.yaml | kubectl apply -f -
