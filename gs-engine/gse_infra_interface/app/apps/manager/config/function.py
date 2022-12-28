"""
Modules with Defined for Config Function
"""
from apps.common.base import *
from apps.common.utils import *
from apps.common.statics import *
from apps.common.codes import *
from apps.common.schema import *

from apps.control.dao.cluster import *

import socket
import json
    
def send_client(ip, command_type, data=[]):
    """
    Define Send Command Function
    
    Args:
        ip (_type_): _description_
        command_type (_type_): _description_
        data (list, optional): _description_. Defaults to [].

    Returns:
        _type_: _description_
    """
    server_msg = None
    command = None
    
    if command_type == SOCKET_INVENTORY:
        command = {
            "command": 'inventory',
            "data": data
        }
    else:
        command = {
            "command": command_type
        }
        
    send_data = json.dumps(command)
    
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as client_socket:
            client_socket.connect((ip, PORT))
            client_socket.send(send_data.encode())
            msg = client_socket.recv(BUF_SIZE)
            try:
                server_msg = json.loads(msg.decode())
            except json.JSONDecodeError as e:
                return {
                    "command": command_type,
                    "error": str(e)
                }
    except socket.error as e:
        return {
            "command": command_type,
            "error": str(e)
        }
        
    return server_msg


def get_networks(cluster_name):
    """
    Get Cluster Network Hardware Information

    Args:
        cluster_name (_type_): _description_

    Raises:
        Exception: _description_

    Returns:
        _type_: _description_
    """
    result = {}
    
    cluster = Cluster.get(_id=cluster_name)
    if not cluster:
        raise Exception("Cluster Not Found")

    master_ip = cluster.cluster_data.master_node_address
    
    result = send_client(master_ip, SOCKET_NETWORK)
    
    return result

def get_interfaces(cluster_name):
    """
    Get Network Interface Name Function

    Args:
        cluster_name (_type_): _description_

    Raises:
        Exception: _description_

    Returns:
        _type_: _description_
    """
    result = {}
    
    cluster = Cluster.get(_id=cluster_name)
    if not cluster:
        raise Exception("Cluster Not Found")

    master_ip = cluster.cluster_data.master_node_address
    
    result = send_client(master_ip, SOCKET_INTERFACE)
    
    return result

def get_disks(cluster_name):
    """
    Get Cluster disk Information(Path, Size) Function

    Args:
        cluster_name (_type_): _description_

    Raises:
        Exception: _description_

    Returns:
        _type_: _description_
    """
    result = {}
    
    cluster = Cluster.get(_id=cluster_name)
    if not cluster:
        raise Exception("Cluster Not Found")

    master_ip = cluster.cluster_data.master_node_address
    node_ips = cluster.cluster_data.node_ips
    
    result = send_client(master_ip, SOCKET_DISK)
    
    return result


def init_cluster(cluster_name):
    """
    Run Kubespray, Create Kubernetes Cluster Function

    Args:
        cluster_name (_type_): _description_

    Raises:
        Exception: _description_
        Exception: _description_

    Returns:
        _type_: _description_
    """
    result = {}
    
    cluster = Cluster.get(_id=cluster_name)
    if not cluster:
        raise Exception("Cluster Not Found")

    if cluster.cluster_data.status == ClusterStatus.COMPLATE.value:
        raise Exception("This cluster is already initialized.")

    master_ip = cluster.cluster_data.master_node_address

    result = send_client(master_ip, SOCKET_DEPLOY)

    return result

def generator_inventory(cluster_name):
    """
    Generate Kubespray Inventory Function

    Args:
        cluster_name (_type_): _description_

    Raises:
        Exception: _description_
        Exception: _description_
        Exception: _description_

    Returns:
        _type_: _description_
    """
    result = {}
    send_data = {}

    cluster = Cluster.get(_id=cluster_name)

    if not cluster:
        raise Exception("Cluster Not Found")
    
    if cluster.cluster_data.status == ClusterStatus.COMPLATE.value:
        raise Exception("This cluster is already initialized.")

    master_ip = cluster.cluster_data.master_node_address
    node_ips = cluster.cluster_data.node_ips

    send_data['node'] = []
    send_data['node'].append({
        "name": "master",
        "type": "master",
        "ip": master_ip
    })
    
    if has_duplicates(node_ips):
        raise Exception("Deplicate Node IP!")

    for idx, worker_ip in enumerate(node_ips):
        send_data['node'].append({
            "name": "worker" + str(idx + 1),
            "type": "worker",
            "ip": worker_ip
        })

    result = send_client(master_ip, SOCKET_INVENTORY, send_data)

    return result