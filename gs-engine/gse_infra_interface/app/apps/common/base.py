"""[summary]
Base View Class for Entire System
Base Response Function for Entire System

"""
import json
import traceback
from flask import session, jsonify, make_response, request
from flask.views import MethodView
from flask_restx import Resource

from apps.common.exceptions import *
from apps.common.codes  import *
from apps.common.utils import *

class BaseRenderView(MethodView):
    """[summary]
    Base Web Render View, Custom MethodView
    
    Args:
        MethodView ([MethodView]): [Default Flask MethodView]
    """
    init_data = {}
    def __init__(self):
        if getattr(self, 'permission', None) is None or AccessPermission(self.permission) == AccessPermission.NO_AUTH:
            return 

        # user_name, user_role = self.session_check()

        # if AccessPermission(self.permission) == AccessPermission.AUTH_ALL:
        #     return
        # elif AccessPermission(self.permission) == AccessPermission.AUTH_ADMIN:
        #     if AccountRole(user_role) == AccountRole.ADMIN:
        #         return
        #     else:
        #         raise Error('No permission', 403)
        return
        
    def session_check(self):
        """[summary]
        Web Session Data Check Function

        Returns:
            [string]: [User ID Value, User Role Value from Session Data]
        """
        if not 'session_key' in session:
            raise SessionError('Session Failed')
        return session.get('user_name'), session.get('user_role')

    def render_error_params(self, e):
        """[summary]
        Get Web Render Error Params
        Args:
            e ([Error]): [Error Class]

        Returns:
            [json]: [Web Render Error Info in Json Type]
        """
        print(traceback.format_exc())
        if isinstance(e, Error):
            return { 'error_message': str(e), 'status_code': e.code, 'detail': e.fault }
        else:
            return { 'error_message': str(e), 'status_code': 500, 'detail': '' }

# class BaseManagerView(MethodView):
class BaseManagerView(Resource):
    """[summary]
    Base Manager View, Custom MethodView
    
    Args:
        MethodView ([MethodView]): [Default Flask MethodView]
    """
    def request_data(self):
        """_summary_
        Request Data Type Convert
        
        Returns:
            params: dict Type
        """
        params = {}
        if request.form :
            params = request.form.to_dict()
        else:
            params = request.json
        return params



def Response(data, status_code=200):
    """[summary]
    Define Web Render Response Function
    
    Args:
        data ([json or string]): [Response Data in Json Type or String Type]
        status_code (int, optional): [HTTP Status Code Value]. Defaults to 200.

    Returns:
        [json]: [Response Data in Json Type]
    """
    if isinstance(data, str):
        result_data = {}
        result_data['desc'] = data
    else:
        result_data = copy.deepcopy(data)
    return make_response(jsonify(result_data), status_code)