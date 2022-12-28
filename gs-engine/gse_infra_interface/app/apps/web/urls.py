"""[summary]
Web URI Module
Enter the domain required for the web request.
"""
from apps.common.statics import *
from apps.web.views import *

def add_url(app):
    """[summary]
    Add Web URI function

    Args:
        app ([Flask]): [Flask Class]
    """
    app.add_url_rule(
        RENDER_LOGIN,
        methods=['GET'],
        view_func=LoginRenderView.as_view(WEB_LOGIN_VIEW)
    )

    app.add_url_rule(
        RENDER_MULTI_CLUSTER_LIST,
        methods=['GET'],
        view_func=MultiClusterListRenderView.as_view(WEB_MULTI_CLUSTER_LIST_VIEW)
    )

    app.add_url_rule(
        RENDER_MULTI_CLUSTER_ADD,
        methods=['GET'],
        view_func=MultiClusterAddRenderView.as_view(WEB_MULTI_CLUSTER_ADD_VIEW)
    )
    
    app.add_url_rule(
        RENDER_MULTI_CLUSTER_DETAIL,
        methods=['GET'],
        view_func=MultiClusterDetailRenderView.as_view(WEB_MULTI_CLUSTER_DETAIL_VIEW)
    )

    app.add_url_rule(
        RENDER_MICRO_SERVICE_DETAIL,
        methods=['GET'],
        view_func=MicroServiceDetailRenderView.as_view(WEB_MICRO_SERVICE_DETAIL_VIEW)
    )

    app.add_url_rule(
        RENDER_MICRO_SERVICE_ADD,
        methods=['GET'],
        view_func=MicroServiceAddRenderView.as_view(WEB_MICRO_SERVICE_ADD_VIEW)
    )
    