from kafka import KafkaProducer
from kafka import KafkaConsumer
from kafka import KafkaAdminClient
from operator import itemgetter
import json
from json import dumps
from json import loads 
import time 
import requests
import GE_GSCH_most_define as mostDefine

'''
{'requestID': 'req-f6720a0e-e3df-455a-825d-f8c80cedc2d9', 
 'date': '2021-10-18 13:46:30', 'status': 'create', 
 'fileID': 'b469e54a-721f-4c55-b43e-d09088556031', 'failCnt': 0, 
 'env': {
         'type': 'global', 
         'targetClusters': ['c1', ['c2', 'c3'], 'c4'], 
         'priority': 'GMostRequestedPriority', 
        }
}
'''
class GMostRequestedPriority_Job:
    def __init__(self,request_data_dic):
        self.job_name = mostDefine.SELF_POLICY_NAME
        self.requestDataDic = request_data_dic
        self.requestID=request_data_dic['requestID']
        self.fileID=request_data_dic['fileID']
        self.failCnt=request_data_dic['failCnt']
       
        self.env=request_data_dic['env']
        self.targetClusters=self.env['targetClusters'] 

        self.sharedClusters = self.get_shared_clusters()
        self.producer= KafkaProducer(acks=0, 
                compression_type='gzip', 
                bootstrap_servers=[mostDefine.KAFKA_SERVER_URL], 
                value_serializer=lambda x: dumps(x).encode('utf-8')) 

    def get_shared_clusters(self):
        for item in self.targetClusters :
            if type(item).__name__ == list :
                if len(item) > 1 :
                    return item
                else :
                    return None
            else :
                print()
                #apply low-latency yaml with 
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

    def request_clusters_available_resource_from_clusterAgent(self,clusters):
        try :
            temp_msg = {'source':{'type':'none'},
                'target':{'type':'cluster', 'object':clusters},
                'hcode':300,
                'lcode':1,
                'msg':{'requestID': self.requestID}
                }
            self.producer.send(mostDefine.GLOBAL_SCHEDULER_GLOBAL_TOPIC_NAME,value=temp_msg)
            self.producer.flush()
        except :
            return 'process_fail'
        return 'process_success'

    def wait_request_clusters_available_resource_from_clusterAgent(self,clusters):
        clusters_data_list =[]
        re_count = len(clusters)
        for i in range(re_count):
            res = self.wait_consumer()
            if res == None:
                print('res is None')
                return 'process_fail', clusters_data_list
            is_process_fail = self.check_res_fail(res)

            hcode = res['hcode']
            lcode = res['lcode']
            result = res['msg']['result']
  
            '''
            result: {'cpu':90 ,'memory':87, 'memory_szie_mbyte':12000, 'score': 177 }
            '''
            if is_process_fail:
                print('Fail Job:', res)
                return 'process_fail', clusters_data_list
            else:
                if hcode == 300 and lcode == 2:
                    clusters_data_list.append(result)
                else :
                    return 'process_fail', clusters_data_list 
        print('clusters_data_list',clusters_data_list)
        sorted_clusters_data_list = sorted(clusters_data_list, key=itemgetter('score'))
        return 'process_success', sorted_clusters_data_list 

    def apply_yaml_to_ClusterAgent(self,cluster):
        print('apply_yaml_to_ClusterAgent:',cluster)
        try :
            temp_msg = {'source':{'type':'none'},
                'target':{'type':'cluster', 'object':cluster},
                'hcode':310,
                'lcode':1,
                'msg':{'requestID': self.requestID,'fileID':self.fileID,'requestData':self.requestDataDic }
            }

            self.producer.send(mostDefine.GLOBAL_SCHEDULER_GLOBAL_TOPIC_NAME,value=temp_msg)
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
            if hcode == 310 and lcode == 2:
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
                bootstrap_servers=[mostDefine.KAFKA_SERVER_URL], 
                auto_offset_reset='earliest', 
                enable_auto_commit=True, 
                group_id=self.requestID, 
                value_deserializer=lambda x: loads(x.decode('utf-8')), 
                consumer_timeout_ms=1000*10
        )
        print('w-1')
        res = None
        for message in consumer: 
            print("Topic: %s, Partition: %d, Offset: %d, Key: %s, Value: %s" % ( message.topic, message.partition, message.offset, message.key, message.value )) 
            res = message.value
            break
        consumer.close()
        return res

def start_job_processor():
    print('start_job_processor')
    while 1 :
        #read dispatched queue
        print('1')
        try :
            print('1-1')
            res = requests.get(mostDefine.FRONT_SERVER_SERVER_URL+'/ge/sch/gm/fs/dispatched-queue/policys/'+mostDefine.SELF_POLICY_NAME)
            print('1-2')
        except:
            print('wait front server to run',mostDefine.FRONT_SERVER_SERVER_URL)
            time.sleep(5) 
            continue

        if res.status_code == 200 :
            print('2')
            request_data_dic = json.loads(res.json())
            print('request_data_dic',request_data_dic)
            GE_Request_Job = GMostRequestedPriority_Job(request_data_dic) 
            print('3')
            #send topic message 
            '''
            return values 
                'apply_success' : apply is success
                'process_success' :
                'process_fail': raise error in process(apply or wait consumer, request latency) 
                'apply_fail' : apply is fail 
            '''
            is_whole_process_status = None
            for item in GE_Request_Job.targetClusters :
                print('type(item)',type(item),item)
                if type(item).__name__ == 'list' and len(item) > 1 :
                    r = GE_Request_Job.request_clusters_available_resource_from_clusterAgent(item)
                    if r == 'process_fail' :
                        print('internal error : request_clusters_available_resource_from_clusterAgent')
                        continue
                    r,clusters = GE_Request_Job.wait_request_clusters_available_resource_from_clusterAgent(item)
                    if r == 'process_fail' :
                        print('internal error : wait_request_clusters_available_resource_from_clusterAgent')
                        continue
                    for t_cluster in clusters:
                        r = GE_Request_Job.apply_yaml_to_ClusterAgent(t_cluster)
                        if r == 'process_fail' :
                            print('internal error : apply_yaml_to_ClusterAgent')
                            continue
                        r = GE_Request_Job.wait_apply_yaml_to_ClusterAgent()
                        if r == 'process_fail' :
                            print('internal error : wait_apply_yaml_to_ClusterAgent')
                            continue
                        elif r == 'apply_success' or r == 'cancel':
                            print('---pply_success or cancel',r)
                            is_whole_process_status = r
                            break
                        elif r == 'apply_fail' :
                            is_whole_process_status = r
                            continue
                    if r == 'apply_success' or r == 'cancel':
                        break
                else :
                    r = GE_Request_Job.apply_yaml_to_ClusterAgent(item)
                    if r == 'process_fail' :
                        print('internal error : apply_yaml_to_ClusterAgent')
                        continue
                    r = GE_Request_Job.wait_apply_yaml_to_ClusterAgent()
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
            if is_whole_process_status == 'apply_fail' :
                #GE_Request_Job.requestDataDic['status'] = 'failed'
                requests.put(mostDefine.FRONT_SERVER_SERVER_URL+'/ge/sch/gm/fs/dispatched-queue/'+GE_Request_Job.requestID+'/status/failed')
            elif is_whole_process_status == 'apply_success' :
                #GE_Request_Job.requestDataDic['status'] = 'completed'
                requests.put(mostDefine.FRONT_SERVER_SERVER_URL+'/ge/sch/gm/fs/dispatched-queue/'+GE_Request_Job.requestID+'/status/completed')
            elif is_whole_process_status == 'cancel' :
                #GE_Request_Job.requestDataDic['status'] = 'cancel'
                requests.put(mostDefine.FRONT_SERVER_SERVER_URL+'/ge/sch/gm/fs/dispatched-queue/'+GE_Request_Job.requestID+'/status/canceled')
            else :
                #GE_Request_Job.requestDataDic['status'] = 'cancel'
                requests.put(mostDefine.FRONT_SERVER_SERVER_URL+'/ge/sch/gm/fs/dispatched-queue/'+GE_Request_Job.requestID+'/status/canceled')                
        else:
            print('despatched queue is empty')
            time.sleep(1) 
            continue
        #time.sleep(1)  
        
if __name__ == '__main__':
    start_job_processor()   

