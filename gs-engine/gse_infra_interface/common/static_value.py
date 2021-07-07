import os

KUBE_CONFIG_PATH = os.path.dirname(os.path.abspath(__file__))
NAMESPACE = 'gedge-default'
DEFAULT_SUBNET = '10.255.0.0/24'
DEFAULT_IMAGE = 'nginx'

LOG_FILE = '/var/log/operation_interface/server.log'