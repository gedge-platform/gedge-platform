from flask import Flask
from service import service
from service_label import service_label
from service_nodeselector import service_nodeselector
from service_schedulehint import service_schedulehint
from hpa import hpa
from vpa import vpa
from limitrange import limitrange
from serviceinfo import serviceinfo
from imageinfo import imageinfo
from node import node
from namespace import namespace
from utility import utility

app = Flask(__name__, static_url_path='/static')

app.register_blueprint(utility, url_prefix='/gse/utility')
app.register_blueprint(service, url_prefix='/gse/service')
app.register_blueprint(service_label, url_prefix='/gse/service/label')
app.register_blueprint(service_nodeselector, url_prefix='/gse/service/nodeselector')
app.register_blueprint(service_schedulehint, url_prefix='/gse/service/schedulehint')
app.register_blueprint(hpa, url_prefix='/gse/hpa')
app.register_blueprint(vpa, url_prefix='/gse/vpa')
app.register_blueprint(limitrange, url_prefix='/gse/limitrange')
app.register_blueprint(serviceinfo, url_prefix='/gse/serviceinfo')
app.register_blueprint(imageinfo, url_prefix='/gse/imageinfo')
app.register_blueprint(node, url_prefix='/gse/node')
app.register_blueprint(namespace, url_prefix='/gse/namespace')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8888)

'''      
실행방법
gunicorn app:app --bind=0.0.0.0:8888 --daemon --reload
--daemon: 데몬 프로세스로 실행
--reload: 소스 변경시 재구동
'''
