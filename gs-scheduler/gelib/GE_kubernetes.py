import sys
sys.path.append('../gelib')
sys.path.append('../gedef')
import GE_define as gDefine
import GE_util as gUtil
from kubernetes import client, config, watch
from kubernetes.client.rest import ApiException

import ast

try :
    config.load_incluster_config()
except:
    config.load_kube_config()
    
v1 = client.CoreV1Api()

def find_node_port_by_service_name(service_name):
    res_services = v1.list_service_for_all_namespaces(pretty=True)
    for i in res_services.items:
        #print(i.metadata.name)
        if i.metadata.name == service_name:
            print("service_name", service_name)
            for j in i.spec.ports:
                print("i.spec.ports",j)
                #if j.node_port:
                #    print("j.node_port", j.node_port)
                #    return j.node_port
                if j.port:
                    print("j.port", j.port)
                    return j.port
    return None

def find_external_ip_by_service_name(service_name):
    res_services = v1.list_service_for_all_namespaces(pretty=True)
    for i in res_services.items:
        if i.metadata.name == service_name:
            print("service_name", service_name)
            #print("i.status", i.status)
            if i.status.load_balancer.ingress[0].ip :
                print("external ip", i.status.load_balancer.ingress[0].ip)
                return i.status.load_balancer.ingress[0].ip
    return None


def find_host_ip_by_pod_name(pod_name):
    res_pods = v1.list_pod_for_all_namespaces(pretty=True)
    for i in res_pods.items:
        if i.metadata.name == pod_name:
            if i.status.host_ip:
                return i.status.host_ip
    return None

def get_hostname_by_pod_name(pod_name):
    res_pods = v1.list_pod_for_all_namespaces(pretty=True)
    for i in res_pods.items:
        if i.metadata.name == pod_name:
            print("get_hostname_by_pod_name", i.status)
            if i.spec.node_name:
                print("get_hostname_by_pod_name :node_name= ", i.spec.node_name)
                return i.spec.node_name
    return None

def get_hostname_by_namespaced_pod_name(namespace_name,pod_name):
    res_pods = v1.list_namespaced_pod(namespace = namespace_name)
    for i in res_pods.items:
        if i.metadata.name == pod_name:
            print("get_hostname_by_pod_name", i.status)
            if i.spec.node_name:
                print("get_hostname_by_pod_name :node_name= ", i.spec.node_name)
                return i.spec.node_name
    return None

def get_hostname_by_host_ip(host_ip):
    print("get_hostname_by_host_ip host_ip: ", host_ip)
    ret = v1.list_node(watch=False)
    for node in ret.items:
        address_list = node.status.addresses
        for temp_address in address_list:
            print("get_hostname_by_host_ip node.status.addresses: ", temp_address)
            if temp_address.type == 'InternalIP':
                print("get_hostname_by_host_ip InternalIP: ", temp_address.address)
                if temp_address.address == host_ip:
                    return node.metadata.name
    return None

def get_cluster_masternode_ip():
    cluster_masternode_ip = None
    ready_nodes = []
    for n in v1.list_node().items:
        for status in n.status.conditions:
            #print("status",status)
            if status.status == "True" and status.type == "Ready":
                print("metadata.name",n.metadata.name)
                ready_nodes.append(n.metadata.name)
    print("ready_nodes : ", ready_nodes)
    
    for node_name in ready_nodes :
        t_node_data = v1.read_node(node_name)
        print(t_node_data.metadata.labels)
        if 'node-role.kubernetes.io/master' in t_node_data.metadata.labels :
            print(node_name, 'is master node')
            print('status.addresses',t_node_data.status.addresses)
            for addr in t_node_data.status.addresses :
                if addr.type == 'InternalIP' :
                    cluster_masternode_ip = addr.address
                    return cluster_masternode_ip
    return cluster_masternode_ip

def ge_delete_namespaced_pod(name, namespace) :
    try:
        api_response = v1.delete_namespaced_pod(name, namespace)
        #print(api_response)
    except ApiException as e:
        print("Exception when calling CoreV1Api->delete_namespaced_pod: %s\n" % e)
        
def isexist_namespace(namespace_name):
    try:
        namespace_list = v1.list_namespace().items
    except ApiException as e:
        print("Exception when calling list_namespace: %s\n" % e)
        return False
    for namespace in namespace_list:
        if namespace.metadata.name == namespace_name:
            print('found namespace:',namespace_name )
            return True
    else:
        print('can not find namespace:',namespace_name )
        return False

def create_namespace(namespace_name):
     
    if isexist_namespace(namespace_name):
        print(namespace_name,'is exist')
        return 'exist'
    else : 
        try :
            namespace = client.V1Namespace()
            metadata = client.V1ObjectMeta(name=namespace_name)
            namespace.metadata = metadata
            # Namespace를 생성합니다.
            created_namespace=v1.create_namespace(namespace)
            print("Created Namespace name:", created_namespace.metadata.name)
        except ApiException as e:
            print("Exception when create_namespace: %s\n" % e)
            return 'error'
        return namespace_name

def delete_namespace(namespace_name): 
    print('*1') 
    if isexist_namespace(namespace_name):
        print('*2')
        try :
            print('*3')
            response = v1.delete_namespace(name=namespace_name, grace_period_seconds=0)
            print('*4')
            if response is not None:
                print('*4')
                status_dic = response.to_dict()
                print('*5',status_dic)
                status = status_dic['status']
                print('*6',status, type(status))
                status_dic = ast.literal_eval(status)
                print('*7',status_dic, type(status_dic))
                phase = status_dic['phase']
                print('*8')
                if phase == "Terminating" or phase == "Terminated" :
                    print("Namespace is deleted")
                    return namespace_name
            else:
                print('*9')
                return 'error'
        except ApiException as e:
            print("Exception when delete_namespace: %s\n" % e)
            return 'error'
    else :
        print(namespace_name,'is empty')
        return 'empty' 