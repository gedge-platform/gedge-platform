"""[summary]
Kubernetes Node Interface Module
"""
from apps.control.if_kubernetes import KubernetesInterface
from apps.common.utils import *

from kubernetes.client.rest import ApiException
from kubernetes.utils.create_from_yaml import create_from_yaml

def response_pod(pod):
    """[summary]
    Define JSON for Kubernetes Pod Information
    
    Args:
        pod ([dict]): [Full Kubernetes Pod Information of Dict Type]

    Returns:
        [json]: [Json Type for Kubernetes Pod Information]
    """
    # Get Pod Name
    pod_name = pod.metadata.name
    
    # Get Pod Namespaces
    pod_namespace = pod.metadata.namespace
    
    # Get Pod Status
    pod_status = pod.status.phase
    
    # Get Pod Type
    pod_type = None
    try:
        pod_type = pod.metadata.owner_references[0].kind
    except ApiException as e:
        pod_type = "Pod"
        print(e)
    
    # Get Pod Running Node Name
    pod_node = pod.spec.node_name
    
    # Get Pod IP
    pod_ip = pod.status.pod_ip
    
    resources = pod.spec.containers[0].resources
    pod_resource = {
        'cpu': {
            'limits':resources.limits.get('cpu','0') if resources.limits else '-',
            'requests':resources.requests.get('cpu','0') if resources.requests else '-',
        },
        'mem':{
            'limits':resources.limits.get('memory','0Gi') if resources.limits else '-',
            'requests':resources.requests.get('memory','0Gi') if resources.requests else '-',
        },
        'gpu':{
            'limits':resources.limits.get('nvidia.com/gpu','0') if resources.limits else '-',
            'requests':resources.requests.get('nvidia.com/gpu','0') if resources.requests else '-'
        }
    }
    response = {
        'pod_name': pod_name,
        'pod_namespace': pod_namespace,
        'pod_status': pod_status,
        'pod_type': pod_type,
        'pod_node': pod_node,
        'pod_ip': pod_ip,
        'pod_resource': pod_resource
    }
    return response

@add_method(KubernetesInterface)
def pod_list(self, **ft):
    """[summary]
    Response Kubernetes Pod List of Json Type

    Returns:
        [json]: [Kubernetes Pod List Information of Json Type]
    """
    response = []
    with self.client as client:
        try:
            pod_list = client.CoreV1Api().list_pod_for_all_namespaces().items
            for pod in pod_list:
                response.append(response_pod(pod))
        except ApiException as e:
            return { 'result': False, 'exc': e }
    return { 'result': True, 'response': response }

@add_method(KubernetesInterface)
def pod_get(self, link, **ft):
    """[summary]
    Kubernetes Pod details response data in Json type
    Args:
        link ([dict]): [Information for Kubernetes Pod Lookup.]

    Returns:
        [json]: [Kubernetes Pod Detail Information of Json Type]
    """
    response = None
    with self.client as client:
        try:
            pod = client.CoreV1Api().read_namespaced_pod(namespace=ft['namespace'], name=ft['name'])
            response = response_pod(pod)
            try:
                pod_log = client.CoreV1Api().read_namespaced_pod_log(
                    namespace=ft['namespace'], name=ft['name'], container=ft['name'])
            except ApiException as e:
                pod_log = "Error"
            if pod_log:
                response['pod_log'] = pod_log
        except ApiException as e:
            return { 'result': False, 'exc': e }
    return { 'result': True, 'response': response }

@add_method(KubernetesInterface)
def pod_delete(self, link, **ft):
    """[summary]
    This Function is Delete Kubernetes Pod Function
    Args:
        link ([dict]): [About Kubernetes Pods to Delete.]

    Returns:
        [json]: [Pod deletion result status value in Json Type]
    """
    with self.client as client:
        try:
            result = client.CoreV1Api().delete_namespaced_pod(namespace=ft['namespace'], name=ft['name'])
        except ApiException as e:
            return { 'result': False, 'exc': e }
    return { 'result': True }

@add_method(KubernetesInterface)
def pod_create(self, link, **data):
    """[summary]
    This Function is Create Kubernetes Pod Function
    
    Args:
        link ([dict]): [About Kubernetes Pods to Create]

    Returns:
        [json]: [Pod creation result status value in Json Type]
    """
    response = None
    with self.client as client:
        try:
            result = None
            body_data = data['body']
            if not isinstance(body_data, list):
                result = client.CoreV1Api().create_namespaced_pod(namespace=data['namespace'],body=body_data)
                response = response_pod(result)
            else:
                result = create_from_yaml(client.ApiClient(), yaml_objects=body_data, namespace=data['namespace'])
                response = result
        except ApiException as e:
            print(e)
            return { 'result': False, 'exc': e }
    return { 'result': True, 'response': response }
