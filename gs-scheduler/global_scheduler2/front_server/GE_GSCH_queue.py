from queue import Queue
#import random
from GE_GSCH_request_job import RequestJob
import GE_GSCH_define as gDefine

'''-------------------------------------------------------------------------------------------------------
           QUEUE
-------------------------------------------------------------------------------------------------------'''
class RequestQueue:
   
    def __init__(self):
        self.firstQueue = Queue()
        self.fastQueue  = Queue()
        self.baseQueue  = Queue()
        self.dispatchedQueue = {} 

    def get_total_queue_size(self):
        return self.firstQueue.qsize()+self.fastQueue.qsize()+self.baseQueue.qsize()
    
    def get_dispatched_queue_size(self):
        return len(self.dispatchedQueue)

    def insert_RequestJob(self, request_job, option='base'):
        if option == 'fast':
            self.fastQueue.put(request_job)
        elif option == 'first':
            self.firstQueue.put(request_job)
        elif option == 'base':
            self.baseQueue.put(request_job)
        else :
            print('error : insert_job')

    def dispatch_RequestJob(self):
        if self.get_total_queue_size() <= 0 :
            print('empty queue')
            return -1
        dispatch_size = gDefine.GLOBAL_SCHEDULER_QUEUE_SLICE_SIZE * 3 

        while self.firstQueue.qsize() !=0 and dispatch_size > (gDefine.GLOBAL_SCHEDULER_QUEUE_SLICE_SIZE * 2)  :
            temp_RequestJob = self.firstQueue.get()
            temp_RequestJob.status = 'dispatched'
            self.dispatchedQueue[temp_RequestJob.requestID] = temp_RequestJob
            dispatch_size = dispatch_size - 1

        while self.fastQueue.qsize() !=0 and dispatch_size > gDefine.GLOBAL_SCHEDULER_QUEUE_SLICE_SIZE :
            temp_RequestJob = self.fastQueue.get()
            temp_RequestJob.status = 'dispatched'
            self.dispatchedQueue[temp_RequestJob.requestID] = temp_RequestJob
            dispatch_size = dispatch_size - 1

        while self.baseQueue.qsize() !=0 and dispatch_size > 0 :
            temp_RequestJob = self.baseQueue.get()
            temp_RequestJob.status = 'dispatched'
            self.dispatchedQueue[temp_RequestJob.requestID] = temp_RequestJob
            dispatch_size = dispatch_size - 1

    def pop_dispatched_queue(self,request_id):
            return_data =self.dispatchedQueue[request_id]
            del self.dispatchedQueue[request_id]
            return return_data

    def return_RequestJob(self, requestID, status='completed'):
        if status == 'completed' :
            self.dispatchedQueue.pop(requestID) 
        elif status == 'failed' :
            self.dispatchedQueue[requestID].increaseFailCnt()
            if self.dispatchedQueue[requestID].failCnt > gDefine.GLOBAL_SCHEDULER_MAX_FAIL_CNT :
                self.dispatchedQueue.pop(requestID) 
                print("delete Job")
            elif self.dispatchedQueue[requestID].failCnt > gDefine.GLOBAL_SCHEDULER_FIRST_FAIL_CNT :
                self.firstQueue.put(self.dispatchedQueue.pop(requestID))
            else :
                self.baseQueue.put(self.dispatchedQueue.pop(requestID))