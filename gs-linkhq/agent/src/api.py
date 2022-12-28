import json
import os

from werkzeug.exceptions import BadRequest
from flask import Flask, request
from flask_restful import Api, Resource
import logging

from agent import DQNAgent

import requests
import time
import redis

import torch

ENV_ADDRESS = os.environ.get('ENV_ADDRESS')
ENV_PORT = os.environ.get('ENV_PORT')
DEBUG = os.environ.get('DEBUG')
SILENT = os.environ.get('SILENT')

if DEBUG == 'true':
    logging.basicConfig(level=logging.DEBUG, format='%(asctime)s [%(name)s] (%(levelname)s) %(message)s')
    urllib_logger = logging.getLogger('urllib3')
    urllib_logger.setLevel(logging.WARNING)
    werkzeug_logger = logging.getLogger('werkzeug')
    werkzeug_logger.setLevel(logging.WARNING)
elif SILENT == 'true':
    logging.basicConfig(level=logging.WARNING, format='%(asctime)s [%(name)s] (%(levelname)s) %(message)s')
    urllib_logger = logging.getLogger('urllib3')
    urllib_logger.setLevel(logging.WARNING)
    werkzeug_logger = logging.getLogger('werkzeug')
    werkzeug_logger.setLevel(logging.WARNING)
else:
    logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(name)s] (%(levelname)s) %(message)s')
    urllib_logger = logging.getLogger('urllib3')
    urllib_logger.setLevel(logging.WARNING)
    werkzeug_logger = logging.getLogger('werkzeug')
    werkzeug_logger.setLevel(logging.WARNING)

junho_logger = logging.getLogger('Junho')

r = redis.Redis(host='task-db')

env_url = 'http://' + ENV_ADDRESS + ':' + ENV_PORT
res = requests.get(env_url + '/state')

data = json.loads(res.json())

len_state = len(data['edges'])
num_action = len(data['edges'])

agent = DQNAgent(len_state, num_action)

app = Flask(__name__)
api = Api(app)

task_prefix = 'task:'

NUM_EPISODES = 1000  # 최대 에피소드 수
NUM_STEPS = 1000
done = False


class Task(Resource):
    def post(self):
        try:
            data = request.get_json(force=True)

            if type(data) is not dict:
                raise BadRequest
            elif 'task' not in data.keys():
                raise BadRequest
            elif type(data['task']) is not dict:
                raise BadRequest
            elif not {'size', 'cycle'}.issubset(data['task'].keys()):
                raise BadRequest

            task = data['task']
            size = task['size']
            cycle = task['cycle']

            if type(size) is not int or type(cycle) is not int:
                raise BadRequest

            task_id = r.incr('task-index')

            r.hset(task_prefix + str(task_id), 'size', size)
            r.hset(task_prefix + str(task_id), 'cycle', cycle)
            r.hset(task_prefix + str(task_id), 'time', time.time())

            # TODO Allocate task to agent
            res = requests.get(env_url + '/state')
            data = json.loads(res.json())

            state = []
            for edge in data['edges']:
                state.append(len(edge['queue']))
            junho_logger.error('STATE: {}'.format(state))
            state = torch.unsqueeze(torch.FloatTensor(state), 0)
            junho_logger.error('unsq: {}'.format(state))

            action = agent.get_action(state).item()

            data = {'task': {'id': task_id, 'size': size, 'cycle': cycle}}
            data = json.dumps(data)
            res = requests.post(env_url + "/" + str(action) + "/" + "/task", data)

            if res.status_code != 201:
                raise SystemError("env response: " + str(res.json()))

            ret = {
                "id": task_id,
                "message": "Successfully created"
            }

            return json.dumps(ret, indent=4), 201

        except BadRequest:
            junho_logger.error("Invalid task format")
            ret = {
                'errors': [
                    {
                        'message': 'Invalid task format'
                    }
                ]
            }

            return json.dumps(ret, indent=4), 400

        except Exception as e:
            junho_logger.error(e)
            ret = {
                'errors': [
                    {
                        'message': 'Internal Server Error'
                    }
                ]
            }

            return json.dumps(ret, indent=4), 500


class DelTask(Resource):
    def delete(self, task_id):
        try:
            if r.delete(task_prefix + task_id):
                ret = {
                    "id": task_id,
                    "message": "Successfully deleted"
                }
                return json.dumps(ret), 200
            else:
                ret = {
                    'errors': [
                        {
                            'id': task_id,
                            'message': 'Task not found'
                        }
                    ]
                }
                return json.dumps(ret), 404

        except Exception as e:
            junho_logger.error(e)
            ret = {
                'errors': [
                    {
                        'message': 'Internal Server Error'
                    }
                ]
            }
            return json.dumps(ret), 500


api.add_resource(Task, '/task')
api.add_resource(DelTask, '/task/<task_id>')

if __name__ == '__main__':
    app.run()
