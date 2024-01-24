# GEdge-Platform
[![Generic badge](https://img.shields.io/badge/release-4.0-green.svg)](https://github.com/gedge-platform/gedge-platform/releases/tag/4.0)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
***
GEdge-Platform is a cloud edge computing platform for ultra low-latency services at the edge of the network.

It can supports ultra-responsive service experiences by rapidly processing massive data at the edge without delays in processing and transmission to central cloud.
For the Edge AI service, it provides real-time, distribued, high-reliability and cost-optimal AI computing support at the edge through the cloud edge collaboration, cluster management and intelligent scheduling of multi-tier clusters.

## Contents
- [GEdge-Platform](#gedge-platform)
  - [Contents](#contents)
  - [About](#about)
  - [Advantages](#advantages)
  - [Architecture](#architecture)
  - [Components](#components)
  - [Current Features](#current-features)
  - [Getting Started](#getting-started)
  - [TODO](#todo)
  - [Contributing](#contributing)
  - [Community](#community)
  - [License](#license)

## About

**GEdge-Platform is a cloud edge computing platform for ultra low-latency services at the edge of the network.**

- System Name
    - GEdge Platform (Ultra low-latency Intelligent Cloud Edge Platform)
- System Goal
    - Development of intelligent cloud edge platform technology that supports ultra-low-latency data processing based on collaboration between core cloud-cloud edge-terminal for response speed-sensitive service

## Advantages
- Provides an ultra-low latency data processing framework that supports high-speed data processing of less than 10msec
- Cloud edge SW platform that supports collaboration between core cloud-cloud edge-terminal and edge-edge
- Framework-based architecture to provide availability and scalability of cloud edge SW platform
- Provides cloud edge platform compatibility applicable to heterogeneous servers
- Provides an intelligent service operation optimization framework optimized for the cloud edge
- Provides management operation orchestration of resources and services specialized for large-scale distributed cloud edge.
- Intelligent collaboration support, deep learning-based offloading and hierarchical caching placement source technology secured

## Architecture
![image01](https://user-images.githubusercontent.com/29933947/209770011-9954a1f5-2834-4750-b9fa-555ed8272a4d.png)

## Components
- GS : GEdge Service platform (Ultra low-latency Cloud Edge Service Platform)
    - [GS-Engine](https://github.com/gedge-platform/gs-engine) : Ultra low-latency Data Processing Framework
    - [GS-Linkhq](https://github.com/gedge-platform/gs-linkhq) : Core technology for creating vertical and horizontal service collaboration support policies
    - [GS-Linkgw](https://github.com/gedge-platform/gs-linkgw) : Service collaboration support Core technologies for cloud-edge and edge-edge interconnection
    - [GS-AIflow](https://github.com/gedge-platform/gs-aiflow) : Intelligent Service Operation Framework
    - [GS-Optops](https://github.com/gedge-platform/gs-optops) : Core technologies for providing an AI execution environment optimized for the cloud edge
    - [GS-BROKER](https://github.com/gedge-platform/gs-broker) : A message broker that can integrate and mediate heterogeneous protocols between edge application services running on the GEdge platform and IoT devices
    - [GS-SCHEDULER](https://github.com/gedge-platform/gs-scheduler) : High-speed and distributed collaboration execution of services Technology
- GM : GEdge Management platform (Multi-Cloud Edge Management Platform)
    - [GM-Center](https://github.com/gedge-platform/gm-center) : Platform Management Framework
    - [GM-Tool](https://github.com/gedge-platform/gm-tool) : Platform Management Tool Framework

## Current Features

> *GEdge Platform is currently under development.*  
> *Please note that the functionalities of GEdge Platform are not stable and secure yet.*  
> *It is not recommended to use the current release in production.*  
> *If you have any difficulties in using GEdge Platform, please let us know.* 

- [ ] low-latency data processing of large-scale data
- [ ] service collaboration between core-edge and edge-to-edge
- [ ] intelligent edge service optimization
- [ ] autonomous configuration and integrated management of cloud edge platform

## Getting Started
- TBD

## TODO
- TBD

## Contributing
If you're interested in being a contributor and want to get involved in developing the GEdge Platform code, please see DOCUMENTATIONs for details on submitting patches and the contribution workflow.

## Community
We have a project site for the GEdge Platform. If you're interested in being a contributor and want to get involved in developing the Cloud Edge Platform code, please visit [GEdge Plaform](https://gedge-platform.github.io) Project site

## License
GEdge Platform is under the Apache 2.0 license. See the [LICENSE](./LICENSE) file for details.

