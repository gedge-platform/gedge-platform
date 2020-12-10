import subprocess
from kubernetes import client, config, watch
from kubernetes.client.rest import ApiException
import time
import requests
import os

config.load_kube_config()
v1 = client.CoreV1Api()

def replace_str_in_file(read_filename, write_filename,change_str_list):
    fin = open(read_filename, "rt")
    #read file contents to string
    data = fin.read()
    #replace all occurrences of the required string
    for list_item in change_str_list:
        data = data.replace(list_item[0], list_item[1])
    #close the input file
    fin.close()
    #open the input file in write mode
    fin = open(write_filename, "wt")
    #overrite the input file with the resulting data
    fin.write(data)
    #close the file
    fin.close()


def find_node_port_of_service_byname(service_name):
    res_services = v1.list_service_for_all_namespaces(pretty=True)
    for i in res_services.items:
        #print(i.metadata.name)
        if i.metadata.name == service_name:
            for j in i.spec.ports:
                if j.node_port:
                    return j.node_port
    return None


def find_host_ip_of_pod_byname(pod_name):
    res_pods = v1.list_pod_for_all_namespaces(pretty=True)
    for i in res_pods.items:
        if i.metadata.name == pod_name:
            if i.status.host_ip:
                return i.status.host_ip
    return None


def call_test_program(ip, port):
    url = str("http://")+str(ip)+str(":")+str(port)
    print("url=", url)
    headers = {'Content-type': 'application/json'} 
    try :
        response = requests.get(url, headers=headers )
        print(response.content)
    except:
        print("Error: can not connect service")
        exit(1)


if __name__ == '__main__':
    
    file_list=[]
    service_pod_list=[]
    for i in range(1,10):
        change_str_list = []
        change_str_list.append(["SERVICE-NAME", "get-hostname-service-"+str(i)])
        change_str_list.append(["POD-NAME", "get-hostname-"+str(i)])
        
        service_pod_list.append(["get-hostname-service-" + str(i), "get-hostname-"+str(i)])

        replace_str_in_file("get-hostname-templete.yaml", "get-hostname-"+str(i)+".yaml", change_str_list)
        file_list.append("get-hostname-"+str(i)+".yaml")
    # kubectl apply         
    for filename in file_list:
        subprocess.run(["kubectl", "apply", "-f", filename])
    
    time.sleep(60)

    start_time = time.perf_counter()
    for j in range(20) :
        for service_pod in service_pod_list:
            node_port = find_node_port_of_service_byname(service_pod[0])
            ip        = find_host_ip_of_pod_byname(service_pod[1])
            print("-------------->",ip,node_port)
            call_test_program(ip, node_port)
    
    end_time = time.perf_counter()
    print("total time: ",end_time-start_time)

    time.sleep(10)

    # kubectl delete
    for filename in file_list:
        subprocess.run(["kubectl", "delete", "-f", filename])


    #delete file  
    for filename in file_list:
        if os.path.exists(filename):
            os.remove(filename)
            print(filename,"is deleted")
        else:
            print("The file does not exist")     
