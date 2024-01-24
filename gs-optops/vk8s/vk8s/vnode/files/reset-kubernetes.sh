#!/bin/bash
kubeadm reset -f

rm $HOME/.kube/config

# cleanup CNI
if [[ $KUBE_NODE_TYPE == "INNER" ]]; then
    rm -f /etc/cni/net.d/10-flannel.conflist
    rm -rf /run/flannel
    ip link delete flannel.1
    ip link delete cni0
else
    rm -f /etc/cni/net.d/10-calico.conflist
    rm -f /etc/cni/net.d/calico-kubeconfig
    rm -rf /run/calico
fi