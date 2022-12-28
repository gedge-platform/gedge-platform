"""[summary]
Web Render View Module
File defining methods for Web Render functions
"""
from flask import render_template, request, redirect, url_for, session
from werkzeug.exceptions import HTTPException
from apps.common.base import *
from apps.common.utils import *
from apps.common.statics import *
from apps.common.codes import *
from apps.common.database import *

from apps.manager.multi_cluster.function import *
from apps.manager.micro_service.function import *
from apps.manager.service.function import *
from apps.manager.pvc.function import *


class LoginRenderView(BaseRenderView):
    """[summary]
    Render Login Web View
 
    Args:
        BaseRenderView ([MethodView]): [Custom MethodView]
    """
    permission = AccessPermission.NO_AUTH
    def get(self):
        """[summary]
        Get Login Web HTML Code Data
        
        Returns:
            [html]: [Render HTML Code]
        """
        return render_template(LOGIN_TEMPLATE)
        

class MultiClusterListRenderView(BaseRenderView):
    """[summary]
    Render MultiCluster List Web View
 
    Args:
        BaseRenderView ([MethodView]): [Custom MethodView]
    """
    permission = AccessPermission.NO_AUTH
    def get(self):
        """[summary]
        Get MultiCluster List Web HTML Code Data
        
        Returns:
            [html]: [Render HTML Code]
        """
        self.params = {}
        try:
            self.params['cluster_list'] = get_cluster_list()
            self.params['current_view'] = WEB_MULTI_CLUSTER_LIST_VIEW
            return render_template(MULTI_CLUSTER_LIST_TEMPLATE, param=self.params)
        except HTTPException as e:
            self.params = self.render_error_params(e)
            return render_template(MULTI_CLUSTER_LIST_TEMPLATE, param=self.params)

class MultiClusterDetailRenderView(BaseRenderView):
    """[summary]
    Render MultiCluster Detail Web View
 
    Args:
        BaseRenderView ([MethodView]): [Custom MethodView]
    """
    permission = AccessPermission.NO_AUTH
    def get(self):
        """[summary]
        Get MultiCluster Detail Web HTML Code Data
        
        Returns:
            [html]: [Render HTML Code]
        """
        self.params = {}
        try:
            self.params['cluster_list'] = get_cluster_list()
            self.params['current_view'] = WEB_MULTI_CLUSTER_DETAIL_VIEW
            return render_template(MULTI_CLUSTER_DETAIL_TEMPLATE, param=self.params)
        except HTTPException as e:
            self.params = self.render_error_params(e)
            return render_template(MULTI_CLUSTER_DETAIL_TEMPLATE, param=self.params)

        
class MultiClusterAddRenderView(BaseRenderView):
    """[summary]
    Render MultiCluster Add Web View
 
    Args:
        BaseRenderView ([MethodView]): [Custom MethodView]
    """
    permission = AccessPermission.NO_AUTH
    def get(self):
        """[summary]
        Get MultiCluster Add Web HTML Code Data
        
        Returns:
            [html]: [Render HTML Code]
        """
        self.params = {}
        try:
            self.params['current_view'] = WEB_MULTI_CLUSTER_ADD_VIEW
            return render_template(MULTI_CLUSTER_ADD_TEMPLATE, param=self.params)
        except HTTPException as e:
            self.params = self.render_error_params(e)
            return render_template(MULTI_CLUSTER_ADD_TEMPLATE, param=self.params)

class MicroServiceDetailRenderView(BaseRenderView):
    """[summary]
    Render Micro Service Detail Web View
 
    Args:
        BaseRenderView ([MethodView]): [Custom MethodView]
    """

    permission = AccessPermission.NO_AUTH
    def get(self):
        """[summary]
        Get Micro Service Detail Web HTML Code Data
        
        Returns:
            [html]: [Render HTML Code]
        """
        self.params = {}
        try:
            self.params = get_micro_service_list()
            self.params.update(get_service_list())
            self.params['current_view'] = WEB_MICRO_SERVICE_DETAIL_VIEW
            return render_template(MICRO_SERVICE_DETAIL_TEMPLATE, param=self.params)
        except HTTPException as e:
            self.params = self.render_error_params(e)
            return render_template(MICRO_SERVICE_DETAIL_TEMPLATE, param=self.params)

class MicroServiceAddRenderView(BaseRenderView):
    """[summary]
    Render Micro Service Add Web View
 
    Args:
        BaseRenderView ([MethodView]): [Custom MethodView]
    """
    permission = AccessPermission.NO_AUTH
    def get(self):
        """[summary]
        Get Micro Service Add Web HTML Code Data
        
        Returns:
            [html]: [Render HTML Code]
        """
        self.params = {}
        try:
            self.params['current_view'] = WEB_MICRO_SERVICE_ADD_VIEW
            self.params['cluster_list'] = get_cluster_list()
            # self.params['yaml_data'] = get_user_yaml_data()
            return render_template(MICRO_SERVICE_ADD_TEMPLATE, param=self.params)
        except HTTPException as e:
            self.params = self.render_error_params(e)
            return render_template(MICRO_SERVICE_ADD_TEMPLATE, param=self.params)
