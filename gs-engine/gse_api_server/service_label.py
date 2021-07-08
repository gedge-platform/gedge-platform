from flask import Blueprint, request, jsonify
import subprocess
import json
import yamale
import yaml
import app_conf
import logging.handlers

service_label = Blueprint('service_label', __name__)

# set logger
logger = logging.getLogger(__name__)
path = f'./logs/{__name__}.log'
fileHandler = logging.handlers.RotatingFileHandler(path,
                                                   maxBytes=app_conf.Log.log_max_size,
                                                   backupCount=app_conf.Log.log_backup_count)
fileHandler.setFormatter(logging.Formatter('%(asctime)s %(levelname)s %(filename)s:%(lineno)s %(message)s'))
logger.addHandler(fileHandler)
logger.setLevel(app_conf.Log.log_level)

# temp
logger.addHandler(logging.StreamHandler())

schema_create = yamale.make_schema(content="""  
name: str()
namespace: str()
labels: map()
""")


@service_label.route('/create', methods=['post'])
def create():
    msg = {
        'err': None,
        'res': None
    }

    try:
        # schema validation
        yamale.validate(schema_create, yamale.make_data(content=request.data.decode('utf-8')))
        body = yaml.load(request.data, Loader=yaml.Loader)

        temp = ""
        for k, v in body['labels'].items():
            temp += f" {k}={v}"

        cmd = f"kubectl label svc {body['name']} -n {body['namespace']} {temp}"
        st, res = subprocess.getstatusoutput(cmd)
        if st != 0:
            logger.error(res)
            msg['err'] = res

    except Exception as e:
        logger.error(str(e))
        msg['err'] = str(e)

    return jsonify(msg)


schema_delete = yamale.make_schema(content="""  
name: str()
namespace: str()
labels: list()
""")


@service_label.route('/delete', methods=['delete'])
def delete():
    msg = {
        'err': None,
        'res': None
    }

    try:
        # schema validation
        yamale.validate(schema_delete, yamale.make_data(content=request.data.decode('utf-8')))
        body = yaml.load(request.data, Loader=yaml.Loader)

        temp = ""
        for label in body['labels']:
            temp += f" {label}-"

        cmd = f"kubectl label svc {body['name']} -n {body['namespace']} {temp}"
        st, res = subprocess.getstatusoutput(cmd)
        if st != 0:
            logger.error(res)
            msg['err'] = res

    except Exception as e:
        logger.error(str(e))
        msg['err'] = str(e)

    return jsonify(msg)


@service_label.route('/get', methods=['get'])
def get():
    msg = {
        'err': None,
        'res': None
    }

    try:
        name = request.args.get('name')
        namespace = request.args.get('namespace')

        # deployment
        cmd = f'kubectl get svc {name} -n {namespace} -o json'
        st, res = subprocess.getstatusoutput(cmd)
        if st != 0:
            logger.error(res)
            msg['err'] = res
        else:
            obj = json.loads(res)
            msg['res'] = obj['metadata']['labels']

    except Exception as e:
        logger.error(str(e))
        msg['err'] = str(e)

    return jsonify(msg)
