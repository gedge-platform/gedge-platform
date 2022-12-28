from werkzeug.exceptions import BadRequest
from flask import Flask, request
from flask_restful import Api, Resource
import logging
import os
import json

from vedge import VGEdge

config_path = os.environ.get('CONFIG_PATH')
DEBUG = os.environ.get('DEBUG')
SILENT = os.environ.get('SILENT')

urllib_logger = logging.getLogger('urllib3')
urllib_logger.setLevel(logging.WARNING)
werkzeug_logger = logging.getLogger('werkzeug')
werkzeug_logger.setLevel(logging.WARNING)

if DEBUG == 'true':
    logging.basicConfig(level=logging.DEBUG, format='%(asctime)s [%(name)s] (%(levelname)s) %(message)s')
elif SILENT == 'true':
    logging.basicConfig(level=logging.WARNING, format='%(asctime)s [%(name)s] (%(levelname)s) %(message)s')
else:
    logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(name)s] (%(levelname)s) %(message)s')

junho_logger = logging.getLogger('Junho')

env = VGEdge(config_path)

app = Flask(__name__)
api = Api(app)


class State(Resource):
    def get(self):
        state = env.state()

        ret = {
            'edges': state
        }

        return json.dumps(ret, indent=4), 200


class Task(Resource):
    def post(self, edge_id):
        try:
            data = request.get_json(force=True)

            if type(data) is not dict:
                raise BadRequest
            elif 'task' not in data.keys():
                raise BadRequest
            elif type(data['task']) is not dict:
                raise BadRequest
            elif not {'id', 'size', 'cycle'}.issubset(data['task'].keys()):
                raise BadRequest

            task = data['task']
            task_id = task['id']
            size = task['size']
            cycle = task['cycle']

            edge_id = int(edge_id)
            env.edges[edge_id].assign((size, cycle))

            if type(task_id) is not int or type(size) is not int or type(cycle) is not int:
                raise BadRequest

            ret = {
                "id": task_id,
                "message": "Successfully created"
            }

            return json.dumps(ret, indent=4), 201

        except BadRequest:
            ret = {
                'errors': [
                    {
                        'message': 'Invalid task format'
                    }
                ]
            }

            return json.dumps(ret, indent=4), 400

        except Exception as e:
            junho_logger.error('[Task>Post] {}'.format(e))
            ret = {
                'errors': [
                    {
                        'message': 'Internal Server Error'
                    }
                ]
            }

            return json.dumps(ret, indent=4), 500


api.add_resource(Task, '/<edge_id>/task')
api.add_resource(State, '/state')

if __name__ == '__main__':
    app.run()
