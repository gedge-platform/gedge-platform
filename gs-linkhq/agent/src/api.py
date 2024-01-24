import json
import os

from werkzeug.exceptions import BadRequest, ServiceUnavailable
from flask import Flask, request
from flask_restful import Api, Resource
import logging

from agent.dqn import DQN

import requests
import time

import torch
import csv

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
resource_attributes = ['cpu', 'memory', 'disk', 'gpu']
len_state = len(data['edges']) + len(resource_attributes) + 1 \
    + (len(data['edges']) * len(resource_attributes))
num_action = len(data['edges'])

agent = DQN(len_state, num_action)

app = Flask(__name__)
api = Api(app)

task_prefix = 'task:'

MAX_EPISODES = 2000
NUM_STEPS = 100
LOG_FREQ = 1

task_counter = 0

done = False
step = 1
episode = 1
state = None
next_state = None
ep_reward = 0
reward_history = []
drop_counter = 0
drop_history = []
late_counter = 0
late_history = []

train_num = 1

log_path = '/etc/logs'
weight_path = '/etc/weights'


def reset_params():
    global done, step, episode, state, next_state, ep_reward, reward_history, drop_counter, drop_history, late_counter, late_history, agent
    
    done = False
    step = 1
    episode = 1
    state = None
    next_state = None
    ep_reward = 0
    reward_history = []
    drop_counter = 0
    drop_history = []
    late_counter = 0
    late_history = []
    
    agent = DQN(len_state, num_action)

    with open(log_path + '/train'+str(train_num)+'.csv', 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['episode', 'reward', 'drop', 'late'])

reset_params()
        

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
        global task_counter, done, step, episode, state, next_state, ep_reward, reward_history, drop_counter, drop_history, late_counter, late_history, train_num
        try:
            junho_logger.debug("EP.%s-STEP.%s", episode, step)

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
            disk = resources['disk']
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
                                           'disk': disk,
                                           'gpu': gpu
                                           },
                             'deadline': deadline
                            }}
            data = json.dumps(data)
            res = requests.post(env_url + "/" + str(action) + "/task", data)

            if res.status_code == 503:
                reward = -10
                drop_counter += 1
                junho_logger.debug("Request Dropped.")
                #raise ServiceUnavailable
            
            
            elif res.status_code == 201:
                # Calculate Reward
                if deadline == 1:
                    if req_edge == action:
                        reward = 10
                    else:
                        reward = 1
                        late_counter += 1
                else:
                    reward = 10
            
            else:
                raise SystemError("env response: " + str(res.json()))
            
            
            ep_reward += reward

            # Memorize Transition
            next_state = state.copy()
            x = num_action
            
            next_state[0:x+5] = [0] * (x + 5)

            req_resource = state[x:x+4]
            tmp_state = []
            for i in zip(next_state[x+5+action*4:x+5+(action+1)*4], req_resource):
                after_assign = round(i[0] - i[1], 8)
                if after_assign <= 0:
                    after_assign = 0
                tmp_state.append(after_assign)
            next_state[x+5+action*4:x+5+(action+1)*4] = tmp_state

            junho_logger.debug("next_state: %s", next_state)

            junho_logger.debug("reward: %s", reward)

            agent.memorize(state, action, next_state, reward)

            if not agent.optimize_model():
                raise Exception("CANNOT UPDATE MODEL")

            step += 1

            if step > NUM_STEPS:
                reward_history.append(ep_reward)
                drop_history.append(drop_counter)
                late_history.append(late_counter)

                # junho_logger.critical("EP.%s Reward:%s", episode, ep_reward)

                junho_logger.info("TRAIN.%s, EP.%s, reward: %s, drop: %s, late: %s", train_num, episode, ep_reward, drop_counter, late_counter)
                junho_logger.info("Last State: %s", next_state[x+5:])
                junho_logger.debug("Reward History:%s", reward_history)
                junho_logger.debug("Drop History:%s\n", drop_history)
                junho_logger.debug("Late History:%s\n", late_history)

                with open(log_path + '/train'+str(train_num)+'.csv', 'a', newline='') as f:
                    writer = csv.writer(f)
                    writer.writerow([episode, ep_reward, drop_counter, late_counter])

                
                requests.get(env_url+'/reset')
                step = 1
                episode += 1
                next_state = None
                ep_reward = 0
                drop_counter = 0
                late_counter = 0
                if episode > MAX_EPISODES:
                    agent.save_weight(os.path.join(weight_path, 'gs-agent_dqn_'+str(train_num).zfill(4)+'.pt'))
                    train_num += 1
                    reset_params()

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
