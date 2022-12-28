"""[summary]
Kubernetes PVC Interface Module
"""
from kubernetes.client.rest import ApiException

from apps.control.if_kubernetes import KubernetesInterface
from apps.common.utils import *
from apps.common.statics import *

def response_pvc(pvc):
    """[summary]
    Define JSON for Kubernetes PVC Information
    
    Args:
        pvc ([dict]): [Full Kubernetes PVC Information of Dict Type]

    Returns:
        [json]: [Json Type for Kubernetes PVC Information]
    """
    name = pvc.metadata.name
    
    namespace = pvc.metadata.namespace
    
    pvc_status = pvc.status.phase
    
    pvc_size = pvc.spec.resources.requests['storage']
    
    pvc_mode = pvc.spec.access_modes[0]

    storageclass_name = pvc.spec.storage_class_name
    
    response = {
        'pvc_name': name,
        'pvc_namespace': namespace,
        'pvc_size': pvc_size,
        'pvc_status': pvc_status,
        'pvc_mode': pvc_mode,
        'strgclass_name': storageclass_name
    }
    return response

@add_method(KubernetesInterface)
def pvc_list(self, **ft):
    """[summary]
    Response Kubernetes PVC List of Json Type

    Returns:
        [json]: [Kubernetes PVC List Information of Json Type]
    """
    response = []
    with self.client as client:
        try:
            pvc_list = client.CoreV1Api().list_persistent_volume_claim_for_all_namespaces().items
            for pvc in pvc_list:
                response.append(response_pvc(pvc))
        except ApiException as e:
            return { 'result': False, 'exc': e }
    return { 'result': True, 'response': response }
    
@add_method(KubernetesInterface)
def pvc_get(self, link, **ft):
    """[summary]
    Response Kubernetes PVC Get of Json Type

    Returns:
        [json]: [Kubernetes PVC Get Information of Json Type]
    """
    response = None
    with self.client as client:
        try:
            pvc = client.CoreV1Api().read_namespaced_persistent_volume_claim(
                namespace=ft['namespace'], name=ft['name'])
            response = response_pvc(pvc)
        except ApiException as e:
            return { 'result': False, 'exc': e }
    return { 'result': True, 'response': response }

@add_method(KubernetesInterface)
def pvc_delete(self, link, **ft):
    """[summary]
    Response Kubernetes PVC Delete of Json Type

    Returns:
        [json]: [Kubernetes PVC Delete Information of Json Type]
    """
    with self.client as client:
        try:    
            pvc = client.CoreV1Api().delete_namespaced_persistent_volume_claim(
                namespace=ft['namespace'], name=ft['name'])
        except ApiException as e:
            return { 'result': False, 'exc': e }
    return { 'result': True }

@add_method(KubernetesInterface)
def pvc_create(self, link, **ft):
    """[summary]
    Response Kubernetes PVC Create of Json Type

    Returns:
        [json]: [Kubernetes PVC Create Information of Json Type]
    """
    response = None
    with self.client as client:
        try:
            body_data = ft['body']
            pvc = client.CoreV1Api().create_namespaced_persistent_volume_claim(
                namespace=ft['namespace'], body=body_data)
            response = response_pvc(pvc)
        except ApiException as e:
            return { 'result': False, 'exc': e }
    return { 'result': True, 'response': response }
