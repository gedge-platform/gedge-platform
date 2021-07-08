from kubernetes import client, config
from kubernetes.client.rest import ApiException

from flask import request, Response,session
from flask.views import MethodView
from apps.common import static_value
from apps.kube_init_manager.function import renew_acc_key, get_kube_network,get_topology_policy
import json

from apps.common import log_manager
class NodeInfoView(MethodView):
    def get(self):
        try:
            log_manager.debug(
                '\n-----Request-----\n'+
                'method : get node manager\n'+
                'desc : get node info\n'+
                '\n------------------'
            )
            v1 = client.CoreV1Api()
            response = v1.list_node()
            node_info = []
            for node in response.items:
                if node.metadata.name == 'etri-master':
                    continue

                field_selector='spec.nodeName='+node.metadata.name
                usg_rsrc = {
                    'cpu':0,
                    'mem':0,
                    'gpu':0,
                    'sriov':0
                }

                namespace_list = [static_value.NAMESPACE, 'kube-system', 'default']

                for namespace in namespace_list:
                    pod_list = v1.list_namespaced_pod(namespace=namespace,field_selector=field_selector)
                    for pod in pod_list.items:
                        rsrc = pod.spec.containers[0].resources.requests

                        if not rsrc:
                            continue
                        if rsrc.get('cpu') and rsrc['cpu'] != '0':
                            if rsrc['cpu'][-1] == 'm':
                                usg_rsrc['cpu'] += int(rsrc['cpu'][:-1])
                            else:
                                usg_rsrc['cpu'] += int(rsrc['cpu'])*1000

                        if rsrc.get('memory') and rsrc['memory'] != '0':
                            if rsrc['memory'][-2] == 'M':
                                usg_rsrc['mem'] += int(rsrc['memory'][:-2])*1024
                            else:
                                usg_rsrc['mem'] += int(rsrc['memory'][:-2])*1024*1024
                        usg_rsrc['gpu'] += int(rsrc.get('nvidia.com/gpu',0))
                        usg_rsrc['sriov'] += int(rsrc.get('intel.com/intel_sriov_netdevice',0))
                alctb_cpu = int(node.status.allocatable['cpu'][:-1]) if node.status.allocatable['cpu'][-1] == 'm' else int(node.status.allocatable['cpu'])*1000
                node_info.append({
                    'node':{
                        'node_nm':node.metadata.name,
                    },
                    'resource':{
                        'alctb_cpu' : int((alctb_cpu - usg_rsrc['cpu'])/1000),
                        'alctb_mem' : int((int(node.status.allocatable['memory'][:-2]) - usg_rsrc['mem'])/(1024*1024)),
                        'alctb_gpu' : int(node.status.allocatable.get('nvidia.com/gpu',0)) - usg_rsrc['gpu'],
                        'alctb_sriov' : int(node.status.allocatable.get('intel.com/intel_sriov_netdevice',0)) - usg_rsrc['sriov']
                    }
                })
            log_manager.debug(
                '\n-----Response-----\n'+
                'method : get node manager\n'+
                'desc : get node info\n'+
                '-----data-----\n'+
                str(node_info)+
                '\n------------------'
            )
            return Response(
                json.dumps(node_info, ensure_ascii=False).encode('utf-8'),
                status=200,
            )
        except ApiException as e:
            log_manager.debug(
                '-----ERROR-----\n'+
                'method : get node manager\n'+
                'desc : get node info\n'+
                str(e)+
                '\n------------------'
            )
            return str(e)
