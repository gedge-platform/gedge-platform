"""
Config URI Module
"""
from apps.common.statics import *
from apps.manager.config.views import *

def add_url(app):
    """
    Add Config URI function
    """
    app.add_url_rule(
        INTERFACE_CONFIG_NETWORK_LIST,
        methods=['GET'],
        view_func=ConfigNetworkView.as_view(MANAGER_CONFIG_NETWORK_VIEW)
    )
    app.add_url_rule(
        INTERFACE_CONFIG_INTERFACE_LIST,
        methods=['GET'],
        view_func=ConfigInterfaceView.as_view(MANAGER_CONFIG_INTERFACE_VIEW)
    )
    app.add_url_rule(
        INTERFACE_CONFIG_DISK_LIST,
        methods=['GET'],
        view_func=ConfigDiskView.as_view(MANAGER_CONFIG_DISK_VIEW)
    )
    app.add_url_rule(
        INTERFACE_CONFIG_INVENTORY,
        methods=['POST'],
        view_func=ConfigInventoryView.as_view(MANAGER_CONFIG_INVENTORY_VIEW)
    )
    app.add_url_rule(
        INTERFACE_CONFIG_INIT,
        methods=['POST'],
        view_func=ConfigInitView.as_view(MANAGER_CONFIG_INIT_VIEW)
    )