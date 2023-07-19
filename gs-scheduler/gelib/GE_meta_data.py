import sys
sys.path.append('../def')

import pymongo
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError
import GE_define as gDefine
import datetime

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
            self.platform_user_col.create_index("user_name", unique=True)
            print('self.platform_user_col',self.platform_user_col)
            
            self.platform_wsapce_col = self.platform_info_db[gDefine.GEDGE_PLATFORM_WSPACE_INFO_MONGO_DB_COL]
            self.platform_wsapce_col.create_index("workspace_name", unique=True)
            print('self.platform_wsapce_col',self.platform_wsapce_col)

            self.platform_project_col = self.platform_info_db[gDefine.GEDGE_PLATFORM_PROJECT_INFO_MONGO_DB_COL]
            self.platform_project_col.create_index("project_uid", unique=True)
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
                workspaces : [ws1,ws2],
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
           return None
        return result
        
    def set_user_info(self,data_dic):
        ## update and insert 
        print('set_user_info with :',data_dic)
        try:
            result=self.platform_user_col.update_many({'user_name': data_dic['user_name']},{'$set':data_dic},upsert=True)
        except:
           print('error : set_user_info ')
           return None
        return result
    
    def delete_user_info(self,user_name):
        ##delete
        print('delete_user_info with :',user_name)
        try:
            result=self.platform_user_col.delete_one({'user_name': user_name})
        except:
           print('error : delete_user_info ')
           return None
        return result
    
    def get_user_info(self,user_name) :
        print('user_name',user_name)
        try:
            result = self.platform_user_col.find_one({'user_name':user_name},{'_id':0})
        except:
           print('error : get_user_info ')
           return None
        print('get_user_info',user_name, result)
        return result

    def get_user_info_list(self):
        return_list=[]
        cursor = self.platform_user_col.find({},{'_id':0})
        for document in cursor:
            print('cursor=>',document)
            return_list.append(document)
        return return_list
    
    def set_user_info_with_workspace(self,user_name,new_workspace_name):
        ## read and update
        current_data=self.get_user_info(user_name)
        if current_data != None :
            print('current_user_info with :',current_data)
            ## add workspace 
            if new_workspace_name not in current_data['workspaces']:
               current_data['workspaces'].append(new_workspace_name)
            ## update time 
            current_data['cdate']= datetime.datetime.now()
            print('updated_user_info with :',current_data)
            self.platform_user_col.update_many({'user_name': user_name},{'$set':current_data},upsert=True)
            return current_data
        else :
            return None
    
    def drop_user_info(self):
        print('start drop_user_info')
        self.platform_user_col.drop()
        print('end drop_user_info')   
    
    '''-----------------------------------------------
            WORKSPACE INFO {
                workspace_name : ws1,
                workspace_uid : wuid1 
                selected_clusters : [c1,c2],
                workspace_status : s1,
                owner: user_name,
                projects : [p1,p2],
                cdate : cd1 
            }
    -----------------------------------------------'''  
    def create_new_workspace_info(self,data_dic):
        ## insert 
        print('create_new_workspace_info with :',data_dic)
        result=None
        try:
           result=self.platform_wsapce_col.insert_one(data_dic)
        except DuplicateKeyError as e:
           print("create_new_workspace_info error : DuplicateKeyError", e)
        return result
    
    def set_workspace_info(self,data_dic):
        ## update and insert 
        print('set_workspace_info with :',data_dic)
        self.platform_wsapce_col.update_many({'workspace_name': data_dic['workspace_name']},{'$set':data_dic},upsert=True)
    
    def get_workspace_info(self,workspace_name) :
        print('workspace_name',workspace_name)
        result = self.platform_wsapce_col.find_one({'workspace_name':workspace_name},{'_id':0})
        print('get_workspace_info',workspace_name, result)
        return result
    
    def get_workspace_info_list_by_username(self,user_name) :
        print('user_name',user_name)
        return_list=[]
        results = self.platform_wsapce_col.find({'owner':user_name},{'_id':0})
        for r in results:
            print('result =>',r)
            return_list.append(r)
        print('get_workspace_info_list_by_username',user_name, return_list)
        return return_list
    
    def isowner_of_workspace(self,workspace_name,user_name) :
        print('workspace_name',workspace_name)
        print('user_name',user_name)
        result = self.platform_wsapce_col.find( {'$and': [ {'workspace_name': workspace_name}, {'owner': user_name} ] },{'_id':0})
        print('isowner_of_workspace', result)
        return result

    def get_workspace_info_list(self):
        return_list=[]
        results = self.platform_wsapce_col.find({},{'_id':0})
        for r in results:
            print('result =>',r)
            return_list.append(r)
        print('get_workspace_info_list', return_list)
        return return_list
    
    def set_workspace_info_with_project(self,workspace_name,new_project_name):
        ## read and update
        current_data=self.get_workspace_info(workspace_name)
        if current_data != None :
            print('current_workspace_info with :',current_data)
            ## add project 
            if new_project_name not in current_data['projects']:
               current_data['projects'].append(new_project_name)
            ## update time 
            current_data['cdate']= datetime.datetime.now()
            print('updated__workspace_info with :',current_data)
            self.platform_wsapce_col.update_many({'workspace_name': workspace_name},{'$set':current_data},upsert=True)
            return current_data
        else :
            print('error : set_workspace_info_with_project with :',workspace_name)
            return None
    
    def drop_workspace_info(self):
        print('start drop_workspace_info')
        self.platform_wsapce_col.drop()
        print('end drop_workspace_info')   
    
    '''-----------------------------------------------
            PROJECT INFO {
                project_name : p1
                project_uid : ‘user1:ws1:p1’
                user_name : user1,
                workspace_name: ws1,
                namespace: p1-wuid1        
                selected_clusters: [c1,c2],
                project_status: s1, 
                cdate: cd1
            }
    -----------------------------------------------'''  
    def create_new_project_info(self,data_dic):
        print('create_new_project_info with :',data_dic)
        result=None
        ## find workspace 
        found_workspace = self.get_workspace_info(data_dic['workspace_name'])
        if found_workspace : 
            ## check issubset
            is_subset = set(data_dic['selected_clusters']).issubset(set(found_workspace['selected_clusters']))
            if is_subset : 
                ## create namespace at k8s for project 
                for cluster in data_dic['selected_clusters'] :
                    print('create namespace') 
                    ## create namespace with topic  
                ## insert 
                try:
                    result=self.platform_project_col.insert_one(data_dic)
                except DuplicateKeyError as e:
                    print("create_new_project_info error : DuplicateKeyError", e)
                return result
        else :
            return result 
    
    def set_project_info(self,data_dic):
        ## update and insert 
        print('set_project_info with :',data_dic)
        self.platform_project_col.update_many({'project_uid': data_dic['project_uid']},{'$set':data_dic},upsert=True)
    
    def get_project_info(self,project_uid) :
        print('project_uid',project_uid)
        result = self.platform_project_col.find_one({'project_uid':project_uid},{'_id':0})
        print('get_project_info',project_uid,result)
        return result

    def get_project_info_list(self):
        return_list=[]
        cursor = self.platform_project_col.find({},{'_id':0})
        for document in cursor:
            print('cursor=>',document)
            return_list.append(document)
        return return_list
    
    def set_project_info_with_project(self,workspace_name,new_project_name):
        ## read and update
        current_data=self.get_workspace_info(workspace_name)
        if current_data != None :
            print('current_workspace_info with :',current_data)
            ## add project 
            if new_project_name not in current_data['projects']:
               current_data['projects'].append(new_project_name)
            ## update time 
            current_data['cdate']= datetime.datetime.now()
            print('updated__workspace_info with :',current_data)
            self.platform_project_col.update_many({'workspace_name': workspace_name},{'$set':current_data},upsert=True)
            return current_data
        else :
            return None
    
    def drop_project_info(self):
        print('start drop_workspace_info')
        self.platform_project_col.drop()
        print('end drop_workspace_info')   
    
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
        self.platform_cluster_col.update_many({'cluster_name': data_dic['cluster_name']},{'$set':data_dic},upsert=True)
    
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
    
    def issubset_clusters(self, check_cluster_list):
        current_cluster_list=[]
        cursor = self.platform_cluster_col.find({},{'_id':0})
        for c in cursor:
            print('cursor=>',c)
            current_cluster_list.append(c['cluster_name'])
        if len(current_cluster_list) !=0 and len(check_cluster_list) !=0 :
            set1 = set(current_cluster_list)
            set2 = set(check_cluster_list)
            if set2.issubset(set1):
                return True
            else :
                return False
        else:
            return False
        
    def drop_cluster_info(self):
        print('start drop_cluster_info')
        self.platform_cluster_col.drop()
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
        self.platform_node_col.update_many({'node_id': data_dic['node_id']},{'$set':data_dic},upsert=True)
        print('set_node_info with :',data_dic)
    
    def get_node_info(self,cluster_name,node_name) :
        print('cluster_name',cluster_name)
        print('node_name',node_name)
        find_node_id = cluster_name+':'+node_name
        result = self.platform_node_col.find_one({'node_id':find_node_id},{'_id':0})
        print('get_node_info',find_node_id, result)
        return result
    
    def get_node_info_by_node_type(self,cluster_name,node_type) :
        print('cluster_name',cluster_name)
        print('node_type',node_type)
        result = self.platform_node_col.find_one( {'$and':[{'cluster_name':cluster_name},{'node_type':node_type}]},{'_id':0} )
        print('get_node_info_by_node_type',cluster_name, node_type, result)
        return result
    def get_node_info_list_by_clustername(self,cluster_name):
        return_list=[]
        cursor = self.platform_node_col.find({'cluster_name':cluster_name},{'_id':0})
        for document in cursor:
            print('cursor=>',document)
            return_list.append(document)
        return return_list

    def get_node_info_list(self):
        return_list=[]
        cursor = self.platform_node_col.find({},{'_id':0})
        for document in cursor:
            print('cursor=>',document)
            return_list.append(document)
        return return_list

    def drop_node_info(self):
        print('start drop_node_info')
        self.platform_node_col.drop()
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
        self.platform_service_col.drop()
        print('end drop_platform_service_info')
    
    def get_platform_namespaced_service(self,namespace_name, service_name) :
        print('namespace service_name',namespace_name,service_name)
        result = self.platform_service_col.find_one({'$and':[{'namespace':namespace_name},{'service_name':service_name}]},{'_id':0})
        print('get_platform_namespaced_service',namespace_name,service_name, result)
        return result
    
    def set_platform_namespaced_service(self,data_dic):
        self.platform_service_col.update_many({'$and':[{'namespace':data_dic['namespace']},{'service_name':data_dic['service_name']}]},{'$set':data_dic},upsert=True)
        print('data_dic',data_dic)
    
    def get_platform_namespaced_service_list(self,namespace_name):
        return_list=[]
        cursor = self.platform_service_col.find({'namespace':namespace_name},{'_id':0})
        for document in cursor:
            print('cursor=>',document)
            return_list.append(document)
        return return_list
    
    def get_platform_service_list(self):
        return_list=[]
        cursor = self.platform_service_col.find({},{'_id':0})
        for document in cursor:
            print('cursor=>',document)
            return_list.append(document)
        return return_list
    
    def delete_platform_namespaced_service(self,namespace_name,service_name):
        print('start delete_platform_namespaced_service')
        query = {'$and':[{'namespace':namespace_name},{'service_name':service_name}]}
        r = self.platform_service_col.delete_one(query)
        print('end delete_platform_namespaced_service')
        return r  
    
    def delete_platform_namespaced_service_by_namespacename_regex(self,namespace_name):
        print('start delete_platform_namespaced_service_by_namespacename_regex')
        query = {'namespace':{'$regex': namespace_name}}
        r = self.platform_service_col.delete_many(query)
        print('end delete_platform_namespaced_service_by_namespacename_regex:',r)
        return r   
    
    def delete_platform_namespaced_service_by_namespacename(self,namespace_name):
        print('start delete_platform_namespaced_service_by_namespacename')
        query = {'namespace':namespace_name}
        r = self.platform_service_col.delete_many(query)
        print('end delete_platform_namespaced_service_by_namespacename')
        return r  
    
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
        self.platform_gsch_policy_col.update_many({'policy_name': data_dic['policy_name']},{'$set':data_dic},upsert=True)
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
    
    def drop_platform_gsch_policy_info(self):
        print('start drop_platform_gsch_policy_info')
        self.platform_gsch_policy_col.drop()
        print('end drop_platform_gsch_policy_info')