import json
import os

from werkzeug.exceptions import BadRequest, ServiceUnavailable
from flask import Flask, request
from flask_restful import Api, Resource
import logging

from agent.dqn import DQN

import requests
import time
#import redis

import torch

ENV_ADDRESS = os.environ.get('ENV_ADDRESS')
ENV_PORT = os.environ.get('ENV_PORT')
LOG_LEVEL = os.environ.get('LOG_LEVEL')

if not LOG_LEVEL:
    loglevel = logging.INFO

elif LOG_LEVEL.lower() in ('debug'):
    loglevel = logging.DEBUG

elif LOG_LEVEL.lower() in ('warning', 'warn'):
    loglevel = logging.WARNING

elif LOG_LEVEL.lower() in ('error', 'err'):
    loglevel = logging.ERROR

elif LOG_LEVEL.lower() in ('critical'):
    loglevel = logging.CRITICAL

else:
    loglevel = logging.INFO

logging.basicConfig(level=loglevel, format='%(asctime)s [%(name)s] (%(levelname)s) %(message)s')
urllib_logger = logging.getLogger('urllib3')
urllib_logger.setLevel(logging.WARNING)
werkzeug_logger = logging.getLogger('werkzeug')
werkzeug_logger.setLevel(logging.WARNING)

junho_logger = logging.getLogger('Junho')

env_url = 'http://' + ENV_ADDRESS + ':' + ENV_PORT
res = requests.get(env_url + '/state')

data = res.json()

task_attributes = ['req_edge', 'resources', 'deadline']
resource_attributes = ['cpu', 'memory', 'gpu']
len_state = len(data['edges']) + len(resource_attributes) + 1 \
    + (len(data['edges']) * len(resource_attributes))
num_action = len(data['edges'])

agent = DQN(len_state, num_action)

app = Flask(__name__)
api = Api(app)

task_prefix = 'task:'

MAX_EPISODES = 1000
NUM_STEPS = 60 * 60 * 24
LOG_FREQ = 1

task_counter = 0

done = False
step = 0
episode = 0


class Alive(Resource):
    def get(self):
        try:
            res = requests.get(env_url + '/alive')
            rescode = res.status_code
            if rescode == 200:
                ret = {
                    'alive': True,
                    'num_edges': num_action
                }

                return ret, 200
            
            else:
                ret = {
                    'alive': False
                }

                return ret, 400
                
        except requests.exceptions.ConnectionError:
            junho_logger.debug('[ENV] Dead')
            ret = {
                    'alive': False
            }

            return ret, 400



class AssignTask(Resource):
    def post(self):
        global task_counter, step, episode
        try:
            if step >= NUM_STEPS:
                agent.reset()
                step = 0


            data = request.get_json(force=True)

            if type(data) is not dict:
                raise BadRequest
            elif 'task' not in data.keys():
                raise BadRequest
            elif type(data['task']) is not dict:
                raise BadRequest
            elif not set(task_attributes).issubset(data['task'].keys()):
                raise BadRequest
            elif not set(resource_attributes).issubset(data['task']['resources'].keys()):
                raise BadRequest

            task = data['task']

            req_edge = task['req_edge']
            resources = task['resources']
            cpu = resources['cpu']
            memory = resources['memory']
            gpu = resources['gpu']
            deadline = task['deadline']

            task_id = task_counter
            task_counter += 1

            # TODO Allocate task to agent
            res = requests.get(env_url + '/state')
            if res.status_code != 200:
                raise SystemError("Env not response")
            data = res.json()

            edges = data['edges']

            # req_edge in one hot encoding
            state = [0] * len(edges)
            state[req_edge] = 1

            # task's resource requirements
            for r in resource_attributes:
                state.append(resources[r])
            
            state.append(deadline)

            # edge statements
            for edge in edges:
                for attr in resource_attributes:
                    state.append(edge[attr])

            junho_logger.debug('state: %s', state)
            
            action = agent.select_action(state).item()

            junho_logger.debug('action: %s', action)
            
            data = {'task': {'task_id': task_id,
                             'req_edge': req_edge,
                             'resources': {'cpu': cpu,
                                           'memory': memory,
                                           'gpu': gpu
                                           },
                             'deadline': deadline
                            }}
            data = json.dumps(data)
            res = requests.post(env_url + "/" + str(action) + "/task", data)

            if res.status_code == 503:
                raise ServiceUnavailable
            
            if res.status_code != 201:
                raise SystemError("env response: " + str(res.json()))
            
            # Calculate Reward
            if deadline <= 10:
                if req_edge == action:
                    reward = 10
                else:
                    reward = 1
            else:
                reward = 10

            # Memorize Transition
            #FIXME: check param format
            agent.memorize(state, action, next_state, reward)





            ret = {
                "task_id": task_id,
                "message": "Successfully created"
            }

            return ret, 201

        except BadRequest as e:
            junho_logger.error("Invalid task format")
            ret = {
                'errors': [
                    {
                        'message': 'Invalid task format'
                    }
                ]
            }

            return ret, e.code

        except ServiceUnavailable:
            ret = {
                'errors': [
                    {
                        'message': 'Edge Unavailable'
                    }
                ]
            }

            return ret, 503
        
        except Exception as e:
            junho_logger.error(e)
            ret = {
                'errors': [
                    {
                        'message': 'Internal Server Error'
                    }
                ]
            }

            return ret, 500


class DelTask(Resource):
    def delete(self, task_id):
        try:
            if r.delete(task_prefix + task_id):
                ret = {
                    "task_id": task_id,
                    "message": "Successfully deleted"
                }
                return ret, 200
            else:
                ret = {
                    'errors': [
                        {
                            'task_id': task_id,
                            'message': 'Task not found'
                        }
                    ]
                }
                return ret, 404

        except Exception as e:
            junho_logger.error(e)
            ret = {
                'errors': [
                    {
                        'message': 'Internal Server Error'
                    }
                ]
            }
            return ret, 500


api.add_resource(Alive, '/alive')
api.add_resource(AssignTask, '/task')
api.add_resource(DelTask, '/task/<task_id>')

if __name__ == '__main__':
    app.run()
