from flask import Blueprint, request, jsonify, abort
import json
import yaml
import app_conf

from service import template as template_service
from tools.exception import NotExistException, DuplicatedException

template = Blueprint('template', __name__)

# set logger
logger = app_conf.Log.get_logger(__name__)


@template.route('', methods=['get'])
def get_templates():
    details = request.args.get('details') == 'true'
    cnt_from = request.args.get('from', None, int)
    cnt_to = request.args.get('to', None, int)
    search_name = request.args.get('name', None, str)
    sort = json.loads(request.args.get('sort', "null", str))
    result = template_service.select_templates(details, cnt_from, cnt_to, search_name, sort)
    return jsonify(result)


@template.route('', methods=['post'])
def create_template():
    content_type = request.headers.get("Content-Type")

    if "yaml" in content_type:
        body = yaml.load(request.data, Loader=yaml.Loader)
    else:
        body = json.loads(request.data)

    tpl = body.get('template', None)
    if tpl is None:
        abort(400, description="invalid schema")
    try:
        result = template_service.create_template(tpl)
        return jsonify(result)
    except DuplicatedException as e:
        abort(400, description=e.message)


@template.route('/<template_name>', methods=['get'])
def get_template(template_name):
    try:
        result = template_service.select_template(template_name)
        return jsonify(result)
    except NotExistException as e:
        abort(404, description=e.message)


@template.route('/<template_name>', methods=['patch', 'put'])
def update_template(template_name):
    content_type = request.headers.get("Content-Type")

    if "yaml" in content_type:
        body = yaml.load(request.data, Loader=yaml.Loader)
    else:
        body = json.loads(request.data)

    tpl = body.get('template', None)
    if tpl is None:
        abort(400, description="invalid schema")
    try:
        result = template_service.update_template(template_name, tpl, request.method)
        return jsonify(result)
    except NotExistException as e:
        abort(404, description=e.message)


@template.route('/<template_name>', methods=['delete'])
def delete_template(template_name):
    result = template_service.delete_template(template_name)
    return jsonify(result)
