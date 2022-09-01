"""[summary]
Main Flask System APP Module
"""
from flask import Flask, redirect, url_for, session
from flask_cors import CORS, cross_origin

from apps.urls import add_urls_app
from apps.config import settings
from apps.common.base import Response
from apps.common.statics import *
from apps.common.exceptions import *
from apps.common.database import *
import logging.config
import urllib3

app = Flask(__name__)
CORS(app)
app.app_context().push()
app.secret_key = settings.PLATFORM_SECRET_KEY
app.url_map.strict_slashes = settings.USE_URL_SLASH_YN
app.template_folder = settings.TEMPLATE_PATH
app.static_folder = settings.STATIC_PATH

# Initialize LOG
logging.config.dictConfig(settings.LOGGER_CONFIG)

# Initialize DB
account_list = list(DB()[ACCOUNT_COLLECTION].find())

if not account_list and len(account_list) == 0:
    DB()[ACCOUNT_COLLECTION].insert_many(settings.ACCOUNTS)
# else:
#     for preset_account in settings.ACCOUNTS:
#         DB()[ACCOUNT_COLLECTION].update( { 'user_id' : preset_account.get('user_id') }, preset_account, upsert=True )

# Register URL
add_urls_app(app)


urllib3.disable_warnings()

@app.route('/')
def index():
    """[summary]
    Check User Data from Session Data
    
    Returns:
        [redirect]: [url Redirect]
    """
    if 'user_id' in session:
        user_id = session.get('user_id')
        user_role = session.get('user_role')
        return redirect(url_for(WEB_MULTI_CLUSTER_LIST_VIEW))
    return redirect(url_for(WEB_LOGIN_VIEW))

@app.errorhandler(SessionError)
def session_error_handler(error):
    """[summary]
    Redirect on session error function
    Args:
        error ([excetion]): [Session Error Exception Data]

    Returns:
        [redirect]: [Redirect address on Session Error]
    """
    return redirect(url_for(WEB_LOGIN_VIEW))

@app.errorhandler(Error)
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
    app.run(host='0.0.0.0', port=5001, debug=True)