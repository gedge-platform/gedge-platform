"""
Micro Service URI Module
"""
from apps.common.statics import *
from apps.manager.micro_service.views import *

def add_url(app):
    """
    Add Micro Service URI function
    """
    app.add_url_rule(
        INTERFACE_MICRO_SERVICE_LIST,
        methods=['GET', 'POST'],
        view_func=MicroServiceListView.as_view(MANAGER_MICRO_SERVICE_LIST_VIEW)
    )
    app.add_url_rule(
        INTERFACE_MICRO_SERVICE_LOOKUP,
        methods=['GET', 'DELETE'],
        view_func=MicroServiceLookupView.as_view(MANAGER_MICRO_SERVICE_LOOKUP_VIEW)
    )
    