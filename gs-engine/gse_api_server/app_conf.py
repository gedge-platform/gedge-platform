import logging.handlers


class DBConf:
    user = 'etri'
    passwd = '1234'
    host = 'localhost'
    db = 'cloud_edge'
    charset = 'utf8'


class Log:
    log_level = 10  # FATAL = 50, ERROR = 40, WARNING = 30, INFO = 20, DEBUG = 10, NOTSET = 0
    log_max_size = 1024 * 1000
    log_backup_count = 10  # 10MB
    log_format = '%(asctime)s [%(levelname)s] %(filename)s:%(lineno)s => %(message)s'

    @classmethod
    def get_logger(cls, name):
        # set logger
        logger = logging.getLogger(name)
        path = f'./logs/{name}.log'
        file_handler = logging.handlers.RotatingFileHandler(
            path, maxBytes=Log.log_max_size, backupCount=Log.log_backup_count
        )
        log_format = logging.Formatter(Log.log_format, "%Y-%m-%d %H:%M:%S")

        file_handler.setFormatter(log_format)
        logger.addHandler(file_handler)
        logger.setLevel(Log.log_level)

        stream_handler = logging.StreamHandler()
        stream_handler.setFormatter(log_format)
        logger.setLevel(Log.log_level)
        logger.addHandler(stream_handler)
        return logger


class RouteConf:
    namespace = "edge"
    service_name = "gse-gateway-service"
    host = "129.254.202.139:18080"

