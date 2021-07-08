from .views import *
from apps.common import server_urls
def add_url(app):
    app.add_url_rule(
        server_urls.NODE_INFO,
        methods=['GET'],
        view_func=NodeInfoView.as_view('node_info')
    )
