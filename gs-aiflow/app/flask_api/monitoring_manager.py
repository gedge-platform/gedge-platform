from flask import jsonify
from kubernetes import client, utils

import common.logger
from .database import get_db_connection
from .workflow import WorkFlow, WorkFlowNode
import flask_api.center_client
from apscheduler.schedulers.background import BackgroundScheduler
def apiClient(clustername):
    mycon = get_db_connection()

    cursor=mycon.cursor()
    c = cursor.execute(f'select cluster_ip,port,token from listcluster where cluster_name="{clustername}"')
    for i in cursor:
        host,port,token=i
    host='https://'+host+':'+str(port)

    aToken=token
    aConfiguration = client.Configuration()
    aConfiguration.host = host
    aConfiguration.verify_ssl = False
    aConfiguration.api_key = {"authorization": "Bearer " + aToken}
    aApiClient = client.ApiClient(aConfiguration)
    return aApiClient

class MonitoringManager:
    def __init__(self):
        self.__monitoringList = {}
        self.scheduler = BackgroundScheduler()
        self.scheduler.add_job(self.checkNodeNeededToStartWorkFlowFromServer, 'interval', seconds = 5, id='test')
        self.scheduler.start()

    def parseFromDAGToWorkFlow(self, workspaceName, dag):
        nodes = dag['nodes']
        edges = dag['edges']
        id = dag['id']


        if nodes is None or edges is None or id is None:
            return {}

        workFlow = WorkFlow(workspaceName, id=id)
        workFlow.origin = dag
        for node in nodes:
            workFlowNode = WorkFlowNode()
            nodeData = node['data']
            workFlowNode.id = node['id']
            workFlowNode.uuid = node
            workFlowNode.data = nodeData

            #선행후행
            for edge in edges:
                if edge['target'] == node['id']:
                    workFlowNode.preConditions.append(edge['source'])
                if edge['source'] == node['id']:
                    workFlowNode.postConditions.append(edge['target'])

            #단말 노드 체크
            if len(workFlowNode.preConditions) == 0:
                workFlowNode.isExternal = True
                workFlowNode.needCheck = 1


            workFlow.nodes[node['id']] = workFlowNode

        return workFlow

    def addWorkFlow(self, data):
        if not isinstance(data, WorkFlow):
            return False
        # TODO: 무결성 체크 및 파싱
        project = flask_api.center_client.userProjectsNameGet(data.id)
        if project['data'] is not None:
            detailInfoList = project['data']['DetailInfo']
            for detailInfo in detailInfoList:
                resourceData : dict = detailInfo['resource']
                for res in resourceData.items():
                    if res[0] != 'namespace_count' and res[0] != 'pv_count' and res[0] != 'service_count' and res[1] != 0:
                        return False

            self.__monitoringList[data.id] = data
            return True
        else:
            return False
    def deleteWorkFlow(self, workflowID):
        if self.__monitoringList.get(workflowID) is not None:
            self.__monitoringList.pop(workflowID)
    def getListNamespacePod(self, workFlow : WorkFlow):
        cluster = 'cluster_test1'
        namespace = workFlow.id
        aApiClient = apiClient(cluster)
        v1 = client.CoreV1Api(aApiClient)
        d = dict()
        ret = v1.list_namespaced_pod(namespace)
        for n, i in enumerate(ret.items):
            data = {}
            data['hostname'] = i.spec.hostname
            data['node_name'] = i.spec.node_name
            data['meta_data_name'] = i.metadata.name
            data['service_account'] = i.spec.service_account
            data['host_ip']= i.status.host_ip
            data['pod_ip'] = i.status.pod_ip
            if i.status.phase in ('Pending', 'Running') and i.metadata.deletion_timestamp != None:
                data['phase'] = 'Terminating'
            else:
                data['phase'] = i.status.phase
            data['start_time'] = i.status.start_time

            d[str(n)] = data
        return d
    def getListNamespacePodFromCenter(self, workFlow : WorkFlow):
        d = dict()
        project=workFlow.id
        cluster='mec(ilsan)'
        workspace=workFlow.workspace

        for node in workFlow.nodes:
            node.isExternal is True
        ret = flask_api.center_client.getPods(workspace, cluster, project)
        data = ret['data']

        if data is None:
            return d

        for n, i in enumerate(data):
            data = {}
            data['workspace'] = i['workspace']
            data['cluster'] = i['cluster']
            data['meta_data_name'] = i['name']
            data['user'] = i['user']
            data['creationTimestamp'] = i['creationTimestamp']
            data['project'] = i['project']
            data['hostIP']= i['hostIP']
            data['podIP'] = i['podIP']
            data['node_name'] = i['node_name']
            data['restart'] = i['restart']
            data['events'] = i['events']
            data['phase'] = i['status']

            d[str(n)] = data
        return d

    def getListNamespacePodDetailFromCenter(self, workFlow : WorkFlow, podID : str):
        d = dict()
        project=workFlow.id
        cluster='mec(ilsan)'
        workspace=workFlow.workspace

        ret = flask_api.center_client.getPodDetail(podID, workspace, cluster, project)
        data = ret['data']

        return data['status']
    def monitoringWorkFlow(self):
        for workflow in self.__monitoringList.values():
            podList = self.getListNamespacePod(workflow)
            for pod in podList.items():
                podId = pod[0]
                podData = pod[1]
                node = workflow.nodes.get(podData.get('meta_data_name'))

                if node is None:
                    continue

                node.data['status'] = podData['phase']

                # #TODO:
                # for temp in workflow.origin['nodes']:
                #     temp[]
                # workflow.origin['nodes'][]
    def monitoringWorkFlowFromCenter(self):
        for workflow in self.__monitoringList.values():
            for id, node in workflow.nodes.items():
                #필요한 것만 상태 체크
                if node.needCheck == 1:
                    statusData = self.getListNamespacePodDetailFromCenter(workflow, id)
                    #update
                    node.data['status'] = statusData

                    # 파드 완료 시
                    if node.data['status'] == 'Succeeded' or node.data['status'] == 'Failed':
                        node.needCheck = 0

                        # 후속노드체크활성화
                        postConditions = node.postConditions
                        for postNodeId in postConditions:
                            postNode = workflow.nodes.get(postNodeId)
                            if postNode is not None:
                                if node.data['status'] == 'Succeeded':
                                    if postNode.needCheck != -1:
                                        postNode.needCheck = 1
                                else:
                                    postNode.needCheck = -1


    def checkNodeNeededToStartWorkFlow(self):
        self.monitoringWorkFlow()

        for data in self.__monitoringList.items():
            id = data[0]
            workflow: WorkFlow = data[1]

            if workflow is None:
                continue

            for node in workflow.nodes.values():
                if node.data['status'] != 'Waiting':
                    continue

                postConditions = node.postConditions
                preConditions = node.preConditions
                isExternal = node.isExternal

                readyToStart = True
                #단말 노드면 무조건 실행
                if isExternal is False:
                    for precondition in preConditions:
                        preNode = workflow.nodes.get(precondition)
                        if preNode is None:
                            readyToStart = False
                            break
                        if preNode.data['status'] != 'Succeeded':
                            readyToStart = False
                            break

                if not readyToStart:
                    continue

                # node 실행
                # TODO: yaml 찾아야 함
                aApiClient = apiClient('cluster_test1')
                res = utils.create_from_dict(aApiClient, node.data['yaml'], verbose=True)
                node.data['status'] = 'Pending'

    def getIsRunning(self, id : str):
        if id is not None:
            if self.__monitoringList.get(id) is not None:
                return True
        return False

    def checkNodeNeededToStartWorkFlowFromServer(self):
        self.monitoringWorkFlowFromCenter()

        willDeleteIDList = []
        for data in self.__monitoringList.items():
            id = data[0]
            workflow: WorkFlow = data[1]

            if workflow is None:
                continue

            #check node all launched count
            count = 0
            for node in workflow.nodes.values():
                #check할 필요 없는 노드는 패스
                if node.needCheck != 1:
                    count += 1
                    continue

                #실행 중인 노드는 패스
                if node.data['status'] != 'Waiting':
                    # count += 1
                    continue

                postConditions = node.postConditions
                preConditions = node.preConditions
                isExternal = node.isExternal

                readyToStart = True
                #단말 노드면 무조건 실행
                readyToStart = True
                if isExternal is False:
                    for precondition in preConditions:
                        preNode = workflow.nodes.get(precondition)
                        if preNode is None:
                            readyToStart = False
                            break
                        if preNode.data['status'] != 'Succeeded':
                            readyToStart = False
                            break

                if not readyToStart:
                    continue

                # node 실행
                # TODO: yaml 찾아야 함

                # if node.data['task'] == 'Inference':
                #     res = flask_api.center_client.podsPost(node.data['yaml'], workflow.workspace, "mec(ilsan)", 'default')
                # else:
                res = flask_api.center_client.podsPost(node.data['yaml'], workflow.workspace, "mec(ilsan)", id)
                node.data['status'] = 'Pending'

            #check all node launched
            if count == len(workflow.nodes.keys()):
                willDeleteIDList.append(id)

        #delete list after check
        for id in willDeleteIDList:
            try:
                del self.__monitoringList[id]
            except:
                common.logger.get_logger().error("del monitoring key error")


