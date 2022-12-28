import sys
sys.path.append('../gelib')
import os
import logging
from logging import handlers

'''------------------------------------------------
              LOGGER
------------------------------------------------'''
logger = logging.getLogger('root')
formatter = logging.Formatter("%(asctime)s :%(levelname)s [%(filename)s:%(lineno)d-%(funcName)s] %(message)s")
file_handler = handlers.RotatingFileHandler(
    "GEdge_Scheduler_2022.log",
    maxBytes=(1024 * 1024 * 64),
    backupCount=3
)
file_handler.setFormatter(formatter)
logger.addHandler(file_handler) 
logger.setLevel(logging.DEBUG)

'''-----------------------------------------------
ErrorCode
-----------------------------------------------'''
ERROR_CODES = {
    'AccessDeniedException': {'Description': 'GEdge cannot invoke the service because of service access denial.', 'StatusCode': 502},
    'AuthorizationHeaderMalformed': {'Description': 'The authorization header you provided is invalid.', 'StatusCode': 400},
    'ExpiredToken': {'Description': 'The provided token has expired.', 'StatusCode': 400},
    'IncompleteBody': {'Description': 'You did not provide the number of bytes specified by the Content-Length HTTP header.', 'StatusCode': 400},
    'InvalidRange': {'Description': 'The requested range cannot be satisfied.', 'StatusCode': 416},
    'InvalidRequestContentException': {'Description': 'The request body could not be parsed as JSON.', 'StatusCode': 400},
    'InvalidSecurity': {'Description': 'The provided security credentials are not valid.', 'StatusCode': 403},
    'InvalidToken': {'Description': 'The provided token is malformed or otherwise invalid.', 'StatusCode': 400},
    'MaxMessageLengthExceeded': {'Description': 'Your request was too big.', 'StatusCode': 400},
    'MetadataTooLarge': {'Description': 'Your metadata headers exceed the maximum allowed metadata size. ', 'StatusCode': 400},
    'MethodNotAllowed': {'Description': 'The specified method is not allowed against this resource.', 'StatusCode': 405},
    'MissingContentLength': {'Description': 'You must provide the Content-Length HTTP header.', 'StatusCode': 411},
    'NotImplemented': {'Description': 'A header you provided implies serviceality that is not implemented.', 'StatusCode': 501},
    'RequestTimeout': {'Description': 'Your socket connection to the server was not read from or written to within the timeout period.', 'StatusCode': 400},
    'ResourceNotFoundException': {'Description': 'The resource (for example, a GEdge service or access policy statement) specified in the request does not exist.', 'StatusCode': 404},
    'ServiceInternalException': {'Description': 'The GEdge service encountered an internal error.', 'StatusCode': 500},
    'TokenRefreshRequired': {'Description': 'The provided token must be refreshed.', 'StatusCode': 400},
    'UnsupportedMediaTypeException': {'Description': 'The content type of the Invoke request body is not JSON.', 'StatusCode': 415},
    'Not Implemented' : {'Description': 'This request Rest API  is not implemented.', 'StatusCode': 501}
}
'''------------------------------------------------
              GEDGE PLATFORM
------------------------------------------------'''

GEDGE_SYSTEM_NAMESPACE   = 'gedge-system-scheduler'
GEDGE_PLATFORM_API_GATEWAY_HOST = '129.254.202.42'
GEDGE_PLATFORM_API_GATEWAY_PORT = int(31414)
#GEDGE_PLATFORM_API_GATEWAY_HOST = os.environ['API_GATEWAY_HOST']
#GEDGE_PLATFORM_API_GATEWAY_PORT = int(os.environ['API_GATEWAY_PORT'])
PLATFORM_INFO_PREFIX = str('http://')+str(GEDGE_PLATFORM_API_GATEWAY_HOST)+str(':')+str(GEDGE_PLATFORM_API_GATEWAY_PORT) + str('/GEP/INFO')
PLATFORM_GSCH_PREFIX = str('http://')+str(GEDGE_PLATFORM_API_GATEWAY_HOST)+str(':')+str(GEDGE_PLATFORM_API_GATEWAY_PORT) + str('/GEP/GSCH')

'''------------------------------------------------
              FRONT SERVER 
------------------------------------------------'''
GSCH_FRONT_SERVER_SERVICE_NAME  ='gedge-front-server-service'

'''------------------------------------------------
              KAFKA MESSAGE
------------------------------------------------'''

KAFKA_SERVICE_NAME    = "gedge-kafka-server-service"

KAFKA_ENDPOINT_IP     = None # will be set witn rest api 
KAFKA_ENDPOINT_PORT   = None # will be set witn rest api 
#KAFKA_SERVER_URL      = str(KAFKA_ENDPOINT_IP)+str(':')+str(KAFKA_ENDPOINT_PORT)
KAFKA_SERVER_URL      = None # will be set witn rest api 

'''-----------------------------------------------
             KAFKA TOPIC
-----------------------------------------------'''
GEDGE_GLOBAL_TOPIC_NAME = "gedge-global-topic"
GEDGE_API_TOPIC_NAME    = "gedge-api-topic"

'''-----------------------------------------------
              REDIS
-----------------------------------------------'''
REDIS_SERVICE_NAME    = "gedge-redis-service"
REDIS_POD_NAME        = "gedge-redis"
#REDIS_ENDPOINT_IP     = '129.254.202.126'
#REDIS_ENDPOINT_PORT   = 6379
REDIS_ENDPOINT_IP     = None # will be set witn rest api 
REDIS_ENDPOINT_PORT   = None # will be set witn rest api 
REDIS_YAML_KEY        = "gedge-gsch-request-yaml"

'''-----------------------------------------------
             MONGO DB 
-----------------------------------------------'''
MONGO_DB_SERVICE_NAME = 'gedge-mongo-0'
#MONGO_DB_ENDPOINT_IP   = '129.254.202.146'
#MONGO_DB_ENDPOINT_PORT = 27017
# set value from env of yaml
#MONGO_DB_ENDPOINT_IP   = os.environ['MONGODB_IP']
#MONGO_DB_ENDPOINT_PORT = int(os.environ['MONGODB_PORT'])
MONGO_DB_ENDPOINT_IP   = None  # will be set witn rest api 
MONGO_DB_ENDPOINT_PORT = None  # will be set witn rest api 

GEDGE_PLATFORM_MONGO_DB_NAME             = "gedge_platform_db"
GEDGE_PLATFORM_USER_INFO_MONGO_DB_COL    = "users_info"
GEDGE_PLATFORM_WSPACE_INFO_MONGO_DB_COL  = "workspaces_info"
GEDGE_PLATFORM_PROJECT_INFO_MONGO_DB_COL = "projects_info"
GEDGE_PLATFORM_SERVICE_INFO_MONGO_DB_COL = "platform_services_info"
GEDGE_PLATFORM_CLUSTER_INFO_MONGO_DB_COL = "clusters_info"
GEDGE_PLATFORM_NODE_INFO_MONGO_DB_COL    = "nodes_info"
GEDGE_PLATFORM_NETWORK_INFO_MONGO_DB_COL = "networks_info"
GEDGE_PLATFORM_STORAGE_INFO_MONGO_DB_COL = "storages_info"

GEDGE_PLATFORM_GSCH_MONGO_DB_NAME        = "gedge_platform_gsch_db"
GSCH_FRONT_SERVER_POLICY_MONGO_DB_COL    = "policies_info"

