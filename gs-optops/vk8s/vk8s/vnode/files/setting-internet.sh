#!/bin/bash

# wait for all ip-masq-agent pods are running
function check_masq_running(){
  local nodes=($(kubectl get no -o jsonpath='{.items[*].metadata.name}'))
  local currentNum=$(kubectl get -n kube-system daemonsets ip-masq-agent -o jsonpath='{.status.numberReady}')
  local desiredNum=${#nodes[@]}
  if [ $desiredNum -eq $currentNum ]
  then
    echo true
  else
    echo false
  fi
}

# check internet pod is running
function check_internet_pod_running(){
  local phase=$(kubectl get po internet -o jsonpath='{.status.phase}')
  if [[ $phase == "Running" ]]
  then
    echo true
  else
    echo false
  fi
}

while [[ $(check_masq_running) = false ]]
do 	
	echo "Waiting masq agent pod Running..."
	sleep 5
done
echo "all pod running"

cat > internet.yaml <<EOF
apiVersion: v1
kind: Pod
metadata:
  name: internet
spec:
  containers:
  - image: pstauffer/curl
    name: internet
    command: ["sleep", "1000"]
  dnsPolicy: ClusterFirst
  nodeSelector:
    role: master
status: {}
EOF

kubectl apply -f internet.yaml
while [[ $(check_internet_pod_running) = false ]]
do
  echo "Waiting internet pod Running..."
  sleep 5
done

# connect external internet
kubectl exec internet -- nslookup google.com

# cleanup
kubectl delete -f internet.yaml