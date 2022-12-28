"""[summary]
Kubernetes Access Object(PVC)
Define Kubernetes PVC Object
"""
from apps.control.kao.kao_base import *

class Pvc(KaoBase):
    """[summary]
    A class in which entries for pvc are defined
    
    Args:
        KaoBase ([class]): [KaoBase Class]
    """
    def __init__(self, router=None, **kwargs):
        super(Pvc, self).__init__(router, **kwargs)
        self.pvc_name = kwargs.get('pvc_name', None)
        self.pvc_namespace = kwargs.get('pvc_namespace', None)
        self.pvc_size = kwargs.get('pvc_size', None)
        self.pvc_status = kwargs.get('pvc_status', None)
        self.pvc_mode = kwargs.get('pvc_mode', None)
        self.strgclass_name = kwargs.get('strgclass_name', None)