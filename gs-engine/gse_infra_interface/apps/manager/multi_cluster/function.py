"""[summary]
Modules with Defined for Kubernetes Multi Cluster Functions
"""
from flask import session
from apps.common.base import *
from apps.common.utils import *
from apps.common.statics import *
from apps.common.codes import *
from apps.common.database import *

from kubernetes.client.rest import ApiException
from pymongo.errors import WriteError, OperationFailure

from apps.control.dao.cluster import *

from apps.control.kao.node import *
from apps.control.kao.service import *
from apps.control.kao.pod import *


def get_cluster_list():
    """[summary]
    A function that receives a Get request and returns a list of clusters
    Returns:
        [dict]: [Information for Cluster List, Dict Type]
    """
    result = []
    cluster_list = Cluster.list()

    for cluster in cluster_list:
        result_cluster = {}
        
        # Cluster
        result_cluster['cluster_name'] = cluster.cluster_name

        if cluster.cluster_data.cluster_role == "true":
            result_cluster['cluster_role'] = "MASTER"
        else:
            result_cluster['cluster_role'] = "SLAVE"
        
        result_cluster['cluster_type'] = str(cluster.cluster_data.cluster_type).upper()
        
        # OSD
        try:
            pod_list = Pod.router.using(cluster.cluster_name).list()
            osd_count = 0
            for pod in pod_list:
                if 'osd-prepare' in pod.pod_name:
                    continue
                if 'osd' in pod.pod_name:
                    osd_count+=1
                
            result_cluster['disk_size'] = osd_count
        except ApiException as e:
            print("Pod : ")
            print(e)
            result_cluster['cluster_role'] = "ERROR"
            result_cluster['disk_size'] = 0
        
        # Node
        try:
            node_list = Node.router.using(cluster.cluster_name).list()
            result_cluster['node_list'] = node_list
        except ApiException as e:
            print("Node : ")
            print(e)
            result_cluster['cluster_role'] = "ERROR"
            result_cluster['node_list'] = []
        
        # Service
        storage_ip = ms_ip = kiali_ip = '-.-.-.-'
        try:
            service_list = Service.router.using(cluster.cluster_name).list()
        
            for service in service_list:
                if 'rook-ceph-rgw-cy-store-external' in service.service_name:
                    storage_ip = service.external_ip
                elif 'kiali-dashboard' in service.service_name:
                    kiali_ip = service.external_ip
                elif 'istio-eastwestgateway' in service.service_name:
                    ms_ip = service.external_ip
        except ApiException as e:
            print("Service : ")
            print(e)
            result_cluster['cluster_role'] = "ERROR"
            
        
        result_cluster['endpoint'] = {
            'storage_group': {
                'address': storage_ip
            },
            'ms_gateway': {
                'address': ms_ip
            },
            'kiali_ip': {
                'address': kiali_ip
            }
        }
        result.append(result_cluster)
    
    return result

def get_cluster_resource(cluster_name):
    """[summary]
    A function that receives a Get request and returns a info of cluster resource
    
    Args:
        cluster_name ([string]): [Cluster name to query]

    Returns:
        [json]: [Information for Cluster Resource, Json Type]
    """
    response = {}
    node_list = Node.router.using(cluster_name).list()
    cpu = mem = gpu = 0
    
    for node in node_list:
        if node.node_role == "MASTER" or not node.node_status:
            continue    
        cpu += int(node.resource.cpu)
        mem += int(node.resource.mem)
        gpu += int(node.resource.gpu)
        
    response = {
        'resources': {
            'cpu': cpu,
            'mem': mem,
            'gpu': gpu
        },
        'status_code': SUCCESS
    }
    return response    

def add_cluster(request):
    """[summary]
    Add Cluster Info to DB
    Args:
        request ([json]): [Cluster information to add]

    Returns:
        [json]: [Result of further processing of cluster]
    """
    response = {}
    cluster_name = request.pop('clu_name')
    try:
        cluster_list = Cluster.list()
        
        for cluster in cluster_list:
            if cluster.cluster_data.cluster_role == "true" and request.get('master_yn', None) == "true":
                response = {
                    "msg": "마스터 클러스터가 이미 존재합니다.",
                    "status_code": EXIST
                }
                return response
            
        cluster_get = Cluster.get(_id=cluster_name)
        
        if not cluster_get:
            master_yn = request.get('master_yn', None)
            if not master_yn:
                request['master_yn'] = "false"
                
            
            request['api_key'] = 'bearer ' + request['api_key']

            cluster_data = {
                "_id": cluster_name,
                "clu_data": request
            }
            
            Cluster.create(cluster_data)

            response = {
                "status_code": CREATE
            }
        else:
            response = {
                "msg": "해당 클러스터 이름이 존재합니다.",
                "status_code": EXIST
            }
    except WriteError as e:
        response = {
            "error": str(e),
            "status_cdoe": FAIL
        }

    return response


def delete_cluster(cluster_name):
    """[summary]
    Delete Cluster Info to DB
    Args:
        cluster_name ([string]): [Cluster information to Delete]

    Returns:
        [json]: [Result of delete processiong of cluster]
    """
    response = {}
    result = Cluster.delete(_id=cluster_name)
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

def delete_clusters():
    """[summary]
    Delete Clusters Info to DB

    Returns:
        [json]: [Result of delete processiong of clusters]
    """
    response = {}
    result = Cluster.reset()
    if result:
        response = {
            "msg": "Deleted All Data",
            "status_code": SUCCESS
        }
    else:
        response = {
            "msg": "No Data",
            "status_code": FAIL
        }
    return response
