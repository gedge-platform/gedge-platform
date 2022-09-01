#!/bin/bash

# -------------------------------------------------------------------------------------
#Worker Node Config Static Value
PASSWORD=*****
NETWORK_IF=eno1

# -------------------------------------------------------------------------------------
echo "k8s Reset"

echo $PASSWORD | sudo -S kubeadm reset -f 2> /dev/null

# -------------------------------------------------------------------------------------
echo -e "\n\nNetwork Interface Delete"

echo $PASSWORD | sudo -S rm -rf /etc/cni/net.d
echo $PASSWORD | sudo -S ip link delete cni0
echo $PASSWORD | sudo -S ip link delete flannel.1
#echo $PASSWORD | sudo -S ip link delete cilium_host
#echo $PASSWORD | sudo -S ip link delete cilium_vxlan

SRIOV_FILE_PATH="/sys/class/net/$NETWORK_IF/device/sriov_numvfs"

SRIOV_TOTAL=`echo $PASSWORD | sudo -S cat /sys/class/net/$NETWORK_IF/device/sriov_totalvfs 2> /dev/null`

if [ -e $SRIOV_FILE_PATH ]; then
        echo -e "\nSR-IOV Reset"
        echo $PASSWORD | sudo -S tee /sys/class/net/$NETWORK_IF/device/sriov_numvfs <<< 0 > /dev/null
        echo -e "SR-IOV Max NIC : $SRIOV_TOTAL\n"
        echo $PASSWORD | sudo -S tee /sys/class/net/$NETWORK_IF/device/sriov_numvfs <<< $SRIOV_TOTAL > /dev/null
fi

echo -e "\nReset Complete\n"
# -------------------------------------------------------------------------------------

echo $PASSWORD | sudo -S kubeadm join 192.168.10.92:6443 --token mpkroh.0xdjnicy9rva63kb --discovery-token-ca-cert-hash sha256:011dd5149b070ac5cb5adb9539c79bd6251b5b66a8530f2652f6f3d520f106ac
