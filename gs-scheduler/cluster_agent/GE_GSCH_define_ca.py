import os
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
GEDGE_SCHEDULER_NAMESPACE   = 'gedge-system-scheduler'

'''-----------------------------------------------
             CLUSTER AGENT 
-----------------------------------------------'''
SELF_CLUSTER_NAME = os.environ['GCLUSTER_NAME']
SELF_CLUSTER_TYPE = os.environ['GCLUSTER_TYPE']
#SELF_CLUSTER_NAME       = 'c1'
#SELF_CLUSTER_TYPE       = 'baremetal'
CLUSTER_AGENT_SAVE_PATH = './tmp'


'''-----------------------------------------------
             WORKER AGENT 
-----------------------------------------------'''
APPLY_YAMLS_PATH = './apply_yamls'
WORKER_AGENT_LABEL = 'gedge-worker-agent'
CHECK_WORKER_AGENT_WAIT_SECOND_TIME   = 5

'''-----------------------------------------------
             SCHEDULER
-----------------------------------------------'''
APPLY_AFTER_DELAY_SECOND_TIME          = 2
APPLY_RESULT_CHECK_DELAY_SECOND_TIME   = 1
APPLY_RESULT_CHECK_RETRY_COUNT         = 10


