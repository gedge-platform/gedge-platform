from flask import Blueprint, request, jsonify
import subprocess
import json
import yamale
import yaml
import app_conf
import logging.handlers
import mydb

node = Blueprint('node', __name__)

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


# kubectl label nodes master on-master=true #Create a label on the master node
# kubectl describe node master #Get more details regarding the master node

# kubectl get nodes --show-labels
# kubectl label nodes <your-node-name> disktype=ssd
#

# kubectl get node --selector=kubernetes.io/os=linux --selector=kubernetes.io/arch=amd64

@node.route('/list', methods=['get'])
def list_():
    msg = {
        'err': None,
        'res': []
    }

    try:
        temp = ""
        for k, v in request.args.items():
            temp += f' --selector={k}={v}'

        cmd = f'kubectl get node {temp} -o json'
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


@node.route('/get', methods=['get'])
def get():
    msg = {
        'err': None,
        'res': None
    }

    try:
        name = request.args.get('name')
        cmd = f'kubectl get node {name} -o json'
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


@node.route('/labels', methods=['get'])
def lables():
    msg = {
        'err': None,
        'res': []
    }

    try:
        cmd = f'kubectl get node -o json'
        st, res = subprocess.getstatusoutput(cmd)
        if st != 0:
            logger.error(res)
            msg['err'] = res
        else:
            obj = json.loads(res)
            for item in obj['items']:
                temp = {
                    "name": item['metadata']['name'],
                    "labels": item['metadata']['labels']
                }
                msg['res'].append(temp)

    except Exception as e:
        logger.error(str(e))
        msg['err'] = str(e)

    return jsonify(msg)
