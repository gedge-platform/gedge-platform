from gevent.pywsgi import WSGIServer
from web_api import app

if __name__ == "__main__":
    http_server=WSGIServer(("172.16.16.155",5500),app)
    # http_server=WSGIServer(("0.0.0.0",5000),app)
    http_server.serve_forever()