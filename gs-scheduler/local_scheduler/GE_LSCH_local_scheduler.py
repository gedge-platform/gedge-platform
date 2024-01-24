#!/usr/bin/env python
import sys
sys.path.append('../gelib')
sys.path.append('../gedef')

import time
import socket
import random
import json
from   pprint import pprint
from   kubernetes import client, config, watch
from   kubernetes.client.rest import ApiException

import GE_kubernetes as gKube
import GE_define as gDefine
import GE_LSCH_define as lDefine

import quantity
import requests

from   GE_redis import redisController
from   operator import itemgetter

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

def get_available_nodes(filter):
    '''-------------------------------------------------
       the filter of object 
     ----------------------------------------------------
    filter= { 'node_name' : 'n1', 
              'node_selector' : {'key':'value' },
              'persistent_volume_claim': [ {'claim_name': 'test-gedge-claim', 'read_only': None},
                                           {'claim_name': 'test-gedge-claim', 'read_only': None}
                                         ]  
              'sum_resources': { 'cpu': '500m','memory': '128Mi','nvidia.com/gpu': '1'}
            }
    ---------------------------------------------------'''

    '''-------------------------------------------------
    structure of node_resource_usage
    ----------------------------------------------------
    node_resource_usage = {
        "master-node":{
            "used":{"cpu":0,"memory":0,'nvidia.com/gpu':0},
            "available":{"cpu":1,"memory":1,'nvidia.com/gpu':1}
        }
    }
    ---------------------------------------------------'''
    ready_nodes = []
    return_available_nodes = []
    
    for n in v1.list_node().items:
        #print("##########################################")
        #print("[list_node]->n",n)
        #print("##########################################")
        for status in n.status.conditions:
            #print("status",status)
            if status.status == "True" and status.type == "Ready":
                print("metadata.name",n.metadata.name)
                ready_nodes.append(n.metadata.name)
    print("ready_nodes : ", ready_nodes)

    if len(ready_nodes) <= 0 :
        return return_available_nodes
    
    available_nodes = ready_nodes
    '''-------------------------------------------------
            check pvc
    ---------------------------------------------------'''
    if len(filter['persistent_volume_claim']) > 0 :
        list_filter_pvc = []
        for pvc in filter['persistent_volume_claim'] :
            list_filter_pvc.append(pvc['claim_name'])
        
        list_cluster_pvc = []
        pvcs = v1.list_persistent_volume_claim_for_all_namespaces(watch=False)
        for pvc in pvcs.items:
            list_cluster_pvc.append(pvc.metadata.name)

        # intersection filter pvc and cluster pvc
        list_intersec_pvc = list(set(list_filter_pvc).intersection(list_cluster_pvc))

        if list_intersec_pvc != list_filter_pvc : 
            return return_available_nodes
    print("return_available_nodes/check pvc :", return_available_nodes,available_nodes)
    '''-------------------------------------------------
            check node_name 
    ---------------------------------------------------'''
    if filter['node_name'] :
        for node_name in available_nodes :
            if node_name == filter['node_name'] :
                return_available_nodes.append(node_name)
                print("return_available_nodes :", return_available_nodes)
                break
        if len(return_available_nodes) == 0 :
            return return_available_nodes
        else:
            available_nodes = return_available_nodes
    print("return_available_nodes/check node_name  :", return_available_nodes,available_nodes)
    '''-------------------------------------------------
            check node selector
    ---------------------------------------------------'''
    if filter['node_selector'] != None :
        for node_name in available_nodes :
            t_status = v1.read_node_status(node_name)
            is_all_has_key_value = True
            for t_key in list(filter['node_selector'].keys()) :
                print('1',t_key)
                if t_key in t_status.metadata.labels and filter['node_selector'][t_key] == t_status.metadata.labels[t_key] :
                    print('2',t_key)
                else : 
                    is_all_has_key_value = False
            if node_name not in return_available_nodes and is_all_has_key_value == True :
                print('3',node_name)
                return_available_nodes.append(node_name)
        print("return_available_nodes :", return_available_nodes)
        available_nodes = return_available_nodes
    print("return_available_nodes/check node selector  :", return_available_nodes,available_nodes)
    '''-------------------------------------------------
            check resources
    ---------------------------------------------------'''
    node_resource_usage = {}
    for node_name in ready_nodes :
        t_status = v1.read_node_status(node_name)
        #print('(t_status.status',t_status.status)
        allocatable_cpu = quantity.parse_quantity(t_status.status.allocatable["cpu"])
        allocatable_memory = quantity.parse_quantity(t_status.status.allocatable["memory"])
        if "nvidia.com/gpu" in t_status.status.allocatable : 
            allocatable_gpu = int(t_status.status.allocatable['nvidia.com/gpu'])
        else :
            allocatable_gpu = 0
        node_resource_usage[node_name] = {'used'     : {'cpu': 0, 'memory': 0,'nvidia.com/gpu':0},  
                                          'available': {'cpu': allocatable_cpu,'memory': allocatable_memory,'nvidia.com/gpu':allocatable_gpu}
                                         }
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
                    if "nvidia.com/gpu" in j.resources.requests :
                        node_resource_usage[i.spec.node_name]["used"]["nvidia.com/gpu"] += int(j.resources.requests["nvidia.com/gpu"])                   
    
    print("=============================================================================")
    print(node_resource_usage)
    print("=============================================================================")
    print("=============================================================================")
    print(filter)
    print("=============================================================================")
    
    for temp_node in available_nodes:
        left_cpu = node_resource_usage[temp_node]["available"]["cpu"] - (node_resource_usage[temp_node]["used"]["cpu"] + filter['sum_resources']['cpu'] )
        left_memory = node_resource_usage[temp_node]["available"]["memory"] - (node_resource_usage[temp_node]["used"]["memory"] + filter['sum_resources']['memory'] )
        left_gpu = node_resource_usage[temp_node]["available"]["nvidia.com/gpu"] - (node_resource_usage[temp_node]["used"]["nvidia.com/gpu"] + filter['sum_resources']['nvidia.com/gpu'] )
        print('cpu:{0}:memory:{1}:gpu:{2}'.format(left_cpu,left_memory,left_gpu))
        if left_cpu >= 0  and left_memory >= 0  and left_gpu >= 0  : 
            if temp_node not in return_available_nodes :
                return_available_nodes.append(temp_node)
    print("return_available_nodes/check resources  :", return_available_nodes,available_nodes)
    return return_available_nodes

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
    res  = v1.create_namespaced_binding(namespace=t_namespace, body=body, _preload_content=False)
    print('status',res.status)
    res_data = json.loads(res.data)
    print('res_data',res_data)
    return res_data['status']

def scheduler_new_version(filter,t_object, t_node, t_namespace="default"):
    print('t_object',t_object)
    print('t_object.status.conditions',t_object.status.conditions)
    
    if filter['node_name'] != None :
        try :
            target = client.V1ObjectReference()
            target.kind = "Node"
            target.apiVersion = "v1"
            target.name = t_node
            meta = client.V1ObjectMeta()
            meta.name = t_object.metadata.name
            body = client.V1Binding(target=target, metadata=meta)
            return True
        except ApiException  as e:
            print ("Exception when calling client.V1Binding %s\n" % e)
            return False
    else :
        target = client.V1ObjectReference()
        target.kind = "Node"
        target.apiVersion = "v1"
        target.name = t_node
        meta = client.V1ObjectMeta()
        meta.name = t_object.metadata.name
        body = client.V1Binding(target=target, metadata=meta)
        try: 
            res  = v1.create_namespaced_binding(namespace=t_namespace, body=body, _preload_content=False)
            if res:
                # print 'POD '+name+' scheduled and placed on '+node
                return True
        except ApiException  as e:
            print ("Exception when calling CoreV1Api->create_namespaced_binding: %s\n" % e)
            #print('type e:',type(e))
            print('e.reason:',e.reason )
            if e.reason =='Conflict' :
                return True
            return False
    return False

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
        return response_dic['result']
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

def get_request_filter_from_pending_object(event_object):
    '''
    filter= { 'node_name' : 'n1', 
              'node_selector' : {'key':'value' },
              'persistent_volume_claim': [ {'claim_name': 'test-gedge-claim', 'read_only': None},
                                           {'claim_name': 'test-gedge-claim', 'read_only': None}
                                         ]  
              'sum_resources': { 'cpu': '500m',
                                 'memory': '128Mi',
                                 'nvidia.com/gpu': '1'}
            }
    '''
    return_filter = {}

    return_filter['node_name']               = event_object.spec.node_name
    return_filter['node_selector']           = event_object.spec.node_selector
    return_filter['persistent_volume_claim'] = []
    for v in event_object.spec.volumes :
        print('type(v)=',type(v))
        v_dic = v.to_dict()
        print('v_dic=',v_dic)
        if v_dic['persistent_volume_claim'] != None :
           return_filter['persistent_volume_claim'].append(v_dic['persistent_volume_claim'])
        else:
            print('4')
            continue
    
    return_filter['sum_resources'] = {'cpu': 0,'memory': 0,'nvidia.com/gpu': 0}

    for c in event_object.spec.containers :
        if c.resources.limits:
            if 'cpu' in c.resources.limits :
                return_filter['sum_resources']['cpu'] += quantity.parse_quantity(c.resources.limits['cpu'])
            if 'memory' in c.resources.limits :
                return_filter['sum_resources']['memory'] += quantity.parse_quantity(c.resources.limits['memory'])
            if 'nvidia.com/gpu' in c.resources.limits :
                return_filter['sum_resources']['nvidia.com/gpu'] += int(c.resources.limits['nvidia.com/gpu'])
        elif c.resources.requests :
            if 'cpu' in c.resources.requests :
                return_filter['sum_resources']['cpu'] += quantity.parse_quantity(c.resources.requests['cpu'])
            if 'memory' in c.resources.requests :
                return_filter['sum_resources']['memory'] += quantity.parse_quantity(c.resources.requests['memory'])
            if 'nvidia.com/gpu' in c.resources.requests :
                return_filter['sum_resources']['nvidia.com/gpu'] += int(c.resources.requests['nvidia.com/gpu'])
                
    print('return_filter =',return_filter)
    return return_filter


def local_lowlatency_schduler(event, sch_config_dic, temp_namespace):
    global agentsInfo
    print('sch_config_dic :', sch_config_dic)
    print("source_node : ", sch_config_dic['option']['source_node'])

    #print('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^')    
    #print('event[object] => ',event['object'])    
    #print('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^') 
    #print('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^')    
    #print('event[object].spec => ',event['object'].spec)    
    #print('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^')   
    #print('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^')    
    #print('event[object].spec.node_selector => ',event['object'].spec.node_selector)    
    #print('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^')  
    #print('=================================================')    
    #print('event[object].spec.containers=> ',event['object'].spec.containers)    
    #print('=================================================')    
    #print('=================================================')    
    #print('event[object]spec.containers[0].resources => ',event['object'].spec.containers[0].resources)    
    #print('=================================================')
    t_filter = get_request_filter_from_pending_object(event['object'])
    print('t_filter',t_filter)
    available_nodes = get_available_nodes(t_filter)
    temp_dic={}
    print('available_nodes : ', available_nodes)
    # call request network data  to worker_agent  
    #print('sch_config_dic=======================', sch_config_dic)
    t_source_node = sch_config_dic['option']['source_node']
    request_worker_ip = agentsInfo[t_source_node]['pod_ip']

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
    
    if len(sorted_availe_nodes) <= 0 :
        gKube.ge_delete_namespaced_pod(event['object'].metadata.name,temp_namespace)
        print('!!!!!!!!!!!!!!!!!delete pod')
    
    for t_node in sorted_availe_nodes :
        print('t_node : ', t_node)
        print('temp_namespace : ', temp_namespace)
        try:
            result = scheduler_new_version(t_filter, event['object'], t_node, t_namespace=temp_namespace)
            print('result :',result)
            if result :
                print("local_lowlatency_schduler completed")
                break
            else :
                print("need to delete object")
                break
        except client.rest.ApiException as e:
            print("local_lowlatency_schduler uncompleted")
            print (json.loads(e.body)['message'])
            print("need to delete object")
        continue

'''------------------------------------------------
  local schduler : most requested loop
------------------------------------------------'''
def get_sorted_available_nodes_most_requested(filter, ready_nodes) :

    node_resource_usage = {}
    for node_name in ready_nodes :
        t_status = v1.read_node_status(node_name)
        allocatable_cpu = quantity.parse_quantity(t_status.status.allocatable["cpu"])
        allocatable_memory = quantity.parse_quantity(t_status.status.allocatable["memory"])
        if "nvidia.com/gpu" in t_status.status.allocatable : 
            allocatable_gpu = int(t_status.status.allocatable['nvidia.com/gpu'])
        else :
            allocatable_gpu = 0
        node_resource_usage[node_name] = {'used'     : {'cpu': 0, 'memory': 0,'nvidia.com/gpu':0},  
                                          'available': {'cpu': allocatable_cpu,'memory': allocatable_memory,'nvidia.com/gpu':allocatable_gpu}
                                         }
   
    res_pods = v1.list_pod_for_all_namespaces(pretty=True)
    for i in res_pods.items:
        for j in i.spec.containers:
            if j.resources.requests or j.resources.limits:
                if i.spec.node_name in ready_nodes:
                    if "cpu" in j.resources.requests :
                        node_resource_usage[i.spec.node_name]["used"]["cpu"] += quantity.parse_quantity(j.resources.requests["cpu"])
                    if "memory" in j.resources.requests :
                        node_resource_usage[i.spec.node_name]["used"]["memory"] += quantity.parse_quantity(j.resources.requests["memory"])   
                    if "nvidia.com/gpu" in j.resources.requests :
                        node_resource_usage[i.spec.node_name]["used"]["nvidia.com/gpu"] += int(j.resources.requests["nvidia.com/gpu"])               
    print("=============================================================================")
    print(node_resource_usage)
    print("=============================================================================")
    
    t_score_list =[]

    for temp_node in ready_nodes:
        t_score_dic ={}
        cpu_percent    = (float(node_resource_usage[temp_node]["used"]["cpu"]) /
                          float(node_resource_usage[temp_node]["available"]["cpu"])) * 100
        memory_percent = (float(node_resource_usage[temp_node]["used"]["memory"]) /
                          float(node_resource_usage[temp_node]["available"]["memory"])) * 100
        
        left_gpu_count = node_resource_usage[temp_node]["available"]["nvidia.com/gpu"] - node_resource_usage[temp_node]["used"]["nvidia.com/gpu"] 
       
        if filter['sum_resources']['nvidia.com/gpu'] > 0 :
            score =  (100 - cpu_percent) + (100 - memory_percent) + (left_gpu_count * lDefine.MOST_REQUEST_POLICY_GPU_COST_WEIGHT)
        else :
            score =  (100 - cpu_percent) + (100 - memory_percent)
            
        t_score_dic['node_name']= temp_node
        t_score_dic['score']= score 
        t_score_list.append(t_score_dic)

    sorted_t_score_list = sorted(t_score_list, key=itemgetter('score'),reverse=True)
    print('sorted_t_score_list',sorted_t_score_list)    

    return_list=[]
    for temp_array in sorted_t_score_list:
        return_list.append(temp_array['node_name'])

    print("return_list : ", return_list)
    return return_list

def local_most_requested_schduler(event, sch_config_dic, temp_namespace):
    global agentsInfo
    print('sch_config_dic :', sch_config_dic)

    t_filter = get_request_filter_from_pending_object(event['object'])
    available_nodes = get_available_nodes(t_filter)
    

    temp_dic={}
    print('available_nodes :', available_nodes)
    #get resource data 
    sorted_availe_nodes = get_sorted_available_nodes_most_requested(t_filter, available_nodes)
    print('sorted_availe_nodes :', sorted_availe_nodes)
    if len(sorted_availe_nodes) <= 0 :
        #time.sleep(5)
        gKube.ge_delete_namespaced_pod(event['object'].metadata.name,temp_namespace)
        print('!!!!!!!!!!!!!!!!!delete pod')
        
    for t_node in sorted_availe_nodes :
        print('t_node : ', t_node)
        print('temp_namespace :', temp_namespace)
        try:
            result = scheduler_new_version(t_filter, event['object'], t_node, t_namespace=temp_namespace)
            print('result :',result)
            if result :
                print("local_most_requested_schduler completed")
                break
            else :
                print("need to delete object")
                break
        except client.rest.ApiException as e:
            print("local_most_requested_schduler uncompleted")
            print (json.loads(e.body)['message'])
            print("need to delete object")
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
        for event in w.stream(v1.list_pod_for_all_namespaces):    
            if event['object'].status.phase == "Pending" and event['object'].status.conditions == None and event['object'].spec.scheduler_name == gDefine.LOCAL_SCHEDULER_NAME:
                try:
                    print('metadata.name', event['object'].metadata.name)
                    #print("event['object']=", event['object'])
                    temp_env = event['object'].spec.containers[0].env
                    temp_namespace = event['object'].metadata.namespace
                    print('temp_env=',temp_env)
                    if temp_env == None : 
                        print("warning : env config data was not setted")
                        continue
                    sch_config_dic = get_schduler_config(temp_env)
                    if sch_config_dic['scope'] == 'local' :
                        print('local')
                        policy_functions[sch_config_dic['priority']](event, sch_config_dic, temp_namespace)
                    elif sch_config_dic['scope'] == 'global':
                        print('global')
                    else :
                        print('not defined schedulering')
                except client.rest.ApiException as e:
                    print(json.loads(e.body)['message'])
                print('(pending_count=',pending_count, ')')
                pending_count+=1
            watch_count += 1
            print('(watch_count=', watch_count, ')')
            if event['object'].metadata.namespace == gDefine.GEDGE_SYSTEM_NAMESPACE :
                print('(env_from-', event['object'].spec.containers[0].env_from, ')')
                print('(env------', event['object'].spec.containers[0].env, ')')
        print("why!!!!")

'''-------------------------------------------------------------
   - check whether worker_agent (pod) is runned  
-------------------------------------------------------------'''
if __name__ == '__main__':
    get_worker_agents_info()
    schduler_loop()