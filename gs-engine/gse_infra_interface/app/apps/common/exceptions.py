"""[summary]
Custom Execption for the System
"""
from werkzeug.exceptions import Unauthorized

class Error(Exception):
    """[summary]
    Custom Error Handling Class
    Args: 
        Exception ([Exception]): [Default Exception]
    """
    def __init__(self, message, code=None, fault=None):
        """[summary]
        Error class initialization
        Args:
            message ([string]): [Error Message Text]
            code ([int], optional): [Error Code]. Defaults to None.
            fault ([string], optional): [Reason for error]. Defaults to None.
        """
        super(Error, self).__init__(message)
        self.code = code
        self.fault = fault

class SessionError(Unauthorized):
    """[summary]
    Custom Session Error Handling Class
    Args:
        Unauthorized ([string]): [Reason for Session Error]
    """
    pass