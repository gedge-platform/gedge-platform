from kubernetes import client

v1 = client.CoreV1Api()

gNode_list = []
gNode_status={}
gNode={}

pod_list = v1.list_pod_for_all_namespaces(pretty=True)
for p in pod_list.items:
    node_name = p.spec.node_name
    if node_name not in gNode_status:
        gNode_status[node_name]             = {}
        gNode_status[node_name]['requests'] = {'nvidia.com/gpu':0}
        gNode_status[node_name]['limits']   = {'nvidia.com/gpu':0}
    for c in p.spec.containers:
        if c.resources.requests :
            if 'nvidia.com/gpu' in c.resources.requests :
                gNode_status[node_name]['requests']['nvidia.com/gpu'] += int(c.resources.requests['nvidia.com/gpu'])    
        if c.resources.limits :
            if 'nvidia.com/gpu' in c.resources.limits :
                gNode_status[node_name]['limits']['nvidia.com/gpu'] += int(c.resources.limits['nvidia.com/gpu'])

node_list = v1.list_node(watch=False)
for node in node_list.items:
    gNode={}
    gNode['node_name'] = node.metadata.name            
    gNode['capacity']={'nvidia.com/gpu':0 }
    if 'nvidia.com/gpu' in node.status.capacity :
        gNode['capacity']['nvidia.com/gpu'] = int(node.status.capacity['nvidia.com/gpu']) 
    
    gNode['allocatable']={'nvidia.com/gpu':0 }
    if 'nvidia.com/gpu' in node.status.allocatable :
        gNode['allocatable']['nvidia.com/gpu'] = int(node.status.allocatable['nvidia.com/gpu']) 
    try :
        gNode['requests'] = gNode_status[node.metadata.name]['requests']
        gNode['limits']   = gNode_status[node.metadata.name]['requests']
    except:
        gNode['requests'] = None
        gNode['limits']   = None    
    
    gNode_list.append(gNode)
print('gNode_list',gNode_list)

