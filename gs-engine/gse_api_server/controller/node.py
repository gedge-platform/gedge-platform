from flask import Blueprint, request, jsonify
import app_conf

from service import node as node_service

node = Blueprint('node', __name__)

# set logger
logger = app_conf.Log.get_logger(__name__)


# kubectl label nodes master on-master=true #Create a label on the master node
# kubectl describe node master #Get more details regarding the master node

# kubectl get nodes --show-labels
# kubectl label nodes <your-node-name> disktype=ssd
#

# kubectl get node --selector=kubernetes.io/os=linux --selector=kubernetes.io/arch=amd64

@node.route('', methods=['get'])
def list_node():
    details = request.args.get('details') == 'true'
    cnt_from = request.args.get('from', None, int)
    cnt_to = request.args.get('to', None, int)
    search_name = request.args.get('name', None, str)
    selectors = request.args.get('selectors', None, str)
    result = node_service.get_nodes(selectors, details, cnt_from, cnt_to, search_name)
    return jsonify(result)


@node.route('/<node_name>', methods=['get'])
def get_node(node_name):
    result = node_service.get_node(node_name)
    return jsonify(result)


@node.route('/labels', methods=['get'])
def get_node_labels():
    result = node_service.get_node_labels()
    return jsonify(result)
