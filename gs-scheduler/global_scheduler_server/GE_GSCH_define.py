import sys
sys.path.append('../lib')

import os
import logging
from logging import handlers
# import GE_kubernetes as gKube


'''------------------------------------------------
             GEDGE_SCHEDULER
------------------------------------------------'''
GEDGE_SCHEDULER_NAME        = 'griffin_scheduler'
GEDGE_SCHEDULER_CONFIG_NAME = 'gschConfig'
GEDGE_SCHEDULER_NAMESPACE   = 'gedge-system-scheduler'
'''------------------------------------------------
              GSHC SERVER 
------------------------------------------------'''
#GSCH_SERVER_SERVICE_NAME    = 'gedge-gsch-server-service'
#GSCH_SERVER_ENDPOINT_IP     = None 
#GSCH_SERVER_ENDPOINT_PORT   = None
#GSCH_SERVER_ENDPOINT_IP    = '129.254.202.9'
#GSCH_SERVER_ENDPOINT_PORT  = 8787
#GSCH_SERVER_URL      = str('http://')+str(GSCH_SERVER_ENDPOINT_IP)+str(':')+str(GSCH_SERVER_ENDPOINT_PORT)



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
              POLICY SCALE CONTROL
------------------------------------------------'''
GLOBAL_SCHEDULER_POLICY_YAML_PATH = './policy_yamls'


'''------------------------------------------------
              PLATFORM SERVICES
------------------------------------------------'''
WAIT_RUNNING_PLATFORM_SERVICES_SECOND_TIME   = 5