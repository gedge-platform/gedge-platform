#!/bin/bash

pod_list=("istio-ingressgateway" "authservice" "dex" "profiles-deployment" "notebook-controller-deployment" "centraldashboard" "jupyter-web-app-deployment" "mysql" "ml-pipeline")
namespace_list=("istio-system" "istio-system" "auth" "kubeflow" "kubeflow" "kubeflow" "kubeflow" "kubeflow" "kubeflow")
resource_type=("deployment" "statefulset" "deployment" "deployment" "deployment" "deployment" "deployment" "deployment" "deployment")
running="True"
for ((idx = 0; idx < ${#pod_list[@]}; idx++)); do
    not_ready=$(kubectl get ${resource_type[$idx]} -n ${namespace_list[$idx]} ${pod_list[$idx]} -ojsonpath='{.status.unavailableReplicas}')
    if [ ! -z $not_ready ]; then
        running="False"
        break
    fi
done
echo $running
