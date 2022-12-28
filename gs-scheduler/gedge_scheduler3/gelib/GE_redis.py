import redis
import json
import uuid 

class redisController :
    def __init__(self, redis_ip, redis_port ):
        print('redis connecting to ',redis_ip,redis_port)
        self.redisConn = redis.StrictRedis(host=redis_ip, port=redis_port, db=0)
        print('redis connectectd',self.redisConn)

    def disconnect_redis_server(self):
        if self.redisConn != None:
            self.redisConn.disconnect()

    def set_data_to_redis(self, value, key=None):
        try:
            if key == None :
                while True:
                    key_temp = uuid.uuid4()
                    if self.redisConn.exists(key, key_temp) == 0 :
                        break
            else :
                key_temp = key    

            if self.redisConn.exists(key_temp) == 0:
                self.redisConn.set(key_temp, value)
                return key_temp
            else :
                print('('+key_temp+') is exists')
                return None
        except Exception as ex:
            print('Error:set_data_to_redis', ex)
            return None

    def get_data_to_redis(self, key):
        try:
            if self.redisConn.exists(key) == 0:
                print('('+key+') is not exists')
                return None
            else :
                value = self.redisConn.get(key)
                return value
        except Exception as ex:
            print('Error:get_data_to_redis', ex)
            return None

    def del_data_from_redis(self, key):
        try:
            if self.redisConn.exists(key) == 0:
                print('('+key+') is not exists')
                return None
            else :
                self.redisConn.delete(key)
                return key
        except Exception as ex:
            print('Error:del_data_from_redis', ex)
            return None

    def hset_data_to_redis(self, value, key="default", field=None):
        field_temp= None
        try:
            if field == None :
                while True:
                    field_temp = str(uuid.uuid4())
                    if self.redisConn.hexists(key, field_temp) == 0 :
                        break
            else :
                field_temp = field
                
            if self.redisConn.hexists(key, field_temp) == 0:
                self.redisConn.hset(key, field_temp, value)
                return (key,field_temp)
            else:
                print('('+key+field_temp+') is exists')
                return None
        except Exception as ex:
            print('Error:hset_data_to_redis', ex)
            return None

    def hget_data_to_redis(self, key, field):
        try:
            if self.redisConn.hexists(key, field) == 0:
                return None
            else :
                value = self.redisConn.hget(key, field)
                return value
        except Exception as ex:
            print('Error:', ex)
            return None

    def hdel_data_to_redis(self, key, field):
        try:
            if self.redisConn.hexists(key, field) == 0:
                print('('+key+field+') is not exists')
                return None
            else :
                self.redisConn.hdel(key, field)
                return (key, field)
        except Exception as ex:
            print('Error:', ex)
            return None