# GE-Global Scheduler 4.0

## For Multiple Edge Clusters and Cloud Cluster

- Can Apply yaml for 3L Clusters (Edge Cluster / Near Edge Cluster / Cloud Cluster)  
- Updated Center Management Cluster

## Add Gedge Configmap for platform services 

- name is gedge-system-scheduler-configmap.yaml 
- platform service server ip
- platform service port

## Updated GEdge-Scheduler Main Core  

- Add New Platform info POD at Center Management Cluster
- Update kafka message module code
- Add New topic for processing Rest API for resources of multiple cluster    
- Changed to Run Front Server POD and GEdge Scheduler Policy PODs All at Once

![gedge_scheduler_system](./assets/gedge_scheduler_system.png)


## Updated GEdge-Scheduler Source Code for Multiple Users and Workspace, Project 

- Add Newly Multiple Users
  * Admin User/Normal User
  * login management 
- Workspace is created from Cluster Set ( User Selected Clusters)
- User applitions is seperated by project    

![user_workspace_project](./assets/user_workspace_project.png)

## Update Version clusters for Developing System  
- Set K8S version 1.22.x
- Support contaioner runtime are docker,containerd

![testing_system](./assets/testing_system.png)

## Add New GEdge Schedluer Policy 

- (G)MostRequestedPriority for 3LT 
- (G)LowLatencyPriority for 3LT
- GSetClusters for 3LT
- GSelectCluster for 3LT
