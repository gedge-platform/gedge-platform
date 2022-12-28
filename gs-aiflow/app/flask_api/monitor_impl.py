import yaml
import mysql.connector
import requests
import json
import os
from flask import jsonify, request, make_response
from flask_restful import reqparse, inputs

import kubernetes.client
from kubernetes import client, config, utils
from requests.packages.urllib3.exceptions import InsecureRequestWarning

from flask_api.global_def import g_var
from flask_api.database import get_db_connection

requests.packages.urllib3.disable_warnings(InsecureRequestWarning)


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


def abstractMonitor(clusterName):
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


def getPodLog(result):
    result = result.to_dict(flat=False)
    result = json.loads(list(result.keys())[0])
    cluster=result['cluster']
    namespace=result['namespace']
    pod=result['pod']

    aApiClient = apiClient(cluster)
    v1 = client.CoreV1Api(aApiClient)
    response=v1.read_namespaced_pod_log(name=pod,namespace=namespace)
    return str(response)


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
