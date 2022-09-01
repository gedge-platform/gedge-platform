"""[summary]
MongoDB Access Module
"""
from pymongo import MongoClient
from apps.config import settings
from apps.common.statics import ACCOUNT_COLLECTION

class DB(object):
    """[summary]
    MongoDB Access Class
    Args:
        object ([obj]): [DB Object, Defaults to None.]
    """
    def __new__(cls):
        if not hasattr(cls,'instance'):
            db_client = MongoClient(settings.MONGODB_HOST)
            db = db_client[settings.MONGODB_NAME]
            cls.instance = db
        return cls.instance

