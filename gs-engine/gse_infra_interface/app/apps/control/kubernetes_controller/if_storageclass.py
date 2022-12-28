"""[summary]
Kubernetes StorageClass Interface Module
"""
from kubernetes.client.rest import ApiException

from apps.control.if_kubernetes import KubernetesInterface
from apps.common.utils import *
from apps.common.statics import *

def response_storageclass(strgclass):
    """
    Define JSON for Kubernetes StorageClass Information

    Args:
        strgclass (_type_): _description_

    Returns:
        _type_: _description_
    """
    name = strgclass.metadata.name
    
    response = {
        'strgclass_name': name
    }
    return response

@add_method(KubernetesInterface)
def storageclass_list(self, **ft):
    """
    Response Kubernetes StorageClass List of Json Type

    Returns:
        _type_: _description_
    """
    response = []
    with self.client as client:
        try:
            strgclass_list = client.StorageV1Api().list_storage_class().items
            for strgclass in strgclass_list:
                response.append(response_storageclass(strgclass))
        except ApiException as e:
            return { 'result': False, 'exc': e }
    return { 'result': True, 'response': response }
    
@add_method(KubernetesInterface)
def storageclass_get(self, link, **ft):
    """
    Response Kubernetes StorageClass Get of Json Type

    Args:
        link (_type_): _description_

    Returns:
        _type_: _description_
    """
    response = None
    with self.client as client:
        try:
            strgclass = client.StorageV1Api().read_storage_class(name=ft['name'])
            response = response_storageclass(strgclass)
        except ApiException as e:
            return { 'result': False, 'exc': e }
    return { 'result': True, 'response': response }

@add_method(KubernetesInterface)
def storageclass_delete(self, link, **ft):
    """
    Response Kubernetes StorageClass Delete of Json Type

    Args:
        link (_type_): _description_

    Returns:
        _type_: _description_
    """
    with self.client as client:
        try:    
            strgclass = client.StorageV1Api().delete_storage_class(name=ft['name'])
        except ApiException as e:
            return { 'result': False, 'exc': e }
    return { 'result': True }

@add_method(KubernetesInterface)
def storageclass_create(self, link, **ft):
    """
    Response Kubernetes StorageClass Create of Json Type

    Args:
        link (_type_): _description_

    Returns:
        _type_: _description_
    """
    response = None
    with self.client as client:
        try:
            body_data = ft['body']
            strgclass = client.StorageV1Api().create_storage_class(body=body_data)
            response = response_storageclass(strgclass)
        except ApiException as e:
            return { 'result': False, 'exc': e }
    return { 'result': True, 'response': response }
