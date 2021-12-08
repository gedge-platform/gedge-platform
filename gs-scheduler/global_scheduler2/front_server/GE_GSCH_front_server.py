
#from __future__ import print_function
from kubernetes import client, config
import json
from operator import itemgetter
from flask import Flask, request, render_template, redirect, url_for
from werkzeug.utils import secure_filename
from flask import send_from_directory
import os
import threading, time
import uuid 
import GE_GSCH_define as gDefine
import GE_GSCH_redis as gRedis
from GE_GSCH_request_job import RequestJob
from GE_GSCH_queue import RequestQueue
from GE_GSCH_pre_warmer import PreWarmer
from GE_GSCH_meta_data import metaData
from kafka import KafkaProducer
from kafka import KafkaConsumer
from kafka.admin import KafkaAdminClient, NewTopic
from json import loads 
import shutil

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

try :
    config.load_incluster_config()
except:
    config.load_kube_config()
    
v1 = client.CoreV1Api()
support_policy_list = ['GLowLatencyPriority','GMostRequestedPriority','GSelectedCluster']
GE_RequestQueue = RequestQueue()
GE_PreWarmer    = PreWarmer(gDefine.GLOBAL_SCHEDULER_PREWARMER_YAML_PATH, support_policy_list)
GE_metaData     = metaData(ip=gDefine.MONGO_DB_ENDPOINT_IP,port=int(gDefine.MONGO_DB_ENDPOINT_PORT))

gRedis.connect_redis_server(gDefine.REDIS_ENDPOINT_IP,gDefine.REDIS_ENDPOINT_PORT)

def check_is_ready():
    try :
        gDefine.GLOBAL_SCHEDULER_IS_READY = True
        print("check_is_ready is done")    
    except:
        gDefine.GLOBAL_SCHEDULER_IS_READY = False

'''-------------------------------------------------------------------------------------------------------
           REST API
-------------------------------------------------------------------------------------------------------'''
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

@app.route('/ge/sch/gm/fs/request-queue/insert-page-low',methods=['GET','POST'])
def create_html_request_queue_insert_page():
    # get meta data of cluster information(GS Front Server IP, cluster name)
    # change template upload html with 
    return render_template("new-request-job-low.html")

@app.route('/ge/sch/gm/fs/request-queue/insert-page-most',methods=['GET','POST'])
def create_html_request_queue_insert_page2():
    # get meta data of cluster information(GS Front Server IP, cluster name)
    # change template upload html with 
    return render_template("new-request-job-most.html")

@app.route('/ge/sch/gm/fs/request-queue/insert-page-select',methods=['GET','POST'])
def create_html_request_queue_insert_page3():
    # get meta data of cluster information(GS Front Server IP, cluster name)
    # change template upload html with 
    return render_template("new-request-job-select.html")

@app.route('/ge/sch/gm/fs/request-queue/low', methods=['POST'])
def create_scheduling_job():
    global GE_RequestQueue
    try :
        if request.method == "POST":
            f = request.files['yaml_file']
            print("o-1")
            fileID = uuid.uuid4()
            uuid_dir = fileID
            print("o-2")

            uploads_dir = str(gDefine.GLOBAL_SCHEDULER_UPLOAD_PATH)+str('/')+str(uuid_dir)
            print("o-3")
            print("dir:",uploads_dir)
            os.makedirs(uploads_dir,exist_ok=True)
            print("o-4")
            f.save(os.path.join(uploads_dir, secure_filename(f.filename)))
            ff = open(uploads_dir+str('/')+str(f.filename), "rb")
            file_data = ff.read()
            ff.close()
            print("o-5")  
            # save yaml file with key at Redis Server
            result = gRedis.hset_data_to_redis(file_data, gDefine.REDIS_YAML_KEY)
            print('hset_data_to_redis',result)
            # delete temp directory 
            if result != None :
                try:
                    shutil.rmtree(uploads_dir)
                    print('deleted temp directory',uploads_dir)
                except OSError as e:
                    print ("Error: %s - %s." % (e.filename, e.strerror))

            selected_cluster_data = request.values.get("selected_cluster")
            print("selected_cluster:",selected_cluster_data)
            fast_option = request.values.get("fast_option")
            print("fast_option:",fast_option)
    
            if fast_option =='fast':
                temp_env={'type':'global','targetClusters': ['c1',['c2','c3'],'c4'],'priority':'GLowLatencyPriority',
                        'option': {'sourceCluster':'c1','sourceNode':'c1wnode1'}
                }
                print("temp_env:",temp_env)
            else :
                temp_env={'type':'global','targetClusters': [['c1','c2','c3'],'c4'],'priority':'GLowLatencyPriority',
                        'option': {'sourceCluster':'c1','sourceNode':'c1wnode1'}
                }
                print("temp_env:",temp_env)
            
            print("o-6")                  
            temp_RequestJob=RequestJob(fileID=result[1],env=temp_env) 
            print("o-7")
            GE_RequestQueue.insert_RequestJob(request_job=temp_RequestJob)
            print("o-8")
            response_data = {}
            response_data['Result'] = "requestID:" + str(temp_RequestJob.requestID)
            response = app.response_class(response=json.dumps(response_data), status=200, mimetype='application/json')
            gDefine.logger.info('Success : create_scheduling_job ')
            return response
        else :
            return response_wihterror('ServiceInternalException', 'error: create_scheduling_job') 
    except:
        return response_wihterror('ServiceInternalException', 'error: create_scheduling_job') 

@app.route('/ge/sch/gm/fs/request-queue/most', methods=['POST'])
def create_scheduling_job2():
    global GE_RequestQueue
    try :
        if request.method == "POST":
            f = request.files['yaml_file']
            print("o-1")
            fileID = uuid.uuid4()
            uuid_dir = fileID
            print("o-2")

            uploads_dir = str(gDefine.GLOBAL_SCHEDULER_UPLOAD_PATH)+str('/')+str(uuid_dir)
            print("o-3")
            print("dir:",uploads_dir)
            os.makedirs(uploads_dir,exist_ok=True)
            print("o-4")
            f.save(os.path.join(uploads_dir, secure_filename(f.filename)))
            ff = open(uploads_dir+str('/')+str(f.filename), "rb")
            file_data = ff.read()
            ff.close()
            print("o-5")  
            # save yaml file with key at Redis Server
            result = gRedis.hset_data_to_redis(file_data, gDefine.REDIS_YAML_KEY)
            print('hset_data_to_redis',result)
            # delete temp directory 
            if result != None :
                try:
                    shutil.rmtree(uploads_dir)
                    print('deleted temp directory',uploads_dir)
                except OSError as e:
                    print ("Error: %s - %s." % (e.filename, e.strerror))

            selected_cluster_data = request.values.get("selected_cluster")
            print("selected_cluster:",selected_cluster_data)
            fast_option = request.values.get("fast_option")
            print("fast_option:",fast_option)
            
            if fast_option =='fast':
                temp_env={'type':'global','targetClusters': ['c1',['c2','c3'],'c4'],'priority':'GMostRequestedPriority' }
                print("temp_env:",temp_env)
            else :
                temp_env={'type':'global','targetClusters': [['c1','c2','c3'],'c4'],'priority':'GMostRequestedPriority' }
                print("temp_env:",temp_env)
                
            print("o-6")                  
            temp_RequestJob=RequestJob(fileID=result[1],env=temp_env) 
            print("o-7")
            GE_RequestQueue.insert_RequestJob(request_job=temp_RequestJob)
            print("o-8")
            response_data = {}
            response_data['Result'] = "requestID:" + str(temp_RequestJob.requestID)
            response = app.response_class(response=json.dumps(response_data), status=200, mimetype='application/json')
            gDefine.logger.info('Success : create_scheduling_job ')
            return response
        else :
            return response_wihterror('ServiceInternalException', 'error: create_scheduling_job')
    except:
        return response_wihterror('ServiceInternalException', 'error: create_scheduling_job')


@app.route('/ge/sch/gm/fs/request-queue/select', methods=['POST'])
def create_scheduling_job3():
    global GE_RequestQueue
    try :
        if request.method == "POST":
            f = request.files['yaml_file']
            print("o-1")
            fileID = uuid.uuid4()
            uuid_dir = fileID
            print("o-2")

            uploads_dir = str(gDefine.GLOBAL_SCHEDULER_UPLOAD_PATH)+str('/')+str(uuid_dir)
            print("o-3")
            print("dir:",uploads_dir)
            os.makedirs(uploads_dir,exist_ok=True)
            print("o-4")
            f.save(os.path.join(uploads_dir, secure_filename(f.filename)))
            ff = open(uploads_dir+str('/')+str(f.filename), "rb")
            file_data = ff.read()
            ff.close()
            print("o-5")  
            # save yaml file with key at Redis Server
            result = gRedis.hset_data_to_redis(file_data, gDefine.REDIS_YAML_KEY)
            print('hset_data_to_redis',result)
            # delete temp directory 
            if result != None :
                try:
                    shutil.rmtree(uploads_dir)
                    print('deleted temp directory',uploads_dir)
                except OSError as e:
                    print ("Error: %s - %s." % (e.filename, e.strerror))

            selected_cluster_data = request.values.get("selected_cluster")
            print("selected_cluster:",selected_cluster_data)
            fast_option = request.values.get("fast_option")
            print("fast_option:",fast_option)
    
            if fast_option =='fast':
                temp_env={'type':'global','targetClusters': ['c1','c2','c3','c4'],'priority':'GSelectedCluster' }
                print("temp_env:",temp_env)
            else :
                temp_env={'type':'global','targetClusters': ['c1'],'priority':'GSelectedCluster' }
                print("temp_env:",temp_env)
            
            print("o-6")                  
            temp_RequestJob=RequestJob(fileID=result[1],env=temp_env) 
            print("o-7")
            GE_RequestQueue.insert_RequestJob(request_job=temp_RequestJob)
            print("o-8")
            response_data = {}
            response_data['Result'] = "requestID:" + str(temp_RequestJob.requestID)
            response = app.response_class(response=json.dumps(response_data), status=200, mimetype='application/json')
            gDefine.logger.info('Success : create_scheduling_job ')
            return response
        else :
            return response_wihterror('ServiceInternalException', 'error: create_scheduling_job') 
    except:
        return response_wihterror('ServiceInternalException', 'error: create_scheduling_job') 


    '''-------------------------------------------------------------------------------------------------------
                DISPATCH REQUEST
    -------------------------------------------------------------------------------------------------------'''

@app.route('/ge/sch/gm/fs/dispatched-queue/policys/<policy>', methods=['GET'])
def pull_dispatched_request(policy):
    '''-------------------------------
    dictionary = {'george': 16, 'amber': 19}
    search_age = input("Provide age")
    for name, age in dictionary.items():  # for name, age in dictionary.iteritems():  (for Python 2.x)
       if age == search_age:
          print(name)
    ---------------------------------'''
    global GE_RequestQueue
    
    if GE_RequestQueue.get_dispatched_queue_size() <= 0 :
        return response_wihterror('ServiceInternalException', 'error: pull_dispatched_request: empty') 
    print('dispatchedQueue-----------------------------------------')            
    for request_id, request_job in GE_RequestQueue.dispatchedQueue.items():
        print('request_id:',request_id) 
        print('request_job.status',request_job.status)
    print('dispatchedQueue-----------------------------------------')    
    for request_id, request_job in GE_RequestQueue.dispatchedQueue.items():
        if request_job.env['priority'] == str(policy) and request_job.status == 'dispatched' :
           print('request_id:',request_id,' is scheduling') 
           print('request_job.env',request_job.env)
           response_data = request_job.toJson()
           response = app.response_class(response=json.dumps(response_data), status=200, mimetype='application/json')
           GE_RequestQueue.dispatchedQueue[request_id].status = 'scheduling'
           # del GE_RequestQueue.pop_dispatched_queue(request_id)
           gDefine.logger.info('pull_dispatched_request')
           return response
           
    return response_wihterror('ServiceInternalException', 'error: pull_dispatched_request: empty'+str(policy)) 

    '''-------------------------------------------------------------------------------------------------------
                REQUEST
    -------------------------------------------------------------------------------------------------------'''

@app.route('/ge/sch/gm/fs/dispatched-queue/<requestID>/status/<t_status>', methods=['PUT','POST'])
def update_dispatched_queue_status(requestID,t_status):
    print('start update_dispatched_queue_status')
    global GE_RequestQueue
    if t_status == 'failed':
        GE_RequestQueue.dispatchedQueue[requestID].increaseFailCnt()
        if GE_RequestQueue.dispatchedQueue[requestID].failCnt > gDefine.GLOBAL_SCHEDULER_MAX_FAIL_CNT :
            GE_RequestQueue.pop_dispatched_queue(requestID) 
            print("delete Job")
            result_str='failCnt is over GLOBAL_SCHEDULER_MAX_FAIL_CNT'
        elif GE_RequestQueue.dispatchedQueue[requestID].failCnt > gDefine.GLOBAL_SCHEDULER_FIRST_FAIL_CNT :
            GE_RequestQueue.firstQueue.put(GE_RequestQueue.pop_dispatched_queue(requestID))
            result_str='instert job into first Queue'
        else :
            GE_RequestQueue.baseQueue.put(GE_RequestQueue.pop_dispatched_queue(requestID))
            result_str='fail count is increased'
    elif t_status == 'canceled':
         GE_RequestQueue.pop_dispatched_queue(requestID)
         result_str='this jod is canceled' 
    elif t_status == 'completed':
        GE_RequestQueue.pop_dispatched_queue(requestID)
        result_str='this jod is completed'  
    else :
        print('error: format')
        result_str='error: InvalidFormat'  
    print('end update_dispatched_queue_status',result_str)
    
    
    response_data = {}
    response_data['Result'] = result_str
    response = app.response_class(response=json.dumps(response_data), status=200, mimetype='application/json')
    gDefine.logger.info('update_dispatched_queue_status')
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

'''-------------------------------------------------------------------------------------------------------
        REQUEST JOBS PREWARMER THREAD 
-------------------------------------------------------------------------------------------------------'''

def request_jobs_prewarming_service():
    cnt = 0
    print('request_jobs_prewarming_service')
    '''
    policy_metrics=  { p1: 0 , p2 : 1}  

    '''
    policy_metrics={}

    # init policy_metrics
    for p in GE_PreWarmer.support_policy_list :
        policy_metrics[p] =0

    while True: 
        # monitor get_total_queue_size / policy count 
        # update the scale of each policy deployment 
        for p in GE_PreWarmer.support_policy_list :
            policy_metrics[p] = 0
        for request_id, request_job in GE_RequestQueue.dispatchedQueue.items():
            print( request_id,request_job.env['priority'],request_job.status) 
            if request_job.status == 'dispatched' :
               policy_metrics[request_job.env['priority']] += 1
        print('policy_metrics',policy_metrics)
        time.sleep(5)


'''-------------------------------------------------------------------------------------------------------
           MAIN-REQUEST JODS DISPATCHER
-------------------------------------------------------------------------------------------------------'''
def init_front_server():
    
    GE_metaData.drop_front_services()

    front_dic = {'SERVICE_NAME': gDefine.FRONT_SERVER_SERVICE_NAME,
                           'IP': gDefine.FRONT_SERVER_ENDPOINT_IP, 
                         'PORT': gDefine.FRONT_SERVER_ENDPOINT_PORT 
    }

    redis_dic = {'SERVICE_NAME': gDefine.REDIS_SERVICE_NAME,
                           'IP': gDefine.REDIS_ENDPOINT_IP, 
                         'PORT': gDefine.REDIS_ENDPOINT_PORT 
    }

    kafka_dic = {'SERVICE_NAME': gDefine.KAFKA_SERVICE_NAME,
                           'IP': gDefine.KAFKA_ENDPOINT_IP, 
                         'PORT': gDefine.KAFKA_ENDPOINT_PORT 
    }
    # write front server information  to mongo_db
    GE_metaData.set_front_services(front_dic)
    # write redis service information  to mongo_db
    GE_metaData.set_front_services(redis_dic)
    # write kafka service information  to mongo_db
    GE_metaData.set_front_services(kafka_dic)
   
    # create kafka topic(GLOBAL)
    admin_client = KafkaAdminClient( bootstrap_servers=gDefine.KAFKA_SERVER_URL, client_id='test')
    # check topic exist 
    '''-----------------------
    try :   
        topic_list = []
        topic_list.append(gDefine.GLOBAL_SCHEDULER_GLOBAL_TOPIC_NAME)
        admin_client.delete_topics(topic_list, timeout_ms=3*1000)
        print('topic is deleted :', gDefine.GLOBAL_SCHEDULER_GLOBAL_TOPIC_NAME)
    except:
        print('topic is not exist:', gDefine.GLOBAL_SCHEDULER_GLOBAL_TOPIC_NAME)

    time.sleep(5)   
    ----------------'''
    try :  
        topic_list = []
        print('1')
        topic_list.append(NewTopic(name=gDefine.GLOBAL_SCHEDULER_GLOBAL_TOPIC_NAME, num_partitions=1, replication_factor=1))
        print('2')
        admin_client.create_topics(new_topics=topic_list, validate_only=False)
        print('3')
        print('topic is created:', gDefine.GLOBAL_SCHEDULER_GLOBAL_TOPIC_NAME)
    except:
        print('topic is exist',gDefine.GLOBAL_SCHEDULER_GLOBAL_TOPIC_NAME)
    


    
if __name__ == '__main__':
    init_front_server()
    check_is_ready()
    if gDefine.GLOBAL_SCHEDULER_IS_READY:
        print("check_is_ready is done2")
    else :
        print("Error: check_is_ready")
        exit(1)
    #app.run(host='0.0.0.0', port=8787, threaded=True)
    '''-------------------------------------------------------------------------------------------------------
           REST API THREAD 
    -------------------------------------------------------------------------------------------------------'''
    t1 = threading.Thread(target=rest_API_service)
    t1.daemon = True 
    t1.start()

    '''-------------------------------------------------------------------------------------------------------
           REQUEST JOBS PREWARMER THREAD 
    -------------------------------------------------------------------------------------------------------'''    
    t2 = threading.Thread(target=request_jobs_prewarming_service)
    t2.daemon = True 
    t2.start()

    '''-------------------------------------------------------------------------------------------------------
           REQUEST JODS DISPATCHER
    -------------------------------------------------------------------------------------------------------'''
    cnt=0
    
    while True: 
        if len(GE_RequestQueue.dispatchedQueue) < gDefine.GLOBAL_SCHEDULER_MAX_DISPATCH_SIZE :
            GE_RequestQueue.dispatch_RequestJob()
            print("dispatch_RequestJob:",cnt)
            print(GE_RequestQueue.dispatchedQueue)
        else :
            print("dispatch_RequestJob buffer is fulled")
        cnt=cnt+1
        time.sleep(5)
