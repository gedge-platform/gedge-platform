from flask import Flask
from werkzeug.exceptions import HTTPException

from controller.service import service
from controller.service_mesh import service_mesh
from controller.service_schedulehint import service_schedulehint
from controller.hpa import hpa
from controller.template import template
from controller.vpa import vpa
from controller.limitrange import limitrange
from controller.imageinfo import imageinfo
from controller.node import node
from controller.namespace import namespace
from controller.utility import utility
# from tools.job import service_ip_collector
# from tools.scheduler import Scheduler

# sched = Scheduler()
# sched.add_schdule(service_ip_collector, 'interval', job_id='service_ip_collector', seconds=5, args=(1, ))
app = Flask(__name__, static_url_path='/static')

app.register_blueprint(namespace, url_prefix='/gse/namespaces')
app.register_blueprint(node, url_prefix='/gse/nodes')
app.register_blueprint(service, url_prefix='/gse/services')
app.register_blueprint(template, url_prefix='/gse/templates')
app.register_blueprint(service_mesh, url_prefix='/gse/service-mesh')
app.register_blueprint(utility, url_prefix='/gse/utility')
app.register_blueprint(limitrange, url_prefix='/gse/limitrange')
app.register_blueprint(imageinfo, url_prefix='/gse/imageinfo')
app.register_blueprint(hpa, url_prefix='/gse/hpa')
app.register_blueprint(vpa, url_prefix='/gse/vpa')
app.register_blueprint(service_schedulehint, url_prefix='/gse/service/schedulehint')


@app.errorhandler(404)
def resource_not_found(error):
    msg = {
        "error": {
            'code': 404,
            'name': error.name,
            'message': "resource not found"
        }
    }
    if error.description != "":
        msg["error"]["message"] = error.description
    return msg, 404


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8887)


@app.errorhandler(HTTPException)
def resource_not_found(error):
    msg = {
        "error": {
            'code': error.code,
            'name': error.name,
            'message': error.description
        }
    }
    return msg, error.code


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8887)

'''      
apt-get install python3-pymysql
apt-get install python3-pandas
실행방법
gunicorn app:app --bind=0.0.0.0:8888 --daemon --reload
--daemon: 데몬 프로세스로 실행
--reload: 소스 변경시 재구동
'''
