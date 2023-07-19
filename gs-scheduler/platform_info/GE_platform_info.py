
#from __future__ import print_function
import sys
sys.path.append('../gelib')
sys.path.append('../gedef')
from kubernetes import client, config
import json
from operator import itemgetter
from flask import Flask, request, render_template, redirect, url_for
from werkzeug.utils import secure_filename
from flask import send_from_directory
import os
import threading, time
import uuid 
import GE_define as gDefine
import GE_platform_define as pDefine
import GE_kubernetes as gKube
import GE_platform_util as gUtil

from GE_meta_data import metaData
from GE_redis import redisController

from kafka import KafkaProducer
from kafka import KafkaConsumer
from kafka.admin import KafkaAdminClient, NewTopic
from json import loads 
import shutil
import yaml
import ast
from bson import json_util

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

try :
    config.load_incluster_config()
except:
    config.load_kube_config()
    
v1 = client.CoreV1Api()

GE_metaData = metaData()

'''-------------------------------------------------------------------------------------------------------
      INIT PLATFORM INFO    
-------------------------------------------------------------------------------------------------------'''
def init_platform_info():
    # set global define data
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
            write platform info to mongo_db
    -----------------------------------------------'''  
    # connect mongo_db 
    
    global GE_metaData
    GE_metaData.connect_mongodb(ip=gDefine.MONGO_DB_ENDPOINT_IP,port=gDefine.MONGO_DB_ENDPOINT_PORT) 
    
    # set platform services into mongo_db 
    GE_metaData.drop_get_platform_service()
    
    platform_service_list = gUtil.get_list_namespaced_services_dic(gDefine.GEDGE_SYSTEM_NAMESPACE)
    if not platform_service_list :
        print('error: init_platform_info' )
        exit(0)
    # set global define data
    for data_dic in platform_service_list :
        GE_metaData.set_platform_service(data_dic)
    
    # drop clusters info from mongo_db 
    GE_metaData.drop_cluster_info()

#support_policy_list = ['GLowLatencyPriority','GMostRequestedPriority','GSelectedCluster']

init_platform_info() 


'''-------------------------------------------------------------------------------------------------------
           REST API
-------------------------------------------------------------------------------------------------------'''
PREFIX = '/GEP/INFO/platformservices'

def rest_API_service():
    app.run(host='0.0.0.0', port=8787, threaded=True)

def list_pod():
    print("Listing pods with their IPs:")
    ret = v1.list_pod_for_all_namespaces(watch=False)
    for i in ret.items:
        print("%s\t%s\t%s" %
              (i.status.pod_ip, i.metadata.namespace, i.metadata.name))

@app.route('/ge/api/v1/test', methods=['GET','POST'])
def test():
    #print(request.get_json())
    response_data = {}
    response_data['Result'] = "test" 

    response = app.response_class(response=json.dumps(response_data), status=200, mimetype='application/json')
    gDefine.logger.info('test')
    return response

@app.route(f'{PREFIX}/<servicename>', methods=['GET'])
def platformservice(servicename):
    global GE_metaData
    response_data = {}
    if request.method == 'GET':

        print(request.get_json())
        r = GE_metaData.get_platform_service(servicename)
        response_data['Result'] = r

        response = app.response_class(response=json.dumps(response_data), status=200, mimetype='application/json')
    gDefine.logger.info('test')
    return response

@app.route(f'{PREFIX}', methods=['GET','DELETE'])
def platformservices():
    global GE_metaData
    response_data = {}
    if request.method == 'GET':
        r = GE_metaData.get_platform_service_list()
        print('platform_service_type',type(r))
        print('platform_service_list',r)
        response_data['Result'] = r
        response = app.response_class(response=json.dumps(response_data,default=json_util.default), status=200, mimetype='application/json')
    elif  request.method == 'DELETE' :
        r = GE_metaData.drop_get_platform_service()
        response_data['Result'] = 'dropped'
        response = app.response_class(response=json.dumps(response_data), status=200, mimetype='application/json')

    gDefine.logger.info('test')
    return response    

'''-------------------------------------------------------------------------------------------------------
           RESPONSE
-------------------------------------------------------------------------------------------------------'''

def response_wihterror(ErrorCode, DetailLog):
    print(DetailLog)
    response_data = {}
    response_data['Error'] = {}
    response_data['Error']['ErrorCode'] = ErrorCode
    response_data['Error']['Message'] = gDefine.ERROR_CODES[ErrorCode]['Description']
    response = app.response_class(response=json.dumps(response_data), 
            status=gDefine.ERROR_CODES[ErrorCode]['StatusCode'], mimetype='application/json')
    gDefine.logger.error(response_data)
    return response


if __name__ == '__main__':
    '''-------------------------------------------------------------------------------------------------------
           REST API THREAD 
    -------------------------------------------------------------------------------------------------------'''
    t1 = threading.Thread(target=rest_API_service)
    t1.daemon = True 
    t1.start()

    '''-------------------------------------------------------------------------------------------------------
           Platform Info Updater
    -------------------------------------------------------------------------------------------------------'''
    cnt=0
    
    while True: 
        time.sleep(5)
