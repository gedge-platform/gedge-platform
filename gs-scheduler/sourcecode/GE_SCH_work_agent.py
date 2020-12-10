#!/usr/bin/env python

from __future__ import print_function
from kubernetes import client, config
from pythonping import ping
import redis
import json
from operator import itemgetter
from flask import Flask, request, render_template, redirect, url_for

import daemon

import GE_SCH_define
import GE_SCH_redis
import GE_SCH_util

app = Flask(__name__)

# Configs can be set in Configuration class directly or using helper utility
config.load_kube_config()
v1 = client.CoreV1Api()

def list_pod():
    print("Listing pods with their IPs:")
    ret = v1.list_pod_for_all_namespaces(watch=False)
    for i in ret.items:
        print("%s\t%s\t%s" %
              (i.status.pod_ip, i.metadata.namespace, i.metadata.name))


def get_hostname_by_ip(host_ip):
    ret = v1.list_node(watch=False)
    for node in ret.items:
        address_list = node.status.addresses
        for temp_address in address_list:
            if temp_address.type == 'InternalIP':
                if temp_address.address == host_ip:
                    return node.metadata.name
    return None

def get_list_worker_node():
    list_worker_node = []
    ret = v1.list_node(watch=False)
    for node in ret.items:
        address_list = node.status.addresses
        for temp_address in address_list:
            if temp_address.type == 'InternalIP':
                #print(temp_address.address)
                node_dic = {}
                node_dic["uid"] = node.metadata.uid
                node_dic["node_name"] = node.metadata.name
                node_dic["ip_address"] = temp_address.address
                list_worker_node.append(node_dic)
    return list_worker_node


def get_nearnodes_latency_from_hostnode(ping_size,ping_count,worker_nodes):
    
    if worker_nodes == None:
        print("error: worker_nodes is empty")
        return None

    temp_hostnode_info = GE_SCH_util.get_hostnode_info()
    print(temp_hostnode_info)

    if temp_hostnode_info == None:
        print("error: get_hostnode_info")
        return None

    list_nearnode_latency = []
    
    response_list=None
    for temp in worker_nodes:
        if temp["ip_address"] != temp_hostnode_info["ip_address"]:
            temp_dic = temp
            response_list = []
            response_list = ping(temp["ip_address"],size=ping_size, count=ping_count)
            temp_dic["latency"] = response_list.rtt_avg_ms
            list_nearnode_latency.append(temp_dic)
    
    if response_list == None :
        return None
   
    sorted_nearnodes_latency = sorted(list_nearnode_latency, key=itemgetter('latency'))
    return sorted_nearnodes_latency


@app.route('/ge/api/v1/monitoring/latency/hostNode', methods=['POST'])
def SetLatencyFromHostNode():
    #targetNode_data = request.values.get("targetNode")
    #if targetNode_data == None:
    #    print("error : targetNode is empty")
    #    response_data = {}
    #    response_data['error'] = 'targetNode is empty'
    #    response = app.response_class(response=json.dumps(response_data), status=200, mimetype='application/json')
    #    return response
    
    ping_size = request.values.get("pingSize")
    print(type(ping_size))
    if ping_size == None:
        return GE_SCH_response_wihterror('InvalidRequestContentException', 'error: pingSize is empty')
    
    ping_count = request.values.get("pingCount")
    if ping_count == None:
        return GE_SCH_response_wihterror('InvalidRequestContentException', 'error: pingCount is empty')
    
    temp_hostnode_info = GE_SCH_util.get_hostnode_info()
    print(temp_hostnode_info)
    if temp_hostnode_info == None:
        return GE_SCH_response_wihterror('ServiceInternalException', 'error: get_hostnode_info')

    temp_hostname = get_hostname_by_ip(temp_hostnode_info["ip_address"])
    print("temp hostname =", temp_hostname)
    if temp_hostname == None:
        return GE_SCH_response_wihterror('ServiceInternalException', 'error: get_hostname_by_ip')
    
    worker_nodes = get_list_worker_node()
    if worker_nodes == None:
        return GE_SCH_response_wihterror('ServiceInternalException', 'error: get_list_worker_node')

    latency_data=get_nearnodes_latency_from_hostnode(int(ping_size), int(ping_count), worker_nodes)
    if latency_data == None:
        return GE_SCH_response_wihterror('ServiceInternalException', 'error: get_nearnodes_latency_from_hostnode')

    result = GE_SCH_redis.set_data_to_redis_server(GE_SCH_define.REDIS_ENDPOINT_IP,
                             GE_SCH_define.REDIS_ENDPOINT_PORT, temp_hostname, latency_data)
    if result == None:
        return GE_SCH_response_wihterror('ServiceInternalException', 'error: set_data_to_redis_server')
    response_data = {}
    response_data['Result'] = result
    response = app.response_class(response=json.dumps(
        response_data), status=200, mimetype='application/json')
    GE_SCH_define.logger.info('SetLatencyFromHostNode')
    return response

'''------------------------------------------------------------------------------
     error 
------------------------------------------------------------------------------'''

def GE_SCH_response_wihterror(ErrorCode, DetailLog):
    print(DetailLog)
    response_data = {}
    response_data['Error'] = {}
    response_data['Error']['ErrorCode'] = ErrorCode
    response_data['Error']['Message'] = GE_SCH_define.ERROR_CODES[ErrorCode]['Description']
    response = app.response_class(response=json.dumps(response_data), 
            status=GE_SCH_define.ERROR_CODES[ErrorCode]['StatusCode'], mimetype='application/json')
    GE_SCH_define.logger.error(response_data)
    return response


def main_program():
    app.run(host='0.0.0.0', port=8787, threaded=True)


def run():
    context = daemon.DaemonContext()
    logfile_fileno = GE_SCH_define.file_handler.stream.fileno()
    context.files_preserve = [logfile_fileno]
    with context:
        main_program()


if __name__ == "__main__":
    main_program()
    #run()
