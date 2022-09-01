"""[summary]
Modules with Defined for Kubernetes Micro Service Functions
"""
from flask import session, jsonify

from apps.common.base import *
from apps.common.utils import *
from apps.common.statics import *
from apps.common.codes import *
from apps.common.database import *

from kubernetes.client.rest import ApiException

from apps.control.dao.cluster import *
from apps.control.dao.account import *

from apps.control.kao.node import *
from apps.control.kao.service import *
from apps.control.kao.pod import *

import yaml

def get_micro_service_list():
    """[summary]
    A function that Receives a Get Request and returns a list of micro services
    
    Returns:
        [dict]: [Information for Micro Service List, Dict Type]
    """
    result = {}
    result['ms_list'] = []
    cluster_list = Cluster.list()
    
    for cluster in cluster_list:
        try:
            ms_list = Pod.router.using(cluster.cluster_name).list()
            
        except ApiException as e:
            print(e)
            ms_list = []
        
        for ms in ms_list:
            result_ms = {}
            pod_namespace = ms.pod_namespace
            if pod_namespace != DEFAULT_NAMESPACE:
                continue
                
            result_ms['pod_name'] = ms.pod_name
            result_ms['pod_namespace'] = ms.pod_namespace
            result_ms['pod_node'] = ms.pod_node
            result_ms['cluster_name'] = cluster.cluster_name
            
            result['ms_list'].append(result_ms)
        
        try:
            service_list = Service.router.using(cluster.cluster_name).list()
        except ApiException as e:
            print(e)
            service_list = []
        
        if (cluster.cluster_data.cluster_role == "true"):
            for service in service_list:
                if 'kiali-dashboard' in service.service_name:
                    kiali_ip = service.external_ip
                    result['kiali_ip'] = kiali_ip
        
    return result

def get_micro_service(cluster_name, ms_name):
    """[summary]
    A function that receives a Get request and returns a info of micro service
    
    Args:
        cluster_name ([string]): [Cluster name to query]
        ms_name ([string]): [Micro Service name to query]

    Returns:
        [json]: [Information for Micro Service, Json type]
    """
    result = Pod.router.using(cluster_name).get(namespace=DEFAULT_NAMESPACE, name=ms_name)
    result['cluster_name'] = cluster_name
    return result

def add_micro_service(request):
    """[summary]
    Add Micro Service Info to Kubernetes Cluster
    
    Args:
        request ([json]): [Micro Service information to add]

    Returns:
        [json]: [Result of further processing of Micro Service]
    """
    response = None
    cluster_name = request['cluster_name']

    yaml_data = list(yaml.load_all(request['yaml_data'],Loader=yaml.FullLoader))
    
    user_id = {
        "user_id": session['user_id']
    }
    input_data = {
        "yaml": request['yaml_data']
    }
    
    if isinstance(yaml_data, dict) or isinstance(yaml_data, list):
        user_update = Account.update(user_id, input_data)
        if not user_update:
            print("Yaml DB Save Failed")
        try:
            result = Pod.router.using(cluster_name).create(namespace=DEFAULT_NAMESPACE, body=yaml_data)
        except ApiException as e:
            result = False
            
        if result:
            response = {
                "msg": "Created Pod",
                "status_code": SUCCESS
            }
        else:
            response = {
                "msg": "Created Fail",
                "status_code": FAIL
            }
    else:
        response = {
            "msg": "YAML Format is Wrong",
            "status_code": FAIL
        }
    return response
    
def delete_micro_service(cluster_name, ms_name):
    """[summary]
    Delete the microservice from that Kubernetes cluster
    
    Args:
        cluster_name ([string]): [Cluster name to delete]
        ms_name ([string]): [Micro Service name to delete]

    Returns:
        [json]: [Result of delete processing of Micro Service]
    """
    result = Pod.router.using(cluster_name).delete(namespace=DEFAULT_NAMESPACE, name=ms_name)
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

def get_user_yaml_data():
    """[summary]
    Get YAML Data stored in the login user
    
    Returns:
        [string]: [yaml String Data]
    """
    yaml_data = ''
    user = Account.get(user_id=session['user_id'])
    
    if user.yaml:
        yaml_data = user.yaml
    
    return yaml_data