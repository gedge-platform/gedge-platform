#!/bin/bash
if [ $# -ne 1 ]; then
  echo "Usage: ./uninstall.sh <namespace>"
  exit -1
fi

namespace=$1
kubectl delete -f yamls/mysql.yaml -n $namespace
kubectl delete -f yamls/ip-reservation.yaml -n $namespace
kubectl delete -f yamls/ip-manager.yaml -n $namespace
