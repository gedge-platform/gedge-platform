"""[summary]
Database Access Obejct(Account)
Define MongoDB Account Object
"""
from apps.common.statics import *
from apps.common.database import *

from apps.control.dao.dao_base import DaoBase
from apps.control.dao.cluster import *

class Account(DaoBase):
    """[summary]
    A class in which entries for Account Collection Database are Defined
    
    Args:
        DaoBase ([class]): [DaoBase Class]
    """
    collection = ACCOUNT_COLLECTION

    def __init__(self, **kwargs):
        super(Account, self).__init__(**kwargs)
        self.user_name = kwargs.get('user_name')
        self.user_passwd = kwargs.get('user_passwd')
        self.yaml = kwargs.get('yaml')
        self.cluster_group = [ Cluster(**cluster_data) for cluster_data in kwargs.get('cluster_group', []) ]
