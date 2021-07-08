from flask import Blueprint, request, jsonify
import subprocess
import json
import yamale
import yaml
import app_conf
import logging.handlers

limitrange = Blueprint('limitrange', __name__)

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
name: str(required=True)
namespace: str(required=True)
min: map(required=True)
max: map(required=True)
""")


@limitrange.route('/create', methods=['post'])
def create():
    msg = {
        'err': None,
        'res': None
    }

    try:
        # schema validation
        yamale.validate(schema_create, yamale.make_data(content=request.data.decode('utf-8')))

        # name
        body = yaml.load(request.data, Loader=yaml.Loader)

        temp = f"""
apiVersion: v1
kind: LimitRange
metadata:
  name: {body['name']}
  namespace: {body['namespace']}
spec:
  limits: []
"""

        temp = yaml.load(temp, Loader=yaml.Loader)
        temp['spec']['limits'].append({
            'min': body['min'],
            'max': body['max'],
            'type': 'Container'
        })

        temp = yaml.dump(temp)

        cmd = f'cat << EOF | kubectl apply -f -\n{temp}\nEOF\n'
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
namespace: str(required=True)
""")


@limitrange.route('/delete', methods=['delete'])
def delete():
    msg = {
        'err': None,
        'res': None
    }

    try:
        # schema validation
        yamale.validate(schema_delete, yamale.make_data(content=request.data.decode('utf-8')))

        body = yaml.load(request.data, Loader=yaml.Loader)

        temp = f"""
apiVersion: v1
kind: LimitRange
metadata:
 name: {body['name']}
 namespace: {body['namespace']}
"""
        cmd = f'cat << EOF | kubectl delete -f -\n{temp}\nEOF\n'
        st, res = subprocess.getstatusoutput(cmd)
        if st != 0:
            logger.error(res)
            msg['err'] = res

    except Exception as e:
        logger.error(str(e))
        msg['err'] = str(e)

    return jsonify(msg)


@limitrange.route('/list', methods=['get'])
def list_():
    msg = {
        'err': None,
        'res': []
    }

    try:
        namespace = request.args.get('namespace')

        cmd = f'kubectl get limitrange -n {namespace} -o json'
        st, res = subprocess.getstatusoutput(cmd)
        if st != 0:
            logger.error(res)
            msg['err'] = res
        else:
            obj = json.loads(res)
            for item in obj['items']:
                msg['res'].append(item['metadata']['name'])
    except Exception as e:
        logger.error(str(e))
        msg['err'] = str(e)

    return jsonify(msg)


@limitrange.route('/get', methods=['get'])
def get():
    msg = {
        'err': None,
        'res': None
    }

    try:
        name = request.args.get('name')
        namespace = request.args.get('namespace')

        cmd = f'kubectl get limitrange {name} -n {namespace} -o json'
        st, res = subprocess.getstatusoutput(cmd)
        if st != 0:
            logger.error(res)
            msg['err'] = res
        else:
            obj = json.loads(res)
            if len(obj['spec']['limits']) > 0:
                msg['res'] = obj['spec']['limits'][0]

    except Exception as e:
        logger.error(str(e))
        msg['err'] = str(e)

    return jsonify(msg)
