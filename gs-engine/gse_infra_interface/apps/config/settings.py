"""[summary]
Setting Value for System
"""
PLATFORM_SECRET_KEY = '*****'
USE_URL_SLASH_YN = False

# PATH
TEMPLATE_PATH = 'apps/web/templates'
STATIC_PATH = 'apps/web/statics'

# REDIS CONFIG
REDIS_CACHE_HOST = 'localhost'
REDIS_CACHE_PORT = ****

# MONGODB CONFIG
MONGODB_HOST = 'mongodb://root:cloud12@localhost:27017/'
MONGODB_NAME = 'gedge'

# DEFAULT_ACCOUNT
ACCOUNTS = [
    { 'user_id': 'admin', 'password': '****', 'user_role': 'ADMIN'},
    { 'user_id': 'user1', 'password': '****', 'user_role': 'USER'},
    { 'user_id': 'user2', 'password': '****', 'user_role': 'USER'}
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
