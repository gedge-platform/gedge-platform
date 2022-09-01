"""[summary]
A module that defines the code for the entire system.
"""
from enum import Enum

class BaseEnum(Enum):
    """[summary]
    A class that defines the BaseEnum Class for the entire system.
    Custom Enum Class for this system.
    Args:
        Enum ([class]): [Default Enum Class]
    """
    def __str__(self):
        return self.value

    @classmethod
    def get_value(cls, attr):
        """[summary]
        Get Code Value Data
        
        Args:
            attr ([string]): [key value to look up]

        Returns:
            [string]: [Retrieved value for that key]
        """
        if not attr:
            return None
        return str(getattr(cls, attr.upper()))

    @classmethod
    def get_keyname(cls, value):
        """[summary]
        Get Code Key Data
        
        Args:
            value ([string]): [value to look up]

        Returns:
            [string]: [Retrieved key for that value]
        """
        if not value:
            return None
        return cls(value).name.lower()
    
    @classmethod
    def conv_value(cls, other):
        """[summary]
        Change values function
        
        Args:
            other ([string]): [Change Value Data]

        Returns:
            [string]: [changed value]
        """
        if not other:
            return None
        return getattr(cls, other.upper())

# 계정 역할
class AccountRole(BaseEnum):
    """[summary]
    Define Account Role Code
    
    Args:
        Enum ([class]): [Default Enum Class]
    """
    ADMIN = 'ADMIN'
    USER = 'USER'

# 뷰 접근 권한
class AccessPermission(BaseEnum):
    """[summary]
    Define Account Permission Code
    
    Args:
        Enum ([class]): [Default Enum Class]
    """
    NO_AUTH = 'NONE'
    AUTH_ALL = 'ALL'
    AUTH_ADMIN = 'ADMIN'
    AUTH_USER = 'USER'

# 클러스터 타입
class ClusterType(BaseEnum):
    """[summary]
    Define Cluster Type Code
    
    Args:
        Enum ([class]): [Default Enum Class]
    """
    K8S = 'K8S'
    K3S = 'K3S'

class ClusterRole(BaseEnum):
    """[summary]
    Define Cluster Role Code
    
    Args:
        Enum ([class]): [Default Enum Class]
    """
    MASTER = 'MASTER'
    SLAVE = 'SLAVE'

# 노드 타입
class NodeRole(BaseEnum):
    """[summary]
    Define Node Type Code
    
    Args:
        Enum ([class]): [Default Enum Class]
    """
    MASTER = 'MASTER'
    WORKER = 'WORKER'
    AGENT = 'AGENT'
