
from apps.common.utils import make_json_data
from apps.common import static_value
import time, paramiko, json

from apps.kube_init_manager.function import get_master_server_info
def make_nic_json(form_data):
    plugin = form_data['plugin_nm']
    timestamp = str(int(time.time()))
    nic_json_format = {
        'multus':{
            'apiVersion': 'k8s.cni.cncf.io/v1', 
            'kind': 'NetworkAttachmentDefinition', 
            'metadata': {
                'name': 'multus-nic-'+timestamp
            }, 
            'spec': {
                'config': { 
                    'cniVersion': '0.3.0', 
                    'type': 'macvlan', 
                    'master': 'eno1',
                    'mode': 'bridge', 
                    'ipam': { 
                        'type': 'nic_type', 
                        'subnet': 'nic_subnet', 
                    } 
                }
            }
        },
        'sriov':{
            'apiVersion': 'k8s.cni.cncf.io/v1', 
            'kind': 'NetworkAttachmentDefinition', 
            'metadata': {
                'name': 'sriov-nic-'+timestamp,
                'annotations':{
                    'k8s.v1.cni.cncf.io/resourceName': 'intel.com/intel_sriov_netdevice'
                }
            }, 
            'spec': {
                'config': {
                    "type": "sriov",
                    "cniVersion": "0.3.1",
                    "name": "sriov-network",
                    "ipam": {
                        "type": "nic_type",
                        "subnet": "nic_subnet"
                    }
                }
            }
        }
    }
    nic_json_format[plugin] = make_json_data({},form_data, nic_json_format[plugin])
    if not form_data.get('nic_subnet',None):
      nic_json_format[plugin]['spec']['config']['ipam']['subnet'] = static_value.DEFAULT_SUBNET
    nic_config = nic_json_format[plugin]['spec']['config']

    if form_data['nic_type'] == 'static':
      nic_config['ipam'].pop('subnet')

    nic_json_format[plugin]['spec']['config'] = json.dumps(nic_config,indent='\t')

    return nic_json_format[plugin], nic_config

def insert_nic_to_json(nic_list,pod_json):
    if not nic_list:
        pod_json['metadata'].pop('annotations')
    else:
        nic_list_str = ''
        for nic in nic_list:
            nic_list_str += nic+','
        nic_list_str = nic_list_str[:-1]

        pod_json['metadata']['annotations']['k8s.v1.cni.cncf.io/networks'] = nic_list_str


def make_plcy_json(form_data,plcy_nm,pod_nm):
    plcy_json_format = {
      'ingress':{
        "apiVersion": "cilium.io/v2",
        "kind": "CiliumNetworkPolicy",
        "metadata": {
          "name": 'ingress-'+plcy_nm
        },
        "spec": {
          "endpointSelector": {
            "matchLabels": {
              "name": pod_nm
            }
          },
          "ingress": [{
              "toPorts": [{
                  "ports": "port_list"
                  }]
                }]
              }
            },
      'egress':{
        "apiVersion": "cilium.io/v2",
        "kind": "CiliumNetworkPolicy",
        "metadata": {
          "name": 'egress-'+plcy_nm
        },
        "spec": {
          "endpointSelector": {
            "matchLabels": {
              "name": pod_nm
            }
          },
          "egress": [{
              "toPorts": [{
                  "ports": "port_list"
                  }]
                }]
              }
            }
    }
    plcy_json_format['ingress'] = make_json_data({},form_data, plcy_json_format['ingress'])
    plcy_json_format['egress'] = make_json_data({},form_data, plcy_json_format['egress'])
    if(form_data['select_in_type']):
        ports = []
        ports.append({
          'port':form_data['in_port'],
          'protocol':form_data['in_type']
        })
        plcy_json_format['ingress']['spec']['ingress'][0]['toPorts'][0]['ports'] = ports
    
    if(form_data['select_out_type']):
        ports = []
        ports.append({
          'port':form_data['out_port'],
          'protocol':form_data['out_type']
        })
        plcy_json_format['egress']['spec']['egress'][0]['toPorts'][0]['ports'] = ports
    return plcy_json_format

def reset_sriov():
    cli = paramiko.SSHClient()
    cli.set_missing_host_key_policy(paramiko.AutoAddPolicy)

    server_info = get_master_server_info()

    cli.connect(server_info['SERVER'],port=22,username=server_info['USER'],password=server_info['PWD'])
    stdin, stdout, stderr = cli.exec_command("bash " + server_info['SR_IOV_INIT_FILE'])
    while True:
      lines = stdout.readline()
      if not lines:
          break
    cli.close()

def reset_multus():
    cli = paramiko.SSHClient()
    cli.set_missing_host_key_policy(paramiko.AutoAddPolicy)

    server_info = get_master_server_info()

    cli.connect(server_info['SERVER'],port=22,username=server_info['USER'],password=server_info['PWD'])
    stdin, stdout, stderr = cli.exec_command("bash " + server_info['MULTUS_INIT_FILE'])
    while True:
      lines = stdout.readline()
      if not lines:
          break
    cli.close()
