"""[summary]
Kubernetes Service Interface Module
"""
from kubernetes.client.rest import ApiException
from apps.control.if_kubernetes import KubernetesInterface
from apps.common.utils import *

def response_service(service):
    """[summary]
    Define JSON for Kubernetes Service Information
    
    Args:
        service ([dict]): [Full Kubernetes Service Information of Dict Type]

    Returns:
        [json]: [Json Type for Kubernetes Service Information]
    """
    # Get Service Name
    service_name = service.metadata.name
    
    # Get Service Type  
    service_type = service.spec.type
    
    # Get Service IPs
    cluster_ip = service.spec.cluster_ip
    external_ip = None
    if service_type == 'LoadBalancer':
        external_ip = service.status.load_balancer.ingress[0].ip
        if not external_ip:
            external_ip = "0.0.0.0"
    
    # Get Service Namespace
    service_namespace = service.metadata.namespace
    
    response = {
       'service_name': service_name,
        'cluster_ip': cluster_ip,
        'external_ip': external_ip,
        'service_namespace': service_namespace,
        'service_type': service_type
    }
   
    return response

@add_method(KubernetesInterface)
def service_list(self, **ft):
    """[summary]
    Response Kubernetes Service List of Json Type

    Returns:
        [json]: [Kubernetes Service List Information of Json Type]
    """
    response = []
    with self.client as client:
        try:
            service_list = client.CoreV1Api().list_service_for_all_namespaces().items
            for service in service_list:
                response.append(response_service(service))
        except ApiException as e:
            return { 'result': False, 'exc': e }
    return { 'result': True, 'response': response }

@add_method(KubernetesInterface)
def service_get(self, link, **ft):
    """[summary]
    Response Kubernetes Service Detail of Json Type
    Args:
        link ([dict]): [Information for Kubernetes Service Lookup.]

    Returns:
        [json]: [Kubernetes Service Detail Information of Json Type]
    """
    response = None
    with self.client as client:
        try:
            service = client.CoreV1Api().read_service(link)
            response = response_service(service)
        except ApiException as e:
            return { 'result': False, 'exc': e }
    return { 'result': True, 'response': response }
