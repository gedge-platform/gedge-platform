"""[summary]
Multi Cluster View Module
File defining methods for multicluster functions
"""
from flask import render_template, request, session, make_response
from apps.common.base import *
from apps.common.utils import *
from apps.common.statics import *
from apps.common.codes import *

from apps.manager.multi_cluster.function import *

class MultiClusterListView(BaseManagerView):
    """[summary]
    MultiCluster List Interface View
    
    Args:
        BaseManagerView ([MethodView]): [Custom MethodView]
    """
    def get(self):
        """
        GET functions for multi-cluster list are defined.
        
        Returns:
            [json]: [Result of GET request processing]
        """
        response_data = get_cluster_list()
        return Response(response_data, 200)

    def post(self):
        """
        POST functions for multi-cluster add are defined.
        
        Returns:
            [json]: [Result of POST request processing]
        """
        params = dict(request.form)
        response_data = add_cluster(params)
        return Response(response_data, 200)
    
    def delete(self):
        """
        DELETE functions for multi-clusters delete are defined.
        
        Returns:
            [json]: [Result of DELETE request processing]
        """
        response_data = delete_clusters()
        return Response(response_data, 200)

    

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
        
        Returns:
            [json]: [Result of DELETE request processing]
        """
        response_data = get_cluster_resource(cluster_name)
        return Response(response_data, 200)

    def delete(self, cluster_name=None):
        """
        DELETE functions for multi-cluster delete are defined.
        
        Args:
            cluster_name ([string], optional): [Cluster name to delete]. Defaults to None.
        
        Returns:
            [json]: [Result of DELETE request processing]
        """
        response_data = delete_cluster(cluster_name)
        return Response(response_data, 200)

