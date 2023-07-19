'''-----------------------------------------------
LOCAL SCHEDULER
-----------------------------------------------'''

#LOCAL_SCHEDULER_NAME  = "griffin_scheduler"
GEDGE_SCHEDULER_CONFIG_NAME = 'gschConfig'

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
SCHEDULER POLICY
-----------------------------------------------'''
LOW_LATENCY_POLICY  = 'GLowLatencyPriority'
MOST_REQUEST_POLICY = 'GMostRequestedPriority'
MOST_REQUEST_POLICY_GPU_COST_WEIGHT = 200