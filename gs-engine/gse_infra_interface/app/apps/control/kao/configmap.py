"""[summary]
Kubernetes Access Object(node)
Define Kubernetes ConfigMap Object
"""
from apps.control.kao.kao_base import *

class ConfigMap(KaoBase):
    """[summary]
    A class in which entries for node are defined
    
    Args:
        KaoBase ([class]): [KaoBase Class]
    """
    def __init__(self, router=None, **kwargs):
        super(ConfigMap, self).__init__(router, **kwargs)
        self.configmap_name = kwargs.get('configmap_name', None)
        self.configmap_namespace = kwargs.get('configmap_namespace', None)
        self.configmap_data = kwargs.get('configmap_data', None)
