import os
import threading
import requests
import json
import logging
import signal

from generator import Generator, Task

LAMBDA = float(os.environ.get('LAMBDA'))
SPEED = float(os.environ.get('SPEED'))
AGENT_ADDRESS = os.environ.get('AGENT_ADDRESS')
AGENT_PORT = os.environ.get('AGENT_PORT')
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


if '://' in AGENT_ADDRESS:
    agent_url = AGENT_ADDRESS
else:
    agent_url = 'http://' + AGENT_ADDRESS
if AGENT_PORT != '80':
    agent_url = agent_url + ':' + AGENT_PORT

num_edges = 0

junho_logger.info('Waiting for Agent Startup...')

while True:
    endpoint = agent_url + '/alive'
    try:
        res = requests.get(endpoint)
        if res.status_code == 200:
            junho_logger.debug('[AGENT] Alive')
            data = res.json()
            num_edges = int(data['num_edges'])

            break

    except requests.exceptions.ConnectionError:
        continue

junho_logger.info('[STARTING GENERATOR] NoE: %s, lambda: %s, server address: %s', num_edges, LAMBDA, agent_url)

gen = Generator(num_edges, LAMBDA)

assigned = {}

def request_assign_task(task: Task):
    endpoint = agent_url + '/task'
    data = {'task': {'req_edge': task.req_edge,
                     'resources': {'cpu': task.resources['cpu'],
                                   'memory': task.resources['memory'],
                                   'gpu': task.resources['gpu']
                                   },
                     'deadline': task.deadline}}
    data = json.dumps(data)
    junho_logger.debug('[Request] (Endpoint): %s \t(Data): %s', endpoint, data)

    try:
        res = requests.post(endpoint, data)
        if res.status_code == 201:
            data = res.json()
            junho_logger.debug('[POST:201] %s', data)
            task_id = data['task_id']
            # TODO: Store task and del task at ttl expired
        
        elif res.status_code == 503:
            data = res.json()
            junho_logger.debug('[POST:503] %s', data)

        else:
            junho_logger.error('[POST:%s] Endpoint: %s, Data: %s Res: %s', res.status_code, endpoint, data, res.content.decode())

    except requests.exceptions.RequestException:
        junho_logger.error('[POST] Connection Error. Check server status, address and port')
        os.kill(os.getpid(), signal.SIGINT)

def request_del_task(task_id):
    endpoint = agent_url + '/task/' + task_id

    junho_logger.debug('[DEL] task %s', task_id)

    try:
        res = requests.delete(endpoint, task_id)
        if res.status_code == 200:
            junho_logger.debug('[DEL] %s', res.content.decode())
        else:
            junho_logger.error('[DEL] Endpoint: %s, TaskID: %s, Res: %s', endpoint, task_id, res.content.decode())
    
    except requests.exceptions.RequestException:
        junho_logger.error('[DEL] Connection Error. Check server status, address and port')
        os.kill(os.getpid(), signal.SIGINT)


wait = False

def gen_task():
    threading.Timer(1/SPEED, gen_task).start()
    gen.step()

def get_task():
    global wait
    threading.Thread(target=get_task).start()
    if wait:
        return
    
    wait = True
    if not gen.q.empty():
        request_assign_task(gen.get())
    wait = False

def watch_task():
    threading.Thread(target=watch_task).start()


gen_task()
get_task()
watch_task()
