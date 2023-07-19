import React from "react";
import { useQuery } from "react-query";
import {Row, Col} from "antd"
import axios from "axios";
import { APIGetProjectName } from "utils/api";


function ProjectDetail(props) {
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
        if(selectedProject != ""){
          const { data } = await APIGetProjectName(selectedProject);
          return data;
        }

        return {projectDescription:"", created_at:"", clusterList:[]}
      }
      const { isLoading, isError, data, error, refetch } = useQuery(["detail" + selectedProject], () => {return getProjectDetail();}, {
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

  function getProjectDescription(){
    if(data != null && data != undefined){
      if(data.projectDescription != null && data != undefined){
        return data.projectDescription;
      }
    }
    return "";
  }

  function getClusterList() {
    if (data && data.clusterList && typeof data.clusterList === 'object') {
      return data.clusterList.join(', ');
    }
  
    return "";
  }

  function getCreatedAt() {
    if (data && data.created_at && typeof data.created_at === 'string'){
      return data.created_at
    }
    return '';
  }


    return (
        <> < div id = 'project_detail' > 

<Row className="project_detail_row">
<Col className="project_detail_col head" span={6}><h4>Project name</h4></Col>
<Col className="project_detail_col data" span={6}><h4>{selectedProject}</h4></Col>
<Col className="project_detail_col head" span={6}><h4>User ID</h4></Col>
<Col className="project_detail_col data" span={6}><h4>{id}</h4></Col>
</Row>
<Row className="project_detail_row">
<Col className="project_detail_col head" span={6}><h4>Project description</h4></Col>
<Col className="project_detail_col data" span={18}><h4>{!isLoading && getProjectDescription()}</h4></Col>
</Row>
<Row className="project_detail_row">
<Col className="project_detail_col head" span={6}><h4>Cluster List</h4></Col>
<Col className="project_detail_col data" span={18}><h4>{!isLoading && getClusterList()}</h4></Col>
</Row>
<Row className="project_detail_row">
<Col className="project_detail_col head" span={6}><h4>Create At</h4></Col>
<Col className="project_detail_col data" span={6}><h4>{!isLoading && getCreatedAt()}</h4></Col>
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
    
    
    </div>
    </>
    
    );
}

export {
  ProjectDetail
};
