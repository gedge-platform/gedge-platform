from queue import Queue
from os import path
import yaml
from kubernetes import client, config, utils
from kubernetes.client.rest import ApiException

from GE_GSCH_request_job import RequestJob
import GE_GSCH_define as gDefine

try :
    config.load_incluster_config()
except:
    config.load_kube_config()
    
app_v1 = client.AppsV1Api()
k8s_client = client.ApiClient()

'''-------------------------------------------------------------------------------------------------------
           PRE WARMER
-------------------------------------------------------------------------------------------------------'''
class PreWarmer:
    policyYamls = []
    #podMetric = {} 
    #requestJobMetric ={}
    
    def __init__(self,path,s_list):
        self.support_policy_list = s_list
        self.load_yaml_files(path)
        self.apply_yaml_files()

    def load_yaml_files(self,path) :
        import glob
        glob_str_list=[str(path)+'/*.yaml',str(path)+'/*.yml']

        for t_str in glob_str_list :
            self.policyYamls.extend(glob.glob(t_str))

        print('policyYamls:',self.policyYamls)
    
    def apply_yaml_files(self) :
        for full_filename in self.policyYamls:
            #with open(path.join(path.dirname(__file__),filename)) as f:
            try:
                yaml_file = full_filename
                resp = utils.create_from_yaml(k8s_client, yaml_file)
                #print('resp of utils.create_from_yaml ====>',resp)
                print('create_from_yaml is completed ',yaml_file)   
            except :
                print("create_from_yaml", full_filename," Failed.")
