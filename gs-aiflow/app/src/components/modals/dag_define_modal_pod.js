import { React, useEffect, useState } from 'react';
import { Form, Input, Select } from 'antd';
import axios from 'axios';
import { useQuery } from 'react-query';
import { APIGetPodEnvFramework, APIGetPodEnvModel, APIGetPodEnvRuntime, APIGetPodEnvTensorrt } from 'utils/api';

const DagDefineModalPod = (props) => {
  const form = props.form;
  const nodes = props.nodes;
  const originName = props.name;

  const [nameStatus, setNameStatus] = useState( form.name != null && form.name != undefined && form.name != '' ? { status: "success", help: "" } : { status: "", help: "" })
  const [frameworkList, setFrameworkList] = useState([])
  const [runtimeList, setRuntimeList] = useState([])
  const [tensorRTList, setTensorRTList] = useState([])

  const [detailEnabled, setDetailEnabled] = useState(false);
  const [detailDatasetPath, setDetailDatasetPath] = useState(form.datasetPath ? form.datasetPath : null);
  const [detailModelPath, setDetailModelPath] = useState(form.modelPath ? form.modelPath : null);
  const [detailOutputPath, setDetailOutputPath] = useState(form.outputPath ? form.outputPath : null);
  const [selectedTask, setSelectedTask] = useState(form.task ? form.task : null);
  const [selectedModel, setSelectedModel] = useState(form.model ? form.model : null);
  const [selectedFramework, setSelectedFramework] = useState(getDefaultFrameworkList);
  const [selectedRuntime, setSelectedRuntime] = useState(getDefaultRuntimeList);
  const [selectedTensorRT, setSelectedTensorRT] = useState(getDefaultTensorRTList);
  useEffect(()=>{

  }, [detailEnabled]);

  const getModelsAPI = async () => {
    const {data} = await APIGetPodEnvModel();
    return data;
  };

  const {isLoading, isError, data, error} = useQuery(["models"], () => { return getModelsAPI() }, {
    refetchOnWindowFocus: false,
    retry: 0,
  });

  const options = [];
  const ids = [];
  nodes.forEach((node) => {
    if(originName != null && originName != undefined){
      if(node.id == originName){
        return;
      }
    }

    options.push({
      label: node.id,
      value: node.id,
      key: node.id
    });
    ids.push(node.id);
  });

  function getModels(){
    if(isError){
      return;
    }
    if(data){
      if(data.model){
        const models = [];
        data.model.forEach((model) => {
          models.push(<Select.Option value={model}>{model}</Select.Option>)
        })
        return models;
      }
    }
    return;
  }

  function getFrameworks(){
    if(frameworkList){
      const frameworks = [];
        frameworkList.forEach((framework) => {
          frameworks.push(<Select.Option value={framework}>{framework}</Select.Option>)
        })
        return frameworks;
    }
    return;
  }

  function getRuntimes(){
    if(runtimeList){
      const runtimes = [];
      runtimeList.forEach((runtime) => {
        runtimes.push(<Select.Option value={runtime.runtime_name}>{runtime.runtime_name}</Select.Option>)
      })
      return runtimes;
    }
    return;
  }

  function getTensorRTs(){
    if(tensorRTList){
      const tensorRTs = [];
      tensorRTList.forEach((tensorRT) => {
        tensorRTs.push(<Select.Option value={tensorRT.tensorrt_name}>{tensorRT.tensorrt_name}</Select.Option>)
      })
      return tensorRTs;
    }
    return;
  }

  var specialNameRegex = /^[A-Za-z0-9\-]+$/;

  function checkName(data) {
    var status = "";
    if(originName != null){
      if(data.target.value == originName){
        status = "success";
        setNameStatus({ status: "success", help: "" })
        
        form.name = data.target.value;
        form.status = status;
        return;
      }
    }

    if (ids.includes(data.target.value)) {
      status = "error";
      setNameStatus({ status: "error", help: "name is duplicated" })
    }
    else if(!specialNameRegex.test(data.target.value)){
      status = "error";
      setNameStatus({ status: "error", help: "name is wrong" })
    }
    else {
      status = "success";
      setNameStatus({ status: "success", help: "" })
    }
    form.name = data.target.value;
    form.status = status;
  }

  function onChangePrecondition(data) {
    form.precondition = data;
  }

  function onChangeModel(data) {
    form.model = data;
    setSelectedModel(data);

    APIGetPodEnvFramework(data)
    .then((res) => {
      setFrameworkList(res.data.framework);
    })
    .catch((error) => {
      setFrameworkList([]);
    });

    onChangeFrameWorks(null);
  }
  
  function onChangeTask(data) {
    setSelectedTask(data);
    form.task = data;

    onChangeDatasetPath(null);
    onChangeModelPath(null);
    onChangeOutputPath(null);
  }

  function onChangeDatasetPath(target){
    var data = null;
    if(target){
      if(target.target){
        if(target.target.value){
          data = target.target.value
        }
      }
    }

    setDetailDatasetPath(data);
    form.datasetPath = data;
  }

  function onChangeModelPath(target){
    var data = null;
    if(target){
      if(target.target){
        if(target.target.value){
          data = target.target.value
        }
      }
    }

    setDetailModelPath(data);
    form.modelPath = data;
  }

  function onChangeOutputPath(target){
    var data = null;
    if(target){
      if(target.target){
        if(target.target.value){
          data = target.target.value
        }
      }
    }

    setDetailOutputPath(data);
    form.outputPath = data;
  }

  function onChangeFrameWorks(data) {
    form.framework = data;
    setSelectedFramework(data);

    if(data){
      APIGetPodEnvRuntime(form.model, data)
      .then((res) => {
        setRuntimeList(res.data.runtime)
      })
      .catch((error) => {
        setRuntimeList([]);
      });  
    }
    else{
      setRuntimeList([]);
    }

    onChangeRuntime(null);
  }

  function onChangeRuntime(data) {
    form.runtime = data;
    setSelectedRuntime(data);

    if(data){
      APIGetPodEnvTensorrt(data)
      .then((res) => {
        setTensorRTList(res.data.tensorrt)
      })
      .catch((error) => {
        setTensorRTList([]);
      });
    }
    else{
      setTensorRTList([]);
    }

    setDetailEnabled(false);
    onChangeTensorRT(null);
  }

  function onChangeTensorRT(data) {
    form.tensorRT = data;
    setSelectedTensorRT(data);
    if(data == null){
      setDetailEnabled(false);
    }
    else{
      setDetailEnabled(true);
    }
  }

  function getDefaultName(){
    if(form.name != null && form.name != undefined){
      var status = "success";
      form.status = status;
      return form.name;
    }
    else{
      return '';
    }
  }

  function getDefaultFrameworkList(){
    if(form.model != null && form.model != undefined){
      APIGetPodEnvFramework(form.model)
      .then((res) => {
        setFrameworkList(res.data.framework);
      })
      .catch((error) => {
        setFrameworkList([]);
      });
    }

    if(form.framework != null && form.framework != undefined){
      return form.framework;
    }
    return '';
  }


  function getDefaultRuntimeList(){
    if(form.framework != null && form.framework != undefined
      && form.model != null && form.model != undefined){
      APIGetPodEnvRuntime(form.model, form.framework)
      .then((res) => {
        setRuntimeList(res.data.runtime);
      })
      .catch((error) => {
        setRuntimeList([]);
      });
    }

    if(form.runtime != null && form.runtime != undefined){
      return form.runtime;
    }
    return '';
  }


  function getDefaultTensorRTList(){
    if(form.runtime != null && form.runtime != undefined){
      APIGetPodEnvTensorrt(form.runtime)
      .then((res) => {
        setTensorRTList(res.data.tensorrt)
      })
      .catch((error) => {
        setTensorRTList([]);
      });
    }

    if(form.tensorRT != null && form.tensorRT != undefined){
      setDetailEnabled(true);
      return form.tensorRT;
    }
    setDetailEnabled(false);
    return '';
  }


  function getIsDisplayDatasetPath(){
    if(selectedTask == 'Train')
      return '';
    if(selectedTask == 'Validate')
      return '';
    if(selectedTask == 'Opt_Validate')
      return '';
    
    return 'none';
  }

  function getIsDisplayModelPath(){
    if(selectedTask == 'Validate')
      return '';
    if(selectedTask == 'Optimization')
      return '';
    if(selectedTask == 'Opt_Validate')
      return '';
    
    return 'none';
  }

  function getIsDisplayOutputPath(){
    if(selectedTask == 'Train')
      return '';
    if(selectedTask == 'Validate')
      return '';
    if(selectedTask == 'Opt_Validate')
      return '';
    
    return 'none';
  }

  return (
    <div>
      <Form
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 18 }}
        layout="horizontal"
        disabled={false}
        style={{ maxWidth: '800px' }}
      >
        <Form.Item label="Type">
          <Input disabled={false} value={"Pod"} />
        </Form.Item>
        <Form.Item label="Name" validateStatus={nameStatus.status}
          help={nameStatus.help} hasFeedback>
          <Input placeholder='Task Name' value={getDefaultName()} onChange={checkName} />
          <label>알파벳과 숫자, 특수문자 - 만 가능합니다.</label>
        </Form.Item>
        <Form.Item label="Task">
          <Select onChange={onChangeTask} defaultValue={selectedTask}>
            <Select.Option value="Train">Train</Select.Option>
            <Select.Option value="Validate">Validate</Select.Option>
            <Select.Option value="Optimization">Optimization</Select.Option>
            <Select.Option value="Opt_Validate">Opt_Validate</Select.Option>
            <Select.Option value="Inference">Inference</Select.Option>
          </Select>
        </Form.Item>
        <div style={{ display: selectedTask ? '' : 'none'}}>
          <Form.Item label="Dataset Path" style={{display: getIsDisplayDatasetPath()}}>
            <Input placeholder='Dataset Path' value={detailDatasetPath} onChange={onChangeDatasetPath} />
            <label>경로에 dataset.yaml이 존재해야 합니다. default = 빈칸</label>
          </Form.Item>

          <Form.Item label="Model Path" style={{display: getIsDisplayModelPath()}}>
            <Input placeholder='Model Path' value={detailModelPath} onChange={onChangeModelPath} />
            <label>모델 경로를 지정해야 합니다. default = 빈칸</label>
          </Form.Item>

          <Form.Item label="Output Path" style={{display: getIsDisplayOutputPath()}}>
            <Input placeholder='Output Path' value={detailOutputPath} onChange={onChangeOutputPath} />
            <label>해당 기존 경로의 내용물은 지워집니다. default = 빈칸</label>
          </Form.Item>
        </div>
        <Form.Item label="Precondition">
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Please select"
            defaultValue={form.precondition != null && form.precondition != undefined ? form.precondition : [] }
            options={options}
            onChange={onChangePrecondition}
          />
        </Form.Item>
        <Form.Item label="Model">
          <Select onChange={onChangeModel}
          value={selectedModel}
          >
            {!isLoading && getModels()}
          </Select>
        </Form.Item>
         <Form.Item label="Framework">
          <Select onChange={onChangeFrameWorks} value={selectedFramework}>
            {!isLoading && getFrameworks()}
          </Select>
        </Form.Item>
         <Form.Item label="Runtime">
          <Select onChange={onChangeRuntime}  value={selectedRuntime}>
            {!isLoading && getRuntimes()}
          </Select>
        </Form.Item>
        <Form.Item label="TensorRT">
          <Select onChange={onChangeTensorRT} value={selectedTensorRT} >
            {!isLoading && getTensorRTs()}
          </Select>
        </Form.Item>
      </Form>
    </div>
  );
}

export default DagDefineModalPod;