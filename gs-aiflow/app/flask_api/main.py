import os
import random
import sys
import argparse
from datetime import timedelta

import yaml
from flask_cors import CORS
from gevent.pywsgi import WSGIServer

import flask_api.setup
from flask_api.web_api import app
from common.logger import initialize_logger, get_logger
from flask_api.global_def import config
from flask_api import database


def main():
    get_logger().info("Database tables check")
    database.create_tables()

    # g_var.apiHost = args.api_host
    # g_var.apiId = args.api_id
    # g_var.apiPass = args.api_pass
    # g_var.apiJwt = "jwt"

    get_logger().info("Start Server")
    try:
        import subprocess as sp
        url = f"http:\/\/127.0.0.1:{args.port}"
        # sp.call(['sed', '-i', '-e', f'2s/.*/REACT_APP_API=\"{url}\"/', '.env'], shell=False)

        app.secret_key = 'softonnet'
        app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(minutes=30)  # 로그인 지속시간을 정합니다. 현재 30분
        CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)
        http_server = WSGIServer(("0.0.0.0", args.port), app)
        http_server.serve_forever()

    except KeyboardInterrupt:
        print("End Server")
        sys.exit(0)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--setup',action='store_true')
    parser.add_argument('-p', '--port', type=int, default=5500)
    # parser.add_argument('-ah' '--api-host', required=True)
    # parser.add_argument('-aid' '--api-id', required=True)
    # parser.add_argument('-aps' '--api-pass', required=True)
    parser.add_argument(
        '-c',
        '--config',
        type=str,
        default='./config.yaml',
        help='server config file path'
    )
    #parser.add_argument('-t', '--debug', action='store_true')
    #parser.add_argument('-m', '--host')
    #parser.add_argument('--daemon', choices=['start', 'stop'])

    args = parser.parse_args()

    conf_file = args.config
    if os.path.exists(conf_file):
        with open(conf_file, 'r', encoding='utf-8') as yamlfile:
            config.__dict__ = yaml.load(yamlfile, Loader=yaml.FullLoader)
        initialize_logger(config)

        if args.setup:
            flask_api.setup.setupToserver()
            sys.exit(0)

        get_logger().info("Start AIFLOW Server")
        main()
    else:
        print("Error: Not exist config file")
        sys.exit(1)
