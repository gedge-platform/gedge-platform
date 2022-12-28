"""
Configmap View Module
"""
from flask import render_template, request, session, make_response
from flask_restx import fields

from apps.common.base import *
from apps.common.utils import *
from apps.common.statics import *
from apps.common.codes import *

from main import api

from apps.manager.configmap.function import *

cluster_ns = api.namespace(INTERFACE_MULTI_CLUSTER_LIST[1:-1], description="클러스터 API 목록")
configmap_ns = api.namespace(INTERFACE_CONFIGMAP_LIST[1:], description="ConfigMap API 목록")

@configmap_ns.route('')
class ConfigMapView(BaseManagerView):
    def get(self):
        """
        Get View for ConfigMap List
        """
        try:
            response_data = get_configmaps_list()
        except Exception as e:
            return Response(str(e), NOTFOUND)
        return Response(response_data, SUCCESS)

    @configmap_ns.expect(api.model("ConfigMap Create Resource", {
        'cluster_name': fields.String(default='', required=True),
        'name': fields.String(default='', required=True),
        'data': fields.Nested(api.model("SR-IOV Data Resource", {
            "type": fields.String(default='', required=True),
            "prefix": fields.String(default='', required=False),
        }, required=True))
    }))
    def post(self):
        """
        Create Kubernetes ConfigMap
        """
        body = self.request_data()
        try:
            response_data = create_configmap(body)
        except Exception as e:
            return Response(str(e), FAIL)
        return Response(response_data, 200)
    

@cluster_ns.route('/<cluster_name>/configmap/<configmap_name>')
class ConfigMapLookupView(BaseManagerView):
    def get(self, cluster_name=None, configmap_name=None):
        """
        Get Kubernetes ConfigMap
        """
        try:
            response_data = get_configmap(cluster_name, configmap_name)
        except Exception as e:
            return Response(str(e), NOTFOUND)
        return Response(response_data, SUCCESS)
    def delete(self, cluster_name=None, configmap_name=None):
        """
        Delete Kubernetes ConfigMap
        """
        try:
            response_data = delete_configmap(cluster_name, configmap_name)
        except Exception as e:
            return Response(str(e), FAIL)
        return Response(response_data, SUCCESS)