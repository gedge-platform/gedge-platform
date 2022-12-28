"""
PVC URI Module
"""
from apps.common.statics import *
from apps.manager.pvc.views import *

def add_url(app):
    """
    Add PVC URI function
    """
    app.add_url_rule(
        INTERFACE_PVC_LIST,
        methods=['GET', 'POST'],
        view_func=PVCView.as_view(MANAGER_PVC_VIEW)
    )
    app.add_url_rule(
        INTERFACE_PVC_LOOKUP,
        methods=['GET','DELETE'],
        view_func=PVCLookupView.as_view(MANAGER_PVC_LOOKUP_VIEW)
    )
    app.add_url_rule(
        INTERFACE_STRGCLASS_LIST,
        methods=['GET','POST'],
        view_func=PVCLookupView.as_view(MANAGER_STRGCLASS_VIEW)
    )
    