from .views import *
from apps.common import server_urls
def add_url(app):
    app.add_url_rule(
        server_urls.NIC_MANAGE,
        methods=['GET','POST','DELETE'],
        view_func=NicManageView.as_view('nic_manage')
    )
    app.add_url_rule(
        server_urls.CILIUM_PLCY_MANAGER,
        methods=['POST','DELETE'],
        view_func=CiliumPlcyManagerView.as_view('cilium_plcy_manager')
    )