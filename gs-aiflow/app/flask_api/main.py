import sys
import argparse
from gevent.pywsgi import WSGIServer

from flask_api.global_def import g_var
from flask_api.web_api import app


def main():
    if args.init_db:
        from flask_api import database
        print("Create Database tables")
        database.create_tables()
        sys.exit(0)

    print("Start Server")
    try:
        import subprocess as sp
        url = f"http:\/\/127.0.0.1:{args.port}"
        sp.call(['sed', '-i', '-e', f'2s/.*/REACT_APP_API=\"{url}\"/', '.env'], shell=False)


        http_server = WSGIServer(("0.0.0.0", args.port), app)
        http_server.serve_forever()
    except KeyboardInterrupt:
        print("End Server")
        sys.exit(0)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--init_db',action='store_true')
    parser.add_argument('-p', '--port', type=int, default=5500)

    #parser.add_argument('-t', '--debug', action='store_true')
    #parser.add_argument('-m', '--host')
    #parser.add_argument('--daemon', choices=['start', 'stop'])

    args = parser.parse_args()

    main()