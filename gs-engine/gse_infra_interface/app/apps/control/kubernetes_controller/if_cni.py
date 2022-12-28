"""[summary]
Kubernetes CNI Interface Module
"""
import json
from kubernetes.client.rest import ApiException

from apps.control.if_kubernetes import KubernetesInterface
from apps.common.utils import *
from apps.common.statics import *

def response_cni(cni):
    """[summary]
    Define JSON for Kubernetes CNI Information
    
    Args:
        cni ([dict]): [Full Kubernetes cni Information of Dict Type]

    Returns:
        [json]: [Json Type for Kubernetes cni Information]
    """
    name = cni['metadata']['name']
    
    namespace = cni['metadata']['namespace']

    config = json.loads(cni['spec']['config'].replace('\'','"'))

    response = {
        'cni_name': name,
        'cni_ns': namespace,
        'cni_config': config
    }
    return response

@add_method(KubernetesInterface)
def cni_list(self, **ft):
    """[summary]
    Response Kubernetes CNI List of Json Type

    Returns:
        [json]: [Kubernetes CNI List Information of Json Type]
    """
    response = []
    try:
        cni_list = self.KubeAPICall(
            method = 'GET',
            api_type=KUBE_API_NETWORK,
        )
        for cni in cni_list['items']:
            response.append(response_cni(cni))
    except ApiException as e:
        return { 'result': False, 'exc': e }
    return { 'result': True, 'response': response }

@add_method(KubernetesInterface)
def cni_get(self, link, **ft):
    """[summary]
    Response Kubernetes CNI Get of Json Type

    Returns:
        [json]: [Kubernetes CNI Get Information of Json Type]
    """
    response = None
    try:
        cni = self.KubeAPICall(
            method='GET',
            api_type=KUBE_API_NETWORK,
            namespace=ft['namespace'],
            name=ft['name']
        )
        response = response_cni(cni)
    except ApiException as e:
        return { 'result': False, 'exc': e }
    return { 'result': True, 'response': response }

@add_method(KubernetesInterface)
def cni_delete(self, link, **ft):
    """[summary]
    Response Kubernetes CNI Delete of Json Type

    Returns:
        [json]: [Kubernetes CNI Delete Information of Json Type]
    """
    try:
        cni = self.KubeAPICall(
            method='DELETE',
            api_type=KUBE_API_NETWORK,
            namespace=ft['namespace'],
            name=ft['name']
        )
    except ApiException as e:
        return { 'result': False, 'exc': e }
    return { 'result': True }

@add_method(KubernetesInterface)
def cni_create(self, link, **ft):
    """[summary]
    Response Kubernetes CNI Create of Json Type

    Returns:
        [json]: [Kubernetes CNI Create Information of Json Type]
    """
    try:
        cni = self.KubeAPICall(
            method='POST',
            api_type=KUBE_API_NETWORK,
            namespace=ft['namespace'],
            body=ft['body']
        )
        response = response_cni(cni)
    except ApiException as e:
        return { 'result': False, 'exc': e }
    return { 'result': True, 'response': response }
