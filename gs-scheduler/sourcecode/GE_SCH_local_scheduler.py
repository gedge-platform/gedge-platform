#!/usr/bin/env python
import time
import socket
import random
import json
from pprint import pprint
import redis
from   kubernetes import client, config, watch
from   kubernetes.client.rest import ApiException
import GE_SCH_define
import GE_SCH_redis
import GE_SCH_util
import quantity
import requests

config.load_kube_config()
v1 = client.CoreV1Api()

def call_worker_agent(ip,port,path,pingsize,pingcount) :
    url = str("http://")+str(ip)+str(":")+str(port)+(path)
    print("url=",url)
    headers = {'Content-type':'application/json'}
    payload = {"pingSize": pingsize,"pingCount":pingcount}
    try :
        response = requests.post(url, headers=headers, params=payload)
        print(response)
    except :
        print("Error: can not request worker agent")
        exit(1)


def nodes_available():
    '''-------------------------------------------------
    structure of node_resource_usage
    ----------------------------------------------------
    node_resource_usage = {
        "master-node":{
            "used":{"cpu":0,"memory":0},
            "available":{"cpu":1,"memory":1}
        }
    }
    ---------------------------------------------------'''
    ready_nodes = []
    
    for n in v1.list_node().items:
        for status in n.status.conditions:
            #print("status===============================================",status)
            if status.status == "True" and status.type == "Ready":
                #print("status_True_Ready===============================================",status, n.metadata.name)
                ready_nodes.append(n.metadata.name)
    
    print("ready_nodes=================", ready_nodes)
    #'''-------------------------------------------------
    node_resource_usage = {}
    for node_name in ready_nodes :
        temp_status = v1.read_node_status(node_name)

        allocatable_cpu = quantity.parse_quantity(temp_status.status.allocatable["cpu"])
        allocatable_memory = quantity.parse_quantity(temp_status.status.allocatable["memory"])
        
        node_resource_usage[node_name] = {"used": {"cpu": 0, "memory": 0},  "available": {
            "cpu": allocatable_cpu, "memory": allocatable_memory}}
    print("=============================================================================")
    print(node_resource_usage)

    res_pods = v1.list_pod_for_all_namespaces(pretty=True)
    for i in res_pods.items:
        for j in i.spec.containers:
            if j.resources.requests or j.resources.limits:
                #print("------------>",j.resources.requests)
                if i.spec.node_name in ready_nodes:
                    if "cpu" in j.resources.requests :
                        node_resource_usage[i.spec.node_name]["used"]["cpu"] += quantity.parse_quantity(j.resources.requests["cpu"])
                    if "memory" in j.resources.requests :
                        node_resource_usage[i.spec.node_name]["used"]["memory"] += quantity.parse_quantity(j.resources.requests["memory"])                
    print("=============================================================================")
    print(node_resource_usage)
   
 
    return_ready_nodes = []
    
    for temp_node in ready_nodes:
        cpu_percent = (float(node_resource_usage[temp_node]["used"]["cpu"]) /
                       float(node_resource_usage[temp_node]["available"]["cpu"]))*100
        memory_percent = (float(node_resource_usage[temp_node]["used"]["memory"]) /
                          float(node_resource_usage[temp_node]["available"]["memory"]))*100
        #print("node name =", temp_node)
        #print("cpu_percent=", cpu_percent)
        #print("memory_percent=", memory_percent)
        if cpu_percent < GE_SCH_define.CPU_LIMIT_PERCENT and memory_percent < GE_SCH_define.MEMORY_LIMIT_PERCENT:
            return_ready_nodes.append(temp_node)
    print("return_ready_nodes=================", return_ready_nodes)
    return return_ready_nodes
    

def get_hostname_by_ip(host_ip):

    ret = v1.list_node(watch=False)
    
    for node in ret.items:
        address_list = node.status.addresses
        for temp_address in address_list:
            if temp_address.type == 'InternalIP':
                if temp_address.address == host_ip:
                    return node.metadata.name
    return None


def get_ip_by_hostname(host_name):
    print("host_name:", host_name)
    ret = v1.list_node(watch=False)
    for node in ret.items:
        address_list = node.status.addresses
        is_found = False
        for temp_address in address_list:
            if temp_address.type == 'Hostname':
                if temp_address.address == host_name:
                    is_found= True 
        if is_found :
            for temp_address in address_list:
                if temp_address.type == 'InternalIP':
                   return temp_address.address
    return None


def scheduler(name, node, namespace="default"):
    #body = client.V1ConfigMap()
    body = client.V1Binding()

    target = client.V1ObjectReference()
    target.kind = "Node"
    target.apiVersion = "v1"
    target.name = node

    meta = client.V1ObjectMeta()
    meta.name = name

    body.target = target
    body.metadata = meta

    return v1.create_namespaced_binding(namespace, body, _preload_content=False)
    

def get_sorted_available_nodes(available_nodes, temp_dic) :
    return_list=[]
    
    for temp_array in temp_dic:
        if temp_array['node_name'] in available_nodes :
            return_list.append(temp_array['node_name'])

    #print("return_list=", return_list)
    return return_list


'''------------------------------------------------
  local schduler : low latency loop
------------------------------------------------'''

def local_lowlatency_schduler(event, sch_config_dic):
    available_nodes = nodes_available()

    temp_dic={}
    print('available_nodes=======================', available_nodes)
    
    # call request network data  to worker_agent  
    #print('sch_config_dic=======================', sch_config_dic)
    request_worker_ip = get_ip_by_hostname(sch_config_dic['sourceNode'].lower())
    #print("get_ip_by_hostname", request_worker_ip)

    call_worker_agent(request_worker_ip, str(GE_SCH_define.WORKER_SERVICE_PORT),
                       '/ge/api/v1/monitoring/latency/hostNode', GE_SCH_define.NETWORK_PING_SIZE, GE_SCH_define.NETWORK_PING_COUNT)
    
    temp_dic = GE_SCH_redis.get_data_to_redis_server(
        GE_SCH_define.REDIS_ENDPOINT_IP, GE_SCH_define.REDIS_ENDPOINT_PORT, sch_config_dic['sourceNode'].lower())

    #print("tempdic====================",temp_dic)
    
    sorted_availe_nodes = get_sorted_available_nodes(available_nodes, temp_dic)
    print('sorted_availe_nodes=====================', sorted_availe_nodes)
    
    for t_node in sorted_availe_nodes :
        print('t_node============================', t_node)
        try:
            result = scheduler(event['object'].metadata.name, t_node)
            #print('result============================',result)
            if result :
                print("local_lowlatency_schduler complete")
                break
        except client.rest.ApiException as e:
            print("local_lowlatency_schduler uncomplete")
            print (json.loads(e.body)['message'])
        continue


def get_schduler_config(env) :
    #print("env=", env)
    return_dic = {}
    temp_dic = {}
    
    for temp_env in env:
        #print(temp_env)
        #print(type(temp_env))
        temp_dic = temp_env.to_dict()
        #print('temp_dic=', temp_dic)
        return_dic[temp_dic['name']] = temp_dic['value']
    
    #print("return_dic=",return_dic)
    result = json.loads(return_dic['gschConfig'])
    #print(type(result))
    #print(result['type'])
    
    return result


'''------------------------------------------------
  schduler main loop 
------------------------------------------------'''

def schduler_loop():
    w = watch.Watch()
    watch_count = 0
    pending_count = 0
    
    for event in w.stream(v1.list_namespaced_pod, "default"):
        if event['object'].status.phase == "Pending" and event['object'].status.conditions == None and event['object'].spec.scheduler_name == GE_SCH_define.LOCAL_SCHEDULER_NAME:
        #if event['object'].status.phase == "Pending" and event['object'].spec.scheduler_name == GE_SCH_define.LOCAL_SCHEDULER_NAME:
            try:
                print("name=============================", event['object'].metadata.name)
                #print("event['object']=", event['object'])
                temp_env = event['object'].spec.containers[0].env
                print('temp_env=',temp_env)
                if temp_env == None : 
                    print("warning : related podpreset env was not setted")
                    continue
                sch_config_dic={}
                sch_config_dic=get_schduler_config(temp_env)
                if sch_config_dic['type'] == 'local' :
                    if sch_config_dic['priority'] == 'low-latency':
                        if 'sourceNode' in sch_config_dic:
                            print("sourceNode===========================",sch_config_dic['sourceNode'])
                        else :
                            temp_host_info = GE_SCH_util.get_hostnode_info()
                            sch_config_dic['sourceNode'] = get_hostname_by_ip(temp_host_info["ip_address"])
                            print("sourceNode===========================", sch_config_dic['sourceNode'])
                        local_lowlatency_schduler(event,sch_config_dic)
                    elif sch_config_dic['priority'] == 'low-latency2':
                        print('low-latency2')
                elif sch_config_dic['type'] == 'global':
                    print('global')
            except client.rest.ApiException as e:
                print(json.loads(e.body)['message'])
            print('(pending_count=',pending_count, ')')
            pending_count+=1
        watch_count += 1
        print('(watch_count=', watch_count, ')')

    print("why!!!!")


if __name__ == '__main__':
    schduler_loop()
