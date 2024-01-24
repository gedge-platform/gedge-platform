#!/bin/bash
if [ $# -ne 1 ]; then
  echo "Usage: ./install.sh <image-registry>"
  exit -1
fi
registry=$1

./build.sh $registry "0.1"
sed "s@registry@$registry@g" nvidia-device-plugin.yml | kubectl apply -f -