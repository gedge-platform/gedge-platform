import sys
from gevent.pywsgi import WSGIServer
from web_api import app


def main():
    print("Start Server")
    try:
        http_server = WSGIServer(listener=("0.0.0.0", 5500),
                                 application=app)
        http_server.serve_forever()
    except KeyboardInterrupt:
        print("End Server")
        sys.exit(0)
    print("End Server Process")


if __name__ == "__main__":
    main()