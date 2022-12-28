"""[summary]
Setting Value for System
"""
PLATFORM_SECRET_KEY = '****

# PATH
TEMPLATE_PATH = '/app/apps/web/templates'
STATIC_PATH = '/app/apps/web/statics'

# REDIS CONFIG
REDIS_CACHE_HOST = 'localhost'
REDIS_CACHE_PORT = 6379

# MONGODB CONFIG
MONGODB_HOST = 'mongodb://root:cloud12@mongo-svc:27017/'
MONGODB_NAME = 'gedge'

# DEFAULT_ACCOUNT
ACCOUNTS = [
    { 'user_name': 'admin', 'user_passwd': '****'},
    { 'user_name': 'user1', 'user_passwd': '****'}
]

# LOGGER CONFIG
LOG_PATH = '/var/www/gedge-web-server/logs/'
LOG_FILE = 'server.log'
LOGGER_CONFIG = {
    'version': 1,
    "disable_existing_loggers": False,
    'formatters': {
        'service_logger': {
            'format': '[%(asctime)s] %(levelname)s  %(message)s',
            'datefmt': '%d/%b/%Y %H:%M:%S'
        }
    },
    'handlers': {
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'service_logger',
        },
        'file_log': {
            'level': 'DEBUG',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': LOG_PATH + LOG_FILE,
            'encoding': 'utf-8',
            'formatter': 'service_logger',
        }
    },
    "loggers": {
        "main": {
            "level": "DEBUG",
            "handlers": ["console", "file_log"],
            "propagate": True
        }
    }
}
