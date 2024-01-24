#!/bin/bash
if [ $# -ne 1 ]; then
  echo "Usage: ./migrate.sh <image-registry>"
  exit -1
fi

registry=$1
kubeflow_versions=("v1.3.0" "v1.4.0" "v1.4.1" "v1.5.0" "v1.5.1", "v1.6.0")
for version in "${kubeflow_versions[@]}"
do 
  ./${version}.sh $registry
done