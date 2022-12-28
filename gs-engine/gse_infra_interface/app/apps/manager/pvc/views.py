"""
PVC View Module
"""
from flask import render_template, request, session, make_response
from flask_restx import fields

from apps.common.base import *
from apps.common.utils import *
from apps.common.statics import *
from apps.common.codes import *

from main import api
from kubernetes.client.rest import ApiException

from apps.manager.pvc.function import *


pvcs_ns = api.namespace(INTERFACE_PVC_LIST[1:], description='스토리지 PVC API 목록')
strgs_ns = api.namespace(INTERFACE_STRGCLASS_LIST[1:], description='스토리지 클래스 API 목록')
cluster_ns = api.namespace(INTERFACE_MULTI_CLUSTER_LIST[1:-1], description='클러스터 API 목록')

@pvcs_ns.route('')
class PVCView(BaseManagerView):
    """
    PVC List Function
    """
    def get(self):
        """
        Get PVC List Function
        """
        try:
            response_data = get_pvc_list()
        except ApiException as e:
            print("PVC List Error : ", e.reason)
            return Response(e.reason, e.status)
        return Response(response_data, SUCCESS)
    
    @pvcs_ns.expect(api.model("PVC Create Json", {
        'cluster_name': fields.String(attribute='cluster_name', required=True),
        'strgclass_name': fields.String(required=True),
        'pvc_size': fields.Integer(required=True),
    }))
    def post(self):
        """
        PVC Create Function
        """
        pvc_data = self.request_data()
        try:
            response_data = create_pvc(pvc_data)
        except ApiException as e:
            print("Create PVC Error : ", e.reason)
            return Response(e.reason, e.status)
        except TypeError as e:
            print("Create PVC Type Error : ", str(e))
            return Response(str(e), FAIL)
        return Response(response_data, SUCCESS)

@cluster_ns.route('/<cluster_name>/pvc/<pvc_name>')
class PVCLookupView(BaseManagerView):
    """
    pvc function Lookup View
    """
    def get(self, cluster_name=None, pvc_name=None):
        """
        GET Functions for pvc Lookup View
        """
        try:
            response_data = get_pvc(cluster_name, pvc_name)
        except ApiException as e:
            print("PVC Get Error : ", e.reason)
            return Response(e.reason, e.status)
        return Response(response_data, SUCCESS)
    
    def delete(self, cluster_name=None, pvc_name=None):
        """
        Delete Functions for pvc Lookup View
        """
        try:
            response_data = delete_pvc(cluster_name, pvc_name)
        except ApiException as e:
            print("PVC Delete Error : ", e.reason)
            return Response(e.reason, e.status)
        return Response(response_data, SUCCESS)


@strgs_ns.route('')
class StrgClassView(BaseManagerView):
    """
    StorageClass View
    """
    def get(self):
        """
        StorageClass List Get Function
        """
        try:
            response_data = get_storage_class_list()
        except ApiException as e:
            print("strgclass List Error : ", e.reason)
            return Response(e.reason, e.status)
        return Response(response_data, SUCCESS)
    