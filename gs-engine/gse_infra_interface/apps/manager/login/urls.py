"""[summary]
Login URI Module
Enter the domain required for the login request.
"""
from apps.common.statics import *
from apps.manager.login.views import *

def add_url(app):
    """[Add Login URI function]

    Args:
        app ([Flask]): [Flask Class]
    """
    app.add_url_rule(
        INTERFACE_LOGIN,
        methods=['POST'],
        view_func=LoginView.as_view(MANAGER_LOGIN_VIEW)
    )
    app.add_url_rule(
        INTERFACE_LOGOUT,
        methods=['POST'],
        view_func=LogoutView.as_view(MANAGER_LOGOUT_VIEW)
    )
    