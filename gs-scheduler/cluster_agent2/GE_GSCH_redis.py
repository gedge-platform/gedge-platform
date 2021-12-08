import redis
import uuid

redisConn = None

def connect_redis_server(redis_ip, redis_port):
    global redisConn
    print('redis connecting to ', redis_ip)
    redisConn = redis.StrictRedis(host=redis_ip, port=redis_port, db=0)
    print('redis connectectd')


def disconnect_redis_server(redis_ip, redis_port):
    global redisConn
    if redisConn != None:
        redisConn.disconnect()


def set_data_to_redis(value, key=None):
    global redisConn
    try:
        if key == None:
           while True:
               key_temp = uuid.uuid4()
               if redisConn.exists(key, key_temp) == 0:
                   break
        else:
            key_temp = key

        if redisConn.exists(key_temp) == 0:
            redisConn.set(key_temp, value)
            return key_temp
        else:
            print('('+key_temp+') is exists')
            return None
    except Exception as ex:
        print('Error:', ex)
        return None


def get_data_to_redis(key):
    global redisConn
    try:
        if redisConn.exists(key) == 0:
            print('('+key+') is not exists')
            return None
        else:
            value = redisConn.get(key)
            return value
    except Exception as ex:
        print('Error:', ex)
        return None


def del_data_from_redis(key):
    global redisConn
    try:
        if redisConn.exists(key) == 0:
            print('('+key+') is not exists')
            return None
        else:
            redisConn.delete(key)
            return key
    except Exception as ex:
        print('Error:', ex)
        return None


def hset_data_to_redis(value, key="default", field=None):
    global redisConn
    field_temp = None
    try:
        if field == None:
           while True:
               field_temp = str(uuid.uuid4())
               if redisConn.hexists(key, field_temp) == 0:
                   break
        else:
            field_temp = field

        if redisConn.hexists(key, field_temp) == 0:
            redisConn.hset(key, field_temp, value)
            return (key, field_temp)
        else:
            print('('+key+field_temp+') is exists')
            return None
    except Exception as ex:
        print('Error:', ex)
        return None


def hget_data_to_redis(key, field):
    global redisConn
    try:
        if redisConn.hexists(key, field) == 0:
            return None
        else:
            value = redisConn.hget(key, field)
            return value
    except Exception as ex:
        print('Error:', ex)
        return None


def hdel_data_to_redis(key, field):
    global redisConn
    try:
        if redisConn.hexists(key, field) == 0:
            print('('+key+field+') is not exists')
            return None
        else:
            redisConn.hdel(key, field)
            return (key, field)
    except Exception as ex:
        print('Error:', ex)
        return None
