"""[summary]
Multicluster URI Module
Enter the domain required for the multicluster request.
"""
from apps.common.statics import *
from apps.manager.multi_cluster.views import *

def add_url(app):
    """
    Add Multicluster URI function
    """
    app.add_url_rule(
        INTERFACE_MULTI_CLUSTER_LIST,
        methods=['GET', 'POST', 'DELETE'],
        view_func=MultiClusterListView.as_view(MANAGER_MULTI_CLUSTER_LIST_VIEW)
    )
    app.add_url_rule(
        INTERFACE_MULTI_CLUSTER_LOOKUP,
        methods=['GET', 'DELETE'],
        view_func=MultiClusterLookupView.as_view(MANAGER_MULTI_CLUSTER_LOOKUP_VIEW)
    )
    