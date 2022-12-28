"""
Modules with Defined for Kubernetes Service Functions
"""
from flask import session, jsonify

from apps.common.base import *
from apps.common.utils import *
from apps.common.statics import *
from apps.common.codes import *
from apps.common.database import *

from kubernetes.client.rest import ApiException

from apps.control.dao.cluster import *

from apps.control.kao.service import *

from apps.common.schema import *


def get_service_list(cluster_name=None):
    """
    Get Service List Function
    """
    result = {}
    result['service_list'] = []
    service_list = []
    
    if cluster_name:
        try:
            service_list = Service.router.using(cluster_name).list()
        except ApiException as e:
            print(e)
            result['status_code'] = FAIL
            service_list = []
            
        for service in service_list:
            result_svc = {}
            svc_namespace = service.service_namespace
            if svc_namespace != DEFAULT_NAMESPACE:
                continue
            
            result_svc['svc_name'] = service.service_name
            result_svc['svc_type'] = service.service_type
            result_svc['cluster_ip'] = service.cluster_ip
            result_svc['external_ip'] = service.external_ip
            result_svc['svc_ports'] = service.service_ports
            result_svc['cluster_name'] = cluster_name
            
            result['service_list'].append(result_svc)
                
    else:
        cluster_list = Cluster.list()
        if not len(cluster_list) > 0:
            return result
        
        for cluster in cluster_list:
            if cluster.cluster_data.status != ClusterStatus.COMPLATE.value:
                break
            try:
                service_list = Service.router.using(cluster.cluster_name).list()
            except ApiException as e:
                print(e)
                result['status_code'] = FAIL
                service_list = []
            
            for service in service_list:
                result_svc = {}
                svc_namespace = service.service_namespace
                if svc_namespace != DEFAULT_NAMESPACE:
                    continue
                
                result_svc['svc_name'] = service.service_name
                result_svc['svc_type'] = service.service_type
                result_svc['cluster_ip'] = service.cluster_ip
                result_svc['external_ip'] = service.external_ip
                result_svc['svc_ports'] = service.service_ports
                result_svc['cluster_name'] = cluster.cluster_name
                
                result['service_list'].append(result_svc)
        
    result['status_code'] = SUCCESS
    return result

def add_service(request):
    """
    Add Service Function
    """
    response = None
    result = None

    cluster_name = request['cluster_name']
    
    service_yaml = service_schema(request)
    print("yaml : ", service_yaml)
    try:
        result = Service.router.using(cluster_name).create(namespace=DEFAULT_NAMESPACE, body=service_yaml)
    except ApiException as e:
        result = False
        print(e)
    
    if result:
        response = {
            "msg": "Created Service",
            "status_code": SUCCESS
        }
    else:
        response = {
            "msg": "Created Fail",
            "status_code": FAIL
        }
        
    return response

def get_service(cluster_name, service_name):
    """
    Get Service Function
    """
    result = {}

    try:
        result = Service.router.using(cluster_name).get(namespace=DEFAULT_NAMESPACE, name=service_name)
    except ApiException as e:
        result['status_code'] = FAIL

    result['cluster_name'] = cluster_name
    result['status_code'] = SUCCESS
    return result

def delete_service(cluster_name, service_name):
    """
    Delete Service Function
    """
    response = None
    result = Service.router.using(cluster_name).delete(namespace=DEFAULT_NAMESPACE, name=service_name)
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