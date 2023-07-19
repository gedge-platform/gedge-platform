#!/usr/bin/env python
from __future__ import print_function
import sys
sys.path.append('../gelib')
sys.path.append('../gedef')

from kubernetes import client, config
from pythonping import ping
import redis
import json
from operator import itemgetter
from flask import Flask, request, render_template, redirect, url_for


import GE_define as gDefine
import GE_LSCH_define_wa as waDefine

import GE_platform_util as pUtil
from   GE_meta_data import metaData
from   GE_redis import redisController

app = Flask(__name__)

# Configs can be set in Configuration class directly or using helper utility
try :
    config.load_incluster_config()
except:
    config.load_kube_config()

v1 = client.CoreV1Api()

def init_gsch_worker_agent():
    
    # set global define data
    '''------------------------------------------------
            KAFKA MESSAGE
    ------------------------------------------------'''
    while 1:     
        r = pUtil.find_platform_namespaced_service_with_rest_api(gDefine.GEDGE_SYSTEM_NAMESPACE,gDefine.KAFKA_SERVICE_NAME)
        if r : 
            gDefine.KAFKA_ENDPOINT_IP   = r['access_host']
            gDefine.KAFKA_ENDPOINT_PORT = r['access_port']
            gDefine.KAFKA_SERVER_URL            = str(gDefine.KAFKA_ENDPOINT_IP)+str(':')+str(gDefine.KAFKA_ENDPOINT_PORT)
            print(gDefine.KAFKA_ENDPOINT_IP,gDefine.KAFKA_ENDPOINT_PORT)
            break
        else :
            print('wait for running platform service',)
            time.sleep(gDefine.WAIT_RUNNING_PLATFORM_SERVICES_SECOND_TIME) 
            continue

    '''-----------------------------------------------
            REDIS
    -----------------------------------------------'''
    while 1:
        r = pUtil.find_platform_namespaced_service_with_rest_api(gDefine.GEDGE_SYSTEM_NAMESPACE,gDefine.REDIS_SERVICE_NAME)
        if r : 
            gDefine.REDIS_ENDPOINT_IP   = r['access_host']
            gDefine.REDIS_ENDPOINT_PORT = r['access_port']
            print(gDefine.REDIS_ENDPOINT_IP,gDefine.REDIS_ENDPOINT_PORT)
            break
        else :
            print('wait for running platform service',)
            time.sleep(gDefine.WAIT_RUNNING_PLATFORM_SERVICES_SECOND_TIME) 
            continue

    '''-----------------------------------------------
            MONGO DB 
    -----------------------------------------------'''
    while 1:        
        r = pUtil.find_platform_namespaced_service_with_rest_api(gDefine.GEDGE_SYSTEM_NAMESPACE,gDefine.MONGO_DB_SERVICE_NAME)
        if r : 
            gDefine.MONGO_DB_ENDPOINT_IP   = r['access_host']
            gDefine.MONGO_DB_ENDPOINT_PORT = r['access_port']
            print(gDefine.MONGO_DB_ENDPOINT_IP,gDefine.MONGO_DB_ENDPOINT_PORT)    
            print('3')
            break
        else :
            print('wait for running platform service',)
            time.sleep(gDefine.WAIT_RUNNING_PLATFORM_SERVICES_SECOND_TIME) 
            continue

GE_metaData = metaData() 

init_gsch_worker_agent()

GE_metaData.init_platform_metadata_from_mongodb(ip=gDefine.MONGO_DB_ENDPOINT_IP,port=int(gDefine.MONGO_DB_ENDPOINT_PORT))

def get_cluster_ip_by_cluster_name(cluster_name):
    try :
        result = GE_metaData.get_cluster_info(cluster_name)
        return result['cluster_ip']
    except :
        print('error : get_cluster_ip_by_cluster_name')
        return None
    print('error : can not find ip of cluster name :',cluster_name)
    return None

def get_nearnodes_latency_from_hostnode(ping_size,ping_count,worker_nodes):
    if worker_nodes == None:
        print("error: worker_nodes is empty")
        return None

    temp_hostnode_info = pUtil.get_hostnode_info()
    print('temp_hostnode_info',temp_hostnode_info)

    if temp_hostnode_info == None:
        print("error: get_hostnode_info")
        return None
    print('1')
    list_nearnode_latency = []
    for temp in worker_nodes:
        print('2')
        temp_dic = temp
        print('2-2')
        response_list = []
        print('2-3')
        response_list = ping(temp["node_ip"],size=ping_size, count=ping_count)
        print('3')
        temp_dic["latency"] = response_list.rtt_avg_ms
        list_nearnode_latency.append(temp_dic)
    print('4')
    if response_list == None :
        return None
    print('list_nearnode_latency',list_nearnode_latency)
    sorted_nearnodes_latency = sorted(list_nearnode_latency, key=itemgetter('latency'))
    print('sorted_nearnodes_latency',sorted_nearnodes_latency) 
    #sorted_result_list = sorted(list_nearnode_latency,key=lambda list_nearnode_latency :(list_nearnode_latency['latency'],list_nearnode_latency['node_name'],list_nearnode_latency['ip']))
    #print('sorted_result_list',sorted_result_list)
    return sorted_nearnodes_latency

def get_near_clusters_latency_from_hostnode(ping_size,ping_count,near_clusters):
    if near_clusters == None:
        print("error: near_clusters is empty")
        return None

    temp_hostnode_info = pUtil.get_hostnode_info()
    print(temp_hostnode_info)

    if temp_hostnode_info == None:
        print("error: get_hostnode_info")
        return None

    list_nearclusters_latency = []
    for temp in near_clusters:
        if temp["ip"] != temp_hostnode_info["ip"]:
            temp_dic = temp
            response_list = []
            response_list = ping(temp["ip"],size=ping_size, count=ping_count)
            temp_dic["latency"] = response_list.rtt_avg_ms
            list_nearclusters_latency.append(temp_dic)
    
    if response_list == None :
        return None
   
    sorted_nearclusters_latency = sorted(list_nearclusters_latency, key=itemgetter('latency'))
    return sorted_nearclusters_latency

def get_cluster_latency_from_hostnode(ping_size,ping_count,cluster):
    if ping_size==None or  ping_count==None or cluster == None:
        print("error: ping_size, ping_count cluster is empty")
        return None
    cluster_ip = get_cluster_ip_by_cluster_name(cluster) 
    if cluster_ip == None :
        return None
    response_list = []
    response_list  = ping(cluster_ip,size=ping_size, count=ping_count)
    latency = response_list.rtt_avg_ms
    
    if latency == None :
        return None
    return latency

@app.route('/monitoring/near-nodes/latency', methods=['GET'])
def getLatencyNearNodesFromHostNode():
    #targetNode_data = request.values.get("targetNode")
    #if targetNode_data == None:
    #    print("error : targetNode is empty")
    #    response_data = {}
    #    response_data['error'] = 'targetNode is empty'
    #    response = app.response_class(response=json.dumps(response_data), status=200, mimetype='application/json')
    #    return response
    try:
        ping_size = request.values.get("pingSize")
        print(type(ping_size))
        if ping_size == None:
            return GE_SCH_response_wihterror('InvalidRequestContentException', 'error: pingSize is empty')
        
        ping_count = request.values.get("pingCount")
        if ping_count == None:
            return GE_SCH_response_wihterror('InvalidRequestContentException', 'error: pingCount is empty')

        worker_nodes = pUtil.get_worker_nodes_dic()
        print('worker_nodes',worker_nodes)
        if worker_nodes == None:
            return GE_SCH_response_wihterror('ServiceInternalException', 'error: get_list_worker_node')

        latency_data=get_nearnodes_latency_from_hostnode(int(ping_size), int(ping_count), worker_nodes)
        print('latency_data',latency_data)
        if latency_data == None:
            return GE_SCH_response_wihterror('ServiceInternalException', 'error: get_nearnodes_latency_from_hostnode')
    except:
        return GE_SCH_response_wihterror('ServiceInternalException', 'error: getLatencyNearNodesFromHostNode')
    response_data = {}
    response_data['Result'] = latency_data
    response = app.response_class(response=json.dumps(response_data), status=200, mimetype='application/json')
    gDefine.logger.info('getLatencyNearNodesFromHostNode')
    return response

@app.route('/monitoring/node/<node>/latency', methods=['GET'])
def getLatencyNodeFromHostNode(node):
    return GE_SCH_response_wihterror('Not Implemented', 'error: getLatencyNodeFromHostNode')

@app.route('/monitoring/near-clusters/latency', methods=['GET'])
def getLatencyNearClustersFromHostNode():
    return GE_SCH_response_wihterror('Not Implemented', 'error: getLatencyNearClustersFromHostNode')

@app.route('/monitoring/clusters/<cluster>/latency', methods=['GET'])
def getLatencyClusterFromHostNode(cluster):
    try :
        try :
            ping_size = request.values.get("pingSize")
            if ping_size == None:
                ping_size  = waDefine.NETWORK_PING_SIZE
            print("pingSize:",ping_size)

            ping_count = request.values.get("pingCount")
            if ping_count == None:
                ping_count = waDefine.NETWORK_PING_COUNT
            print("pingCount:",ping_count)
        except:
            ping_size  = waDefine.NETWORK_PING_SIZE
            ping_count = waDefine.NETWORK_PING_COUNT

        latency_data=get_cluster_latency_from_hostnode(int(ping_size), int(ping_count), cluster)
        if latency_data == None:
            return GE_SCH_response_wihterror('ServiceInternalException', 'error: get_nearclusters_latency_from_hostnode')
    except:
        return GE_SCH_response_wihterror('ServiceInternalException', 'error: getLatencyClusterFromHostNode')

    if latency_data == None:
        return GE_SCH_response_wihterror('ServiceInternalException', 'error: get_cluster_latency_from_hostnode')
    response_data = {}
    response_data['Result'] = latency_data
    response = app.response_class(response=json.dumps(response_data), status=200, mimetype='application/json')
    gDefine.logger.info('getLatencyClusterFromHostNode')
    print(response)
    return response

'''------------------------------------------------------------------------------
     error 
------------------------------------------------------------------------------'''

def GE_SCH_response_wihterror(ErrorCode, DetailLog):
    print(DetailLog)
    response_data = {}
    response_data['Error'] = {}
    response_data['Error']['ErrorCode'] = ErrorCode
    response_data['Error']['Message'] = gDefine.ERROR_CODES[ErrorCode]['Description']
    response = app.response_class(response=json.dumps(response_data), 
            status=gDefine.ERROR_CODES[ErrorCode]['StatusCode'], mimetype='application/json')
    gDefine.logger.error(response_data)
    return response


def main_program():
    print('===============================================================')
    print('get_cluster_info_list')
    GE_metaData.get_cluster_info_list()
    print('===============================================================')
    app.run(host='0.0.0.0', port=8787, threaded=True)


'''------------------------------------------------------------------------------
def run():
    context = daemon.DaemonContext()
    logfile_fileno = GE_SCH_define.file_handler.stream.fileno()
    context.files_preserve = [logfile_fileno]
    with context:
        main_program()
------------------------------------------------------------------------------'''

if __name__ == "__main__":
    main_program()
    #run()
