"""[summary]
Module where Database Access Object Base is defined
"""
from apps.common.statics import *
from apps.common.database import *

class DaoBase:
    """[summary]
    Define Database Access Object Class
    """
    id = None
    collection = None
    
    def __init__(self, **kwargs):
        self.id = kwargs.get('_id')
        if getattr(self, 'collection') and self.collection:
            self.db = DB()[self.collection]
            if not self.id:
                result = self.db.find_one(kwargs)
                if result:
                    self.id = result.get('_id')
        else:
            self.db = None
        
    @classmethod
    def get(cls, **ft):
        """[summary]
        Define Dao get Command
        
        Returns:
            [json]: [Result Value of get Method Function]
        """
        db = DB()[cls.collection]
        result = db.find_one(ft)
        if result:
            return cls(**result)
        else:
            return None
        
    @classmethod
    def list(cls, **ft):
        """[summary]
        Define Dao list Command
        
        Returns:
            [json]: [Result Value of list Method Function]
        """
        data_list = []
        db = DB()[cls.collection]
        result_list = list(db.find())
        for result in result_list:
            data_list.append(cls(**result))
        return data_list
    
    @classmethod
    def create(cls, data):
        """[summary]
        Define Dao create Command
        
        Returns:
            [json]: [Result Value of create Method Function]
        """
        db = DB()[cls.collection]
        if isinstance(data, list):
            data_list = []
            results = db.insert_many(data)
            for result in results:
                inserted_data = db.find_one({'_id':result.inserted_id})
                data_list.append(inserted_data)
            return data_list
        elif isinstance(data, dict):
            result = db.insert_one(data)
            inserted_data = db.find_one({'_id':result.inserted_id})
            return inserted_data
        else:
            return None

    @classmethod
    def count(cls, **ft):
        """[summary]
        Define Dao count Command
        
        Returns:
            [int]: [Result Value of count Method Function]
        """
        db = DB()[cls.collection]
        return db.count(ft)
    
    @classmethod
    def delete(cls, **ft):
        """[summary]
        Define Dao delete Command
        
        Returns:
            [bool]: [Result Value of delete Method Function]
        """
        db = DB()[cls.collection]
        result = db.delete_one(ft)
        if result.deleted_count > 0:
            return True
        else:
            return False
    
    @classmethod
    def reset(cls, **ft):
        """[summary]
        Define Dao reset Command
        
        Returns:
            [bool]: [Result Value of reset Method Function]
        """
        db = DB()[cls.collection]
        result = db.delete_many({})
        if result.deleted_count > 0:
            return True
        else:
            return False
    
    @classmethod
    def update(cls, id, data, **ft):
        """[summary]
        Define Dao update Command
        
        Returns:
            [bool]: [Result Value of update Method Function]
        """
        db = DB()[cls.collection]
        result = db.update_one(id, {"$set":data})
        if result.modified_count > 0:
            return True
        else:
            return False
        
        
        