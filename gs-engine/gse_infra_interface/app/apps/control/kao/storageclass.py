"""[summary]
Kubernetes Access Object(StorageClass)
Define Kubernetes StorageClass Object
"""
from apps.control.kao.kao_base import *

class Storageclass(KaoBase):
    """[summary]
    A class in which entries for pvc are defined
    
    Args:
        KaoBase ([class]): [KaoBase Class]
    """
    def __init__(self, router=None, **kwargs):
        super(Storageclass, self).__init__(router, **kwargs)
        self.strgclass_name = kwargs.get('strgclass_name', None)