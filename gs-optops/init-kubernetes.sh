#!/bin/bash

# init kubernetes cluster
if [[ $KUBE_NODE_TYPE == "INNER" ]]; then
    kubeadm init --kubernetes-version $(kubeadm version -o short) \
    --pod-network-cidr=10.244.0.0/16 \
    --apiserver-advertise-address=$(hostname -i) \
    --service-cidr=90.96.0.0/12
else
    kubeadm init --kubernetes-version $(kubeadm version -o short) \
    --pod-network-cidr=90.244.0.0/16 \
    --apiserver-advertise-address=$(hostname -i) \
    --service-dns-domain=cluster.outer
fi

# copy new kubeconfig
mkdir -p $HOME/.kube
cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
chown $(id -u):$(id -g) $HOME/.kube/config

# apply CNI
if [[ $KUBE_NODE_TYPE == "INNER" ]]; then
    kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/v0.14.0/Documentation/kube-flannel.yml
    kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/ip-masq-agent/master/ip-masq-agent.yaml
else
    kubectl apply -f calico.yaml
fi

nvidia=$(which nvidia-smi)
if [ ! -z $nvidia ]
then
    kubectl create -f https://raw.githubusercontent.com/NVIDIA/k8s-device-plugin/v0.9.0/nvidia-device-plugin.yml
fi
