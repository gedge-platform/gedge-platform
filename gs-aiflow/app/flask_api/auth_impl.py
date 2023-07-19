from functools import wraps
from random import random

from flask import request, jsonify, session
from flask_api.monitoring_manager import get_db_connection
from flask_api.global_def import config
import hashlib

def login():
    if request.is_json is False:
        return jsonify(status='failed', msg='not json'), 400
    data = request.json
    if data is None:
        return jsonify(status='failed', msg='wrong data'), 400
    if type(data.get('ID')) != str:
        return jsonify(status='failed', msg='id is not str'), 400
    if type(data.get('PW')) != str:
        return jsonify(status='failed', msg='pw is not str'), 400

    id = data.get('ID')
    pw = data.get('PW')

    res = getUserRow(id, pw)
    if res is not None:
        session['user_id'] = id
        session['is_login'] = True
        session['is_admin'] = bool(res['is_admin'])
        session['workspace'] = res['workspace_name']
        session['user_name'] = res['user_name']
        session['user_uuid'] = res['user_uuid']

        data = {
            'userID' : id,
            'userName' : res['user_name'],
            'isAdmin' : bool(res['is_admin'])
        }
        return jsonify(status='success', data=data), 200
    else:
        return jsonify(status='failed', msg='id or pw is wrong'), 401

def needLogin():
    def _login_filter(func):
        @wraps(func)
        def _login_filter_(*args, **kargs):
            if session.get('is_login') is None:
                return jsonify(msg = 'login is expired'), 401
            if session.get('is_login') is not True:
                return jsonify(msg = 'login is expired'), 401
            return func(*args, **kargs)
        return _login_filter_
    return _login_filter

def maintainLogin():
    def _maintain(func):
        @wraps(func)
        def _maintain(*args, **kargs):
            session['is_login'] = True
            return func(*args, **kargs)
        return _maintain
    return _maintain

def forAdmin():
    def _login_filter(func):
        @wraps(func)
        def _login_filter_(*args, **kargs):
            if session.get('is_admin') is None:
                return jsonify(msg = 'login is expired'), 401
            if session.get('is_admin') is not True:
                return jsonify(msg = 'user is not admin'), 401
            return func(*args, **kargs)
        return _login_filter_
    return _login_filter


def salt(pw : str):
    return pw + config.salt

def encodeHash(pwAddedSalt : str):
    return hashlib.sha256(pwAddedSalt.encode()).hexdigest()

def getUserRow(id : str, pw : str):
    saltedPw = salt(pw)
    encodePw = encodeHash(saltedPw)

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(f'select * from TB_USER where login_id = "{id}" and login_pass = "{encodePw}"')
    rows = cursor.fetchall()

    if rows is None:
        return None

    if len(rows) == 1:
        return rows[0]

    return None


def logout():
    session.clear()
    return jsonify(status='success'), 200


def isLogin():
    isLogin = session.get('is_login')
    if isLogin is None:
        return jsonify(status="failed", msg='expire session'), 401
    if isLogin is False:
        return jsonify(status="failed", msg='expire session'), 401

    data = {
        'userID' : session.get('user_id'),
        'userName': session.get('user_name'),
        'isAdmin' : session.get('is_admin')
    }

    return jsonify(status="success", data=data), 200

#make password for jupyter notebook
def makePassNotebook(pw : str = ''):
    from notebook.auth import passwd
    return passwd(pw, 'sha256')