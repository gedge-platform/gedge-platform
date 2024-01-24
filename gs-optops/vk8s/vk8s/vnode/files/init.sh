#!/bin/bash

# enable kubelet
systemctl daemon-reload
systemctl enable kubelet --now
systemctl restart kubelet

# restart docker
#dmsetup mknodes # this is only for devicemapper driver
systemctl restart docker

# load kernel module for kubernetes
modprobe overlay
modprobe br_netfilter
sysctl --system

#sed -i '13i nameserver 8.8.8.8' /run/systemd/resolve/resolv.conf # this is for ubuntu
#sed -i '14,15s/^/#/' /run/systemd/resolve/resolv.conf # this is for ubuntu
#cp /etc/resolv.conf /etc/resolv.conf.bak
#printf 'nameserver 8.8.8.8' > /etc/resolv.conf


# make "/" directory to rshared mode for calico
mount --make-rshared /
