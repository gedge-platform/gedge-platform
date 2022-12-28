"""
Multi Cluster View Module
"""
from flask import render_template, request, session, make_response
from flask_restx import fields

from apps.common.base import *
from apps.common.utils import *
from apps.common.statics import *
from apps.common.codes import *

from main import api

from apps.manager.multi_cluster.function import *

clusters_ns = api.namespace(INTERFACE_MULTI_CLUSTER_LIST[1:], description='클러스터 리스트 API 목록')
cluster_ns = api.namespace(INTERFACE_MULTI_CLUSTER_LIST[1:-1], description='클러스터 API 목록')

@clusters_ns.route('')
class MultiClusterListView(BaseManagerView):
    """
    MultiCluster List Interface View
    """
    def get(self):
        """
        GET functions for multi-cluster list are defined.
        """
        response_data = get_cluster_list()
        return Response(response_data, 200)


    @clusters_ns.expect(api.model("Cluster Create Resource", {
        'clu_name': fields.String(default='', required=True),
        'master_yn': fields.Boolean(default=False),
        'clu_init_type': fields.String(required=True, default="add"),
        'clu_type': fields.String(required=False, default="k8s"),
        'clu_ip': fields.String(required=True),
        'clu_pwd': fields.String(required=False),
        'api_key': fields.String(required=False),
        'node_ips': fields.List(fields.String(default='', required=False)),
    }))
    def post(self):
        """
        POST functions for multi-cluster add are defined.
        """
        params = self.request_data()
        response_data = add_cluster(params)
        return Response(response_data, 200)
    
    def delete(self):
        """
        DELETE functions for multi-clusters delete are defined.
        """
        response_data = delete_clusters()
        return Response(response_data, 200)

    
@cluster_ns.route('/<cluster_name>')
class MultiClusterLookupView(BaseManagerView):
    """[summary]
    MultiCluster Detail Interface View
    
    Args:
        BaseManagerView ([MethodView]): [Custom MethodView]
    """
    def get(self, cluster_name=None):
        """
        GET functions for multi-cluster Detail are defined.
        
        Args:
            cluster_name ([string], optional): [Cluster name to query]. Defaults to None.
        """
        response_data = get_cluster_resource(cluster_name)
        return Response(response_data, 200)

    def delete(self, cluster_name=None):
        """
        DELETE functions for multi-cluster delete are defined.
        
        Args:
            cluster_name ([string], optional): [Cluster name to delete]. Defaults to None.
        """
        response_data = delete_cluster(cluster_name)
        return Response(response_data, 200)

