from flask import Blueprint, request, jsonify
import subprocess
import json
import yamale
import yaml
import app_conf
import logging.handlers

namespace = Blueprint('namespace', __name__)

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

# hide reserved_ns from delete or list api.
reserved_ns = {'default', 'kube-node-lease', 'kube-public', 'kube-system', 'monitoring'}

schema_create = yamale.make_schema(content="""  
name: str(required=True)
""")


@namespace.route('/create', methods=['post'])
def create():
    msg = {
        'err': None,
        'res': None
    }

    try:
        # schema validation
        yamale.validate(schema_create, yamale.make_data(content=request.data.decode('utf-8')))
        body = yaml.load(request.data, Loader=yaml.Loader)

        cmd = f"kubectl create namespace {body['name']}"
        st, res = subprocess.getstatusoutput(cmd)
        if st != 0:
            logger.error(res)
            msg['err'] = res

    except Exception as e:
        logger.error(str(e))
        msg['err'] = str(e)

    return jsonify(msg)


schema_delete = yamale.make_schema(content="""  
name: str(required=True)
""")


@namespace.route('/delete', methods=['delete'])
def delete():
    msg = {
        'err': None,
        'res': None
    }

    try:
        # schema validation
        yamale.validate(schema_create, yamale.make_data(content=request.data.decode('utf-8')))
        body = yaml.load(request.data, Loader=yaml.Loader)

        if not body['name'] in reserved_ns:
            cmd = f"kubectl delete namespace {body['name']}"
            st, res = subprocess.getstatusoutput(cmd)
            if st != 0:
                logger.error(res)
                msg['err'] = res
        else:
            msg['err'] = f"reserved_ns: {body['name']}"

    except Exception as e:
        logger.error(str(e))
        msg['err'] = str(e)

    return jsonify(msg)


@namespace.route('/list', methods=['get'])
def list_():
    msg = {
        'err': None,
        'res': []
    }

    try:
        cmd = f'kubectl get namespace -o json'
        st, res = subprocess.getstatusoutput(cmd)
        if st != 0:
            logger.error(res)
            msg['err'] = res
        else:
            obj = json.loads(res)
            for item in obj['items']:
                if not item['metadata']['name'] in reserved_ns:
                    msg['res'].append(item['metadata']['name'])

    except Exception as e:
        logger.error(str(e))
        msg['err'] = str(e)

    return jsonify(msg)
