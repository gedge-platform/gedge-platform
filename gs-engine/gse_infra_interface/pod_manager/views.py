from kubernetes import client, config
from kubernetes.client.rest import ApiException

from flask import request, Response
from flask.views import MethodView

from .function import *

from apps.common import log_manager
from apps.common import static_value
import yaml

class PodManageView(MethodView):
    def get(self):
        try:
            log_manager.debug(
                '\n-----Request-----\n'+
                'method : get pod manager\n'+
                'desc : get pod info\n'+
                '\n-----Request data-----\n'+
                str(request.args)+
                '\n------------------'
            )
            v1 = client.CoreV1Api()
            pod_nm = request.args.get('pod_nm',None)
            if not pod_nm:
                response = v1.list_namespaced_pod(namespace=static_value.NAMESPACE)
                pod_list = []
                pod_info = {}
                for pod in response.items:
                    pod_list.append(pod.metadata.name)

                ret_data={
                    'pod_list':pod_list
                }
                log_manager.debug(
                    '\n-----Response-----\n'+
                    'method : get pod manager\n'+
                    'desc : get pod list\n'+
                    '-----data-----\n'+
                    str(ret_data)+
                    '\n------------------'
                )
                return Response(
                    json.dumps(ret_data, ensure_ascii=False).encode('utf-8'),
                    status=200
                )
            else:
                response = v1.read_namespaced_pod(namespace=static_value.NAMESPACE,name=pod_nm)
                pod_info = make_pod_info(response)
                log_manager.debug(
                    '\n-----Response-----\n'+
                    'method : get pod manager\n'+
                    'desc : get pod info\n'+
                    '-----data-----\n'+
                    str(pod_info)+
                    '\n------------------'
                )
                return Response(
                    json.dumps(pod_info, ensure_ascii=False).encode('utf-8'),
                    status=200
                )
        except ApiException as e:
            log_manager.debug(
                '-----ERROR-----\n'+
                'method : get pod manager\n'+
                'desc : get pod info\n'+
                str(e)+
                '\n------------------'
            )
            return str(e)
    def post(self):
        try:
            log_manager.debug(
                '\n-----Request-----\n'+
                'method : create pod manager\n'+
                'desc : create pod info\n'+
                '\n-----Request data-----\n'+
                str(request.get_json())+
                '\n------------------'
            )
            v1 = client.CoreV1Api()
            pod_json = make_pod_json(request.get_json())
            response = v1.create_namespaced_pod(namespace=static_value.NAMESPACE,body=pod_json)
            log_manager.debug(
                '\n-----Response-----\n'+
                'method : create pod manager\n'+
                'desc : create pod info\n'+
                '-----data-----\n'+
                'done'
                '\n------------------'
            )
            return Response(
                'done',
                status=200
            )
        except ApiException as e:
            log_manager.debug(
                '-----ERROR-----\n'+
                'method : create pod manager\n'+
                'desc : create pod info\n'+
                str(e)+
                '\n------------------'
            )
            return {
                'error':e.status,
                'reason':e.reason,
                'detail':e.body
            }
    def delete(self):
        try:
            log_manager.debug(
                '\n-----Request-----\n'+
                'method : delete pod manager\n'+
                'desc : delete pod info\n'+
                '\n-----Request data-----\n'+
                str(request.args)+
                '\n------------------'
            )
            v1 = client.CoreV1Api()
            pod_nm = request.args.get('pod_nm',None)
            if not pod_nm:
                response = v1.delete_collection_namespaced_pod(namespace=static_value.NAMESPACE)
            else:
                response = v1.delete_namespaced_pod(namespace=static_value.NAMESPACE,name=pod_nm)
            log_manager.debug(
                '\n-----Response-----\n'+
                'method : delete pod manager\n'+
                'desc : delete pod info\n'+
                'done'+
                '\n------------------'
            )
            return Response(
                'done',
                status=200
            )
        except ApiException as e:
            log_manager.debug(
                '-----ERROR-----\n'+
                'method : delete pod manager\n'+
                'desc : delete pod info\n'+
                str(e)+
                '\n------------------'
            )
            return str(e)
