"""
Modules with Defined for Kubernetes Multi Cluster Functions
"""
import requests
from flask import session
from apps.common.base import *
from apps.common.utils import *
from apps.common.statics import *
from apps.common.codes import *
from apps.common.database import *

from kubernetes.client.rest import ApiException
from pymongo.errors import WriteError
from pymongo.errors import OperationFailure

from apps.control.dao.cluster import *

from apps.control.kao.node import *
from apps.control.kao.service import *
from apps.control.kao.pod import *
from apps.control.kao.cni import *
from apps.control.kao.pvc import *
from apps.control.kao.storageclass import *

def get_cluster_list():
    """
    A function that receives a Get request and returns a list of clusters
    """
    result = []
    cluster_list = Cluster.list()
    
    if not len(cluster_list) > 0:
        return result
    
    for cluster in cluster_list:
        result_cluster = {}
        
        # Cluster
        result_cluster['cluster_name'] = cluster.cluster_name
        
        result_cluster['status'] = cluster.cluster_data.status

        if cluster.cluster_data.cluster_role == True:
            result_cluster['cluster_role'] = "MASTER"
        else:
            result_cluster['cluster_role'] = "SLAVE"
        
        result_cluster['cluster_type'] = str(cluster.cluster_data.cluster_type).upper()
        
        # # OSD
        # try:
        #     pod_list = Pod.router.using(cluster.cluster_name).list()
        #     osd_count = 0
        #     for pod in pod_list:
        #         if 'osd-prepare' in pod.pod_name:
        #             continue
        #         if 'osd' in pod.pod_name:
        #             osd_count+=1
                
        #     result_cluster['disk_size'] = osd_count
        # except ApiException as e:
        #     print("Pod : ", e)
        #     result_cluster['cluster_role'] = "ERROR"
        #     result_cluster['disk_size'] = 0
        
        if result_cluster['status'] != ClusterStatus.COMPLATE.value:
            master_ip = cluster.cluster_data.master_node_address
            result_cluster['master_ip'] = master_ip

            result_cluster['node_list'] = []
            node_datas = cluster.cluster_data.node_ips
            for node_data in node_datas:
                result_cluster['node_list'].append({
                    "address": node_data
                })
        else:
            # Node
            try:
                node_list = Node.router.using(cluster.cluster_name).all()
                result_cluster['node_list'] = node_list
            except ApiException as e:
                print("Node : ", e)
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
                print("Service : ", e)
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
    """
    A function that receives a Get request and returns a info of cluster resource
    """
    response = {}
    
    # Resource
    node_list = Node.router.using(cluster_name).list()
    cpu = mem = gpu = sriov = 0
    
    for node in node_list:
        if node.node_role == "MASTER" or not node.node_status:
            continue    
        cpu += int(node.resource.cpu)
        mem += int(node.resource.mem)
        gpu += int(node.resource.gpu)
        sriov += int(node.resource.sriov)

    # CNI
    cni_list = Cni.router.using(cluster_name).all()

    pvc_list = Pvc.router.using(cluster_name).all()

    strgclass_list = Storageclass.router.using(cluster_name).all()

    response = {
        'resources': {
            'cpu': cpu,
            'mem': mem,
            'gpu': gpu,
            'sriov': sriov
        },
        'cni': cni_list,
        'pvc': pvc_list,
        'strgclass': strgclass_list,
        'status_code': SUCCESS
    }
    return response    

def add_cluster(request):
    """
    Add Cluster Info to DB
    """
    response = {}
    cluster_name = request.pop('clu_name')

    if isinstance(request.get('master_yn'), str):
        if request.get('master_yn') == 'true':
            request['master_yn'] = True
    
    try:
        cluster_list = Cluster.list()
        
        for cluster in cluster_list:
            if cluster.cluster_data.cluster_role == True and request.get('master_yn', None) == True:
                response = {
                    "msg": "마스터 클러스터가 이미 존재합니다.",
                    "status_code": EXIST
                }
                return response
            
        cluster_get = Cluster.get(_id=cluster_name)
        
        if not cluster_get:
            master_yn = request.get('master_yn', None)
            cluster_status = request.pop('clu_init_type')

            if not master_yn:
                request['master_yn'] = False

            if cluster_status == 'add':
                request['api_key'] = 'bearer ' + request['api_key']
                request['status'] = ClusterStatus.COMPLATE.value
                try:
                    health = requests.get("https://" + request['clu_ip']
                                          + ":6443/livez?verbose", timeout=10, verify=False)
                except requests.exceptions.Timeout as e:
                    return {
                        "error": str(e),
                        "status_code": NOTCONNECTED
                    }
            else:
                request['status'] = ClusterStatus.INIT.value
                
                if isinstance(request['node_ips'], str):
                    node_ips = []
                    for node_ip in request['node_ips'].split(','):
                        node_ips.append(node_ip)
                    request['node_ips'] = node_ips

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
            "status_code": FAIL
        }

    return response


def delete_cluster(cluster_name):
    """
    Delete Cluster Info to DB
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
    """
    Delete Clusters Info to DB
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
