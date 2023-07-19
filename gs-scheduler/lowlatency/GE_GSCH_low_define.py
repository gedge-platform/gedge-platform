'''------------------------------------------------
             GSCHT SERVER 
------------------------------------------------'''
GSCH_SERVER_ENDPOINT_IP   = None
GSCH_SERVER_ENDPOINT_PORT = None
GSCH_SERVER_URL           = None
#GSCH_SERVER_URL      = str('http://')+str(GSCH_SERVER_ENDPOINT_IP)+str(':')+str(GSCH_SERVER_ENDPOINT_PORT)

'''------------------------------------------------
              LOW_LATENCY
------------------------------------------------'''
SELF_POLICY_NAME = 'GLowLatencyPriority'

'''------------------------------------------------
          DELAY / WAIT TIME 
------------------------------------------------'''
REQUEST_DISPATCH_RETRY_DELAY_SECOND_TIME    = 5

READ_DISPATCH_QUEUE_RETRY_DELAY_SECOND_TIME = 5

CONSUMER_TIMEOUT_MS_TIME = 1000*10