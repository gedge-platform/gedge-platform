#!/bin/bash
namespace=vk8s-system

# uninstall ip-manager
cd ip-manager
./uninstall.sh $namespace
cd -

# uninstall vk8s
cd vk8s
./uninstall.sh
cd -

# delete local path storageClass
kubectl delete -f local-path-storage.yaml

# delete vk8s-system namespace
kubectl delete ns $namespace