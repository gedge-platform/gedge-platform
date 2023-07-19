import sys
sys.path.append('../gelib')
sys.path.append('../gedef')

from kafka import KafkaProducer
from kafka import KafkaConsumer, TopicPartition
from kafka import KafkaAdminClient
import json
from json import dumps
from json import loads 
import time 
import os
import requests
import redis
import yaml
import GE_define as gDefine
import GE_GSCH_define_ca as caDefine
import GE_kubernetes as gKube
import GE_platform_util as pUtil

from GE_meta_data import metaData
from GE_redis import redisController

from   operator import itemgetter
import quantity

from kubernetes import client, config, utils, watch 
from kubernetes.client.rest import ApiException
import shutil
import uuid

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
        r = pUtil.find_platform_namespaced_service_with_rest_api(gDefine.GEDGE_SYSTEM_NAMESPACE, gDefine.KAFKA_SERVICE_NAME)
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
        r = pUtil.find_platform_namespaced_service_with_rest_api(gDefine.GEDGE_SYSTEM_NAMESPACE,gDefine.REDIS_SERVICE_NAME)
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
        r = pUtil.find_platform_namespaced_service_with_rest_api(gDefine.GEDGE_SYSTEM_NAMESPACE,gDefine.MONGO_DB_SERVICE_NAME)
        if r : 
            gDefine.MONGO_DB_ENDPOINT_IP   = r['access_host']
            gDefine.MONGO_DB_ENDPOINT_PORT = r['access_port']
            print(gDefine.MONGO_DB_ENDPOINT_IP,gDefine.MONGO_DB_ENDPOINT_PORT)    
            print('3')
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

def get_end_offsets(consumer, topic) -> dict:
    t_end_offsets = None
    print('--1consumer', consumer)
    partitions_for_topic = consumer.partitions_for_topic(topic)
    print('--2partitions_for_topic', partitions_for_topic)
    if partitions_for_topic:
        print('--3')
        partitions = []
        for partition in consumer.partitions_for_topic(topic):
            partitions.append(TopicPartition(topic, partition))
            print('--4')
        # https://kafka-python.readthedocs.io/en/master/apidoc/KafkaConsumer.html#kafka.KafkaConsumer.end_offsets
        # Get the last offset for the given partitions. The last offset of a partition is the offset of the upcoming message, i.e. the offset of the last available message + 1.
        print('--5')
        if len(partitions) > 0 :
            print('--6',partitions)
            t_end_offsets = consumer.end_offsets(partitions)
            print('--7')
    print('--8t_end_offsets', t_end_offsets)
    return t_end_offsets

class ClusterAgent:
    apply_yaml_list = []
    def __init__(self, cluster_name, cluster_type, apply_yaml_path):
        self.apply_yaml_path = apply_yaml_path
        self.cluster_name = cluster_name
        self.cluster_type = cluster_type
        self.kafka_group_id = cluster_name + str(uuid.uuid4())
        self.CAredis = redisController()
        self.CAredis.connect_redis_server(gDefine.REDIS_ENDPOINT_IP,gDefine.REDIS_ENDPOINT_PORT)
        self.redis_conn = self.CAredis.redisConn   
        
        self.cluster_info_dic = pUtil.get_cluster_info_dic_with_k8s(self.cluster_name,self.cluster_type)
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
        #print('pod_manifest:',pod_manifest)
        try:
            print('1')
            r = v1.read_namespaced_pod(name=name, namespace=namespace)
            print('2')
            #print('result:',r)
            return 'cancel'
        except ApiException as e:
            if e.status != 404:
                print("Error: %s" % e.body)
                return 'fail'
        try:
            print('3')
            r = v1.create_namespaced_pod(body=pod_manifest, namespace=namespace)
            print('4')
            time.sleep(caDefine.APPLY_AFTER_DELAY_SECOND_TIME)
            try_count=caDefine.APPLY_RESULT_CHECK_RETRY_COUNT
            while True:
                print('5')
                r2 = v1.read_namespaced_pod(name=name, namespace=namespace)
                print('6')
                if r2.status.phase != 'Pending' :
                    print('7')
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
    
    def transfer_with_GLowLatencyPriority_yaml(self,yaml_dic,requestData_dic):
        #with open('nginx_dep.yaml') as f:
        #    yaml_dic = yaml.load(f,Loader=yaml.FullLoader)
                
        transfered_yaml_dic_list = []
        for single_yaml_dic in yaml_dic :
            if single_yaml_dic == None :
                continue
            # print('=========single_yaml_dic==============',single_yaml_dic)
            try :
                t_priority      = requestData_dic['env']['priority']
                t_sourceCluster = requestData_dic['env']['option']['sourceCluster']
                
                if t_sourceCluster == caDefine.SELF_CLUSTER_NAME :
                    t_sourceNode = requestData_dic['env']['option']['sourceNode']
                else :
                    # get master node 
                    r_master_node=GE_metaData.get_node_info_by_node_type(caDefine.SELF_CLUSTER_NAME,'master')
                    if r_master_node != None :
                        t_sourceNode = r_master_node['node_name']
                    else :
                        print('error: get_node_info_by_node_type')
                        return None
                adding_env={'type':'local','priority':t_priority,'option':{'sourceNode':t_sourceNode}}
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
                    print('e-1')                        
                    transfered_yaml_dic_list.append(single_yaml_dic)
                    print('e-2')   

                elif single_yaml_dic['kind'] == 'Pod':
                    containers = single_yaml_dic['spec']['containers']
                    print('--------------------------------')
                    spec = single_yaml_dic['spec']
                    print('1-')
                    # insert gedge scheduler name 
                    spec['schedulerName']=caDefine.GEDGE_SCHEDULER_NAME
                    print('2-')
                    for i in range(0,len(containers)):
                        #single_yaml_dic['spec']['containers'][i]['env']=[{'name':caDefine.GEDGE_SCHEDULER_CONFIG_NAME,'value':adding_env_json}]
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
                print('!!!!!!!!!!except!!!!!!! ',e)
                return None
        #print('==========transfered_yaml_dic_list=============',transfered_yaml_dic_list)    
        return transfered_yaml_dic_list
    
    def transfer_with_GMostRequestedPriority_yaml(self,yaml_dic,requestData_dic):
        #with open('nginx_dep.yaml') as f:
        #    yaml_dic = yaml.load(f,Loader=yaml.FullLoader)
        print('=========transfer_with_GMostRequestedPriority_yaml==============')
        transfered_yaml_dic_list = []
        for single_yaml_dic in yaml_dic :
            #print('=========single_yaml_dic==============',single_yaml_dic)
            try :
                t_priority   = requestData_dic['env']['priority']
                adding_env={'type':'local','priority':t_priority}
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
                    print('e-1')                        
                    transfered_yaml_dic_list.append(single_yaml_dic)
                    print('e-2')   
                    
                elif single_yaml_dic['kind'] == 'Pod':
                    containers = single_yaml_dic['spec']['containers']
                    print('--------------------------------')
                    spec = single_yaml_dic['spec']
                    print('1-')
                    # insert gedge scheduler name 
                    spec['schedulerName']=caDefine.GEDGE_SCHEDULER_NAME
                    print('2-')
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
        print('==========transfered_yaml_dic_list=============')    
        # print('==========transfered_yaml_dic_list=============',transfered_yaml_dic_list)    
        return transfered_yaml_dic_list
    
    def send_error(self,request_id, message):
        d = {'source': {'type':'cluster', 'object': self.cluster_name},
                'target':{'type':'none'},
                'hcode':900,
                'lcode':2,
                'msg': {'result': 'error', 'message': message }
        }
        producer = KafkaProducer(acks=0, 
                    compression_type='gzip', 
                    bootstrap_servers=[gDefine.KAFKA_SERVER_URL], 
                    value_serializer=lambda x: dumps(x).encode('utf-8')) 
        producer.send(request_id, value=d)
        producer.flush()

    def send_result(self,request_id, topicData):
        producer = KafkaProducer(acks=0, 
                            compression_type='gzip', 
                            bootstrap_servers=[gDefine.KAFKA_SERVER_URL], 
                            value_serializer=lambda x: dumps(x).encode('utf-8')) 

        print('send_result topic : ', request_id, topicData)
        producer.send(request_id, value=topicData)
        producer.flush()
    
    '''-----------------------------------
         HCODE : 210  LCODE :1
    --------------------------------------'''
    def apply_GLowLatencyPriority_yaml(self, topicData):
        '''
        from kubernetes import client, config, utils
        config.load_kube_config()
        k8s_client = client.ApiClient()
        yaml_file = '<location to your multi-resource file>'
        utils.create_from_yaml(k8s_client, yaml_file)
        create_from_dict(k8s_client, data, verbose=False, namespace='default',**kwargs):
        '''
        print('start------------------------------------apply_yaml')
        if 'requestID' not in topicData['msg']:
            print('requestID not in topicData[msg]')
            return
        requestID = topicData['msg']['requestID']
        if 'fileID' not in topicData['msg']:
            print('fileID not in topicData[msg]')
            return
        fileID = topicData['msg']['fileID']
        if 'type' not in topicData['target']:
            self.send_error(requestID, 'type not in topicData[target]')
            return
        if 'object' not in topicData['target']:
            self.send_error(requestID, 'object not in topicData[target]')
            return
        if 'requestData' not in topicData['msg']:
            self.send_error(requestID, 'requestData not in topicData[msg]')
            return
        print('end------------------------------------apply_yaml')

        yaml_file = self.get_yaml_file_from_redis(fileID)
        
        print('topicData[''msg''][''requestData'']',topicData['msg']['requestData'])
        '''
        {'requestID': 'req-b9494ca5-6e9a-4ab3-8392-8795f0b5eb3e', 'date': '2021-10-21 12:05:54', 'status': 'create', 
        'fileID': 'b2ab5fbe-e7bf-44dc-84d7-b969ad62f104', 'failCnt': 0, 'env': {'type': 'global', 'targetClusters': ['c1', ['c2', 'c3'], 'c4'], 
        'priority': 'GLowLatencyPriority', 'option': {'sourceCluster': 'c1', 'sourceNode': 'a-worker-node01'}}}
        '''
        result = 'cancel'

        if yaml_file != None :
            #transter normal yaml file to gedge yaml file 
            transfered_yaml_dic_list=self.transfer_with_GLowLatencyPriority_yaml(yaml.load_all(yaml_file,Loader=yaml.FullLoader),topicData['msg']['requestData'])
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
        
        temp_msg = {'source': {'type':'cluster', 'object': self.cluster_name},
                'target':{'type':'none'},
                'hcode':210,
                'lcode':2,
                'msg':{'result': result}
        }
        self.send_result(requestID, temp_msg)
    
    '''-----------------------------------
         HCODE : 200  LCODE :1
    --------------------------------------'''
    def request_clusters_latency(self,topicData):

        print('------------------------------------request_clusters_latency')
        print('------------------------------------topicData', topicData)
        '''
        topicData {'source': {'type': 'none'}, 'target': {'type': 'cluster', 'object': 'c1'}, 'hcode': 200, 'lcode': 1, 'msg': {'requestID': 'req-7092d391-e4a3-4f2f-8e50-0acd4a35189a', 'sourceNode': 'a-worker-node01', 'targetClusters': ['c2', 'c3']}}
        '''
        if 'requestID' not in topicData['msg']:
            print('requestID not in topicData[msg]')
            return
        requestID = topicData['msg']['requestID']
        if 'sourceNode' not in topicData['msg']:
            print('sourceNode not in topicData[msg]')
            return
        t_sourceNode = topicData['msg']['sourceNode']
        if 'targetClusters' not in topicData['msg'] :
            print('targetClusters not in topicData[msg]')
            return
        t_targetClusters = topicData['msg']['targetClusters']

        result_list=[]
        print('t_targetClusters:',t_targetClusters)
        for cluster in t_targetClusters :
            print('cluster', cluster)
            print('t_sourceNode', t_sourceNode)
            # print('self.agentsInfo', self.agentsInfo)
            agent_pod_ip = self.agentsInfo[t_sourceNode]['pod_ip']
            # call rest api
            url = 'http://'+str(agent_pod_ip)+':8787'+'/monitoring/clusters/'+str(cluster)+'/latency'

            print("url=", url)
            headers = {'Content-type': 'application/json'}
            print("<<1-1>>")
            try:
                print("<<1>>")
                response = requests.get(url, headers=headers )
                response_dic=response.json()
                print('response_dic[Result]',response_dic['Result'] )
                print("<<2>>")
                result_list.append({'cluster':cluster, 'latency':response_dic['Result']})
                print("<<3>>")
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
        self.send_result(requestID, temp_msg)
    
    '''-----------------------------------
         HCODE : 300  LCODE :1
    --------------------------------------'''
    def request_clusters_available_resource(self,topicData):
        print('------------------------------------request_clusters_available_resource')
        print('------------------------------------topicData', topicData)
        '''
        topicData {'source': {'type': 'none'}, 'target': {'type': 'cluster', 'object': 'c1'}, 'hcode': 300, 'lcode': 1, 
                   'msg': {'requestID': 'req-7092d391-e4a3-4f2f-8e50-0acd4a35189a','GPUFilter': 'necessary'/'unnecessary'}}
        '''
        if 'requestID' not in topicData['msg']:
            print('requestID not in topicData[msg]')
            return
        if 'GPUFilter' not in topicData['msg']:
            print('GPUFilter not in topicData[msg]')
            return
        requestID = topicData['msg']['requestID']
        GPUFilter = topicData['msg']['GPUFilter']
        # get cluster resource data
        '''
        result: { 'cluster_name': 'c1','node_name': 'cswnode2', 'cpu': 0.20833333333333334, 'memory': 0.025937689523708434, 'nvidia.com/gpu': 1, 'score': 399.76572897714294 }
        '''
        result = get_cluster_resource_status(GPUFilter)
        
        temp_msg = {'source': {'type':'cluster', 'object': self.cluster_name},
                'target':{'type':'none'},
                'hcode':300,
                'lcode':2,
                'msg':{'result': result}
        }
        self.send_result(requestID, temp_msg)
    
    '''-----------------------------------
         HCODE : 310  LCODE :1
    --------------------------------------'''
    def apply_GMostRequestedPriority_yaml(self, topicData):
        '''
        from kubernetes import client, config, utils
        config.load_kube_config()
        k8s_client = client.ApiClient()
        yaml_file = '<location to your multi-resource file>'
        utils.create_from_yaml(k8s_client, yaml_file)
        create_from_dict(k8s_client, data, verbose=False, namespace='default',**kwargs):
        '''
        print('start------------------------------------apply_yaml')
        if 'requestID' not in topicData['msg']:
            print('requestID not in topicData[msg]')
            return
        print('1-1')
        requestID = topicData['msg']['requestID']
        if 'fileID' not in topicData['msg']:
            print('fileID not in topicData[msg]')
            return
        print('1')
        fileID = topicData['msg']['fileID']
        print('2')
        if 'type' not in topicData['target']:
            self.send_error(requestID, 'type not in topicData[target]')
            return
        print('3')
        if 'object' not in topicData['target']:
            self.send_error(requestID, 'object not in topicData[target]')
            return
        print('4')
        if 'requestData' not in topicData['msg']:
            self.send_error(requestID, 'requestData not in topicData[msg]')
            return
        print('end------------------------------------apply_yaml')

        yaml_file = self.get_yaml_file_from_redis(fileID)
        
        print('topicData[''msg''][''requestData'']',topicData['msg']['requestData'])
        '''
        {'requestID': 'req-b9494ca5-6e9a-4ab3-8392-8795f0b5eb3e', 'date': '2021-10-21 12:05:54', 'status': 'create', 
        'fileID': 'b2ab5fbe-e7bf-44dc-84d7-b969ad62f104', 'failCnt': 0, 'env': {'type': 'global', 'targetClusters': ['c1', ['c2', 'c3'], 'c4'], 
        'priority': 'GMostRequestedPriority'}}
        '''
        result = 'cancel'

        if yaml_file != None:
            #transter normal yaml file to gedge yaml file 
            transfered_yaml_dic_list=self.transfer_with_GMostRequestedPriority_yaml(yaml.load_all(yaml_file,Loader=yaml.FullLoader),topicData['msg']['requestData'])
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

        temp_msg = {'source': {'type':'cluster', 'object': self.cluster_name},
                'target':{'type':'none'},
                'hcode':310,
                'lcode':2,
                'msg':{'result': result}
        }
        self.send_result(requestID, temp_msg)
    
    '''-----------------------------------
         HCODE : 400  LCODE :1
    --------------------------------------'''
    def apply_GSelectedCluster_yaml(self, topicData):
        
        print('start-----------------apply_GSelectedCluster_yaml')
        if 'requestID' not in topicData['msg']:
            print('requestID not in topicData[msg]')
            return
        print('1')
        requestID = topicData['msg']['requestID']
        if 'fileID' not in topicData['msg']:
            print('fileID not in topicData[msg]')
            return
        print('1')
        fileID = topicData['msg']['fileID']
        print('2')
        if 'type' not in topicData['target']:
            self.send_error(requestID, 'type not in topicData[target]')
            return
        print('3')
        if 'object' not in topicData['target']:
            self.send_error(requestID, 'object not in topicData[target]')
            return
        print('4')
        if 'requestData' not in topicData['msg']:
            self.send_error(requestID, 'requestData not in topicData[msg]')
            return
        print('end---------------------apply_GSelectedCluster_yaml')

        yaml_file = self.get_yaml_file_from_redis(fileID)

        print('5')
        print('topicData[''msg''][''requestData'']',topicData['msg']['requestData'])
        '''
        {'requestID': 'req-b9494ca5-6e9a-4ab3-8392-8795f0b5eb3e', 'date': '2021-10-21 12:05:54', 'status': 'create', 
        'fileID': 'b2ab5fbe-e7bf-44dc-84d7-b969ad62f104', 'failCnt': 0, 'env': {'type': 'global', 'targetClusters': ['c1', 'c2', 'c3'], 
        'priority': 'GSelectedCluster'}}
        '''
        
        if yaml_file != None:
            uploads_dir = str(caDefine.CLUSTER_AGENT_SAVE_PATH)+str('/')+str(fileID)
            print("o-3")
            print("dir:",uploads_dir)
            os.makedirs(uploads_dir,exist_ok=True)
            print("o-4")
            full_filename = uploads_dir+str('/')+str(fileID)
            print("o-5")
            ff = open(full_filename, "wb")
            print("o-6")
            ff.write(yaml_file)
            print("o-7")
            ff.close()
            print("o-8")
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
            print('--error : yaml file read ')
            result = 'cancel'
        print('--create_from_yaml is completed :',result)
        temp_msg = {'source': {'type':'cluster', 'object': self.cluster_name},
                'target':{'type':'none'},
                'hcode':400,
                'lcode':2,
                'msg':{'result': result}
        }
        print('11')
        self.send_result(requestID, temp_msg)
        print('12')

    '''-----------------------------------
         CLUSTER AGENT FUNCTIONS POINTER
    --------------------------------------'''
    functions={ 200:{ 1:request_clusters_latency },
                210:{ 1:apply_GLowLatencyPriority_yaml },
                300:{ 1:request_clusters_available_resource },
                310:{ 1:apply_GMostRequestedPriority_yaml },
                400:{ 1:apply_GSelectedCluster_yaml }
              }   

    def proccess_request(self, topicData):
        print('start : proccess_request')
        if 'requestID' not in topicData['msg']:
            print('requestID not in topicData[msg]')
            return
        
        requestID = topicData['msg']['requestID']
        
        if 'target' not in topicData:
            print('target not in topicData')
            return

        if 'type' not in topicData['target']:
            self.send_error(requestID, 'type not in topicData[target]')
            return

        if 'object' not in topicData['target']:
            self.send_error(requestID, 'object not in topicData[target]')
            return
        
        target_type   = topicData['target']['type']
        target_object = topicData['target']['object']
        print('target_object',target_object)
        target_clusters=[]
        if type(target_object).__name__ == 'str':
            target_clusters.append(target_object)
        elif type(target_object).__name__ == 'list': 
            target_clusters.extend(target_object)
        else :
            self.send_error(requestID, 'This object is not a supported form'+str(type(target_object)))
            return

        if target_type != 'cluster' or (self.cluster_name not in target_clusters):
            print('This message is not needed for this cluster.')
            print('self.cluster_name',self.cluster_name)
            print('target_clusters',target_clusters)
            return  
        if 'hcode' not in topicData:
            print('hcode not in topicData')
            return
        if 'lcode' not in topicData:
            print('lcode not in topicData')
            return
        
        hcode = int(topicData['hcode'])
        lcode = int(topicData['lcode'])
        try :
            print('111',self.functions)
            self.functions[hcode][lcode](self,topicData)
            print('222')
        except Exception as e: 
            print('===============================================================')
            print('====> unspporeted protocol :',hcode,lcode,e)
            print('===============================================================')

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

        t_node_info_dic_list = pUtil.get_nodes_info_dic_with_k8s(caDefine.SELF_CLUSTER_NAME)
        for t_node_info_dic in t_node_info_dic_list :
            print('===============================================================')
            print('write node information to mongo db')
            print('t_node_info_dic',t_node_info_dic)
            print('===============================================================')
            GE_metaData.set_node_info(t_node_info_dic)
            print('===============================================================')
            print('get_node_info_list')
        GE_metaData.get_node_info_list()
    
    def processing_for_GSCH_request_job(self):    
        consumer = KafkaConsumer(
                            bootstrap_servers = [gDefine.KAFKA_SERVER_URL], 
                            auto_offset_reset = 'latest', 
                            enable_auto_commit = True, 
                            group_id = self.kafka_group_id, 
                            value_deserializer = lambda x: loads(x.decode('utf-8'))
        )
        end_offsets = get_end_offsets(consumer, gDefine.GEDGE_GLOBAL_GSCH_TOPIC_NAME)
        consumer.assign([*end_offsets])

        for key_partition, value_end_offset in end_offsets.items():
            new_calculated_offset = value_end_offset - 0
            new_offset = new_calculated_offset if new_calculated_offset >= 0 else 0
            consumer.seek(key_partition, new_offset)

        print('Begin listening Global topic messages of kafka')

        while True:
            time.sleep(1)
            msg_pack = consumer.poll()
            for tp, messages in msg_pack.items():
                for message in messages: 
                    print("Topic: %s, Partition: %d, Offset: %d, Key: %s, Value: %s" % ( message.topic, message.partition, message.offset, message.key, message.value ))
                    print('tp',tp)
                    self.proccess_request(message.value)

if __name__ == '__main__':
    GE_ClusterAgent = ClusterAgent(caDefine.SELF_CLUSTER_NAME,caDefine.SELF_CLUSTER_TYPE,caDefine.APPLY_YAMLS_PATH)
    GE_ClusterAgent.processing_for_GSCH_request_job()
