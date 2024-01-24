import sys
sys.path.append('../gelib')
sys.path.append('../gedef')

import pymongo
from pymongo import MongoClient
from pymongo.errors import PyMongoError
from pymongo.errors import OperationFailure
from pymongo.errors import DuplicateKeyError
import GE_define as gDefine

import datetime
import uuid

from json import dumps
from json import loads 

from GE_kafka import gKafka

import GE_kubernetes as gKube
from   kubernetes import client, config
try :
    config.load_incluster_config()
except:
    config.load_kube_config()
v1 = client.CoreV1Api()

def set_msg_for_get_source_node_by_pod_name(select_cluster,work_info,rquest_id,p_dic):
    '''-------------------------------------
    p_dic = {
      namespace_name : n1, 
      pod_name: p1
    }
    ---------------------------------------''' 
    msg_dic = {
        'source'   : {'type':'none',    'object':'none'},
        'target'   : {'type':'cluster', 'object':select_cluster},
        'hcode'    : 530,
        'lcode'    : 1,
        'work_info': work_info,
        'msg'      : {
            'request_id': rquest_id,
            'method'    : 'read',
            'mode'      : 'frompod',
            'parameters': p_dic
        }
    }
    return msg_dic

def get_source_node_by_pod_name(work_info,select_cluster,namespace_name,pod_name):
    
    if gDefine.KAFKA_SERVER_URL != None :
        res_kafka = gKafka([gDefine.KAFKA_SERVER_URL])
    else :
        print('error : KAFKA_SERVER_URL is not set')
        return 'fail', None
    result=None
    # create uuid of rquest_id 
    rquest_id = str(uuid.uuid4())
    p_dic = {
      'namespace_name' : namespace_name, 
      'pod_name'       : pod_name
    }   
    request_msg = set_msg_for_get_source_node_by_pod_name(select_cluster,work_info,rquest_id,p_dic)
    res_kafka.create_topic(rquest_id,1,1)
    
    res_kafka.kafka_msg_send(gDefine.GEDGE_GLOBAL_API_TOPIC_NAME,request_msg)
    
    res_kafka.set_consumer(rquest_id, rquest_id)
    return_msgs = res_kafka.kafka_msg_read(gDefine.CONSUMER_TIMEOUT_MS_TIME,1)
    res_kafka.delete_topic(rquest_id)
    
    if len(return_msgs) == 1 :
        return_msg=return_msgs[0]
    else :
        return 'fail', None  

    print('return_msg:',return_msg)
    
    if return_msg['result']['status'] == 'success': 
        node_name = return_msg['result']['source_node']
        print('get_source_node_by_pod_name return_msg:',return_msg)
        return 'success', node_name
    else :
        return 'fail', None