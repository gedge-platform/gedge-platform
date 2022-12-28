"""
Service View Module File
"""
from flask import render_template, request, session, make_response
from flask_restx import fields

from apps.common.base import *
from apps.common.utils import *
from apps.common.statics import *
from apps.common.codes import *

from main import api

from apps.manager.service.function import *

service_ns = api.namespace(INTERFACE_SERVICE_LIST[1:], description='서비스 API 목록')
cluster_ns = api.namespace(INTERFACE_MULTI_CLUSTER_LIST[1:-1], description='클러스터 API 목록')

@service_ns.route('')
class ServiceListView(BaseManagerView):
    """
    Service List Interface View
    """
    def get(self):
        """
        Service List GET Function
        """
        response_data = get_service_list()
        return Response(response_data, 200)
    
    @service_ns.expect(api.model("Service Create Json", {
        'cluster_name': fields.String(default='', required=True),
        'name': fields.String(default='', required=True),
        'service_type': fields.String(default='ClusterIP', required=True),
        'service_ports': fields.List(fields.Nested(api.model("service Port Reqeust", {
            'protocol': fields.String(default='TCP', required=True),
            'externalPort': fields.Integer(required=True),
            'containerPort': fields.Integer(required=True)
        })))
    }))
    def post(self):
        """
        Service List POST Function
        """
        request_data = self.request_data()
        response_data = add_service(request_data)
        return Response(response_data, 200)
    
@cluster_ns.route('/<cluster_name>/service/<service_name>')
class ServiceLookupView(BaseManagerView):
    """
    Service Detail Interface View
    """
    
    def get(self, cluster_name=None, service_name=None):
        """
        Service Detail GET Function
        """
        response_data = get_service(cluster_name, service_name)
        return Response(response_data, 200)

    def delete(self, cluster_name=None, service_name=None):
        """
        Service Detail GET Function
        """
        response_data = delete_service(cluster_name, service_name)
        return Response(response_data, 200)

