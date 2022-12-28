"""[summary]
Main Flask System APP Module
"""
from flask import Flask, redirect, url_for, session
from flask_cors import CORS, cross_origin
from flask_restx import Api

from apps.urls import add_urls_app
from apps.config import settings
from apps.common.base import Response
from apps.common.statics import *
from apps.common.exceptions import *
from apps.common.database import *
import logging.config
import urllib3
urllib3.disable_warnings()

flask_app = Flask(__name__)

CORS(flask_app)
flask_app.app_context().push()
flask_app.secret_key = settings.PLATFORM_SECRET_KEY
flask_app.url_map.strict_slashes = settings.USE_URL_SLASH_YN
flask_app.template_folder = settings.TEMPLATE_PATH
flask_app.static_folder = settings.STATIC_PATH

api = Api(
    flask_app,
    version='2.0',
    title="ETRI GSE API Interface",
    description="ETRI 통합 API 인터페이스 문서",
    #contact=""
)

# Initialize LOG
logging.config.dictConfig(settings.LOGGER_CONFIG)

# Register API URL
add_urls_app(flask_app)

# Web Interface Main
@flask_app.route('/web')
def index():
    """[summary]
    Check User Data from Session Data
    """
    # if 'user_name' in session:
    #     user_name = session.get('user_name')
    #     user_role = session.get('user_role')
    #     return redirect(url_for(WEB_MULTI_CLUSTER_LIST_VIEW))
    # return redirect(url_for(WEB_LOGIN_VIEW))
    return redirect(url_for(WEB_MULTI_CLUSTER_LIST_VIEW))


@flask_app.errorhandler(Error)
def error_handler(error):
    """[summary]
    Print Systemc Error and Response Error Message
    Args:
        error ([json]): [Error code, Error fault]

    Returns:
        [json]: [Error message, Error Code]
    """
    error_message = '[' + str(error.code) + ']' + str(error)
    if error.fault is not None:
        error_message += ': ' + str(error.fault)
    print(error_message)
    return Response(str(error), error.code)

if __name__ == '__main__':
    flask_app.run(host='0.0.0.0', port=80, debug=True)
