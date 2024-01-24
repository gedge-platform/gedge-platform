import sys
sys.path.append('../gelib')
sys.path.append('../gedef')

import json
import time,os 
import requests
import redis
import yaml
import quantity
import shutil
import uuid
import threading

from json import dumps
from json import loads 
from operator import itemgetter
from kubernetes import client, config, utils, watch 
from kubernetes.client.rest import ApiException
from flask import Flask, request, abort,jsonify, render_template, redirect, url_for

import GE_define as gDefine
import GE_GSCH_define_ca as caDefine
import GE_kubernetes as gKube
import GE_yaml as gYaml
import GE_meta_data as gMeta

from GE_kafka import gKafka
from GE_meta_data import metaData
from GE_redis import redisController

try :
    config.load_incluster_config()
except:
    config.load_kube_config()

v1 = client.CoreV1Api()
appsV1Api = client.AppsV1Api()
k8s_client = client.ApiClient()


def init_gsch_cluster_agent():
    
    # set global define data
    '''------------------------------------------------
            KAFKA MESSAGE
    ------------------------------------------------'''
    while 1:     
        r = gMeta.find_service_from_gService_list_with_rest_api(gDefine.GEDGE_SYSTEM_NAMESPACE, gDefine.KAFKA_SERVICE_NAME)
        if r : 
            gDefine.KAFKA_ENDPOINT_IP   = r['access_host']
            gDefine.KAFKA_ENDPOINT_PORT = r['access_port']
            gDefine.KAFKA_SERVER_URL            = str(gDefine.KAFKA_ENDPOINT_IP)+str(':')+str(gDefine.KAFKA_ENDPOINT_PORT)
            print(gDefine.KAFKA_ENDPOINT_IP,gDefine.KAFKA_ENDPOINT_PORT)
            break
        else :
            print('wait for running platform service',)
            time.sleep(gDefine.WAIT_RUNNING_PLATFORM_SERVICES_SECOND_TIME) 
            continue

    '''-----------------------------------------------
            REDIS
    -----------------------------------------------'''
    while 1:
        r = gMeta.find_service_from_gService_list_with_rest_api(gDefine.GEDGE_SYSTEM_NAMESPACE,gDefine.REDIS_SERVICE_NAME)
        if r : 
            gDefine.REDIS_ENDPOINT_IP   = r['access_host']
            gDefine.REDIS_ENDPOINT_PORT = r['access_port']
            print(gDefine.REDIS_ENDPOINT_IP,gDefine.REDIS_ENDPOINT_PORT)
            break
        else :
            print('wait for running platform service',)
            time.sleep(gDefine.WAIT_RUNNING_PLATFORM_SERVICES_SECOND_TIME) 
            continue

    '''-----------------------------------------------
            MONGO DB 
    -----------------------------------------------'''
    while 1:        
        r = gMeta.find_service_from_gService_list_with_rest_api(gDefine.GEDGE_SYSTEM_NAMESPACE,gDefine.MONGO_DB_SERVICE_NAME)
        if r : 
            gDefine.MONGO_DB_ENDPOINT_IP   = r['access_host']
            gDefine.MONGO_DB_ENDPOINT_PORT = r['access_port']
            print(gDefine.MONGO_DB_ENDPOINT_IP,gDefine.MONGO_DB_ENDPOINT_PORT)    
            break
        else :
            print('wait for running platform service',)
            time.sleep(gDefine.WAIT_RUNNING_PLATFORM_SERVICES_SECOND_TIME) 
            continue
    '''-----------------------------------------------
            SET CLUSTER INFO AT MONGO DB 
    -----------------------------------------------'''
           
GE_metaData = metaData() 

init_gsch_cluster_agent()

GE_metaData.init_platform_metadata_from_mongodb(ip=gDefine.MONGO_DB_ENDPOINT_IP,port=int(gDefine.MONGO_DB_ENDPOINT_PORT))


def get_cluster_resource_status(t_GPUFilter):
    '''-------------------------------------------------
    result: { 'cluster_name': 'c1','node_name': 'cswnode2', 'cpu': 0.20833333333333334, 'memory': 0.025937689523708434, 'nvidia.com/gpu': 1, 'score': 399.76572897714294 }
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
        
        t_score_dic['cluster_name']   = caDefine.SELF_CLUSTER_NAME
        t_score_dic['node_name']      = temp_node
        t_score_dic['cpu']            = cpu_percent 
        t_score_dic['memory']         = memory_percent 
        t_score_dic['nvidia.com/gpu'] = left_gpu_count
        
        if t_GPUFilter == 'necessary' :
            score =  (100 - cpu_percent) + (100 - memory_percent) + (left_gpu_count * gDefine.MOST_REQUEST_POLICY_GPU_COST_WEIGHT)
        else :
            score =  (100 - cpu_percent) + (100 - memory_percent)
        
        t_score_dic['score']= score 
        t_score_list.append(t_score_dic)

    sorted_t_score_list = sorted(t_score_list, key=itemgetter('score'), reverse=True)
       
    if sorted_t_score_list[0] :
        print('first list of sorted_t_score_list',sorted_t_score_list[0])
        return sorted_t_score_list[0]
    else :
        return  None 

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

@app.route('/test', methods=['GET','POST'])
def test():
    #print(request.get_json())
    response_data = {}
    response_data['result'] = "test" 

    response = app.response_class(response=json.dumps(response_data), status=200, mimetype='application/json')
    gDefine.logger.info('test')
    return response

def rest_API_service():
    app.run(host='0.0.0.0', port=8787, threaded=True)

'''===================================================================
                          ClusterAgent
==================================================================='''
class ClusterAgent:
    apply_yaml_list = []
    def __init__(self, cluster_name, cluster_type, apply_yaml_path):
        self.apply_yaml_path  = apply_yaml_path
        self.cluster_name     = cluster_name
        self.cluster_type     = cluster_type
        
        self.kafka_for_API    = gKafka([gDefine.KAFKA_SERVER_URL])
        self.Kafka_for_GSCH   = gKafka([gDefine.KAFKA_SERVER_URL])
        
        self.cRedis           = redisController()
        self.cRedis.connect_redis_server(gDefine.REDIS_ENDPOINT_IP,gDefine.REDIS_ENDPOINT_PORT)
        self.redis_conn       = self.cRedis.redisConn   
        
        self.cluster_info_dic = gMeta.get_gCluster_with_k8s(self.cluster_name,self.cluster_type)
        self.apply_yaml_files_for_clustr_agent_daemonset()
        '''
        agentsInfo = {
            'node_name1' : {'pod_name': 'p1', 'pod_ip': ip1},
            'node_name2' : {'pod_name': 'p2', 'pod_ip': ip2} 
        }
        '''        
        self.agentsInfo = {}
        self.set_worker_agents_info()
        self.set_cluster_info_and_node_info()
    
    def set_cluster_info_and_node_info(self):
        #write clustser information to mongo db
        print('===============================================================')
        print('write clustser information to mongo db')
        print('cluster_info_dic',self.cluster_info_dic)
        print('===============================================================')
        
        GE_metaData.set_cluster_info(self.cluster_info_dic)
        print('===============================================================')
        print('get_cluster_info_list')
        GE_metaData.get_cluster_info_list()

        t_node_info_dic_list = gMeta.get_gNode_with_k8s(caDefine.SELF_CLUSTER_NAME)
        for t_node_info_dic in t_node_info_dic_list :
            print('===============================================================')
            print('write node information to mongo db')
            print('t_node_info_dic',t_node_info_dic)
            print('===============================================================')
            GE_metaData.set_node_info(t_node_info_dic)
            print('===============================================================')
            print('get_node_info_list')
        GE_metaData.get_node_info_list()
    
    def apply_yaml_files_for_clustr_agent_daemonset(self) :
        import glob
        glob_str_list=[str(self.apply_yaml_path)+'/*.yaml',str(self.apply_yaml_path)+'/*.yml']

        for t_str in glob_str_list :
            self.apply_yaml_list.extend(glob.glob(t_str))
        print('apply_yaml_list:',self.apply_yaml_list)
    
        for full_filename in self.apply_yaml_list:
            try:
                yaml_file = full_filename
                resp = utils.create_from_yaml(k8s_client, yaml_file)
                print('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^')
                #print('resp of utils.create_from_yaml ====>',resp)
                print('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^')
                print('apply_yaml_files is completed ',yaml_file) 
            except utils.FailToCreateError as failure:
                print('error : apply_yaml_files_for_clustr_agent_daemonset',failure)
                exit(0)

    def set_worker_agents_info(self):
        
        is_worker_agent_ready = True
        # check and wait for running worker agent 
        while 1 :
            is_worker_agent_ready = True
            try:
                api_response = v1.list_namespaced_pod( caDefine.GEDGE_SCHEDULER_NAMESPACE, 
                                                    label_selector='app='+str(caDefine.WORKER_AGENT_LABEL) )
                #print('api_response.items',api_response.items)
                if len(api_response.items) == len(self.cluster_info_dic['nodes']) :
                    for i in api_response.items:
                        if i.status.phase != 'Running':
                            print('wait that worker agent pod status will be Running')
                            time.sleep(caDefine.CHECK_WORKER_AGENT_WAIT_SECOND_TIME)
                            is_worker_agent_ready = False 
                            break
                    if is_worker_agent_ready == False :
                        continue
                    else :
                        break
                else :
                    print('wait running agent (%d/%d)'% (len(api_response.items),len(self.cluster_info_dic['nodes'])) )
                    time.sleep(caDefine.CHECK_WORKER_AGENT_WAIT_SECOND_TIME)
                    continue
            except ApiException as e:
                print("Exception when calling CoreV1Api->list_namespaced_pod: %s\n" % e)
                exit(1)
        # set worker_agents_info from running worker agents 
        for i in api_response.items:
            print("get_worker_agents_info:", i.metadata.name, i.status.phase, i.spec.node_name, i.status.pod_ip)
            self.agentsInfo[str(i.spec.node_name)] = {'pod_name': i.metadata.name, 'pod_ip': i.status.pod_ip}
        print('end self.agentsInfo')
        return 0
    
    def get_yaml_file_from_redis(self, yaml_key):

        if self.redis_conn.hexists(gDefine.REDIS_YAML_KEY, yaml_key) == 0:
            return None
        return self.redis_conn.hget(gDefine.REDIS_YAML_KEY, yaml_key)
    
    def create_pod(self, name, namespace, pod_manifest):
        print('start create_pod')
        print('pod name:',name)
        print('namespace:',namespace)
        #print('pod_manifest:',pod_manifest)
        try:
            r = v1.read_namespaced_pod(name=name, namespace=namespace)
            #print('result:',r)
            return 'cancel'
        except ApiException as e:
            if e.status != 404:
                print("Error: %s" % e.body)
                return 'fail'
        try:
            r = v1.create_namespaced_pod(body=pod_manifest, namespace=namespace)
            time.sleep(caDefine.APPLY_AFTER_DELAY_SECOND_TIME)
            try_count=caDefine.APPLY_RESULT_CHECK_RETRY_COUNT
            while True:
                r2 = v1.read_namespaced_pod(name=name, namespace=namespace)
                if r2.status.phase == 'Running' :
                    break
                time.sleep(caDefine.APPLY_RESULT_CHECK_DELAY_SECOND_TIME)
                if try_count < 1:
                    return 'fail'
                try_count = try_count - 1 
            print("Create Pod", name," Done.")
        except ApiException as e:
            print("Create Pod", name," Failed.")
            print("Error: %s" % e.body)
            return 'fail'
        return 'success'
    
    def create_depoyment(self, name, namespace, deployment_manifest):
        print('start create_depoyment')
        try:
            r = appsV1Api.create_namespaced_deployment(body=deployment_manifest, namespace=namespace)
            print("Create Deployment_manifest", name," Done.")
            print('result:',r)
        except ApiException as e:
            print("Create Deployment_manifest", name," Failed.")
            print("Error: %s" % e.body)
            return 'fail'
        return 'success'

    def apply_yaml(self, yaml_dic_list) :
        print('start apply_yaml22')
        return_list=[]
        kind      = None
        name      = None
        namespace = None
        for yaml_dic in yaml_dic_list :
            #print('yaml_dic', yaml_dic)
            for key, value in yaml_dic.items():
                if key == 'kind':
                    kind = value
                elif key == 'metadata':
                    if "name" in value:
                        name = value['name']
                    if "namespace" in value:
                        namespace = value['namespace']
            if namespace == None:
                namespace = 'default'
            
            r = 'cancel'
            if kind == 'Pod':
                r = self.create_pod(name, namespace, yaml_dic)
            elif kind == 'Deployment':
                r = self.create_depoyment(name, namespace, yaml_dic)
            else:
                print('kk-1')
                return_val = utils.create_from_dict(k8s_client,data=yaml_dic,namespace=namespace)
                if return_val :
                    r = 'success'
                else :
                    r = 'fail'
            return_list.append(r) 
        
        print('apply_yaml end :',return_list)
        return return_list
    
    def transfer_with_GLowLatencyPriority_yaml(self,yaml_dic_list,request_data_dic):
        #with open('nginx_dep.yaml') as f:
        #    yaml_dic_list = yaml.load(f,Loader=yaml.FullLoader)
        print('--------------------------------')
        print('request_data_dic',request_data_dic)                  
        print('--------------------------------')
        transfered_yaml_dic_list = []
        for single_yaml_dic in yaml_dic_list :
            if single_yaml_dic == None :
                continue
            # print('=========single_yaml_dic==============',single_yaml_dic)
            try :
                t_priority      = request_data_dic['env']['priority']
                t_source_cluster = request_data_dic['env']['option']['parameters']['source_cluster']
                if t_source_cluster == caDefine.SELF_CLUSTER_NAME :
                    t_source_node = request_data_dic['env']['option']['parameters']['source_node']
                else :
                    # get master node 
                    r_master_node=GE_metaData.get_node_info_by_node_type(caDefine.SELF_CLUSTER_NAME,'master')
                    if r_master_node != None :
                        t_source_node = r_master_node['node_name']
                    else :
                        print('error: get_node_info_by_node_type')
                        return None
                adding_env={'scope':'local','priority':t_priority,'option':{'source_node':t_source_node}}
                adding_env_json = json.dumps(adding_env)
                
                if single_yaml_dic['kind'] == 'Deployment':
                    print(single_yaml_dic['spec']['selector'])
                    print(single_yaml_dic['spec']['template']['spec']['containers'])
                    containers = single_yaml_dic['spec']['template']['spec']['containers']
                    print('--------------------------------')
                    spec = single_yaml_dic['spec']['template']['spec']
                    # insert gedge scheduler name 
                    spec['schedulerName']=caDefine.GEDGE_SCHEDULER_NAME
                    for i in range(0,len(containers)):
                        #single_yaml_dic['spec']['template']['spec']['containers'][i]['env']=[{'name':caDefine.GEDGE_SCHEDULER_CONFIG_NAME,'value':adding_env_json}]
                        single_yaml_dic['spec']['template']['spec']['containers'][i]['env'].append({'name':caDefine.GEDGE_SCHEDULER_CONFIG_NAME,'value':adding_env_json})
                        print('===========================================================================================================================>')
                        print('**env**:',single_yaml_dic['spec']['template']['spec']['containers'][i]['env'])
                        print('<===========================================================================================================================')
                    with open('deployment_GLowLatencyPriority.yaml', 'w') as z:
                        yaml.dump(single_yaml_dic, z)
                    transfered_yaml_dic_list.append(single_yaml_dic)

                elif single_yaml_dic['kind'] == 'Pod':
                    containers = single_yaml_dic['spec']['containers']
                    print('containers:',containers)
                    print('--------------------------------')
                    spec = single_yaml_dic['spec']
                    # insert gedge scheduler name 
                    spec['schedulerName']=caDefine.GEDGE_SCHEDULER_NAME
                    for i in range(0,len(containers)):
                        #single_yaml_dic['spec']['containers'][i]['env']=[{'name':caDefine.GEDGE_SCHEDULER_CONFIG_NAME,'value':adding_env_json}]
                        print('single_yaml_dic[spec][containers][0]',single_yaml_dic['spec']['containers'][0])
                        if 'env' not in single_yaml_dic['spec']['containers'][i]:
                            single_yaml_dic['spec']['containers'][i]['env']=[{'name':caDefine.GEDGE_SCHEDULER_CONFIG_NAME,'value':adding_env_json}]
                        else :
                            single_yaml_dic['spec']['containers'][i]['env'].append({'name':caDefine.GEDGE_SCHEDULER_CONFIG_NAME,'value':adding_env_json})    
                        print('===========================================================================================================================>')
                        print('**env**:',single_yaml_dic['spec']['containers'][i]['env'])
                        print('<===========================================================================================================================')
                    with open('pod_GLowLatencyPriority.yaml', 'w') as z:
                        yaml.dump(single_yaml_dic, z)
                    transfered_yaml_dic_list.append(single_yaml_dic)
                else :
                    print('this yaml is not deployment or pod ')
                    transfered_yaml_dic_list.append(single_yaml_dic)
            except Exception as e:
                return None
        #print('==========transfered_yaml_dic_list=============',transfered_yaml_dic_list)   
        return transfered_yaml_dic_list
    
    def transfer_with_GMostRequestedPriority_yaml(self,yaml_dic,request_data_dic):
        #with open('nginx_dep.yaml') as f:
        #    yaml_dic = yaml.load(f,Loader=yaml.FullLoader)
        print('=========transfer_with_GMostRequestedPriority_yaml==============')
        transfered_yaml_dic_list = []
        for single_yaml_dic in yaml_dic :
            #print('=========single_yaml_dic==============',single_yaml_dic)
            try :
                t_priority   = request_data_dic['env']['priority']
                adding_env={'scope':'local','priority':t_priority}
                adding_env_json = json.dumps(adding_env)
                
                if single_yaml_dic['kind'] == 'Deployment':
                    print(single_yaml_dic['spec']['selector'])
                    print(single_yaml_dic['spec']['template']['spec']['containers'])
                    containers = single_yaml_dic['spec']['template']['spec']['containers']
                    print('--------------------------------')
                    spec = single_yaml_dic['spec']['template']['spec']
                    # insert gedge scheduler name 
                    spec['schedulerName']=caDefine.GEDGE_SCHEDULER_NAME
                    for i in range(0,len(containers)):
                        #single_yaml_dic['spec']['template']['spec']['containers'][i]['env']=[{'name':caDefine.GEDGE_SCHEDULER_CONFIG_NAME,'value':adding_env_json}]
                        single_yaml_dic['spec']['template']['spec']['containers'][i]['env'].append({'name':caDefine.GEDGE_SCHEDULER_CONFIG_NAME,'value':adding_env_json})
                        print('===========================================================================================================================>')
                        print('**env**:',single_yaml_dic['spec']['template']['spec']['containers'][i]['env'])
                        print('<===========================================================================================================================')
                    with open('deployment_GMostRequestedPriority.yaml', 'w') as z:
                        yaml.dump(single_yaml_dic, z)
                    transfered_yaml_dic_list.append(single_yaml_dic)
                    
                elif single_yaml_dic['kind'] == 'Pod':
                    containers = single_yaml_dic['spec']['containers']
                    print('--------------------------------')
                    spec = single_yaml_dic['spec']
                    # insert gedge scheduler name 
                    spec['schedulerName']=caDefine.GEDGE_SCHEDULER_NAME
                    for i in range(0,len(containers)):
                        #single_yaml_dic['spec']['containers'][i]['env']=[{'name':caDefine.GEDGE_SCHEDULER_CONFIG_NAME,'value':adding_env_json}]
                        single_yaml_dic['spec']['containers'][i]['env'].append({'name':caDefine.GEDGE_SCHEDULER_CONFIG_NAME,'value':adding_env_json})
                        print('===========================================================================================================================>')
                        print('**env**:',single_yaml_dic['spec']['containers'][i]['env'])
                        print('<===========================================================================================================================')
                    with open('pod_GMostRequestedPriority.yaml', 'w') as z:
                        yaml.dump(single_yaml_dic, z)
                    transfered_yaml_dic_list.append(single_yaml_dic)
                else :
                    print('this yaml is not deployment or pod ')
                    transfered_yaml_dic_list.append(single_yaml_dic)
                    
                #with open('fruits.yaml', 'w') as z:
                #    yaml.dump(yaml_dic, z)
            except:
                print('!!!!!!!!!!except!!!!!!! ')
                return None
        #print('==========transfered_yaml_dic_list=============')    
        print('==========transfered_yaml_dic_list=============')    
        print(transfered_yaml_dic_list)    
        print('===============================================')    
        return transfered_yaml_dic_list
    
    def send_error(self, kafka_instance, request_id, error_msg):
        msg_data = {'source': {'type':'cluster', 'object': self.cluster_name},
                'target':{'type':'none'},
                'hcode':900,
                'lcode':2,
                'msg': {'result': 'error', 'message': error_msg }
        }
        if kafka_instance == 'API' :
            self.kafka_for_API.kafka_msg_send(request_id,msg_data)
        elif kafka_instance == 'GSCH' :
            self.Kafka_for_GSCH.kafka_msg_send(request_id,msg_data)
        else :
            print(kafka_instance,'is not defined')

    def send_result(self,kafka_instance, request_id, msg_data):
        if kafka_instance == 'API' :
            self.kafka_for_API.kafka_msg_send(request_id,msg_data)
        elif kafka_instance == 'GSCH' :
            self.Kafka_for_GSCH.kafka_msg_send(request_id,msg_data)
        else :
            print(kafka_instance,'is not defined')
        
    
    '''-----------------------------------
         HCODE : 210  LCODE :1
    --------------------------------------'''
    def apply_GLowLatencyPriority_yaml(self, topic_data):
        print('start-----------------apply_GLowLatencyPriority_yaml')
        print('topic_data[''msg'']',topic_data['msg'])
        '''
        topic_data['msg']
        {
           'request_id': 'req-b9494ca5-6e9a-4ab3-8392-8795f0b5eb3e',
           'file_id': 'b2ab5fbe-e7bf-44dc-84d7-b969ad62f104',  
           'cdate': '2021-10-21 12:05:54',
           'callback_url': 'url1', 
           'method': 'create', 
           'fail_count': 0, 
           'env': {
               'priority': 'GLowLatencyPriority'
               'scope': 'global', 
               'option': {
                    'user_name': 'u1', 
                    'workspace_name': 'w1', 
                    'project_name': 'p1', 
                    'mode': 'fromnode', 
                    'parameters': {
                        'select_clusters': ['c1']
                    }
                }
           }
        }
        topic_data['work_info']
        { 
            user_name : user1,
            workspace_name: w1,
            project_name: p1, 
            namespace_name: p1-w1uid
        }
        '''
        if 'request_id' not in topic_data['msg']:
            print('request_id not in topic_data[msg]')
            return
        request_id = topic_data['msg']['request_id']
        if 'file_id' not in topic_data['msg']:
            print('file_id not in topic_data[msg]')
            return
        file_id = topic_data['msg']['file_id']
        if 'type' not in topic_data['target']:
            self.send_error('GSCH',request_id, 'type not in topic_data[target]')
            return
        if 'object' not in topic_data['target']:
            self.send_error('GSCH',request_id, 'object not in topic_data[target]')
            return
        if 'request_data' not in topic_data['msg']:
            self.send_error('GSCH',request_id, 'request_data not in topic_data[msg]')
            return
        print('end-------------------apply_GLowLatencyPriority_yaml')

        yaml_file_bytes = self.get_yaml_file_from_redis(file_id)
        
        print('type of retrieved_data which is read from redis',type(yaml_file_bytes))
        if yaml_file_bytes is not None:
            yaml_file_dic_list = list(yaml.safe_load_all(yaml_file_bytes.decode('utf-8')))        
        
        print('type of yaml_file_list',type(yaml_file_dic_list))
        
        new_annotation_dic = topic_data['work_info']
        desired_namespace  = topic_data['work_info']['namespace_name']
        # mode = topic_data['msg']['env']['option']['mode']
        updated_yaml_dic_list=[]
                
        result = 'cancel'
        for yaml_file_dic in yaml_file_dic_list :
            print('type of yaml_file_dic', type(yaml_file_dic))
            print('yaml_file_dic', yaml_file_dic)
            updated_yaml_dic = gYaml.add_annotation_to_yaml_file_dic(yaml_file_dic,new_annotation_dic) 
            print('updated_yaml_dic 1:', updated_yaml_dic)
            updated_yaml_dic = gYaml.add_namespace_to_yaml_file_dic(updated_yaml_dic,desired_namespace)
            print('updated_yaml_dic 2:', updated_yaml_dic)
            updated_yaml_dic_list.append(updated_yaml_dic)
        print('updated_yaml_dic_list:', updated_yaml_dic_list)    
        if updated_yaml_dic_list != None :
            #transter normal yaml file to gedge yaml file 
            transfered_yaml_dic_list=self.transfer_with_GLowLatencyPriority_yaml(updated_yaml_dic_list,topic_data['msg']['request_data'])
            if len(transfered_yaml_dic_list) > 0 :
                result_list = self.apply_yaml(transfered_yaml_dic_list)
                for r in result_list :
                    if r == 'cancel':
                        result='cancel'
                        break
                    elif r == 'fail' :
                        result='fail'
                        continue
                    else :
                        result = r
            else :
                result = 'fail'
        else:
            print('error : yaml file read ')
            result = 'cancel'
        print('result:',result)
        error_msg='None'
        temp_msg = {
           'source' : {'type':'cluster', 'object': self.cluster_name},
           'target' : {'type':'none'},
           'hcode'  : 210,
           'lcode'  : 2,
           'msg'    : { 
                'request_id': request_id,
                'method': 'read',
                'result': {
                    'status'    : result,
                    'error_msg' : error_msg    
                }
            }
        }
        self.send_result('GSCH',request_id, temp_msg)
    
    '''-----------------------------------
         HCODE : 200  LCODE :1
    --------------------------------------'''
    def request_clusters_latency(self,topic_data):

        print('------------------------------------request_clusters_latency')
        print('------------------------------------topic_data', topic_data)
        '''
        topic_data {'source': {'type': 'none'}, 'target': {'type': 'cluster', 'object': 'c1'}, 'hcode': 200, 'lcode': 1, 'msg': {'request_id': 'req-7092d391-e4a3-4f2f-8e50-0acd4a35189a', 'source_node': 'a-worker-node01', 'select_clusters': ['c2', 'c3']}}
        '''
        if 'request_id' not in topic_data['msg']:
            print('request_id not in topic_data[msg]')
            return
        request_id = topic_data['msg']['request_id']
        if 'source_node' not in topic_data['msg']:
            print('source_node not in topic_data[msg]')
            return
        t_source_node = topic_data['msg']['source_node']
        if 'select_clusters' not in topic_data['msg'] :
            print('select_clusters not in topic_data[msg]')
            return
        t_select_clusters = topic_data['msg']['select_clusters']

        result_list=[]
        print('t_select_clusters:',t_select_clusters)
        for cluster in t_select_clusters :
            print('cluster', cluster)
            print('t_source_node', t_source_node)
            print('self.agentsInfo', self.agentsInfo)
            agent_pod_ip = self.agentsInfo[t_source_node]['pod_ip']
            # call rest api
            url = 'http://'+str(agent_pod_ip)+':8787'+'/monitoring/clusters/'+str(cluster)+'/latency'

            print("url=", url)
            headers = {'Content-type': 'application/json'}
            try:
                response = requests.get(url, headers=headers )
                response_dic=response.json()
                print('response_dic[Result]',response_dic['result'] )
                result_list.append({'cluster':cluster, 'latency':response_dic['result']})
            except:
                print("Error: can not request worker agent")
                return -1
      
        print('result_list', result_list)

        # sort result_list with latency 
        sorted_result_list = sorted(result_list,key=lambda result_list : (result_list['latency'],result_list['cluster']))
        print('sorted_result_list', sorted_result_list)

        temp_msg = {'source': {'type':'cluster', 'object': self.cluster_name},
                'target':{'type':'none'},
                'hcode':200,
                'lcode':2,
                'msg':{'result': sorted_result_list}
        }
        self.send_result('GSCH',request_id, temp_msg)
    
    '''-----------------------------------
         HCODE : 300  LCODE :1
    --------------------------------------'''
    def request_clusters_available_resource(self,topic_data):
        print('------------------------------------request_clusters_available_resource')
        print('------------------------------------topic_data', topic_data)
        '''
        topic_data {'source': {'type': 'none'}, 'target': {'type': 'cluster', 'object': 'c1'}, 'hcode': 300, 'lcode': 1, 
                   'msg': {'request_id': 'req-7092d391-e4a3-4f2f-8e50-0acd4a35189a','GPUFilter': 'necessary'/'unnecessary'}}
        '''
        if 'request_id' not in topic_data['msg']:
            print('request_id not in topic_data[msg]')
            return
        if 'GPUFilter' not in topic_data['msg']:
            print('GPUFilter not in topic_data[msg]')
            return
        request_id = topic_data['msg']['request_id']
        GPUFilter = topic_data['msg']['GPUFilter']
        # get cluster resource data
        '''
        result: { 'cluster_name': 'c1','node_name': 'cswnode2', 'cpu': 0.20833333333333334, 'memory': 0.025937689523708434, 'nvidia.com/gpu': 1, 'score': 399.76572897714294 }
        '''
        result = get_cluster_resource_status(GPUFilter)
        
        temp_msg = {
          'source': {'type':'cluster', 'object': self.cluster_name},
          'target':{'type':'none'},
          'hcode':300,
          'lcode':2,
          'msg':{'result': result}
        }
        self.send_result('GSCH',request_id, temp_msg)
    
    '''-----------------------------------
         HCODE : 310  LCODE :1
    --------------------------------------'''
    def apply_GMostRequestedPriority_yaml(self, topic_data):
        '''
        from kubernetes import client, config, utils
        config.load_kube_config()
        k8s_client = client.ApiClient()
        yaml_file = '<location to your multi-resource file>'
        utils.create_from_yaml(k8s_client, yaml_file)
        create_from_dict(k8s_client, data, verbose=False, namespace='default',**kwargs):
        '''
        print('start------------------------------------apply_yaml')
        if 'request_id' not in topic_data['msg']:
            print('request_id not in topic_data[msg]')
            return
        request_id = topic_data['msg']['request_id']
        if 'file_id' not in topic_data['msg']:
            print('file_id not in topic_data[msg]')
            return
        file_id = topic_data['msg']['file_id']
        if 'type' not in topic_data['target']:
            self.send_error('GSCH',request_id, 'type not in topic_data[target]')
            return
        if 'object' not in topic_data['target']:
            self.send_error('GSCH',request_id, 'object not in topic_data[target]')
            return
        if 'request_data' not in topic_data['msg']:
            self.send_error('GSCH',request_id, 'request_data not in topic_data[msg]')
            return
        print('end------------------------------------apply_yaml')

        yaml_file = self.get_yaml_file_from_redis(file_id)
        
        print('topic_data[''msg''][''request_data'']',topic_data['msg']['request_data'])
        '''
        {'request_id': 'req-b9494ca5-6e9a-4ab3-8392-8795f0b5eb3e', 'cdate': '2021-10-21 12:05:54', 'status': 'create', 
        'file_id': 'b2ab5fbe-e7bf-44dc-84d7-b969ad62f104', 'fail_count': 0, 'env': {'scope': 'global', 'select_clusters': ['c1', ['c2', 'c3'], 'c4'], 
        'priority': 'GMostRequestedPriority'}}
        '''
        result = 'cancel'

        if yaml_file != None:
            #transter normal yaml file to gedge yaml file 
            transfered_yaml_dic_list=self.transfer_with_GMostRequestedPriority_yaml(yaml.load_all(yaml_file,Loader=yaml.FullLoader),topic_data['msg']['request_data'])
            if len(transfered_yaml_dic_list) > 0 :
                result_list = self.apply_yaml(transfered_yaml_dic_list)
                for r in result_list :
                    if r == 'cancel':
                        result ='cancel'
                        break
                    elif r == 'fail' :
                        result ='fail'
                        continue
                    else :
                        result = r
            else :
                result = 'fail'
        else:
            print('error : yaml file read ')
            result = 'cancel'

        temp_msg = {
          'source': {'type':'cluster', 'object': self.cluster_name},
          'target':{'type':'none'},
          'hcode':310,
          'lcode':2,
          'msg':{'result': result}
        }
        self.send_result('GSCH',request_id, temp_msg)
    
    '''-----------------------------------
         HCODE : 400  LCODE :1
    --------------------------------------'''
    def apply_GSelectedCluster_yaml(self, topic_data):
        
        print('start-----------------apply_GSelectedCluster_yaml')
        print('topic_data[''msg'']',topic_data['msg'])
        error_msg='None'
        result = 'fail'
        '''
        topic_data['msg']
        {
           'request_id': 'req-b9494ca5-6e9a-4ab3-8392-8795f0b5eb3e',
           'file_id': 'b2ab5fbe-e7bf-44dc-84d7-b969ad62f104',  
           'cdate': '2021-10-21 12:05:54',
           'callback_url': 'url1', 
           'status': 'create', 
           'fail_count': 0, 
           'env': {
               'priority': 'GSelectClusterPriority'
               'scope': 'global', 
               'option': {
                    'user_name': 'u1', 
                    'workspace_name': 'w1', 
                    'project_name': 'p1', 
                    'mode': 'cluster', 
                    'parameters': {
                        'select_clusters': ['c1']
                    }
                }
           }
        }
        topic_data['work_info']
        { 
            user_name : user1,
            workspace_name: w1,
            project_name: p1, 
            namespace_name: p1-w1uid
        }
        '''
        if 'request_id' not in topic_data['msg']:
            print('request_id not in topic_data[msg]')
            return
        request_id = topic_data['msg']['request_id']
        
        if 'file_id' not in topic_data['msg']:
            print('file_id not in topic_data[msg]')
            return
        file_id = topic_data['msg']['file_id']
        
        if 'type' not in topic_data['target']:
            self.send_error('GSCH',request_id, 'type not in topic_data[target]')
            return
        if 'object' not in topic_data['target']:
            self.send_error('GSCH',request_id, 'object not in topic_data[target]')
            return
        try :
            yaml_file_bytes  = self.get_yaml_file_from_redis(file_id)
            print('type of retrieved_data which is read from redis',type(yaml_file_bytes))
            if yaml_file_bytes is not None:
                yaml_file_dic_list = list(yaml.safe_load_all(yaml_file_bytes.decode('utf-8')))        
            
            print('type of yaml_file_list',type(yaml_file_dic_list))
            new_annotation_dic = topic_data['work_info']
            desired_namespace  = topic_data['work_info']['namespace_name']
            mode = topic_data['msg']['env']['option']['mode']

            # 다중 yaml 파일 고려 필요 
            updated_yaml_dic_list=[]
            for yaml_file_dic in yaml_file_dic_list :
                print('type of yaml_file_dic', type(yaml_file_dic))
                print('yaml_file_dic', yaml_file_dic)
                updated_yaml_dic = gYaml.add_annotation_to_yaml_file_dic(yaml_file_dic,new_annotation_dic) 
                print('updated_yaml_dic 1:', updated_yaml_dic)
                updated_yaml_dic = gYaml.add_namespace_to_yaml_file_dic(updated_yaml_dic,desired_namespace)
                print('updated_yaml_dic 2:', updated_yaml_dic)
                if  mode == 'node' :
                    node_name = topic_data['msg']['env']['option']['parameters']['select_node']
                    print('node_name:', node_name)
                    updated_yaml_dic = gYaml.add_nodeselector_to_yaml_file_dic(updated_yaml_dic,node_name)
                    print('updated_yaml_dic 3:', updated_yaml_dic)
                #namespace 지정 필요 
                updated_yaml_dic_list.append(updated_yaml_dic)
            print('updated_yaml_dic_list:', updated_yaml_dic_list)
            if updated_yaml_dic_list != None:
                uploads_dir = str(caDefine.CLUSTER_AGENT_SAVE_PATH)+str('/')+str(file_id)
                print("dir:",uploads_dir)
                os.makedirs(uploads_dir,exist_ok=True)
                full_filename = uploads_dir+str('/')+str(file_id)
                with open(full_filename, 'w') as yaml_file:
                    yaml.dump_all(updated_yaml_dic_list, yaml_file)
                try :
                    resp = utils.create_from_yaml(k8s_client, full_filename)
                    #print('resp of utils.create_from_yaml ====>',resp)
                    result = 'success'
                except utils.FailToCreateError as failure:
                    print('failure.api_exceptions',failure)
                    result = 'fail'
                finally:
                    try:
                        shutil.rmtree(uploads_dir)
                        print('deleted temp directory',uploads_dir)
                    except OSError as e:
                        print ("Error: %s - %s." % (e.filename, e.strerror))
            else:
                print('--error : create added_annotation_node_yaml_dic_list')
                result = 'cancel'
            print('--apply_GSelectedCluster_yaml :',result)
            temp_msg = {
                'source' : {'type':'cluster', 'object': self.cluster_name},
                'target' : {'type':'none'},
                'hcode'  : 400,
                'lcode'  : 2,
                'msg'    : {
                    'request_id': request_id,
                    'result'    : { 
                        'status'    : result,
                        'error_msg' : error_msg
                    }
                }
            }
            self.send_result('GSCH',request_id, temp_msg)
        except :
            print('Error: apply_GSelectedCluster_yaml')
            temp_msg['msg']['result']['status'] = 'cancel'
            self.send_result('GSCH',request_id, temp_msg)

    '''-----------------------------------
         HCODE : 520  LCODE :1
    --------------------------------------'''
    def project_GAPI_handler(self, topic_data):
        
        print('start-----------------project_GAPI_handler')
        if 'request_id' not in topic_data['msg']:
            print('request_id not in topic_data[msg]')
            return
        request_id = topic_data['msg']['request_id']
        
        if 'method' not in topic_data['msg']:
            print('method not in topic_data[msg]')
            return
        method = topic_data['msg']['method']
        
        if 'mode' not in topic_data['msg']:
            print('mode not in topic_data[msg]')
            return
        mode = topic_data['msg']['mode']
        
        if 'parameters' not in topic_data['msg']:
            print('data not in topic_data[msg]')
            return
        GAPI_data = topic_data['msg']['parameters']
        
        if 'workspace_uid' not in  topic_data['msg']['parameters'] :
            print('workspace_uid not in topic_data[msg]')
            return
        workspace_uid=GAPI_data['workspace_uid']
        
        if 'project_name' not in  topic_data['msg']['parameters'] :
            print('project_name not in topic_data[msg]')
            return
        project_name = GAPI_data['project_name']
        namespace_name = str(project_name)+'-'+str(workspace_uid)
        print('namespace_name',namespace_name)
        if method == 'create' :
            try :
                resp = gKube.create_namespace(namespace_name)
                if resp == 'exist' :
                    result = 'fail' 
                    error_msg= 'exist'
                else :
                    result = 'success'
                    error_msg= None
            except :
                print('failure of create_namespace')
                result = 'fail'
                error_msg= 'internal error'
            temp_msg = {
                'request_id': request_id,
                'method'    : method,
                'result'    : { 'status':result,
                                'error_msg' : error_msg
                }
            }
            self.send_result('API',request_id, temp_msg)
        elif method == 'delete' :
            try :
                resp = gKube.delete_namespace(namespace_name)
                if resp == 'empty' or resp == 'error' :
                    result = 'fail' 
                    error_msg= resp
                else :
                    result = 'success'
                    error_msg= None
            except :
                print('failure of delete_namespace')
                result = 'fail'
                error_msg= 'internal error'
            temp_msg = {
                'request_id': request_id,
                'method'    : method,
                'result'    : { 'status':result,
                                'error_msg' : error_msg
                }
            }
            self.send_result('API',request_id, temp_msg)
        else :
            result = 'fail'
            temp_msg = {
                'request_id': request_id,
                'method'    : method,
                'result'    : { 'status':result,
                                'error_msg' : 'not support method'
                }
            }
            self.send_result('API',request_id, temp_msg)
    
    '''-----------------------------------
         HCODE : 530  LCODE :1
    --------------------------------------'''
    def request_source_node_by_pod_name(self, topic_data):
        
        print('start-----------------request_source_node_by_pod_name')
        print('topic_data',topic_data)
        if 'request_id' not in topic_data['msg']:
            print('request_id not in topic_data[msg]')
            return
        request_id = topic_data['msg']['request_id']
        
        if 'method' not in topic_data['msg']:
            print('method not in topic_data[msg]')
            return
        method = topic_data['msg']['method']
        
        if 'mode' not in topic_data['msg']:
            print('mode not in topic_data[msg]')
            return
        mode = topic_data['msg']['mode']
        
        if 'parameters' not in topic_data['msg']:
            print('data not in topic_data[msg]')
            return
        parameters_data = topic_data['msg']['parameters']
        
        error_msg   = None
        source_node = None
        if method == 'read' :
            try :
                
                r = gKube.get_hostname_by_namespaced_pod_name(parameters_data['namespace_name'],parameters_data['pod_name'])
                if r == None :
                    result = 'fail'
                    error_msg= 'is not exist podd' 
                else :
                    result = 'success'
                    source_node = r
                    print('source_node',source_node)
            except :
                print('failure of create_namespace')
                result = 'fail'
                error_msg= 'internal error'
            temp_msg = {
                'request_id': request_id,
                'method'    : method,
                'result'    : { 
                    'status'     : result,
                    'source_node': source_node,
                    'error_msg'  : error_msg
                }
            }
            self.send_result('API',request_id, temp_msg)
        else :
            result = 'fail'
            temp_msg = {
                'request_id': request_id,
                'method'    : method,
                'result'    : { 'status':result,
                                'error_msg' : 'not support method'
                }
            }
            self.send_result('API',request_id, temp_msg)
            
    '''-----------------------------------
         CLUSTER AGENT FUNCTIONS POINTER
    --------------------------------------'''
    cluster_agent_functions = { 
        200:{ 1:request_clusters_latency },
        210:{ 1:apply_GLowLatencyPriority_yaml },
        300:{ 1:request_clusters_available_resource },
        310:{ 1:apply_GMostRequestedPriority_yaml },
        400:{ 1:apply_GSelectedCluster_yaml },
        520:{ 1:project_GAPI_handler },
        530:{ 1:request_source_node_by_pod_name}
    }   
    
    def call_cluster_agent_function(self, topic_data):
        print('start : proccess_request',topic_data)
        if 'request_id' not in topic_data['msg']:
            print('request_id not in topic_data[msg]')
            return
        
        request_id = topic_data['msg']['request_id']
        
        if 'target' not in topic_data:
            print('target not in topic_data')
            return

        if 'type' not in topic_data['target']:
            self.send_error('GSCH',request_id, 'type not in topic_data[target]')
            return

        if 'object' not in topic_data['target']:
            self.send_error('GSCH',request_id, 'object not in topic_data[target]')
            return
        
        target_type   = topic_data['target']['type']
        target_object = topic_data['target']['object']
        print('target_object',target_object)
        select_clusters=[]
        if type(target_object).__name__ == 'str':
            select_clusters.append(target_object)
        elif type(target_object).__name__ == 'list': 
            select_clusters.extend(target_object)
        else :
            self.send_error('GSCH',request_id, 'This object is not a supported form'+str(type(target_object)))
            return

        if target_type != 'cluster' or (self.cluster_name not in select_clusters):
            print('This message is not needed for this cluster.')
            print('self.cluster_name',self.cluster_name)
            print('select_clusters',select_clusters)
            return  
        if 'hcode' not in topic_data:
            print('hcode not in topic_data')
            return
        if 'lcode' not in topic_data:
            print('lcode not in topic_data')
            return
        
        hcode = int(topic_data['hcode'])
        lcode = int(topic_data['lcode'])
        try :
            self.cluster_agent_functions[hcode][lcode](self,topic_data)
        except Exception as e: 
            print('===============================================================')
            print('====> unspporeted protocol :',hcode,lcode,e)
            print('===============================================================')

    def processing_kafka_message_for_GSCH_request_job(self): 
        group_id_GSCH = self.cluster_name + str(uuid.uuid4())
        self.Kafka_for_GSCH.set_consumer(gDefine.GEDGE_GLOBAL_GSCH_TOPIC_NAME,group_id_GSCH)
        try :   
            self.Kafka_for_GSCH.set_consumer_offset_to_end(gDefine.GEDGE_GLOBAL_GSCH_TOPIC_NAME,0)
        except Exception as e: 
            print('===============================================================')
            print('====> warning set_consumer_offset_to_end for GSCH_TOPIC error:',e)
            print('===============================================================')
            
        print('Begin listening GSCH topic messages of kafka')        
        while True:
            time.sleep(2)
            #print('GSCH-1')
            msg_pack = self.Kafka_for_GSCH.consumer.poll()
            #print('GSCH-2')
            for tp, messages in msg_pack.items():
                for message in messages: 
                    print("Topic: %s, Partition: %d, Offset: %d, Key: %s, Value: %s" % ( message.topic, message.partition, message.offset, message.key, message.value ))
                    print('tp',tp)
                    self.call_cluster_agent_function(message.value)
    
    def processing_kafka_message_for_API_request_job(self):
        
        group_id_API = self.cluster_name + str(uuid.uuid4())
        self.kafka_for_API.set_consumer(gDefine.GEDGE_GLOBAL_API_TOPIC_NAME,group_id_API)
        try :   
            self.kafka_for_API.set_consumer_offset_to_end(gDefine.GEDGE_GLOBAL_API_TOPIC_NAME,0)  
        except Exception as e: 
            print('===============================================================')
            print('====> warning set_consumer_offset_to_end for API_TOPIC')
            print('===============================================================')
        print('Begin listening API topic messages of kafka')
        while True:
            time.sleep(2)
            #print('API-1')
            msg_pack = self.kafka_for_API.consumer.poll()
            #print('API-2')
            for tp, messages in msg_pack.items():
                for message in messages: 
                    print("Topic: %s, Partition: %d, Offset: %d, Key: %s, Value: %s" % ( message.topic, message.partition, message.offset, message.key, message.value ))
                    print('tp',tp)
                    self.call_cluster_agent_function(message.value)

if __name__ == '__main__':
    
    GE_ClusterAgent = ClusterAgent(caDefine.SELF_CLUSTER_NAME,caDefine.SELF_CLUSTER_TYPE,caDefine.APPLY_YAMLS_PATH)
    '''-------------------------------------------------------------------------------------------------------
           GLOBAL CLUSTER GSCH THREAD 
    -------------------------------------------------------------------------------------------------------'''
    t1 = threading.Thread(target=GE_ClusterAgent.processing_kafka_message_for_GSCH_request_job)
    t1.daemon = True 
    t1.start()
    '''-------------------------------------------------------------------------------------------------------
           GLOBAL CLUSTER API THREAD 
    -------------------------------------------------------------------------------------------------------'''
    t2 = threading.Thread(target=GE_ClusterAgent.processing_kafka_message_for_API_request_job)
    t2.daemon = True 
    t2.start()
    
    rest_API_service()  