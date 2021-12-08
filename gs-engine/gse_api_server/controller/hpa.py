from flask import Blueprint, request, jsonify
import subprocess
import json
import yamale
import yaml
import app_conf
import logging.handlers

hpa = Blueprint('hpa', __name__)

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
type: str(required=True)
metric: str(required=True)
avg: int(required=True)
min: int(min=1, required=True)
max: int(min=1, required=True)
""")


@hpa.route('/create', methods=['post'])
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

        metric_type = ""
        if body['type'].lower() == "resource":
            metric_type = "Resource"
        elif body['type'].lower() == "custom":
            metric_type = "Pod"
        elif body['type'].lower() == "external":
            metric_type = "External"

        temp = f"""
apiVersion: autoscaling/v2beta2
kind: HorizontalPodAutoscaler
metadata:
  name: {body['name']}
  namespace: {body['namespace']}
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: {body['name']}
  minReplicas: {body['min']}
  maxReplicas: {body['max']}
  metrics:
  - type: {metric_type}
    resource:
      name: {body['metric']}
      target:
        type: Utilization
        averageUtilization: {body['avg']}
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


@hpa.route('/delete', methods=['delete'])
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
apiVersion: autoscaling/v2beta2
kind: HorizontalPodAutoscaler
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


@hpa.route('/list', methods=['get'])
def list():
    msg = {
        'err': None,
        'res': []
    }

    try:
        namespace = request.args.get('namespace', None)

        cmd = f'kubectl get hpa -n {namespace} -o json'
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


@hpa.route('/get', methods=['get'])
def get():
    msg = {
        'err': None,
        'res': None
    }

    try:
        name = request.args.get('name', None)
        namespace = request.args.get('namespace', None)

        cmd = f'kubectl get hpa {name} -n {namespace} -o json'
        st, res = subprocess.getstatusoutput(cmd)
        if st != 0:
            logger.error(res)
            msg['err'] = res
        else:
            obj = json.loads(res)

            # >>> to be updated
            cur_ = None
            # {'type': 'Pods', 'pods': {'metricName': 'my_requests_per_sec', 'targetAverageValue': '5'}}
            if 'autoscaling.alpha.kubernetes.io/metrics' in obj['metadata']['annotations']:
                temp = json.loads(obj['metadata']['annotations']['autoscaling.alpha.kubernetes.io/metrics'])
                for item in temp:
                    min_ = obj['spec']['minReplicas']
                    max_ = obj['spec']['maxReplicas']
                    if item['type'].lower() == 'resource':
                        metric_type = "resource"
                        avg_ = item['pods']['targetAverageUtilization']
                    elif item['type'].lower() == 'pods':
                        metric_type = "custom"
                        metric_name = item['pods']['metricName']
                        avg_ = item['pods']['targetAverageValue']
                    elif item['type'].lower() == 'external':
                        metric_type = "external"
                        metric_name = item['external']['metricName']
                        avg_ = item['external']['targetAverageValue']
                    break
                if 'autoscaling.alpha.kubernetes.io/current-metrics' in obj['metadata']['annotations']:
                    temp = json.loads(obj['metadata']['annotations']['autoscaling.alpha.kubernetes.io/current-metrics'])
                    for item in temp:
                        if item['type'].lower() == 'pods':
                            cur_ = item['pods']['currentAverageValue']
                        elif item['type'].lower() == 'external':
                            cur_ = item['external']['currentAverageValue']
                        break
            else:  # resource.cpu
                if 'currentCPUUtilizationPercentage' in obj['status']:
                    cur_ = obj['status']['currentCPUUtilizationPercentage']
                avg_ = obj['spec']['targetCPUUtilizationPercentage']
                min_ = obj['spec']['minReplicas']
                max_ = obj['spec']['maxReplicas']
                metric_type = "resource"
                metric_name = "cpu"

            msg['res'] = {
                "name": name,
                "namespace": namespace,
                "type": metric_type,
                "metric": metric_name,
                "avg": avg_,
                "min": min_,
                "max": max_,
                "cur": cur_,
                "replica_count": obj['status']['currentReplicas']
            }
            # <<< to be updated

    except Exception as e:
        logger.error(str(e))
        msg['err'] = str(e)

    return jsonify(msg)
