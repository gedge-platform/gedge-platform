"""[summary]
Kubernetes Access Object(node)
Define Kubernetes Node Object
"""
from apps.control.kao.kao_base import *

class NodeResource(KaoBase):
    """[summary]
    A class in which entries for node resources are defined
    
    Args:
        KaoBase ([class]): [KaoBase Class]
    """
    def __init__(self, constructor, **kwargs):
        self.cpu = kwargs.get('cpu', 0)
        self.mem = kwargs.get('mem', 0)
        self.gpu = kwargs.get('gpu', 0)
        self.sriov = kwargs.get('sriov', 0)

class Node(KaoBase):
    """[summary]
    A class in which entries for node are defined
    
    Args:
        KaoBase ([class]): [KaoBase Class]
    """
    def __init__(self, router=None, **kwargs):
        super(Node, self).__init__(router, **kwargs)
        self.node_name = kwargs.get('node_name', None)
        self.node_role = kwargs.get('node_role', None)
        self.node_status = kwargs.get('node_status', False)
        self.address = kwargs.get('address', None)
        self.gpu_yn = kwargs.get('gpu_yn', False)
        self.resource = NodeResource(self, **kwargs.get('resource', {}))
