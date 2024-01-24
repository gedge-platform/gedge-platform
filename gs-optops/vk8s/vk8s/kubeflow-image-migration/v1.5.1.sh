#!/bin/bash
if [ $# -ne 1 ]; then
  echo "Usage: ./v1.5.1.sh <image-registry>"
  exit -1
fi

registry=$1

images=( istio/pilot
istio/proxyv2
kubeflowkatib/katib-controller
kubeflowkatib/katib-db-manager
kubeflowkatib/katib-ui
metacontrollerio/metacontroller
kfserving/kfserving-controller
kfserving/models-web-app
kserve/kserve-controller
kserve/models-web-app
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
public.ecr.aws/j1r0q0g6/training/training-operator
python
rancher/local-path-provisioner
quay.io/dexidp/dex
quay.io/jetstack/cert-manager-cainjector
quay.io/jetstack/cert-manager-controller
quay.io/jetstack/cert-manager-webhook
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
gcr.io/tfx-oss-public/ml_metadata_store_server )
tags=( 1.11.4
1.11.4
v0.13.0
v0.13.0
v0.13.0
v2.0.4
v0.6.1
v0.6.1
v0.7.0
v0.7.0
8.0.26
v1.5.0
v1.5.0
v1.5.0
v1.5.0
v1.5.0
v1.5.0
v1.5.0
v1.5.0
v1.5.0
174e8813666951ded505daf334a37f60fd50c18d
3.7
v0.0.22
v2.24.0
v1.5.0
v1.5.0
v1.5.0
28c59ef
v0.4.0
1.8.2
1.8.2
1.8.2
1.8.2
1.8.2
RELEASE.2019-08-14T20-37-41Z-license-compliance
5.7
1.8.2
1.8.2
1.8.2
1.8.2
v3.2.3-license-compliance
1.5.0 )

length=${#images[@]}
for (( i=0; i<$length; i++ ))
do 
sudo docker pull ${images[$i]}:${tags[$i]}; 
sudo docker tag ${images[$i]}:${tags[$i]} ${registry}/${images[$i]}:${tags[$i]};
sudo docker push ${registry}/${images[$i]}:${tags[$i]};
done

images=( gcr.io/knative-releases/knative.dev/eventing/cmd/broker/filter
gcr.io/knative-releases/knative.dev/eventing/cmd/broker/ingress
gcr.io/knative-releases/knative.dev/eventing/cmd/controller
gcr.io/knative-releases/knative.dev/eventing/cmd/in_memory/channel_controller
gcr.io/knative-releases/knative.dev/eventing/cmd/in_memory/channel_dispatcher
gcr.io/knative-releases/knative.dev/eventing/cmd/mtchannel_broker
gcr.io/knative-releases/knative.dev/eventing/cmd/webhook
gcr.io/knative-releases/knative.dev/net-istio/cmd/controller
gcr.io/knative-releases/knative.dev/net-istio/cmd/webhook
gcr.io/knative-releases/knative.dev/serving/cmd/activator
gcr.io/knative-releases/knative.dev/serving/cmd/autoscaler
gcr.io/knative-releases/knative.dev/serving/cmd/controller
gcr.io/knative-releases/knative.dev/serving/cmd/webhook )
tags=( sha256:0e25aa1613a3a1779b3f7b7f863e651e5f37520a7f6808ccad2164cc2b6a9b12
sha256:cf579f88aa2a37c240e25bb886c1ef5404e326e12c7caf571e49308612243eee
sha256:6ddffbc286a84048cfd090193d00b4ecda25a3a7bf2de1a8e873f8b3755cc913
sha256:904f42a768a9bc64999e7302d2bc7c1c48a08e74a82355cf57be513e6a124b82
sha256:a6983f71c04619928199cc21e07ee6f1e1c87586621bc03b10c9ba1abd92bfa8
sha256:a2678934d280ea19b0804cc7757d559a0312e2acea221b17a99bd830cd9eeaac
sha256:9f70a2a8bb78781472fba0327c5d6ff91f13a29736d4502bf8ad3d60d3f16ccd
sha256:ff8680da52ef47b8573ebc3393cbfa2f0f14b05c1e02232807f22699adbef57a
sha256:1e371db6b1a9f9265fc7a55d15d98c935c0c28925ffde351fb3b93f331c5a08e
sha256:fed92af8b9779c97482906db8857f27b5d4826708b75d0298aa30fad8900671f
sha256:bc5ae3090ab0322ed0e4f9efddb60fa85f6ff3a29156411d24d0e4764b18eba7
sha256:bd7c6350e5d5c4edaa197a86fb96cff78bdd3e61f33fcb77aa60930de0ec0827
sha256:6f41d379f1aacdfbb8f6d4f539e1769040e4f01bff3ad9c249b427e54dc56ea8 )

length=${#images[@]}
kf="v1.5.1"
for (( i=0; i<$length; i++ ))
do 
sudo docker pull ${images[$i]}@${tags[$i]}; 
sudo docker tag ${images[$i]}@${tags[$i]} ${registry}/${images[$i]}:${kf};
sudo docker push ${registry}/${images[$i]}:${kf}; 
done