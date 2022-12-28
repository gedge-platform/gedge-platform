#!/usr/bin/env python
import sys
sys.path.append('../gelib')
sys.path.append('../gedef')

import time
import socket
import random
import json
from pprint import pprint
from   kubernetes import client, config, watch
from   kubernetes.client.rest import ApiException

import GE_define as gDefine
import GE_LSCH_define as lDefine

import quantity
import requests

from GE_redis import redisController
from operator import itemgetter

try :
    config.load_incluster_config()
except:
    config.load_kube_config()
    
v1 = client.CoreV1Api()


# worker agents information data (pod name , pod ip )
'''
    agentsInfo = {
        'node_name1' : {'pod_name': 'p1', 'pod_ip': ip1},
        'node_name2' : {'pod_name': 'p2', 'pod_ip': ip2} 
    }
'''
agentsInfo={}

def get_worker_agents_info():
    global agentsInfo
    try:
        api_response = v1.list_namespaced_pod(gDefine.GEDGE_SYSTEM_NAMESPACE, 
                                                label_selector='app='+str(lDefine.WORKER_AGENT_LABEL) )
        for i in api_response.items:
            if i.spec.node_name:
                print("find_host_name_of_pod_byname node name:", i.metadata.name, i.status.phase, i.spec.node_name, i.status.pod_ip)
                agentsInfo[str(i.spec.node_name)] = {'pod_name': i.metadata.name, 'pod_ip': i.status.pod_ip}
    except ApiException as e:
        print("Exception when calling CoreV1Api->list_namespaced_pod: %s\n" % e)
        exit(1)
    print('agentsInfo:',agentsInfo)
    return 0

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
            #print("status",status)
            if status.status == "True" and status.type == "Ready":
                print("metadata.name",n.metadata.name)
                ready_nodes.append(n.metadata.name)
    print("ready_nodes : ", ready_nodes)
    #'''-------------------------------------------------
    node_resource_usage = {}
    for node_name in ready_nodes :
        temp_status = v1.read_node_status(node_name)
        allocatable_cpu = quantity.parse_quantity(temp_status.status.allocatable["cpu"])
        allocatable_memory = quantity.parse_quantity(temp_status.status.allocatable["memory"])
        
        node_resource_usage[node_name] = {"used": {"cpu": 0, "memory": 0},  "available": {
            "cpu": allocatable_cpu, "memory": allocatable_memory}}
   
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
    print("=============================================================================")
 
    return_ready_nodes = []
    
    for temp_node in ready_nodes:
        cpu_percent = (float(node_resource_usage[temp_node]["used"]["cpu"]) /
                       float(node_resource_usage[temp_node]["available"]["cpu"]))*100
        memory_percent = (float(node_resource_usage[temp_node]["used"]["memory"]) /
                          float(node_resource_usage[temp_node]["available"]["memory"]))*100
        if cpu_percent < lDefine.CPU_LIMIT_PERCENT and memory_percent < lDefine.MEMORY_LIMIT_PERCENT:
            return_ready_nodes.append(temp_node)
    print("return_ready_nodes : ", return_ready_nodes)
    return return_ready_nodes

def get_schduler_config(env) :
    return_dic = {}
    temp_dic = {}
    
    for temp_env in env:
        temp_dic = temp_env.to_dict()
        return_dic[temp_dic['name']] = temp_dic['value']
    
    result = json.loads(return_dic[lDefine.GEDGE_SCHEDULER_CONFIG_NAME])
    return result

def scheduler(t_name, t_node, t_namespace="default"):
    target = client.V1ObjectReference()
    target.kind = "Node"
    target.apiVersion = "v1"
    target.name = t_node
    meta = client.V1ObjectMeta()
    meta.name = t_name
    body = client.V1Binding(target=target, metadata=meta)
    return v1.create_namespaced_binding(namespace=t_namespace, body=body, _preload_content=False)

'''------------------------------------------------
  local schduler : low latency loop
------------------------------------------------'''
def get_near_nodes_latency_from_worker_agent(ip,port,path,pingsize,pingcount) :
    url = str("http://")+str(ip)+str(":")+str(port)+(path)
    print("url=",url)
    headers = {'Content-type':'application/json'}
    payload = {"pingSize":pingsize,"pingCount":pingcount}
    try :
        print('get_near_nodes_latency_from_worker_agent1')
        response = requests.get(url, headers=headers, params=payload)
        print('get_near_nodes_latency_from_worker_agent2')
        response_dic=response.json()
        print('get_near_nodes_latency_from_worker_agent3')
        print('response_dic',response_dic )
        return response_dic['Result']
    except :
        print("Error: can not request worker agent")
        return None

def get_sorted_available_nodes_low_latency(available_nodes, temp_dic) :
    return_list=[]
    for temp_array in temp_dic:
        if temp_array['node_name'] in available_nodes :
            return_list.append(temp_array['node_name'])

    print("return_list : ", return_list)
    return return_list

def local_lowlatency_schduler(event, sch_config_dic, temp_namespace):
    global agentsInfo
    print('sch_config_dic :', sch_config_dic)
    print("sourceNode : ", sch_config_dic['option']['sourceNode'])
    
    available_nodes = nodes_available()

    temp_dic={}
    print('available_nodes : ', available_nodes)
    
    # call request network data  to worker_agent  
    #print('sch_config_dic=======================', sch_config_dic)
    t_sourceNode = sch_config_dic['option']['sourceNode']
    request_worker_ip = agentsInfo[t_sourceNode]['pod_ip']

    if request_worker_ip == None :
        return -1
    else :
        print("request_worker_ip", request_worker_ip)

    temp_dic = get_near_nodes_latency_from_worker_agent(request_worker_ip, str(lDefine.WORKER_SERVICE_PORT),
                       lDefine.NEAR_NODES_LOW_LATENCY_PATH, lDefine.NETWORK_PING_SIZE, lDefine.NETWORK_PING_COUNT)
    print("tempdic : ",temp_dic)
    if temp_dic == None :
        return -1
    
    sorted_availe_nodes = get_sorted_available_nodes_low_latency(available_nodes, temp_dic)
    print('sorted_availe_nodes : ', sorted_availe_nodes)
    for t_node in sorted_availe_nodes :
        print('t_node : ', t_node)
        print('temp_namespace : ', temp_namespace)
        try:
            result = scheduler(event['object'].metadata.name, t_node, t_namespace=temp_namespace)
            print('result : ',result)
            if result :
                print("local_lowlatency_schduler completed")
                break
        except client.rest.ApiException as e:
            print("local_lowlatency_schduler uncompleted")
            print (json.loads(e.body)['message'])
        continue

'''------------------------------------------------
  local schduler : most requested loop
------------------------------------------------'''
def get_sorted_available_nodes_most_requested(ready_nodes) :

    node_resource_usage = {}
    for node_name in ready_nodes :
        temp_status = v1.read_node_status(node_name)
        allocatable_cpu = quantity.parse_quantity(temp_status.status.allocatable["cpu"])
        allocatable_memory = quantity.parse_quantity(temp_status.status.allocatable["memory"])
        
        node_resource_usage[node_name] = {"used": {"cpu": 0, "memory": 0},  "available": {
            "cpu": allocatable_cpu, "memory": allocatable_memory}}
    
    res_pods = v1.list_pod_for_all_namespaces(pretty=True)
    for i in res_pods.items:
        for j in i.spec.containers:
            if j.resources.requests or j.resources.limits:
                if i.spec.node_name in ready_nodes:
                    if "cpu" in j.resources.requests :
                        node_resource_usage[i.spec.node_name]["used"]["cpu"] += quantity.parse_quantity(j.resources.requests["cpu"])
                    if "memory" in j.resources.requests :
                        node_resource_usage[i.spec.node_name]["used"]["memory"] += quantity.parse_quantity(j.resources.requests["memory"])                
    print("=============================================================================")
    print(node_resource_usage)
    print("=============================================================================")
    
    t_score_list =[]

    for temp_node in ready_nodes:
        t_score_dic ={}
        cpu_percent    = (float(node_resource_usage[temp_node]["used"]["cpu"]) /
                          float(node_resource_usage[temp_node]["available"]["cpu"]))*100
        memory_percent = (float(node_resource_usage[temp_node]["used"]["memory"]) /
                          float(node_resource_usage[temp_node]["available"]["memory"]))*100
        score =  cpu_percent + memory_percent
        t_score_dic['node_name']= temp_node
        t_score_dic['score']= score 
        t_score_list.append(t_score_dic)

    sorted_t_score_list = sorted(t_score_list, key=itemgetter('score'))
    print('sorted_t_score_list',sorted_t_score_list)    

    return_list=[]
    for temp_array in sorted_t_score_list:
        return_list.append(temp_array['node_name'])

    print("return_list : ", return_list)
    return return_list

def local_most_requested_schduler(event, sch_config_dic, temp_namespace):
    global agentsInfo
    print('sch_config_dic :', sch_config_dic)

    available_nodes = nodes_available()

    temp_dic={}
    print('available_nodes :', available_nodes)
    #get resource data 

    sorted_availe_nodes = get_sorted_available_nodes_most_requested(available_nodes)
    print('sorted_availe_nodes :', sorted_availe_nodes)
    for t_node in sorted_availe_nodes :
        print('t_node : ', t_node)
        print('temp_namespace :', temp_namespace)
        try:
            result = scheduler(event['object'].metadata.name, t_node, t_namespace=temp_namespace)
            print('result :',result)
            if result :
                print("local_most_requested_schduler completed")
                break
        except client.rest.ApiException as e:
            print("local_most_requested_schduler uncompleted")
            print (json.loads(e.body)['message'])
        continue

'''------------------------------------------------
  schduler main loop 
------------------------------------------------'''
policy_functions={ lDefine.LOW_LATENCY_POLICY  : local_lowlatency_schduler,
                   lDefine.MOST_REQUEST_POLICY : local_most_requested_schduler 
}  

def schduler_loop():
    global policy_functions
    while True :
        w = watch.Watch()
        watch_count = 0
        pending_count = 0
        #for event in w.stream(v1.list_namespaced_pod, "default"):
        for event in w.stream(v1.list_pod_for_all_namespaces):    
            if event['object'].status.phase == "Pending" and event['object'].status.conditions == None and event['object'].spec.scheduler_name == lDefine.LOCAL_SCHEDULER_NAME:
            #if event['object'].status.phase == "Pending" and event['object'].spec.scheduler_name == lDefine.LOCAL_SCHEDULER_NAME:
                try:
                    print('metadata.name', event['object'].metadata.name)
                    #print("event['object']=", event['object'])
                    temp_env = event['object'].spec.containers[0].env
                    temp_namespace = event['object'].metadata.namespace
                    print('temp_env=',temp_env)
                    if temp_env == None : 
                        print("warning : env config data was not setted")
                        continue
                    sch_config_dic = {}
                    sch_config_dic = get_schduler_config(temp_env)
                    if sch_config_dic['type'] == 'local' :
                        policy_functions[sch_config_dic['priority']](event, sch_config_dic, temp_namespace)
                    elif sch_config_dic['type'] == 'global':
                        print('global')
                    else :
                        print('not defined schedulering')
                except client.rest.ApiException as e:
                    print(json.loads(e.body)['message'])
                print('(pending_count=',pending_count, ')')
                pending_count+=1
            watch_count += 1
            print('(watch_count=', watch_count, ')')
            if event['object'].metadata.namespace == 'gedge-system' :
                print('(env_from-', event['object'].spec.containers[0].env_from, ')')
                print('(env------', event['object'].spec.containers[0].env, ')')
        print("why!!!!")

'''-------------------------------------------------------------
   - check whether worker_agent (pod) is runned  
-------------------------------------------------------------'''
if __name__ == '__main__':
    get_worker_agents_info()
    schduler_loop()