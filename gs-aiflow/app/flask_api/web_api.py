import os
import traceback
import time
import ssl
import flask_restful
import flask
from flask import request
from flask_sockets import Sockets
from flask_cors import CORS

#from flask_restful import reqparse

from flask_api import monitor_impl


app = flask.Flask(import_name='client_web',static_folder=os.path.join('../web_root','static'),
				  static_url_path='',
				  root_path='')
app.config['JSON_AS_ASCII'] = False

CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

sockets = Sockets(app)

api = flask_restful.Api(app)



@app.route('/')
def index():
	return "HELLO, AIEYEFLOW"


@app.route('/api/getListNodeAll/<string:clustername>')
def getListNodeAll(clustername=None):
	return monitor_impl.getListNodeAll(clustername)

@app.route('/api/getListNamespacePod',methods=['POST'])
def getListNamespacePod():
	if request.method=='POST':
		result=request.form
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

@app.route('/api/setMonitor',methods=['POST'])
def setMonitor():
	if request.method=='POST':
		result=request.form
		return monitor_impl.setMonitor(result)
	else:
		return 'ERROR'

@app.route('/api/abstractMonitor/<string:clustername>')
def abstractMonitor(clustername):
	return monitor_impl.abstractMonitor(clustername)


@app.route('/api/createDict',methods=['POST'])
def createDict():
	if request.method=='POST':
		result=request.form
	return monitor_impl.createDict(result)

@app.route('/api/deletePod/<string:podName>')
def deletePod(podName):
	return monitor_impl.deletePod(podName)

@app.route('/api/loginCheck',methods=['POST'])
def loginCheck():
	if request.method=='POST':
		result=request.form
		return monitor_impl.loginCheck(result)

@app.route('/api/getServerList')
def getServerList():
	return monitor_impl.getserverlist()

@app.route('/api/getListCreateDeployment/<string:server>')
def getListCreateDeployment(server):
	return monitor_impl.getListCreateDeployment(server)

@app.route('/api/createServer',methods=['POST'])
def createServer():
	if request.method=='POST':
		result=request.form
		return monitor_impl.createServer(result)

@app.route('/api/deleteDeployment',methods=['POST'])
def deleteDeployment():
	if request.method=='POST':
		result=request.form
		return monitor_impl.deleteDeployment(result)

@app.route('/api/getListDeploymentAllNamespaces/<string:cluster>')
def getListDeploymentAllNamespaces(cluster):
	return monitor_impl.getListDeploymentAllNamespaecs(cluster)


@app.route('/api/getPodLog',methods=['POST'])
def getPodLog():
	if request.method=='POST':
		result=request.form
		return monitor_impl.getPodLog(result)

@app.route('/api/getServerListDB/<string:cluster>',methods=['GET'])
def getServerListDB(cluster):
	return monitor_impl.getServerListDB(cluster)

@app.route('/api/getStatusDeploy',methods=['POST'])
def getStatusDeploy():
	if request.method=='POST':
		result=request.form
		return monitor_impl.getStatusDeploy(result)

@app.route('/api/testAPI')
def test():
	return monitor_impl.testAPI()

@app.route('/api/dummy',methods=['POST','GET'])
def dummy():
	if request.method=='POST':
		result=request.form
		return monitor_impl.dummy()
	return monitor_impl.dummy()


if __name__=="__main__":
	app.run(host='0.0.0.0',port=5000,debug=True)