from flask import Blueprint, request, jsonify
import subprocess
import json
import yamale
import yaml
from yamale import YamaleError

import app_conf
import logging.handlers

service_nodeselector = Blueprint('service_nodeselector', __name__)

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
nodeSelector: map()
""")


@service_nodeselector.route('/create', methods=['post'])
def create():
    msg = {
        'err': None,
        'res': None
    }

    try:
        # schema validation
        yamale.validate(schema_create, yamale.make_data(content=request.data.decode('utf-8')))
        body = yaml.load(request.data, Loader=yaml.Loader)
        name = body['name']
        namespace = body['namespace']

        temp = """
spec:
  template:
    spec:
      nodeSelector:        
"""
        temp = yaml.load(temp, Loader=yaml.Loader)
        temp['spec']['template']['spec']['nodeSelector'] = body['nodeSelector']
        # temp = yaml.dump(temp)
        temp = json.dumps(temp)
        print(temp)

        # multiline command! : """command"""
        cmd = f"""kubectl patch deployment {name} -n {namespace} --patch '{temp}'"""
        st, res = subprocess.getstatusoutput(cmd)
        print(res)
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
""")


@service_nodeselector.route('/delete', methods=['delete'])
def delete():
    msg = {
        'err': None,
        'res': None
    }

    try:
        # schema validation
        yamale.validate(schema_delete, yamale.make_data(content=request.data.decode('utf-8')))
        body = yaml.load(request.data, Loader=yaml.Loader)
        name = body['name']
        namespace = body['namespace']

        temp = """
    spec:
      template:
        spec:
          nodeSelector:
    """
        temp = yaml.load(temp, Loader=yaml.Loader)
        temp = json.dumps(temp)

        # multiline command! : """command"""
        cmd = f"""kubectl patch deployment {name} -n {namespace} --patch '{temp}'"""
        st, res = subprocess.getstatusoutput(cmd)
        print(res)
        if st != 0:
            logger.error(res)
            msg['err'] = res
    except Exception as e:
        logger.error(str(e))
        msg['err'] = str(e)

    return jsonify(msg)


@service_nodeselector.route('/get', methods=['get'])
def get():

    msg = {
        'err': None,
        'res': None
    }

    try:
        name = request.args.get('name')
        namespace = request.args.get('namespace')

        # deployment
        cmd = f'kubectl get deployment {name} -n {namespace} -o json'
        st, res = subprocess.getstatusoutput(cmd)
        if st != 0:
            logger.error(res)
            msg['err'] = res
        else:
            obj = json.loads(res)
            if 'nodeSelector' in obj['spec']['template']['spec']:
                msg['res'] = obj['spec']['template']['spec']['nodeSelector']
            else:
                msg['err'] = f'"{name}" not found'

    except Exception as e:
        logger.error(str(e))
        msg['err'] = str(e)

    return jsonify(msg)
