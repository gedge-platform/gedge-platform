"""[summary]
A module in which cache functions are defined for the entire system.
"""
from flask import current_app
from redis import StrictRedis, RedisError
from apps.config import settings
from apps.common.exception import *


class Cache:
    """[summary]
    Define Cache Class the entire system 
    """
    handler = None
    def __init__(self, db_index=0):
        self.handler = StrictRedis(
            host=settings.REDIS_CACHE_HOST,
            port=settings.REDIS_CACHE_PORT,
            db=db_index
        )

    def check_init(self):
        """[summary]
        Check handler before Check Cache Function
        Returns:
            [bool]: [Status of handler]
        """
        if self.handler is None:
            return False
        return True

    def clear(self):
        """[summary]
        Clear Cache Function
        Raises:
            Error: [CacheDB Not Connected]
        """
        if self.check_init() == False:
            raise Error('CacheDB is not connected. system error.', 500)

        try:
            self.handler.flushdb()
        except RedisError as e:
            pass
    
    def get_value(self, key):
        """[summary]
        Get Handler Value Function
        
        Args:
            key ([string]): [Get value to Key]

        Raises:
            Error: [CacheDB Not Connected]

        Returns:
            [bool]: [Value for Key]
        """
        if self.check_init() == False:
            raise Error('CacheDB is not connected. system error.', 500)

        if key is None:
            return None
        
        return self.handler.get()

    def set_value(self, key, value, ex_second=-1):
        """[summary]
        Get Handler Value Function
        
        Args:
            key ([string]): [Set Data to Key]
            value ([string]): [Set Data to Value]
            ex_second (int, optional): [Set cache retention time]. Defaults to -1. -1 is infinite

        Raises:
            Error: [CacheDB Not Connected]

        Returns:
            [bool]: [Result of Processing]
        """
        if self.check_init() == False:
            raise Error('CacheDB is not connected. system error.', 500)
        
        if key is None:
            return False
        
        try:
            if ex_second <= 0:
                self.handler.set(key, value)
            else:
                self.handler.setex(key, value, ex_second)
        except RedisError as e:
            return False

        return True
            