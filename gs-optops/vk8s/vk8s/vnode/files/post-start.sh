#!/bin/bash

# create symbolic link to backup directory
mkdir -p /vk8s-backup/etc-kubernetes
mkdir -p /vk8s-backup/kubelet
mkdir -p /vk8s-backup/kubeconfig
mkdir -p /vk8s-backup/etcd
mkdir -p /vk8s-backup/cni
mkdir -p /etc/cni

ln -s /vk8s-backup/etc-kubernetes /etc/kubernetes
ln -s /vk8s-backup/kubelet /var/lib/kubelet
ln -s /vk8s-backup/kubeconfig /root/.kube
ln -s /vk8s-backup/etcd /var/lib/etcd
ln -s /vk8s-backup/cni /etc/cni/net.d

# start docker and kubelet service
# ensure systemd is enabled
max_tries=10
current_try=0
while [ $current_try -lt $max_tries ] && [ "$(systemctl status docker | awk '$1 == "Active:" {print $2}')" != "active" ]
do 
    systemctl restart docker
    current_try=$(($current_try+1))
    sleep 0.5
done
current_try=0
while [ $current_try -lt $max_tries ] && [ -f /var/lib/kubelet/config.yaml ] && [ "$(systemctl status kubelet | awk '$1 == "Active:" {print $2}')" != "active" ]
do 
    systemctl restart kubelet
    current_try=$(($current_try+1))
    sleep 0.5
done
# configure allocated gpu
echo $NVIDIA_ALLOCATED_DEVICES > /gpu.env