import logging
import logging.handlers
import os

from common.log_handler import DailyRotatingFileHandler


logger_name = ''
log_initialize = False


def initialize_logger(configClass=None):
    global logger_name
    global log_initialize

    config = None
    if configClass != None:
        config = configClass.__dict__
    if log_initialize:
        return

    if 'module_name' in config:
        logger_name = config['module_name']
    else:
        logger_name = "AIFLOW_SERVER"

    log_format = logging.Formatter('[%(asctime)s]-[%(levelname)s]-[%(process)d:%(thread)d] > %(message)s')

    logger = logging.getLogger(logger_name)

    # file log handler
    if 'file_log_enable' in config and config['file_log_enable']:
        log_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../log'))
        log_file_path = os.path.join(log_dir, "{}.log".format(logger_name))
        if 'log_file_path' in config:
            log_file_path = '{}/{}.log'.format(config['log_file_path'], config['module_name'])

        log_backup_count = 10
        if 'log_backup_count' in config:
            log_backup_count = int(config['log_backup_count'])

        if not os.path.exists(os.path.dirname(log_file_path)):
            os.makedirs(os.path.dirname(log_file_path))

        if 'log_by_date' in config and config['log_by_date']:
            handler = DailyRotatingFileHandler(log_file_path,
                                               backupCount=config['log_backup_count'],
                                               encoding='utf-8',
                                               delay=True)
        else:
            file_log_max_bytes = 1024 * 1024 * 100     # 100MB
            if 'file_log_max_mb' in config:
                file_log_max_bytes = 1024 * 1024 * int(config['file_log_max_mb'])

            handler = logging.handlers.RotatingFileHandler(log_file_path,
                                                           maxBytes=file_log_max_bytes,
                                                           backupCount=log_backup_count)
        handler.setFormatter(log_format)
        logger.addHandler(handler)

    # console log handler
    if 'console_log_enable' in config and config['console_log_enable']:
        handler = logging.StreamHandler()
        handler.setFormatter(log_format)
        logger.addHandler(handler)

    # set log level
    if 'log_level' in config:
        log_level = config['log_level'].upper()
        if log_level == 'DEBUG':
            logger.setLevel(logging.DEBUG)
        elif log_level == 'INFO':
            logger.setLevel(logging.INFO)
        elif log_level == 'WARNING':
            logger.setLevel(logging.WARNING)
        elif log_level == 'ERROR':
            logger.setLevel(logging.ERROR)
        elif log_level == 'CRITICAL':
            logger.setLevel(logging.CRITICAL)
    else:
        logger.setLevel(logging.INFO)

    log_initialize = True


def get_logger():
    global logger_name
    return logging.getLogger(logger_name)
