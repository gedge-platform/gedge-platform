from queue import Queue
from os import path
import yaml
from kubernetes import client, config, utils
from kubernetes.client.rest import ApiException

from GE_GSCH_request_job import RequestJob
import GE_GSCH_define as gDefine
import os 
try :
    config.load_incluster_config()
except:
    config.load_kube_config()
    
app_v1 = client.AppsV1Api()
k8s_client = client.ApiClient()

'''-------------------------------------------------------------------------------------------------------
           PRE WARMER
-------------------------------------------------------------------------------------------------------'''
class policyScaleController:
    policyYamls = []
    support_policy_dic={}
    support_policy_list = []
    '''
    { 'GLowLatencyPriority'    : { 'filename': '', 'deployment_name': '', 'deployment_dic':'', 'replicas': 1}, 
      'GMostRequestedPriority' : { 'filename': '', 'deployment_name': '', 'deployment_dic':'', 'replicas': 1}, 
      'GSelectedCluster'       : { 'filename': '', 'deployment_name': '', 'deployment_dic':'', 'replicas': 1}  
    }
    ''' 
    #podMetric = {} 
    #requestJobMetric ={}
    
    def __init__(self,path):
        self.path = path
        self.namespace = gDefine.GEDGE_SCHEDULER_NAMESPACE
        self.read_yaml_files()
        self.apply_yaml_files()
        self.set_support_policy_dic_from_policy_yamls()
        
    def set_support_policy_dic_from_policy_yamls(self):
        try :
            print('1')
            for file_name in self.policyYamls :
                print('2',file_name)
                f = open(file_name,'r')
                print('3')
                #with open('/home/m/global_scheduler/front_server/policy_yamls/gedge-low-latency-policy.yaml') as file:
                documents = yaml.safe_load_all(f)
                print('documents type',type(documents))
                for doc in documents :
                    print('doc',doc)
                    schema_kind = doc['kind']
                    if schema_kind == 'Deployment' :
                        schema_policy = doc['spec']['template']['metadata']['labels']['policy']
                        print('schema_policy',schema_policy)
                        schema_name = doc['metadata']['name']
                        print('schema_name',schema_name)
                        schema_replicas = doc['spec']['replicas']
                        print('schema_replicas',schema_replicas)
                        self.support_policy_dic[schema_policy] = {'filename':file_name, 'deployment_name':schema_name, 'deployment_dic':doc, 'replicas': schema_replicas}
                self.support_policy_list.append(schema_policy)
        except :
            print('error : set_support_policy_dic_from_policy_yamls')
            return False
        print('success : set_support_policy_dic_from_policy_yamls')
        print('support_policy_list:',self.support_policy_list)
        print('support_policy_dic:',self.support_policy_dic)
        return True

    def set_policy_scale_by_update_deployment(self, policy_name, replicas_num):
        
        try :
            # Update deployment replicas 
            self.support_policy_dic[policy_name]['deployment_dic']['spec']['replicas'] = replicas_num
            # patch the deployment
            resp = app_v1.patch_namespaced_deployment(name=self.support_policy_dic[policy_name]['deployment_name'], namespace=self.namespace, body=self.support_policy_dic[policy_name]['deployment_dic'] )
        except :
            print('error:set_policy_scale_by_update_deployment')
            return False
        return True
    
    def read_yaml_files(self) :
        import glob
        glob_str_list=[str(self.path)+'/*.yaml',str(self.path)+'/*.yml']

        for t_str in glob_str_list :
            self.policyYamls.extend(glob.glob(t_str))

        print('policyYamls:',self.policyYamls)
    
    def apply_yaml_files(self) :
        for full_filename in self.policyYamls:
            #with open(path.join(path.dirname(__file__),filename)) as f:
            try:
                yaml_file = full_filename
                resp = utils.create_from_yaml(k8s_client, yaml_file)
                print('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^')
                print('resp of utils.create_from_yaml ====>',resp)
                print('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^')
                print('create_from_yaml is completed ',yaml_file) 
            except utils.FailToCreateError as failure:
                print('error : apply_yaml_files',failure)
                exit(0)  
