"""[summary]
Micro Service URI Module
Enter the domain required for the Micro Service request.
"""
from apps.common.statics import *
from apps.manager.service.views import *

def add_url(app):
    """[Add Micro Service URI function]

    Args:
        app ([Flask]): [Flask Class]
    """
    app.add_url_rule(
        INTERFACE_SERVICE_LIST,
        methods=['GET', 'POST'],
        view_func=ServiceListView.as_view(MANAGER_SERVICE_VIEW)
    )
    app.add_url_rule(
        INTERFACE_SERVICE_LOOKUP,
        methods=['GET', 'DELETE'],
        view_func=ServiceLookupView.as_view(MANAGER_SERVICE_LOOKUP_VIEW)
    )
    