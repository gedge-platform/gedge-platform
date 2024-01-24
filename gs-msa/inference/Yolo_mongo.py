from pymongo import MongoClient
from pymongo.cursor import CursorType
from tqdm import tqdm
import os
import json
import Yolo_define as yDefine

class DBHandler:
    def __init__(self):
        # host = "localhost"
        # host = '129.254.202.249'
        # port = "27017"
        host = os.environ['MONGODB_IP']
        port = int(os.environ['MONGODB_PORT'])
        userid = os.environ['MONGODB_ID']
        password = os.environ['MONGODB_PW']
        self.client = MongoClient(host, int(port), username=userid, password=password)

    def insert_item_one(self, datum, db_name=None, collection_name=None):
        result = self.client[db_name][collection_name].insert_one(datum).inserted_id
        return result

    def insert_item_many(self, data, db_name=None, collection_name=None):
        result = self.client[db_name][collection_name].insert_many(data).inserted_ids
        return result

    def find_item_one(self, condition=None, db_name=None, collection_name=None):
        result = self.client[db_name][collection_name].find_one(condition, {"_id": False})
        return result

    def find_item(self, condition=None, db_name=None, collection_name=None):
        result = self.client[db_name][collection_name].find(condition, {"_id":False}, no_cursor_timeout=True,
                                                      cursor_type=CursorType.EXHAUST)
        return result

    def delete_item_one(self, condition=None, db_name=None, collection_name=None):
        result = self.client[db_name][collection_name].delete_one(condition)
        return result

    def delete_item_many(self, condition=None, db_name=None, collection_name=None):
        result = self.client[db_name][collection_name].delete_many(condition)
        return result

    def update_item_one(self, condition=None, update_value=None, db_name=None, collection_name=None):
        result = self.client[db_name][collection_name].update_one(filter=condition, update=update_value)
        return result

    def update_item_many(self, condition=None, update_value=None, db_name=None, collection_name=None):
        result = self.client[db_name][collection_name].update_many(filter=condition, update=update_value)
        return result

    def text_search(self, text=None, db_name=None, collection_name=None):
        result = self.client[db_name][collection_name].find({"$text": {"$search": text}})
        return result

    def create_index(self, db_name=None, collection_name=None, field_name=None, direction=1):
        # direction 1 : ASCENDING(default) , -1 : DESCENDING, TEXT : 'text'
        result = self.client[db_name][collection_name].create_index([(field_name, direction)])
        return result

    def print_col(self, db_name=None, collection_name=None):
        for y in self.client[db_name][collection_name].find():
            print(y)

#    def print_col_log(self, db_name=None, collection_name=None):
#        for y in self.client[db_name][collection_name].find():
#            yDefine.log.logger.info(' | ' + json.dumps(y))

'''
DBHandler Usage Example

mongo = DBHandler()
print(mongo)

mongo.delete_item_many({}, "test", "test")
mongo.create_index('test', 'test', 'text', 'text')

mongo.insert_item_one({"text": "Hello Python"}, "test", "test")
mongo.insert_item_one({"text": "Hello World"}, "test", "test")
mongo.insert_item_one({"text": "Hello JAVA"}, "test", "test")
mongo.insert_item_one({"text": "Python World"}, "test", "test")

cursor = mongo.find_item_one({"text": "Hello Python"}, "test", "test")

mongo.update_item_one({"text": "Hello Python"}, {"$set": {"text": "Hello Kotlin"}}, "test", "test")
cursor = mongo.find_item_one({"text": "Hello Kotlin"}, "test", "test")
print(cursor, "!!!!!")

cursor = mongo.text_search("Hello", "test", "test")
print(cursor, "!!!!")

for ele in cursor:
    print(ele)

mongo.delete_item_one({"text": "Hello Kotlin"}, "test", "test")

'''
'''
json_list = { "number" : 1,
              "Name" : }


def makeJsonList():#csv_file)
    json_list = []
    for i in tqdm(range(len()))
'''
