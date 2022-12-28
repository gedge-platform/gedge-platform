import datetime
#import random
import json 
import uuid

class RequestJob:
    def __init__(self, fileID, requestID=None, date=None, status='queue', failCnt=0, env=None):
        if requestID == None:
            requestID = 'req-'+str(uuid.uuid4())
        self.requestID = requestID
        if date == None :
            self.date = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        else :
            self.date = date
        self.status  = status 
        self.fileID  = fileID
        self.failCnt = failCnt
        self.env     = env
    def increaseFailCnt(self):
        self.failCnt = self.failCnt + 1
    def toJson(self):
        return json.dumps(self.__dict__)
