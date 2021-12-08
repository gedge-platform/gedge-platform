import socket
import quantity
from   kubernetes import client, config

try :
    config.load_incluster_config()
except:
    config.load_kube_config()

v1 = client.CoreV1Api()

def get_cluster_info(cluster_name):
    ready_nodes = []
    for n in v1.list_node().items:
        for status in n.status.conditions:
            #print("status",status)
            if status.status == "True" and status.type == "Ready":
                print("metadata.name",n.metadata.name)
                ready_nodes.append(n.metadata.name)
    print("ready_nodes : ", ready_nodes)
    
    worker_nodes_list = []
    cluster_info_dic = {}
    
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
            worker_node_dic = {}
            worker_node_dic['worker_node_name'] = node_name
            for addr in t_node_data.status.addresses :
                if addr.type ==  'InternalIP':
                    worker_node_dic['worker_node_ip'] = addr.address
            worker_nodes_list.append(worker_node_dic)
    cluster_info_dic['worker_nodes'] = worker_nodes_list

    print('cluster_info_dic',cluster_info_dic)
    return cluster_info_dic

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