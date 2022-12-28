import os
import threading
import requests
import json
import logging
import signal

from generator import Generator, Task

LAMBDA = float(os.environ.get('LAMBDA'))
TIME = float(os.environ.get('TIME'))
AGENT_ADDRESS = os.environ.get('AGENT_ADDRESS')
AGENT_PORT = os.environ.get('AGENT_PORT')
DEBUG = os.environ.get('DEBUG')
SILENT = os.environ.get('SILENT')

urllib_logger = logging.getLogger('urllib3')
if DEBUG == 'true':
    logging.basicConfig(level=logging.DEBUG, format='%(asctime)s [%(name)s] (%(levelname)s) %(message)s')
    urllib_logger = logging.getLogger('urllib3')
    urllib_logger.setLevel(logging.WARNING)
    werkzeug_logger = logging.getLogger('werkzeug')
    werkzeug_logger.setLevel(logging.WARNING)
elif SILENT == 'true':
    logging.basicConfig(level=logging.WARNING, format='%(asctime)s [%(name)s] (%(levelname)s) %(message)s')
    urllib_logger.setLevel(logging.WARNING)
else:
    logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(name)s] (%(levelname)s) %(message)s')
    urllib_logger.setLevel(logging.INFO)


junho_logger = logging.getLogger('Junho')

if '://' in AGENT_ADDRESS:
    url = AGENT_ADDRESS + ':' + AGENT_PORT
else:
    url = 'http://' + AGENT_ADDRESS + ':' + AGENT_PORT

junho_logger.info('STARTING GENERATOR')
junho_logger.info('Server address: %s', url)
gen = Generator(LAMBDA)


def request(task: Task):
    data = {'task': {'size': task.size, 'cycle': task.cycle}}
    data = json.dumps(data)

    try:
        res = requests.post(url + "/task", data)
        junho_logger.debug('[Request] Response: %s', res.content.decode())
    except requests.exceptions.RequestException:
        junho_logger.error('[Request] Connection Error. Check server status, address and port')
        os.kill(os.getpid(), signal.SIGINT)


def gen_task():
    threading.Timer(TIME, gen_task).start()
    gen.step()


def get_task():
    threading.Thread(target=get_task).start()
    if not gen.empty():
        request(gen.get())


gen_task()
get_task()
