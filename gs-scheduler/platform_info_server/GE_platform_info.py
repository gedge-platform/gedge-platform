
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
import GE_meta_data as gMeta

from GE_kafka import gKafka
from GE_meta_data import metaData
from GE_redis import redisController

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
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'

try :
    config.load_incluster_config()
except:
    config.load_kube_config()
    
v1 = client.CoreV1Api()

GE_metaData = metaData()


def create_default_admin_user():
    # set admin user 
    admin_dic= { 'user_name'  : gDefine.SUPER_USER_DEFAULT_NAME ,
                 'user_type'  : gDefine.USER_TYPE_SUPER,
                 'user_email' : 'admin.co.kr',
                 'user_status': 'active',
    }
    admin_dic['cdate'] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    admin_dic['user_passwd'] = generate_password_hash(gDefine.SUPER_USER_DEFAULT_PASSWD)
    status, msg = GE_metaData.create_new_user_info(admin_dic)
    if  status == 'success' :
        print('create successly admin user',msg)
    else :
        print('can not create successly user',msg)
        

'''-------------------------------------------------------------------------------------------------------
      INIT PLATFORM INFO    
-------------------------------------------------------------------------------------------------------'''
def init_platform_info():
    # set global define data
    '''------------------------------------------------
            KAFKA MESSAGE
    ------------------------------------------------'''
    while 1:  
        print('while')   
        r = gMeta.find_service_from_gService_list(gDefine.GEDGE_SYSTEM_NAMESPACE,gDefine.KAFKA_SERVICE_NAME)
        if r : 
            gDefine.KAFKA_ENDPOINT_IP   = r['access_host']
            gDefine.KAFKA_ENDPOINT_PORT = r['access_port']
            gDefine.KAFKA_SERVER_URL    = str(gDefine.KAFKA_ENDPOINT_IP)+str(':')+str(gDefine.KAFKA_ENDPOINT_PORT)
            print(gDefine.KAFKA_ENDPOINT_IP,gDefine.KAFKA_ENDPOINT_PORT)
            print('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
            break
        else :
            print('wait for running platform service',)
            time.sleep(gDefine.WAIT_RUNNING_PLATFORM_SERVICES_SECOND_TIME) 
            continue

    '''-----------------------------------------------
            REDIS
    -----------------------------------------------'''
    while 1:
        print('while')   
        r = gMeta.find_service_from_gService_list(gDefine.GEDGE_SYSTEM_NAMESPACE,gDefine.REDIS_SERVICE_NAME)
        if r : 
            gDefine.REDIS_ENDPOINT_IP   = r['access_host']
            gDefine.REDIS_ENDPOINT_PORT = r['access_port']
            print(gDefine.REDIS_ENDPOINT_IP,gDefine.REDIS_ENDPOINT_PORT)
            print('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
            break
        else :
            print('wait for running platform service',)
            time.sleep(gDefine.WAIT_RUNNING_PLATFORM_SERVICES_SECOND_TIME) 
            continue

    '''-----------------------------------------------
            MONGO DB 
    -----------------------------------------------'''
    while 1: 
        print('while')          
        r = gMeta.find_service_from_gService_list(gDefine.GEDGE_SYSTEM_NAMESPACE,gDefine.MONGO_DB_SERVICE_NAME)
        if r : 
            gDefine.MONGO_DB_ENDPOINT_IP   = r['access_host']
            gDefine.MONGO_DB_ENDPOINT_PORT = r['access_port']
            print(gDefine.MONGO_DB_ENDPOINT_IP,gDefine.MONGO_DB_ENDPOINT_PORT)    
            print('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
            break
        else :
            print('wait for running platform service',)
            time.sleep(gDefine.WAIT_RUNNING_PLATFORM_SERVICES_SECOND_TIME) 
            continue
    
    '''-----------------------------------------------
            write platform info to mongo_db
    -----------------------------------------------'''  
    # drop previous platform mongo_dbs 
    GE_metaData.drop_platform_metadata_from_mongodb(ip=gDefine.MONGO_DB_ENDPOINT_IP,port=gDefine.MONGO_DB_ENDPOINT_PORT)
    
    # init platform mongo_dbs 
    GE_metaData.init_platform_metadata_from_mongodb(ip=gDefine.MONGO_DB_ENDPOINT_IP,port=gDefine.MONGO_DB_ENDPOINT_PORT) 
    
    # read platform services information from k8s 
    platform_service_list = gMeta.get_gService_list_with_k8s(gDefine.GEDGE_SYSTEM_NAMESPACE)
    # read faas services information from k8s 
    faas_service_list = gMeta.get_gService_list_with_k8s(gDefine.GEDGE_FAAS_NAMESPACE)
    platform_service_list.extend(faas_service_list)
    if not platform_service_list :
        print('error: init_platform_info' )
        exit(0)
    # set services information to mongo_db 
    for data_dic in platform_service_list :
        GE_metaData.set_platform_namespaced_service(data_dic)
    
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
    response_data['result'] = "test" 

    response = app.response_class(response=json.dumps(response_data), status=200, mimetype='application/json')
    gDefine.logger.info('test')
    return response
'''-------------------------------------------------------------------------------------------------------
           PLATFORM SERVICE REST API
-------------------------------------------------------------------------------------------------------'''
@app.route(f'{PREFIX}/platformServices/namespaces/<namespace>/services/<service>', methods=['GET','DELETE'])
def platformservice_namespaced_service(namespace,service):
    response_data = {}
    if request.method == 'GET':
        r = GE_metaData.get_platform_namespaced_service(namespace,service)
        print('result:',r)
        response_data['result'] = r
        response = app.response_class(response=json.dumps(response_data), status=200, mimetype='application/json')
        return response                                                       
    elif  request.method == 'DELETE' :
        status, msg_data = GE_metaData.delete_platform_namespaced_service(namespace,service)
        print('delete_platform_namespaced_service: result',msg_data)
        if status == 'fail' :
            abort(406, description = msg_data)
        else:
            return jsonify(msg_data)
    else :
        return response_wihterror('MethodNotAllowed', 'error: platformservice') 

@app.route(f'{PREFIX}/platformServices/namespaces/<namespace>', methods=['GET','DELETE'])
def platformservice_namespaced_service_list(namespace):
    response_data = {}
    if request.method == 'GET':
        r = GE_metaData.get_platform_namespaced_service_list(namespace)
        response_data['result'] = r
        response = app.response_class(response=json.dumps(response_data), status=200, mimetype='application/json')
        return response
    elif  request.method == 'DELETE' :
        status, msg_data = GE_metaData.delete_platform_namespaced_service_by_namespacename(namespace)
        print('delete_platform_namespaced_service_by_namespacename: result',msg_data)
        if status == 'fail' :
            abort(406, description = msg_data)
        else:
            return jsonify(msg_data)
    else :
        return response_wihterror('MethodNotAllowed', 'error: platformservice') 

@app.route(f'{PREFIX}/platformServices', methods=['GET','DELETE'])
def platformservices():
    response_data = {}
    if request.method == 'GET':
        r = GE_metaData.get_platform_service_list()
        print('platform_service_type',type(r))
        print('platform_service_list',r)
        response_data['result'] = r
        response = app.response_class(response=json.dumps(response_data,default=json_util.default), status=200, mimetype='application/json')
        return response    
    elif  request.method == 'DELETE' :
        r = GE_metaData.drop_platform_service_info()
        response_data['result'] = 'dropped'
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
        response_data['result'] = r
        response = app.response_class(response=json.dumps(response_data,default=json_util.default), status=200, mimetype='application/json')
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
        response_data['result'] = r
        response = app.response_class(response=json.dumps(response_data,default=json_util.default), status=200, mimetype='application/json')
        return response
    elif  request.method == 'DELETE' :
        r = GE_metaData.drop_cluster_info()
        response_data['result'] = 'dropped'
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
        response_data['result'] = r
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
        response_data['result'] = r
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
              cdate : cd1
           }
-------------------------------------------------------------------------------------------------------''' 
def isadmin():
    if 'user' not in session:
        abort(406, description='you have to login.')

    if session['user'] != gDefine.SUPER_USER_DEFAULT_NAME :
        abort(406, description='super user is allowed.')
    return True

def email_check(email):
    email_regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    if(re.fullmatch(email_regex, email)):
        return True
    else:
        return False

@app.route(f'{PREFIX}/users/login', methods=['POST'])
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
        
        if user_info['user_name'] == gDefine.SUPER_USER_DEFAULT_NAME  :
            status, msg_passwd = GE_metaData.get_passwd_from_user_info(gDefine.SUPER_USER_DEFAULT_NAME)
            if status =='success' and check_password_hash(msg_passwd, user_info['user_passwd']):
                session['user'] = gDefine.SUPER_USER_DEFAULT_NAME
                return  jsonify({'resut':'login success'})
            else :
                abort(406, description='login is failed.')
        else :
            status, msg_passwd = GE_metaData.get_passwd_from_user_info(user_info['user_name'])
        
        if status =='success' and check_password_hash(msg_passwd, user_info['user_passwd']):
            session['user'] = user_info['user_name']
            return  jsonify({'resut':'login success'})
        else:
            abort(406, description='login is failed.')
    else : 
        abort(406, description='login is failed.')

@app.route(f'{PREFIX}/users', methods=['GET', 'POST'])
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

        temp_user = {}
        temp_user['user_name']   = requested_user_data['user_name']
        temp_user['user_passwd'] = requested_user_data['user_passwd']
        temp_user['user_email']  = requested_user_data['user_email']
        temp_user['user_status'] = 'active'
        temp_user['user_type']   = 'normal'
        temp_user['cdate'] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        new_user = temp_user
        new_user['user_passwd'] = generate_password_hash(temp_user['user_passwd'])
        print('new_user::',new_user)
        status, msg =GE_metaData.create_new_user_info(new_user)
        if  status == 'fail' :
            print( msg ,requested_user_data['user_name'])
            abort(406, description = msg)
        print('new_user:::',new_user)
        new_user.pop('user_passwd')
        new_user.pop('_id')
        return jsonify(new_user), 201

    elif request.method == "GET":
        rs = GE_metaData.get_user_info_list()
        users_list = []
        for r in rs:
            r.pop('user_passwd')
            users_list.append(r)
        return jsonify(users_list)
    else :
        return response_wihterror('MethodNotAllowed', 'error: nodes')

@app.route(f'{PREFIX}/users/<user_name>', methods=['GET', 'PUT', 'DELETE'])
def users_user(user_name):
    if request.method == 'PUT' or request.method == 'DELETE':
        print(' session-1: ',session)
        if 'user' not in session:
            session_data = {}
            for key in session:
                print('key',key)
                session_data[key] = session[key]
            print('Session Data 1:', session_data)
            abort(406, description='you have to login.')
        else:
            session_data = {}
            for key in session:
                print('key',key)
                session_data[key] = session[key]
            print('Session Data 2:', session_data)
    
    if request.method == 'PUT':
        if request.data == None:
            abort(406, description='content is empty.')
        current_user = GE_metaData.get_user_info(user_name)
        if current_user == None :
            print('user_name is not exists.',user_name) 
            abort(406, description='user_name is not exists.')
            
        temp_user = current_user
        requested_user_data = json.loads(request.data.decode('utf8'))
        
        if session['user'] == gDefine.SUPER_USER_DEFAULT_NAME:
            if 'user_status' in requested_user_data :
                temp_user['user_status']  = requested_user_data['user_status']             
            if 'user_email' in requested_user_data and email_check(requested_user_data['user_email']) != False:
                temp_user['user_email']  = requested_user_data['user_email']
        elif session['user'] == user_name :
            if 'user_email' in requested_user_data and email_check(requested_user_data['user_email']) != False:
                temp_user['user_email']  = requested_user_data['user_email']
        else :
            abort(406, description='you have to login.')
                
        temp_user['cdate'] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        changed_user = temp_user
        status, msg = GE_metaData.set_user_info(changed_user)
        if status == 'fail' :
            print('error : user is updated',msg)
            abort(406, description=str(msg))
        else:
            changed_user.pop('user_passwd')
            return jsonify(changed_user), 201
            
    elif request.method == 'GET':
        status, msg = GE_metaData.get_user_info(user_name)
        if  status == 'fail' :
            abort(406, description = msg)
        else :    
            result.pop('user_passwd')
            return jsonify(result)

    elif request.method == 'DELETE':
        # check all related resource are deleted 
        result = GE_metaData.delete_user_info(user_name)
        if  result == None :
            abort(406, description='user_name is not exists.')
        else :    
            print('user_name is deleted:',user_name)
            return jsonify(result)
        
@app.route(f'{PREFIX}/users/<user_name>/changePasswd', methods=['POST'])
def change_user_passwd(user_name):
    if request.method == 'POST':
        if 'current_passwd' in request.args:
            current_passwd = request.args.get('current_passwd')
        else:
            abort(406, description='current_passwd is empty.')
        if 'change_passwd' in request.args:
            change_passwd = request.args.get('change_passwd')
        else:
            abort(406, description='change_passwd is empty.')
        
        result = GE_metaData.get_user_info(user_name)
        if  result == None :
            abort(406, description='user_name  is not exists.')
        else :    
            if check_password_hash(result['user_passwd'], current_passwd):
                temp_user = {}
                temp_user['user_name']   = user_name
                temp_user['user_email']  = result['user_email']
                temp_user['user_status'] = result['user_status']
                temp_user['user_type']   = result['user_type']
                changed_user = temp_user
                changed_user['user_passwd'] = generate_password_hash(change_passwd)
                
                status, msg = GE_metaData.set_user_info(changed_user)
                if status == 'fail':
                    print('Error during set_user_info command')
                    abort(406, description = msg)
                else:
                    changed_user.pop('user_passwd')
                    print('change_user_passwd is completed.',changed_user)
                    return jsonify(changed_user), 201
            else:
                abort(406, description='currentPasswd is not correct .') 

'''-------------------------------------------------------------------------------------------------------
           WORKSPACE REST API
           
           WORKSPACES_INFO
           { 
                user_name: user_name,
                workspace_name : ws1,
                workspace_uid : wuid1 
                select_clusters : [c1,c2],
                workspace_status : s1,
                cdate : cd1 
           }
-------------------------------------------------------------------------------------------------------''' 
@app.route(f'{PREFIX}/users/<user_name>/workspaces', methods=['GET', 'POST'])
def workspaces(user_name):
    #if request.method == 'POST' or request.method == 'GET':
    #    if 'user' not in session:
    #        abort(406, description='you have to login.')
    print('workspaces',request)        
    if request.method == 'POST':
        if request.data == None:
            abort(400, description='content is empty.')
        #if session['user'] == gDefine.SUPER_USER_DEFAULT_NAME:
        #    abort(406, description='admin can not create workspaces.')
        requested_workspaces_data = json.loads(request.data.decode('utf8'))

        if 'workspace_name' not in requested_workspaces_data:
            abort(400, description='workspace_name is empty.')
        if 'select_clusters' not in requested_workspaces_data:
            abort(400, description='select_clusters is empty.')
      
        temp_workspace = {}
        temp_workspace['workspace_name']    = requested_workspaces_data['workspace_name']
        temp_workspace['workspace_uid']     = str(uuid.uuid4())
        temp_workspace['select_clusters'] = requested_workspaces_data['select_clusters']
        temp_workspace['user_name']         = user_name
        temp_workspace['cdate'] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # check user_name
        if GE_metaData.get_user_info(user_name) == None :
            abort(400, description='user_name is not exists.')
        # check issubset of select_clusters
        tt=temp_workspace['select_clusters']
        print('select_clusters',tt,type(tt))
        issub = GE_metaData.issubset_clusters(temp_workspace['select_clusters'])
        
        if issub != True:
            abort(400, description='select_clusters is not issubset.')
        new_workspace = temp_workspace
        create_result = GE_metaData.create_new_workspace_info(new_workspace)
        print('create_result',create_result)
        if create_result == None :
            print('workspace_name is already exists',requested_workspaces_data['workspace_name'])
            abort(406, description='workspace_name is already exists.')
        new_workspace.pop('_id')
        return jsonify(new_workspace), 201

    elif request.method == 'GET':
        rs = GE_metaData.get_workspace_info_list()
        workspaces_list = []
        for r in rs:            
            workspaces_list.append(r)
        return jsonify(workspaces_list)
    else :
        return response_wihterror('MethodNotAllowed', 'error: workspaces')

@app.route(f'{PREFIX}/users/<user_name>/workspaces/<workspace_name>', methods=['GET', 'DELETE'])
def workspaces_workspace(user_name,workspace_name):
    if request.method == 'GET':
        result=GE_metaData.get_workspace_info(user_name,workspace_name)
        if  result == None:
            abort(406, description='workspace is not exists.')
        else :
            return jsonify(result)
    elif request.method == 'DELETE':
        if GE_metaData.isexist_workspace(user_name,workspace_name) :
            if GE_metaData.isempty_project(user_name,workspace_name) :
                status, msg_data = GE_metaData.delete_workspace_info(user_name,workspace_name)
                if status == 'fail':
                    abort(406, description = msg_data )
                else :
                    return jsonify(msg_data)
            else :
                abort(406, description='project of workspace is not empty')
        else :
            abort(406, description='workspace is not exists.')
    else :
        return response_wihterror('MethodNotAllowed', 'error: workspaces')

'''-------------------------------------------------------------------------------------------------------
           PROJECT REST API
           
           PROJECTS_INFO
           { 
                user_name : user1,
                workspace_name: ws1,
                project_name : p1
                cdate: cd1
           }
-------------------------------------------------------------------------------------------------------''' 

@app.route(f'{PREFIX}/users/<user_name>/workspaces/<workspace_name>/projects', methods=['GET', 'POST'])
def projects(user_name,workspace_name):
    #if request.method == 'POST' or request.method == 'GET':
    #    if 'user' not in session:
    #        abort(406, description='you have to login.')
            
    if request.method == 'POST':
        if request.data == None:
            abort(406, description='content is empty.')
    #    if session['user'] == gDefine.SUPER_USER_DEFAULT_NAME:
    #        abort(406, description='admin can not create project.')
            
        requested_projects_data = json.loads(request.data.decode('utf8'))

        if 'project_name' not in requested_projects_data:
            abort(406, description='project_name is empty.')
        if 'select_clusters' not in requested_projects_data:
            abort(406, description='select_clusters is empty.')
              
        temp_project = {}
        temp_project['user_name']       = user_name
        temp_project['workspace_name']  = workspace_name
        temp_project['project_name']    = requested_projects_data['project_name']
        temp_project['select_clusters'] = requested_projects_data['select_clusters']
        
        new_project = temp_project
            
        status, msg_data = GE_metaData.create_new_project_info(new_project)
        if status == 'fail' :
            print('error : create_new_project_info',msg_data)
            abort(406, description = msg_data)
        else :
            print('create_new_project_info::',msg_data)
            new_project.pop('_id')
            return jsonify(new_project), 201
    elif request.method == 'GET':
        rs = GE_metaData.get_project_info_list(user_name,workspace_name)
        workspaces_list = []
        for r in rs:
            workspaces_list.append(r)
        return jsonify(workspaces_list)
    else :
        return response_wihterror('MethodNotAllowed', 'error: workspaces')

@app.route(f'{PREFIX}/users/<user_name>/workspaces/<workspace_name>/projects/<project_name>', methods=['GET', 'DELETE'])
def projects_project(user_name,workspace_name,project_name):
            
    if request.method == 'GET':
        result = GE_metaData.get_project_info(user_name,workspace_name,project_name)
        if  result == None:
            abort(406, description='project  is not exists.')
        else :
            return jsonify(result)
    elif request.method == 'DELETE':
        status, msg_data = GE_metaData.delete_project_info(user_name,workspace_name,project_name)
        if  status == 'fail':
            abort(406, description = msg_data)
        else :
            return jsonify(msg_data)
    else :
        return response_wihterror('MethodNotAllowed', 'error: workspaces')

if __name__ == '__main__':
    
    init_platform_info() 
    if gDefine.KAFKA_SERVER_URL != None :
        GP_kafka = gKafka([gDefine.KAFKA_SERVER_URL])
        # create topic for GEDGE_GLOBAL_API_TOPIC_NAME
        GP_kafka.create_topic(gDefine.GEDGE_GLOBAL_API_TOPIC_NAME,1,1)
    else :
        print('error : init_platform_info')
        exit(1)
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
        #print('main loop')
        time.sleep(5)
