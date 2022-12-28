"""
Modules with Defined for Kubernetes Micro Service Functions
"""
from re import A
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

from apps.common.schema import *

import yaml

def get_micro_service_list():
    """
    A function that Receives a Get Request and returns a list of micro services
    """
    result = {}
    result['ms_list'] = []
    cluster_list = Cluster.list()

    if not len(cluster_list) > 0:
        return result
        
    for cluster in cluster_list:
        if cluster.cluster_data.status != ClusterStatus.COMPLATE.value:
            break

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
            
        if cluster.cluster_data.cluster_role == True:
            for service in service_list:
                if 'kiali-dashboard' == service.service_name:
                    kiali_ip = service.external_ip
                    result['kiali_ip'] = kiali_ip
    result['status_code'] = SUCCESS
    return result

def get_micro_service(cluster_name, ms_name):
    """
    A function that receives a Get request and returns a info of micro service
    """
    result = {}
    try:
        result = Pod.router.using(cluster_name).get(namespace=DEFAULT_NAMESPACE, name=ms_name)
    except ApiException as e:
        result['status_code'] = FAIL
    
    result['cluster_name'] = cluster_name
    result['status_code'] = SUCCESS
    return result

def add_micro_service(request):
    """
    Add Micro Service Info to Kubernetes Cluster
    """
    result = None
    response = None
    cluster_name = request['cluster_name']
    service_type = request['service_type']
    
    if service_type:
        service_yaml = service_schema(request)
        try:
            result = Service.router.using(cluster_name).create(namespace=DEFAULT_NAMESPACE, body=service_yaml)
        except ApiException as e:
            response = {
                "msg": "Service Created Fail",
                "status_code": FAIL
            }
            print(e)
            return response
    
    if 'yaml_data' in request:
        yaml_data = list(yaml.load_all(request['yaml_data'],Loader=yaml.FullLoader))
        
        user_name = {
            "user_name": session['user_name']
        }
        input_data = {
            "yaml": request['yaml_data']
        }
    
        if isinstance(yaml_data, dict) or isinstance(yaml_data, list):
            user_update = Account.update(user_name, input_data)
            if not user_update:
                print("Yaml DB Save Failed")

            try:
                result = Pod.router.using(cluster_name).create(namespace=DEFAULT_NAMESPACE, body=yaml_data)
            except ApiException as e:
                result = False    
        else:
            response = {
                "msg": "YAML Format is Wrong",
                "status_code": FAIL
            }
    else:
        template_yaml = ms_template_schema(request)
        try:
            result = Pod.router.using(cluster_name).create(namespace=DEFAULT_NAMESPACE, body=template_yaml)
        except ApiException as e:
            print(str(e))
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
    return response
    
def delete_micro_service(cluster_name, ms_name):
    """
    Delete the microservice from that Kubernetes cluster
    """
    response = None
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
    """
    Get YAML Data stored in the login user
    """
    yaml_data = ''
    user = Account.get(user_name=session['user_name'])
    
    if user.yaml:
        yaml_data = user.yaml
    
    return yaml_data
