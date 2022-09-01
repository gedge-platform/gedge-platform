"""[summary]
Kubernetes Access Object
"""
import sys

def get_obj_class(name):
    """[summary]

    Args:
        name ([string]): [object class Name]

    Returns:
        [string]: [Return Module Name]
    """
    return getattr(sys.modules[__name__], name)

__all__ = ['get_obj_class']
