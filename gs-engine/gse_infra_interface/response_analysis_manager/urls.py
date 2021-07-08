from .views import *
from apps.common import server_urls
def add_url(app):
    app.add_url_rule(
        server_urls.RESPONSE_ANALYSIS_MANAGER,
        methods=['GET'],
        view_func=ResonseAnalysisManageView.as_view('response_analysis_manager')
    )
