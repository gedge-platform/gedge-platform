"""
Modules with Defined for PVC Function
"""
from flask import session
from apps.common.base import *
from apps.common.utils import *
from apps.common.statics import *
from apps.common.codes import *
from apps.common.schema import *

from kubernetes.client.rest import ApiException

from apps.control.dao.cluster import *

from apps.control.kao.pvc import *
from apps.control.kao.storageclass import *

def get_pvc_list(cluster_name=None):
    """
    Get Kubernetes PVC List
    """
    result = {}
    result['pvc_list'] = []
    pvc_list = []

    cluster_list = Cluster.list()

    if not len(cluster_list) > 0:
        return result

    if cluster_name:
        try:
            pvc_list = Pvc.router.using(cluster_name).list()
        except ApiException as e:
            print(e)
            pvc_list = []
        
        for pvc in pvc_list:
            result_pvc = {}
            pvc_namespace = pvc.pvc_namespace
            if pvc_namespace != DEFAULT_NAMESPACE:
                continue

            result_pvc['pvc_name'] = pvc.pvc_name
            result_pvc['pvc_size'] = pvc.pvc_size
            result_pvc['pvc_status'] = pvc.pvc_status
            result_pvc['cluster_name'] = cluster_name

            result['pvc_list'].append(result_pvc)
    else:
        for cluster in cluster_list:
            if cluster.cluster_data.status != ClusterStatus.COMPLATE.value:
                break
            try:
                pvc_list = Pvc.router.using(cluster.cluster_name).list()
            except ApiException as e:
                print(e)
                pvc_list = []
            
            for pvc in pvc_list:
                result_pvc = {}
                pvc_namespace = pvc.pvc_namespace
                if pvc_namespace != DEFAULT_NAMESPACE:
                    continue

                result_pvc['pvc_name'] = pvc.pvc_name
                result_pvc['pvc_size'] = pvc.pvc_size
                result_pvc['pvc_status'] = pvc.pvc_status
                result_pvc['cluster_name'] = cluster.cluster_name

                result['pvc_list'].append(result_pvc)

    return result

def get_pvc(cluster_name, pvc_name):
    """
    Get Kubernetes PVC
    """
    result = Pvc.router.using(cluster_name).get(namespace=DEFAULT_NAMESPACE, name=pvc_name)
    return result

def delete_pvc(cluster_name, pvc_name):
    """
    Delete Kubernetes PVC
    """
    response = None
    result = Pvc.router.using(cluster_name).delete(namespace=DEFAULT_NAMESPACE, name=pvc_name)
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

def create_pvc(pvc_data):
    """
    Create Kubernetes PVC
    """
    response = None

    cluster_name = pvc_data['cluster_name']
    
    pvc_schema_data = pvc_schema(pvc_data)

    result = Pvc.router.using(cluster_name).create(namespace=DEFAULT_NAMESPACE, body=pvc_schema_data)

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

def get_storage_class_list():
    """
    List Kubernetes StorageClass
    """
    result = {}
    
    cluster_list = Cluster.list()

    if not len(cluster_list) > 0:
        raise Exception("Not Register Clusters")

    for cluster in cluster_list:
        result_pvc = Storageclass.router.using(cluster.cluster_name).all()
        result[cluster.cluster_name] = result_pvc

    return result