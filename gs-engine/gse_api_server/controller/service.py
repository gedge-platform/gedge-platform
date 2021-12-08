from typing import Dict, List

from flask import Blueprint, request, jsonify, abort
import json
import yamale
import yaml
import app_conf
import mydb

from tools import common as c_tool

from service import service as service_service

service = Blueprint('service', __name__)

# set logger
logger = app_conf.Log.get_logger(__name__)

db_path = "./data/service.db"
db_schedulehint_path = "./data/schedulehint.db"
mydb.init(db_path)


require_schema = yamale.make_schema(content="""
service:
  name: str(required=True)
  namespace: str(required=True)
  containers: list(required=True)
  ports: list(num(), required=True)
  type: str(required=True)
  monitorPorts: list(num(), required=False)
  scheduleHint: map(required=False)
""")


@service.route('', methods=['get'])
def list_service():
    details = request.args.get('details') == 'true'
    cnt_from = request.args.get('from', None, int)
    cnt_to = request.args.get('to', None, int)
    search_name = request.args.get('name', None, str)
    search_namespace = request.args.get('namespace', None, str)
    namespace = request.headers.get('namespace', search_namespace)
    search_label = request.args.get('label', None, str)
    sort = json.loads(request.args.get('sort', "null", str))
    result = service_service.list_service(details, cnt_from, cnt_to, namespace, search_name, search_label, sort)
    return jsonify(result)


@service.route('', methods=['post'])
def create_service():
    content_type = request.headers.get("Content-Type")

    namespace = request.headers.get('namespace', 'default')

    if "yaml" in content_type:
        # schema validation
        yamale.validate(require_schema, yamale.make_data(content=request.data.decode('utf-8')))
        body = yaml.load(request.data, Loader=yaml.Loader)
    else:
        body = json.loads(request.data)
    svc = body.get('service', None)
    if svc is None:
        abort(400, description="invalid schema")
    result = service_service.create_service(namespace, svc)
    return jsonify(result)


@service.route('/<service_name>', methods=['get'])
def get_service(service_name):
    namespace = request.headers.get('namespace', 'default')
    result = service_service.get_service(namespace, service_name)
    return jsonify(result)


@service.route('/<service_name>/detail', methods=['get'])
def detail_service(service_name):
    namespace = request.headers.get('namespace', 'default')
    result = service_service.get_service_detail(namespace, service_name)
    return jsonify(result)


@service.route('/<service_name>/status', methods=['get'])
def status_service(service_name):
    namespace = request.headers.get('namespace', 'default')
    result = service_service.status_service(namespace, service_name)
    return jsonify(result)


@service.route('/<service_name>', methods=['delete'])
def delete_service(service_name):
    namespace = request.headers.get('namespace', 'default')
    result = service_service.delete_service(namespace, service_name)
    return jsonify(result)


# @service.route('/spec', methods=['get'])
# def info():
#     msg = {
#         'err': None,
#         'res': None
#     }
#
#     try:
#         name = request.args.get('name', None)
#         namespace = request.args.get('namespace', None)
#
#         # deployment
#         cmd = f'kubectl get svc {name} -n {namespace}'
#         st, res = subprocess.getstatusoutput(cmd)
#         if st != 0:
#             logger.error(res)
#             msg['err'] = res
#         else:
#             obj = json.loads(res)
#             msg['res'] = obj['spec']
#
#     except Exception as e:
#         logger.error(str(e))
#         msg['err'] = str(e)
#
#     return jsonify(msg)


# @service.route('/stop', methods=['get'])
# def stop():
#     msg = {
#         'err': None,
#         'res': None
#     }
#
#     return jsonify(msg)
#
#
# @service.route('/start', methods=['get'])
# def start():
#     msg = {
#         'err': None,
#         'res': None
#     }
#
#     return jsonify(msg)

# TODO: service template 생성
@service.route('/<service_name>/template', methods=['post'])
def create_template(service_name):
    content_type = request.headers.get("Content-Type")
    namespace = request.headers.get('namespace', 'default')
    result = service_service.get_service(namespace, service_name)
    return jsonify(result)


schema_create_label = yamale.make_schema(content="""  
labels: map()
""")


@service.route('/<service_name>/labels', methods=['post'])
def create_label(service_name):
    content_type = request.headers.get("Content-Type")
    namespace = request.headers.get('namespace', None)

    if "yaml" in content_type:
        # schema validation
        yamale.validate(schema_create_label, yamale.make_data(content=request.data.decode('utf-8')))
        body = yaml.load(request.data, Loader=yaml.Loader)
    else:
        body = json.loads(request.data)
    labels = body['labels']
    result = service_service.create_label(namespace, service_name, labels)
    return jsonify(result)


@service.route('/<service_name>/labels', methods=['get'])
def get_label(service_name):
    namespace = request.headers.get('namespace', None)
    result = service_service.get_label(namespace, service_name)
    return jsonify(result)


schema_delete_label = yamale.make_schema(content="""  
labels: list()
""")


@service.route('/<service_name>/labels', methods=['delete'])
def delete_label(service_name):
    content_type = request.headers.get("Content-Type")
    namespace = request.headers.get('namespace', None)

    if "yaml" in content_type:
        # schema validation
        yamale.validate(schema_delete_label, yamale.make_data(content=request.data.decode('utf-8')))
        body = yaml.load(request.data, Loader=yaml.Loader)
    else:
        body = json.loads(request.data)

    labels = body['labels']

    result = service_service.delete_label(namespace, service_name, labels)
    return jsonify(result)


schema_create_node_selector = yamale.make_schema(content="""  
nodeSelector: map()
""")


@service.route('/<service_name>/node-selector', methods=['post'])
def create_node_selector(service_name):
    content_type = request.headers.get("Content-Type")
    namespace = request.headers.get('namespace', 'default')

    if "yaml" in content_type:
        # schema validation
        yamale.validate(schema_create_node_selector, yamale.make_data(content=request.data.decode('utf-8')))
        body = yaml.load(request.data, Loader=yaml.Loader)
    else:
        body = json.loads(request.data)
    node_selector = body['nodeSelector']

    result = service_service.create_node_selector(namespace, service_name, node_selector)
    return jsonify(result)


@service.route('/<service_name>/node-selector', methods=['delete'])
def delete_node_selector(service_name):
    namespace = request.headers.get('namespace', 'default')
    result = service_service.delete_node_selector(namespace, service_name)
    return jsonify(result)


@service.route('/<service_name>/node-selector', methods=['get'])
def get_node_selector(service_name):
    namespace = request.headers.get('namespace', 'default')
    result = service_service.get_node_selector(namespace, service_name)
    return jsonify(result)


@service.route('/<service_name>/logs', methods=['get'])
def get_logs(service_name):
    namespace = request.headers.get('namespace', 'default')
    labels = json.loads(request.args.get('labels', "null", str))
    container = request.args.get('container', None, str)
    result = service_service.get_logs(namespace, service_name, labels, container)
    return jsonify(result)

