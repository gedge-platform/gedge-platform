from flask import Blueprint, request, jsonify
import json
import yamale
import yaml
import app_conf
from tools import common as c_tool
from service import namespace as namespace_service

namespace = Blueprint('namespace', __name__)

# set logger
logger = app_conf.Log.get_logger(__name__)

require_schema = yamale.make_schema(content="""
namespace:
  name: str(required=True)
""")


@namespace.route('', methods=['get'])
def list_namespace():
    details = request.args.get('details') == 'true'
    cnt_from = request.args.get('from', None, int)
    cnt_to = request.args.get('to', None, int)
    search_name = request.args.get('name', None, str)
    result = namespace_service.get_namespaces(details, cnt_from, cnt_to, search_name)
    return jsonify(result)


@namespace.route('', methods=['post'])
def create_namespace():
    content_type = request.headers.get("Content-Type")

    if "yaml" in content_type:
        # schema validation
        yamale.validate(require_schema, yamale.make_data(content=request.data.decode('utf-8')))
        body = yaml.load(request.data, Loader=yaml.Loader)
    else:
        body = json.loads(request.data)

    cmd = f"kubectl create namespace {body['namespace']['name']}"

    return jsonify(c_tool.gen_msg(logger, cmd))


@namespace.route('/<namespace_name>', methods=['get'])
def get_namespace(namespace_name):
    def fnc(obj):
        return {'namespace': obj}

    cmd = f'kubectl get namespace {namespace_name}'

    return jsonify(c_tool.gen_msg(logger, cmd, fnc))


@namespace.route('/<namespace_name>', methods=['delete'])
def delete_namespace(namespace_name):
    result = namespace_service.delete_namespaces(namespace_name)
    return jsonify(result)
