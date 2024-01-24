import sys
sys.path.append('../gelib')
sys.path.append('../gedef')

import pymongo
from pymongo import MongoClient
from pymongo.errors import PyMongoError
from pymongo.errors import OperationFailure
from pymongo.errors import DuplicateKeyError
import GE_define as gDefine

import time
import requests

import datetime
import uuid
import quantity
import json

from json import dumps
from json import loads 

from flask import Flask, jsonify

from GE_kafka import gKafka

import GE_kubernetes as gKube
from   kubernetes import client, config
try :
    config.load_incluster_config()
except:
    config.load_kube_config()
v1 = client.CoreV1Api()

'''
============================================================================
Mongo_DB : clusters information 
============================================================================

'''
class metaData:
    def __init__(self):
        print('init')
        
    def init_platform_metadata_from_mongodb(self, ip='localhost', port=27017):
        try :            
            self.client = MongoClient(ip, port)
            print('self.client',self.client)
            self.platform_info_db = self.client[gDefine.GEDGE_PLATFORM_INFO_MONGO_DB_NAME]
            print('self.platform_info_db',self.platform_info_db)

            self.platform_user_col = self.platform_info_db[gDefine.GEDGE_PLATFORM_USER_INFO_MONGO_DB_COL]
            print('self.platform_user_col',self.platform_user_col)
            #self.platform_user_col.create_index('user_name', unique=True)
            
            self.platform_wspace_col = self.platform_info_db[gDefine.GEDGE_PLATFORM_WSPACE_INFO_MONGO_DB_COL]
            #self.platform_wspace_col.create_index([('user_name'),('workspace_name')], unique=True)
            print('self.platform_wspace_col',self.platform_wspace_col)

            self.platform_project_col = self.platform_info_db[gDefine.GEDGE_PLATFORM_PROJECT_INFO_MONGO_DB_COL]
            #self.platform_project_col.create_index([('user_name'),('workspace_name'),('project_name')], unique=True)
            print('self.platform_project_col',self.platform_project_col)

            self.platform_service_col = self.platform_info_db[gDefine.GEDGE_PLATFORM_SERVICE_INFO_MONGO_DB_COL]
            print('self.platform_service_col',self.platform_service_col)

            self.platform_cluster_col = self.platform_info_db[gDefine.GEDGE_PLATFORM_CLUSTER_INFO_MONGO_DB_COL]
            print('self.platform_cluster_col',self.platform_cluster_col)

            self.platform_node_col = self.platform_info_db[gDefine.GEDGE_PLATFORM_NODE_INFO_MONGO_DB_COL]
            print('self.platform_node_col',self.platform_node_col)

            self.platform_network_col = self.platform_info_db[gDefine.GEDGE_PLATFORM_NETWORK_INFO_MONGO_DB_COL]
            print('self.platform_network_col',self.platform_network_col)

            self.platform_storage_col = self.platform_info_db[gDefine.GEDGE_PLATFORM_STORAGE_INFO_MONGO_DB_COL]
            print('self.platform_storage_col',self.platform_storage_col)

            self.platform_gsch_db = self.client[gDefine.GEDGE_PLATFORM_GSCH_MONGO_DB_NAME]
            print('self.platform_gsch_db',self.platform_gsch_db)

            self.platform_gsch_policy_col = self.platform_gsch_db[gDefine.GSCH_SERVER_POLICY_MONGO_DB_COL]
            print('self.platform_gsch_policy_col',self.platform_gsch_policy_col)
            
        except:
            print('error: init_platform_metadata_from_mongodb')
            exit(0)
    
    def drop_platform_metadata_from_mongodb(self, ip='localhost', port=27017):
        self.client = MongoClient(ip, port)
        print('self.client',self.client)
        platform_info_db = self.client[gDefine.GEDGE_PLATFORM_INFO_MONGO_DB_NAME]
        self.client.drop_database(platform_info_db)
        platform_gsch_db = self.client[gDefine.GEDGE_PLATFORM_GSCH_MONGO_DB_NAME]
        self.client.drop_database(platform_gsch_db)
    '''-----------------------------------------------
             USER INFO {
                user_name : user1,
                user_type : super/normal
                user_passwd : p1,
                user_email : e1,
                user_status: s1,
                cdate : cd1
             }
    -----------------------------------------------'''  
    def create_new_user_info(self,data_dic):
        ## insert 
        print('create_new_user_info with :',data_dic)
        try:
           result=self.platform_user_col.insert_one(data_dic)
        except DuplicateKeyError as e:
           print("create_new_user_info error : DuplicateKeyError", e)
           return 'fail', ' DuplicateKeyError'
        return 'success', result
        
    def set_user_info(self,data_dic):
        ## update and insert 
        print('set_user_info with :',data_dic)
        try:
            result=self.platform_user_col.update_many({'user_name': data_dic['user_name']},{'$set':data_dic},upsert=True)
        except PyMongoError as e:
           print('error : set_user_info ',e)
           return 'fail', 'Error during platform_user_col.update_many command'
        return 'success', result
    
    def delete_user_info(self,user_name):
        ##delete
        print('delete_user_info with :',user_name)
        try:
            result=self.platform_user_col.delete_one({'user_name': user_name})
        except PyMongoError as e:
           print('error : delete_user_info',e)
           return 'fail', 'Error during platform_user_col.delete_one command'
        if result.acknowledged:
            return 'success', user_name
        else :
            return 'fail', 'Error during platform_user_col.delete_one command'
        
    def get_user_info(self,user_name) :
        print('user_name',user_name)
        try:
            result = self.platform_user_col.find_one({'user_name':user_name},{'_id':0})
        except PyMongoError as e:
           print('error : get_user_info ',e)
           return None
        print('get_user_info',user_name, result)
        return result

    def get_user_info_list(self):
        return_list=[]
        try:
            users = self.platform_user_col.find({},{'_id':0})
        except PyMongoError as e:
            print('error : get_user_info_list ',e)    
            return None
        for user in users:
            print('user_info',user)
            return_list.append(user)
        return return_list
      
    def drop_user_info(self):
        print('start drop_user_info')
        try:
            self.platform_user_col.drop()
        except PyMongoError as e:
            print('error : drop_user_info ',e)       
        print('end drop_user_info')   
        
    def get_passwd_from_user_info(self,user_name):
        print('user_name',user_name)
        try:
            result = self.platform_user_col.find_one({'user_name':user_name},{'_id':0})
        except PyMongoError as e:
            print('error : get_passwd_from_user_info ')
            return 'fail', 'Error during platform_user_col.find_one command'
        if 'user_passwd' in result:
            user_passwd = result['user_passwd']
            return 'success', user_passwd
        else:
            print('error : get_passwd_from_user_info ')
            return 'fail', 'Error during platform_user_col.find_one command'
    
    '''-----------------------------------------------
           WORKSPACES_INFO
           { 
                user_name: user_name,
                workspace_name : ws1,
                workspace_uid : wuid1 
                select_clusters : [c1,c2],
                workspace_status : s1,
                cdate : cd1 
           }
    -----------------------------------------------'''  
    def issubset_clusters_of_workspace(self,user_name,workspace_name,check_cluster_list):
        r = self.get_workspace_info(user_name,workspace_name)
        if r == None :
            print('error: workspace_name is not exists.')
            return False
        workspace_cluster_list=r['select_clusters']
        if len(workspace_cluster_list) !=0 and len(check_cluster_list) !=0 :
            set1 = set(workspace_cluster_list)
            set2 = set(check_cluster_list)
            if set2.issubset(set1):
                return True
            else :
                return False
        else:
            return False
        
    def create_new_workspace_info(self,data_dic):
        ## insert 
        print('create_new_workspace_info with :',data_dic)
        result = None
        try:
           result=self.platform_wspace_col.insert_one(data_dic)
        except DuplicateKeyError as e:
           print("create_new_workspace_info error : DuplicateKeyError", e)
        return result
    
    def set_workspace_info(self,data_dic):
        ## update and insert 
        print('set_workspace_info with :',data_dic)
        try:
            self.platform_wspace_col.update_many({'$and': [{'workspace_name': data_dic['workspace_name']},{'user_name': data_dic['user_name']}]},{'$set':data_dic},upsert=True)
        except PyMongoError as e:
            print('Error during platform_user_col.find_one command', e)    
    
    def get_workspace_info(self,user_name,workspace_name) :
        ## read
        print('workspace_name',workspace_name)
        try:
            result = self.platform_wspace_col.find_one({'$and': [{'user_name': user_name},{'workspace_name': workspace_name}]},{'_id':0})
            print('get_workspace_info',result)
            return result
        except PyMongoError as e:
            print('Error during platform_wspace_col.find_one command', e)     
            return None
    
    def get_workspace_info_list_by_username(self,user_name) :
        print('user_name',user_name)
        return_list=[]
        try:
            result = self.platform_wspace_col.find({'user_name':user_name},{'_id':0})
            result_list =list(result)
            for r in result_list:
                print('result =>',r)
                return_list.append(r)
            print('get_workspace_info_list_by_username',user_name, return_list)
            return return_list
        except PyMongoError as e:
            print('Error during platform_wspace_col.find command', e)     
            return None
    
    def isexist_workspace(self,user_name,workspace_name) :
        print('user_name',user_name)
        print('workspace_name',workspace_name)
        try:
            result = self.platform_wspace_col.find( {'$and': [{'user_name': user_name},{'workspace_name': workspace_name}]},{'_id':0})
            print('isexist__workspace', result)
            result_list =list(result)
            if len(result_list) >= 0 :
                return True
            else :
                return False
        except PyMongoError as e:
            print('Error during platform_wspace_col.find command', e)
            return False  

    def get_workspace_info_list(self):
        return_list=[]
        try:
            result = self.platform_wspace_col.find({},{'_id':0})
            result_list =list(result)
            for r in result_list:
                print('result =>',r)
                return_list.append(r)
            print('get_workspace_info_list', return_list)
            return return_list
        except PyMongoError as e:
            print('Error during platform_wspace_col.find command', e)
            return None
        
    def delete_workspace_info(self,user_name,workspace_name):
        ##delete
        print('delete_workspace_info with :',user_name,workspace_name)
        try:
            result=self.platform_wspace_col.delete_one({'$and':[{'user_name': user_name},{'workspace_name': workspace_name}]})
            if result.acknowledged:
                return 'success', workspace_name
            else :
                return 'fail','Error during platform_wspace_col.find command'
        except PyMongoError as e:
           print('Error during platform_wspace_col.find command',e)
           return 'fail','Error during platform_wspace_col.find command'
    
    def drop_workspace_info(self):
        print('start drop_workspace_info')
        try:
            self.platform_wspace_col.drop()
        except PyMongoError as e:
           print('Error during platform_wspace_col.drop command',e)
        print('end drop_workspace_info')   
    
    '''-----------------------------------------------
            PROJECT INFO {
                user_name : user1,
                workspace_name: ws1,
                project_name : p1,
                select_clusters : [c1, c2],
                cdate: cd1
            }
    -----------------------------------------------'''  
    def set_msg_for_create_project(self,rquest_id,select_clusters,p_dic):
        msg_dic = {
            'source':{'type':'none',   'object': 'none'},
            'target':{'type':'cluster','object': select_clusters},
            'hcode':520,
            'lcode':1,
            'msg':{
                'request_id': rquest_id,
                'method'    : 'create',
                'mode'      : 'default',
                'parameters': p_dic
            }
        }
        return msg_dic
    
    def set_msg_for_delete_project(self,rquest_id,select_clusters,p_dic):
        msg_dic = {
            'source':{'type': 'none',   'object': 'none'},
            'target':{'type': 'cluster','object': select_clusters},
            'hcode':520,
            'lcode':1,
            'msg':{
                'request_id': rquest_id,
                'method'    : 'delete',
                'mode'      : 'default',
                'parameters': p_dic
            }
        }
        return msg_dic
    
    def create_new_project_info(self,pdic):
        print('create_new_project_info with :',pdic)
        Gkafka = gKafka([gDefine.KAFKA_SERVER_URL])
        result=None
        ## find project
        found_project = self.get_project_info(pdic['user_name'],pdic['workspace_name'],pdic['project_name'])
        if found_project == None : 
            print('11')
            # check user_name
            if self.get_user_info(pdic['user_name']) == None :
                print('error: user_name is not exists.')
                Gkafka.close()
                return 'fail', 'user is not exists'
            print('22')
            # check workspace_name
            if self.isexist_workspace(pdic['user_name'],pdic['workspace_name']) == False:
                print('error: workspace_name is not exists.')
                Gkafka.close()
                return 'fail', 'workspace is not exists'
            print('33')
            # get select_clusters from workspace 
            re_workspace = self.get_workspace_info(pdic['user_name'],pdic['workspace_name'])
            if re_workspace == None :
                print('error: workspace_name is not exists.')
                Gkafka.close()
                return 'fail', 'workspace is not exists'
            print('44')
            # check issubset of select_clusters 
            if self.issubset_clusters_of_workspace( pdic['user_name'],pdic['workspace_name'],pdic['select_clusters']) == False:
                print('error: select_clusters is not subset.')
                Gkafka.close()
                return 'fail', 'select_clusters is not subset'
            
            # create uuid of 
            create_project_rquest_id = str(uuid.uuid4())
            pdic['workspace_uid'] = re_workspace['workspace_uid']
            
            create_project_request_msg = self.set_msg_for_create_project(create_project_rquest_id,pdic['select_clusters'],pdic)
            print('1',create_project_request_msg)
            # create topic 
            Gkafka.create_topic(create_project_rquest_id,1,1)
            print('55')
            
            # send data to select_clusters using kafka producer 
            r = Gkafka.kafka_msg_send(gDefine.GEDGE_GLOBAL_API_TOPIC_NAME,create_project_request_msg)
            if r == None :
                print('error: kafka_msg_send')
                Gkafka.delete_topic(create_project_rquest_id)
                Gkafka.close()
                return 'fail', 'Error kafka_msg_send'
            print('66')
            Gkafka.set_consumer(create_project_rquest_id,create_project_rquest_id)
            msgs = Gkafka.kafka_msg_read(gDefine.CONSUMER_TIMEOUT_MS_TIME,len(pdic['select_clusters']))
            if msgs == None :
                print('error11: kafka_msg_read')
                Gkafka.delete_topic(create_project_rquest_id)
                Gkafka.close()
                return 'fail', 'Error kafka_msg_read'
            print('msgs',msgs)
            print('type msgs',type(msgs))
            for msg in msgs:
                # 메시지에서 데이터 추출
                print('msg',msg)
                print('type msg',type(msg))
                if msg['result']['status'] != 'success' :
                    # send delete namespace of select_clusters with kafka msg 
                    # send data to select_clusters using kafka producer 
                    delete_project_rquest_id = str(uuid.uuid4())
                    # create topic 
                    Gkafka.create_topic(delete_project_rquest_id,1,1)
                    
                    delete_project_request_msg = self.set_msg_for_delete_project(delete_project_rquest_id,pdic['select_clusters'],pdic)
                    r = Gkafka.kafka_msg_send(gDefine.GEDGE_GLOBAL_API_TOPIC_NAME,delete_project_request_msg)
                    if r == None :
                        print('error: kafka_msg_send')
                        Gkafka.delete_topic(create_project_rquest_id)
                        Gkafka.delete_topic(delete_project_rquest_id)
                        Gkafka.close()
                        return 'fail', 'Error kafka_msg_send'
                    Gkafka.set_consumer(delete_project_rquest_id,delete_project_rquest_id)
                    msgs2 = Gkafka.kafka_msg_read(gDefine.CONSUMER_TIMEOUT_MS_TIME,len(pdic['select_clusters']))
                    if msgs2 == None :
                        print('error: kafka_msg_read')
                        Gkafka.delete_topic(create_project_rquest_id)
                        Gkafka.delete_topic(delete_project_rquest_id)
                        Gkafka.close()
                        return 'fail', 'Error kafka_msg_read'
                    for msg2 in msgs2:
                        if msg2['result']['status'] != 'success' :
                            print('error: delete_project_request')

                    print('error: create_project_request')
                    Gkafka.close()
                    return 'fail', 'Error create_project_request'
            # delete topic 
            Gkafka.delete_topic(create_project_rquest_id)
                    
            try:
                result = self.platform_project_col.insert_one(pdic)
                Gkafka.close()
                if result.acknowledged :
                    return 'success', pdic['project_name']
                else :
                    return 'fail', 'Error platform_project_col.insert_one'
            except DuplicateKeyError as e:
                print("Error platform_project_col.insert_one", e)
                Gkafka.close()
                return 'fail', 'Error platform_project_col.insert_one'
        else :
            Gkafka.close()
            return 'fail', 'project is exist'
        
    def get_project_info(self,user_name,workspace_name,project_name) :
        
        print('project_name',project_name)
        try:
            result = self.platform_project_col.find_one({'$and': [{'user_name': user_name},{'workspace_name': workspace_name},{'project_name': project_name}]},{'_id':0})
            print('get_project_info',user_name,workspace_name,project_name, result)
            return result
        except PyMongoError as e:
            print('Error during platform_project_col.find_one command', e)
            return None
    
    def get_project_info_list(self,user_name, workspace_name):
        
        return_list=[]
        try:
            result = self.platform_project_col.find({'$and': [{'user_name': user_name},{'workspace_name': workspace_name}]},{'_id':0})
            result_list= list(result)
            for r in result_list:
                print('result =>',r)
                return_list.append(r)
            print('get_project_info_list', return_list)
            return return_list
        except PyMongoError as e:
            print('Error during platform_project_col.find command', e)
            return None
        
    def isempty_project(self,user_name,workspace_name):
        try:
            results = self.platform_project_col.find({'$and': [{'user_name': user_name},{'workspace_name': workspace_name}]},{'_id':0})
            result_list = list(results)
            if len(result_list) == 0 :
                return True
            else :
                return False
        except PyMongoError as e:
            print('Error during platform_project_col.find command', e)
            return False
        
    def delete_project_info(self,user_name,workspace_name,project_name):
        ##delete
        print('delete_project_info with :',user_name,workspace_name,project_name)
        pdic = self.get_project_info(user_name,workspace_name,project_name)
        if pdic == None :
            print('error: get_project_info')
            return 'fail', 'project is not exist'
        re_workspace = self.get_workspace_info(pdic['user_name'],pdic['workspace_name'])
        if re_workspace == None :
            print('error: workspace_name is not exists.')
            return 'fail', 'workspace is not exist'
        
        Gkafka = gKafka([gDefine.KAFKA_SERVER_URL])
        delete_project_rquest_id = str(uuid.uuid4())
        # create topic 
        Gkafka.create_topic(delete_project_rquest_id,1,1)
        pdic['workspace_uid'] = re_workspace['workspace_uid']
        
        delete_project_request_msg = self.set_msg_for_delete_project(delete_project_rquest_id,pdic['select_clusters'],pdic)
        
        r = Gkafka.kafka_msg_send(gDefine.GEDGE_GLOBAL_API_TOPIC_NAME,delete_project_request_msg)
        if r == None :
            print('error: kafka_msg_send')
            Gkafka.delete_topic(delete_project_rquest_id)
            return 'fail', 'Error kafka_msg_send'
        
        Gkafka.set_consumer(delete_project_rquest_id,delete_project_rquest_id)
        msgs = Gkafka.kafka_msg_read(gDefine.CONSUMER_TIMEOUT_MS_TIME,len(pdic['select_clusters']))
        if msgs == None :
            print('error: kafka_msg_read')
            Gkafka.delete_topic(delete_project_rquest_id)
            return 'fail', 'Error kafka_msg_read'
        
        for msg in msgs:
            if msg['result']['status'] != 'success' :
                print('error: delete_project_request')
        try:
            result = self.platform_project_col.delete_one({'$and': [{'user_name': user_name},{'workspace_name': workspace_name},{'project_name': project_name}]})
        except PyMongoError as e:
            print('Error during platform_project_col.delete_one command', e)
            return 'fail', 'Error during platform_project_col.delete_one command'
        
        if result.acknowledged:
            return 'success', project_name
        else :
            return 'fail', 'Error during platform_project_col.delete_one command'
    
    def drop_project_info(self):
        print('start drop_project_info')
        try:
            self.platform_project_col.drop()
        except PyMongoError as e:
            print('Error during drop_project_info command', e)    
        print('end drop_project_info')   
    
    '''-----------------------------------------------
             CLUSTER INFO {
                cluster_name : c1,
                cluster_ip   : ip,
                cluster_type: baremetal/cloud,
                nodes: [n1,n2,n3],
                cdate : cd1 
            }
    -----------------------------------------------''' 
    def set_cluster_info(self,data_dic):
        ## update and insert 
        print('set_cluster_info with :',data_dic)
        try:
            self.platform_cluster_col.update_many({'cluster_name': data_dic['cluster_name']},{'$set':data_dic},upsert=True)
        except PyMongoError as e:
           print('Error during set_cluster_info command', e)  
    
    def get_cluster_info(self,cluster_name) :
        print('cluster_name',cluster_name)
        try:
            result = self.platform_cluster_col.find_one({'cluster_name':cluster_name},{'_id':0})
            print('get_cluster_info',cluster_name, result)
            return result
        except PyMongoError as e:
            print('Error during get_cluster_info command', e) 
            return None 
        
    def get_cluster_info_list(self):
        return_list=[]
        try:
            cursor = self.platform_cluster_col.find({},{'_id':0})
            for document in cursor:
                print('cursor=>',document)
                return_list.append(document)
            return return_list
        except PyMongoError as e:
            print('Error during get_cluster_info_list command', e) 
            return None 
    
    '''----------------------------------------------------------------------------------------------
        check if check_cluster_list is the subset of total_cluster_list(current_cluster_list)
    ----------------------------------------------------------------------------------------------'''
    def issubset_clusters(self, check_cluster_list):
        current_cluster_list=[]
        result=False
        try :
            cursor = self.platform_cluster_col.find({})
        except PyMongoError as e:
            print('Error during platform_cluster_col.find command', e) 
            return False     
        for c in cursor:
            print('cursor=>',c)
            current_cluster_list.append(c['cluster_name'])
        if len(current_cluster_list) !=0 and len(check_cluster_list) !=0 :
            set1 = set(current_cluster_list)
            print('set1',set1)
            set2 = set(check_cluster_list)
            print('set2',set2)
            result = set2.issubset(set1)
            if result:
                print('issubset_clusters:',result)
                return True
            else :
                print('issubset_clusters:',result)
                return False
        else:
            print('issubset_clusters:',result)
            return False
        
    def drop_cluster_info(self):
        print('start drop_cluster_info')
        try :
            self.platform_cluster_col.drop()
        except PyMongoError as e:
            print('Error during platform_cluster_col.drop command', e) 
        print('end drop_cluster_info')

    '''-----------------------------------------------
             NODE INFO {
                node_id : ‘c1:n1’
                node_type: master/worker
                node_name: n1,
                node_host: host1,
                node_labels: [l1,l2],  
                requests : {
                    cpu : 0.0,
                    memory: 0.0,
                    nvidia.com/gpu: 1
                },  
                limits : {
                    cpu : 0.0,
                    memory: 0.0,
                    nvidia.com/gpu: 1          
                },      
                capacity : {
                    cpu : 0.0,
                    memory: 0.0,
                    nvidia.com/gpu: 1             
                },
                allocatable : {
                    cpu : 0.0,
                    memory: 0.0,
                    nvidia.com/gpu: 1
                },
                cdate : cd1 
            }
    -----------------------------------------------''' 
    def set_node_info(self,data_dic):
        ## update and insert 
        print('set_node_info with :',data_dic)
        try :
            self.platform_node_col.update_many({'node_id': data_dic['node_id']},{'$set':data_dic},upsert=True)
        except PyMongoError as e:
            print('Error during platform_node_col.update_many command', e) 
    
    def get_node_info(self,cluster_name,node_name) :
        print('cluster_name',cluster_name)
        print('node_name',node_name)
        find_node_id = cluster_name+':'+node_name
        try :
            result = self.platform_node_col.find_one({'node_id':find_node_id},{'_id':0})
            print('get_node_info',find_node_id, result)
            return result
        except PyMongoError as e:
            print('Error during platform_node_col.find_one command', e)    
            return None
    
    def get_node_info_by_node_type(self,cluster_name,node_type) :
        print('cluster_name',cluster_name)
        print('node_type',node_type)
        try :
            result = self.platform_node_col.find_one( {'$and':[{'cluster_name':cluster_name},{'node_type':node_type}]},{'_id':0} )
            print('get_node_info_by_node_type',cluster_name, node_type, result)
            return result
        except PyMongoError as e:
            print('Error during platform_node_col.find_one command', e)    
            return None
    
    def get_node_info_list_by_clustername(self,cluster_name):
        return_list=[]
        try :
            cursor = self.platform_node_col.find({'cluster_name':cluster_name},{'_id':0})
            for document in cursor:
                print('cursor=>',document)
                return_list.append(document)
            return return_list
        except PyMongoError as e:
            print('Error during platform_node_col.find command', e)    
            return None
        
    def get_node_info_list(self):
        return_list=[]
        try :
            cursor = self.platform_node_col.find({},{'_id':0})
            for document in cursor:
                print('cursor=>',document)
                return_list.append(document)
            return return_list
        except PyMongoError as e:
            print('Error during platform_node_col.find command', e)    
            return None

    def drop_node_info(self):
        print('start drop_node_info')
        try :
            self.platform_node_col.drop()
        except PyMongoError as e:
            print('Error during platform_node_col.drop command', e)    
        print('end drop_node_info')
        
    '''-----------------------------------------------
             PLATFORM SERVICE {
                namespace : n1, 
                service_name : s1,
                pservice_uid: ‘n1:s1’,
                service_type : balancer/nodeport
                access_host : host1,
                access_port : port1,
                cdate : cd1 
             }
    -----------------------------------------------''' 
    def drop_platform_service_info(self):
        print('start drop_platform_service_info')
        try :
            self.platform_service_col.drop()
        except PyMongoError as e:
            print('Error during platform_service_col.drop command', e)    
        print('end drop_platform_service_info')
    
    def get_platform_namespaced_service(self,namespace_name, service_name) :
        print('namespace service_name',namespace_name,service_name)
        try :
            result = self.platform_service_col.find_one({'$and':[{'namespace':namespace_name},{'service_name':service_name}]},{'_id':0})
            print('get_platform_namespaced_service',namespace_name,service_name, result)
            return result
        except PyMongoError as e:
            print('Error during platform_service_col.find_one command', e)    
            return None
        
    def set_platform_namespaced_service(self,data_dic):
        try :
            self.platform_service_col.update_many({'$and':[{'namespace':data_dic['namespace']},{'service_name':data_dic['service_name']}]},{'$set':data_dic},upsert=True)
            print('data_dic',data_dic)
        except PyMongoError as e:
            print('Error during platform_service_col.update_many command', e)     
    
    def get_platform_namespaced_service_list(self,namespace_name):
        return_list=[]
        try :
            cursor = self.platform_service_col.find({'namespace':namespace_name},{'_id':0})
            for document in cursor:
                print('cursor=>',document)
                return_list.append(document)
            return return_list
        except PyMongoError as e:
            print('Error during platform_service_col.find command', e)    
            return None
        
    def get_platform_service_list(self):
        return_list=[]
        try :
            cursor = self.platform_service_col.find({},{'_id':0})
            for document in cursor:
                print('cursor=>',document)
                return_list.append(document)
            return return_list
        except PyMongoError as e:
            print('Error during platform_service_col.find command', e)    
            return None
    
    def delete_platform_namespaced_service(self,namespace_name,service_name):
        print('start delete_platform_namespaced_service')
        try:
            query = {'$and':[{'namespace':namespace_name},{'service_name':service_name}]}
            result = self.platform_service_col.delete_one(query)
            if result.acknowledged:
                print('end delete_platform_namespaced_service')
                return 'success', service_name
            else :
                return 'fail','Error during platform_service_col.delete_one command'  
        except PyMongoError as e:
           print('Error during platform_service_col.find command',e)
           return 'fail','Error during platform_service_col.delete_one command' 
    
    def delete_platform_namespaced_service_by_namespacename_regex(self,namespace_name):
        print('start delete_platform_namespaced_service_by_namespacename_regex')
        try:
            query = {'namespace':{'$regex': namespace_name}}
            result = self.platform_service_col.delete_many(query)
            if result.acknowledged:
                return 'success', result.deleted_count
            else :
                return 'fail','Error during platform_service_col.delete_many command' 
        except PyMongoError as e:
           print('Error during platform_service_col.delete_many command',e)
           return 'fail','Error during platform_service_col.delete_many command' 
        
    def delete_platform_namespaced_service_by_namespacename(self,namespace_name):
        print('start delete_platform_namespaced_service_by_namespacename')
        query = {'namespace':namespace_name}
        try:
            result = self.platform_service_col.delete_many(query)
            if result.acknowledged:
                return 'success', result.deleted_count
            else :
                return 'fail','Error during platform_service_col.delete_many command'
        except PyMongoError as e:
           print('Error during platform_service_col.delete_many command',e)
           return 'fail','Error during platform_service_col.delete_many command'
        
    '''-----------------------------------------------
             GSCH POLICY {
                policy_name : p1,
                filename: f1
                deployment_name: dn1,
                deployment_dic: d1,
                replicas :r1
             }
    -----------------------------------------------''' 
     
    def set_platform_gsch_policy(self,data_dic):
        print('data_dic',data_dic)
        try :
            self.platform_gsch_policy_col.update_many({'policy_name': data_dic['policy_name']},{'$set':data_dic},upsert=True)
        except PyMongoError as e:
           print('Error during platform_gsch_policy_col.update_many command',e)
    
    def get_platform_gsch_policy(self,policy_name) :
        print('policy_name',policy_name)
        try :
            result = self.platform_gsch_policy_col.find_one({'policy_name':policy_name},{'_id':0})
            print('get_platform_gsch_policy',policy_name, result)
            return result
        except PyMongoError as e:
            print('Error during platform_gsch_policy_col.find_one command',e)
            return None
       
    def get_platform_gsch_policy_list(self):
        return_list=[]
        try :
            cursor = self.platform_gsch_policy_col.find({},{'_id':0})
            for document in cursor:
                print('cursor=>',document)
                return_list.append(document)
            return return_list
        except PyMongoError as e:
            print('Error during platform_gsch_policy_col.find command',e)
            return None
        
    def drop_platform_gsch_policy_info(self):
        print('start drop_platform_gsch_policy_info')
        try :
            self.platform_gsch_policy_col.drop()
        except PyMongoError as e:
            print('Error during platform_gsch_policy_col.drop command',e)    
        print('end drop_platform_gsch_policy_info')

''' =====================================================
               project 
======================================================'''

def get_namespace_name_by_project_name(user_name,workspace_name,project_name):
    return_val=None
    while(1) :
        # GET MONGODB IP & PORT BY REST API
        # until all service are ready  
        try :
            res = requests.get(gDefine.PLATFORM_INFO_PREFIX+'/users/'+str(user_name)+'/workspaces/'+str(workspace_name))
        except:
            print('wait rest get_namespace_name_by_project_name api service of platform info')
            time.sleep(5) 
            continue
        if res.status_code == 200 :
            print('2')
            print('res=',res)
            data = res.json()
            print('data = ',data)
            #request_data_dic = json.loads(res.json())
            #print('request_data_dic',request_data_dic)
            return_val = str(project_name) +'-'+ str(data['workspace_uid'])
            print('return_val',return_val)
            break
        else :
            print('wait platform_service_list result from rest api of platform info',gDefine.PLATFORM_INFO_PREFIX+str('/platformServices'))
            time.sleep(5) 
            continue
    return return_val

''' =====================================================
               gCluster / gWorkerNode
======================================================'''

def get_gCluster_with_k8s(cluster_name,cluster_type):
    '''-----------------------------------------------
             CLUSTER INFO {
                cluster_name : c1,
                cluster_ip   : ip,
                cluster_type: baremetal/cloud,
                nodes: [n1,n2,n3],
                cdate : cd1 
            }
    -----------------------------------------------''' 
    ready_nodes = []
    for n in v1.list_node().items:
        for status in n.status.conditions:
            #print("status",status)
            if status.status == "True" and status.type == "Ready":
                print("metadata.name",n.metadata.name)
                ready_nodes.append(n.metadata.name)
    print("ready_nodes : ", ready_nodes)
    gCluster = {}
    gCluster['cluster_name'] = cluster_name 
    gCluster['cluster_type'] = cluster_type 
    nodes_list = []
    for node_name in ready_nodes :
        nodes_list.append(node_name)
    gCluster['nodes'] = nodes_list   
    
    for node_name in ready_nodes :
        t_node_data = v1.read_node(node_name)
        print(t_node_data.metadata.labels)
        if 'node-role.kubernetes.io/master' in t_node_data.metadata.labels :
            print(node_name, 'is master node')
            print('status.addresses',t_node_data.status.addresses)
            for addr in t_node_data.status.addresses :
                if addr.type == 'InternalIP' :
                    cluster_masternode_ip = addr.address
                    gCluster['cluster_ip']=cluster_masternode_ip
                    break
        else :
            continue
    gCluster['cdate'] = datetime.datetime.now()
    return gCluster

def get_gNode_with_k8s(cluster_name):        

    '''
    gNode_status = { 
        'node_name' : {
            'requests'   : { 'cpu' :0 ,'memory': 0, 'nvidia.com/gpu':0},  
            'limits'     : { 'cpu' :0 ,'memory': 0, 'nvidia.com/gpu':0},  
            'capacity'   : { 'cpu' :0 ,'memory': 0, 'nvidia.com/gpu':0},  
            'allocatable': { 'cpu' :0 ,'memory': 0, 'nvidia.com/gpu':0}
        },
        'node_name2' : {
            'requests'   : { 'cpu' :0 ,'memory': 0, 'nvidia.com/gpu':0},  
            'limits'     : { 'cpu' :0 ,'memory': 0, 'nvidia.com/gpu':0},  
            'capacity'   : { 'cpu' :0 ,'memory': 0, 'nvidia.com/gpu':0},  
            'allocatable': { 'cpu' :0 ,'memory': 0, 'nvidia.com/gpu':0}
        }  
    }
    '''
    '''
    gNode = { 
        node_id : ‘c1:n1’
        node_type: master/worker
        node_name: n1,
        cluster_name: c1,
        node_host: host1,
        node_labels: [l1,l2],  
        requests : {
            cpu : 0.0,
            memory: 0.0,
            nvidia.com/gpu: 1
        },  
        limits : {
            cpu : 0.0,
            memory: 0.0,
            nvidia.com/gpu: 1          
        },      
        capacity : {
            cpu : 0.0,
            memory: 0.0,
            nvidia.com/gpu: 1             
        },
        allocatable : {
            cpu : 0.0,
            memory: 0.0,
            nvidia.com/gpu: 1
        }
    }
    '''
    gNode_list = []
    gNode_status={}
    gNode={}
    
    pod_list = v1.list_pod_for_all_namespaces(pretty=True)
    for p in pod_list.items:
        
        node_name = p.spec.node_name
        if node_name not in gNode_status:
            gNode_status[node_name]             = {}
            gNode_status[node_name]['requests'] = {'cpu' :0, 'memory':0, 'nvidia.com/gpu':0}
            gNode_status[node_name]['limits']   = {'cpu' :0, 'memory':0, 'nvidia.com/gpu':0}
        for c in p.spec.containers:
            if c.resources.requests :
                if 'cpu' in c.resources.requests :
                    gNode_status[node_name]['requests']['cpu'] += float(quantity.parse_quantity(c.resources.requests['cpu']))
                if 'memory' in c.resources.requests :
                    gNode_status[node_name]['requests']['memory'] += float(quantity.parse_quantity(c.resources.requests['memory']))
                if 'nvidia.com/gpu' in c.resources.requests :
                    gNode_status[node_name]['requests']['nvidia.com/gpu'] += int(c.resources.requests['nvidia.com/gpu'])    
            if c.resources.limits :
                if 'cpu' in c.resources.limits :
                    gNode_status[node_name]['limits']['cpu'] +=  float(quantity.parse_quantity(c.resources.limits['cpu']))
                if 'memory' in c.resources.limits :
                    gNode_status[node_name]['limits']['memory'] += float( quantity.parse_quantity(c.resources.limits['memory']))
                if 'nvidia.com/gpu' in c.resources.limits :
                    gNode_status[node_name]['limits']['nvidia.com/gpu'] += int(c.resources.limits['nvidia.com/gpu'])
    
    node_list = v1.list_node(watch=False)
    for node in node_list.items:
        
        gNode={}
        gNode['cluster_name'] = cluster_name 
        gNode['node_id'] = cluster_name + ':' + node.metadata.name    
        labels = node.metadata.labels
        gNode['node_labels'] = labels

        if 'node-role.kubernetes.io/master' in labels:
            gNode['node_type'] = 'master'
        else :
            gNode['node_type'] = 'worker'
        
        gNode['node_name'] = node.metadata.name            
        
        gNode['node_host'] = None
        address_list = node.status.addresses
        for temp_address in address_list:
            if temp_address.type == 'InternalIP':
                gNode['node_host'] = temp_address.address
        
        gNode['capacity']={'cpu':0,'memory':0,'nvidia.com/gpu':0 }
        if 'cpu' in node.status.capacity :
            gNode['capacity']['cpu'] = float(quantity.parse_quantity(node.status.capacity['cpu']))
        if 'memory' in node.status.capacity :
            gNode['capacity']['memory'] = float(quantity.parse_quantity(node.status.capacity['memory']))
        if 'nvidia.com/gpu' in node.status.capacity :
            gNode['capacity']['nvidia.com/gpu'] = int(node.status.capacity['nvidia.com/gpu']) 
       
        gNode['allocatable']={'cpu':0,'memory':0,'nvidia.com/gpu':0 }
        if 'cpu' in node.status.allocatable :
            gNode['allocatable']['cpu'] = float(quantity.parse_quantity(node.status.allocatable['cpu'])) 
        if 'memory' in node.status.allocatable :
            gNode['allocatable']['memory'] = float(quantity.parse_quantity(node.status.allocatable['memory'])) 
        if 'nvidia.com/gpu' in node.status.allocatable :
            gNode['allocatable']['nvidia.com/gpu'] = int(node.status.allocatable['nvidia.com/gpu']) 
        try :
            gNode['requests'] = gNode_status[node.metadata.name]['requests']
            gNode['limits']   = gNode_status[node.metadata.name]['requests']
        except:
            gNode['requests'] = None
            gNode['limits']   = None    
       
        gNode_list.append(gNode)
    print('gNode_list',gNode_list)
    return gNode_list

def get_gWorkerNode_list():
    gWorkerNode_list = []
    ret = v1.list_node(watch=False)
    for node in ret.items:
        address_list = node.status.addresses
        for temp_address in address_list:
            if temp_address.type == 'InternalIP':
                print("get_gWorkerNode_list",temp_address.address)
                node_dic = {}
                #node_dic["uid"] = node.metadata.uid
                node_dic['node_name'] = node.metadata.name
                node_dic['node_ip'] = temp_address.address
                gWorkerNode_list.append(node_dic)
    return gWorkerNode_list 

''' =====================================================
        gService 
        {   
            'namespace':namespace_name,
            'service_name':service_name,
            'service_type':service_type,
            'access_host':access_host, 
            'access_port':access_port   
        }
======================================================'''
def get_gService_list_with_k8s(namespace=gDefine.GEDGE_SYSTEM_NAMESPACE):
    
    return_gServices_list=[]
    res_services = v1.list_namespaced_service(namespace=namespace, pretty=True)
    
    for i in res_services.items:
        service_name = None
        service_type = None
        access_host  = None
        access_port  = None
        print('======================================================================================')
        print('service_name=', i.metadata.name)
        print('service_type=', i.spec.type)
        service_name = i.metadata.name
        service_type = i.spec.type
        if i.status.load_balancer.ingress :
            print('access_host=', i.status.load_balancer.ingress[0].ip)
            access_host = i.status.load_balancer.ingress[0].ip
        else :
            print('access_host= None') 
            access_host = None  
        if service_type == 'NodePort' :
            cluster_masternode_ip = None
            cluster_masternode_ip = gKube.get_cluster_masternode_ip()
            if cluster_masternode_ip != None :
                access_host = cluster_masternode_ip

            for j in i.spec.ports:
                if j.node_port :
                    print("access_port", j.node_port)
                    access_port = j.node_port
                    break
        else :

            for j in i.spec.ports:
                if j.port :
                    print("access_port", j.port)
                    access_port = j.port
                    break
        print('**************************************************************************************')

        gService_dic = {'namespace' : namespace,
                       'service_name':service_name,
                       'service_type':service_type,
                       'access_host':access_host, 
                       'access_port':access_port 
                      }
        return_gServices_list.append(gService_dic)
    return return_gServices_list

def find_service_from_gService_list(namespace, service_name) :
    return_val=None
    gService_list = get_gService_list_with_k8s(namespace)
    for i in gService_list:
        if i['service_name'] == service_name :
            return_val = i 
            return return_val 
    return return_val 

def find_service_from_gService_list_with_rest_api(namespace,service_name):
    return_val=None
    while(1) :
        # GET MONGODB IP & PORT BY REST API
        # until all service are ready  
        try :
            print('111111111111111111')
            res = requests.get(gDefine.PLATFORM_INFO_PREFIX+str('/platformServices/namespaces/')+str(namespace)+str('/services/')+str(service_name))
            print('22222222222222222222222')
        except:
            print('wait rest api service of platform info',gDefine.PLATFORM_INFO_PREFIX+str('/platformServices/namespaces/')+str(namespace)+str('/services/')+str(service_name))
            time.sleep(5) 
            continue
        
        if res.status_code == 200 :
            print('2')
            print('res=',res)
            data = res.json()
            print('data = ',data)
            #request_data_dic = json.loads(res.json())
            #print('request_data_dic',request_data_dic)
            return_val = data['result']
            print('return_val',return_val)
            break
        else :
            print('wait gService_list result from rest api of platform info',gDefine.PLATFORM_INFO_PREFIX+str('/platformServices'))
            time.sleep(5) 
            continue
    return return_val 
    
def get_host_and_port_from_gService_list(namespace,service_name ):
    return_services_list = get_gService_list_with_k8s(namespace)
    for i in return_services_list:
        if i['service_name'] == service_name :
            return i['access_host'], i['access_port']
    return None, None   