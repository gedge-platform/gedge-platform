"""
Node Config View Module
"""
from flask import render_template, request, session, make_response
from flask_restx import fields

from apps.common.base import *
from apps.common.utils import *
from apps.common.statics import *
from apps.common.codes import *

from main import api

from apps.manager.config.function import *

cluster_ns = api.namespace(INTERFACE_MULTI_CLUSTER_LIST[1:-1], description="설정 API 목록")

@cluster_ns.route('/<cluster_name>/config/network')
class ConfigNetworkView(BaseManagerView):
    """
    Node Config Network View
    """
    def get(self, cluster_name=None):
        """
        Get Node Network Hardware Information
        """
        try:
            response_data = get_networks(cluster_name)
        except Exception as e:
            return Response(str(e), NOTFOUND)
        return Response(response_data, SUCCESS)

@cluster_ns.route('/<cluster_name>/config/interface')
class ConfigInterfaceView(BaseManagerView):
    """
    Node Config Network Interface View
    """
    def get(self, cluster_name=None):
        """
        Get Node Network Interface Name
        """
        try:
            response_data = get_interfaces(cluster_name)
        except Exception as e:
            return Response(str(e), NOTFOUND)
        return Response(response_data, SUCCESS)

@cluster_ns.route('/<cluster_name>/config/disks')
class ConfigDiskView(BaseManagerView):
    """
    Node Disk Information View
    """
    def get(self, cluster_name=None):
        """
        Get Node Disk Path and Size Information
        """
        try:
            response_data = get_disks(cluster_name)
        except Exception as e:
            return Response(str(e), NOTFOUND)
        return Response(response_data, SUCCESS)


@cluster_ns.route('/<cluster_name>/config/inventory')
class ConfigInventoryView(BaseManagerView):
    """
    Node Config, Kubespray Inventory View
    """
    def post(self, cluster_name=None):
        """
        Create Kubespray Inventory
        """
        try:
            response_data = generator_inventory(cluster_name)
        except Exception as e:
            return Response(str(e), NOTFOUND)
        return Response(response_data, SUCCESS)

@cluster_ns.route('/<cluster_name>/config/init')
class ConfigInitView(BaseManagerView):
    """
    Node Init Config View
    """
    def post(self, cluster_name=None):
        """
        Run Kubespray, Create Kubernetes Cluster
        """
        try:
            response_data = init_cluster(cluster_name)
        except Exception as e:
            return Response(str(e), EXIST)
        return Response(response_data, SUCCESS)