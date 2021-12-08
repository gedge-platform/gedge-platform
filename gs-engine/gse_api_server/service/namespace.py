
import app_conf
from tools import common as c_tool
# set logger
logger = app_conf.Log.get_logger(__name__)

# hide reserved_ns from delete or list api.
reserved_ns = {'default', 'kube-node-lease', 'kube-public', 'kube-system', 'monitoring'}


def get_namespaces(details=False, cnt_from=None, cnt_to=None, search_name=None):
    def fnc(obj):
        result = {
            'namespaces': [
                item['metadata']['name']
                for item in obj['items']
                # if item['metadata']['name'] not in reserved_ns
            ]
        }
        if details:
            result["namespaces"] = [
                item
                for item in obj['items']
                # if item['metadata']['name'] not in reserved_ns
            ]
            if search_name:
                result["namespaces"] = [
                    namespace
                    for namespace in result["namespaces"]
                    if search_name in namespace['metadata']['name']
                ]
            if cnt_from is not None and cnt_to is not None:
                result["namespaces"] = result["namespaces"][cnt_from:cnt_to]
            elif cnt_from is not None:
                result["namespaces"] = result["namespaces"][cnt_from:]
            elif cnt_to is not None:
                result["namespaces"] = result["namespaces"][:cnt_to]

        return result

    cmd = f'kubectl get namespace'
    return c_tool.gen_msg(logger, cmd, fnc)


def delete_namespaces(namespace_name):
    if namespace_name not in reserved_ns:
        cmd = f"kubectl delete namespace {namespace_name}"
        result = c_tool.gen_msg(logger, cmd)
    else:
        result = {
            'error': {
                'code': 400,
                'message': f"reserved_ns: {namespace_name}"
            }
        }
    return result
