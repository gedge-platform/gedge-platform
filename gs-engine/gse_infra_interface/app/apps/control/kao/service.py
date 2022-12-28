"""[summary]
Kubernetes Access Object(service)
Define Kubernetes Service Object
"""
from apps.control.kao.kao_base import *

class Service(KaoBase):
    """[summary]
    A class in which entries for service are defined
    
    Args:
        KaoBase ([class]): [KaoBase Class]
    """
    def __init__(self, router=None, **kwargs):
        super(Service, self).__init__(router, **kwargs)
        self.service_name = kwargs.get('service_name', None)
        self.cluster_ip = kwargs.get('cluster_ip', None)
        self.external_ip = kwargs.get('external_ip', None)
        self.service_namespace = kwargs.get('service_namespace', None)
        self.service_type = kwargs.get('service_type', None)
        self.service_ports = kwargs.get('service_ports', None)

