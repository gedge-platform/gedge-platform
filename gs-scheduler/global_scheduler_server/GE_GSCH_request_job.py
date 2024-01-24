import datetime
#import random
import json 
import uuid

class RequestJob:
    def __init__(self, file_id, callback_url=None, request_id=None, cdate=None, status='enqueue', fail_count=0, env=None):
        if request_id == None:
            request_id = 'req-'+str(uuid.uuid4())
        self.request_id = request_id
        if cdate == None :
            self.cdate = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        else :
            self.cdate = cdate
        self.status       = status 
        self.file_id      = file_id
        self.callback_url = callback_url
        self.fail_count   = fail_count
        self.env          = env
        
    def increaseFailCnt(self):
        self.fail_count = self.fail_count + 1
    def toJson(self):
        return json.dumps(self.__dict__)
