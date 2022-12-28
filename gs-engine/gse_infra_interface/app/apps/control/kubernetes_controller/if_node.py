"""[summary]
Kubernetes Node Interface Module
"""
from kubernetes.client.rest import ApiException
from apps.control.if_kubernetes import KubernetesInterface
from apps.common.utils import *

def response_node(node):
    """[summary]
    Define JSON for Kubernetes Node Information
    
    Args:
        node ([dict]): [Full Kubernetes Node Information of Dict Type]

    Returns:
        [json]: [Json Type for Kubernetes Node Information]
    """
    # Get Node Name
    name = node.metadata.name
    
    # Get Node Role
    node_role = None
    node_role_data = node.metadata.labels.get('node-role.kubernetes.io/master',False)
    if node_role_data == '':
        node_role = "MASTER"
    else:
        agent_node_role = node.metadata.labels.get('kubernetes.io/role', None)
        if agent_node_role == 'agent':
            node_role = "AGENT"
        else:
            node_role = "WORKER"
    
    # Get Node Status
    node_status = False
    node_conditions = node.status.conditions
    for node_condition in node_conditions:
        if node_condition.reason == "KubeletReady":
            node_status = node_condition.status
            
    # Get Address
    address = node.status.addresses[0].address
    
    # Get Resource
    alctb_cpu = alctb_mem = alctb_gpu = 0
    gpy_yn = False

    if node_role != "AGENT":
        if node.status.allocatable['cpu'][-1:] == 'm':
            alctb_cpu = int(node.status.allocatable['cpu'][:-1])*1000
        else:
            alctb_cpu = int(node.status.allocatable['cpu'])

        if node.status.allocatable['memory'][-2:] == "Ki":
            alctb_mem = int(node.status.allocatable['memory'][:-2]) / (1024*1024)
        elif node.status.allocatable['memory'][-2:] == "Mi":
            alctb_mem = int(node.status.allocatable['memory'][:-2]) / (1024)
        else:
            alctb_mem = int(node.status.allocatable['memory'])

        alctb_gpu = node.status.allocatable.get('nvidia.com/gpu', 0)
        
        alctb_sriov = node.status.allocatable.get('intel.com/intel_sriov_netdevice', 0)
        if alctb_gpu > 0:
            gpy_yn = True
    
    response = {
        'node_name': name,
        'node_role': node_role,
        'node_status': node_status,
        'address': address,
        'gpu_yn': gpy_yn,
        'resource': {
            'cpu': alctb_cpu,
            'mem': alctb_mem,
            'gpu': alctb_gpu,
            'sriov': alctb_sriov
        }
        
    }
    return response

@add_method(KubernetesInterface)
def node_list(self, **ft):
    """[summary]
    Response Kubernetes Node List of Json Type

    Returns:
        [json]: [Kubernetes Node List Information of Json Type]
    """
    response = []
    with self.client as client:
        try:
            node_list = client.CoreV1Api().list_node(_request_timeout=5).items
            for node in node_list:
                response.append(response_node(node))
        except ApiException as e:
            return { 'result': False, 'exc': e }
    return { 'result': True, 'response': response }

@add_method(KubernetesInterface)
def node_get(self, link, **ft):
    """[summary]
    Response Kubernetes Node Detail of Json Type
    Args:
        link ([dict]): [Information for Kubernetes Node Lookup.]

    Returns:
        [json]: [Kubernetes Node Detail Information of Json Type]
    """
    response = None
    with self.client as client:
        try:
            node = client.CoreV1Api().read_node(link)
            response = response_node(node)
        except ApiException as e:
            return { 'result': False, 'exc': e }
    return { 'result': True, 'response': response }
