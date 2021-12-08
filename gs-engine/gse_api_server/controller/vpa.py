from flask import Blueprint, request, jsonify
import subprocess
import json
import yamale
import yaml
import app_conf
import logging.handlers

vpa = Blueprint('vpa', __name__)

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
mode: str(required=True)
""")


@vpa.route('/create', methods=['post'])
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

        if body['mode'].lower() == "auto":
            body['mode'] = "Auto"
        elif body['mode'].lower() == "initial":
            body['mode'] = "Initial"
        elif body['mode'].lower() == "off":
            body['mode'] = "Off"

        temp = f"""
apiVersion: autoscaling.k8s.io/v1beta2
kind: VerticalPodAutoscaler
metadata:
  name: {body['name']}
  namespace: {body['namespace']}
spec:
  targetRef:
    apiVersion: "extensions/v1beta1"
    kind:       Deployment
    name:       {body['name']}
  updatePolicy:
    updateMode: "{body['mode']}"
"""
        temp = yaml.load(temp, Loader=yaml.Loader)
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


@vpa.route('/delete', methods=['delete'])
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
apiVersion: autoscaling.k8s.io/v1beta2
kind: VerticalPodAutoscaler
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


@vpa.route('/list', methods=['get'])
def list():
    msg = {
        'err': None,
        'res': []
    }

    try:
        namespace = request.args.get('namespace', None)

        cmd = f'kubectl get vpa -n {namespace} -o json'
        st, res = subprocess.getstatusoutput(cmd)
        if st != 0:
            logger.error(res)
            msg['err'] = res
        else:
            obj = json.loads(res)
            for item in obj['items']:
                msg['res'].append({
                    'name': item['metadata']['name'],
                    'namespace': item['metadata']['namespace']
                })
    except Exception as e:
        logger.error(str(e))
        msg['err'] = str(e)

    return jsonify(msg)


@vpa.route('/get', methods=['get'])
def get():
    msg = {
        'err': None,
        'res': None
    }

    try:
        name = request.args.get('name', None)
        namespace = request.args.get('namespace', None)

        cmd = f'kubectl get vpa {name} -n {namespace} -o json'
        st, res = subprocess.getstatusoutput(cmd)
        if st != 0:
            logger.error(res)
            msg['err'] = res
        else:
            obj = json.loads(res)
            msg['res'] = {
                "name": name,
                "namespace": namespace,
                "mode": obj['spec']['updatePolicy']['updateMode'],
            }

    except Exception as e:
        logger.error(str(e))
        msg['err'] = str(e)

    return jsonify(msg)
