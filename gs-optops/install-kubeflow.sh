#!/bin/bash

if [ $# -ne 3 ]; then
  echo "Usage: ./install-kubeflow <nfs-server> <nfs-mount-path> <browser-port-number>"
  exit -1
fi

# install nfs-client-provisioner
git clone https://github.com/kubernetes-sigs/nfs-subdir-external-provisioner.git
cd nfs-subdir-external-provisioner/charts/nfs-subdir-external-provisioner
helm install nfs-client -n nfs --create-namespace --set nfs.server=$1 --set nfs.path=$2 --set storageClass.defaultClass=true .

# install kubeflow 
git clone https://github.com/kubeflow/manifests.git
cd manifests

while ! kustomize build example | kubectl apply -f -; do echo "Retrying to apply resources"; sleep 10; done

# generate self-signed certifiacte
openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -subj '/O=Dudaji Inc./CN=cap-dev.local' -keyout /etc/ssl/certs/kubeflow.key -out /etc/ssl/certs/kubeflow.crt

# create certificate secret
kubectl create -n istio-system secret tls kf-credential --key=/etc/ssl/certs/kubeflow.key --cert=/etc/ssl/certs/kubeflow.crt

# apply kubeflow-gateway with https configuration
cat <<EOF > /kubeflow-gateway.yaml
apiVersion: networking.istio.io/v1beta1
kind: Gateway
metadata:
  name: kubeflow-gateway
  namespace: kubeflow
spec:
  selector:
    istio: ingressgateway
  servers:
  - hosts:
    - '*'
    port:
      name: http
      protocol: HTTP
  - hosts:
    - '*'
    port:
      name: https
      number: 443
      protocol: HTTPS
    tls:
      credentialName: kf-credential
      mode: SIMPLE
EOF

kubectl apply -f /kubeflow-gateway.yaml

# patch all NodePorts of kubeflow to avoid port confliction
https=$3
status=$(($https+1))
http=$(($status+1))
tcp=$(($http+1))
tls=$(($tcp+1))
kubectl patch svc -n auth dex -p '{"spec":{"ports":[{"name":"dex","port":5556}], "type": "ClusterIP"}}'
kubectl patch svc -n istio-system istio-ingressgateway -p '{"spec":{"ports":[{"name":"https","nodePort":'${https}',"port":443}, {"name":"status-port", "nodePort": '${status}', "port":15021},
                                                                {"name": "http2", "nodePort": '${http}', "port": 80}, {"name": "tcp", "nodePort": '${tcp}', "port": 31400}, {"name": "tls", "nodePort": '${tls}', "port": 15443}]}}'
# install kubeflow pipeline authentication proxy
while ! kubectl apply -f /kfp-proxy; do echo "Retrying to apply kfp-proxy"; sleep 10; done

