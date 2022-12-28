"""
Configmap URI Module
"""
from apps.common.statics import *
from apps.manager.configmap.views import *

def add_url(app):
    """
    Add Configmap URI function
    """
    app.add_url_rule(
        INTERFACE_CONFIGMAP_LIST,
        methods=['GET','POST'],
        view_func=ConfigMapView.as_view(MANAGER_CONFIGMAP_VIEW)
    )
    app.add_url_rule(
        INTERFACE_CONFIGMAP_LOOKUP,
        methods=['GET','DELETE'],
        view_func=ConfigMapLookupView.as_view(MANAGER_CONFIGMAP_LOOKUP_VIEW)
    )