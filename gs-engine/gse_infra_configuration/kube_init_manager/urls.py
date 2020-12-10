from .views import *
from apps.common import server_urls
def add_url(app):
    app.add_url_rule(
        server_urls.KUBE_INIT_MANAGE,
        methods=['GET','POST'],
        view_func=KubeInitManageView.as_view('kube_init_manager')
    )
