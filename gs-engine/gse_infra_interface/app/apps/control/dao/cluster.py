"""[summary]
Database Access Obejct(Account)
Define MongoDB Account Object
"""
from apps.common.statics import *
from apps.common.database import *

from apps.control.dao.dao_base import DaoBase

class ClusterData(DaoBase):
    """[summary]
    A class in which entries for ClusterData are Defined
    
    Args:
        DaoBase ([class]): [DaoBase Class]
    """
    def __init__(self, constructor, **kwargs):
        self.cluster_role = kwargs.get('master_yn')
        self.cluster_type = kwargs.get('clu_type')
        self.cluster_id = kwargs.get('clu_id')
        self.cluster_pwd = kwargs.get('clu_pwd')
        self.master_node_address = kwargs.get('clu_ip')
        self.master_node_key = kwargs.get('api_key')
        self.node_ips = kwargs.get('node_ips')
        self.status = kwargs.get('status')
        
class Cluster(DaoBase):
    """[summary]
    A class in which entries for Cluster Collection Database are Defined
    
    Args:
        DaoBase ([class]): [DaoBase Class]
    """
    collection = CLUSTER_COLLECTION
    def __init__(self, **kwargs):
        super(Cluster, self).__init__(**kwargs)
        self.cluster_name = kwargs.get('_id')
        self.cluster_data = ClusterData(self, **kwargs.get('clu_data', {}))