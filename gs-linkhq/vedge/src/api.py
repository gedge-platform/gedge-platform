from werkzeug.exceptions import BadRequest, ServiceUnavailable
from flask import Flask, request
from flask_restful import Api, Resource
import logging
import os

from vedge import VEdge
from resources import Task

CONFIG_PATH = os.environ.get('CONFIG_PATH')
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

task_attributes = ['task_id', 'req_edge', 'resources', 'deadline']
resource_attributes = ['cpu', 'memory', 'gpu']

env = VEdge(CONFIG_PATH)

app = Flask(__name__)
api = Api(app)


class Alive(Resource):
    def get(self):
        ret = {
            'Alive': True
        }

        return ret, 200


class Dims(Resource):
    def get(self):
        len_state = env.get_len_state()
        num_action = env.get_num_actions()

        ret = {
                'len_state': len_state,
                'num_action': num_action
        }
        
        return ret, 200


class GetState(Resource):
    def get(self):
        state = env.state()

        ret = {
            'edges': state
        }

        return ret, 200


class AssignTask(Resource):
    def post(self, edge_id):
        try:
            data = request.get_json(force=True)

            if type(data) is not dict:
                raise BadRequest
            elif 'task' not in data.keys():
                raise BadRequest
            elif type(data['task']) is not dict:
                raise BadRequest
            elif not set(task_attributes).issubset(data['task'].keys()):
                raise BadRequest
            elif not set(resource_attributes).issubset(data['task']['resources']):
                raise BadRequest

            task = data['task']
            
            task_id = task['task_id']
            req_edge = task['req_edge']
            resources = task['resources']
            cpu = resources['cpu']
            memory = resources['memory']
            gpu = resources['gpu']
            deadline = task['deadline']

            task = Task(task_id, req_edge, cpu, memory, gpu, deadline)

            edge_id = int(edge_id)

            if not env.edges[edge_id].assign(task):
                raise ServiceUnavailable

            ret = {
                "id": task_id,
                "message": "Successfully created"
            }

            return ret, 201

        except BadRequest:
            ret = {
                'errors': [
                    {
                        'message': 'Invalid task format'
                    }
                ]
            }

            return ret, 400
        
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
            junho_logger.error('[Assign] {}'.format(e))
            ret = {
                'errors': [
                    {
                        'message': 'Internal Server Error'
                    }
                ]
            }

            return ret, 500


api.add_resource(Alive, '/alive')
api.add_resource(Dims, '/dims')
api.add_resource(GetState, '/state')
api.add_resource(AssignTask, '/<edge_id>/task')

if __name__ == '__main__':
    app.run()
