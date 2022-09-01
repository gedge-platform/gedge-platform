"""[summary]
Login View Module
File defining methods for login functions
"""
from flask import render_template, request, session, make_response
from apps.common.base import *
from apps.common.utils import *
from apps.common.statics import *
from apps.common.codes import *

from apps.manager.login.function import *

class LoginView(BaseManagerView):
    """[summary]
    Login function View
    
    Args:
        BaseManagerView ([MethodView]): [Custom MethodView]
    """
    def post(self):
        """[summary]
        POST Functions for Login Request
        Returns:
            [json]: [Result of POST request processing]
        """
        params = dict(request.form)
        user_id = params.get('user_id')
        password = params.get('password')
        request_data = {}
        request_data['user_id'] = user_id
        request_data['password'] = password
        response_data = login_authenticate(request_data)
        return Response(response_data, 200)

class LogoutView(BaseManagerView):
    """[summary]
    Logout function View
    
    Args:
        BaseManagerView ([MethodView]): [Custom MethodView]
    """
    def post(self):
        """[summary]
        POST Functions for Logout Request
        
        Returns:
            [json]: [Result of POST request processing]
        """
        params = dict(request.form)
        response_data = logout()
        return Response(response_data, 200)