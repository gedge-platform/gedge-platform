#!/bin/bash
if [ $# -ne 2 ]; then
  echo "Usage: ./install.sh <image-registry> <ip-reservation-range>"
  exit -1
fi
registry=$1
ipRange=$2
namespace=vk8s-system

# create vk8s-system namespace
kubectl create ns $namespace

# build vnode image
cd vnode
./build-bulk.sh $registry
cd -

# build and install ip-manager
cd ip-manager
./install.sh $namespace $registry $ipRange
cd -

# build and install host-device-plugin
cd vk8s-device-plugin/host-device-plugin
./install.sh $registry
cd -

# build virtual-device-plugin
cd vk8s-device-plugin/virtual-device-plugin
./build.sh $registry "0.1"
cd -

# install vk8s
cd vk8s
./install.sh $registry
cd -

# install local path storageClass
kubectl apply -f local-path-storage.yaml
