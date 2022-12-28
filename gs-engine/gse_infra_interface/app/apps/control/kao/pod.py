"""[summary]
Kubernetes Access Object(pod)
Define Kubernetes Pod Object
"""
from apps.control.kao.kao_base import *

class Resource(KaoBase):
    """[summary]
    A class in which entries for pod limitrange are defined
    
    Args:
        KaoBase ([class]): [KaoBase Class]
    """
    def __init__(self, constructor, **kwargs):
        self.limits = kwargs.get('limits', None)
        self.requests = kwargs.get('requests', None)

class PodResources(KaoBase):
    """[summary]
    A class in which entries for pod resources are defined
    
    Args:
        KaoBase ([class]): [KaoBase Class]
    """
    def __init__(self, constructor, **kwargs):
        self.cpu = Resource(self, **kwargs.get('cpu', {}))
        self.mem = Resource(self, **kwargs.get('mem', {}))
        self.gpu = Resource(self, **kwargs.get('gpu', {}))

class Pod(KaoBase):
    """[summary]
    A class in which entries for pod are defined
    
    Args:
        KaoBase ([class]): [KaoBase Class]
    """
    def __init__(self, router=None, **kwargs):
        super(Pod, self).__init__(router, **kwargs)
        self.pod_name = kwargs.get('pod_name', None)
        self.pod_namespace = kwargs.get('pod_namespace', None)
        self.pod_status = kwargs.get('pod_status', None)
        self.pod_type = kwargs.get('pod_type', None)
        self.pod_node = kwargs.get('pod_node', None)
        self.pod_ip = kwargs.get('pod_ip', None)
        self.pod_resource = PodResources(self, **kwargs.get('pod_resource', {}))
        self.pod_log = kwargs.get('pod_log', None)
