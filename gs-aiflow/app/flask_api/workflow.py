
class WorkFlow:
    def __init__(self, workspace = "softonet", id = "id"):
        self.nodes = {}
        self.id = id
        self.workspace = workspace
        self.origin = {}

class WorkFlowNode:
    def __init__(self):
        self.postConditions = []
        self.id = "id"
        self.uuid = "uuid"
        self.preConditions = []
        self.data = {}
        self.isExternal = False
        #needCheck -1 는 failed로 인한 값 -> 불변
        #0은 False 추후 True 예정
        #1은 True
        self.needCheck = 0