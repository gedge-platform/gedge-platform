import sys
sys.path.append('../gelib')
sys.path.append('../gedef')
import time 
import requests
from   urllib.parse import urlencode
import json

import GE_define as gDefine
import GE_GSCH_selc_define as selcDefine
import GE_kubernetes as gKube
import GE_meta_data as gMeta

from json import dumps
from json import loads 
from GE_kafka import gKafka

PREFIX = '/GEP/GSCH'

def init_gsch_select_policy():
    
    '''------------------------------------------------
            KAFKA MESSAGE
    ------------------------------------------------'''
    while 1:     
        r = gMeta.find_service_from_gService_list(gDefine.GEDGE_SYSTEM_NAMESPACE,gDefine.KAFKA_SERVICE_NAME)
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
        r = gMeta.find_service_from_gService_list(gDefine.GEDGE_SYSTEM_NAMESPACE,gDefine.REDIS_SERVICE_NAME)
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
        r = gMeta.find_service_from_gService_list(gDefine.GEDGE_SYSTEM_NAMESPACE,gDefine.MONGO_DB_SERVICE_NAME)
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
                GSCH T SERVER
    -----------------------------------------------'''
    while(1) :
        r = gMeta.find_service_from_gService_list(gDefine.GEDGE_SYSTEM_NAMESPACE,gDefine.GSCH_SERVER_SERVICE_NAME)
        if r : 
            selcDefine.GSCH_SERVER_ENDPOINT_IP   = r['access_host']
            selcDefine.GSCH_SERVER_ENDPOINT_PORT = r['access_port']
            selcDefine.GSCH_SERVER_URL      = str('http://')+str(selcDefine.GSCH_SERVER_ENDPOINT_IP)+str(':')+str(selcDefine.GSCH_SERVER_ENDPOINT_PORT)
            print(selcDefine.GSCH_SERVER_ENDPOINT_IP ,selcDefine.GSCH_SERVER_ENDPOINT_PORT)    
            break
        else:
            print('wait',gDefine.GSCH_SERVER_SERVICE_NAME)
            time.sleep(gDefine.WAIT_RUNNING_PLATFORM_SERVICES_SECOND_TIME)
            continue

init_gsch_select_policy()

GE_request_job = None 

'''
{
    'request_id': 'req-f6720a0e-e3df-455a-825d-f8c80cedc2d9', 
    'cdate': '2021-10-18 13:46:30', 'status': 'create', 
    'file_id': 'b469e54a-721f-4c55-b43e-d09088556031', 'fail_count': 0, 
    'env': {
        'scope': 'global', 
        'priority': 'GSelectedCluster', 
        'select_clusters': ['c1', 'c2', 'c3', 'c4'] 
    }
}
'''
class GSelectClusterPriority_Job:
    def __init__(self,request_data_dic):
        self.priority_name    = selcDefine.SELF_POLICY_NAME
        self.request_data_dic = request_data_dic
        self.request_id       = request_data_dic['request_id']
        self.file_id          = request_data_dic['file_id']
        self.fail_count       = request_data_dic['fail_count']
        self.user_name        = request_data_dic['env']['option']['user_name']
        self.workspace_name   = request_data_dic['env']['option']['workspace_name']
        self.project_name     = request_data_dic['env']['option']['project_name']
        self.namespace_name   = gMeta.get_namespace_name_by_project_name(self.user_name,self.workspace_name,self.project_name)
        #self.namespace_name   = 'default' #'test_namespace-3797934279473294723'
        self.work_info = {
            'user_name'     :self.user_name, 
            'workspace_name':self.workspace_name,  
            'project_name'  :self.project_name,
            'namespace_name':self.namespace_name    
        }
        # for leveled clusters
        self.select_clusters  = None
        # for select special node of some cluster
        self.select_cluster   = None
        self.select_node      = None
        self.env              = request_data_dic['env']
        self.mode             = request_data_dic['env']['option']['mode']
        
        if self.mode == 'cluster' or self.mode == 'default':
            self.select_clusters = self.env['option']['parameters']['select_clusters'] 
        elif self.mode == 'node':
            self.select_cluster  = self.env['option']['parameters']['select_cluster']
            self.select_node     = self.env['option']['parameters']['select_node']
        
        self.sel_kafka = gKafka([gDefine.KAFKA_SERVER_URL])

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
            temp_msg = {
                'source'   : {'type':'none'},
                'target'   : {'type':'cluster', 'object':cluster},
                'hcode'    : 400,
                'lcode'    : 1,
                'work_info': self.work_info, 
                'msg'      : self.request_data_dic 
            }
            self.sel_kafka.kafka_msg_send(gDefine.GEDGE_GLOBAL_GSCH_TOPIC_NAME,temp_msg)
        except:
            print('error : apply_yaml_to_ClusterAgent')
            return 'process_fail'
        print('success : apply_yaml_to_ClusterAgent',temp_msg)
        return 'process_success'

    def wait_apply_yaml_to_ClusterAgent(self):
        self.sel_kafka.set_consumer(self.request_id, self.request_id)
        return_msgs = self.sel_kafka.kafka_msg_read(gDefine.CONSUMER_TIMEOUT_MS_TIME,1)
        self.sel_kafka.consumer.close()
        
        if return_msgs == None:
            print('return_msgs is None')
            return 'process_fail'
        if len(return_msgs) == 1 :
            return_msg=return_msgs[0]
        else :
            print('number of return_msgs is not one')
            return 'process_fail'    
        print('=================> wait_apply_yaml_to_ClusterAgent return_msg:',return_msg)
        is_process_fail = self.check_res_fail(return_msg)
         
        hcode  = return_msg['hcode']
        lcode  = return_msg['lcode']
        result = return_msg['msg']['result']['status']
        error_msg = return_msg['msg']['result']['error_msg']
        print('hcode :hcode,result',hcode,lcode,result)

        if is_process_fail:
            print('Fail Job:', return_msg)
            return 'process_fail'
        else:
            if hcode == 400 and lcode == 2:
                if result == 'success' :
                    return 'apply_success'
                elif result == 'fail' :
                    print('error_msg:',error_msg)
                    return 'apply_fail'
                elif result == 'cancel' :
                    print('error_msg:',error_msg)
                    return 'cancel'
                else :
                    return 'process_fail'
            else:
                return 'process_fail'
    '''==================================
    def wait_consumer(self):
        print('wait_consumer')
        self.sel_kafka.set_consumer(self.request_id, self.request_id)
        print('w-1')
        res = None
        for message in self.sel_kafka.consumer: 
            print("Topic: %s, Partition: %d, Offset: %d, Key: %s, Value: %s" % ( message.topic, message.partition, message.offset, message.key, message.value )) 
            res = message.value
            break
        self.sel_kafka.consumer.close()
        return res
    ================================================='''
def read_dispatched_queue():
    
    t_GE_request_job = None 
    REQUEST_DISPATCH_QUEUE_URL = selcDefine.GSCH_SERVER_URL+f'{PREFIX}/dispatchedqueue/policies/'+selcDefine.SELF_POLICY_NAME

    while 1 :
        try :
            res = requests.get(REQUEST_DISPATCH_QUEUE_URL)
            if res.status_code == 200 and res != None:
                request_data_dic = json.loads(res.json())
                print('request_data_dic:',request_data_dic)
                t_GE_request_job = GSelectClusterPriority_Job(request_data_dic) 
                break 
            else :
                print('despatched queue is empty')
                time.sleep(selcDefine.READ_DISPATCH_QUEUE_RETRY_DELAY_SECOND_TIME) 
                continue
        except:
            print('wait gsch server to run',selcDefine.GSCH_SERVER_URL)
            time.sleep(selcDefine.REQUEST_DISPATCH_RETRY_DELAY_SECOND_TIME) 
            continue
    return t_GE_request_job

def request_job_processor():
    print('request_job_processor')
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
        if GE_request_job.mode == 'cluster' :
            for item in GE_request_job.select_clusters :
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
        elif GE_request_job.mode == 'node' :
            r = GE_request_job.apply_yaml_to_ClusterAgent(GE_request_job.select_cluster)
            if r == 'process_success' :
                r = GE_request_job.wait_apply_yaml_to_ClusterAgent()
                if r == 'apply_success' or r == 'cancel':
                    is_whole_process_status = r
                    print('apply_success or cancel:',r)
                elif r == 'apply_fail':
                    is_whole_process_status = r
                    print('apply_fail')    
                else :
                    print('internal error : wait_apply_yaml_to_ClusterAgent')    
            else :
                is_whole_process_status ='process_fail' 
                print('internal error : apply_yaml_to_ClusterAgent')
        else :
            is_whole_process_status == 'cancel'

        UPDATE_STATUS_OF_REQUEST_JOB_URL = selcDefine.GSCH_SERVER_URL+f'{PREFIX}/dispatchedqueue/requestjobs/'+GE_request_job.request_id+'/status'

        if is_whole_process_status == 'apply_fail' :
            params = {'changed_status': 'failed'}
        elif is_whole_process_status == 'apply_success' :
            params = {'changed_status': 'completed'}
        elif is_whole_process_status == 'cancel' :
            params = {'changed_status': 'canceled'}
        else :
            params = {'changed_status': 'canceled'}                
        query_string = urlencode(params)
        full_url = "{}?{}".format(UPDATE_STATUS_OF_REQUEST_JOB_URL,query_string)
        print(full_url)
        response=requests.put(full_url) 
        if response.status_code == 200:
            print("Request successfully updated.")
        else:
            print("Error updating request:", response.status_code)                
        
if __name__ == '__main__':
    request_job_processor()