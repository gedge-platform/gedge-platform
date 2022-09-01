#!/bin/bash

# Config Static value
YAML_PATH="../yaml"
BUCKET_NAME="gedge-bucket"

while :
do
    read -p "Master Cluster?(y or n): " MASTER_YN
    if [[ $MASTER_YN = 'n' ]] || [ $MASTER_YN = 'y' ]; then
        break
    fi
    echo "Error Input!"
done

if [ $MASTER_YN = 'n' ]; then
    read -p "Master Object Storage Accesskey: " ACCESSKEY
    read -p "Master Object Storage Secretkey: " SECRETKEY
    read -p "Master Object Storage Bucket IP: " BUCKETIP
	if [[ -z $ACCESSKEY ]] || [[ -z $SECRETKEY ]] || [[ -z $BUCKETIP ]]; then
		echo "NO Input Master Object Info"
		exit 1
	fi
fi


# -------------------------------------------------------------------------------------
function object_storage_config(){
  #Rook Ceph Multisite Config
	if [ $MASTER_YN = 'y' ]; then
		kubectl apply -f $YAML_PATH/rook-ceph/master/master-m1.yaml
		kubectl apply -f $YAML_PATH/rook-ceph/master/master-m2.yaml
		kubectl apply -f $YAML_PATH/rook-ceph/master/master-m3.yaml
	else
    	cat << EOF > $YAML_PATH/rook-ceph/slave/slave-s0.yaml
apiVersion: v1 
kind: Secret 
metadata: 
  name: cy-realm-keys 
  namespace: rook-ceph 
data: 
  access-key: $ACCESSKEY
  secret-key: $SECRETKEY
EOF
		kubectl apply -f $YAML_PATH/rook-ceph/slave/slave-s0.yaml
        cat << EOF > $YAML_PATH/rook-ceph/slave/slave-s1.yaml
apiVersion: ceph.rook.io/v1
kind: CephObjectRealm
metadata:
  name: cy-realm
  namespace: rook-ceph
spec:
  pull:
    endpoint: http://$BUCKETIP:80
---
apiVersion: ceph.rook.io/v1
kind: CephObjectZoneGroup
metadata:
  name: cy-zonegroup
  namespace: rook-ceph
spec:
  realm: cy-realm
EOF
		kubectl apply -f $YAML_PATH/rook-ceph/slave/slave-s1.yaml
        cat << EOF > $YAML_PATH/rook-ceph/slave/slave-s2.yaml
---
apiVersion: ceph.rook.io/v1
kind: CephObjectZone
metadata:
  name: cy-zone-b
  namespace: rook-ceph
spec:
  zoneGroup: cy-zonegroup
  metadataPool:
    failureDomain: host
    replicated:
      size: 1
  dataPool:
    failureDomain: host
    replicated:
      size: 1
    parameters:
      compression_mode: none
---
apiVersion: ceph.rook.io/v1
kind: CephObjectStore
metadata:
  name: cy-zone-rgw
  namespace: rook-ceph
spec:
  gateway:
    type: s3
    port: 80
    instances: 1
  zone:
    name: cy-zone-b
EOF
		kubectl apply -f $YAML_PATH/rook-ceph/slave/slave-s2.yaml
		kubectl apply -f $YAML_PATH/rook-ceph/slave/slave-s3.yaml
	fi

	while :
	do
		RGW_POD_COUNT=`kubectl get pods -n rook-ceph -l app=rook-ceph-rgw --field-selector=status.phase=Running 2>/dev/null | wc -l`
		RGW_POD_NAME=`kubectl get pods -n rook-ceph -l app=rook-ceph-rgw --field-selector=status.phase=Running 2>/dev/null | tail -n 1 | cut -d ' ' -f1`
		if [ $RGW_POD_COUNT = 2 ]; then
			break
		fi
		echo "Wait RGW UP..."
		sleep 10
	done
	ROOK_BF_IP=`kubectl get svc -n rook-ceph | grep 'zone-rgw' | tr -s ' ' | cut -d ' ' -f3`
	ROOK_AT_IP=`kubectl get svc -n rook-ceph | grep 'external' | tr -s ' ' | cut -d ' ' -f4`
	TOOLBOX_POD_NAME=`kubectl get pod -n rook-ceph | grep 'tools' | tr -s ' ' | cut -d ' ' -f1`

	kubectl exec -n rook-ceph $TOOLBOX_POD_NAME -- bash -c "radosgw-admin zonegroup get > /root/ab.json"
	kubectl exec -n rook-ceph $TOOLBOX_POD_NAME -- bash -c "sed -i "s/$ROOK_BF_IP/$ROOK_AT_IP/g" /root/ab.json"
	kubectl exec -n rook-ceph $TOOLBOX_POD_NAME -- bash -c "radosgw-admin zonegroup set --infile=/root/ab.json"
	kubectl exec -n rook-ceph $TOOLBOX_POD_NAME -- bash -c "radosgw-admin period update --commit"

	ACCESSKEY=`kubectl get secret -n rook-ceph cy-realm-keys -o yaml | grep access-key | cut -d ' ' -f4`
	SECRETKEY=`kubectl get secret -n rook-ceph cy-realm-keys -o yaml | grep secret-key | cut -d ' ' -f4`
	BUCKETIP=`kubectl get svc -n rook-ceph | grep 'external' | tr -s ' ' | cut -d ' ' -f4`
	USER_ACCESSKEY=`kubectl exec -n rook-ceph $TOOLBOX_POD_NAME -- bash -c "radosgw-admin user info --uid=cy-realm-system-user" | grep access_key | cut -d "\"" -f4`
	USER_SECRETKEY=`kubectl exec -n rook-ceph $TOOLBOX_POD_NAME -- bash -c "radosgw-admin user info --uid=cy-realm-system-user" | grep secret_key | cut -d "\"" -f4`
}
# -------------------------------------------------------------------------------------
function datashim_dataset_config(){
	cat << EOF > ~/.s3cfg
[default]
access_key = $USER_ACCESSKEY
secret_key = $USER_SECRETKEY
host_base = $BUCKETIP
host_bucket = $BUCKETIP/%(bucket)
use_https = False
EOF
	if [ $MASTER_YN = 'y' ]; then
		s3cmd mb s3://$BUCKET_NAME
	fi

	cat << EOF > $YAML_PATH/datashim/dataset-s3.yaml
apiVersion: com.ie.ibm.hpsys/v1alpha1
kind: Dataset
metadata:
  name: datashim-dataset-s3
spec:
  local:
    type: "COS"
    accessKeyID: "$USER_ACCESSKEY"
    secretAccessKey: "$USER_SECRETKEY"
    endpoint: "http://$BUCKETIP"
    bucket: "$BUCKET_NAME"
EOF
    kubectl apply -f $YAML_PATH/datashim/dataset-s3.yaml
}


# -------------------------------------------------------------------------------------
# 	- Main -
object_storage_config
datashim_dataset_config

echo "Access Key : $ACCESSKEY"
echo "Secret Key : $SECRETKEY"
echo "Bueckt IP : $BUCKETIP"
echo -e "\nFinish Config Multisite"
# -------------------------------------------------------------------------------------