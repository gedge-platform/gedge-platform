"""[summary]
Kubernetes ConfigMap Interface Module
"""
from kubernetes.client.rest import ApiException
from apps.control.if_kubernetes import KubernetesInterface
from apps.common.utils import *

def response_configmap(configmap):
    """[summary]
    Define JSON for Kubernetes ConfigMap Information
    
    Args:
        configmap ([dict]): [Full Kubernetes ConfigMap Information of Dict Type]

    Returns:
        [json]: [Json Type for Kubernetes ConfigMap Information]
    """

    configmap_name = configmap.metadata.name
    configmap_namespace = configmap.metadata.namespace

    configmap_data = configmap.data
    
    response = {
        'configmap_name': configmap_name,
        'configmap_namespace': configmap_namespace,
        'configmap_data': configmap_data
    }
   
    return response

@add_method(KubernetesInterface)
def configmap_list(self, **ft):
    """[summary]
    Response Kubernetes ConfigMap List of Json Type

    Returns:
        [json]: [Kubernetes ConfigMap List Information of Json Type]
    """
    response = []
    with self.client as client:
        try:
            configmap_list = client.CoreV1Api().list_config_map_for_all_namespaces().items
            for configmap in configmap_list:
                response.append(response_configmap(configmap))
        except ApiException as e:
            return { 'result': False, 'exc': e }
    return { 'result': True, 'response': response }

@add_method(KubernetesInterface)
def configmap_get(self, link, **ft):
    """[summary]
    Response Kubernetes ConfigMap Detail of Json Type
    Args:
        link ([dict]): [Information for Kubernetes ConfigMap Lookup.]

    Returns:
        [json]: [Kubernetes ConfigMap Detail Information of Json Type]
    """
    response = None
    with self.client as client:
        try:
            configmap = client.CoreV1Api().read_namespaced_config_map(namespace=ft['namespace'], name=ft['name'])
            response = response_configmap(configmap)
        except ApiException as e:
            return { 'result': False, 'exc': e }
    return { 'result': True, 'response': response }

@add_method(KubernetesInterface)
def configmap_create(self, link, **ft):
    """[summary]
    Response Kubernetes ConfigMap Detail of Json Type
    Args:
        link ([dict]): [Information for Kubernetes ConfigMap Lookup.]

    Returns:
        [json]: [Kubernetes ConfigMap Detail Information of Json Type]
    """
    response = None
    with self.client as client:
        try:
            body_data = ft['body']
            configmap = client.CoreV1Api().create_namespaced_config_map(namespace=ft['namespace'],body=body_data)
            response = response_configmap(configmap)
        except ApiException as e:
            return { 'result': False, 'exc': e }
    return { 'result': True, 'response': response }

@add_method(KubernetesInterface)
def configmap_delete(self, link, **ft):
    """[summary]
    Response Kubernetes ConfigMap Detail of Json Type
    Args:
        link ([dict]): [Information for Kubernetes ConfigMap Lookup.]

    Returns:
        [json]: [Kubernetes ConfigMap Detail Information of Json Type]
    """
    with self.client as client:
        try:
            configmap = client.CoreV1Api().delete_namespaced_config_map(namespace=ft['namespace'],name=ft['name'])
        except ApiException as e:
            return { 'result': False, 'exc': e }
    return { 'result': True }
