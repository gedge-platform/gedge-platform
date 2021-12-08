import json

import logging
from logging import handlers
import GE_GSCH_kubernetes as gKube

'''------------------------------------------------
              LOGGER
------------------------------------------------'''
logger = logging.getLogger('root')
formatter = logging.Formatter("%(asctime)s :%(levelname)s [%(filename)s:%(lineno)d-%(funcName)s] %(message)s")
file_handler = handlers.RotatingFileHandler(
    "GEdge_Scheduler_2020.log",
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
              FRONT SERVER 
------------------------------------------------'''
GEDGE_SCHEDULER_NAME        = 'griffin_scheduler'
GEDGE_SCHEDULER_CONFIG_NAME = 'gschConfig'
GEDGE_SCHEDULER_NAMESPACE   = 'gedge-system'
'''------------------------------------------------
              FRONT SERVER 
------------------------------------------------'''
FRONT_SERVER_SERVICE_NAME    = 'gedge-front-server-service'
FRONT_SERVER_ENDPOINT_IP     = gKube.find_external_ip_of_service_byname(FRONT_SERVER_SERVICE_NAME)
FRONT_SERVER_ENDPOINT_PORT   = gKube.find_node_port_of_service_byname(FRONT_SERVER_SERVICE_NAME)
#FRONT_SERVER_ENDPOINT_IP    = '129.254.202.9'
#FRONT_SERVER_ENDPOINT_PORT  = 8787
FRONT_SERVER_SERVER_URL      = str('http://')+str(FRONT_SERVER_ENDPOINT_IP)+str(':')+str(FRONT_SERVER_ENDPOINT_PORT)

FRONT_SERVER_MONGO_DB_NAME = "gedge-front-server-db"
FRONT_SERVER_SERVICE_MONGO_DB_COLLECTION = "gedge-front-server-db-col-services"
'''------------------------------------------------
              KAFKA MESSAGE
------------------------------------------------'''

GLOBAL_SCHEDULER_GLOBAL_TOPIC_NAME = "ge-global-topic"
KAFKA_SERVICE_NAME    = "gedge-kafka-server-service"
KAFKA_ENDPOINT_IP     = gKube.find_external_ip_of_service_byname(KAFKA_SERVICE_NAME)
KAFKA_ENDPOINT_PORT   = gKube.find_node_port_of_service_byname(KAFKA_SERVICE_NAME)
KAFKA_SERVER_URL      = str(KAFKA_ENDPOINT_IP)+str(':')+str(KAFKA_ENDPOINT_PORT)


'''------------------------------------------------
              REQUEST
------------------------------------------------'''
GLOBAL_SCHEDULER_QUEUE_SLICE_SIZE  = 2
GLOBAL_SCHEDULER_MAX_FAIL_CNT      = 5
GLOBAL_SCHEDULER_MAX_DISPATCH_SIZE = 50
GLOBAL_SCHEDULER_FIRST_FAIL_CNT    = 2
GLOBAL_SCHEDULER_IS_READY          = False
GLOBAL_SCHEDULER_UPLOAD_PATH       = './tmp'

'''------------------------------------------------
              PRE WARMER
------------------------------------------------'''
GLOBAL_SCHEDULER_PREWARMER_YAML_PATH = './policy_yamls'


'''-----------------------------------------------
              REDIS
-----------------------------------------------'''
REDIS_SERVICE_NAME    = "gedge-redis-service"
REDIS_POD_NAME        = "gedge-redis"
#REDIS_ENDPOINT_IP     = '129.254.202.126'
#REDIS_ENDPOINT_PORT   = 6379
REDIS_ENDPOINT_IP     = gKube.find_external_ip_of_service_byname(REDIS_SERVICE_NAME)
REDIS_ENDPOINT_PORT   = gKube.find_node_port_of_service_byname(REDIS_SERVICE_NAME)

REDIS_YAML_KEY        = "GEdge-YAML"

'''-----------------------------------------------
             MONGO DB 
-----------------------------------------------'''

MONGO_DB_ENDPOINT_IP   = '129.254.202.129'
MONGO_DB_ENDPOINT_PORT = 27017

MONGO_DB_NAME_FRONT_SERVER                = "gedge-front-server-db"
MONGO_DB_COLLECTION_FRONT_SERVER_SERVICES = "gedge-front-server-db-col-services"

MONGO_DB_NAME_CLUSTER_INFO                = "gedge-cluster-info-db"
MONGO_DB_COLLECTION_CLUSTER_INFO          = "gedge-cluster-info-db-col"

'''-----------------------------------------------
             ETC
-----------------------------------------------'''
