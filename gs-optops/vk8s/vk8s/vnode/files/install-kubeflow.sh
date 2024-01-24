#!/bin/bash

if [ $# -ne 5 ]; then
  echo "Usage: ./install-kubeflow <kubeflow-version> <image-registry> <browser-port-number> <email> <password>"
  exit -1
fi

kubeflow_version=$1
registry=$2
kubeflow_ui=$3
export email=$4
export username=$(echo $email | cut -d "@" -f 1)
export password=$5
# check api-server alive
curl -s -k https://localhost:6443/livez
while [ $? -ne 0 ]; do
  sleep 1
  echo "checking apiserver..."
  curl -s -k https://localhost:6443/livez
done
# install local-path-provisioner
kubectl apply -f https://raw.githubusercontent.com/rancher/local-path-provisioner/v0.0.22/deploy/local-path-storage.yaml
kubectl patch storageclass local-path -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"true"}}}'

# install kubeflow using local-path storage class
git clone https://P174350:tde2-sSysysBWbG6KLYKK4xJ1@gitlab.tde.sktelecom.com/SCALEBACK/manifests.git
cd manifests
# git checkout tags/$kubeflow_version
git checkout origin/$kubeflow_version
find . -type f -name "*.yaml" -exec sed -i 's@scale-registry@'${registry}@'g' {} +
find . -type f -name "*.py" -exec sed -i 's@scale-registry@'${registry}'@g' {} +
while ! kustomize build example | kubectl apply -f -; do
  echo "Retrying to apply resources"
  sleep 10
done

# generate self-signed certifiacte
openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -subj '/O=SKT Inc./CN=kubeflow-user-example-com.local' -keyout /etc/ssl/certs/kubeflow.key -out /etc/ssl/certs/kubeflow.crt

# create certificate secret
kubectl create -n istio-system secret tls kf-credential --key=/etc/ssl/certs/kubeflow.key --cert=/etc/ssl/certs/kubeflow.crt

# apply kubeflow-gateway with https configuration
cat <<EOF >/kubeflow-gateway.yaml
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

max_idx=100
function get_conflicted_port_idx() {
  local port=$1
  shift
  local ports=("$@")
  for ((idx = 0; idx < ${#ports[@]}; idx++)); do
    p=${ports[$idx]}
    if [ $p -eq $port ]; then
      echo $idx
      return
    fi
  done
  echo $max_idx
}

function is_exists() {
  local port=$1
  shift
  local ports=("$@")
  for p in $ports; do
    if [ $p -eq $port ]; then
      # echo 0 # true
      return 0
    fi
  done
  # echo 1
  return 1
}
total_nodeports=()
istio_nodeports=$(kubectl get svc istio-ingressgateway -n istio-system -ojsonpath='{range .spec.ports[*]}{.nodePort}{" "}{end}')
dex_nodeports=$(kubectl get svc dex -n auth -ojsonpath='{range .spec.ports[*]}{.nodePort}{" "}{end}')

istio_ports=($(kubectl get svc istio-ingressgateway -n istio-system -ojsonpath='{range .spec.ports[*]}{.port}{" "}{end}'))
dex_ports=($(kubectl get svc dex -n auth -ojsonpath='{range .spec.ports[*]}{.port}{" "}{end}'))

istio_port_names=($(kubectl get svc istio-ingressgateway -n istio-system -ojsonpath='{range .spec.ports[*]}{.name}{" "}{end}'))
dex_port_names=($(kubectl get svc dex -n auth -ojsonpath='{range .spec.ports[*]}{.name}{" "}{end}'))

min_port=30001
max_port=2767 # 32767

total_nodeports+=$istio_nodeports
total_nodeports+=$dex_nodeports
nodeport=$kubeflow_ui
updated="false"
# dex service patch
conflicted_idx=$(get_conflicted_port_idx $nodeport ${dex_nodeports[@]})
if [ ! $conflicted_idx -eq $max_idx ]; then
  new_port=$((($RANDOM % $max_port) + $min_port))
  while :; do
    if [[ ! $(is_exists $new_port ${total_nodeports[@]}) ]]; then
      break
    fi
    new_port=$((($RANDOM % $max_port) + $min_port))
  done
  port_name=${dex_port_names[$conflicted_idx]}
  port=${dex_ports[$conflicted_idx]}
  kubectl patch svc -n auth dex -p '{"spec":{"ports":[{"name":"'$port_name'","nodePort":'$new_port',"port":'$port'}]}}'
  updated="true"
  echo "update nodeport"
fi

if [ $updated = "false" ]; then
  conflicted_idx=$(get_conflicted_port_idx $nodeport ${istio_nodeports[@]})
  if [ ! $conflicted_idx -eq $max_idx ]; then
    new_port=$((($RANDOM % $max_port) + $min_port))
    while :; do
      if [[ ! $(is_exists $new_port ${total_nodeports[@]}) ]]; then
        break
      fi
      new_port=$((($RANDOM % $max_port) + $min_port))
    done
    port_name=${istio_port_names[$conflicted_idx]}
    port=${istio_ports[$conflicted_idx]}
    kubectl patch svc -n istio-system istio-ingressgateway -p '{"spec":{"ports":[{"name":"'$port_name'","nodePort":'$new_port',"port":'$port'}]}}'
    echo "update nodeport"
  fi
fi
kubectl patch svc -n istio-system istio-ingressgateway -p '{"spec":{"ports":[{"name":"https","nodePort":'${kubeflow_ui}',"port":443}]}}'

# create new account
cat <<EOF >/profile.yaml
apiVersion: kubeflow.org/v1
kind: Profile
metadata:
  name: $username
spec:
  owner:
    kind: User
    name: $email
EOF
kubectl apply -f /profile.yaml

export hashed=$(htpasswd -nbBC 10 user $password | cut -d ":" -f 2 | tr -d "\n")
export uuid=$(uuidgen)

export config="$(kubectl get cm dex -n auth -o jsonpath='{.data.config\.yaml}' | yq '.staticPasswords += {"email": strenv(email), "hash": strenv(hashed), "userID": strenv(uuid), "username": strenv(username)}')"
data=$(kubectl get cm dex -n auth -o jsonpath='{.data}' | yq -P -I 4 '."config.yaml" = strenv(config)')

cat <<EOF >/cm.yaml
apiVersion: v1
data:
  $data
kind: ConfigMap
metadata:
  name: dex
  namespace: auth
EOF
kubectl apply -f /cm.yaml

kubectl rollout restart deployment dex -n auth
# install kubeflow pipeline authentication proxy
sed -i "s/username/$username/g" /kfp-proxy/k8s-pipeline-auth.yaml
sed -i "s/email/$email/g" /kfp-proxy/k8s-profile-auth.yaml
while ! (kubectl apply -n $username -f /kfp-proxy/k8s-deployment.yaml && kubectl apply -n $username -f /kfp-proxy/k8s-profile-auth.yaml && kubectl apply -f /kfp-proxy/k8s-pipeline-auth.yaml); do echo "Retrying to apply kfp-proxy"; sleep 10; done
