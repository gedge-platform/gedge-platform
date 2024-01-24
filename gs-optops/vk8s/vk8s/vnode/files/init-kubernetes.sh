#!/bin/bash

if [ $# -ne 2 ]; then
    echo "Usage: ./init-kubernetes.sh <pod-network-cidr> <service-cidr>"
    exit -1
fi

pod_network_cidr=$1
service_cidr=$2

# init kubernetes cluster
kubeadm init --kubernetes-version $(kubeadm version -o short) \
--pod-network-cidr=$pod_network_cidr \
--apiserver-advertise-address=$(hostname -i) \
--service-cidr=$service_cidr \
--skip-phases=preflight

# copy new kubeconfig
mkdir -p $HOME/.kube
cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
chown $(id -u):$(id -g) $HOME/.kube/config

# apply CNI
wget https://raw.githubusercontent.com/flannel-io/flannel/master/Documentation/kube-flannel.yml
sed -i "s|10.244.0.0/16|${pod_network_cidr}|g" /kube-flannel.yml
kubectl apply -f kube-flannel.yml
kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/ip-masq-agent/master/ip-masq-agent.yaml

kubectl create -f nvidia-device-plugin.yml
