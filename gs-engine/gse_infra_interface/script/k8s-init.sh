#!/bin/bash

# Config Static value
PASSWORD="*****"

YAML_PATH="../yaml"
SCRIPT_PATH="../script"

NETWORK_INTERFACE="eno1"

NODE_LIST=(192.168.10.108 192.168.10.192 192.168.10.251)
NODE_ID="gedge"
NODE_PWD="*****"

IP=`ifconfig $NETWORK_INTERFACE | grep 'inet ' | cut -d ' ' -f10`

# -------------------------------------------------------------------------------------
read -p "1: K8S, 2: K3S (Default : K8S) : " KUBE_TYPE
if [ -z "$KUBE_TYPE" ]; then
	KUBE_TYPE=1
	echo -e "Default Type : K8S"
else
	if [ $KUBE_TYPE = 1 ]; then
		echo -e "Select Type : K8S"
	elif [ $KUBE_TYPE = 2 ]; then
		CLUSTER=1
		echo -e "Select Type : K3S"
	else
		echo "Error Input Type!!"
		exit 1
	fi
fi

if [ $KUBE_TYPE = 1 ]; then
	echo -e "\nMaster IP : $IP\n"
	for node in ${NODE_LIST[*]};
	do
		echo -e "Node List : $node\n"
	done

	# Cluster Select
	read -p "Cluster Number (Ex.1,2,3,4,...): " CLUSTER
	if [ -z "$CLUSTER" ]; then
		CLUSTER=1
		CLUSTER_NAME="cluster$CLUSTER"
		echo -e "Default Cluster1\n"
	else
		CLUSTER_NAME="cluster$CLUSTER"
		echo -e "Config Cluster: $CLUSTER_NAME\n"
	fi
fi

# MetalLB IP Config
read -p "MetalLB IP (Ex.192.168.10.XX-192.168.10.YY): " METALLB_IP
if [ -z "$METALLB_IP" ]; then
	METALLB_IP="192.168.10.97-192.168.10.100"
	echo -e "Default MetalLB: $METALLB_IP\n"
else
	echo -e "Config MetalLB IP: $METALLB_IP\n"
fi

# Virtual Kubelet config
read -p "Virtual Kubelet Provider: " EX_PROVIDER
if [ -z "$EX_PROVIDER" ]; then
	EX_PROVIDER=""
	echo -e "Default Virtual Provider: None\n"
else
	echo -e "Config virtual Provider: $EX_PROVIDER\n"
fi
# -------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------
function k3s_init(){
	/usr/local/bin/k3s-uninstall.sh
	curl -sfL https://get.k3s.io | sh -
	echo $PASSWORD | sudo -S chmod 664 /etc/rancher/k3s/k3s.yaml
}
# -------------------------------------------------------------------------------------
function install_pkg(){
	echo $PASSWORD | sudo -S apt install sshpass make git s3cmd -y
}
# -------------------------------------------------------------------------------------
function kube_reset(){
	echo -e "Kubernetes Reset Start....\n"
	echo $PASSWORD | sudo -S kubeadm reset -f
	echo $PASSWORD | sudo -S rm -rf ~/.kube
	
	echo -e "\n\nKubernetes Network Interface Delete"
	echo $PASSWORD | sudo -S rm -rf /etc/cni/net.d
	echo $PASSWORD | sudo -S ip link delete cni0
	echo $PASSWORD | sudo -S ip link delete flannel.1
	#echo \$PASSWORD | sudo -S ip link delete cilium_host
	#echo \$PASSWORD | sudo -S ip link delete cilium_vxlan
	
	echo -e "\nKubernetes Reset Complete"

	sleep 1
}
# -------------------------------------------------------------------------------------
function kube_init(){
	echo -e "\n\nKubernetes Init...."

	echo -e "\nFlannel Network Plugin Apply\n"
	if [ -z "$IP" ]; then
		echo $PASSWORD | sudo -S kubeadm init --pod-network-cidr=10.244.0.0/16 
	else
		echo $PASSWORD | sudo -S kubeadm init --pod-network-cidr=10.244.0.0/16 --apiserver-advertise-address=$IP
	fi

	mkdir -p $HOME/.kube
	echo $PASSWORD | sudo -S cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
	echo $PASSWORD | sudo -S chown $(id -u):$(id -g) $HOME/.kube/config

	echo $PASSWORD | sudo -S cp $HOME/.kube/config $HOME/.kube/default_config
		
	echo $PASSWORD | sudo -S sed -i "s/kubernetes.*/$CLUSTER_NAME/g" $HOME/.kube/config

	echo -e "Kubernetes Init Complete\n"

	sleep 1
}
# -------------------------------------------------------------------------------------
function network_plugin_install(){
	echo -e "Flannel Plugin install\n"
	kubectl apply -f $YAML_PATH/network/kube-flannel.yml

	echo -e "Multus Plugin install\n"
	kubectl apply -f $YAML_PATH/network/multus-daemonset.yml

	echo -e "SR-IOV Plugin install\n"
	kubectl apply -f $YAML_PATH/network/configMap.yaml -f $YAML_PATH/network/sriovdp-daemonset.yaml
}

function nvidia_plugin_install(){
	echo -e "NVIDIA Plugin install\n"
	kubectl apply -f $YAML_PATH/nvidia/nvidia-device-plugin.yml
}

function metallb_plugin_install(){
	echo -e "\nMetalLB Install\n"

	kubectl apply -f $YAML_PATH/metallb/namespace.yaml
	kubectl apply -f $YAML_PATH/metallb/metallb.yaml
	cat > $YAML_PATH/metallb/metallb-config.yaml << EOF
apiVersion: v1
kind: ConfigMap
metadata:
  namespace: metallb-system
  name: config
data:
  config: |
    address-pools:
    - name: default
      protocol: layer2
      addresses:
      - $METALLB_IP
EOF
	kubectl apply -f $YAML_PATH/metallb/metallb-config.yaml
}

function rook_ceph_plugin_install(){
	echo -e "\nRook-Ceph Install\n"
	kubectl apply -f $YAML_PATH/rook-ceph/crds.yaml
	kubectl apply -f $YAML_PATH/rook-ceph/common.yaml
	kubectl apply -f $YAML_PATH/rook-ceph/operator.yaml
	if [ $CLUSTER = 1 ]; then
		kubectl apply -f $YAML_PATH/rook-ceph/master-rook-config.yaml
	else
		cat << EOF > $YAML_PATH/rook-ceph/slave-rook-config.yaml
apiVersion: v1 
kind: ConfigMap 
metadata:
  name: rook-config-override
  namespace: rook-ceph 
data: 
  config: | 
    [global]
    osd_pool_default_size = 1 
    public network = 192.168.10.0/24
    cluster network = 192.168.10.0/24
    public addr = ""
    cluster addr = ""
    rgw dns name = rgw-slave$CLUSTER.etri.kr
    public addr = ""
    cluster addr = ""
    rgw_ops_log_rados = true
    rgw_enable_ops_log = true
    rgw_enable_usage_log = true
    debug rgw = 20
    rgw_log_http_headers = http_x_forwarded_for
    rgw_resolve_cname = true
EOF
		kubectl apply -f $YAML_PATH/rook-ceph/slave-rook-config.yaml
	fi
	kubectl apply -f $YAML_PATH/rook-ceph/cluster.yaml
	kubectl apply -f $YAML_PATH/rook-ceph/toolbox.yaml
}

function datashim_plugin_install(){
	# Datashim Install
	kubectl apply -f $YAML_PATH/datashim/dlf.yaml
}

function istio_plugin_install(){
	echo -e "\nIstio Install\n"
	sh - $YAML_PATH/istio/istio_install.sh
	mv ./istio-* ./istio_file
	rm -rf $YAML_PATH/istio/istio_file
	mv -f ./istio_file $YAML_PATH/istio/
	if [ $CLUSTER = 1 ]; then
		if [ -d $YAML_PATH/istio/certs ]; then
			rm -rf $YAML_PATH/istio/certs
		fi
		mkdir $YAML_PATH/istio/certs
		make -f $YAML_PATH/istio/istio_file/tools/certs/Makefile.selfsigned.mk root-ca
		make -f $YAML_PATH/istio/istio_file/tools/certs/Makefile.selfsigned.mk cluster-cacerts
		mv ./root-* $YAML_PATH/istio/certs
		mv -f ./cluster $YAML_PATH/istio/certs
	fi
	kubectl --context=$CLUSTER_NAME create namespace istio-system
	kubectl --context=$CLUSTER_NAME create secret generic cacerts -n istio-system --from-file=$YAML_PATH/istio/certs/cluster/ca-cert.pem --from-file=$YAML_PATH/istio/certs/cluster/ca-key.pem --from-file=$YAML_PATH/istio/certs/cluster/root-cert.pem --from-file=$YAML_PATH/istio/certs/cluster/cert-chain.pem
	kubectl --context=$CLUSTER_NAME label namespace istio-system topology.istio.io/network=$CLUSTER_NAME --overwrite
	cat << EOF > $YAML_PATH/istio/$CLUSTER_NAME.yaml
apiVersion: install.istio.io/v1alpha1
kind: IstioOperator
metadata:
  namespace: istio-system
  name: remote-istiocontrolplane
spec:
  profile: default
  values:
    global:
      controlPlaneSecurityEnabled: true
      mtls:
        # Require all service to service communication to have mtls
        enabled: true
    global:
      meshID: mesh1
      multiCluster:
        clusterName: $CLUSTER_NAME
      network: $CLUSTER_NAME
  components:
    ingressGateways:
      - name: istio-eastwestgateway
        label:
          istio: eastwestgateway
          app: istio-eastwestgateway
          topology.istio.io/network: $CLUSTER_NAME
        enabled: true
        k8s:
          env:
            # sni-dnat adds the clusters required for AUTO_PASSTHROUGH mode
            - name: ISTIO_META_ROUTER_MODE
              value: "sni-dnat"
            # traffic through this gateway should be routed inside the network
            - name: ISTIO_META_REQUESTED_NETWORK_VIEW
              value: $CLUSTER_NAME
          service:
            ports:
              - name: status-port
                port: 15021
                targetPort: 15021
              - name: tls
                port: 15443
                targetPort: 15443
              - name: tls-istiod
                port: 15012
                targetPort: 15012
              - name: tls-webhook
                port: 15017
                targetPort: 15017
EOF
	$YAML_PATH/istio/istio_file/bin/istioctl --context=$CLUSTER_NAME manifest apply -f $YAML_PATH/istio/$CLUSTER_NAME.yaml --set profile=minimal -y
	kubectl apply -n istio-system -f $YAML_PATH/istio/expose-service.yaml
	if [ $CLUSTER = 5 ]; then
		$YAML_PATH/istio/istio_file/bin/istioctl x create-remote-secret --context=cluster1 --name=cluster1 | kubectl apply -f - --context=$CLUSTER_NAME
		$YAML_PATH/istio/istio_file/bin/istioctl x create-remote-secret --context=$CLUSTER_NAME --name=$CLUSTER_NAME | kubectl apply -f - --context=cluster1
	fi

	kubectl apply -f $YAML_PATH/istio/istio_file/samples/addons/prometheus.yaml
	kubectl apply -f $YAML_PATH/istio/istio_file/samples/addons/kiali.yaml
	kubectl apply -f $YAML_PATH/istio/dashboard_gateway.yaml
}

function install_plugin(){
	echo -e "\nPlugin Install....\n"
	network_plugin_install
	nvidia_plugin_install
	metallb_plugin_install
	rook_ceph_plugin_install
	istio_plugin_install
	datashim_plugin_install
	echo -e "\nPlugin Install Complete\n"
}
# -------------------------------------------------------------------------------------
function create_api_key(){
	# Admin API Key Create
	kubectl apply -f $YAML_PATH/chmod/admin.yaml
	echo -e "\nAPI Key Created\n"
}
# -------------------------------------------------------------------------------------
function create_namespace(){
	# Namespace Create
	kubectl create namespace gedge-default
	kubectl label namespace gedge-default istio-injection=enabled
	echo -e "\nNamespace Created\n"
}
# -------------------------------------------------------------------------------------
function create_worker_file(){
	#Token Read
	Token=`echo $PASSWORD | sudo -S kubeadm token list -o jsonpath='{.token}' 2> /dev/null`

	if [ -z "$Token" ]; then
	        echo $PASSWORD | sudo -S kubeadm token create > /dev/null 2> /dev/null
	        Token=`echo $PASSWORD | sudo -S kubeadm token list -o jsonpath='{.token}'`
	fi

	#Hash Read
	Hash=`echo $PASSWORD | sudo -S openssl x509 -pubkey -in /etc/kubernetes/pki/ca.crt | openssl rsa -pubin -outform der 2>/dev/null | openssl dgst -sha256 -hex | sed 's/^.* //'`

	#Worker Join File Create
	cat > $SCRIPT_PATH/k8s-init-worker.sh << EOF
#!/bin/bash

# -------------------------------------------------------------------------------------
#Worker Node Config Static Value
PASSWORD=$NODE_PWD
NETWORK_IF=eno1

# -------------------------------------------------------------------------------------
echo "k8s Reset"

echo \$PASSWORD | sudo -S kubeadm reset -f 2> /dev/null

# -------------------------------------------------------------------------------------
echo -e "\n\nNetwork Interface Delete"

echo \$PASSWORD | sudo -S rm -rf /etc/cni/net.d
echo \$PASSWORD | sudo -S ip link delete cni0
echo \$PASSWORD | sudo -S ip link delete flannel.1
#echo \$PASSWORD | sudo -S ip link delete cilium_host
#echo \$PASSWORD | sudo -S ip link delete cilium_vxlan

SRIOV_FILE_PATH="/sys/class/net/\$NETWORK_IF/device/sriov_numvfs"

SRIOV_TOTAL=\`echo \$PASSWORD | sudo -S cat /sys/class/net/\$NETWORK_IF/device/sriov_totalvfs 2> /dev/null\`

if [ -e \$SRIOV_FILE_PATH ]; then
        echo -e "\nSR-IOV Reset"
        echo \$PASSWORD | sudo -S tee /sys/class/net/\$NETWORK_IF/device/sriov_numvfs <<< 0 > /dev/null
        echo -e "SR-IOV Max NIC : \$SRIOV_TOTAL\n"
        echo \$PASSWORD | sudo -S tee /sys/class/net/\$NETWORK_IF/device/sriov_numvfs <<< \$SRIOV_TOTAL > /dev/null
fi

echo -e "\nReset Complete\n"
# -------------------------------------------------------------------------------------

echo \$PASSWORD | sudo -S kubeadm join $IP:6443 --token $Token --discovery-token-ca-cert-hash sha256:$Hash
EOF

	chmod 764 $SCRIPT_PATH/k8s-init-worker.sh
}
# -------------------------------------------------------------------------------------
function add_nodes(){
	echo -e "\n\nNode Install..."

	for node in ${NODE_LIST[*]};
	do
		NODE_IP_CVT=`echo $node | tr . _`
		echo -e "\n $node Install..."
		sshpass -p $NODE_PWD ssh -o StrictHostKeyChecking=no $NODE_ID@$node 'bash -s' < $SCRIPT_PATH/k8s-init-worker.sh
		# Rook-ceph Disk Init
		sshpass -p $NODE_PWD ssh -o StrictHostKeyChecking=no $NODE_ID@$node 'bash -s' < $SCRIPT_PATH/init-disk.sh $NODE_IP_CVT
	done
	
	NODE_NAME=`kubectl get node | tail -n +3 | cut -d ' ' -f1`
	LEN=${#NODE_NAME[@]}

	DATACENTER=dc$CLUSTER
	for (( i=0; i<${LEN}; i++));
	do 
		kubectl label node ${NODE_NAME[$i]} topology.rook.io/datacenter=$DATACENTER
		kubectl label node ${NODE_NAME[$i]} topology.rook.io/rack=rack$(($i+1))
	done
	
	echo -e "\n\nFinish Node Install"
}

# -------------------------------------------------------------------------------------
# 	- Main -
install_pkg
if [ $KUBE_TYPE = 1 ]; then
	kube_reset
	kube_init
	create_worker_file
	add_nodes
else
	k3s_init
fi
install_plugin
create_api_key
create_namespace

echo -e "\nFinish Install Kubernetes"
# -------------------------------------------------------------------------------------