import json
import logging
from logging import handlers


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
              GEDGE SCHEDULER 
------------------------------------------------'''
GEDGE_SCHEDULER_NAME        = 'griffin_scheduler'
GEDGE_SCHEDULER_CONFIG_NAME = 'gschConfig'
GEDGE_SCHEDULER_NAMESPACE = 'gedge-system'

'''------------------------------------------------
              FRONT SERVER 
------------------------------------------------'''
FRONT_SERVER_SERVICE_NAME  = 'gedge-front-server-service'
'''------------------------------------------------
              KAFKA MESSAGE
------------------------------------------------'''

GLOBAL_SCHEDULER_GLOBAL_TOPIC_NAME = "ge-global-topic"
KAFKA_SERVICE_NAME    = "gedge-kafka-server-service"

'''-----------------------------------------------
              REDIS
-----------------------------------------------'''
REDIS_SERVICE_NAME    = "gedge-redis-service"
REDIS_POD_NAME        = "gedge-redis"
REDIS_YAML_KEY        = "GEdge-YAML"

'''-----------------------------------------------
             AGENT 
-----------------------------------------------'''

WORKER_AGENT_LABEL = 'custom-scheduler-worker-agent'

'''-----------------------------------------------
             MONGO DB 
-----------------------------------------------'''

MONGO_DB_ENDPOINT_IP    = 
MONGO_DB_ENDPOINT_PORT  = 

MONGO_DB_NAME_FRONT_SERVER                = "gedge-front-server-db"
MONGO_DB_COLLECTION_FRONT_SERVER_SERVICES = "gedge-front-server-db-col-services"

MONGO_DB_NAME_CLUSTER_INFO                = "gedge-cluster-info-db"
MONGO_DB_COLLECTION_CLUSTER_INFO          = "gedge-cluster-info-db-col"
'''-----------------------------------------------
             ETC
-----------------------------------------------'''
