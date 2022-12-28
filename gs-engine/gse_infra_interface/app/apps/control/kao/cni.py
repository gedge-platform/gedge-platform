"""[summary]
Kubernetes Access Object(cni)
Define Kubernetes CNI Object
"""
from apps.control.kao.kao_base import *

class Cni(KaoBase):
    """[summary]
    A class in which entries for cni are defined
    
    Args:
        KaoBase ([class]): [KaoBase Class]
    """
    def __init__(self, router=None, **kwargs):
        super(Cni, self).__init__(router, **kwargs)
        self.cni_name = kwargs.get('cni_name', None)
        self.cni_ns = kwargs.get('cni_ns', None)
        self.cni_config = kwargs.get('cni_config', None)