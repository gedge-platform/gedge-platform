from flask import Blueprint, request, jsonify
import json
import yaml
import app_conf

from tools.db_connector import DBConnector as mysql

from service import service_mesh as sm_service

service_mesh = Blueprint('service_mesh', __name__)

# set logger
logger = app_conf.Log.get_logger(__name__)

conn = mysql.instance()


@service_mesh.route('', methods=['get'])
def list_service_mesh():
    namespace = request.headers.get('namespace', None)
    details = request.args.get('details') == 'true'
    cnt_from = request.args.get('from', None, int)
    cnt_to = request.args.get('to', None, int)
    search_name = request.args.get('name', None, str)
    sort = json.loads(request.args.get('sort', "null", str))
    result = sm_service.get_service_meshes(details, cnt_from, cnt_to, namespace, search_name, sort)
    return jsonify(result)


@service_mesh.route('', methods=['post'])
def create_service_mesh():
    content_type = request.headers.get("Content-Type")

    namespace = request.headers.get('namespace', 'default')

    if "yaml" in content_type:
        # schema validation
        body = yaml.load(request.data, Loader=yaml.Loader)
    else:
        body = json.loads(request.data)
    sm = body['serviceMesh']
    result = sm_service.create_service_mesh(namespace, sm)

    return jsonify(result)


@service_mesh.route('/<mesh_name>', methods=['get'])
def get_service_mesh(mesh_name):
    namespace = request.headers.get('namespace', None)
    result = sm_service.get_service_mesh(namespace, mesh_name)
    return jsonify(result)


@service_mesh.route('/<mesh_name>', methods=['delete'])
def delete_service_mesh(mesh_name):
    namespace = request.headers.get('namespace', None)

    result = sm_service.delete_service_mesh(namespace, mesh_name)

    return jsonify(result)
