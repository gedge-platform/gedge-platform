import flask
from flask import request, jsonify, session

import flask_api.auth_impl
from flask_api.monitoring_manager import get_db_connection
import flask_api.center_client
from flask_api.global_def import config
from flask_api.runtime_helper import getBasicPVName, makeUserJupyterNodeportYaml
from flask_api.filesystem_impl import makeFolderToNFS, removeFolderFromNFS

class User:
    def __init__(self, userID, userLoginID, userName, workspaceName, isAdmin):
        self.userUUID = userID
        self.userLoginID = userLoginID
        self.userName = userName
        self.workspaceName = workspaceName
        self.isAdmin = isAdmin

def getUserInSession():
    isLogin = flask.session.get('is_login')
    if isLogin is None:
        return None
    elif isLogin is False:
        return None

    return User(session['user_uuid'], session['user_id'], session['user_name'], session['workspace'], session['is_admin'])

def getUsers():
    mycon = get_db_connection()
    cursor = mycon.cursor(dictionary=True)
    cursor.execute(f'select login_id, user_name, is_admin from TB_USER;')
    rows = cursor.fetchall()
    list = []
    if rows is not None:
        for row in rows:
            list.append(row)

    return jsonify(users=list), 200

def getCenterUserName(loginID):
    return config.api_id + "_" + loginID


def createUser():
    data = request.json
    if data is None:
        return jsonify(status='failed', msg='body is not json'), 400
    if data.get('login_id') is None or type( data.get('login_id')) != str:
        return jsonify(status='failed', msg='login_id is wrong'), 400
    if data.get('user_name') is None or type( data.get('user_name')) != str:
        return jsonify(status='failed', msg='user_name is wrong'), 400
    if data.get('login_pass') is None or type( data.get('login_pass')) != str:
        return jsonify(status='failed', msg='login_pass is wrong'), 400
    if data.get('is_admin') is None or type( data.get('is_admin')) != int:
        return jsonify(status='failed', msg='is_admin is wrong'), 400
    if data.get('cluster_list') is None or type( data.get('cluster_list')) != list:
        return jsonify(status='failed', msg='cluster_list is wrong'), 400
    for item in data.get('cluster_list'):
        if type(item) != str:
            return jsonify(status='failed', msg='cluster_list is wrong'), 400

    mycon = get_db_connection()
    cursor = mycon.cursor(dictionary=True)
    cursor.execute(f'select * from TB_USER where login_id = "{data.get("login_id")}";')
    rows = cursor.fetchall()

    if rows is None:
        return jsonify(status='failed', msg='server error'), 201
    elif len(rows) >= 1:
        return jsonify(status='failed', msg='login_id is already exist'), 201

    #system
    #make user dir
    makeFolderToNFS('user/' + data.get("login_id"))

    #make nodeport first
    # jupyter pass
    jupyterPW = flask_api.auth_impl.makePassNotebook(data.get('login_pass'))

    res = flask_api.center_client.servicePost(makeUserJupyterNodeportYaml(data.get("login_id")), flask_api.global_def.config.api_id,
                                              flask_api.global_def.config.system_cluster, flask_api.global_def.config.system_namespace)

    port = -1
    if res:
        if res.get('spec'):
            if res.get('spec').get('ports'):
                if res.get('spec').get('ports')[0].get('nodePort'):
                    port = res.get('spec').get('ports')[0].get('nodePort')

    # service failed
    if port == -1:
        res = flask_api.center_client.serviceDelete(flask_api.runtime_helper.getUserJupyterNodeportName(data.get("login_id")), flask_api.global_def.config.api_id,
                                               flask_api.global_def.config.system_cluster, flask_api.global_def.config.system_namespace)
        return jsonify(status='failed', msg='server error : service failed'), 201

    # jupyter pv
    status = flask_api.center_client.pvCreate(flask_api.runtime_helper.makeUserJupyterPVYaml(data.get("login_id")), flask_api.global_def.config.api_id, flask_api.global_def.config.system_cluster, None)
    import ast
    if (status['code'] != 201 or ast.literal_eval(status['data'])['status'] == 'Failure'):
        res = flask_api.center_client.serviceDelete(flask_api.runtime_helper.getUserJupyterNodeportName(data.get("login_id")), flask_api.global_def.config.api_id,
                                               flask_api.global_def.config.system_cluster, flask_api.global_def.config.system_namespace)
        return jsonify(status='failed', msg='pv make failed'), 400

    # jupyter pvc
    status = flask_api.center_client.pvcCreate(flask_api.runtime_helper.makeUserJupyterPVCYaml(data.get("login_id")),
                                               flask_api.global_def.config.api_id, flask_api.global_def.config.system_cluster, flask_api.global_def.config.system_namespace)
    if (status['code'] != 201 or ast.literal_eval(status['data'])['status'] == 'Failure'):
        res = flask_api.center_client.pvDelete(flask_api.runtime_helper.getUserJupyterPVName(data.get("login_id")), flask_api.global_def.config.api_id,
                                               flask_api.global_def.config.system_cluster, flask_api.global_def.config.system_namespace)
        res = flask_api.center_client.serviceDelete(flask_api.runtime_helper.getUserJupyterNodeportName(data.get("login_id")), flask_api.global_def.config.api_id,
                                               flask_api.global_def.config.system_cluster, flask_api.global_def.config.system_namespace)
        return jsonify(status='failed', msg='pvc make failed'), 400

    # jupyter pod
    flask_api.center_client.podsPost(flask_api.runtime_helper.makeUserJupyterPodYaml(data.get("login_id"), jupyterPW), flask_api.global_def.config.api_id,
                flask_api.global_def.config.system_cluster, flask_api.global_def.config.system_namespace)

    #uuid
    import uuid
    uuid = uuid.uuid4().__str__()

    #make workspace
    res = flask_api.center_client.workspacesPost(getCenterUserName(data.get("login_id")), config.api_id + "_" + data.get("user_name"), data.get("cluster_list"))
    if res.get('status') is None:
        deleteUserSystem(data.get('login_id'))
        return jsonify(status='failed', msg='server error : workspace'), 201
    if res.get('status') != 'Created':
        deleteUserSystem(data.get('login_id'))
        return jsonify(status='failed', msg='server error : workspace duplicated'), 201

    #pass
    saltedPW = flask_api.auth_impl.salt(data.get('login_pass'));
    encodedPW = flask_api.auth_impl.encodeHash(saltedPW);

    #insert to db
    try:
        cursor.execute(f'insert into TB_USER (user_uuid, login_id, login_pass, jupyter_pass, jupyter_port, user_name, workspace_name, is_admin) '
                   f'values("{uuid}", "{data.get("login_id")}", "{encodedPW}", "{jupyterPW}", {port},"{data.get("user_name")}", "{getCenterUserName(data.get("login_id"))}", {data.get("is_admin")});')
        mycon.commit()
    except:
        deleteUserSystem(data.get('login_id'))
        return jsonify(status='failed', msg='server error'), 201

    return jsonify(status="success"), 201


def getUser(loginID):
    mycon = get_db_connection()
    cursor = mycon.cursor(dictionary=True)
    cursor.execute(f'select user_uuid, user_name, workspace_name, is_admin from TB_USER where login_id = "{loginID}";')
    rows = cursor.fetchall()
    if rows is not None:
        if len(rows) >= 1:
            try:
                user = User(rows[0]['user_uuid'], loginID, rows[0]['user_name'], rows[0]['workspace_name'], bool(rows[0]['is_admin']))
                return user
            except:
                return None

    return None


def getUserAPI(loginID):
    user = getUser(loginID)
    if user is None:
        return jsonify(status="failed", msg="no user " + loginID), 404
    else:
        return jsonify(status="success", user={'user_name': user.userName, 'user_uuid' : user.userUUID}), 200


def deleteUser(loginID):
    def deleteUserData(workspaceName):
        deleteUserSystem(loginID)
        res = flask_api.center_client.workspacesDelete(workspaceName)

        flask_api.filesystem_impl.removeFolderFromNFS('user/' + loginID)

        mycon = get_db_connection()
        cursor = mycon.cursor(dictionary=True)
        cursor.execute(
            f'delete from TB_USER where login_id = "{loginID}";')
        mycon.commit()

        return jsonify(status='success'), 200

    def getCenterProjectID(projectID, projectName):
        return projectName + "-" + projectID

    def deletePV(workspaceName, pvName, centerProjectID):
        response = flask_api.center_client.userProjectsNameGet(centerProjectID)
        if response.get('data') is None:
            return {'status': 'failed'}
        if response.get('data').get('selectCluster') is None:
            return {'status': 'failed'}

        for cluster in response['data']['selectCluster']:
            status = flask_api.center_client.pvDelete(pvName, workspaceName, cluster.get('clusterName'),
                                                      centerProjectID)
            if status.get('status') == 'failed':
                return {'status': 'failed', 'msg' : 'cluster is wrong'}
        return {'status' : 'success'}

    mycon = get_db_connection()
    cursor = mycon.cursor(dictionary=True)
    cursor.execute(f'select TB_USER.user_uuid, user_name, project_name, project_uuid, workspace_name from TB_USER LEFT JOIN TB_PROJECT ON TB_USER.user_uuid = TB_PROJECT.user_uuid where login_id = "{loginID}";')
    rows = cursor.fetchall()

    if rows is not None:
        if len(rows) >= 1:
            userUUID = rows[0]['user_uuid']
            workspaceName = rows[0]['workspace_name']

            #get project list from server
            workspaceInfo = flask_api.center_client.workspacesNameGet(workspaceName)
            serverProjectNameList = {}
            if workspaceInfo.get('projectList') != None:
                serverProjectList = workspaceInfo.get('projectList')
                for serverProject in serverProjectList:
                    if serverProject.get('projectName') is not None:
                        serverProjectNameList[serverProject['projectName']] = serverProject['projectName']
                if len(serverProjectList) == 0:
                    return deleteUserData(workspaceName)
                else:
                    for row in rows:
                        if row.get('project_uuid') is not None:
                            projectUUID = row.get('project_uuid')
                            projectName = row.get('project_name')
                            centerProjectID = getCenterProjectID(projectUUID, projectName)

                            if projectUUID is not None:
                                pvName = getBasicPVName(loginID, projectName)
                                res = deletePV(workspaceName, pvName, centerProjectID)
                                if res['status'] == 'failed':
                                    return jsonify(status="failed", msg="cant pv delete " + projectName), 200

                                res = flask_api.center_client.projectsDelete(centerProjectID)

                                if serverProjectNameList.get(centerProjectID) is not None:
                                    del serverProjectNameList[centerProjectID]

                    #delete rest server project
                    for projectName in serverProjectNameList.keys():
                        pvName = getBasicPVName(loginID, projectName[:-37])
                        res = deletePV(workspaceName, pvName, projectName)
                        if res['status'] == 'failed':
                            return jsonify(status="failed", msg="cant pv delete " + projectName), 200

                        res = flask_api.center_client.projectsDelete(projectName)

                    return deleteUserData(workspaceName)
            else:
                return deleteUserData(workspaceName)
    return jsonify(status="failed", msg="no user " + loginID), 200


def updateUser(loginID):
    data = request.json
    if data is None:
        return jsonify(status='failed', msg='body is not json'), 200
    if data.get('user_name') is None or type( data.get('user_name')) != str:
        return jsonify(status='failed', msg='user_name is wrong'), 200
    if data.get('is_admin') is None or type( data.get('is_admin')) != int:
        return jsonify(status='failed', msg='is_admin is wrong'), 200

    userData = getUser(loginID)
    if userData is None:
        return jsonify(status="failed", msg="no user " + loginID), 200
    else:
        mycon = get_db_connection()
        cursor = mycon.cursor(dictionary=True)
        try:
            cursor.execute(
                f'update TB_USER set user_name = "{data.get("user_name")}", is_admin = {data.get("is_admin")} where login_id = "{loginID}";')
            mycon.commit()
        except:
            return jsonify(status="failed", msg="update error"), 200
        return jsonify(status="success"), 200


def getuserStoragePort(user : User):
    mycon = get_db_connection()
    cursor = mycon.cursor(dictionary=True)
    cursor.execute(f'select jupyter_port from TB_USER where login_id = "{user.userLoginID}";')
    rows = cursor.fetchall()
    if rows:
        return rows[0]['jupyter_port']

    return None

def getUserStorageURL(user : User, path : str = ''):
    port = getuserStoragePort(user)
    if port:
        if path:
            path = 'tree/' + path
        return flask.redirect(flask_api.global_def.config.storage_server + ":" + str(port) + "/storage/" + user.userLoginID + '/' + path)
    return jsonify(msg="not found port"), 404



def deleteUserSystem(loginID):
    res = flask_api.center_client.podsNameDelete(flask_api.runtime_helper.getUserJupyterLabelName(loginID), flask_api.global_def.config.api_id,
                                           flask_api.global_def.config.system_cluster, flask_api.global_def.config.system_namespace)
    res = flask_api.center_client.pvcDelete(flask_api.runtime_helper.getUserJupyterPVCName(loginID), flask_api.global_def.config.api_id,
                                           flask_api.global_def.config.system_cluster, flask_api.global_def.config.system_namespace)
    res = flask_api.center_client.pvDelete(flask_api.runtime_helper.getUserJupyterPVName(loginID), flask_api.global_def.config.api_id,
                                           flask_api.global_def.config.system_cluster, flask_api.global_def.config.system_namespace)
    res = flask_api.center_client.serviceDelete(flask_api.runtime_helper.getUserJupyterNodeportName(loginID), flask_api.global_def.config.api_id,
                                           flask_api.global_def.config.system_cluster, flask_api.global_def.config.system_namespace)