# gs-linkgw
This repository includes open sources of gs-link for connection between single cluster or multiple clusters and cooperation between them in gedge-platform. 
The cooperation means collaboration between data points and K8S cluster including offloading and migration. Also, gs-link provides the link between K8S clusters for cooperation. 

The gs-linkgw opensource 
---------------------------------------------------------------------------------------------------------------------------------------
This repository includes test code for migration from opensource with some variables which are fixed format to execute with in single K8S.
https://github.com/qzysw123456/kubernetes-pod-migration

Also, this repository provides the controller for migration amoong K8S clusters based on opensource.
https://github.com/schrej/podmigration-operator


The structure of gs-linkgw 
---------------------------------------------------------------------------------------------------------------------------------------
This figure shows the structure of gs-linkgw
![figure1.png](https://github.com/gedge-platform/gs-linkgw/blob/076a56ddb030b150e675419806489828b6786b3b/figure1.png)


The gs-linkgw consists of three modules as follows.
- GS-Link Collaborative Management Module: Provides multi-cluster connection management, multi-cluster offloading and service movement management, multi-cluster shared storage management and multi-cluster resource management functions.
- GS-Link collaboration service linked operation module: Provides core-edge, edge-edge interworking function and shared storage operation function for data collaboration processing
- GS-Link Collaboration Support Offloading and Service Mobility Module: Provides dynamic deployment of services and service mobility to support vertical/horizontal collaboration by jointly utilizing computing resources of the core cloud and cloud edges

The module presented above is a function-oriented module and performs the following roles to provide services for actual GS-Link.
- GS-Link's collaboration management module serves as an API to support service collaboration functions and manages and monitors the system for collaboration.
- GS-Link collaboration service linkage operation module plays a role of data collaboration through connection between K8S clusters and shared storage between clusters
- GS-Link collaboration support offloading and movement module performs real-time high-speed movement and offloading between K8S clusters


kubectl plugin
---------------------------------------------------------------------------------------------------------------------------------------
kubectl migrate [PodName] [DestHost]

![kubeplugin](https://user-images.githubusercontent.com/32071802/145150699-49014919-9221-449b-a434-385920b215cc.jpg)

Migration Agent
---------------------------------------------------------------------------------------------------------------------------------------
Server running with 15213 port

![kubeagent](https://user-images.githubusercontent.com/32071802/145151165-cc12f557-3980-42aa-a947-bec8dfde2390.jpg)

Migration Controller
---------------------------------------------------------------------------------------------------------------------------------------

![figure2.png](https://github.com/gedge-platform/gs-linkgw/blob/012596ebdb3950ca1ee292e034fa4a23cb77b3da/figure2.png)

