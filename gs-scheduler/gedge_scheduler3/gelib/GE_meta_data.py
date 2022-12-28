import sys
sys.path.append('../def')

import pymongo
from pymongo import MongoClient
import GE_define as gDefine
'''
============================================================================
Mongo_DB : clusters information 
============================================================================

'''
class metaData:
    def __init__(self):
        print('init')
    def connect_mongodb(self, ip='localhost', port=27017):
        try :            
            self.client = MongoClient(ip, port)
            print('self.client',self.client)
            self.platform_db = self.client[gDefine.GEDGE_PLATFORM_MONGO_DB_NAME]
            print('self.platform_db',self.platform_db)

            self.platform_user_col = self.platform_db[gDefine.GEDGE_PLATFORM_USER_INFO_MONGO_DB_COL]
            print('self.platform_user_col',self.platform_user_col)
            self.platform_wsapce_col = self.platform_db[gDefine.GEDGE_PLATFORM_WSPACE_INFO_MONGO_DB_COL]
            print('self.platform_wsapce_col',self.platform_wsapce_col)

            self.platform_project_col = self.platform_db[gDefine.GEDGE_PLATFORM_PROJECT_INFO_MONGO_DB_COL]
            print('self.platform_project_col',self.platform_project_col)

            self.platform_service_col = self.platform_db[gDefine.GEDGE_PLATFORM_SERVICE_INFO_MONGO_DB_COL]
            print('self.platform_service_col',self.platform_service_col)

            self.platform_cluster_col = self.platform_db[gDefine.GEDGE_PLATFORM_CLUSTER_INFO_MONGO_DB_COL]
            print('self.platform_cluster_col',self.platform_cluster_col)

            self.platform_node_col = self.platform_db[gDefine.GEDGE_PLATFORM_NODE_INFO_MONGO_DB_COL]
            print('self.platform_node_col',self.platform_node_col)

            self.platform_network_col = self.platform_db[gDefine.GEDGE_PLATFORM_NETWORK_INFO_MONGO_DB_COL]
            print('self.platform_network_col',self.platform_network_col)

            self.platform_storage_col = self.platform_db[gDefine.GEDGE_PLATFORM_STORAGE_INFO_MONGO_DB_COL]
            print('self.platform_storage_col',self.platform_storage_col)

            self.platform_gsch_db = self.client[gDefine.GEDGE_PLATFORM_GSCH_MONGO_DB_NAME]
            print('self.platform_gsch_db',self.platform_gsch_db)

            self.platform_gsch_policy_col = self.platform_gsch_db[gDefine.GSCH_FRONT_SERVER_POLICY_MONGO_DB_COL]
            print('self.platform_gsch_policy_col',self.platform_gsch_policy_col)
            
        except:
            print('error: connect_mongodb')
            exit(0)
    '''-----------------------------------------------
             PLATFORM SERVICE {
                service_name : s1,
                service_type : balancer/nodeport
                access_host : host1,
                access_port : port1
             }
    -----------------------------------------------''' 

    def set_platform_service(self,data_dic):
        self.platform_service_col.insert_one(data_dic)
        print('data_dic',data_dic)
        
    def get_platform_service(self,service_name) :
        print('service_name',service_name)
        result = self.platform_service_col.find_one({'service_name':service_name},{'_id':0})
        print('get_platform_service',service_name, result)
        return result
    
    def get_platform_service_list(self):
        return_list=[]
        cursor = self.platform_service_col.find({},{'_id':0})
        for document in cursor:
            print('cursor=>',document)
            return_list.append(document)
        return return_list

    def drop_get_platform_service(self):
        print('start drop_get_platform_service')
        self.platform_service_col.drop()
        print('end drop_get_platform_service')
    
    
    '''-----------------------------------------------
             PLATFORM GSCH POLICY {
                policy_name : p1,
                filename: f1
                deployment_name: dn1,
                deployment_dic: d1,
                replicas :r1
             }
    -----------------------------------------------''' 
     
    def set_platform_gsch_policy(self,data_dic):
        self.platform_gsch_policy_col.insert_one(data_dic)
        print('data_dic',data_dic)
    
    def get_platform_gsch_policy(self,policy_name) :
        print('policy_name',policy_name)
        result = self.platform_gsch_policy_col.find_one({'policy_name':policy_name},{'_id':0})
        print('get_platform_gsch_policy',policy_name, result)
        return result

    def get_platform_gsch_policy_list(self):
        return_list=[]
        cursor = self.platform_gsch_policy_col.find({},{'_id':0})
        for document in cursor:
            print('cursor=>',document)
            return_list.append(document)
        return return_list
    
    def drop_platform_gsch_policy(self):
        print('start drop_platform_gsch_policy')
        self.platform_gsch_policy_col.drop()
        print('end drop_platform_gsch_policy')

    '''-----------------------------------------------
             CLUSTER INFO {
                cluster_name : c1,
                cluster_ip   : ip,
                cluster_type: baremetal/cloud,
                nodes: [n1,n2,n3],
            }
    -----------------------------------------------''' 
    def set_cluster_info(self,data_dic):
        ## update and insert 
        print('set_cluster_info with :',data_dic)
        self.platform_cluster_col.update_one({'cluster_name': data_dic['cluster_name']},{'$set':data_dic},upsert=True)
    
    def get_cluster_info(self,cluster_name) :
        print('cluster_name',cluster_name)
        result = self.platform_cluster_col.find_one({'cluster_name':cluster_name},{'_id':0})
        print('get_cluster_info',cluster_name, result)
        return result

    def get_cluster_info_list(self):
        return_list=[]
        cursor = self.platform_cluster_col.find({},{'_id':0})
        for document in cursor:
            print('cursor=>',document)
            return_list.append(document)
        return return_list
    
    def drop_cluster_info(self):
        print('start drop_cluster_info')
        self.platform_cluster_col.drop()
        print('end drop_cluster_info')