"""
Modules with Defined for ConfigMap Function
"""
from apps.common.base import *
from apps.common.utils import *
from apps.common.statics import *
from apps.common.codes import *
from apps.common.schema import *

from apps.control.dao.cluster import *

from apps.control.kao.configmap import ConfigMap
    
def get_configmaps_list():
    """
    Get Kubernetes Configmap List
    """
    result = {}
    cluster_list = Cluster.list()

    if not len(cluster_list) > 0:
        raise Exception("Not Register Clusters")
    
    for cluster in cluster_list:
        result[cluster.cluster_name] = []
        configmap_list = ConfigMap.router.using(cluster.cluster_name).all()
        result[cluster.cluster_name] = configmap_list

    return result


def get_configmap(cluster_name=None, configmap_name=None):
    """
    Get Kubernetes Configmap
    """
    result = None
    if not cluster_name:
        raise Exception("Not Input Cluster Name")
    if not configmap_name:
        raise Exception("Not Input configmap Name")

    result = ConfigMap.router.using(cluster_name).get(namespace=DEFAULT_NAMESPACE, name=configmap_name)

    return result

def delete_configmap(cluster_name=None, configmap_name=None):
    """
    Delete Kuberentes Configmap
    """
    response = None
    result = ConfigMap.router.using(cluster_name).delete(namespace='kube-system', name=configmap_name)
    if result:
        response = {
            "msg": "Deleted",
            "status_code": SUCCESS
        }
    else:
        response = {
            "msg": "No Data",
            "status_code": FAIL
        }

    return response

def create_configmap(configmap_data):
    """
    Create Kubernetes Configmap
    """
    response = None
    
    cluster_name = configmap_data['cluster_name']
    configmap_schema_data = configmap_schema(configmap_data)

    result = ConfigMap.router.using(cluster_name).create(namespace='kube-system', body=configmap_schema_data)
    
    if result:
        response = {
            "msg": "Created",
            "status_code": SUCCESS
        }
    else:
        response = {
            "msg": "Fail Created",
            "status_code": FAIL
        }
    return response

