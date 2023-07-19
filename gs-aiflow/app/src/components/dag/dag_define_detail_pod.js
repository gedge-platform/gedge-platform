import { React, useState } from 'react';
import { Row, Col, Button, Modal } from 'antd';
import axios from 'axios';
import { catchError } from '../../utils/network';
import { useNavigate } from 'react-router';
import { APIGetProjectPodYaml } from 'utils/api';

const DagDefineDetailPod = (props) => {
  const data = props.data;
  const edges = props.edges;
  const projectID = props.projectID;
  const [open, setOpen] = useState(false);
  const [yaml, setYaml] = useState({});
  const navigate = useNavigate();
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

  function onClickYaml(){
    setOpen(true)
    APIGetProjectPodYaml(projectID, getPodName())
    .then((res) => {
      if(res.data.yaml){
        setYaml(res.data.yaml);
      }
    })
    .catch((err)=>{
      if(err){
        if(err.response){
          if(err.response.status == 404){
            setYaml('yaml not created. please save');
            return;
          }
        }
      }
      catchError(err, navigate);
    });
  }

  return (
    // 모달이 열릴때 openModal 클래스가 생성된다.
    <div id='dag_define_detail'>
      <Row className='dag_define_detail_row'>
        <Col className='dag_define_detail_col head' span={6}><h4>Type</h4></Col>
        <Col className='dag_define_detail_col data' span={6}><h4>{getType()}</h4></Col>
        <Col className='dag_define_detail_col head' span={6}><h4>Pod Name</h4></Col>
        <Col className='dag_define_detail_col data' span={6}><h4>{getPodName()}</h4></Col>
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
        <Col className='dag_define_detail_col head' span={6}><h4>Yaml</h4></Col>
        <Col className='dag_define_detail_col data' span={6}>
          <Button type='primary' onClick={onClickYaml}>See</Button>
        </Col>

      </Row>
      <Modal 
      title={'yaml'}
      open={open}
      onOk={()=>{setOpen(false)}}
      onCancel={()=>{setOpen(false)}}
      destroyOnClose={true}
      >
        <div 
          style={{width:'100%', height:'600px', whiteSpace:'pre-wrap', wordBreak:'break-all', overflowY:'auto'}}>
        {
          typeof yaml == 'object' ? JSON.stringify(yaml, null, 4) : yaml
        }
        </div>
      </Modal>
    </div>
  );
}

export default DagDefineDetailPod;