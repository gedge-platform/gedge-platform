import sys
sys.path.append('../gelib')
sys.path.append('../gedef')
import GE_define as gDefine
import GE_GSCH_selc_define as selcDefine

import GE_kubernetes as gKube
import GE_platform_util as gUtil

from kafka import KafkaProducer
from kafka import KafkaConsumer
from kafka import KafkaAdminClient
import json
from json import dumps
from json import loads 
import time 
import requests

PREFIX = '/GEP/GSCH'

def init_gsch_select_policy():
    
    '''------------------------------------------------
            KAFKA MESSAGE
    ------------------------------------------------'''
    while 1:     
        r = gUtil.find_service_from_platform_service_list_with_k8s(gDefine.GEDGE_SYSTEM_NAMESPACE,gDefine.KAFKA_SERVICE_NAME)
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
        r = gUtil.find_service_from_platform_service_list_with_k8s(gDefine.GEDGE_SYSTEM_NAMESPACE,gDefine.REDIS_SERVICE_NAME)
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
        r = gUtil.find_service_from_platform_service_list_with_k8s(gDefine.GEDGE_SYSTEM_NAMESPACE,gDefine.MONGO_DB_SERVICE_NAME)
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
                GSCH FRONT SERVER
    -----------------------------------------------'''
    while(1) :
        r = gUtil.find_service_from_platform_service_list_with_k8s(gDefine.GEDGE_SYSTEM_NAMESPACE,gDefine.GSCH_FRONT_SERVER_SERVICE_NAME)
        if r : 
            selcDefine..GSCH_FRONT_SERVER_ENDPOINT_IP   = r['access_host']
            selcDefine..GSCH_FRONT_SERVER_ENDPOINT_PORT = r['access_port']
            selcDefine..GSCH_FRONT_SERVER_URL      = str('http://')+str(selcDefine..GSCH_FRONT_SERVER_ENDPOINT_IP)+str(':')+str(selcDefine..GSCH_FRONT_SERVER_ENDPOINT_PORT)
            print(selcDefine..GSCH_FRONT_SERVER_ENDPOINT_IP ,selcDefine..GSCH_FRONT_SERVER_ENDPOINT_PORT)    
            break
        else:
            print('wait',gDefine.GSCH_FRONT_SERVER_SERVICE_NAME)
            time.sleep(gDefine.WAIT_RUNNING_PLATFORM_SERVICES_SECOND_TIME)
            continue

init_gsch_select_policy()

GE_request_job = None 

'''
{'requestID': 'req-f6720a0e-e3df-455a-825d-f8c80cedc2d9', 
 'date': '2021-10-18 13:46:30', 'status': 'create', 
 'fileID': 'b469e54a-721f-4c55-b43e-d09088556031', 'failCnt': 0, 
 'env': {
         'type': 'global', 
         'targetClusters': ['c1', 'c2', 'c3', 'c4'], 
         'priority': 'GSelectedCluster'                 }
}
'''
class GSelectClusterPriority_Job:
    def __init__(self,request_data_dic):
        self.job_name = selcDefine.SELF_POLICY_NAME
        self.requestDataDic = request_data_dic
        self.requestID=request_data_dic['requestID']
        self.fileID=request_data_dic['fileID']
        self.failCnt=request_data_dic['failCnt']
       
        self.env=request_data_dic['env']
        self.targetClusters=self.env['targetClusters'] 
        
        self.producer= KafkaProducer(acks=0, 
                compression_type='gzip', 
                bootstrap_servers=[gDefine.KAFKA_SERVER_URL], 
                value_serializer=lambda x: dumps(x).encode('utf-8')) 

    def check_res_fail(self, res):

        if res == None:
            return True
        if 'hcode' not in res:
            return True
        if 'lcode' not in res:
            return True
        if 'msg' not in res:
            return True
        if 'result' not in res['msg']:
            return True
        return False

    def apply_yaml_to_ClusterAgent(self,cluster):
        print('apply_yaml_to_ClusterAgent:',cluster)
        try :
            temp_msg = {'source':{'type':'none'},
                'target':{'type':'cluster', 'object':cluster},
                'hcode':400,
                'lcode':1,
                'msg':{'requestID': self.requestID,'fileID':self.fileID,'requestData':self.requestDataDic }
            }

            self.producer.send(gDefine.GEDGE_GLOBAL_TOPIC_NAME,value=temp_msg)
            self.producer.flush()
        except:
            return 'process_fail'
        return 'process_success'

    def wait_apply_yaml_to_ClusterAgent(self):
        res = self.wait_consumer()
        if res == None:
            print('res is None')
            return 'process_fail'
        is_process_fail = self.check_res_fail(res)

        hcode = res['hcode']
        lcode = res['lcode']
        result = res['msg']['result']
        
        print('hcode :hcode,result',hcode,lcode,result)

        if is_process_fail:
            print('Fail Job:', res)
            return 'process_fail'
        else:
            if hcode == 400 and lcode == 2:
                if result == 'success' :
                    return 'apply_success'
                elif result == 'fail' :
                    return 'apply_fail'
                elif result == 'cancel' :
                    return 'cancel'
                else :
                    return 'process_fail'
            else:
                return 'process_fail'

    def wait_consumer(self):
        print('wait_consumer')
        consumer = KafkaConsumer( 
                self.requestID, 
                bootstrap_servers=[gDefine.KAFKA_SERVER_URL], 
                auto_offset_reset='earliest', 
                enable_auto_commit=True, 
                group_id=self.requestID, 
                value_deserializer=lambda x: loads(x.decode('utf-8')), 
                consumer_timeout_ms=selcDefine.CONSUMER_TIMEOUT_MS_TIME
        )
        print('w-1')
        res = None
        for message in consumer: 
            print("Topic: %s, Partition: %d, Offset: %d, Key: %s, Value: %s" % ( message.topic, message.partition, message.offset, message.key, message.value )) 
            res = message.value
            break
        consumer.close()
        return res

def read_dispatched_queue():
    
    t_GE_request_job = None 
    REQUEST_DISPATCH_QUEUE_URL = selcDefine.GSCH_FRONT_SERVER_URL+f'{PREFIX}/dispatched-queue/schedule/policies/'+selcDefine.SELF_POLICY_NAME

    while 1 :
        try :
            res = requests.get(REQUEST_DISPATCH_QUEUE_URL)
        except:
            print('wait front server to run',selcDefine.GSCH_FRONT_SERVER_URL)
            time.sleep(selcDefine.REQUEST_DISPATCH_RETRY_DELAY_SECOND_TIME) 
            continue
        if res.status_code == 200 :
            request_data_dic = json.loads(res.json())
            print('request_data_dic',request_data_dic)
            t_GE_request_job = GSelectClusterPriority_Job(request_data_dic) 
            break 
        else :
            print('despatched queue is empty')
            time.sleep(selcDefine.READ_DISPATCH_QUEUE_RETRY_DELAY_SECOND_TIME) 
            continue
    return t_GE_request_job


def start_job_processor():
    print('start_job_processor')
    while 1 :
        #read dispatched queue
        GE_request_job = read_dispatched_queue()
        '''
        return values 
            'apply_success' : apply is success
            'process_success' :
            'process_fail': raise error in process(apply or wait consumer, request latency) 
            'apply_fail' : apply is fail 
        '''
        is_whole_process_status = None
        for item in GE_request_job.targetClusters :
            print('type(item)',type(item),item)
            r = GE_request_job.apply_yaml_to_ClusterAgent(item)
            if r == 'process_fail' :
                print('internal error : apply_yaml_to_ClusterAgent')
                continue
            r = GE_request_job.wait_apply_yaml_to_ClusterAgent()
            if r == 'process_fail' :
                print('internal error : wait_apply_yaml_to_ClusterAgent')
                continue
            elif r == 'apply_success' or r == 'cancel':
                is_whole_process_status = r
                print('apply_success or cancel:',r)
                break
            elif r == 'apply_fail':
                is_whole_process_status = r
                print('apply_fail')
                continue
        print('==============')

        UPDATE_STATUS_OF_REQUEST_JOB_URL = selcDefine.GSCH_FRONT_SERVER_URL+f'{PREFIX}/dispatched-queue/request_jobs/'+GE_request_job.requestID+'/status/'

        if is_whole_process_status == 'apply_fail' :
            #GE_request_job.requestDataDic['status'] = 'failed'
            requests.put(UPDATE_STATUS_OF_REQUEST_JOB_URL+'failed')
        elif is_whole_process_status == 'apply_success' :
            #GE_request_job.requestDataDic['status'] = 'completed'
            requests.put(UPDATE_STATUS_OF_REQUEST_JOB_URL+'completed')
        elif is_whole_process_status == 'cancel' :
            #GE_request_job.requestDataDic['status'] = 'cancel'
            requests.put(UPDATE_STATUS_OF_REQUEST_JOB_URL+'canceled')
        else :
            #GE_request_job.requestDataDic['status'] = 'cancel'
            requests.put(UPDATE_STATUS_OF_REQUEST_JOB_URL+'canceled')                  
        
if __name__ == '__main__':
    start_job_processor()