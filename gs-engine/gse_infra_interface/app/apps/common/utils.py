"""[summary]
Entire System Util Module
"""
from functools import wraps
from pprint import pprint
import yaml
import json
import copy
import uuid
import traceback


def add_method(cls):
    """[summary]
    Add method to class function
    
    Args:
        cls ([class]): [class name to add method to]
    """
    def decorator(func):
        @wraps(func)
        def wrapper(self, *args, **kwargs):
            return func(self, *args, **kwargs)
        setattr(cls, func.__name__, wrapper)
        return func
    return decorator

def print_data(data):
    """
    Json Print function

    Args:
        data (_type_): _description_
    """
    pprint(data)

def has_duplicates(list):
    """
    Check Duplicate Funciton

    Args:
        list (_type_): _description_

    Returns:
        _type_: _description_
    """
    return len(list) != len(set(list))
