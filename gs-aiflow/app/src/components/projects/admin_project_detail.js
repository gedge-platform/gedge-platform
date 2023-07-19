import React from "react";
import { useQuery } from "react-query";
import {Row, Col} from "antd"
import axios from "axios";
import { APIAdminGetProjectDetail } from "utils/api";


function AdminProjectDetail(props) {
  const [selectedProject, setSelectedProject] = props.setSelectedProject;
  const columns = [
    {
      title: '프로젝트 이름',
      dataIndex: 'project_name',
      key: 'project_name',
      width:400,
    },
  ];
    var id = props.id;

      const getProjectDetail = async ( ) => {
        if(selectedProject.project_name != ""){
          if(selectedProject.project_name == null || selectedProject.login_id == null){
            return {};
          }
          const { data } = await APIAdminGetProjectDetail(selectedProject.login_id, selectedProject.project_name);
          return data;
        }

        return {projectDescription:"", created_at:"", clusterList:[], DetailInfo: []}
      }
      const { isLoading, isError, data, error, refetch } = useQuery(["detail" + selectedProject.login_id + '/' + selectedProject.project_name], () => {return getProjectDetail();}, {
        refetchOnWindowFocus:false,
        retry:0,
    });


  function getHasNodes(){
    if(data){
      if(data.nodes){
        return true;
      }
    }
    return false;
  }

  function getHasDetailInfo(){
    if(data){
      if(data.DetailInfo){
        return true;
      }
    }
    return false;
  }

  function getTotalNode(){
    if (getHasNodes()){
      if(data.nodes.total || data.nodes.total == 0){
        return data.nodes.total;
      }
    }
    return "";
  }

  function getCronJob(){
    if (getHasNodes()){
      if(data.nodes.cron_job || data.nodes.cron_job == 0){
        return data.nodes.cron_job;
      }
    }
    return "";
  }


  function getResourceUsageCpu(){
    if (getHasDetailInfo()){
      if(typeof data.DetailInfo == 'object'){
        var usageCpu = 0.0;
        for(var key in data.DetailInfo){
          const item = data.DetailInfo[key];
          if (typeof item == 'object'){
            if (typeof item.resourceUsage == 'object'){
              usageCpu += isNaN(parseFloat(item.resourceUsage.namespace_cpu)) ? 0.0 : parseFloat(item.resourceUsage.namespace_cpu); 
            }
          }
        }
        return String(usageCpu);
      }
    }
    return "";
  }


  function getResourceUsageMemory(){
    if (getHasDetailInfo()){
      if(typeof data.DetailInfo == 'object'){
        var usageMemory = 0.0;
        for(var key in data.DetailInfo){
          const item = data.DetailInfo[key];
          if (typeof item == 'object'){
            if (typeof item.resourceUsage == 'object'){
              usageMemory += isNaN(parseFloat(item.resourceUsage.namespace_memory)) ? 0.0 : parseFloat(item.resourceUsage.namespace_memory); 
            }
          }
        }
        return String(usageMemory);
      }
    }
    return "";
  }

  function getResourcePodRunning(){
    if (getHasDetailInfo()){
      if(typeof data.DetailInfo == 'object'){
        var podRunning = 0;
        for(var key in data.DetailInfo){
          const item = data.DetailInfo[key];
          if (typeof item == 'object'){
            if (typeof item.resourceUsage == 'object'){
              podRunning += isNaN(parseFloat(item.resourceUsage.pod_running)) ? 0 : parseFloat(item.resourceUsage.pod_running); 
            }
          }
        }
        return String(podRunning);
      }
    }
    return "";
  }

  function getPod(){
    if (getHasNodes()){
      if(data.nodes.pod || data.nodes.pod == 0){
        return data.nodes.pod;
      }
    }
    return "";
  }

  function getDeployment(){
    if (getHasNodes()){
      if(data.nodes.deployment || data.nodes.deployment == 0){
        return data.nodes.deployment;
      }
    }
    return "";
  }

  function getService(){
    if (getHasNodes()){
      if(data.nodes.service || data.nodes.service == 0){
        return data.nodes.service;
      }
    }
    return "";
  }

  function getStatefulSet(){
    if (getHasNodes()){
      if(data.nodes.stateful_set || data.nodes.stateful_set == 0){
        return data.nodes.stateful_set;
      }
    }
    return "";
  }

  function getDaemonSet(){
    if (getHasNodes()){
      if(data.nodes.daemon_set || data.nodes.daemon_set == 0){
        return data.nodes.daemon_set;
      }
    }
    return "";
  }


    return (
        <> < div id = 'project_detail' > 

<Row className="project_detail_row">
<Col className="project_detail_col head" span={6}><h4>Project name</h4></Col>
<Col className="project_detail_col data" span={6}><h4>{selectedProject.project_name}</h4></Col>
<Col className="project_detail_col head" span={6}><h4>User ID</h4></Col>
<Col className="project_detail_col data" span={6}><h4>{selectedProject.login_id}</h4></Col>
</Row>
<Row className="project_detail_row">
<Col className="project_detail_col head" span={6}><h4>Project description</h4></Col>
<Col className="project_detail_col data" span={18}><h4>{!isLoading && data.projectDescription}</h4></Col>
</Row>
<Row className="project_detail_row">
<Col className="project_detail_col head" span={6}><h4>Cluster List</h4></Col>
<Col className="project_detail_col data" span={18}><h4>{!isLoading && data.clusterList != undefined ? data.clusterList.join(', ') : ""}</h4></Col>
</Row>
<Row className="project_detail_row">
<Col className="project_detail_col head" span={6}><h4>Create At</h4></Col>
<Col className="project_detail_col data" span={6}><h4>{!isLoading && data.created_at}</h4></Col>
<Col className="project_detail_col head" span={6}><h4>Total Node</h4></Col>
<Col className="project_detail_col data" span={6}><h4>{!isLoading && getTotalNode()}</h4></Col>
</Row>
<Row className="project_detail_row">
<Col className="project_detail_col head" span={6}><h4>Cron Job</h4></Col>
<Col className="project_detail_col data" span={6}><h4>{!isLoading && getCronJob()}</h4></Col>
<Col className="project_detail_col head" span={6}><h4>Pod</h4></Col>
<Col className="project_detail_col data" span={6}><h4>{!isLoading && getPod()}</h4></Col>
</Row>
<Row className="project_detail_row">
<Col className="project_detail_col head" span={6}><h4>Deployment</h4></Col>
<Col className="project_detail_col data" span={6}><h4>{!isLoading && getDeployment()}</h4></Col>
<Col className="project_detail_col head" span={6}><h4>Service</h4></Col>
<Col className="project_detail_col data" span={6}><h4>{!isLoading && getService()}</h4></Col>
</Row>
<Row className="project_detail_row">
<Col className="project_detail_col head" span={6}><h4>Statefulset</h4></Col>
<Col className="project_detail_col data" span={6}><h4>{!isLoading && getStatefulSet()}</h4></Col>
<Col className="project_detail_col head" span={6}><h4>Daemonset</h4></Col>
<Col className="project_detail_col data" span={6}><h4>{!isLoading && getDaemonSet()}</h4></Col>
</Row>

<Row className="project_detail_row">
<Col className="project_detail_col head" span={6}><h4>CPU Usage</h4></Col>
<Col className="project_detail_col data" span={6}><h4>{!isLoading && getResourceUsageCpu()}</h4></Col>
<Col className="project_detail_col head" span={6}><h4>Memory Usage</h4></Col>
<Col className="project_detail_col data" span={6}><h4>{!isLoading && getResourceUsageMemory()}</h4></Col>
</Row>
    
<Row className="project_detail_row">
<Col className="project_detail_col head" span={6}><h4>POD Runnning</h4></Col>
<Col className="project_detail_col data" span={6}><h4>{!isLoading && getResourcePodRunning()}</h4></Col>
<Col className="project_detail_col head" span={6}><h4></h4></Col>
<Col className="project_detail_col data" span={6}><h4></h4></Col>
</Row>
    
    </div>
    </>
    
    );
}

export {
  AdminProjectDetail
};
