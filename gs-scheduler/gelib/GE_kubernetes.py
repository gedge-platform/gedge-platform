import sys
sys.path.append('../gelib')
sys.path.append('../gedef')
import GE_define as gDefine
import GE_platform_util as pUtil
from kubernetes import client, config, watch
from kubernetes.client.rest import ApiException

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
    # Namespace 목록을 조회합니다.
    namespace_list = v1.list_namespace().items

    # 중복된 Namespace 이름이 있는지 확인합니다.
    for namespace in namespace_list:
        if namespace.metadata.name == namespace_name:
            return True
    else:
        return False

def create_namespace(namespace_name):
     
    if isexist_namespace(namespace_name):
        return None
    else :    
        namespace = client.V1Namespace()
        metadata = client.V1ObjectMeta(name=namespace_name)
        namespace.metadata = metadata
        # Namespace를 생성합니다.
        created_namespace=v1.create_namespace(namespace)
        print("Created Namespace name:", created_namespace.metadata.name)
        return namespace_name

