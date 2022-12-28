"""[summary]
Log Module for Entire System
"""
import logging

log_manager = logging.getLogger('main')

def log_info(self, message='', code=''):
    """[summary]
    Info Level log Message
    Args:
        message (str, optional): [Log Message Text Data]. Defaults to ''.
        code (str, optional): [Log Level Code Data]. Defaults to ''.
    """
    log_message = '[' + str(code) + '] ' + message
    log_manager.info(log_message)

def log_warning(self, message='', code='', fault=''):
    """[summary]
    Warning Level log Message
    Args:
        message (str, optional): [Log Message Text Data]. Defaults to ''.
        code (str, optional): [Log Level Code Data]. Defaults to ''.
        fault (str, optional): [Warning Message Text Data]. Defaults to ''.
    """
    log_message = '[' + str(code) + '] ' + message
    log_manager.warning(log_message)

def log_error(self, message='', code='', fault=''):
    """[summary]
    Error Level log Message
    Args:
        message (str, optional): [Log Message Text Data]. Defaults to ''.
        code (str, optional): [Log Level Code Data]. Defaults to ''.
        fault (str, optional): [Error Message Text Data]. Defaults to ''.
    """
    log_message = '[' + str(code) + '] ' + message + ' Detail=' + fault
    log_manager.error(log_message)

def log_debug(self, message=''):
    """[summary]
    Debug Level log Message
    Args:
        message (str, optional): [Log Message Text Data]. Defaults to ''.
    """
    log_message = message
    log_manager.debug(log_message)
