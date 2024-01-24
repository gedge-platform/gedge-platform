#!/bin/bash
if [ $# -ne 1 ]; then
  echo "Usage: ./v1.6.0.sh <image-registry>"
  exit -1
fi

registry=$1

images=( istio/proxyv2
kubeflowkatib/katib-controller
kubeflowkatib/katib-db-manager
kubeflowkatib/katib-ui
kubeflownotebookswg/centraldashboard
kubeflownotebookswg/jupyter-web-app
kubeflownotebookswg/kfam
kubeflownotebookswg/notebook-controller
kubeflownotebookswg/poddefaults-webhook
kubeflownotebookswg/profile-controller
kubeflownotebookswg/tensorboard-controller
kubeflownotebookswg/tensorboards-web-app
kubeflownotebookswg/volumes-web-app
metacontrollerio/metacontroller
kserve/kserve-controller
kserve/models-web-app
kubeflow/training-operator
mysql
python
rancher/local-path-provisioner 
quay.io/jetstack/cert-manager-cainjector
quay.io/jetstack/cert-manager-controller
quay.io/jetstack/cert-manager-webhook
gcr.io/arrikto/istio/pilot
gcr.io/arrikto/kubeflow/oidc-authservice
gcr.io/kubebuilder/kube-rbac-proxy
gcr.io/ml-pipeline/api-server
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
ghcr.io/dexidp/dex )
tags=( 1.14.1
v0.14.0
v0.14.0
v0.14.0
v1.6.0
v1.6.0
v1.6.0
v1.6.0
v1.6.0
v1.6.0
v1.6.0
v1.6.0
v1.6.0
v2.0.4
v0.8.0
v0.8.0
v1-e1434f6
8.0.29
3.7
v0.0.22 
v1.5.0
v1.5.0
v1.5.0
1.14.1-1-g19df463bb
28c59ef
v0.8.0
2.0.0-alpha.3
2.0.0-alpha.3
2.0.0-alpha.3
2.0.0-alpha.3
2.0.0-alpha.3
RELEASE.2019-08-14T20-37-41Z-license-compliance
5.7-debian
2.0.0-alpha.3
2.0.0-alpha.3
2.0.0-alpha.3
2.0.0-alpha.3
v3.3.8-license-compliance
1.5.0
v2.31.2 )

length=${#images[@]}
for (( i=0; i<$length; i++ ))
do 
sudo docker pull ${images[$i]}:${tags[$i]}; 
sudo docker tag ${images[$i]}:${tags[$i]} ${registry}/${images[$i]}:${tags[$i]};
sudo docker push ${registry}/${images[$i]}:${tags[$i]}; 
done

images=( gcr.io/knative-releases/knative.dev/eventing/cmd/controller
gcr.io/knative-releases/knative.dev/eventing/cmd/webhook
gcr.io/knative-releases/knative.dev/net-istio/cmd/controller
gcr.io/knative-releases/knative.dev/net-istio/cmd/webhook
gcr.io/knative-releases/knative.dev/serving/cmd/activator
gcr.io/knative-releases/knative.dev/serving/cmd/autoscaler
gcr.io/knative-releases/knative.dev/serving/cmd/controller
gcr.io/knative-releases/knative.dev/serving/cmd/domain-mapping-webhook
gcr.io/knative-releases/knative.dev/serving/cmd/domain-mapping
gcr.io/knative-releases/knative.dev/serving/cmd/webhook )
tags=( sha256:dc0ac2d8f235edb04ec1290721f389d2bc719ab8b6222ee86f17af8d7d2a160f
sha256:b7faf7d253bd256dbe08f1cac084469128989cf39abbe256ecb4e1d4eb085a31
sha256:f253b82941c2220181cee80d7488fe1cefce9d49ab30bdb54bcb8c76515f7a26
sha256:a705c1ea8e9e556f860314fe055082fbe3cde6a924c29291955f98d979f8185e
sha256:93ff6e69357785ff97806945b284cbd1d37e50402b876a320645be8877c0d7b7
sha256:007820fdb75b60e6fd5a25e65fd6ad9744082a6bf195d72795561c91b425d016
sha256:75cfdcfa050af9522e798e820ba5483b9093de1ce520207a3fedf112d73a4686
sha256:847bb97e38440c71cb4bcc3e430743e18b328ad1e168b6fca35b10353b9a2c22
sha256:23baa19322320f25a462568eded1276601ef67194883db9211e1ea24f21a0beb
sha256:9084ea8498eae3c6c4364a397d66516a25e48488f4a9871ef765fa554ba483f0 )

length=${#images[@]}
kf="v1.6.0"
for (( i=0; i<$length; i++ ))
do 
sudo docker pull ${images[$i]}@${tags[$i]}; 
sudo docker tag ${images[$i]}@${tags[$i]} ${registry}/${images[$i]}:${kf};
sudo docker push ${registry}/${images[$i]}:${kf}; 
done