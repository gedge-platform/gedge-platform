import pymongo
from pymongo import MongoClient
import GE_GSCH_define_ca as gcaDefine
'''
============================================================================
Mongo_DB : clusters information 
============================================================================
[ { 'cluster_name':'c1', 'host_name':'c1', 'cluster_ip':'129.111.123.120', 
    'worker_nodes':[ {'worker_node_name':'w1','worker_node_ip','129.111.123.121'},
                     {'worker_node_name':'w2','worker_node_ip','129.111.123.122'}
                   ] 
  },

  { 'cluster_name':'c2', 'host_name':'c2', 'cluster_ip':'129.111.123.130', 
    'worker_nodes':[ {'worker_node_name':'w1','worker_node_ip','129.111.123.131'},
                     {'worker_node_name':'w2','worker_node_ip','129.111.123.132'}
                   ] 
  }
]
'''
class metaData:
    def __init__(self, ip='localhost', port=27017):
        self.client = MongoClient(ip, port)
        self.front_db = self.client[gcaDefine.MONGO_DB_NAME_FRONT_SERVER]
        self.front_services_col = self.front_db[gcaDefine.MONGO_DB_COLLECTION_FRONT_SERVER_SERVICES]
        self.cluster_db = self.client[gcaDefine.MONGO_DB_NAME_CLUSTER_INFO]
        self.cluster_col = self.front_db[gcaDefine.MONGO_DB_COLLECTION_CLUSTER_INFO]
        
    def set_front_services(self,info_dic):
        self.front_services_col.insert_one(info_dic)
        
    def get_front_services(self,service_name) :
        result = self.front_services_col.find_one({'SERVICE_NAME':service_name})
        print(result)
        return result
    
    def list_front_services(self):
        cursor = self.front_services_col.find({})
        for document in cursor:
            print(document)

    def drop_front_services(self):
        self.front_services_col.drop()


    
    def set_cluster_info(self,cluster_info_dic):
        self.cluster_col.replace_one({'cluster_name': cluster_info_dic['cluster_name']}, cluster_info_dic, upsert=True )

    def get_cluster_info(self,cluster_name):
        result = self.cluster_col.find_one({ 'cluster_name':cluster_name})
        print(result)
        return result
    
    def list_cluster_info(self):
        cursor = self.cluster_col.find({})
        for document in cursor:
            print(document)
            
    def drop_cluster_info(self):
        self.cluster_col.drop()
