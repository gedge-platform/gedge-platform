import requests
import json

baseurl = 'http://{}:{}/gmcapi/v2/{}'

def get_token(addr, port, id, pw):
    token = None
    service = 'auth'
    body = {}
    body['id'] = id
    body['password']= pw
    body = json.dumps(body)
    url = baseurl.format(addr, port, service)

    try:
        res = requests.post(url, body)
        res_json = res.json()
        token = res_json['accessToken']
    finally:
        return token

def get_clusters(addr, port, token):
    service = 'clusters'
    url = baseurl.format(addr, port, service, token)
    headers = {'Authorization': 'Bearer {}'.format(token)}

    res = requests.get(url, headers=headers)
    res_json = res.json()
    data = res_json['data']
    edges = []
    for cluster in data:
        if cluster['clusterType'] == 'edge' and cluster['status'] == 'success':
            edges.append(cluster['clusterName'])
    
    return edges

def get_gpu(addr, port, edge, token):
    service = 'gpu'
    url = baseurl.format(addr, port, service, token)
    headers = {'Authorization': 'Bearer {}'.format(token)}
    url_gpu = url + '?cluster={}'.format(edge)

    try:
        res = requests.get(url_gpu, headers=headers, timeout=5)
        res_json = res.json()
        if res_json['data'] == None:
            return 0
    
        data = res_json['data']
        allocatable = 0
        limits = 0
        for node in data:
            allocatable += int(node['allocatable']['nvidia.com/gpu'])
            if node['requests']:
                limits += int(node['requests']['nvidia.com/gpu'])

        gpu = allocatable - limits
    
    except requests.exceptions.ReadTimeout as timeout:
        gpu = 0

    return gpu



def get_status(addr, port, edge_list, token):
    service = 'cloudDashboard'
    url = baseurl.format(addr, port, service, token)
    headers = {'Authorization': 'Bearer {}'.format(token)}

    status = []

    for edge in edge_list:
        url_status = url + '?cluster={}'.format(edge)
        res = requests.get(url_status, headers=headers, timeout=5)
        res_json = res.json()
        data = res_json['data']
        cpu = round(float(data['cpuTotal']['value']) - float(data['cpuUsage']['value']), 8)
        memoroy = round(float(data['memoryTotal']['value']) - float(data['memoryUsage']['value']), 8)
        disk = round(float(data['diskTotal']['value']) - float(data['diskUsage']['value']), 8)
        gpu = get_gpu(addr, port, edge, token)
        
        edge_status = [cpu, memoroy, disk, gpu]
        print(edge,":", edge_status)
        
        status += edge_status

    return status

def monitor(addr, port, id, pw):
    token = get_token(addr, port, id, pw)
    edge_list = get_clusters(addr, port, token)
    status = get_status(addr, port, edge_list, token)

    return status

def get_info(addr, port, id, pw):
    token = get_token(addr, port, id, pw)
    edges = get_clusters(addr, port, token)
    n_actions = len(edges)
    n_observations = n_actions + 5 \
                     + (n_actions * 4)
    return n_observations, n_actions, edges

def test():
    ADDR = '101.79.4.15'
    PORT = '31701'
    ID = 'deu1117'
    PW = 'deu1117'
    print(monitor(ADDR, PORT, ID, PW))



if __name__ == '__main__':
    test()
