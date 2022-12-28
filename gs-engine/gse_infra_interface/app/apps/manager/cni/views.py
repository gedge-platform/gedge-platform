"""
CNI View Module
"""
from flask import render_template, request, session, make_response
from flask_restx import fields

from apps.common.base import *
from apps.common.utils import *
from apps.common.statics import *
from apps.common.codes import *

from main import api
from kubernetes.client.rest import ApiException

from apps.manager.cni.function import *


cnis_ns = api.namespace(INTERFACE_CNI_LIST[1:], description='네트워크 CNI API 목록')
cluster_ns = api.namespace(INTERFACE_MULTI_CLUSTER_LIST[1:-1], description='클러스터 API 목록')

@cnis_ns.route('')
class CNIView(BaseManagerView):
    """
    CNI View
    """
    def get(self):
        """
        Get Functions for CNI View
        """
        try:
            response_data = get_cni_list()
        except ApiException as e:
            print("CNI List Error : ", e.reason)
            return Response(e.reason, e.status)
        return Response(response_data, SUCCESS)
    
    @cnis_ns.expect(api.model("CNI Create Json", {
        'cluster_name': fields.String(attribute='cluster_name', required=True),
        'cni_type': fields.String(default='multus', required=True),
        'nic_subnet': fields.String(default='192.168.230.0/24', required=True),
        'cni_ipm_type': fields.String(default='host-local', required=True),
    }))
    def post(self):
        """
        Create Functions for CNI View
        """
        cni_data = self.request_data()
        try:
            response_data = create_cni(cni_data)
        except ApiException as e:
            print("Create CNI Error : ", e.reason)
            return Response(e.reason, e.status)
        except TypeError as e:
            print("Create CNI Type Error : ", str(e))
            return Response(str(e), FAIL)
        return Response(response_data, SUCCESS)

@cluster_ns.route('/<cluster_name>/cni/<cni_name>')
class CNILookupView(BaseManagerView):
    """
    CNI Lookup View
    """
    def get(self, cluster_name=None, cni_name=None):
        """
        GET Functions for CNI Lookup View
        """
        try:
            response_data = get_cni(cluster_name, cni_name)
        except ApiException as e:
            print("CNI Get Error : ", e.reason)
            return Response(e.reason, e.status)
        return Response(response_data, SUCCESS)
    
    def delete(self, cluster_name=None, cni_name=None):
        """
        Delete Functions for CNI Lookup View
        """
        try:
            response_data = delete_cni(cluster_name, cni_name)
        except ApiException as e:
            print("CNI Delete Error : ", e.reason)
            return Response(e.reason, e.status)
        return Response(response_data, SUCCESS)
