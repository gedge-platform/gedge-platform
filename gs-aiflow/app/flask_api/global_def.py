
from flask_api import Namespace

g_var = Namespace()

g_var.db = None
g_var.mycon = None

class Config(object):
    def __init__(self):
        self.__dict__ = {}
config =  Config()
