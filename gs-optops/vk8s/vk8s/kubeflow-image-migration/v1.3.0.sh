#!/bin/bash
if [ $# -ne 1 ]; then
  echo "Usage: ./v1.3.0.sh <image-registry>"
  exit -1
fi

registry=$1

images=( istio/pilot
istio/proxyv2
kubeflowkatib/katib-controller
kubeflowkatib/katib-db-manager
kubeflowkatib/katib-ui
kubeflow/mxnet-operator
kubeflow/xgboost-operator
metacontroller/metacontroller
mpioperator/mpi-operator
mysql
public.ecr.aws/j1r0q0g6/notebooks/access-management
public.ecr.aws/j1r0q0g6/notebooks/admission-webhook
public.ecr.aws/j1r0q0g6/notebooks/central-dashboard
public.ecr.aws/j1r0q0g6/notebooks/jupyter-web-app
public.ecr.aws/j1r0q0g6/notebooks/notebook-controller
public.ecr.aws/j1r0q0g6/notebooks/profile-controller
public.ecr.aws/j1r0q0g6/notebooks/tensorboard-controller
public.ecr.aws/j1r0q0g6/notebooks/tensorboards-web-app
public.ecr.aws/j1r0q0g6/notebooks/volumes-web-app
public.ecr.aws/j1r0q0g6/training/tf-operator
python
rancher/local-path-provisioner
gcr.io/arrikto/kubeflow/oidc-authservice
kfserving/kfserving-controller
gcr.io/kubebuilder/kube-rbac-proxy
gcr.io/kubeflow-images-public/pytorch-operator
gcr.io/ml-pipeline/api-server
gcr.io/ml-pipeline/cache-deployer
gcr.io/ml-pipeline/cache-server
gcr.io/ml-pipeline/frontend
gcr.io/ml-pipeline/metadata-envoy
gcr.io/ml-pipeline/metadata-writer
gcr.io/ml-pipeline/minio
gcr.io/ml-pipeline/mysql
gcr.io/ml-pipeline/persistenceagent
gcr.io/ml-pipeline/scheduledworkflow
gcr.io/ml-pipeline/viewer-crd-controller
gcr.io/ml-pipeline/visualization-server
gcr.io/ml-pipeline/workflow-controller
gcr.io/tfx-oss-public/ml_metadata_store_server
quay.io/dexidp/dex
quay.io/jetstack/cert-manager-cainjector
quay.io/jetstack/cert-manager-controller
quay.io/jetstack/cert-manager-webhook )
tags=( 1.9.0
1.9.0
v0.11.0
v0.11.0
v0.11.0
v1.1.0
v0.2.0
v0.3.0
v0.2.3
8
v1.3.0-rc.1
v1.3.0-rc.1
v1.3.0-rc.1
v1.3.0-rc.1
v1.3.0-rc.1
v1.3.0-rc.1
v1.3.0-rc.1
v1.3.0-rc.1
v1.3.0-rc.1
cd2fc1ff397b1f349f68524f4abd5013a32e3033
3.7
v0.0.22
28c59ef
v0.5.1
v0.4.0
vmaster-g518f9c76
1.5.0
1.5.0
1.5.0
1.5.0
1.5.0
1.5.0
RELEASE.2019-08-14T20-37-41Z-license-compliance
5.7
1.5.0
1.5.0
1.5.0
1.5.0
v2.12.9-license-compliance
0.25.1
v2.24.0
v0.11.0
v0.11.0
v0.11.0 )

length=${#images[@]}
for (( i=0; i<$length; i++ ))
do 
sudo docker pull ${images[$i]}:${tags[$i]}; 
sudo docker tag ${images[$i]}:${tags[$i]} ${registry}/${images[$i]}:${tags[$i]};
sudo docker push ${registry}/${images[$i]}:${tags[$i]};
done

images=( gcr.io/knative-releases/knative.dev/eventing/cmd/channel_broker
gcr.io/knative-releases/knative.dev/eventing/cmd/controller
gcr.io/knative-releases/knative.dev/eventing/cmd/in_memory/channel_controller
gcr.io/knative-releases/knative.dev/eventing/cmd/in_memory/channel_dispatcher
gcr.io/knative-releases/knative.dev/eventing/cmd/webhook
gcr.io/knative-releases/knative.dev/net-istio/cmd/controller
gcr.io/knative-releases/knative.dev/net-istio/cmd/webhook
gcr.io/knative-releases/knative.dev/serving/cmd/activator
gcr.io/knative-releases/knative.dev/serving/cmd/autoscaler
gcr.io/knative-releases/knative.dev/serving/cmd/controller
gcr.io/knative-releases/knative.dev/serving/cmd/webhook )
tags=( sha256:5065eaeb3904e8b0893255b11fdcdde54a6bac1d0d4ecc8c9ce4c4c32073d924
sha256:c99f08229c464407e5ba11f942d29b969e0f7dd2e242973d50d480cc45eebf28
sha256:9a084ba0ed6a12862adb3ca00de069f0ec1715fe8d4db6c9921fcca335c675bb
sha256:8df896444091f1b34185f0fa3da5d41f32e84c43c48df07605c728e0fe49a9a8
sha256:a3046d0426b4617fe9186fb3d983e350de82d2e3f33dcc13441e591e24410901
sha256:75c7918ca887622e7242ec1965f87036db1dc462464810b72735a8e64111f6f7
sha256:e6b142c0f82e0e0b8cb670c11eb4eef6ded827f98761bbf4bea7bdb777b80092
sha256:ffa3d72ee6c2eeb2357999248191a643405288061b7080381f22875cb703e929
sha256:f89fd23889c3e0ca3d8e42c9b189dc2f93aa5b3a91c64e8aab75e952a210eeb3
sha256:b86ac8ecc6b2688a0e0b9cb68298220a752125d0a048b8edf2cf42403224393c
sha256:7e6df0fda229a13219bbc90ff72a10434a0c64cd7fe13dc534b914247d1087f4 )

length=${#images[@]}
kf="v1.3.0"
for (( i=0; i<$length; i++ ))
do 
sudo docker pull ${images[$i]}@${tags[$i]}; 
sudo docker tag ${images[$i]}@${tags[$i]} ${registry}/${images[$i]}:${kf};
sudo docker push ${registry}/${images[$i]}:${kf}; 
done