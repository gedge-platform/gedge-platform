import traceback
import json
import subprocess


def gen_msg(logger, cmd, fnc=None):
    msg = {}
    if 'kubectl get' in cmd:
        cmd += f' -o json'
    try:
        st, res = subprocess.getstatusoutput(cmd)
        if st != 0:
            logger.error(res)
            msg['error'] = {'code': 400, 'message': res}
        elif fnc:
            obj = json.loads(res)
            msg['success'] = fnc(obj)

    except Exception as e:
        logger.error(traceback.format_exc())
        msg['error'] = {'code': 500, 'message': str(e)}
    return msg


def gen_msg_result_query(logger, result):
    msg = {}
    if result[0] > 0:
        msg['error'] = {
            'code': 400,
            'message': result[1]
        }
    return msg
