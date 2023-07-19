import sys
sys.path.append('../gedef')
import GE_define as gDefine

import socket
import quantity
from   kubernetes import client, config
import GE_kubernetes as gKube
import time
import requests
from   operator import itemgetter
import datetime
try :
    config.load_incluster_config()
except:
    config.load_kube_config()

v1 = client.CoreV1Api()


'''
namespaced_services_dic
{   
    'namespace':namespace_name,
    'service_name':service_name,
    'service_type':service_type,
    'access_host':access_host, 
    'access_port':access_port   
}
'''

def get_list_namespaced_services_with_k8s(namespace=gDefine.GEDGE_SYSTEM_NAMESPACE ):
    
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

        service_dic = {'namespace' : namespace,
                       'service_name':service_name,
                       'service_type':service_type,
                       'access_host':access_host, 
                       'access_port':access_port 
                      }
        return_services_list.append(service_dic)
        
    return return_services_list

def find_service_from_platform_service_list_with_k8s(namespace, service_name) :
    return_val=None
    platform_service_list = get_list_namespaced_services_with_k8s(namespace)
    for i in platform_service_list:
        if i['service_name'] == service_name :
            return_val = i 
            return return_val 
    return return_val 

def find_platform_namespaced_service_with_rest_api(namespace,service_name):
    return_val=None
    while(1) :
        # GET MONGODB IP & PORT BY REST API
        # until all service are ready  
        try :
            print('111111111111111111')
            res = requests.get(gDefine.PLATFORM_INFO_PREFIX+str('/platformServices/namespace/')+str(namespace)+str('/service/')+str(service_name))
            print('22222222222222222222222')
        except:
            print('wait rest api service of platform info',gDefine.PLATFORM_INFO_PREFIX+str('/platformServices/namespace/')+str(namespace)+str('/service/')+str(service_name))
            time.sleep(5) 
            continue
        
        if res.status_code == 200 :
            print('2')
            print('res=',res)
            data = res.json()
            print('data = ',data)
            #request_data_dic = json.loads(res.json())
            #print('request_data_dic',request_data_dic)
            return_val = data['Result']
            print('return_val',return_val)
            break
        else :
            print('wait platform_service_list result from rest api of platform info',gDefine.PLATFORM_INFO_PREFIX+str('/platformServices'))
            time.sleep(5) 
            continue
    return return_val 
    
    
def get_host_and_port_from_namespaced_services_by_service_name(namespace,service_name ):
    return_services_list = get_list_namespaced_services_with_k8s(namespace)
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

'''-----------------------------------------------
             CLUSTER INFO {
                cluster_name : c1,
                cluster_ip   : ip,
                cluster_type: baremetal/cloud,
                nodes: [n1,n2,n3],
                cdate : cd1 
            }
    -----------------------------------------------''' 
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
    cluster_info_dic['cluster_name'] = cluster_name 
    cluster_info_dic['cluster_type'] = cluster_type 
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
    cluster_info_dic['cdate'] = datetime.datetime.now()
    return cluster_info_dic


def get_nodes_info_dic_with_k8s(cluster_name):        

    '''
    nodes_resource_status = { 
        'node_name' : {
            'requests'   : { 'cpu' :0 ,'memory': 0, 'nvidia.com/gpu':0},  
            'limits'     : { 'cpu' :0 ,'memory': 0, 'nvidia.com/gpu':0},  
            'capacity'   : { 'cpu' :0 ,'memory': 0, 'nvidia.com/gpu':0},  
            'allocatable': { 'cpu' :0 ,'memory': 0, 'nvidia.com/gpu':0}
        },
        'node_name2' : {
            'requests'   : { 'cpu' :0 ,'memory': 0, 'nvidia.com/gpu':0},  
            'limits'     : { 'cpu' :0 ,'memory': 0, 'nvidia.com/gpu':0},  
            'capacity'   : { 'cpu' :0 ,'memory': 0, 'nvidia.com/gpu':0},  
            'allocatable': { 'cpu' :0 ,'memory': 0, 'nvidia.com/gpu':0}
        }  
    }
    '''
    '''
    node_info_dic = { 
        node_id : ‘c1:n1’
        node_type: master/worker
        node_name: n1,
        cluster_name: c1,
        node_host: host1,
        node_labels: [l1,l2],  
        requests : {
            cpu : 0.0,
            memory: 0.0,
            nvidia.com/gpu: 1
        },  
        limits : {
            cpu : 0.0,
            memory: 0.0,
            nvidia.com/gpu: 1          
        },      
        capacity : {
            cpu : 0.0,
            memory: 0.0,
            nvidia.com/gpu: 1             
        },
        allocatable : {
            cpu : 0.0,
            memory: 0.0,
            nvidia.com/gpu: 1
        }
    }
    '''
    
    node_info_dic_list = []
    
    nodes_resource_status={}
    node_info_dic={}
    
    pod_list = v1.list_pod_for_all_namespaces(pretty=True)
    for p in pod_list.items:
        
        node_name = p.spec.node_name
        if node_name not in nodes_resource_status:
            nodes_resource_status[node_name]             = {}
            nodes_resource_status[node_name]['requests'] = {'cpu' :0, 'memory':0, 'nvidia.com/gpu':0}
            nodes_resource_status[node_name]['limits']   = {'cpu' :0, 'memory':0, 'nvidia.com/gpu':0}
        for c in p.spec.containers:
            if c.resources.requests :
                if 'cpu' in c.resources.requests :
                    nodes_resource_status[node_name]['requests']['cpu'] += float(quantity.parse_quantity(c.resources.requests['cpu']))
                if 'memory' in c.resources.requests :
                    nodes_resource_status[node_name]['requests']['memory'] += float(quantity.parse_quantity(c.resources.requests['memory']))
                if 'nvidia.com/gpu' in c.resources.requests :
                    nodes_resource_status[node_name]['requests']['nvidia.com/gpu'] += int(c.resources.requests['nvidia.com/gpu'])    
            if c.resources.limits :
                if 'cpu' in c.resources.limits :
                    nodes_resource_status[node_name]['limits']['cpu'] +=  float(quantity.parse_quantity(c.resources.limits['cpu']))
                if 'memory' in c.resources.limits :
                    nodes_resource_status[node_name]['limits']['memory'] += float( quantity.parse_quantity(c.resources.limits['memory']))
                if 'nvidia.com/gpu' in c.resources.limits :
                    nodes_resource_status[node_name]['limits']['nvidia.com/gpu'] += int(c.resources.limits['nvidia.com/gpu'])
    
    node_list = v1.list_node(watch=False)
    for node in node_list.items:
        
        node_info_dic={}
        node_info_dic['cluster_name'] = cluster_name 
        node_info_dic['node_id'] = cluster_name + ':' + node.metadata.name    
        labels = node.metadata.labels
        node_info_dic['node_labels'] = labels

        if 'node-role.kubernetes.io/master' in labels:
            node_info_dic['node_type'] = 'master'
        else :
            node_info_dic['node_type'] = 'worker'
        
        node_info_dic['node_name'] = node.metadata.name            
        
        node_info_dic['node_host'] = None
        address_list = node.status.addresses
        for temp_address in address_list:
            if temp_address.type == 'InternalIP':
                node_info_dic['node_host'] = temp_address.address
        
        node_info_dic['capacity']={'cpu':0,'memory':0,'nvidia.com/gpu':0 }
        if 'cpu' in node.status.capacity :
            node_info_dic['capacity']['cpu'] = float(quantity.parse_quantity(node.status.capacity['cpu']))
        if 'memory' in node.status.capacity :
            node_info_dic['capacity']['memory'] = float(quantity.parse_quantity(node.status.capacity['memory']))
        if 'nvidia.com/gpu' in node.status.capacity :
            node_info_dic['capacity']['nvidia.com/gpu'] = int(node.status.capacity['nvidia.com/gpu']) 
       
        node_info_dic['allocatable']={'cpu':0,'memory':0,'nvidia.com/gpu':0 }
        if 'cpu' in node.status.allocatable :
            node_info_dic['allocatable']['cpu'] = float(quantity.parse_quantity(node.status.allocatable['cpu'])) 
        if 'memory' in node.status.allocatable :
            node_info_dic['allocatable']['memory'] = float(quantity.parse_quantity(node.status.allocatable['memory'])) 
        if 'nvidia.com/gpu' in node.status.allocatable :
            node_info_dic['allocatable']['nvidia.com/gpu'] = int(node.status.allocatable['nvidia.com/gpu']) 
        try :
            node_info_dic['requests'] = nodes_resource_status[node.metadata.name]['requests']
            node_info_dic['limits']   = nodes_resource_status[node.metadata.name]['requests']
        except:
            node_info_dic['requests'] = None
            node_info_dic['limits']   = None    
       
        node_info_dic_list.append(node_info_dic)
    print('node_info_dic_list',node_info_dic_list)
    return node_info_dic_list
        
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


    