import app_conf
from tools import common as c_tool

logger = app_conf.Log.get_logger(__name__)


def get_nodes(selectors=None, details=None, cnt_from=None, cnt_to=None, search_name=None):
    def fnc(obj):
        nodes = [
            item if details
            else item['metadata']['name']
            for item in obj['items']
            if search_name is None or search_name in item['metadata']['name']
        ]
        if cnt_from is not None and cnt_to is not None:
            nodes = nodes[cnt_from:cnt_to]
        elif cnt_from is not None:
            nodes = nodes[cnt_from:]
        elif cnt_to is not None:
            nodes = nodes[:cnt_to]
        return {
            'nodes': nodes
        }

    cmd = f'kubectl get node'
    if selectors:
        for k, v in enumerate(selectors):
            cmd += f' --selector={k}={v}'

    return c_tool.gen_msg(logger, cmd, fnc)


def get_node(node_name):
    def fnc(obj):
        return obj['status']

    cmd = f'kubectl get node {node_name}'

    return c_tool.gen_msg(logger, cmd, fnc)


def get_node_labels():
    def fnc(obj):
        return {
            'labels': [
                {
                    "name": item['metadata']['name'],
                    "labels": item['metadata']['labels']
                }
                for item in obj['items']
            ]
        }

    cmd = f'kubectl get node'

    return c_tool.gen_msg(logger, cmd, fnc)
