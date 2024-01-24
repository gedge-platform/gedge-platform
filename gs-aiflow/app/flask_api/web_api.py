import os
import traceback
import time
import ssl
from multiprocessing import pool

import flask_restful
import flask
from flask import request, redirect, session
from flask_sockets import Sockets
from flask_cors import CORS

import flask_api.global_def
# from flask_restful import reqparse


from flask_api import monitor_impl, auth_impl, user_impl

app = flask.Flask(import_name='client_web',
				  static_folder=os.path.join('../web_root','static'),
				  static_url_path='',
				  root_path='')
app.config['JSON_AS_ASCII'] = False

CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

sockets = Sockets(app)

api = flask_restful.Api(app)


@app.route('/')
def index():
    return "HELLO, AIEYEFLOW"

@app.route('/api/makeData', methods=['POST'])
def makeData():
    if request.method == 'POST':
        result = request.json
        return monitor_impl.parseJsonToYaml(result)
    return "erwer"


@app.route('/api/getListNodeAll/<string:clustername>')
def getListNodeAll(clustername=None):
    return monitor_impl.getListNodeAll(clustername)


@app.route('/api/getListNamespacePod', methods=['POST'])
def getListNamespacePod():
    if request.method == 'POST':
        result = request.form
        return monitor_impl.getListNamespacePod(result)


@app.route('/api/getPodNamespaceList/<string:clustername>')
def getPodNamespaceList(clustername=None):
    return monitor_impl.getPodNamespaceList(clustername)


@app.route('/api/getListCluster')
def getListCluster(clustername=None):
    return monitor_impl.getListCluster(clustername)


@app.route('/api/getPV/<string:clustername>')
def getPV(clustername=None):
    return monitor_impl.getPV(clustername)


@app.route('/api/getStorageclass/<string:clustername>')
def getStorageclass(clustername=None):
    return monitor_impl.getStorageclass(clustername)


@app.route('/api/setMonitor', methods=['POST'])
def setMonitor():
    if request.method == 'POST':
        result = request.form
        return monitor_impl.setMonitor(result)
    else:
        return 'ERROR'


@app.route('/api/abstractMonitor/<string:clustername>')
def abstractMonitor(clustername):
    return monitor_impl.abstractMonitor(clustername)


@app.route('/api/createDict', methods=['POST'])
def createDict():
    if request.method == 'POST':
        result = request.form
    return monitor_impl.createDict(result)


@app.route('/api/deletePod/<string:podName>')
def deletePod(podName):
    return monitor_impl.deletePod(podName)


@app.route('/api/loginCheck', methods=['POST'])
def loginCheck():
    if request.method == 'POST':
        result = request.form
        return monitor_impl.loginCheck(result)


@app.route('/api/getServerList')
def getServerList():
    return monitor_impl.getserverlist()


@app.route('/api/getListCreateDeployment/<string:server>')
def getListCreateDeployment(server):
    return monitor_impl.getListCreateDeployment(server)


@app.route('/api/createServer', methods=['POST'])
def createServer():
    if request.method == 'POST':
        result = request.form
        return monitor_impl.createServer(result)


@app.route('/api/deleteDeployment', methods=['POST'])
def deleteDeployment():
    if request.method == 'POST':
        result = request.form
        return monitor_impl.deleteDeployment(result)


@app.route('/api/getListDeploymentAllNamespaces/<string:cluster>')
def getListDeploymentAllNamespaces(cluster):
    return monitor_impl.getListDeploymentAllNamespaecs(cluster)


@app.route('/api/getPodLog', methods=['POST'])
def getPodLog():
    if request.method == 'POST':
        result = request.form
        return monitor_impl.getPodLog(result)


@app.route('/api/getServerListDB/<string:cluster>', methods=['GET'])
def getServerListDB(cluster):
    return monitor_impl.getServerListDB(cluster)


@app.route('/api/getStatusDeploy', methods=['POST'])
def getStatusDeploy():
    if request.method == 'POST':
        result = request.form
        return monitor_impl.getStatusDeploy(result)


@app.route('/api/testAPI')
def test():
    return monitor_impl.testAPI()


@app.route('/api/dummy', methods=['POST', 'GET'])
def dummy():
    if request.method == 'POST':
        res = request.json
        result = request.form
        return monitor_impl.dummy()
    return monitor_impl.dummy()


@app.route('/api/project/dag/<string:dagId>', methods=['GET', 'POST'])
@auth_impl.needLogin()
def apiDag(dagId):
    user = user_impl.getUserInSession()
    if user is None:
        return flask.jsonify(status='failed', msg = 'auth failed'), 401

    if request.method == 'GET':
        return monitor_impl.getDag(user, dagId)
    if request.method == 'POST':
        return monitor_impl.postDag(user.userUUID, user.userLoginID, user.userName, user.workspaceName)

    return flask.jsonify(msg = 'Bad Request'), 400


@app.route('/api/project/<string:projectName>/<string:taskName>/yaml', methods=['GET'])
@auth_impl.needLogin()
def getTaskYaml(projectName, taskName):
    user = user_impl.getUserInSession()
    if user is None:
        return flask.jsonify(status='failed', msg = 'auth failed'), 401
    return monitor_impl.getPodYaml(projectName, taskName, user.userUUID)

@app.route('/api/project/<string:projectName>/<string:taskName>/log', methods=['GET'])
@auth_impl.needLogin()
def getTaskLog(projectName, taskName):
    user = user_impl.getUserInSession()
    if user is None:
        return flask.jsonify(status='failed', msg = 'auth failed'), 401
    return monitor_impl.getPodLog(projectName, taskName, user)

@app.route('/api/admin/project/<string:login_id>/<string:projectName>/<string:taskName>/log', methods=['GET'])
@auth_impl.needLogin()
def getTaskLogForAdmin(login_id, projectName, taskName):
    user = user_impl.getUserInSession()
    if user is None:
        return flask.jsonify(status='failed', msg = 'auth failed'), 401
    return monitor_impl.getPodLogForAdmin(login_id, projectName, taskName)

@app.route('/api/pod/<string:podID>/status', methods=['POST'])
@auth_impl.needLogin()
def getPodStatus(podID):
    if request.method == 'POST':
        result = request.form
        return monitor_impl.getPodStatus(result)
@app.route('/api/pod/<string:podID>/detail', methods=['GET'])
@auth_impl.needLogin()
def getPodDetail(podID):
    if request.method == 'GET':
        return monitor_impl.getPodDetail(podID)

@app.route('/api/project/launch', methods=['POST'])
@auth_impl.needLogin()
def launchProject():
    if request.method == 'POST':
        jsonData = request.json
        user = user_impl.getUserInSession()
        if user is None:
            return flask.jsonify(status='failed', msg='auth failed'), 401
        return monitor_impl.launchProject(user, jsonData['projectID'])

@app.route('/api/project', methods=['GET', 'POST'])
@auth_impl.needLogin()
def apiNormalUserProject():
    user = user_impl.getUserInSession()
    if user is None:
        return flask.jsonify(status='failed', msg='auth failed'), 401

    if request.method == 'GET':
        return monitor_impl.getProjectList(user.userUUID)
    if request.method == 'POST':
        jsonData = request.json
        return monitor_impl.createProject(user.userUUID, user.userLoginID, jsonData['projectName'], jsonData['projectDesc'], jsonData['clusterName'])


@app.route('/api/project/<string:projectName>', methods=['GET', 'DELETE'])
@auth_impl.needLogin()
def apiNormalUserProjectName(projectName):
    user = user_impl.getUserInSession()
    if user is None:
        return flask.jsonify(status='failed', msg='auth failed'), 401

    if request.method == 'DELETE':
        return monitor_impl.deleteProject(user.userUUID, user.userLoginID, user.workspaceName, projectName)
    if request.method == 'GET':
        return monitor_impl.getProject(user, projectName)

@app.route('/api/admin/project', methods=['GET'])
@auth_impl.needLogin()
@auth_impl.forAdmin()
def ProjectListForAdmin():
    if request.method == 'GET':
        user = user_impl.getUserInSession()
        if user is None:
            return flask.jsonify(status='failed', msg='auth failed'), 401
        return monitor_impl.getProjectAllListForAdmin()

@app.route('/api/admin/project/<string:login_id>/<string:projectName>', methods=['GET'])
@auth_impl.needLogin()
@auth_impl.forAdmin()
def getProjectForAdmin(login_id, projectName):
    if request.method == 'GET':
        user = user_impl.getUserInSession()
        if user is None:
            return flask.jsonify(status='failed', msg='auth failed'), 401

        return monitor_impl.getProjectForAdmin(login_id, projectName)

@app.route('/api/admin/project/<string:login_id>/<string:projectName>/dag', methods=['GET'])
@auth_impl.needLogin()
@auth_impl.forAdmin()
def getProjectDagForAdmin(login_id, projectName):
    if request.method == 'GET':
        user = user_impl.getUserInSession()
        if user is None:
            return flask.jsonify(status='failed', msg='auth failed'), 401
        return monitor_impl.getDagForAdmin(login_id, projectName, False)

@app.route('/api/project/init', methods=['POST'])
@auth_impl.needLogin()
def initProject():
    if request.method == 'POST':
        jsonData = request.json
        user = user_impl.getUserInSession()
        if user is None:
            return flask.jsonify(status='failed', msg='auth failed'), 401
        return monitor_impl.initProject(user.userUUID, user.workspaceName, jsonData['projectID'])

@app.route('/api/admin/project/init/<string:login_id>/<string:projectName>', methods=['POST'])
@auth_impl.needLogin()
@auth_impl.forAdmin()
def initProjectForAdmin(login_id, projectName):
    if request.method == 'POST':
        user = user_impl.getUserInSession()
        if user is None:
            return flask.jsonify(status='failed', msg='auth failed'), 401

        return monitor_impl.initProjectForAdmin(login_id, projectName)


@app.route('/api/admin/project/stop/<string:login_id>/<string:projectName>', methods=['POST'])
@auth_impl.needLogin()
@auth_impl.forAdmin()
def stopProjectForAdmin(login_id, projectName):
    if request.method == 'POST':
        user = user_impl.getUserInSession()
        if user is None:
            return flask.jsonify(status='failed', msg='auth failed'), 401

        return monitor_impl.stopProjectForAdmin(login_id, projectName)
@app.route('/api/clusters', methods=['GET'])
@auth_impl.needLogin()
def getClusterList():
    if request.method == 'GET':
        user = user_impl.getUserInSession()
        if user is None:
            return flask.jsonify(status='failed', msg='auth failed'), 401
        return monitor_impl.getClusterList(user.userUUID)

@app.route('/api/admin/clusters', methods=['GET'])
@auth_impl.needLogin()
@auth_impl.forAdmin()
def getAllClusters():
    if request.method == 'GET':
        return monitor_impl.getAllClusters()

@app.route('/api/pod/env', methods=['GET'])
@auth_impl.needLogin()
def getPodEnv():
    if request.method == 'GET':
        return monitor_impl.getPodEnv()


@app.route('/api/pod/env/model', methods=['GET'])
@auth_impl.needLogin()
def getPodEnvModel():
    if request.method == 'GET':
        return monitor_impl.getPodEnvModel()

@app.route('/api/pod/env/framework/<string:modelName>', methods=['GET'])
@auth_impl.needLogin()
def getPodEnvFramework(modelName):
    if request.method == 'GET':
        return monitor_impl.getPodEnvFrameWork(modelName)

@app.route('/api/pod/env/runtime/<string:modelName>/<string:framework>', methods=['GET'])
@auth_impl.needLogin()
def getPodEnvRuntime(modelName, framework):
    if request.method == 'GET':
        return monitor_impl.getPodEnvRuntime(modelName, framework)

@app.route('/api/pod/env/tensorrt/<string:runtimeName>', methods=['GET'])
@auth_impl.needLogin()
def getPodEnvTensor(runtimeName):
    if request.method == 'GET':
        return monitor_impl.getPodEnvTensor(runtimeName)


@app.route('/api/storage', methods=['GET'])
@auth_impl.needLogin()
def getStorageSite():
    if request.method == 'GET':
        user = user_impl.getUserInSession()
        if user is None:
            return flask.jsonify(status='failed', msg='auth failed'), 401
        return user_impl.getUserStorageURL(user)


@app.route('/api/storage/<string:projectName>', methods=['GET'])
@auth_impl.needLogin()
def getProjectStorage(projectName):
    if request.method == 'GET':
        user = user_impl.getUserInSession()
        if user is None:
            return flask.jsonify(status='failed', msg='auth failed'), 401
        return user_impl.getUserStorageURL(user, projectName)

@app.route('/api/login', methods=['POST'])
def login():
    if request.method == 'POST':
        return auth_impl.login()

@app.route('/api/login', methods=['GET'])
@auth_impl.needLogin()
@auth_impl.maintainLogin()
def isLoginCheck():
    if request.method == 'GET':
        return auth_impl.isLogin()
@app.route('/api/logout', methods=['POST'])
@auth_impl.needLogin()
def logout():
    if request.method == 'POST':
        return auth_impl.logout()


@app.route('/api/users', methods=['GET','POST'])
@auth_impl.needLogin()
@auth_impl.forAdmin()
def apiUsers():
    if request.method == 'GET':
        return user_impl.getUsers()
    if request.method == 'POST':
        if request.is_json is False:
            return flask.jsonify(status='failed', msg='body is not json')
        return user_impl.createUser()

@app.route('/api/users/<string:loginID>', methods=['GET', 'DELETE', 'PUT'])
@auth_impl.needLogin()
@auth_impl.forAdmin()
def manageUser(loginID):
    if request.method == 'DELETE':
        return user_impl.deleteUser(loginID)
    if request.method == 'PUT':
        return user_impl.updateUser(loginID)
    if request.method == 'GET':
        return user_impl.getUserAPI(loginID)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
