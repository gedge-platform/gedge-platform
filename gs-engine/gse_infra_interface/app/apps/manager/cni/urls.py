"""
CNI URI Module
"""
from apps.common.statics import *
from apps.manager.cni.views import *

def add_url(app):
    """
    Add CNI URI function
    """
    app.add_url_rule(
        INTERFACE_CNI_LIST,
        methods=['GET', 'POST'],
        view_func=CNIView.as_view(MANAGER_CNI_VIEW)
    )
    app.add_url_rule(
        INTERFACE_CNI_LOOKUP,
        methods=['GET','DELETE'],
        view_func=CNILookupView.as_view(MANAGER_CNI_LOOKUP_VIEW)
    )
    