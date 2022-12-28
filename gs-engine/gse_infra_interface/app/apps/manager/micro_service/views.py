"""[summary]
Micro Service View Module
File defining methods for microservice functions
"""
from flask import render_template, request, session, make_response
from flask_restx import fields

from apps.common.base import *
from apps.common.utils import *
from apps.common.statics import *
from apps.common.codes import *

from main import api

from apps.manager.micro_service.function import *

mss_ns = api.namespace(INTERFACE_MICRO_SERVICE_LIST[1:], description='마이크로 서비스 리스트 API 목록')
cluster_ns = api.namespace(INTERFACE_MULTI_CLUSTER_LIST[1:-1], description='클러스터 API 목록')

@mss_ns.route('')
class MicroServiceListView(BaseManagerView):
    """
    MicroService List Interface View
    """
    def get(self):
        """
        Get Micro Service List
        """
        response_data = get_micro_service_list()
        return Response(response_data, 200)

    @mss_ns.expect(api.model("Micro Service Create Json", {
        'cluster_name': fields.String(attribute='cluster_name', required=True),
        'name': fields.String(default='', required=True),
        'pod_image': fields.String(default='', required=True),
        'pod_command': fields.String(default='', required=False),
        'pod_args': fields.String(default='', required=False),
        'cpu_limit': fields.String(default='', required=False),
        'cpu_request': fields.String(default='', required=False),
        'mem_limit': fields.String(default='', required=False),
        'mem_request': fields.String(default='', required=False),
        'service_type': fields.String(default='ClusterIP', required=False),
        'service_ports': fields.List(fields.Nested(api.model("service Port Reqeust", {
            'protocol': fields.String(default='TCP', required=True),
            'externalPort': fields.Integer(required=True),
            'containerPort': fields.Integer(required=True)
        })), required=False),
        'cni_list': fields.List(fields.Nested(api.model("CNI List Reqeust", {
            'name': fields.String(default='', required=True),
            'type': fields.String(default='', required=False),
        })), required=False),
        'pvc_name': fields.String(default='', required=False),
        'pod_mountpath': fields.String(default='', required=False),
    }))
    def post(self):
        """
        Create Micro Service
        """
        pod_data = self.request_data()
        response_data = add_micro_service(pod_data)
        return Response(response_data, 200)
    
@cluster_ns.route('/<cluster_name>/ms/<ms_name>')
class MicroServiceLookupView(BaseManagerView):
    """
    MicroService Detail Interface View
    """
    
    def get(self, cluster_name=None, ms_name=None):
        """
        Defining a GET method for querying microservice
        """
        response_data = get_micro_service(cluster_name, ms_name)
        return Response(response_data, 200)

    def delete(self, cluster_name=None, ms_name=None):
        """
        Defining a DELETE method for deleting microservice
        """
        response_data = delete_micro_service(cluster_name, ms_name)
        return Response(response_data, 200)

