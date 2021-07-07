import logging
from logging import handlers
from kubernetes import client, config, watch
from kubernetes.client.rest import ApiException

config.load_incluster_config()
v1 = client.CoreV1Api()

'''------------------------------------------------
  set logger
------------------------------------------------'''
logger = logging.getLogger('root')
formatter = logging.Formatter(
    "%(asctime)s :%(levelname)s [%(filename)s:%(lineno)d-%(funcName)s] %(message)s")
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
    'UnsupportedMediaTypeException': {'Description': 'The content type of the Invoke request body is not JSON.', 'StatusCode': 415}
}

'''-----------------------------------------------
REDIS
-----------------------------------------------'''

def find_node_port_of_service_byname(service_name):
    res_services = v1.list_service_for_all_namespaces(pretty=True)
    for i in res_services.items:
        #print(i.metadata.name)
        if i.metadata.name == service_name:
            print("service_name", service_name)
            for j in i.spec.ports:
                if j.node_port:
                    print("j.node_port", j.node_port)
                    return j.node_port
    return None

def find_external_ip_of_service_byname(service_name):
    res_services = v1.list_service_for_all_namespaces(pretty=True)
    for i in res_services.items:
        if i.metadata.name == service_name:
            print("service_name", service_name)
            #print("i.status", i.status)
            if i.status.load_balancer.ingress[0].ip :
                print("external ip", i.status.load_balancer.ingress[0].ip)
                return i.status.load_balancer.ingress[0].ip
    return None


def find_host_ip_of_pod_byname(pod_name):
    res_pods = v1.list_pod_for_all_namespaces(pretty=True)
    for i in res_pods.items:
        if i.metadata.name == pod_name:
            if i.status.host_ip:
                return i.status.host_ip
    return None




LOCAL_SCHEDULER_NAME  = "griffin_scheduler"
CPU_LIMIT_PERCENT     = 70.0
MEMORY_LIMIT_PERCENT  = 70.0
REDIS_SERVICE_NAME    = "redis-service"
REDIS_POD_NAME        = "redis"
WORKER_AGENT_POD_IP = "worker-agent-pod-ip:"
WORKER_AGENT_NETWORK_LATENCY = "worker-agent-network-latency:"
#REDIS_ENDPOINT_IP = '10.111.148.109'
#REDIS_ENDPOINT_PORT = 6379
REDIS_ENDPOINT_IP     = find_external_ip_of_service_byname(REDIS_SERVICE_NAME)
REDIS_ENDPOINT_PORT   = find_node_port_of_service_byname(REDIS_SERVICE_NAME)
WORKER_SERVICE_PORT   = 8787
NETWORK_PING_SIZE     = '8'
NETWORK_PING_COUNT    = '2'
IS_READY_PREPROCESSING = False
