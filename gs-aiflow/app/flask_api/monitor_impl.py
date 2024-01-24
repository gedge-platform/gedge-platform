import ast

import yaml
import mysql.connector
import requests
import json
import os
import yaml
from flask import jsonify, request, make_response
from flask_restful import reqparse, inputs

import kubernetes.client
from kubernetes import client, config, utils
from requests.packages.urllib3.exceptions import InsecureRequestWarning

import common.logger
import flask_api.center_client
import flask_api.runtime_helper
import flask_api.filesystem_impl
from flask_api import user_impl
from flask_api.global_def import g_var, config
from flask_api.database import get_db_connection
from flask_api.monitoring_manager import MonitoringManager

requests.packages.urllib3.disable_warnings(InsecureRequestWarning)


monitoringManager = MonitoringManager()

def initTest():
    list = ['aiflow-test1', 'aiflow-test2', 'aiflow-test3', 'aiflow-test4', 'aiflow-test5']
    monitoringManager.deleteWorkFlow('softonnet-test')
    for item in list:
        flask_api.center_client.podsNameDelete(item, 'softonet', 'mec(ilsan)', 'softonnet-test')
    return jsonify(status = 'success'), 200
def launchTest():
    result = monitoringManager.addWorkFlow((monitoringManager.parseFromDAGToWorkFlow({'id': 'softonnet-test',
                                  'edges': [
                                      {
                                          'id': 'e1-2',
                                          'source': 'aiflow-test1',
                                          'target': 'aiflow-test2'
                                      },
                                      {
                                          'id': 'e1-3',
                                          'source': 'aiflow-test2',
                                          'target': 'aiflow-test3'
                                      },
                                      {
                                          'id': 'e1-4',
                                          'source': 'aiflow-test3',
                                          'target': 'aiflow-test4'
                                      },
                                      {
                                          'id': 'e1-5',
                                          'source': 'aiflow-test4',
                                          'target': 'aiflow-test5'
                                      }
                                  ],
                                  'nodes': [
                                      {
                                          'id': 'aiflow-test1',
                                          'type': 'textUpdater',
                                          'position': {
                                              'x': 0,
                                              'y': 0
                                          },
                                          'data': {
                                              'type': 'Pod',
                                              'label': '라벨1',
                                              'origin': '22',
                                              'status': 'Waiting',
                                              'erwerewr': 'rewr',
                                              'sdfwerwrq': "vcvcx",
                                              'yaml': {'apiVersion': 'v1',
                                                       'kind': 'Pod',
                                                       'metadata': {
                                                           'name': 'aiflow-test1'
                                                       },
                                                       'spec': {
                                                           'restartPolicy': 'Never',
                                                           'containers': [{
                                                               'name': 'aiflow-test1',
                                                               'image': 'aiflow/test1:v1.0.1.230329',
                                                           }]
                                                       }
                                                       }
                                          }
                                      }, {
                                          'id': 'aiflow-test2',
                                          'position': {
                                              'x': 500,
                                              'y': 0
                                          },
                                          'type': 'textUpdater',
                                          'data': {
                                              'type': 'Pod',
                                              'label': '라벨2',
                                              'status': 'Waiting',
                                              'yaml': {'apiVersion': 'v1',
                                                       'kind': 'Pod',
                                                       'metadata': {
                                                           'name': 'aiflow-test2'
                                                       },
                                                       'spec': {
                                                           'restartPolicy': 'Never',
                                                           'containers': [{
                                                               'name': 'aiflow-test1',
                                                               'image': 'aiflow/test1:v1.0.1.230329',
                                                           }]
                                                       }
                                                       },
                                          }
                                      }, {
                                          'id': 'aiflow-test3',
                                          'position': {
                                              'x': 1000,
                                              'y': 0
                                          },
                                          'type': 'textUpdater',
                                          'data': {
                                              'type': 'Pod',
                                              'label': '라벨3',
                                              'status': 'Waiting',
                                              'yaml': {'apiVersion': 'v1',
                                                       'kind': 'Pod',
                                                       'metadata': {
                                                           'name': 'aiflow-test3'
                                                       },
                                                       'spec': {
                                                           'restartPolicy': 'Never',
                                                           'containers': [{
                                                               'name': 'aiflow-test1',
                                                               'image': 'aiflow/test1:v1.0.1.230329',
                                                           }]
                                                       }
                                                       },
                                          }
                                      }, {
                                          'id': 'aiflow-test4',
                                          'position': {
                                              'x': 1500,
                                              'y': 0
                                          },
                                          'type': 'textUpdater',
                                          'data': {
                                              'type': 'Pod',
                                              'label': '라벨4',
                                              'status': 'Waiting',
                                              'yaml': {'apiVersion': 'v1',
                                                       'kind': 'Pod',
                                                       'metadata': {
                                                           'name': 'aiflow-test4'
                                                       },
                                                       'spec': {
                                                           'restartPolicy': 'Never',
                                                           'containers': [{
                                                               'name': 'aiflow-test1',
                                                               'image': 'aiflow/test1:v1.0.1.230329',
                                                           }]
                                                       }
                                                       },
                                          }
                                      }, {
                                          'id': 'aiflow-test5',
                                          'position': {
                                              'x': 2000,
                                              'y': 0
                                          },
                                          'type': 'textUpdater',
                                          'data': {
                                              'type': 'Pod',
                                              'label': '라벨5',
                                              'status': 'Waiting',
                                              'yaml': {'apiVersion': 'v1',
                                                       'kind': 'Pod',
                                                       'metadata': {
                                                           'name': 'aiflow-test5'
                                                       },
                                                       'spec': {
                                                           'restartPolicy': 'Never',
                                                           'containers': [{
                                                               'name': 'aiflow-test1',
                                                               'image': 'aiflow/test1:v1.0.1.230329',
                                                           }]
                                                       }
                                                       },
                                          }
                                      }
                                  ]
                                  })))
    if result is False:
        return jsonify(status = 'failed'), 200
    else:
        return  jsonify(status = 'success'), 200

def getDBConnection():
    if not g_var.mycon:
        g_var.mycon = mysql.connector.conn


def dummy():
    try:
        a=4
        a=a+'1'
    except:
        return make_response("dummyerror",200)
    return str('dummy')


def testAPI():
    response='empty'

    # conf=client.Configuration()
    # conf.api_key['authorization'] = 'Bearer'
    # conf.host= 'https://172.16.20.90:6443'
    #
    # api_client=client.ApiClient(conf)
    # api_instance=client.AuthenticationV1Api(api_client)
    # body=client.V1TokenReview()
    # dry_run='dry_run_example'
    # field_manager='field_manager_example'
    # field_validation = 'field_validation_example'
    # pretty = 'pretty_example'
    #
    # api_response=api_instance.create_token_review(body,
    #                                               dry_run=dry_run,
    #                                               field_manager=field_manager,
    #                                               field_validation=field_validation,
    #                                               pretty=pretty)
    # print(api_response)

    aApiClient = apiClient('cluster_test1')
    v1=client.CoreV1Api(aApiClient)
    response=v1.list_namespace()


    # example_dict = \
    #     {'apiVersion': 'v1',
    #      'kind': 'Pod',
    #      'metadata': {
    #          'name': 'python-test'
    #      },
    #      'spec':{
    #          'containers':[{
    #              'name': 'nginx-container-python',
    #              'image': 'nginx:1.16'
    #          }]
    #      }
    #      }
    # response=utils.create_from_dict(aApiClient, example_dict)

    #
    # v1=client.CoreV1Api(aApiClient)
    # response=v1.delete_namespaced_pod('python-test')

    return str(response)


def apiClient(clustername):
    mycon = get_db_connection()

    cursor=mycon.cursor()
    c = cursor.execute(f'select cluster_ip,port,token from listcluster where cluster_name="{clustername}"')
    for i in cursor:
        host,port,token=i
    host='https://'+host+':'+str(port)

    aToken=token
    aConfiguration = client.Configuration()
    aConfiguration.host = host
    aConfiguration.verify_ssl = False
    aConfiguration.api_key = {"authorization": "Bearer " + aToken}
    aApiClient = client.ApiClient(aConfiguration)
    return aApiClient


def getStorageclass(clustername=None):
    aApiClient = apiClient(clustername)
    d=dict()
    v1storage= client.StorageV1Api(aApiClient)
    ret=v1storage.list_storage_class()
    for n,i in enumerate(ret.items):
        data=[]
        data.append(i.metadata.name)
        data.append(i.metadata.namespace)
        data.append(i.allow_volume_expansion)
        data.append(i.allowed_topologies)
        data.append(i.provisioner)
        data.append(i.reclaim_policy)
        data.append(i.volume_binding_mode)
        data.append(i.metadata.creation_timestamp)

        d[str(n)]=data
    ret = jsonify(d)
    return ret


def getPV(clustername=None):
    aApiClient = apiClient(clustername)
    v1 = client.CoreV1Api(aApiClient)
    d=dict()
    ret = v1.list_persistent_volume()
    for n,i in enumerate(ret.items):
        data=[]
        data.append(i.metadata.name)
        data.append(i.metadata.namespace)
        data.append(str(i.spec.access_modes))
        data.append(str(i.spec.capacity))
        data.append(i.spec.volume_mode)
        data.append(i.spec.nfs.path)
        data.append(i.status.phase)
        data.append(i.metadata.creation_timestamp)
        data.append(i.spec.claim_ref.name)
        data.append(i.spec.claim_ref.namespace)


        d[str(n)]=data
    ret=jsonify(d)
    return ret


def getListNodeAll(clustername=None):
    aApiClient=apiClient(clustername)
    v1 = client.CoreV1Api(aApiClient)
    d=dict()
    for i in v1.list_node().items:
        data=[]
        data.append(i.status.addresses[0].address)
        data.append(i.status.addresses[0].type)

        condition=[]
        for j in i.status.conditions:
            condition_temp=[]
            condition_temp.append(j.last_heartbeat_time)
            condition_temp.append(j.last_transition_time)
            condition_temp.append(j.message)
            condition_temp.append(j.status)

            condition.insert(0,condition_temp)
        data.append(condition)

        #{ip:
        # [ip,type,[[heartbeat,transition,message,status]]]
        # }
        d[str(i.status.addresses[0].address)]=data
    ret = jsonify(d)
    return ret

#get pod info
def getListNamespacePod(result):
    result = result.to_dict(flat=False)
    result = json.loads(list(result.keys())[0])
    cluster = result["cluster"][0]
    namespace = result["namespace"]

    aApiClient = apiClient(cluster)
    v1 = client.CoreV1Api(aApiClient)
    d = dict()
    ret = v1.list_namespaced_pod(namespace)
    for n, i in enumerate(ret.items):
        data = []
        data.append(i.spec.hostname)
        data.append(i.spec.node_name)
        data.append(i.metadata.name)
        data.append(i.spec.service_account)
        data.append(i.status.host_ip)
        data.append(i.status.pod_ip)
        if i.status.phase in ('Pending','Running') and i.metadata.deletion_timestamp!=None:
            data.append('Terminating')
        else:
            data.append(i.status.phase)
        data.append(i.status.start_time)

        d[str(n)] = data
    ret = jsonify(d)
    return ret


def getPodNamespaceList(clustername=None):
    aApiClient = apiClient(clustername)
    v1 = client.CoreV1Api(aApiClient)
    d = dict()
    for n,i in enumerate(v1.list_namespace().items):
        data=[]
        data.append(i.metadata.name)

        d[str(n)]=data
    ret = jsonify(d)
    return ret


def getListCluster(clustername=None):
    mycon = get_db_connection()

    cursor = mycon.cursor()
    c = cursor.execute('select * from listcluster')

    d = dict()
    for i in cursor:
        data = [i[1],i[2],i[3],"False" if i[4]==None else "True"]
        d[i[0]] = data
    ret = jsonify(d)
    mycon.commit()

    return ret


def setMonitor(result):
    try:
        result=result.to_dict(flat=False)
        result=json.loads(list(result.keys())[0])
        name=str(result["ClusterName"])
        host=str(result["Host"])
        port=int(result["Port"])
        token=str(result["Token"])

        mycon = get_db_connection()

        cursor=mycon.cursor()
        cursor.execute(f'insert into listcluster(cluster_name,cluster_ip,port,token) '
                         f'values(\"{name}\",\"{host}\",\"{port}\",\"{token}\")')
        mycon.commit()
    except Exception as e:
        print(e)
        return str('fail')
    return str('success')


def abstractMonitor(clusterName: object) -> object:
    try:
        mycon = get_db_connection()

        cursor=mycon.cursor()
        c=cursor.execute(f'delete from listcluster where cluster_name=\"{clusterName}\"');
        mycon.commit()
    except:
        return str('fail')
    return str('success')


def createDict(result):
    result=result.to_dict(flat=False)
    result=json.loads(list(result.keys())[0])
    # aApiClient = apiClient('cluster_test1')
    # config.list_kube_config_contexts()

    # example_dict = \
    #     {'apiVersion': 'v1',
    #      'kind': 'Pod',
    #      'metadata': {
    #          'name': 'python-test'
    #      },
    #      'spec':{
    #          'containers':[{
    #              'name': 'nginx-container-python',
    #              'image': 'nginx:1.16'
    #          }]
    #      }
    #      }
    # response=utils.create_from_dict(aApiClient, example_dict)

def deletePod(podName):
    aApiClient = apiClient('cluster_test1')
    v1=client.CoreV1Api(aApiClient)
    response=v1.delete_namespaced_pod(podName,'default')
    return str(response)


def createServer(result):
    try:
        result = result.to_dict(flat=False)
        result = json.loads(list(result.keys())[0])
        clusterName=result['clusterName'][0]
        serverName=result['serverName'][0]

        if clusterName==[None] or serverName==[None]:
            return str("None")

        mycon = get_db_connection()

        cursor = mycon.cursor()
        c=cursor.execute(f'insert into runningserver(cluster_name,server_name) values(\"{clusterName}\",\"{serverName}\")')
        mycon.commit()

        aApiClient = apiClient(clusterName)
        serverDir=os.path.join('../yamldir',serverName)
        # f=open(serverDir)
        # yml=yaml.safe_load_all()

        response=utils.create_from_directory(aApiClient,serverDir,verbose=True)
    except Exception as e:
        print(e)
        return str('fail')

    return str('success')


def deleteDeployment(result):
    result = result.to_dict(flat=False)
    result = json.loads(list(result.keys())[0])
    clusterName= result['clusterName1'][0]
    depName = result['nameNamespace'][0]
    serverName,serverNamespace=depName.split(',');

    aApiClient=apiClient(clusterName)
    v1=client.AppsV1Api(aApiClient)
    response=v1.delete_namespaced_deployment(name=serverName,namespace=serverNamespace)

    return str('success')


def getListDeploymentAllNamespaecs(clusterName):
    aApiClient=apiClient(clusterName)
    v1=client.AppsV1Api(aApiClient)
    response=v1.list_deployment_for_all_namespaces()
    d=dict()
    for n,i in enumerate(response.items):
        data=[]
        if(i.metadata.namespace=='kube-system'):
            continue
        data.append(i.metadata.name)
        data.append(i.metadata.namespace)

        d[str(n)]=data

    ret= jsonify(d)
    return ret


def loginCheck(result):
    result=result.to_dict(flat=False)
    result= json.loads(list(result.keys())[0])
    id=result['ID']
    pw=result['Password']

    mycon = get_db_connection()

    cursor = mycon.cursor()
    cursor.execute(f'select login_id from users where login_id=\"{id}\" and login_pass=\"{pw}\"')
    sqlresult=cursor.fetchall()
    if len(sqlresult) ==1:
        return str('success')
    return str('fail')


def getserverlist():
    print(os.getcwd())
    serverList=os.listdir('./yamldir')
    d=dict()
    d['serverList']=sorted(serverList)
    ret=jsonify(d)

    return ret


def getListCreateDeployment(server):
    deploymentList=os.listdir('./yamldir/'+server)
    d=dict()
    d['deployList']=deploymentList
    ret=jsonify(d)

    return ret


def getPodLogForAdmin(loginID, projectName, taskName):
    user = user_impl.getUser(loginID)
    if user is None:
        return jsonify(status='failed'), 404
    return getPodLog(projectName, taskName, user)


def getPodLog(projectName, taskName, user):

    mycon = get_db_connection()
    cursor = mycon.cursor(dictionary=True)
    cursor.execute(f'select yaml from TB_NODE INNER JOIN TB_PROJECT ON TB_PROJECT.project_uuid = TB_NODE.project_uuid where user_uuid = "{user.userUUID}" and node_name = "{taskName}" and project_name = "{projectName}";')
    rows = cursor.fetchall()

    if rows is not None:
        if len(rows) != 0:
            data = flask_api.center_client.getPodLogs('mec(ilsan)', projectName, taskName)
            try:
                if data is not None:
                    if data['data'] is not None:
                        if data['data']['result'] is not None:
                            import datetime
                            time = datetime.datetime(1990, 1,1)
                            lastest = None
                            for item in data['data']['result']:
                                if len(item['values']) > 0:
                                    resultJson = json.loads(item['values'][0][1])
                                    temp = resultJson['time'][:-4]

                                    datetime_obj = datetime.datetime.strptime(
                                        temp, '%Y-%m-%dT%H:%M:%S.%f')
                                    if time < datetime_obj:
                                        lastest = item['values']
                                        time = datetime_obj
                            if lastest is None:
                                return jsonify(data=[]), 200
                            else:
                                returnItem = []
                                lastest.reverse()
                                for item in lastest:
                                    temp = json.loads(item[1])
                                    returnItem.append(temp)
                                return jsonify(data=returnItem), 200
            except json.decoder.JSONDecodeError as e:
                return jsonify(status='failed'), 404
            except RuntimeError as e:
                return jsonify(status='failed'), 400
            try:
                resultJson = json.loads(stringToJsonAvailableStr(rows[0]['yaml']))
                return jsonify(yaml=resultJson), 200
            except json.decoder.JSONDecodeError as e:
                return jsonify(status='failed'), 404

        else:
            return jsonify(status='failed'), 404
    else:
        return jsonify(status='failed'), 400



def getServerListDB(cluster):
    mycon = get_db_connection()

    cursor = mycon.cursor()
    c = cursor.execute(f'select server_name from runningserver where cluster_name=\'{cluster}\'')
    d = dict()
    for n,i in enumerate(cursor):
        d[str(n)]=i[0]
    ret=jsonify(d)

    return ret


def getStatusDeploy(result):
    result = result.to_dict(flat=False)
    result = json.loads(list(result.keys())[0])
    cluster = result['cluster'][0]
    namespace = result['namespace']

    aApiClient = apiClient(cluster)
    v1 = client.AppsV1Api(aApiClient)
    response = v1.list_namespaced_deployment(namespace)
    d = dict()
    for n, i in enumerate(response.items):
        data = []
        data.append(i.metadata.name)
        if(i.status.collision_count == ''):
            data.append('0')
        else:
            data.append(i.status.collision_count)
        data.append(i.status.available_replicas)
        data.append(i.status.ready_replicas)
        data.append(i.status.replicas)

        d[str(n)] = data

    ret = jsonify(d)

    return ret

def parseJsonToYaml(data):
    kind = data['kind']
    str = ''
    if kind == 'Deployment':
        str = yaml.dump(data,default_flow_style=False)

    return str

def getTest():

    aApiClient = apiClient('cluster_test1')
    v1=client.CoreV1Api(aApiClient)
    response=v1.list_namespace()
    d = dict()
    for n, i in enumerate(v1.list_namespace().items):
        data = []
        data.append(i.metadata.name)

        d[str(n)] = data
    ret = jsonify(d)

    example_dict = \
        {'apiVersion': 'v1',
         'kind': 'Pod',
         'metadata': {
             'name': 'aiflow-test'
         },
         'spec':{
             'restartPolicy': 'Never',
             'containers':[{
                 'name': 'aiflow-test1',
                 'image': 'aiflow/test1:v1.0.0.230324',
             }]
         }
         }
    res=utils.create_from_dict(aApiClient, example_dict, verbose=True)
    # print(res['status'])
    return ret

def getPodStatus(result):
    result = result.to_dict(flat=False)
    result = json.loads(list(result.keys())[0])
    cluster=result['cluster']
    namespace=result['namespace']
    pod=result['pod']

    aApiClient = apiClient(cluster)
    v1 = client.CoreV1Api(aApiClient)
    response=v1.read_namespaced_pod_status(name=pod, namespace=namespace)
    return str(response.status.phase)
def getDag(user, projectName, needYaml = False):
    conn = flask_api.database.get_db_connection();
    cursor = conn.cursor()
    c = cursor.execute(f'select node_name, node_type, precondition_list, data, yaml, TB_NODE.project_uuid from TB_PROJECT INNER JOIN TB_NODE ON TB_PROJECT.project_uuid = TB_NODE.project_uuid where project_name = "{projectName}" and user_uuid = "{user.userUUID}"')
    rows = cursor.fetchall()

    d = dict()
    d['id'] = projectName
    d['edges'] = []
    d['nodes'] = []
    s: tuple

    projectID = ""
    if len(rows) == 0:
        return d
    else:
        projectID = rows[0][5]
    projectID = projectName
    data = flask_api.center_client.getPods(user.workspaceName, 'mec(ilsan)', projectID)

    for row in rows:
        nodeID = row[0]
        nodeType = row[1]
        preConds = row[2]
        preCondsList = ast.literal_eval(preConds)
        rowData = ast.literal_eval(row[3])
        yaml = ast.literal_eval(row[4])

        for preCond in preCondsList:
            d['edges'].append({'id': nodeID + "_" + preCond,
                               'source': preCond,
                               'target': nodeID})
        nodeTypeStr = "Pod"
        if nodeType == 0:
            nodeTypeStr = "Pod"

        node = {
            'id': nodeID,
            # 'type': 'textUpdater',
            'type' : nodeTypeStr,
            'data': rowData
        }
        if needYaml:
            node['data']['yaml'] = yaml

        node['data']['status'] = 'Waiting'

        if data['data'] is not None:
            for task in data['data']:
                if task['name'] == nodeID:
                    node['data']['status'] = task['status']
        d['nodes'].append(node)

    return d


def getPodDetail(podID):
    from flask_api import center_client
    return center_client.getPodDetail(podID, "softonet", "mec(ilsan)","softonnet-test")

def getProjectList(userUUID):
    mycon = get_db_connection()

    cursor=mycon.cursor(dictionary=True)
    cursor.execute(f'select project_name from TB_PROJECT where user_uuid="{userUUID}"')
    rows= cursor.fetchall()

    if rows is not None:
        projectList = list()
        for row in rows:
            data = dict()
            data['project_name'] = row['project_name']
            projectList.append(data)
        return jsonify(project_list=projectList), 200
    else:
        common.logger.get_logger().debug('[monitor_impl.getProjectList] failed to get from db')
        return jsonify(msg='Internal Server Error'), 500

def launchProject(user, projectName):
    mycon = get_db_connection()
    cursor = mycon.cursor(dictionary=True)
    cursor.execute(f'select project_uuid from TB_PROJECT where user_uuid = "{user.userUUID}" and project_name = "{projectName}"')
    rows = cursor.fetchall()
    if rows is None:
        return jsonify(status = 'failed'), 400
    if len(rows) == 0:
        return jsonify(status = 'failed'), 404

    projectID = rows[0]['project_uuid']
    dag = getDag(user, projectName, True)
    # return launchTest()
    # dag['id'] = getCenterProjectID(projectID, projectName)
    dag['id'] = projectName
    res = monitoringManager.addWorkFlow(monitoringManager.parseFromDAGToWorkFlow(user.workspaceName, dag))
    if res is True:
        return jsonify(status="success"), 200
    else:
        return jsonify(status="failed"), 400
# return None
def initProject(userUUID, workspaceName, projectName):
    mycon = get_db_connection()
    cursor = mycon.cursor(dictionary=True)
    cursor.execute(f'select project_uuid from TB_PROJECT where user_uuid = "{userUUID}" and project_name = "{projectName}"')
    rows = cursor.fetchall()
    if rows is None:
        return jsonify(status = 'failed'), 400
    if len(rows) == 0:
        return jsonify(status = 'failed'), 404

    projectID = rows[0]['project_uuid']

    cursor.execute(f'select node_name from TB_NODE where project_uuid="{projectID}"')
    rows = cursor.fetchall()
    # projectID = getCenterProjectID(projectID, projectName)
    projectID = projectName
    monitoringManager.deleteWorkFlow(projectID)
    for item in rows:
        flask_api.center_client.podsNameDelete(item['node_name'], workspaceName, 'mec(ilsan)', projectID)
    return jsonify(status = 'success'), 201


def getClusterList(userUUID):
    mycon = get_db_connection()

    cursor = mycon.cursor(dictionary=True)
    cursor.execute(f'select workspace_name from TB_USER where user_uuid="{userUUID}"')
    rows = cursor.fetchall()

    if rows is not None:
        workspaceName = None
        for row in rows:
            workspaceName = row['workspace_name']
            break

        if workspaceName is not None:
            data = flask_api.center_client.workspacesNameGet(workspaceName)
            clusterList = []
            if data.get('selectCluster') is not None:
                for cluster in data['selectCluster']:
                    clusterList.append({
                        'name' : cluster['clusterName'],
                        'type' : cluster['clusterType']
                    })

                return jsonify(cluster_list=clusterList)
            else:
                return jsonify(msg='Cluster not Found'), 400


        return jsonify(msg='Cluster not Found'), 400
    else:
        common.logger.get_logger().debug('[monitor_impl.getClusterList] failed to get from db')
        return jsonify(msg='Internal Server Error'), 500

def getCenterProjectID(projectID, projectName):
    return projectName + "-" + projectID


def createProject(userUUID, userLoginID, projectName, projectDesc, clusterName):
    mycon = get_db_connection()
    cursor = mycon.cursor(dictionary=True)

    import uuid
    projectID = uuid.uuid4().__str__()
    # centerProjectID = getCenterProjectID(projectID, projectName)
    centerProjectID = projectName

    cursor.execute(f'select workspace_name from TB_USER where user_uuid="{userUUID}"')
    rows = cursor.fetchall()
    workspaceName = None
    if rows is not None:
        for row in rows:
            workspaceName = row.get("workspace_name")
            break

    if workspaceName is None:
        return jsonify(status='failed', msg='can not find userUUID'), 404

    if workspaceName is not None:
        status = flask_api.center_client.projectsPost(workspaceName, config.api_id, centerProjectID, projectDesc,
                                                      clusterName=clusterName)
        if status['status'] != 'failed' and status['status'] != 'Failure' and status['status'] != 'Failed' and status['data'] is not None:
            realProjectName = status["data"]
            #make folder
            flask_api.filesystem_impl.makeFolderToNFS('user/' + userLoginID + '/' + realProjectName)

            for cluster in clusterName:
                # pv 부터 pvc는 프로젝트 생성후
                status = flask_api.center_client.pvCreate(flask_api.runtime_helper.getProjectYaml(userLoginID, realProjectName)['PV'], workspaceName, cluster, realProjectName)
                if (status['code'] != 201 or ast.literal_eval(status['data'])['status'] == 'Failure'):
                    flask_api.center_client.projectsDelete(realProjectName)
                    flask_api.filesystem_impl.removeFolderFromNFS('user/' + userLoginID + '/' + realProjectName)
                    return jsonify(status='failed', msg='pv make failed'), 400

                status = flask_api.center_client.pvcCreate(flask_api.runtime_helper.getProjectYaml(userLoginID, realProjectName)['PVC'], workspaceName, cluster, realProjectName)
                if (status['code'] != 201 or ast.literal_eval(status['data'])['status'] == 'Failure'):
                    flask_api.center_client.projectsDelete(realProjectName)
                    flask_api.filesystem_impl.removeFolderFromNFS('user/' + userLoginID + '/' + realProjectName)
                    # TODO: PV 제거
                    return jsonify(status='failed', msg='pvc make failed'), 400

            cursor.execute(
                f'insert into TB_PROJECT (project_uuid, project_name, user_uuid, pv_name) value ("{projectID}", "{realProjectName}", "{userUUID}", "testPV");')
            mycon.commit()
            return jsonify(status='success'), 200
        else:
            return jsonify(status='failed'), 400


    return jsonify(status='failed'), 400


def deletePV(userUUID, userLoginID, workspaceName, projectName):
    mycon = get_db_connection()
    cursor = mycon.cursor(dictionary=True)
    cursor.execute(
        f'select project_uuid from TB_PROJECT where user_uuid = "{userUUID}" and project_name = "{projectName}"')
    rows = cursor.fetchall()
    if rows is None:
        return {'status' : 'failed'}
    if len(rows) == 0:
        return {'status' : 'failed'}

    pvName = flask_api.runtime_helper.getBasicPVName(userLoginID, projectName)
    projectUUID = rows[0]['project_uuid']

    response = flask_api.center_client.userProjectsNameGet(projectName)
    if response.get('data') is None:
        return {'status' : 'failed'}
    if response.get('data').get('selectCluster') is None:
        return {'status' : 'failed'}

    for cluster in response['data']['selectCluster']:
        status = flask_api.center_client.pvDelete(pvName, workspaceName, cluster.get('clusterName'), projectName)
        if status.get('status') == 'failed':
            return {'status' : 'failed', 'msg' : 'cluster is wrong'}
            return jsonify(status='failed', msg='cluster is wrong'), 200

    return {'status' : 'success'}


def deleteProject(userUUID, userLoginID, workspaceName, projectName):
    mycon = get_db_connection()
    cursor = mycon.cursor(dictionary=True)
    cursor.execute(f'select project_uuid from TB_PROJECT where user_uuid = "{userUUID}" and project_name = "{projectName}"')
    rows = cursor.fetchall()
    if rows is None:
        return jsonify(status = 'failed'), 400
    if len(rows) == 0:
        return jsonify(status = 'failed'), 404

    #delete folder
    flask_api.filesystem_impl.removeFolderFromNFS('user/' + userLoginID + '/' + projectName)

    #pv 지우기
    status = deletePV(userUUID, userLoginID, workspaceName, projectName)
    if status['status'] == 'failed':
        return jsonify(status = 'failed', msg = 'cant delete pv'), 400

    projectUUID = rows[0]['project_uuid']
    status = flask_api.center_client.projectsDelete(projectName)

    if status['status'] != 'failed':
        cursor.execute(
            f'delete from TB_PROJECT where project_uuid = "{projectUUID}";')
        mycon.commit()
        return jsonify(status='success'), 200
    return jsonify(status='failed'), 400


def getProject(user, projectName):
    userUUID = user.userUUID
    mycon = get_db_connection()
    cursor = mycon.cursor(dictionary=True)
    cursor.execute(f'select project_uuid from TB_PROJECT where project_name="{projectName}" and user_uuid="{userUUID}"')
    rows = cursor.fetchall()

    if rows is not None:
        if len(rows) == 0:
            projectName = projectName + "-" + user_impl.getUUIDBySplit(user.userLoginID, user.workspaceName)
            cursor.execute(f'select project_uuid from TB_PROJECT where project_name="{projectName}" and user_uuid="{userUUID}"')
            rows = cursor.fetchall()

    if rows is not None:
        if len(rows) != 0:
            pid = projectName
            response = flask_api.center_client.userProjectsNameGet(pid)

            if response.get('data') is not None:
                returnResponse = {}
                returnResponse['projectName'] = projectName
                returnResponse['projectDescription'] = response['data']['projectDescription']
                returnResponse['created_at'] = response['data']['created_at']
                returnResponse['clusterList'] = []
                returnResponse['status'] = "Waiting"
                if monitoringManager.getIsRunning(pid) is True:
                    returnResponse['status'] = 'Running'
                for cluster in response['data']['selectCluster']:
                    returnResponse['clusterList'].append(cluster['clusterName'])

                #detailInfo
                returnResponse['DetailInfo'] = []
                if type(response['data'].get('DetailInfo')) is list:
                    for detailInfo in response['data'].get('DetailInfo'):
                        returnResponse['DetailInfo'].append( {
                            "clusterName" : detailInfo.get('clusterName'),
                            "resourceUsage" : detailInfo.get('resourceUsage')
                        })

                #node db
                returnResponse['nodes'] = {}
                c = flask_api.global_def.config
                for node_type in c.node_type:
                    returnResponse['nodes'][node_type] = 0
                returnResponse['nodes']['total'] = 0

                cursor.execute(
                    f'select node_type, count(node_uuid) as cnt from TB_NODE where project_uuid = "{rows[0]["project_uuid"]}" group by node_type')
                nodeRows = cursor.fetchall()
                if nodeRows is not None:
                    for nodeRow in nodeRows:
                        node_type = nodeRow['node_type']
                        if node_type < len(c.node_type):
                            returnResponse['nodes'][c.node_type[node_type]] = nodeRow['cnt']
                            returnResponse['nodes']['total'] += nodeRow['cnt']


                return returnResponse, 200
            else:
                #TODO: db 동기화 필요
                return jsonify(msg='no data'), 404
        #db에 없음
        else:
            return jsonify(msg='no data'), 404

    return jsonify(msg='error'), 400


def getPodEnv():
    mycon = get_db_connection()
    cursor = mycon.cursor()
    data = {'runtime': [], 'cuda': [], 'tensorrt': []}

    cursor.execute(f'select runtime_name from TB_RUNTIME')
    rows = cursor.fetchall()
    for row in rows:
        data['runtime'].append(row[0])

    cursor.execute(f'select cuda_name from TB_CUDA')
    rows = cursor.fetchall()
    for row in rows:
        data['cuda'].append(row[0])

    cursor.execute(f'select tensorrt_name from TB_TENSORRT')
    rows = cursor.fetchall()
    for row in rows:
        data['tensorrt'].append(row[0])

    return data, 200


def postDag(userUUID, userLoginID, userName, workspaceName):
    data = request.json

    if data.get('projectID') is None:
        return jsonify(status = 'failed', msg="project ID is None"), 400

    mycon = get_db_connection()
    cursor = mycon.cursor(dictionary=True)
    cursor.execute(f'select project_uuid, project_name from TB_PROJECT where user_uuid = "{userUUID}" and project_name = "{data["projectID"]}"')
    rows = cursor.fetchall()
    if rows is None:
        return jsonify(status = 'failed'), 400
    if len(rows) == 0:
        return jsonify(status = 'failed'), 404

    projectUUID = rows[0]['project_uuid']
    projectName = rows[0]['project_name']
    centerProjectID = projectName

    #precondition
    preCondition = {}
    if data['edges'] != None:
        for edge in data['edges']:
            if preCondition.get(edge['target']) == None:
                preCondition[edge['target']] = [edge['source']]
            else:
                preCondition[edge['target']].append(edge['source'])
    #TODO: 유효성체크

    #delete
    cursor.execute(f'select node_uuid, node_name from TB_NODE where project_uuid = "{projectUUID}"')
    rows = cursor.fetchall()
    nodeList = {}
    for row in rows:
        nodeList[row['node_name']] = row['node_uuid']
    #add
    if data['nodes'] != None:
        for node in data['nodes']:
            import uuid
            uid = uuid.uuid4().__str__()
            nodeType = 0
            if node['type'] == 'Pod':
                nodeType = 0

            preCond = preCondition.get(node['id'])
            if(preCond == None):
                preCond = []
            preCond = preCond.__str__()
            task = node['data']['task']

            model = node['data']['model']

            datasetPath = ''
            modelPath = ''
            outputPath = ''
            if model == 'yolov5':
                datasetPath = '~/volume/dataset/coco128'

                if task == 'Validate' or task == 'Optimization':
                    modelPath = '/root/user/yolo_coco128_train/weights/best.pt'
                elif task == 'Opt_Validate':
                    modelPath = '/root/user/yolo_coco128_train/weights/best.engine'

                if task == 'Train':
                    outputPath = 'yolo_coco128_train'
                elif task == 'Validate':
                    outputPath = 'yolo_coco128_validate'
                elif task == 'Opt_Validate':
                    outputPath = 'yolo_coco128_opt_validate'
            elif model == 'retinaface':
                datasetPath = '~/volume/dataset/widerface'

                if task == 'Validate' or task == 'Optimization':
                    modelPath = '/root/user/yolo_coco128_train/weights/best.pt'
                elif task == 'Opt_Validate':
                    modelPath = '/root/user/yolo_coco128_train/weights/best.engine'

                if task == 'Train':
                    outputPath = 'yolo_coco128_train'
                elif task == 'Validate':
                    outputPath = 'yolo_coco128_validate'
                elif task == 'Opt_Validate':
                    outputPath = 'yolo_coco128_opt_validate'

            if node['data'].get('datasetPath'):
                datasetPath = '/root/user/' + node['data'].get('datasetPath')
            if node['data'].get('modelPath'):
                modelPath = '/root/user/' + node['data'].get('modelPath')
            if node['data'].get('outputPath'):
                outputPath = node['data'].get('outputPath')


            yaml = {}
            if task == 'Train':
                yaml = flask_api.runtime_helper.makeYamlTrainRuntime(userLoginID, userName, data["projectID"], centerProjectID, node['id'], node['data']['runtime'], node['data']['model'], node['data']['tensorRT'], node['data']['framework'], datasetPath, outputPath)
            elif task == 'Validate':
                yaml = flask_api.runtime_helper.makeYamlValidateRuntime(userLoginID, userName, data["projectID"], centerProjectID, node['id'], node['data']['runtime'], node['data']['model'], node['data']['tensorRT'], node['data']['framework'], datasetPath, modelPath, outputPath)
            elif(task == 'Optimization'):
                yaml = flask_api.runtime_helper.makeYamlOptimizationRuntime(userLoginID, userName, data["projectID"], centerProjectID, node['id'], node['data']['runtime'], node['data']['model'], node['data']['tensorRT'], node['data']['framework'], modelPath)
            elif(task == 'Opt_Validate'):
                yaml = flask_api.runtime_helper.makeYamlOptValidateRuntime(userLoginID, userName, data["projectID"], centerProjectID, node['id'], node['data']['runtime'], node['data']['model'], node['data']['tensorRT'], node['data']['framework'], datasetPath, modelPath, outputPath)
            elif(task == 'Inference'):
                yaml = flask_api.runtime_helper.makeYamlInferenceRuntime(userLoginID, userName, data["projectID"], centerProjectID, node['id'], node['data']['runtime'], node['data']['model'], node['data']['tensorRT'], node['data']['framework'])

            if yaml is None:
                mycon.rollback()
                return jsonify(status = 'failed', msg="env error"), 400

            yaml = yaml.__str__()
            d = node['data'].__str__()

            if nodeList.get(node["id"]) != None:
                print(f'update TB_NODE set yaml = "{yaml}", precondition_list = "{preCond}", data = "{d}" where node_uuid = "{nodeList.get(node["id"])}"')
                cursor.execute(f'update TB_NODE set yaml = "{yaml}", precondition_list = "{preCond}", data = "{d}" where node_uuid = "{nodeList.get(node["id"])}"')
                del nodeList[node["id"]]
            else:
                cursor.execute(f'insert into TB_NODE (node_uuid, node_name, project_uuid, node_type, yaml, precondition_list, data) ' +
                               f'value ("{uid}", "{node["id"]}", "{projectUUID}", {nodeType}, "{yaml}", "{preCond}",  "{d}")')

    mycon.commit()


    for n in nodeList.items():
        cursor.execute(
            f'delete from TB_NODE where node_uuid = "{n[1]}";');

        #delete from k8s
        flask_api.center_client.podsNameDelete(n[0], workspaceName, 'mec(ilsan)', centerProjectID)

    mycon.commit()

    return jsonify(status="success"), 200


def getPodEnvModel():
    mycon = get_db_connection()
    cursor = mycon.cursor(dictionary=True)
    cursor.execute(f'select model from TB_RUNTIME group by model;')
    rows = cursor.fetchall()
    list = []
    if rows is not None:
        for row in rows:
            list.append(row['model'])

    return jsonify(model=list), 200

def getPodEnvFrameWork(modelName):
    mycon = get_db_connection()
    cursor = mycon.cursor(dictionary=True)
    cursor.execute(f'select framework from TB_RUNTIME where model = "{modelName}" group by framework;')
    rows = cursor.fetchall()
    list = []
    if rows is not None:
        for row in rows:
            list.append(row['framework'])

    return jsonify(framework=list), 200

def getPodEnvRuntime(modelName, framework):
    mycon = get_db_connection()
    cursor = mycon.cursor(dictionary=True)
    cursor.execute(f'select runtime_name, version, python_version, cuda_version, cudnn_version from TB_RUNTIME where model = "{modelName}" and framework = "{framework}";')
    rows = cursor.fetchall()
    list = []
    if rows is not None:
        for row in rows:
            list.append(row)

    return jsonify(runtime=list), 200

def getPodEnvTensor(runtimeName):
    mycon = get_db_connection()
    cursor = mycon.cursor(dictionary=True)
    cursor.execute(f'select tensorrt_name, tensorrt_version from TB_TENSORRT where runtime_name = "{runtimeName}";')
    rows = cursor.fetchall()
    list = []
    if rows is not None:
        for row in rows:
            list.append(row)

    return jsonify(tensorrt=list), 200


def getAllClusters():
    res = flask_api.center_client.clustersGet()
    result = []
    if res.get('data') is not None:
        for item in res.get('data'):
            data = {
                "clusterEndpoint": "",
                "clusterType": "",
                "clusterName": "",
                "nodeCnt": 0,
            }

            if item.get('clusterEndpoint') is not None:
                data['clusterEndpoint'] = item.get('clusterEndpoint')
            if item.get('clusterType') is not None:
                data['clusterType'] = item.get('clusterType')
            if item.get('clusterName') is not None:
                data['clusterName'] = item.get('clusterName')
            if item.get('nodeCnt') is not None:
                data['nodeCnt'] = item.get('nodeCnt')

            result.append(data)
    return jsonify(cluster_list=result), 200


def getProjectAllListForAdmin():
    mycon = get_db_connection()

    cursor=mycon.cursor(dictionary=True)
    cursor.execute(f'select project_name, project_uuid, login_id, user_name from TB_USER inner join TB_PROJECT on TB_USER.user_uuid = TB_PROJECT.user_uuid')
    rows= cursor.fetchall()

    if rows is not None:
        projectList = list()
        for row in rows:
            data = dict()
            data['project_name'] = row['project_name']
            data['login_id'] = row['login_id']
            data['user_name'] = row['user_name']
            data['status'] = 'Waiting'
            if monitoringManager.getIsRunning(row['project_name']) is True:
                data['status'] = 'Launching'
            projectList.append(data)
        return jsonify(project_list=projectList), 200
    else:
        common.logger.get_logger().debug('[monitor_impl.getProjectList] failed to get from db')
        return jsonify(msg='Internal Server Error'), 500


def getProjectForAdmin(loginID, projectName):
    mycon = get_db_connection()
    cursor = mycon.cursor(dictionary=True)

    user = user_impl.getUser(loginID)
    if user is not None:
            return getProject(user, projectName)

    return jsonify(msg='no data'), 200


def initProjectForAdmin(loginID, projectName):
    mycon = get_db_connection()
    cursor = mycon.cursor(dictionary=True)
    cursor.execute(f'select user_uuid, workspace_name from TB_USER where login_id="{loginID}"')
    rows = cursor.fetchall()
    if rows is not None:
        if len(rows) != 0:
            return initProject(rows[0]['user_uuid'], rows[0]['workspace_name'], projectName)

    return jsonify(status='failed'), 400

def stopProject(user, projectName):
    mycon = get_db_connection()
    cursor = mycon.cursor(dictionary=True)
    cursor.execute(
        f'select project_uuid from TB_PROJECT where user_uuid = "{user.userUUID}" and project_name = "{projectName}"')
    rows = cursor.fetchall()
    if rows is None:
        return jsonify(status='failed', msg='database error'), 400
    if len(rows) == 0:
        return jsonify(status='failed', msg='Project is not found'), 404

    projectID = rows[0]['project_uuid']
    # projectID = getCenterProjectID(projectID, projectName)
    projectID = projectName
    monitoringManager.deleteWorkFlow(projectID)
    return jsonify(status='success'), 201

def stopProjectForAdmin(loginID, projectName):
    user = user_impl.getUser(loginID)

    if user is None:
        return jsonify(status='failed', msg = f'not found {loginID}'), 404
    else:
        return stopProject(user, projectName)

def getPodYaml(projectName, taskName, userUUID):
    mycon = get_db_connection()
    cursor = mycon.cursor(dictionary=True)
    cursor.execute(f'select yaml from TB_NODE INNER JOIN TB_PROJECT ON TB_PROJECT.project_uuid = TB_NODE.project_uuid where user_uuid = "{userUUID}" and node_name = "{taskName}" and project_name = "{projectName}";')
    rows = cursor.fetchall()


    if rows is not None:
        if len(rows) != 0:
            try:
                resultJson = json.loads(stringToJsonAvailableStr(rows[0]['yaml']))
                return jsonify(yaml=resultJson), 200
            except json.decoder.JSONDecodeError as e:
                return jsonify(status='failed'), 404

        else:
            return jsonify(status='failed'), 404
    else:
        jsonify(status='failed'), 400

def stringToJsonAvailableStr(str : str):
    return str.replace("\'", "\"").replace("True", "true")

def getDagForAdmin(loginID, projectName, needYaml):
    user = user_impl.getUser(loginID)
    if user is None:
        return jsonify(status='failed', msg = f'not found {loginID}'), 404
    else:
        return getDag(user, projectName, needYaml)