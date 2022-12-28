"""
Modules with Defined for CNI Function
"""
from flask import session
from apps.common.base import *
from apps.common.utils import *
from apps.common.statics import *
from apps.common.codes import *
from apps.common.schema import *

from apps.control.dao.cluster import *

from apps.control.kao.cni import *

def get_cni_list():
    """
    Get Kubernetes CNI List
    """
    result = {}
    result['cni_list'] = {}

    cluster_list = Cluster.list()

    if not len(cluster_list) > 0:
        raise Exception("Not Register Clusters")

    for cluster in cluster_list:
        result['cni_list'][cluster.cluster_name] = []
        result_cni = Cni.router.using(cluster.cluster_name).all()
        result['cni_list'][cluster.cluster_name] = result_cni

    return result

def get_cni(cluster_name, cni_name):
    """
    Get Kubernetes CNI
    """
    result = Cni.router.using(cluster_name).get(namespace=DEFAULT_NAMESPACE, name=cni_name)
    return result

def delete_cni(cluster_name, cni_name):
    """
    Delete Kubernetes CNI
    """
    response = None
    result = Cni.router.using(cluster_name).delete(namespace=DEFAULT_NAMESPACE, name=cni_name)
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

def create_cni(cni_data):
    """
    Create Kubernetes CNI
    """
    cluster_name = cni_data['cluster_name']
    response = None

    cni_schema_data = cni_schema(cni_data)

    result = Cni.router.using(cluster_name).create(namespace=DEFAULT_NAMESPACE, body=cni_schema_data)
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

