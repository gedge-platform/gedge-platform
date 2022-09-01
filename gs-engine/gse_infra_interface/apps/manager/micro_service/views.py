"""[summary]
Micro Service View Module
File defining methods for microservice functions
"""
from flask import render_template, request, session, make_response
from apps.common.base import *
from apps.common.utils import *
from apps.common.statics import *
from apps.common.codes import *

from apps.manager.micro_service.function import *


class MicroServiceListView(BaseManagerView):
    """[summary]
    MicroService List Interface View
    
    Args:
        BaseManagerView ([MethodView]): [Custom MethodView]
    """
    def get(self):
        """
        A GET function is defined for a Micro Service list lookup.
        
        Returns:
            [json]: [Result of GET request processing]
        """
        response_data = get_micro_service_list()
        return Response(response_data, 200)

    def post(self):
        """
        POST functions for Micro Service add are defined.
        
        Returns:
            [json]: [Result of POST request processing]
        """
        yaml_data = dict(request.form)
        response_data = add_micro_service(yaml_data)
        return Response(response_data, 200)
    

class MicroServiceLookupView(BaseManagerView):
    """[summary]
    MicroService Detail Interface View
    
    Args:
        BaseManagerView ([MethodView]): [Custom MethodView]
    """
    def get(self, cluster_name=None, ms_name=None):
        """[summary]
        Defining a GET method for querying microservice

        Args:
            cluster_name ([string], optional): [Cluster name to query]. Defaults to None.
            ms_name ([string], optional): [Micro Service name to query]. Defaults to None.

        Returns:
            [json]: [Result of GET request processing]
        """
        response_data = get_micro_service(cluster_name, ms_name)
        return Response(response_data, 200)

    def delete(self, cluster_name=None, ms_name=None):
        """[summary]
        Defining a DELETE method for deleting microservice
        
        Args:
            cluster_name ([string], optional): [Cluster name to delete]. Defaults to None.
            ms_name ([string], optional): [Micro Service name to delete]. Defaults to None.

        Returns:
            [json]: [Result of DELETE request processing]
        """
        response_data = delete_micro_service(cluster_name, ms_name)
        return Response(response_data, 200)

