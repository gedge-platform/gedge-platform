"""[summary]
Modules with Defined for Login Function
"""
from flask import session
from apps.common.base import *
from apps.common.utils import *
from apps.common.statics import *
from apps.common.codes import *
from apps.control.dao.account import *


def login_authenticate(request_data):
    """[summary]
    Login authentication function using request data
    
    Args:
        request_data ([json]): [Data to try to log in]

    Returns:
        [json]: [Result value for login attempt]
    """
    user_id = request_data.get('user_id')
    password = request_data.get('password')

    user = Account.get(user_id=user_id)
    if not user:
        raise Error('로그인 실패. 등록되지 않은 계정입니다.', 401)

    if user.password == password:
        session['session_key'] = str(user.id)
        session['user_id'] = user.user_id
        session['user_role'] = user.user_role
        response_data = {}
        response_data['user_id'] = user.user_id
        response_data['user_role'] = user.user_role
        response_data['desc'] = "로그인 성공"
        return response_data
    else:
        raise Error('로그인 실패. 비밀번호를 확인해주세요.', 401)

def logout():
    """[summary]
    Logout Function, Clear Session Data Function

    Returns:
        [json]: [Result value for Logout]
    """
    session.clear()
    response_data = {}
    response_data['desc'] = '로그아웃 성공'
    return response_data
