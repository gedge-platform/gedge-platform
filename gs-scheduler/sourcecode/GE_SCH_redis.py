import redis
import json
import GE_SCH_define
from kubernetes import client, config, watch
from kubernetes.client.rest import ApiException

config.load_kube_config()
v1 = client.CoreV1Api()

def set_data_to_redis_server(redis_ip, redis_port, key, data):
    try:
        #need update get_redis_host_ip()
        conn = redis.Redis(host=redis_ip, port=redis_port, db=2)
        print(conn)
        rval = json.dumps(data)
        print('Set Record:', conn.set(key, rval))
        print('Get Record:', conn.get(key))
        data = conn.get(key)
        result = json.loads(data)
        print("result=", result)
        
        for kk in result:
            print("------------")
            print(kk)
        
        return result

    except Exception as ex:
        print('Error:', ex)
        print(data)
        
        return None


def get_data_to_redis_server(redis_ip, redis_port, key):
    try:
        #need update get_redis_host_ip()
        conn = redis.Redis(host=redis_ip, port=redis_port, db=2)
        print(conn)
        data = conn.get(key)
        result = json.loads(data)
        #print("result=", result)
        
        return result
    except Exception as ex:
        print('Error:', ex)
        print(key)
        
        return None
