from flask import Blueprint, request, jsonify
import json
import yamale
import yaml
import app_conf
import logging.handlers
import mydb

serviceinfo = Blueprint('serviceinfo', __name__)

# set logger
logger = logging.getLogger(__name__)
path = f'./logs/{__name__}.log'
fileHandler = logging.handlers.RotatingFileHandler(path,
                                                   maxBytes=app_conf.Log.log_max_size,
                                                   backupCount=app_conf.Log.log_backup_count)
fileHandler.setFormatter(logging.Formatter('%(asctime)s %(levelname)s %(filename)s:%(lineno)s %(message)s'))
logger.addHandler(fileHandler)
logger.setLevel(app_conf.Log.log_level)

# temp
logger.addHandler(logging.StreamHandler())

schema_create = yamale.make_schema(content="""  
name: str(required=True)
namespace: str(required=True)
links: list(required=True)
nodes: list(required=True)
""")

db_path = "./data/serviceinfo.db"
mydb.init(db_path)


@serviceinfo.route('/create', methods=['post'])
def create():
    msg = {
        'err': None,
        'res': None
    }

    try:
        # schema validation
        yamale.validate(schema_create, yamale.make_data(content=request.data.decode('utf-8')))

        # name
        body = yaml.load(request.data, Loader=yaml.Loader)

        k = f"{body['namespace']}/{body['name']}"
        v = json.dumps(body).encode()
        mydb.upsert(db_path, k, v)

    except Exception as e:
        logger.error(str(e))
        msg['err'] = str(e)

    return jsonify(msg)


schema_delete = yamale.make_schema(content="""  
name: str(required=True)
namespace: str(required=True)
""")


@serviceinfo.route('/delete', methods=['delete'])
def delete():
    msg = {
        'err': None,
        'res': None
    }

    try:
        # schema validation
        yamale.validate(schema_delete, yamale.make_data(content=request.data.decode('utf-8')))

        body = yaml.load(request.data, Loader=yaml.Loader)

        k = f"{body['namespace']}/{body['name']}"
        mydb.delete(db_path, k)

    except Exception as e:
        logger.error(str(e))
        msg['err'] = str(e)

    return jsonify(msg)


@serviceinfo.route('/list', methods=['get'])
def list_():
    msg = {
        'err': None,
        'res': []
    }

    try:
        namespace = request.args.get('namespace', None)
        temp = mydb.keys(db_path)
        for x in temp:
            term = x.split('/')
            if term[0] == namespace:
                msg['res'].append((term[1]))
    except Exception as e:
        logger.error(str(e))
        msg['err'] = str(e)

    return jsonify(msg)


@serviceinfo.route('/get', methods=['get'])
def get():
    msg = {
        'err': None,
        'res': None
    }

    try:
        name = request.args.get('name', None)
        namespace = request.args.get('namespace', None)
        k = f"{namespace}/{name}"
        v = mydb.get(db_path, k)
        if v is not None:
            msg['res'] = json.loads(v.decode())
    except Exception as e:
        logger.error(str(e))
        msg['err'] = str(e)

    return jsonify(msg)
