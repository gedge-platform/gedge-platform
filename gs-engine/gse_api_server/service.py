from flask import Blueprint, request, jsonify
import subprocess
import json
import yamale
import yaml
import app_conf
import logging.handlers
import mydb

service = Blueprint('service', __name__)

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

db_path = "./data/service.db"
db_schedulehint_path = "./data/schedulehint.db"
mydb.init(db_path)


def get_name(image):
    x = image.split("/")
    if len(x) == 1:
        x = x[0]
    else:
        x = x[1]
    x = x.split(":")
    return x[0]


schema_create = yamale.make_schema(content="""  
name: str(required=True)
namespace: str(required=True)
containers: list(required=True)
ports: list(num(), required=True)
type: str(required=True)
monitorPorts: list(num(), required=False)
scheduleHint: map(required=False)
""")


@service.route('/create', methods=['post'])
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

        # for deployment & service
        temp = f"""
apiVersion: apps/v1
kind: Deployment
metadata:
 name: {body['name']}
 namespace: {body['namespace']}
spec:
 replicas: 1
 selector:
   matchLabels:
     app: {body['name']}
 template:
   metadata:
     labels:
       app: {body['name']}
   spec:
     containers: []
---
apiVersion: v1
kind: Service
metadata:
 name: {body['name']}
 namespace: {body['namespace']}
 labels:
   app: {body['name']}
spec:
 selector:
   app: {body['name']}
 type:
 ports: []
"""
        docs = []
        for d in yaml.load_all(temp, Loader=yaml.Loader):
            docs.append(d)

        # namespace
        if "namespace" in body:
            docs[0]['metadata']['namespace'] = body['namespace']
            docs[1]['metadata']['namespace'] = body['namespace']

        # containers
        # for resource metric based hpa, resource limits and request must be defined.
        # todo: add option [limits and request size]
        for image in body['containers']:
            container = {
                "name": get_name(image),
                "image": image,
                "resources": {
                    "limits": {
                        "cpu": "1000m",
                        "memory": "1Gi"
                    },
                    "requests": {
                        "cpu": "100m",
                        "memory": "100Mi"
                    }
                }
            }
            docs[0]['spec']['template']['spec']['containers'].append(container)

        # ports
        for p in body['ports']:
            port = {
                'name': str(p),
                'port': p
            }
            docs[1]['spec']['ports'].append(port)

        # ports
        docs[1]['spec']['type'] = body['type']

        # generate yaml
        temp = yaml.dump_all(docs)

        # for serviceMonitor
        if "monitorPorts" in body:
            tmp2 = f"""
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
 name: {body['name']}
 namespace: {body['namespace']}
spec:
 selector:
   matchLabels:
     app: {body['name']}
 endpoints: []
"""
            tmp2 = yaml.load(tmp2, Loader=yaml.Loader)
            for p in body['monitorPorts']:
                port = {
                    'port': str(p)
                }
                tmp2['spec']['endpoints'].append(port)
            tmp2 = yaml.dump(tmp2)
            temp = f"{temp}\n---\n{tmp2}"
            print(temp)

        # apply
        # cmd = f'cat << EOF | kubectl apply -o=json -f -\n{temp}\nEOF\n'
        cmd = f'cat << EOF | kubectl apply -f -\n{temp}\nEOF\n'
        st, res = subprocess.getstatusoutput(cmd)
        if st != 0:
            logger.error(res)
            msg['err'] = res

        # todo: insert scheduleHint to schedulehint.db
        # k = f"{body['namespace']}/{body['name']}"
        # v = json.dumps(body['scheduelHint']).encode()
        # mydb.upsert(db_schedulehint_path, k, v)

        # insert to service.db
        k = f"{body['namespace']}/{body['name']}"
        v = json.dumps(body).encode()
        mydb.upsert(db_path, k, v)

    except Exception as e:
        logger.error(str(e))
        msg['err'] = str(e)

    return jsonify(msg)


schema_delete = yamale.make_schema(content="""  
name: str(required=True)
namespace: str(required=True)
""")


@service.route('/delete', methods=['delete'])
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
apiVersion: apps/v1
kind: Deployment
metadata:
 name: {body['name']}
 namespace: {body['namespace']}
---
apiVersion: v1
kind: Service
metadata:
 name: {body['name']}
 namespace: {body['namespace']}
"""

        k = f"{body['namespace']}/{body['name']}"
        v = mydb.get(db_path, k)
        if v is not None:
            obj = json.loads(v.decode())
            if "monitorPorts" in obj:
                temp += f"""---
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
 name: {body['name']}
 namespace: {body['namespace']}
"""

        # delete deployment & service
        cmd = f'cat << EOF | kubectl delete -f -\n{temp}\nEOF\n'
        st, res = subprocess.getstatusoutput(cmd)
        if st != 0:
            logger.error(res)
            msg['err'] = res

        # delete scheduleHint in db (integrity risk!!!) but, it's a etri's requirement.
        k = f"{body['namespace']}/{body['name']}"
        mydb.delete(db_path, k)

    except Exception as e:
        logger.error(str(e))
        msg['err'] = str(e)

    return jsonify(msg)


@service.route('/list', methods=['get'])
def list_():
    msg = {
        'err': None,
        'res': []
    }

    try:
        namespace = request.args.get('namespace')

        cmd = f'kubectl get services -n {namespace} -o json'
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


@service.route('/get', methods=['get'])
def get():
    msg = {
        'err': None,
        'res': None
    }

    try:
        name = request.args.get('name')
        namespace = request.args.get('namespace')

        k = f"{namespace}/{name}"
        v = mydb.get(db_path, k)
        if v is not None:
            msg['res'] = json.loads(v.decode())

        # # deployment
        # cmd = f'kubectl get deployment {name} -n {namespace} -o json'
        # st, res = subprocess.getstatusoutput(cmd)
        # if st != 0:
        #     logger.error(res)
        #     if msg['err'] is None:
        #         msg['err'] = {'k8s': {}}
        #     msg['err']['k8s']['deployment'] = res
        # else:
        #     msg['res']['k8s']['deployment'] = json.loads(res)
        #
        # service
        cmd = f'kubectl get services -l app={name} -n {namespace} -o json'
        st, res = subprocess.getstatusoutput(cmd)
        if st != 0:
            logger.error(res)
            msg['err'] = res
        else:
            obj = json.loads(res)
            if msg['res'] is None:
                msg['res'] = {}
            for item in obj['items']:
                msg['res']['ports'] = item['spec']['ports']
                msg['res']['clusterIP'] = item['spec']['clusterIP']

        # # serviceMonitor
        # cmd = f'kubectl get servicemonitor {name} -n {namespace} -o json'
        # st, res = subprocess.getstatusoutput(cmd)
        # if st != 0:
        #     logger.error(res)
        #     if msg['err'] is None:
        #         msg['err'] = {'k8s': {}}
        #     msg['err']['k8s']['serviceMonitor'] = res
        # else:
        #     obj = json.loads(res)
        #     for item in obj['items']:
        #         msg['res']['k8s']['serviceMonitor'] = item

    except Exception as e:
        logger.error(str(e))
        msg['err'] = str(e)

    return jsonify(msg)


@service.route('/status', methods=['get'])
def status():
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
            msg['res'] = obj['status']

    except Exception as e:
        logger.error(str(e))
        msg['err'] = str(e)

    return jsonify(msg)


# @service.route('/spec', methods=['get'])
# def info():
#     msg = {
#         'err': None,
#         'res': None
#     }
#
#     try:
#         name = request.args.get('name')
#         namespace = request.args.get('namespace')
#
#         # deployment
#         cmd = f'kubectl get svc {name} -n {namespace} -o json'
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
