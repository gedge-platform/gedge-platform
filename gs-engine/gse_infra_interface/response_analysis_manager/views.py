from kubernetes import client, config
from kubernetes.client.rest import ApiException

from flask import request, Response
from flask.views import MethodView

from apps.common import static_value
from apps.common import log_manager
import json
class ResonseAnalysisManageView(MethodView):
    def get(self):
        try:
            log_manager.debug(
                '\n-----Request-----\n'+
                'method : get pod log manager\n'+
                'desc : get pod log info\n'+
                '\n-----Request data-----\n'+
                str(request.args)+
                '\n------------------'
            )
            v1 = client.CoreV1Api()
            pod_nm = request.args.get('pod_nm',None)
            response = v1.read_namespaced_pod_log(name=pod_nm, namespace=static_value.NAMESPACE)
            return Response(
                json.dumps(response, ensure_ascii=False).encode('utf-8'),
                status=200
            )
        except ApiException as e:
            log_manager.debug(
                '-----ERROR-----\n'+
                'method : get pod log manager\n'+
                'desc : get pod log info\n'+
                str(e)+
                '\n------------------'
            )
            log_manager.error(str(e))
            return str(e)