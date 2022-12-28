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
import GE_platform_util as gUtil

from GE_meta_data import metaData
from GE_redis import redisController

from kubernetes import client, config, utils 
from kubernetes.client.rest import ApiException
import shutil
import sys
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
        r = gUtil.find_service_from_platform_service_list_with_rest_api(gDefine.KAFKA_SERVICE_NAME)
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
        r = gUtil.find_service_from_platform_service_list_with_rest_api(gDefine.REDIS_SERVICE_NAME)
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
        r = gUtil.find_service_from_platform_service_list_with_rest_api(gDefine.MONGO_DB_SERVICE_NAME)
        if r : 
            gDefine.MONGO_DB_ENDPOINT_IP   = r['access_host']
            gDefine.MONGO_DB_ENDPOINT_PORT = r['access_port']
            print(gDefine.MONGO_DB_ENDPOINT_IP,gDefine.MONGO_DB_ENDPOINT_PORT)    
            break
        else :
            print('wait for running platform service',)
            time.sleep(gDefine.WAIT_RUNNING_PLATFORM_SERVICES_SECOND_TIME) 
            continue
           
GE_metaData = metaData() 

init_gsch_cluster_agent()

GE_metaData.connect_mongodb(ip=gDefine.MONGO_DB_ENDPOINT_IP,port=int(gDefine.MONGO_DB_ENDPOINT_PORT))

def get_end_offsets(consumer, topic) -> dict:
    t_end_offsets = None
    partitions_for_topic = consumer.partitions_for_topic(topic)
    if partitions_for_topic:
        partitions = []
        for partition in consumer.partitions_for_topic(topic):
            partitions.append(TopicPartition(topic, partition))
        # https://kafka-python.readthedocs.io/en/master/apidoc/KafkaConsumer.html#kafka.KafkaConsumer.end_offsets
        # Get the last offset for the given partitions. The last offset of a partition is the offset of the upcoming message, i.e. the offset of the last available message + 1.
        if len(partitions) > 0 :
            t_end_offsets = consumer.end_offsets(partitions)
    return t_end_offsets

class ClusterAgent:
    apply_yaml_list = []
    def __init__(self, cluster_name, cluster_type, apply_yaml_path):
        self.apply_yaml_path = apply_yaml_path
        self.cluster_name = cluster_name
        self.cluster_type = cluster_type
        self.apply_yaml_files()
        self.kafka_group_id = cluster_name + str(uuid.uuid4())
        self.CAredis = redisController(gDefine.REDIS_ENDPOINT_IP,gDefine.REDIS_ENDPOINT_PORT)
        self.redis_conn = self.CAredis.redisConn   
        self.cluster_info_dic = gUtil.get_cluster_info_dic_with_k8s(self.cluster_name,self.cluster_type)
        self.agentsInfo = {}
        self.get_worker_agents_info()
        self.start()
    '''
    agentsInfo = {
        'node_name1' : {'pod_name': 'p1', 'pod_ip': ip1},
        'node_name2' : {'pod_name': 'p2', 'pod_ip': ip2} 
    }
    '''
    def apply_yaml_files(self) :
        import glob
        glob_str_list=[str(self.apply_yaml_path)+'/*.yaml',str(self.apply_yaml_path)+'/*.yml']

        for t_str in glob_str_list :
            self.apply_yaml_list.extend(glob.glob(t_str))
    
        for full_filename in self.apply_yaml_list:
            try:
                yaml_file = full_filename
                resp = utils.create_from_yaml(k8s_client, yaml_file)
            except utils.FailToCreateError as failure:
                exit(0)

    def get_worker_agents_info(self):
        
        is_worker_agent_ready = True
        # check and wait for running worker agent 
        while 1 :
            is_worker_agent_ready = True
            try:
                api_response = v1.list_namespaced_pod( caDefine.GEDGE_SCHEDULER_NAMESPACE, 
                                                    label_selector='app='+str(caDefine.WORKER_AGENT_LABEL) )
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
        return 0
    
    def get_yaml_file_from_redis(self, yaml_key):

        if self.redis_conn.hexists(gDefine.REDIS_YAML_KEY, yaml_key) == 0:
            return None
        return self.redis_conn.hget(gDefine.REDIS_YAML_KEY, yaml_key)
    
    def create_pod(self, name, namespace, pod_manifest):
        print('start create_pod')
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
            try_count=caDefine.APPLY_RESULT_CHECK_RETRY_COUNT
            while True:
                r = v1.read_namespaced_pod(name=name, namespace=namespace)
                if r.status.phase != 'Pending' :
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

    def apply_yaml(self, yaml_dic) :
        print('start apply_yaml')
        kind      = None
        name      = None
        namespace = None

        for key, value in yaml_dic.items():
            if key == 'kind':
                if value != 'Deployment' and value != 'Pod':
                    return 'cancel'
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
            print('Not support Resource : '+ kind)
            return 'cancel'
        return r
    
    def transfer_with_GLowLatencyPriority_yaml(self,yaml_dic,requestData_dic):
        #with open('nginx_dep.yaml') as f:
        #    yaml_dic = yaml.load(f,Loader=yaml.FullLoader)
        try :
            t_priority   = requestData_dic['env']['priority']
            t_sourceNode = requestData_dic['env']['option']['sourceNode']
            
            adding_env={'type':'local','priority':t_priority,'option':{'sourceNode':t_sourceNode}}
            adding_env_json = json.dumps(adding_env)
            if yaml_dic['kind'] == 'Deployment':
                print(yaml_dic['spec']['selector'])
                print(yaml_dic['spec']['template']['spec']['containers'])
                containers = yaml_dic['spec']['template']['spec']['containers']
                spec = yaml_dic['spec']['template']['spec']
                # insert gedge scheduler name 
                spec['schedulerName']=caDefine.GEDGE_SCHEDULER_NAME
                for i in range(0,len(containers)):
                    yaml_dic['spec']['template']['spec']['containers'][i]['env']=[{'name':caDefine.GEDGE_SCHEDULER_CONFIG_NAME,'value':adding_env_json}]
                with open('deployment_GLowLatencyPriority.yaml', 'w') as z:
                    yaml.dump(yaml_dic, z)
                return yaml_dic

            elif yaml_dic['kind'] == 'Pod':
                containers = yaml_dic['spec']['containers']
                spec = yaml_dic['spec']
                # insert gedge scheduler name 
                spec['schedulerName']=caDefine.GEDGE_SCHEDULER_NAME
                for i in range(0,len(containers)):
                    yaml_dic['spec']['containers'][i]['env']=[{'name':caDefine.GEDGE_SCHEDULER_CONFIG_NAME,'value':adding_env_json}]
                with open('pod_GLowLatencyPriority.yaml', 'w') as z:
                    yaml.dump(yaml_dic, z)
                return yaml_dic
            else :
                print('this yaml is not deployment or pod ')
                return None
            #with open('fruits.yaml', 'w') as z:
            #    yaml.dump(yaml_dic, z)
        except:
            return None

    def transfer_with_GMostRequestedPriority_yaml(self,yaml_dic,requestData_dic):
        #with open('nginx_dep.yaml') as f:
        #    yaml_dic = yaml.load(f,Loader=yaml.FullLoader)
        try :
            t_priority   = requestData_dic['env']['priority']
            adding_env={'type':'local','priority':t_priority}
            adding_env_json = json.dumps(adding_env)
            if yaml_dic['kind'] == 'Deployment':
                print(yaml_dic['spec']['selector'])
                print(yaml_dic['spec']['template']['spec']['containers'])
                containers = yaml_dic['spec']['template']['spec']['containers']
                print('--------------------------------')
                spec = yaml_dic['spec']['template']['spec']
                # insert gedge scheduler name 
                spec['schedulerName']=caDefine.GEDGE_SCHEDULER_NAME
                for i in range(0,len(containers)):
                    yaml_dic['spec']['template']['spec']['containers'][i]['env']=[{'name':caDefine.GEDGE_SCHEDULER_CONFIG_NAME,'value':adding_env_json}]
                with open('deployment_GMostRequestedPriority.yaml', 'w') as z:
                    yaml.dump(yaml_dic, z)
                return yaml_dic

            elif yaml_dic['kind'] == 'Pod':
                containers = yaml_dic['spec']['containers']
                spec = yaml_dic['spec']
                # insert gedge scheduler name 
                spec['schedulerName']=caDefine.GEDGE_SCHEDULER_NAME
                for i in range(0,len(containers)):
                    yaml_dic['spec']['containers'][i]['env']=[{'name':caDefine.GEDGE_SCHEDULER_CONFIG_NAME,'value':adding_env_json}]
                with open('pod_GMostRequestedPriority.yaml', 'w') as z:
                    yaml.dump(yaml_dic, z)
                return yaml_dic
            else :
                print('this yaml is not deployment or pod ')
                return None
            #with open('fruits.yaml', 'w') as z:
            #    yaml.dump(yaml_dic, z)
        except:
            return None

    def send_error(self,request_id, message):

        d = {'source': {'type':'cluster', 'object': self.cluster_name},
                'target':{'type':'none'},
                'hcode':900,
                'lcode':2,
                'error': message
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

        yaml_file = self.get_yaml_file_from_redis(fileID)
        
        result = 'cancel'

        if yaml_file != None:
            #transter normal yaml file to gedge yaml file 
            transfered_yaml_dic=self.transfer_with_GLowLatencyPriority_yaml(yaml.load(yaml_file,Loader=yaml.FullLoader),topicData['msg']['requestData'])
            if transfered_yaml_dic != None :
                result = self.apply_yaml(transfered_yaml_dic)
            else :
                result = 'fail'
        else:
            print('error : yaml file read ')
            result = 'cancel'

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
            print('self.agentsInfo', self.agentsInfo)
            agent_pod_ip = self.agentsInfo[t_sourceNode]['pod_ip']
            # call rest api
            url = 'http://'+str(agent_pod_ip)+':8787'+'/monitoring/cluster/'+str(cluster)+'/latency'
            headers = {'Content-type': 'application/json'}
            try:
                response = requests.get(url, headers=headers )
                response_dic=response.json()
                print('response_dic[Result]',response_dic['Result'] )
                result_list.append({'cluster':cluster, 'latency':response_dic['Result']})
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
        topicData {'source': {'type': 'none'}, 'target': {'type': 'cluster', 'object': 'c1'}, 'hcode': 300, 'lcode': 1, 'msg': {'requestID': 'req-7092d391-e4a3-4f2f-8e50-0acd4a35189a'}}
        '''
        if 'requestID' not in topicData['msg']:
            print('requestID not in topicData[msg]')
            return
        requestID = topicData['msg']['requestID']
        # get cluster resource data
        '''
        result: {'cpu':90 ,'memory':87, 'memory_szie_mbyte':12000, 'score': 177 }
        '''
        result = gUtil.get_cluster_resource_status()
        
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
        'priority': 'GMostRequestedPriority'}}
        '''
        result = 'cancel'

        if yaml_file != None:
            #transter normal yaml file to gedge yaml file 
            transfered_yaml_dic=self.transfer_with_GMostRequestedPriority_yaml(yaml.load(yaml_file,Loader=yaml.FullLoader),topicData['msg']['requestData'])
            if transfered_yaml_dic != None :
                result = self.apply_yaml(transfered_yaml_dic)
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
        print('end---------------------apply_GSelectedCluster_yaml')

        yaml_file = self.get_yaml_file_from_redis(fileID)

        print('topicData[''msg''][''requestData'']',topicData['msg']['requestData'])
        '''
        {'requestID': 'req-b9494ca5-6e9a-4ab3-8392-8795f0b5eb3e', 'date': '2021-10-21 12:05:54', 'status': 'create', 
        'fileID': 'b2ab5fbe-e7bf-44dc-84d7-b969ad62f104', 'failCnt': 0, 'env': {'type': 'global', 'targetClusters': ['c1', 'c2', 'c3'], 
        'priority': 'GSelectedCluster'}}
        '''
        
        if yaml_file != None:
            uploads_dir = str(caDefine.CLUSTER_AGENT_SAVE_PATH)+str('/')+str(fileID)
            print("dir:",uploads_dir)
            os.makedirs(uploads_dir,exist_ok=True)
            full_filename = uploads_dir+str('/')+str(fileID)
            ff = open(full_filename, "wb")
            ff.write(yaml_file)
            ff.close()
            try :
                resp = utils.create_from_yaml(k8s_client, full_filename)
                #print('resp of utils.create_from_yaml ====>',resp)
                print('--create_from_yaml is completed ',yaml_file)
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
        
        temp_msg = {'source': {'type':'cluster', 'object': self.cluster_name},
                'target':{'type':'none'},
                'hcode':400,
                'lcode':2,
                'msg':{'result': result}
        }
        self.send_result(requestID, temp_msg)

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
        target_clusters=[]
        if type(target_object).__name__ == 'str':
            target_clusters.append(target_object)
        elif type(target_object).__name__ == 'list': 
            target_clusters.extend(target_object)
        else :
            self.send_error(requestID, 'This object is not a supported form')
            return

        if target_type != 'cluster' or (self.cluster_name not in target_clusters):
            print('This message is not needed for this cluster.')
            return  
        if 'hcode' not in topicData:
            print('hcode not in topicData')
            return
        if 'lcode' not in topicData:
            print('lcode not in topicData')
            return
        
        hcode = topicData['hcode']
        lcode = topicData['lcode']
        try :
            self.functions[hcode][lcode](self,topicData)
        except:
            print('===============================================================')
            print('====> unspporeted protocal :',topicData['hcode'],topicData['lcode'])
            print('===============================================================')

    def start(self):
        #write clustser information to mongo db
        t_cluster_info_dic = gUtil.get_cluster_info_dic_with_k8s(caDefine.SELF_CLUSTER_NAME,caDefine.SELF_CLUSTER_TYPE)
        print('===============================================================')
        print('write clustser information to mongo db')
        print('t_cluster_info_dic',t_cluster_info_dic)
        print('===============================================================')
        GE_metaData.set_cluster_info(t_cluster_info_dic)
        print('===============================================================')
        print('get_cluster_info_list')
        GE_metaData.get_cluster_info_list()

        consumer = KafkaConsumer( 
                            bootstrap_servers = [gDefine.KAFKA_SERVER_URL], 
                            auto_offset_reset = 'latest', 
                            enable_auto_commit = True, 
                            group_id = self.kafka_group_id, 
                            value_deserializer = lambda x: loads(x.decode('utf-8'))
        )
        end_offsets = get_end_offsets(consumer, gDefine.GEDGE_GLOBAL_TOPIC_NAME)
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
                    self.proccess_request(message.value)

if __name__ == '__main__':
    GE_ClusterAgent = ClusterAgent(caDefine.SELF_CLUSTER_NAME,caDefine.SELF_CLUSTER_TYPE,caDefine.APPLY_YAMLS_PATH)
    
