import { React } from 'react';
import { Row, Col } from 'antd';

const DagMonitoringDetailPod = (props) => {
  const data = props.data;
  const edges = props.edges;
  const projectID = props.projectID;


  function getType(){
    if(data.data){
      if(data.data.type){
        return data.data.type;
      }
    }
    
    return "";
  }

  function getPodName(){
    if(data){
      if(data.id){
        return data.id;
      }
    }
    
    return "";
  }

  function getStatus(){
    if(data.data){
      if(data.data.status){
        if(data.data.status == 'Waiting'){
          return <h4 style={{color:'#2196f3'}}>{data.data.status}</h4>;
        }
        else if(data.data.status == 'Pending'){
          return <h4 style={{color:'orange'}}>{data.data.status}</h4>;
        }
        else if(data.data.status == 'Running'){
          return <h4 style={{color:'#23C723'}}>{data.data.status}</h4>;
        }
        else if(data.data.status == 'Succeeded'){
          return <h4 style={{color:'#005200'}}>{data.data.status}</h4>;
        }
        else if(data.data.status == 'Failed'){
          return <h4 style={{color:'red'}}>{data.data.status}</h4>;
        }
      }
    }
    
    return "Unknown";
  }



  function getTask(){
    if(data.data){
      if(data.data.task){
        return data.data.task;
      }
    }
    
    return "";
  }

  function getPreconditions(){
    const value = [];
    if(edges){
      edges.forEach((edge) => {
        if(edge.target == getPodName()){
          value.push(edge.source);
        }
      });
      return value;
    }
    return [];
  }


  function getRuntime(){
    if(data.data){
      if(data.data.runtime){
        return data.data.runtime;
      }
    }
    
    return "";
  }

  function getTensorRT(){
    if(data.data){
      if(data.data.tensorRT){
        return data.data.tensorRT;
      }
    }
    
    return "";
  }

  function getModel(){
    if(data){

      if(data.data){
        if(data.data.model){
          return data.data.model;
        }
      }
    }
    
    return "";
  }

  function getFramework(){
    if(data){

      if(data.data){
        if(data.data.framework){
          return data.data.framework;
        }
      }
    }
    
    return "";
  }

  return (
    // 모달이 열릴때 openModal 클래스가 생성된다.
    <div id='dag_define_detail'>
      <Row className='dag_define_detail_row'>
        <Col className='dag_define_detail_col head' span={6}><h4>Pod Name</h4></Col>
        <Col className='dag_define_detail_col data' span={6}><h4>{getPodName()}</h4></Col>
        <Col className='dag_define_detail_col head' span={6}><h4>Status</h4></Col>
        <Col className='dag_define_detail_col data' span={6}>{getStatus()}</Col>
      </Row>
      <Row className='dag_define_detail_row'>
        <Col className='dag_define_detail_col head' span={6}><h4>ProjectID</h4></Col>
        <Col className='dag_define_detail_col data' span={6}><h4>{projectID}</h4></Col>
        <Col className='dag_define_detail_col head' span={6}><h4>Task</h4></Col>
        <Col className='dag_define_detail_col data' span={6}><h4>{getTask()}</h4></Col>
      </Row>
      <Row className='dag_define_detail_row'>
        <Col className='dag_define_detail_col head' span={6}><h4>Precinditions</h4></Col>
        <Col className='dag_define_detail_col data' span={18}><h4>{getPreconditions().join(', ')}</h4></Col>
      </Row>
      <Row className='dag_define_detail_row'>
        <Col className='dag_define_detail_col head' span={6}><h4>Model</h4></Col>
        <Col className='dag_define_detail_col data' span={6}><h4>{getModel()}</h4></Col>
        <Col className='dag_define_detail_col head' span={6}><h4>Framework</h4></Col>
        <Col className='dag_define_detail_col data' span={6}><h4>{getFramework()}</h4></Col>
      </Row>
      <Row className='dag_define_detail_row'>
        <Col className='dag_define_detail_col head' span={6}><h4>Runtime</h4></Col>
        <Col className='dag_define_detail_col data' span={6}><h4>{getRuntime()}</h4></Col>
        <Col className='dag_define_detail_col head' span={6}><h4>TensorRT Ver.</h4></Col>
        <Col className='dag_define_detail_col data' span={6}><h4>{getTensorRT()}</h4></Col>
      </Row>
      <Row className='dag_define_detail_row'>
        <Col className='dag_define_detail_col head' span={6}><h4>Type</h4></Col>
        <Col className='dag_define_detail_col data' span={6}><h4>{getType()}</h4></Col>
        <Col className='dag_define_detail_col head' span={6}><h4></h4></Col>
        <Col className='dag_define_detail_col data' span={6}><h4></h4></Col>
      </Row>
    </div>
  );
}

export default DagMonitoringDetailPod;