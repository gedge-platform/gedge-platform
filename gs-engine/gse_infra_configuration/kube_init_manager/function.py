import paramiko, json, os
from kubernetes import client, config
from apps.common import static_value

from apps.common.utils import init_kubernetes
from apps.network_manager.api import NicApi

def get_master_server_info():
    base_path = os.path.dirname(os.path.abspath(__file__))

    with open(base_path+'/master_server_info.json','r', encoding='utf-8') as f:
        master_server_info = json.load(f)
    return master_server_info
def init_kube(network_type,tplg_plcy):
    tplg_plcy_opt = ''
    if tplg_plcy == 'none':
        tplg_plcy_opt = ''
    else:
        tplg_plcy_opt = tplg_plcy

    set_reset_status('RUN')

    server_info = get_master_server_info()

    cli = paramiko.SSHClient()
    cli.set_missing_host_key_policy(paramiko.AutoAddPolicy)

    cli.connect(server_info['SERVER'],port=22,username=server_info['USER'],password=server_info['PWD'])
    set_reset_status('PROC')
    stdin, stdout, stderr = cli.exec_command("bash " + server_info['K8S_INIT_FILE'] + " " + network_type + " " + tplg_plcy_opt)

    while True:
        lines = stdout.readline()
        if not lines:
            break

    stdin, stdout, stderr = cli.exec_command("bash " + server_info['K8S_TOKEN_FILE'])

    while True:
        lines = stdout.readline()
        if not lines:
            break

    stdin, stdout, stderr = cli.exec_command("bash " + server_info['K8S_API_KEY_FILE'])
    while True:
        lines = stdout.readline()

        if not lines:
            break

    for node_ip in server_info['WORKER_NODE_IP']:
        stdin, stdout, stderr = cli.exec_command("sshpass -p \"" + server_info['PWD'] + "\" ssh gedge@" + node_ip + " 'bash -s' < " + server_info['K8S_WORKER_INIT_FILE'])
        while True:
            lines = stdout.readline()
            if not lines:
                break

    cli.close()
    set_reset_status('END')
    
def renew_acc_key():
    cli = paramiko.SSHClient()
    cli.set_missing_host_key_policy(paramiko.AutoAddPolicy)

    server_info = get_master_server_info()
    cli.connect(server_info['SERVER'],port=22,username=server_info['USER'],password=server_info['PWD'])

    stdin, stdout, stderr = cli.exec_command("bash " + server_info['K8S_API_KEY_FILE'])
    api_key = stdout.readline()[:-1]
    cli.close()
        
    with open(static_value.KUBE_CONFIG_PATH+'/kubernetes_config.json','r', encoding='utf-8') as f:
        kubeconfig = json.load(f)
    with open(static_value.KUBE_CONFIG_PATH+'/kubernetes_config.json','w', encoding='utf-8') as f:
        kubeconfig['acc_key'] = api_key
        json.dump(kubeconfig,f,indent='\t')
    init_kubernetes()

def set_kube_network(network):
    with open(static_value.KUBE_CONFIG_PATH+'/kubernetes_config.json','r', encoding='utf-8') as f:
        kubeconfig = json.load(f)
    with open(static_value.KUBE_CONFIG_PATH+'/kubernetes_config.json','w', encoding='utf-8') as f:
        kubeconfig['network'] = network

        json.dump(kubeconfig,f,indent='\t')

def get_kube_network():
    with open(static_value.KUBE_CONFIG_PATH+'/kubernetes_config.json','r', encoding='utf-8') as f:
        kubeconfig = json.load(f)
    return kubeconfig['network']

def set_topology_policy(tplg_plcy):
    with open(static_value.KUBE_CONFIG_PATH+'/kubernetes_config.json','r', encoding='utf-8') as f:
        kubeconfig = json.load(f)

    with open(static_value.KUBE_CONFIG_PATH+'/kubernetes_config.json','w', encoding='utf-8') as f:
        if tplg_plcy == 'none':
            tplg_plcy = 'None'
        elif tplg_plcy == 'single':
            tplg_plcy = 'Single-Numa-Node'
        elif tplg_plcy == 'best':
            tplg_plcy = 'Best-Effort'
        elif tplg_plcy == 'restricted':
            tplg_plcy = 'Restricted'            
        
        kubeconfig['topology_policy'] = tplg_plcy
        json.dump(kubeconfig,f,indent='\t')

def get_topology_policy():
    with open(static_value.KUBE_CONFIG_PATH+'/kubernetes_config.json','r', encoding='utf-8') as f:
        kubeconfig = json.load(f)
    return kubeconfig['topology_policy']

def set_reset_status(status):
    with open(static_value.KUBE_CONFIG_PATH+'/kubernetes_config.json','r', encoding='utf-8') as f:
        kubeconfig = json.load(f)

    with open(static_value.KUBE_CONFIG_PATH+'/kubernetes_config.json','w', encoding='utf-8') as f:
        kubeconfig['reset_status'] = status
        json.dump(kubeconfig,f,indent='\t')

def get_reset_status():
    with open(static_value.KUBE_CONFIG_PATH+'/kubernetes_config.json','r', encoding='utf-8') as f:
        kubeconfig = json.load(f)
    return kubeconfig['reset_status']

def create_default_multus():
    base_path = os.path.dirname(os.path.abspath(__file__))
    with open(base_path+'/init_json/nic-config.json','r', encoding='utf-8') as f:
        nic_json = json.load(f)

        nic_api = NicApi()

        response = nic_api.create_namespaced_nic(namespace=static_value.NAMESPACE,body=nic_json['multus'])
    
def create_default_sriov():
    base_path = os.path.dirname(os.path.abspath(__file__))
    with open(base_path+'/init_json/nic-config.json','r', encoding='utf-8') as f:
        nic_json = json.load(f)

        nic_api = NicApi()

        response = nic_api.create_namespaced_nic(namespace=static_value.NAMESPACE,body=nic_json['sriov'])
