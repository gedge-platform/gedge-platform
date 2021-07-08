from .views import *
from apps.common import server_urls
def add_url(app):
    app.add_url_rule(
        server_urls.POD_MANAGE,
        methods=['GET','POST','DELETE'],
        view_func=PodManageView.as_view('pod_manage')
    )
