#!/bin/bash

# Config Static value
PASSWORD="******"
Path="/root/cloud-platform/yaml"

# No Input Error
if [ "$#" -lt 1 ]; then
	echo "No Input Default Network Plugin (cilium, flannel)"
	exit 1
fi

# Kubernetes Reset And Network Reset
echo -e "Kubernetes Reset Start\n"
echo $PASSWORD | sudo -S kubeadm reset -f
echo $PASSWORD | sudo -S rm -rf ~/.kube
echo $PASSWORD | sudo -S rm -rf /etc/cni/net.d
echo -e "\nKubernetes Reset Complete"

echo -e "\n\nNetwork Interface Delete\n"
if [ "$1" == "cilium" ]; then
	echo $PASSWORD | sudo -S ip link delete cni0
	echo $PASSWORD | sudo -S ip link delete flannel.1
elif [ "$1" == "flannel" ]; then
	echo $PASSWORD | sudo -S ip link delete cilium_host
	echo $PASSWORD | sudo -S ip link delete cilium_vxlan
else
	echo -e "\n\nInput Error, flannel or cilium Input"
	echo "Network Reset Error"
	exit 1
fi
echo -e "\nReset Complete"

sleep 1

# Kubernetees Init
echo -e "\n\nKubernetes Init"

if [ "$1" == "cilium" ]; then
	echo -e "\nCilium Network Plugin\n"
	echo $PASSWORD | sudo -S kubeadm init
elif [ "$1" == "flannel" ]; then
	echo -e "\nFlannel Network Plugin\n"
	echo $PASSWORD | sudo -S kubeadm init --pod-network-cidr=10.244.0.0/16
fi

mkdir -p $HOME/.kube
echo $PASSWORD | sudo -S cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
echo $PASSWORD | sudo -S chown $(id -u):$(id -g) $HOME/.kube/config

echo -e "Kubernetes Init Complete\n"

sleep 1

# Default Network Plugin Install
if [ "$1" == "cilium" ]; then
	kubectl apply -f $Path/network/cilium-install.yaml
else
	kubectl apply -f $Path/network/kube-flannel.yml
fi

# Network plugin install
kubectl apply -f $Path/network/multus-daemonset.yml

kubectl apply -f $Path/network/configMap.yaml
kubectl apply -f $Path/network/sriovdp-daemonset.yaml

# nvidia plugin install
kubectl apply -f $Path/nvidia/nvidia-device-plugin.yml

# Ceph Plugin install
kubectl apply -f $Path/ceph/csi-config-map.yaml
kubectl apply -f $Path/ceph/csi-rbd-secret.yaml
kubectl apply -f $Path/ceph/kms-config.yaml
kubectl apply -f $Path/ceph/csi-provisioner-rbac.yaml
kubectl apply -f $Path/ceph/csi-nodeplugin-rbac.yaml
kubectl apply -f $Path/ceph/csi-rbdplugin-provisioner.yaml
kubectl apply -f $Path/ceph/csi-rbdplugin.yaml
kubectl apply -f $Path/ceph/csi-rbd-sc.yaml
echo -e "\nPlugin Install Complete\n"

# CPU Manager Policy Apply
if [ "$2" == "1" ]; then
	kubectl apply -f $Path/configmap/kubelet-cm-cpumanager.yml
	echo -e "CPU Manager Policy Static Apply\n"
elif [ "$2" == "single" ]; then
	kubectl apply -f $Path/configmap/topology-single.yml
	echo -e "Topology Manager : Single-Numa-Node\n"
elif [ "$2" == "best" ]; then
        kubectl apply -f $Path/configmap/topology-best-effort.yml
	echo -e "Topology Manager : Best-Effort\n"
elif [ "$2" == "restricted" ]; then
        kubectl apply -f $Path/configmap/topology-restricted.yml
	echo -e "Topology Manager : Restricted\n"
fi

# Admin API Key Create
kubectl apply -f $Path/chmod/admin.yaml

# Namespace Create
kubectl create namespace gedge-default

# Ceph PVC Create
kubectl apply -f $Path/ceph/pvc.yml
