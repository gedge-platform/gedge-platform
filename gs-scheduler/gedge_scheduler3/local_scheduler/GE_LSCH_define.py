

'''-----------------------------------------------
LOCAL SCHEDULER
-----------------------------------------------'''

LOCAL_SCHEDULER_NAME  = "griffin_scheduler"
GEDGE_SCHEDULER_CONFIG_NAME = 'gschConfig'
CPU_LIMIT_PERCENT     = 70.0
MEMORY_LIMIT_PERCENT  = 70.0

'''-----------------------------------------------
WORKER_AGENT
-----------------------------------------------'''
WORKER_SERVICE_PORT   = 8787

'''-----------------------------------------------
LOW-LATENCY
-----------------------------------------------'''
NETWORK_PING_SIZE           = '8'
NETWORK_PING_COUNT          = '2'
NEAR_NODES_LOW_LATENCY_PATH = '/monitoring/near-nodes/latency'

'''-----------------------------------------------
             AGENT 
-----------------------------------------------'''

WORKER_AGENT_LABEL = 'gedge-worker-agent'

'''-----------------------------------------------
ETC
-----------------------------------------------'''
LOW_LATENCY_POLICY  = 'GLowLatencyPriority'
MOST_REQUEST_POLICY = 'GMostRequestedPriority'