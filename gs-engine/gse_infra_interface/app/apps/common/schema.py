"""
Kubenetes Schema Module
"""
import time
import json
from apps.common.utils import *

def cni_schema(cni_data):
    """
    CNI Schema Template

    Args:
        cni_data (_type_): _description_

    Raises:
        TypeError: _description_
        TypeError: _description_

    Returns:
        _type_: _description_
    """
    timestamp = str(int(time.time()))
    cni_type = cni_data['cni_type']
    nic_subnet = cni_data['nic_subnet']
    cni_ipm_type = cni_data['cni_ipm_type']

    cni_json_schema = {
        'apiVersion': 'k8s.cni.cncf.io/v1',
        'kind': 'NetworkAttachmentDefinition',
        'metadata': {
            'name': cni_type + '-nic-'+timestamp
        },
        'spec': {
            'config': {
                'cniVersion': '0.3.0' if cni_type == 'multus' else "0.3.1",
                'type': 'macvlan' if cni_type == 'multus' else "sriov",
                'mode': 'bridge',
                'ipam': {
                    'type': cni_ipm_type,
                }
            }
        }
    }
    if cni_ipm_type == "host-local":
        cni_json_schema['spec']['config']['ipam']['subnet'] = nic_subnet
    elif cni_ipm_type == "whereabouts":
        cni_json_schema['spec']['config']['ipam']['range'] = nic_subnet
    else:
        raise TypeError("Invaild CNI IPEM Type")

    if cni_type == "sriov" :
        cni_json_schema['metadata']['annotations'] = {
            'k8s.v1.cni.cncf.io/resourceName': 'intel.com/intel_sriov_netdevice'
        }
    elif cni_type == "multus":
        # 추후 클러스터 인터페이스 조회 후 입력
        cni_json_schema['spec']['config']['master'] = 'eno1'
    else:
        raise TypeError("Invaild CNI Type")

    cni_json_schema['spec']['config'] = json.dumps(cni_json_schema['spec']['config'],indent='\t')

    return cni_json_schema

def pvc_schema(pvc_data):
    """
    PVC Schema Template

    Args:
        pvc_data (_type_): _description_

    Returns:
        _type_: _description_
    """
    timestamp = str(int(time.time()))
    pvc_size = pvc_data['pvc_size']
    storageclass_name = pvc_data['strgclass_name']

    pvc_json_schema = {
        "apiVersion": "v1",
        "kind": "PersistentVolumeClaim",
        "metadata": {
            "name": "pvc-" + timestamp
        },
        "spec": {
            "accessModes":[
                "ReadWriteOnce"   
            ],
            "resources": {
                "requests": {
                    'storage': str(pvc_size) + "Gi"
                }
            },
            "storageClassName": storageclass_name
        }
    }
    
    return pvc_json_schema

def storageclass_schema(storageclass_data):
    """
    PVC Schema Template

    Args:
        storageclass_data (_type_): _description_

    Raises:
        TypeError: _description_

    Returns:
        _type_: _description_
    """
    
    timestamp = str(int(time.time()))
    storageclass_type = storageclass_data['storageclass_data']
    storageclass_json_schema = {
        "apiVersion": "storage.k8s.io/v1",
        "kind": "StorageClass",
        "metadata": {
            "name": "storageclass-" + timestamp
        },
        "provisioner": "Type",
        "reclaimPolicy": "Delete",
        "parameters": {}
    }
    
    if storageclass_type == "obj":
        storageclass_json_schema['parameters'] = {
            "objectStoreName": "my-store",
            "objectStoreNamespace": "rook-ceph"
        }
    elif storageclass_type == "rbd":
        storageclass_json_schema['parameters'] = {
            "clusterID": "rook-ceph",
            "pool": "replicapool",
            "imageFormat": "2",
            "imageFeatures": "layering",
            "csi.storage.k8s.io/provisioner-secret-name": "rook-csi-rbd-provisioner",
            "csi.storage.k8s.io/provisioner-secret-namespace": "rook-ceph",
            "csi.storage.k8s.io/controller-expand-secret-name": "rook-csi-rbd-provisioner",
            "csi.storage.k8s.io/controller-expand-secret-namespace": "rook-ceph",
            "csi.storage.k8s.io/node-stage-secret-name": "rook-csi-rbd-node",
            "csi.storage.k8s.io/node-stage-secret-namespace": "rook-ceph",
            "csi.storage.k8s.io/fstype": "ext4"
        }
        storageclass_json_schema['allowVolumeExpansion'] = True
    else:
        raise TypeError("Invaild StorageClass Type")

    return storageclass_json_schema


def ms_template_schema(template_data):
    """
    Template Schema

    Args:
        template_data (_type_): _description_

    Returns:
        _type_: _description_
    """
    name = template_data['name']
    image = template_data['pod_image']

    template_json_schema = {
        "apiVersion": "v1",
        "kind": "Pod",
        "metadata": {
            "name": name,
            'labels': {
                'app': name,
            }
        },
        'spec': {
            "containers": [{
                "name": name,
                "image": image,
            }],
        }
    }
    
    if template_data['service_type']:
        service_ports = json.loads(template_data['service_ports'])
        port_datas = []
        for idx, service_port in enumerate(service_ports):
            port_data = {
                "name": "port" + str(idx),
                "containerPort": int(service_port['containerPort']),
                "protocol": service_port['protocol']
            }
            port_datas.append(port_data)
            
        template_json_schema['spec']['containers'][0]['ports'] = port_datas
        # template_json_schema['spec']['replicas'] = int(template_data['replicas']) if template_data['replicas'] else 1
        # template_json_schema['kind'] = "Deployment"
        # template_json_schema['apiVersion'] = "apps/v1"
        
    if template_data['pod_command']:
        commands = template_data['pod_command'].split(' ')
        template_json_schema['spec']['containers'][0]['command'] = commands
    
    if template_data['pod_args']:
        args = template_data['pod_args'].split(' ')
        template_json_schema['spec']['containers'][0]['args'] = args

    # resource 
    resource_data = {
        'limits': {
            'memory': 0,
            'cpu': 0
        },
        'requests':{
            'memory': 0,
            'cpu': 0
        }
    }

    if template_data['cpu_limit']:
        resource_data['limits']['cpu'] = template_data['cpu_limit']
    if template_data['mem_limit']:
        resource_data['limits']['memory'] = template_data['mem_limit']
    if template_data['cpu_request']:
        resource_data['requests']['cpu'] = template_data['cpu_request']
    if template_data['mem_request']:
        resource_data['requests']['memory'] = template_data['mem_request']
        
    if 'cni_list' in template_data:
        cni_list = None
        if type(template_data['cni_list']) != list:
            cni_list = json.loads(template_data['cni_list'])
        else:
            cni_list = template_data['cni_list']
            
        cni_list_data = ''
        for idx, cni in enumerate(cni_list):
            if cni['type'] == "SR-IOV":
                # TODO : resource SR-IOV ConfigMap Name 입력
                pass
            if idx > 0:
                cni_list_data = cni_list_data + ',' + cni['name']
            else:
                cni_list_data = cni['name']
                
        
        template_json_schema['metadata']['annotations'] = {
            "k8s.v1.cni.cncf.io/networks": cni_list_data
        }

    template_json_schema['spec']['containers'][0]['resources'] = resource_data

    # PVC
    if template_data['pvc_name']:
        template_json_schema['spec']['volumes'] = []
        pvc_data = {
            "name": template_data['pvc_name'],
            "persistentVolumeClaim": {
                "claimName": template_data['pvc_name'],
                "readOnly": False
            }
        }
        template_json_schema['spec']['volumes'].append(pvc_data)
        
        template_json_schema['spec']['containers'][0]['volumeMounts'] = []
        template_json_schema['spec']['containers'][0]['volumeMounts'].append({
            "name": template_data['pvc_name'],
            "mountPath": template_data['pod_mountpath']
        })
        
    return template_json_schema

def service_schema(service_data):
    """
    Service Schema

    Args:
        service_data (_type_): _description_

    Returns:
        _type_: _description_
    """
    service_name = service_data['name']
    service_type = service_data['service_type']
    service_ports = None
    if type(service_data['service_ports']) != list:
        service_ports = json.loads(service_data['service_ports'])
    else:
        service_ports = service_data['service_ports']


    service_json_schema = {
        'kind': 'Service',
        'apiVersion': 'v1',
        'metadata': {
            'name': service_name,
            'labels': {
                'app': service_name,
            }
        },
        'spec':{
            'ports': [],
            'selector': {
                'app': service_name
            },
            'type': service_type
        }
    }

    if len(service_ports) > 0:
        for idx, service_port in enumerate(service_ports):
            port_data = {}
            port_data['name'] = "port" + str(idx)
            port_data["port"] = int(service_port['externalPort'])
            port_data["protocol"] = service_port['protocol']
            port_data["targetPort"] = int(service_port['containerPort'])
        
            service_json_schema['spec']['ports'].append(port_data)
    
    return service_json_schema

def configmap_schema(comfigmap_data):
    """
    Kubernets ConfigMap Schema

    Args:
        comfigmap_data (_type_): _description_

    Returns:
        _type_: _description_
    """
    configmap_name = comfigmap_data['name']
    configmap_sriov_data = comfigmap_data['data']

    configmap_json_schema = {
        'apiVersion': 'v1',
        'kind': 'ConfigMap',
        'metadata': {
            'name': configmap_name,
            'namespace': "kube-system",
        },
        'data': {
            'config.json': {
                "resourceList": []
            }
        }
    }

    configmap_resource = {
        "resourceName": configmap_sriov_data['type'],
        "resourcePrefix": "mellanox.com" if configmap_sriov_data['type'] == 'mellanox' else "",
        "selectors": {
            "vendors": ["15b3"],
            "devices": ["1004","1018"],
            "drivers": ["mlx4_core","mlx5_core"]
        }
    }
    
    configmap_json_schema['data']['config.json']['resourceList'].append(configmap_resource)
    
    configmap_json_schema['data']['config.json'] = json.dumps(
        configmap_json_schema['data']['config.json'], indent='\t')
    
    return configmap_json_schema