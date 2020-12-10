from flask import Blueprint, request, jsonify
import subprocess
import app_conf
import logging.handlers

utility = Blueprint('utility', __name__)

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


@utility.route('/apply', methods=['post'])
def create():
    msg = {
        'err': None,
        'res': None
    }

    try:
        temp = request.data.decode()

        # apply
        cmd = f'cat << EOF | kubectl apply -f -\n{temp}\nEOF\n'
        st, res = subprocess.getstatusoutput(cmd)
        if st != 0:
            logger.error(res)
            msg['err'] = res
        else:
            msg['res'] = res

    except Exception as e:
        logger.error(str(e))
        msg['err'] = str(e)

    return jsonify(msg)


@utility.route('/delete', methods=['delete'])
def delete():
    msg = {
        'err': None,
        'res': None
    }

    try:
        temp = request.data.decode()

        # delete
        cmd = f'cat << EOF | kubectl delete -f -\n{temp}\nEOF\n'
        st, res = subprocess.getstatusoutput(cmd)
        if st != 0:
            logger.error(res)
            msg['err'] = res
        else:
            msg['res'] = res

    except Exception as e:
        logger.error(str(e))
        msg['err'] = str(e)

    return jsonify(msg)
