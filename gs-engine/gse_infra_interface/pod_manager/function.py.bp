from apps.common.utils import make_json_data
from apps.common import static_value
from apps.kube_init_manager.function import get_kube_network

import json, os

def make_pod_info(pod):
    resources = pod.spec.containers[0].resources
    pod_info = {
        'node':{
            'node_nm':pod.spec.node_name
        },
        'image':{
            'image_nm':pod.spec.containers[0].image
        },
        'pod':{
            'pod_nm':pod.metadata.name,
            'cpu':{
                'limits':resources.limits.get('cpu','0') if resources.limits else 0,
                'requests':resources.requests.get('cpu','0') if resources.requests else 0,
            },
            'mem':{
                'limits':resources.limits.get('memory','0Gi') if resources.limits else 0,
                'requests':resources.requests.get('memory','0Gi') if resources.requests else 0,
            },
            'gpu':{
                'limits':resources.limits.get('nvidia.com/gpu','0') if resources.limits else 0,
                'requests':resources.requests.get('nvidia.com/gpu','0') if resources.requests else 0
            }
        },
        'network': []
    }
    if pod.metadata.annotations.get('k8s.v1.cni.cncf.io/network-status', None):
        network_list = json.loads(pod.metadata.annotations['k8s.v1.cni.cncf.io/network-status'])
        for network in network_list:
            plugin_nm = ''
            if not network['name']:
                plugin_nm = get_kube_network()
            else:
                plugin_nm = network['name'].split('/')[1].split('-')[0]
            pod_info['network'].append({
                'plugin_nm':plugin_nm,
                'nic_nm':network['name'].split('/')[1] if network['name'] else '',
                'ip':network['ips'][0]
            })
    return pod_info

def get_micro_img_json(img_nm):
    base_path = os.path.dirname(os.path.abspath(__file__))
    with open(base_path+'/micro_json/'+img_nm+'.json','r', encoding='utf-8') as f:
        micro_img_json = json.load(f)
    return micro_img_json
    
def make_pod_json(form_data):
    
    micro_img_list = ['iperf-cli-mul','iperf-cli-sriov','iperf-cli','iperf-mul','iperf-sriov','iperf','micro-gpu','micro']
    
    if form_data['img_nm'] in micro_img_list:
        img_nm = form_data['img_nm']
        micro_img_json = get_micro_img_json(img_nm)

        if img_nm in ['micro-gpu','micro']:
            micro_img_json = make_json_data({},form_data,micro_img_json)
        
        return micro_img_json
    
    pod_json_format = {
        'apiVersion': 'v1',
        'kind': 'Pod',
        'metadata': {
            'name': 'pod_nm',
            'annotations': {
            'k8s.v1.cni.cncf.io/networks': ''
            },
            'labels':{
                'name':'pod_nm'
            }
        },
        'spec': {
            'nodeName':'node_nm',
            'containers': [
                {
                    'name': 'pod_nm',
                    'image': 'img_nm',
                    'resources': {
                        'limits': {
                            'cpu': 'cpu_lmt',
                            'memory': 'mem_lmt',
                            'nvidia.com/gpu':'gpu_lmt',
                        },
                        'requests': {
                            'cpu': 'cpu_req',
                            'memory': 'mem_req',
                            'nvidia.com/gpu':'gpu_lmt',
                        }
                    },
                    'volumeMounts':[{
                        'name':'pod_nm',
                        'mountPath':'pvc_mnt_loc'
                    }]
                }
            ],
            'volumes':[
                {
                    'name':'pod_nm',
                    'persistentVolumeClaim':{
                        'claimName':'rbd-pvc',
                        'readOnly':False
                    }
                }
            ]
        }
    }

    pod_json = make_json_data({},form_data,pod_json_format)

    if not form_data.get('img_nm', None):
        pod_json['spec']['containers'][0]['image'] = static_value.DEFAULT_IMAGE
    if form_data['sriov_cnt'] != '0':
        pod_json['spec']['containers'][0]['resources']['limits']['intel.com/intel_sriov_netdevice'] = form_data['sriov_cnt']
        pod_json['spec']['containers'][0]['resources']['requests']['intel.com/intel_sriov_netdevice'] = form_data['sriov_cnt']
    
    if not form_data.get('pvc_mnt_loc', None):
        pod_json['spec']['containers'][0].pop('volumeMounts')
        pod_json['spec'].pop('volumes')
    insert_nic_to_json(form_data,pod_json)
    return pod_json

def insert_nic_to_json(form_data,pod_json):
    nic_info_list = form_data['nic_list']
    if not nic_info_list:
        pod_json['metadata'].pop('annotations')
    else:
        nic_list = []
        for nic_info in nic_info_list:
            if nic_info.get('ip', None):
                nic_info = {
                    "name":nic_info['name'],
                    "ips":[nic_info['ip']]
                }
                nic_list.append(nic_info)
            else:
                nic_info = {
                    "name":nic_info['name']
                }
                nic_list.append(nic_info)
        nic_json = json.dumps(nic_list)
        pod_json['metadata']['annotations']['k8s.v1.cni.cncf.io/networks'] = nic_json
