
#from __future__ import print_function
import sys
sys.path.append('../gelib')
sys.path.append('../gedef')
from kubernetes import client, config
import json
from operator import itemgetter
from flask import Flask, request, abort,jsonify, render_template, redirect, url_for
from werkzeug.utils import secure_filename
from flask import send_from_directory, session
import os
import threading, time
import uuid 
import GE_define as gDefine
import GE_platform_define as pDefine
import GE_kubernetes as gKube
import GE_platform_util as pUtil

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

import re
import datetime
from werkzeug.security import generate_password_hash, check_password_hash
 


app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

try :
    config.load_incluster_config()
except:
    config.load_kube_config()
    
v1 = client.CoreV1Api()

GE_metaData = metaData()

def create_default_admin_user():
    # set admin user 
    admin_dic= { 'user_name'  : 'admin',
                 'user_type'  : 'admin',
                 'user_email' : 'admin.co.kr',
                 'user_status': 'active',
                 'workspaces' : []
    }
    admin_dic['cdate'] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    admin_dic['user_passwd'] = generate_password_hash(gDefine.ADMIN_DEFAULT_PASSWD)
    
    if GE_metaData.create_new_user_info(admin_dic) != None :
        print('create successly admin user')
    else :
        print('error : create successly admin user')
        

'''-------------------------------------------------------------------------------------------------------
      INIT PLATFORM INFO    
-------------------------------------------------------------------------------------------------------'''
def init_platform_info(gemetadata):
    # set global define data
    '''------------------------------------------------
            KAFKA MESSAGE
    ------------------------------------------------'''
    while 1:     
        r = pUtil.find_service_from_platform_service_list_with_k8s(gDefine.GEDGE_SYSTEM_NAMESPACE,gDefine.KAFKA_SERVICE_NAME)
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
        r = pUtil.find_service_from_platform_service_list_with_k8s(gDefine.GEDGE_SYSTEM_NAMESPACE,gDefine.REDIS_SERVICE_NAME)
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
        r = pUtil.find_service_from_platform_service_list_with_k8s(gDefine.GEDGE_SYSTEM_NAMESPACE,gDefine.MONGO_DB_SERVICE_NAME)
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
            write platform info to mongo_db
    -----------------------------------------------'''  
    # drop previous platform mongo_dbs 
    gemetadata.drop_platform_metadata_from_mongodb(ip=gDefine.MONGO_DB_ENDPOINT_IP,port=gDefine.MONGO_DB_ENDPOINT_PORT)
    
    # init platform mongo_dbs 
    gemetadata.init_platform_metadata_from_mongodb(ip=gDefine.MONGO_DB_ENDPOINT_IP,port=gDefine.MONGO_DB_ENDPOINT_PORT) 
    
    # read platform services information from k8s 
    platform_service_list = pUtil.get_list_namespaced_services_with_k8s(gDefine.GEDGE_SYSTEM_NAMESPACE)
    # read faas services information from k8s 
    faas_service_list = pUtil.get_list_namespaced_services_with_k8s(gDefine.GEDGE_FAAS_NAMESPACE)
    platform_service_list.extend(faas_service_list)
    if not platform_service_list :
        print('error: init_platform_info' )
        exit(0)
    # set services information to mongo_db 
    for data_dic in platform_service_list :
        gemetadata.set_platform_namespaced_service(data_dic)
    
    # create default admin user 
    create_default_admin_user()

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
           REST API
-------------------------------------------------------------------------------------------------------'''
PREFIX = '/GEP/INFO'

def rest_API_service():
    app.run(host='0.0.0.0', port=8787, threaded=True)

def list_pod():
    print("Listing pods with their IPs:")
    ret = v1.list_pod_for_all_namespaces(watch=False)
    for i in ret.items:
        print("%s\t%s\t%s" %
              (i.status.pod_ip, i.metadata.namespace, i.metadata.name))

@app.route('/test', methods=['GET','POST'])
def test():
    #print(request.get_json())
    response_data = {}
    response_data['Result'] = "test" 

    response = app.response_class(response=json.dumps(response_data), status=200, mimetype='application/json')
    gDefine.logger.info('test')
    return response
'''-------------------------------------------------------------------------------------------------------
           PLATFORM SERVICE REST API
-------------------------------------------------------------------------------------------------------'''
@app.route(f'{PREFIX}/platformServices/namespace/<namespace>/service/<service>', methods=['GET','DELETE'])
def platformservice_namespaced_service(namespace,service):
    response_data = {}
    if request.method == 'GET':
        r = GE_metaData.get_platform_namespaced_service(namespace,service)
        print('result:',r)
        response_data['Result'] = r
        response = app.response_class(response=json.dumps(response_data), status=200, mimetype='application/json')
        return response
    elif  request.method == 'DELETE' :
        r = GE_metaData.delete_platform_namespaced_service(namespace,service)
        print('delete_platform_namespaced_service: result',r)
        response_data['Result'] = {'namespace' : namespace, 'service_name' : service }
        response = app.response_class(response=json.dumps(response_data), status=200, mimetype='application/json')
        return response    
    else :
        return response_wihterror('MethodNotAllowed', 'error: platformservice') 

@app.route(f'{PREFIX}/platformServices/namespaces/<namespace>', methods=['GET','DELETE'])
def platformservice_namespaced_service_list(namespace,service):
    response_data = {}
    if request.method == 'GET':
        r = GE_metaData.get_platform_namespaced_service_list(namespace)
        response_data['Result'] = r
        response = app.response_class(response=json.dumps(response_data), status=200, mimetype='application/json')
        return response
    elif  request.method == 'DELETE' :
        r = GE_metaData.delete_platform_namespaced_service_by_namespacename(namespace)
        print('delete_platform_namespaced_service_by_namespacename: result',r)
        response_data['Result'] = {'namespace' : namespace}
        response = app.response_class(response=json.dumps(response_data), status=200, mimetype='application/json')
        return response
    else :
        return response_wihterror('MethodNotAllowed', 'error: platformservice') 

@app.route(f'{PREFIX}/platformServices', methods=['GET','DELETE'])
def platformservices():

    response_data = {}
    if request.method == 'GET':
        r = GE_metaData.get_platform_service_list()
        print('platform_service_type',type(r))
        print('platform_service_list',r)
        response_data['Result'] = r
        response = app.response_class(response=json.dumps(response_data,default=json_util.default), status=200, mimetype='application/json')
        return response    
    elif  request.method == 'DELETE' :
        r = GE_metaData.drop_platform_service_info()
        response_data['Result'] = 'dropped'
        response = app.response_class(response=json.dumps(response_data), status=200, mimetype='application/json')
        return response    
    else :
        return response_wihterror('MethodNotAllowed', 'error: platformservices') 

'''-------------------------------------------------------------------------------------------------------
           CLUSTER REST API
-------------------------------------------------------------------------------------------------------'''    
@app.route(f'{PREFIX}/clusters/<clustername>', methods=['GET'])
def cluster(clustername):
    response_data = {}
    if request.method == 'GET':
        r = GE_metaData.get_cluster_info(clustername)
        response_data['Result'] = r
        response = app.response_class(response=json.dumps(response_data), status=200, mimetype='application/json')
        return response
    else :
        return response_wihterror('MethodNotAllowed', 'error: cluster') 

@app.route(f'{PREFIX}/clusters', methods=['GET','DELETE'])
def clusters():
    response_data = {}
    if request.method == 'GET':
        r = GE_metaData.get_cluster_info_list()
        print('clusters type',type(r))
        print('cluster_list',r)
        response_data['Result'] = r
        response = app.response_class(response=json.dumps(response_data,default=json_util.default), status=200, mimetype='application/json')
        return response
    elif  request.method == 'DELETE' :
        r = GE_metaData.drop_cluster_info()
        response_data['Result'] = 'dropped'
        response = app.response_class(response=json.dumps(response_data), status=200, mimetype='application/json')
        return response
    else :
        return response_wihterror('MethodNotAllowed', 'error: clusters')     
'''-------------------------------------------------------------------------------------------------------
           CLUSTER/NODE REST API
-------------------------------------------------------------------------------------------------------''' 
@app.route(f'{PREFIX}/clusters/<clustername>/nodes/<nodename>', methods=['GET'])
def node(clustername,nodename):
    response_data = {}
    if request.method == 'GET':
        r = GE_metaData.get_node_info(clustername,nodename)
        response_data['Result'] = r
        response = app.response_class(response=json.dumps(response_data), status=200, mimetype='application/json')
        return response
    else :
        return response_wihterror('MethodNotAllowed', 'error: node')

@app.route(f'{PREFIX}/clusters/<clustername>/nodes', methods=['GET'])
def nodes(clustername):
    response_data = {}
    if request.method == 'GET':
        try :
            node_type = request.args.get('nodetype')
        except:
            node_type = None
        if node_type == None :
            r = GE_metaData.get_node_info_list_by_clustername(clustername)
        else:
            print('node_type',node_type)
            r = GE_metaData.get_node_info_by_node_type(clustername,node_type)    
        print('node_list',r)
        response_data['Result'] = r
        response = app.response_class(response=json.dumps(response_data,default=json_util.default), status=200, mimetype='application/json')
        return response    
    else :
        return response_wihterror('MethodNotAllowed', 'error: nodes')

'''-------------------------------------------------------------------------------------------------------
           USER REST API
           
           USERS_INFO
           { 
              user_name : user1,
              user_type : super/normal
              user_passwd : p1,
              user_email : e1,
              user_status: s1,
              workspaces : [ws1,ws2],
              cdate : cd1
           }
-------------------------------------------------------------------------------------------------------''' 
def isadmin():
    if 'user' not in session:
        abort(406, description='you have to login.')

    if session['user'] != 'admin':
        abort(406, description='super user is allowed.')

def email_check(email):
    email_regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    if(re.fullmatch(email_regex, email)):
        return True
    else:
        return False

@app.route(f"{PREFIX}/users/login", methods=["POST"])
def user_login():
    if request.method == "POST":
        if request.data == None:
            abort(406, description='content is empty.')
        #check json data
        user_info = json.loads(request.data.decode('utf8'))
        if 'user_name' not in user_info:
            abort(406, description='user_name is empty.')
        if 'user_passwd' not in user_info:
            abort(406, description='user_passwd is empty.')
        # check admin passwd
        if user_info['user_name'] == 'admin' :
            if check_password_hash(generate_password_hash(gDefine.ADMIN_DEFAULT_PASSWD), user_info['user_passwd']):
                session['user'] = 'admin'
                return  jsonify({'resut':'login success'})
            else :
                abort(406, description='login is failed.')
        result = GE_metaData.get_user_info(user_info['user_name'])
        if  result == None :
            abort(406, description='user_name  is not exists.')
        if check_password_hash(result['user_passwd'], user_info['user_passwd']):
            session['user'] = user_info['user_name']
            return  jsonify({'resut':'login success'})
        else:
            abort(406, description='login is failed.')
    else : 
        abort(406, description='login is failed.')


@app.route(f"{PREFIX}/users", methods=["GET", "POST"])
def users():
    if request.method == "POST":
        if request.data == None:
            abort(406, description='content is empty.')
            return
        requested_user_data = json.loads(request.data.decode('utf8'))

        if 'user_name' not in requested_user_data:
            abort(406, description='user_name is empty.')
        if 'user_passwd' not in requested_user_data:
            abort(406, description='user_passwd is empty.')
        if 'user_email' not in requested_user_data:
            abort(406, description='user_email is empty.')
        if email_check(requested_user_data['user_email']) == False:
            abort(406, description='user_email is not email format.')
        if 'workspaces' not in requested_user_data:
            abort(406, description='workspaces is empty.')
        else :
            # check workspaces is exist 
            for w in requested_user_data['workspaces']:
                if GE_metaData.get_workspace_info(w) == None :
                    abort(406, description='workspace is not exists.')

        temp_user = {}
        temp_user['user_name']   = requested_user_data['user_name']
        temp_user['user_passwd'] = requested_user_data['user_passwd']
        temp_user['user_email']  = requested_user_data['user_email']
        temp_user['workspace']   = requested_user_data['workspaces']
        
        temp_user['user_status'] = 'active'
        temp_user['user_type']   = 'user'
        temp_user['cdate'] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        new_user = temp_user
        new_user['user_passwd'] = generate_password_hash(temp_user['user_passwd'])
        
        if GE_metaData.create_new_user_info(new_user) == None :
            print('user_name is already exists',requested_user_data['user_name'])
            abort(406, description='user_name is already exists.')
        
        new_user.pop('_id')
        new_user.pop('user_passwd')
        return jsonify(new_user), 201

    elif request.method == "GET":
        rs = GE_metaData.get_user_info_list()
        users_list = []
        for r in rs:
            r.pop('_id')
            r.pop('user_passwd')
            users_list.append(r)
        return jsonify(users_list)
    else :
        return response_wihterror('MethodNotAllowed', 'error: nodes')

app.route(f"{PREFIX}/users/<user_name>", methods=["GET", "PUT", "DELETE"])
def users_user(user_name):
    
    if request.method == 'PUT' or request.method == 'DELETE':
        if 'user' not in session:
            abort(406, description='you have to login.')

        is_ok = False

        if session['user'] == 'admin' or session['user'] == user_name:
            is_ok = True

        if is_ok == False:
            abort(406, description='session user is wrong.')
    if request.method == "PUT":
        if request.data == None:
            abort(406, description='content is empty.')
        if 'currentPasswd' in request.args:
            current_passwd = request.args.get('currentPasswd')
        else:
            # need check module when user is admin 
            abort(406, description='currentPasswd is empty.')
        
        # get current users_info by user_name
        current_user = GE_metaData.get_user_info(user_name)
        if current_user == None :
            print('user_name is not exists.',user_name) 
            abort(406, description='user_name is not exists.')
            
        temp_user = current_user
        # need check module when user is admin 
        if check_password_hash(current_user['user_passwd'], current_passwd):
            requested_user_data = json.loads(request.data.decode('utf8'))
            # update
            if 'user_status' in requested_user_data :
                temp_user['user_status']  = requested_user_data['user_status']             
            if 'user_email' in requested_user_data and email_check(requested_user_data['user_email']) != False:
                temp_user['user_email']  = requested_user_data['user_email']
            '''
            if 'workspaces' in requested_user_data:
                # check workspaces is exist 
                for w in requested_user_data['workspaces']:
                    if GE_metaData.isowner_of_workspace(w,user_name) == None :
                        abort(406, description='workspace is not exists.')
                temp_user['workspace'] = requested_user_data['workspaces']
            '''    
            temp_user['cdate'] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            changed_user = temp_user
            changed_user['user_passwd'] = generate_password_hash(current_passwd)
            
            if GE_metaData.set_user_info(changed_user) == None :
                print('user is updated with:',user_name)
                abort(406, description='user_name is not exists.')
            else:
                changed_user.pop('_id')
                changed_user.pop('user_passwd')
                return jsonify(changed_user), 201
        else :
            abort(406, description='currentPasswd is not correct .') 
    elif request.method == "GET":
        result = GE_metaData.get_user_info(user_name)
        if  result == None :
            abort(406, description='user_name  is not exists.')
        else :    
            result.pop('_id')
            result.pop('user_passwd')
            return jsonify(result)

    elif request.method == "DELETE":
        # check all related resource are deleted 
        result = GE_metaData.delete_user_info(user_name)
        if  result == None :
            abort(406, description='user_name is not exists.')
        else :    
            print('user_name is deleted:',user_name)
            response_str=str(user_name)+'is deleted:'
            return jsonify({'message':response_str})
        
app.route(f"{PREFIX}/users2/<user_name>", methods=["GET", "PUT", "DELETE"])
def users_user2(user_name):
    ''' 
    if request.method == 'PUT' or request.method == 'DELETE':
        if 'user' not in session:
            abort(406, description='you have to login.')

        is_ok = False

        if session['user'] == 'admin' or session['user'] == user_name:
            is_ok = True

        if is_ok == False:
            abort(406, description='session user is wrong.')
    '''
    if request.method == "PUT":
        if request.data == None:
            abort(406, description='content is empty.')
        if 'currentPasswd' in request.args:
            current_passwd = request.args.get('currentPasswd')
        else:
            # need check module when user is admin 
            abort(406, description='currentPasswd is empty.')
        
        # get current users_info by user_name
        current_user = GE_metaData.get_user_info(user_name)
        if current_user == None :
            print('user_name is not exists.',user_name) 
            abort(406, description='user_name is not exists.')
            
        temp_user = current_user
        # need check module when user is admin 
        if check_password_hash(current_user['user_passwd'], current_passwd):
            requested_user_data = json.loads(request.data.decode('utf8'))
            # update
            if 'user_status' in requested_user_data :
                temp_user['user_status']  = requested_user_data['user_status']             
            if 'user_email' in requested_user_data and email_check(requested_user_data['user_email']) != False:
                temp_user['user_email']  = requested_user_data['user_email']
            '''
            if 'workspaces' in requested_user_data:
                # check workspaces is exist 
                for w in requested_user_data['workspaces']:
                    if GE_metaData.isowner_of_workspace(w,user_name) == None :
                        abort(406, description='workspace is not exists.')
                temp_user['workspace'] = requested_user_data['workspaces']
            '''    
            temp_user['cdate'] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            changed_user = temp_user
            changed_user['user_passwd'] = generate_password_hash(current_passwd)
            
            if GE_metaData.set_user_info(changed_user) == None :
                print('user is updated with:',user_name)
                abort(406, description='user_name is not exists.')
            else:
                changed_user.pop('_id')
                changed_user.pop('user_passwd')
                return jsonify(changed_user), 201
        else :
            abort(406, description='currentPasswd is not correct .') 
    elif request.method == "GET":
        result = GE_metaData.get_user_info(user_name)
        if  result == None :
            abort(406, description='user_name  is not exists.')
        else :    
            result.pop('_id')
            result.pop('user_passwd')
            return jsonify(result)

    elif request.method == "DELETE":
        # check all related resource are deleted 
        result = GE_metaData.delete_user_info(user_name)
        if  result == None :
            abort(406, description='user_name is not exists.')
        else :    
            print('user_name is deleted:',user_name)
            response_str=str(user_name)+'is deleted:'
            return jsonify({'message':response_str})

app.route(f"{PREFIX}/users/<user_name>/changePasswd", methods=["POST"])
def change_user_passwd(user_name):
    if request.method == "POST":
        if 'currentPasswd' in request.args:
            current_passwd = request.args.get('currentPasswd')
        else:
            abort(406, description='currentPasswd is empty.')
        if 'changePasswd' in request.args:
            change_passwd = request.args.get('changePasswd')
        else:
            abort(406, description='changePasswd is empty.')
        
        result = GE_metaData.get_user_info(user_name)
        if  result == None :
            abort(406, description='user_name  is not exists.')
        else :    
            if check_password_hash(result['user_passwd'], current_passwd):
                temp_user = {}
                temp_user['user_name']   = user_name
                temp_user['user_email']  = result['user_email']
                temp_user['workspace']   = result['workspaces']
                temp_user['user_status'] = result['user_status']
                temp_user['user_type']   = result['user_type']
                changed_user = temp_user
                changed_user['user_passwd'] = generate_password_hash(change_passwd)
                set_result = GE_metaData.set_user_info(changed_user)
                if set_result == None :
                    print('user is updated with:',user_name)
                    abort(406, description='user_name is not exists.')
                else:
                    set_result.pop('_id')
                    set_result.pop('user_passwd')
                    print('change_user_passwd is completed.',set_result)
                    return jsonify(set_result), 201
            else:
                abort(406, description='currentPasswd is not correct .') 

'''-------------------------------------------------------------------------------------------------------
           WORKSPACE REST API
           
           WORKSPACES_INFO
           { 
                workspace_name : ws1,
                workspace_uid : wuid1 
                selected_clusters : [c1,c2],
                workspace_status : s1,
                owner: user_name,
                projects : [p1,p2],
                cdate : cd1 
           }
-------------------------------------------------------------------------------------------------------''' 
@app.route(f"{PREFIX}/users/<user_name>/workspaces", methods=["GET", "POST"])
def workspaces(user_name):
    if request.method == "POST":
        if request.data == None:
            abort(406, description='content is empty.')
            return
        requested_workspaces_data = json.loads(request.data.decode('utf8'))

        if 'workspace_name' not in requested_workspaces_data:
            abort(406, description='workspace_name is empty.')
        if 'selected_clusters' not in requested_workspaces_data:
            abort(406, description='selected_clusters is empty.')
      
        temp_workspace = {}
        temp_workspace['workspace_name']   = requested_workspaces_data['workspace_name']
        temp_workspace['selected_clusters'] = requested_workspaces_data['selected_clusters']
        temp_workspace['owner']  = user_name
        
        # check owner
        if GE_metaData.get_user_info(user_name) == None :
            abort(406, description='user_name is not exists.')
        # check issubset of selected_clusters
        if GE_metaData.issubset_clusters(temp_workspace['selected_clusters']):
            abort(406, description='selected_clusters is not issubset.')
        new_workspace = temp_workspace
        set_result = GE_metaData.create_new_workspace_info(new_workspace)
        if set_result == None :
            print('workspace_name is already exists',requested_workspaces_data['workspace_name'])
            abort(406, description='workspace_name is already exists.')
        
        set_result.pop('_id')
        set_result.pop('user_passwd')
        return jsonify(set_result), 201

    elif request.method == "GET":
        rs = GE_metaData.get_workspace_info_list()
        workspaces_list = []
        for r in rs:
            r.pop('_id')
            r.pop('user_passwd')
            workspaces_list.append(r)
        return jsonify(workspaces_list)
    else :
        return response_wihterror('MethodNotAllowed', 'error: workspaces')

@app.route(f"{PREFIX}/users/<user_name>/workspaces/<workspaces_name>", methods=["GET", "PUT", "DELETE"])
def workspaces_workspace(user_name,workspaces_name):
    if request.method == "PUT":
        if request.data == None:
            abort(406, description='content is empty.')
            return
        requested_workspaces_data = json.loads(request.data.decode('utf8'))

        if 'workspace_name' not in requested_workspaces_data:
            abort(406, description='workspace_name is empty.')
        if 'selected_clusters' not in requested_workspaces_data:
            abort(406, description='selected_clusters is empty.')
      
        temp_workspace = {}
        temp_workspace['workspace_name']   = requested_workspaces_data['workspace_name']
        temp_workspace['selected_clusters'] = requested_workspaces_data['selected_clusters']
        temp_workspace['owner']  = user_name
        
        # check owner
        if GE_metaData.get_user_info(user_name) == None :
            abort(406, description='user_name is not exists.')
        # check issubset of selected_clusters
        if GE_metaData.issubset_clusters(temp_workspace['selected_clusters']):
            abort(406, description='selected_clusters is not issubset.')
        new_workspace = temp_workspace
        set_result = GE_metaData.create_new_workspace_info(new_workspace)
        if set_result == None :
            print('workspace_name is already exists',requested_workspaces_data['workspace_name'])
            abort(406, description='workspace_name is already exists.')
        
        set_result.pop('_id')
        set_result.pop('user_passwd')
        return jsonify(set_result), 201

    elif request.method == "GET":
        rs = GE_metaData.get_workspace_info_list()
        workspaces_list = []
        for r in rs:
            r.pop('_id')
            r.pop('user_passwd')
            workspaces_list.append(r)
        return jsonify(workspaces_list)
    else :
        return response_wihterror('MethodNotAllowed', 'error: workspaces')


if __name__ == '__main__':
    
    init_platform_info(GE_metaData) 
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
