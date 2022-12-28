"""[summary]
Login View Module
File defining methods for login functions
"""
from flask import render_template, request, session, make_response
from flask_restx import fields

from apps.common.base import *
from apps.common.utils import *
from apps.common.statics import *
from apps.common.codes import *

from main import api

from apps.manager.login.function import *

login_ns = api.namespace(INTERFACE_LOGIN[1:], description='로그인 API 목록')
@login_ns.route('')
class LoginView(BaseManagerView):
    """[summary]
    Login function View
    
    Args:
        BaseManagerView ([MethodView]): [Custom MethodView]
    """
    
    @login_ns.expect(login_ns.model("Login Resource", {
        'user_name': fields.String,
        'user_passwd': fields.String,
    }))
    @login_ns.response(200, "Success", login_ns.model("Login Response", {
        'desc': fields.String,
        'user_name': fields.String
    }))
    def post(self):
        """[summary]
        POST Functions for Login Request
        """
        params = self.request_data()

        user_name = params.get('user_name')
        user_passwd = params.get('user_passwd')
            
        request_data = {}
        request_data['user_name'] = user_name
        request_data['user_passwd'] = user_passwd
        response_data = login_authenticate(request_data)
        return Response(response_data, 200)

logout_ns = api.namespace(INTERFACE_LOGOUT[1:], description='로그아웃 API 목록')
@logout_ns.route('')
class LogoutView(BaseManagerView):
    """[summary]
    Logout function View
    
    Args:
        BaseManagerView ([MethodView]): [Custom MethodView]
    """
    @logout_ns.response(200, "Success", api.model("Logout Response", {
        'desc': fields.String,
    }))
    def post(self):
        """[summary]
        POST Functions for Logout Request
        """
        params = self.request_data()
        response_data = logout()
        return Response(response_data, 200)