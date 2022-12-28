import sys
sys.path.append('../gedef')
import GE_define as gDefine

import socket
import quantity
from   kubernetes import client, config
import GE_kubernetes as gKube
import time
import requests

try :
    config.load_incluster_config()
except:
    config.load_kube_config()

v1 = client.CoreV1Api()


'''
namespaced_services_dic
{   
    'service_name':service_name,
    'service_type':service_type,
    'access_host':access_host, 
    'access_port':access_port   
}
'''

def get_list_namespaced_services_dic(namespace=gDefine.GEDGE_SYSTEM_NAMESPACE ):
    
    return_services_list=[]
    res_services = v1.list_namespaced_service(namespace=namespace, pretty=True)
    
    for i in res_services.items:
        service_name = None
        service_type = None
        access_host  = None
        access_port  = None
        print('======================================================================================')
        print('service_name=', i.metadata.name)
        print('service_type=', i.spec.type)
        service_name = i.metadata.name
        service_type = i.spec.type
        if i.status.load_balancer.ingress :
            print('access_host=', i.status.load_balancer.ingress[0].ip)
            access_host = i.status.load_balancer.ingress[0].ip
        else :
            print('access_host= None') 
            access_host = None  
        if service_type == 'NodePort' :
            cluster_masternode_ip = None
            cluster_masternode_ip = gKube.get_cluster_masternode_ip()
            if cluster_masternode_ip != None :
                access_host = cluster_masternode_ip

            for j in i.spec.ports:
                if j.node_port :
                    print("access_port", j.node_port)
                    access_port = j.node_port
                    break
        else :

            for j in i.spec.ports:
                if j.port :
                    print("access_port", j.port)
                    access_port = j.port
                    break
        print('**************************************************************************************')

        service_dic = {'service_name':service_name,
                       'service_type':service_type,
                       'access_host':access_host, 
                       'access_port':access_port 
                      }
        return_services_list.append(service_dic)
        
    return return_services_list

def find_service_from_platform_service_list_with_k8s(namespace, service_name) :
    return_val=None
    platform_service_list = get_list_namespaced_services_dic(namespace)
    for i in platform_service_list:
        if i['service_name'] == service_name :
            return_val = i 
            return return_val 
    return return_val 

def find_service_from_platform_service_list_with_rest_api(service_name) :
    platform_service_list=[]
    return_val=None
    while(1) :
        # GET MONGODB IP & PORT BY REST API
        # until all service are ready  
        try :
            print('111111111111111111')
            res = requests.get(gDefine.PLATFORM_INFO_PREFIX+str('/platformservices'))
            print('22222222222222222222222')
        except:
            print('wait rest api service of platform info',gDefine.PLATFORM_INFO_PREFIX+str('/platformservices'))
            time.sleep(5) 
            continue
        
        if res.status_code == 200 :
            print('2')
            print('res=',res)
            data = res.json()
            print('data = ',data)
            #request_data_dic = json.loads(res.json())
            #print('request_data_dic',request_data_dic)
            platform_service_list = data['Result']
            print('platform_service_list',platform_service_list)
            break
        else :
            print('wait platform_service_list result from rest api of platform info',gDefine.PLATFORM_INFO_PREFIX+str('/platformservices'))
            time.sleep(5) 
            continue

    for i in platform_service_list:
        if i['service_name'] == service_name :
            return_val = i 
            return return_val 
    return return_val 
    
def get_host_and_port_from_namespaced_services_by_service_name(namespace,service_name ):
    return_services_list = get_list_namespaced_services_dic(namespace)
    for i in return_services_list:
        if i['service_name'] == service_name :
            return i['access_host'], i['access_port']
    return None, None
'''
namespaced_services_dic
{   
    'node_name':node_name,
    'node_ip':node_ip
}
'''
def get_worker_nodes_dic():
    list_worker_node = []
    ret = v1.list_node(watch=False)
    for node in ret.items:
        address_list = node.status.addresses
        for temp_address in address_list:
            if temp_address.type == 'InternalIP':
                print("get_list_worker_node",temp_address.address)
                node_dic = {}
                #node_dic["uid"] = node.metadata.uid
                node_dic['node_name'] = node.metadata.name
                node_dic['node_ip'] = temp_address.address
                list_worker_node.append(node_dic)
    return list_worker_node    

'''
{
    cluster_name : c1,
    cluster_ip   : ip,
    cluster_type: baremetal/cloud,
    nodes: [ n1, n2 ] 
}
'''
def get_cluster_info_dic_with_k8s(cluster_name,cluster_type):
    ready_nodes = []
    for n in v1.list_node().items:
        for status in n.status.conditions:
            #print("status",status)
            if status.status == "True" and status.type == "Ready":
                print("metadata.name",n.metadata.name)
                ready_nodes.append(n.metadata.name)
    print("ready_nodes : ", ready_nodes)
    cluster_info_dic = {}
    
    cluster_info_dic['cluster_type'] = cluster_type 
    cluster_info_dic['cluster_name'] = cluster_name 
    nodes_list = []
    for node_name in ready_nodes :
        nodes_list.append(node_name)
    cluster_info_dic['nodes'] = nodes_list   
    
    for node_name in ready_nodes :
        t_node_data = v1.read_node(node_name)
        print(t_node_data.metadata.labels)
        if 'node-role.kubernetes.io/master' in t_node_data.metadata.labels :
            print(node_name, 'is master node')
            print('status.addresses',t_node_data.status.addresses)
            for addr in t_node_data.status.addresses :
                if addr.type == 'InternalIP' :
                    cluster_masternode_ip = addr.address
                    cluster_info_dic['cluster_ip']=cluster_masternode_ip
                    break
        else :
            continue

    return cluster_info_dic

'''
{ 
    node_id : ‘c1:n1’
    node_type: master/worker
    node_name: n1,
    node_host: host1,
    node_labels: [l1,l2],  
    request : {
        nvidia.com/gpu: 1.0,
        cpu : 0.05
        memory: 1004
    },  
    limits : {
        nvidia.com/gpu: 1.0,
        cpu : 0.05          
    },      
    capacity : {
        cpu : 0.05          
        nvidia.com/gpu: 1.0,
        pods:110.0 
    },
    allocatable : {
        cpu : 0.05          
        nvidia.com/gpu: 1.0,
        pods:110.0 
    }
}
'''
'''        
    for node_name in ready_nodes :
        t_node_data = v1.read_node(node_name)
        print(t_node_data.metadata.labels)
        if 'node-role.kubernetes.io/master' in t_node_data.metadata.labels :
            print(node_name, 'is master node')
            cluster_info_dic['cluster_name'] = cluster_name 
            print(t_node_data.status.addresses)
            for addr in t_node_data.status.addresses :
                if addr.type ==  'InternalIP':
                    cluster_info_dic['cluster_ip'] = addr.address
                elif addr.type == 'Hostname' :
                    cluster_info_dic['host_name'] = addr.address
        else :
            print(node_name, 'is worker node')
            node_dic = {}
            node_dic['worker_node_name'] = node_name
            for addr in t_node_data.status.addresses :
                if addr.type ==  'InternalIP':
                    node_dic['worker_node_ip'] = addr.address
            nodes_list.append(node_dic)
    cluster_info_dic['worker_nodes'] = worker_nodes_list

    print('cluster_info_dic',cluster_info_dic)
    return cluster_info_dic
'''
def get_hostnode_info():
    return_dic = {}
    ## getting the hostname by socket.gethostname() method
    hostname = socket.gethostname()
    ## getting the IP address using socket.gethostbyname() method
    #ip_address = socket.gethostbyname(hostname)
    ip_address = socket.gethostbyname(socket.getfqdn())
    ## printing the hostname and ip_address
    try:
        return_dic["hostname"] = hostname
        return_dic["ip_address"] = ip_address
        print("Hostname:", hostname)
        print("IP Address:", ip_address)
    except:
        return None
    return return_dic

def get_cluster_resource_status():
    '''-------------------------------------------------
    result: {'cpu':90 ,'memory':87, 'memory_szie_mbyte':12000, 'score': 177 }
    ---------------------------------------------------'''
    ready_nodes = []
    
    for n in v1.list_node().items:
        for status in n.status.conditions:
            print("status",status)
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
    print("=============================================================================")
    print(node_resource_usage)
    print("=============================================================================")
    
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
    
    total_cpu_percent = 0.0
    total_memory_percent = 0.0    
    total_available_memory = 0.0
    for temp_node in ready_nodes:
        cpu_percent    = (float(node_resource_usage[temp_node]["used"]["cpu"]) /
                          float(node_resource_usage[temp_node]["available"]["cpu"]))*100
        memory_percent = (float(node_resource_usage[temp_node]["used"]["memory"]) /
                          float(node_resource_usage[temp_node]["available"]["memory"]))*100
        print('cpu_percent',cpu_percent)                          
        print('memory_percent',memory_percent) 
        total_cpu_percent      += cpu_percent
        total_memory_percent   += memory_percent
        total_available_memory += float(node_resource_usage[temp_node]["available"]["memory"])
    
    print('total_cpu_percent',total_cpu_percent)                          
    print('total_memory_percent',total_memory_percent) 
    cluster_cpu_percent    = total_cpu_percent/len(ready_nodes) 
    cluster_memory_percent = total_memory_percent/len(ready_nodes) 
    total_score            = cluster_cpu_percent + cluster_memory_percent
    print('cluster_cpu_percent',cluster_cpu_percent)
    print('cluster_memory_percent',cluster_memory_percent)
    print('total_available_memory',total_available_memory)
    result = {'cpu':cluster_cpu_percent ,'memory':cluster_memory_percent, 'memory_szie_mbyte':total_available_memory, 'score': total_score }
    print("=============================================================================")
    print('result',result)        
    print("=============================================================================")
    return result