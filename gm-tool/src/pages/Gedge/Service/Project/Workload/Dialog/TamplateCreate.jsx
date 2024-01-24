import { observer } from "mobx-react";
import { CDialogNew } from "@/components/dialogs";
import { useState, useEffect } from "react";
import CreateTamplateStepOne from "./CreateTamplateStepOne";
import CreateTamplateStepTwo from "./CreateTamplateStepTwo";
import CreateTamplateStepThree from "./CreateTamplateStepThree";
import CreateTamplateStepFour from "./CreateTamplateStepFour";
import styled from "styled-components";
import { deploymentStore, workspaceStore } from "@/store";
import TamplateYaml from "./TamplateYAML";
import templateStore from "../../../../../../store/Template";
import { stringify } from "json-to-pretty-yaml2";
import { swalError } from "../../../../../../utils/swal-utils";

const Button = styled.button`
  background-color: #fff;
  border: 1px solid black;
  color: black;
  padding: 10px 35px;
  margin-right: 10px;
  border-radius: 4px;
  /* box-shadow: 0 8px 16px 0 rgb(35 45 65 / 28%); */
`;

const ButtonNext = styled.button`
  background-color: #0f5ce9;
  color: white;
  border: none;
  padding: 10px 35px;
  border-radius: 4px;
  /* box-shadow: 0 8px 16px 0 rgb(35 45 65 / 28%); */
`;

// deployment store 사용
const TamplateCreate = observer((props) => {
  const {
    setContent,
    setTemplate,
    postDeploymentGM,
    appInfo,
    deployment,
    resetDeployment,
    initTargetClusters,
    targetClusters,
    postTemplateGM,
    postTemplateGLowLatency,
    postTemplateGMostRequest,
    postTemplateSelected,
    postTemplateGSetCluster,
  } = deploymentStore;

  const { deploymentYamlTemplate, serviceYamlTemplate } = templateStore;

  const { loadWorkSpaceList } = workspaceStore;

  const { open } = props;
  const [stepValue, setStepValue] = useState(1);

  const goStepTwo = () => {
    const checkRegex = /^[a-z0-9]([-a-z0-9]*[a-z0-9])*$/;
    if (appInfo.app === "") {
      swalError("App을 선택해주세요");
      return;
    }
    if (appInfo.appVersion === "") {
      swalError("Version을 선택해주세요");
      return;
    }
    if (appInfo.appName === "") {
      swalError("App 이름을 입력해주세요");
      return;
    } else if (!checkRegex.test(appInfo.appName)) {
      swalError("영어소문자와 숫자만 입력해주세요.");
      return;
    }
    if (appInfo.appWorkspace === "") {
      swalError("Workspace를 선택해주세요");
      return;
    }
    if (appInfo.appProject === "") {
      swalError("Project를 선택해주세요");
      return;
    }
    if (appInfo.appReplicas === "") {
      swalError("Project를 선택해주세요");
      return;
    }
    setStepValue(2);
  };

  const goStepThree = () => {
    if (deployment.priority.name === "GLowLatencyPriority") {
      if (deployment.priority.sourceCluster === "") {
        swalError("Source Cluster를 선택해주세요");
        return;
      }
      // if (deployment.priority.sourceNode === "") {
      //   swalError("Source Node를 선택해주세요");
      //   return;
      // }
      if (deployment.priority.podName === "") {
        swalError("Pod를 선택해주세요");
        return;
      }
    }
    if (deployment.priority.name === "GMostRequestPriority") {
    }
    if (deployment.priority.name === "GSelectedClusterPriority") {
      if (deployment.priority.mode === "node") {
        if (deployment.priority.sourceNode === "") {
          swalError("Source Node를 선택해주세요");
          return;
        }
      }
    }
    if (targetClusters.length === 0) {
      swalError("Target Cluster를 선택해주세요");
      return;
    }
    setStepValue(3);
  };

  const backStepOne = () => {
    setStepValue(1);
  };

  const backStepTwo = () => {
    setStepValue(2);
  };

  const handleClose = () => {
    props.onClose && props.onClose();
    setStepValue(1);
  };

  const createApp = () => {
    setContent(
      stringify(deploymentYamlTemplate) +
        "---\n" +
        stringify(serviceYamlTemplate)
    );
    if (deployment.priority.name === "GLowLatencyPriority") {
      postTemplateGLowLatency();
    }
    if (deployment.priority.name === "GMostRequestPriority") {
      postTemplateGMostRequest();
    }
    if (deployment.priority.name === "GSelectedClusterPriority") {
      postTemplateSelected();
    }
    if (deployment.priority.name === "GSetClusterPriority") {
      postTemplateGSetCluster();
    }

    handleClose();
    props.reloadFunc && props.reloadFunc();
  };

  useEffect(() => {
    loadWorkSpaceList();

    if (stepValue === 3) {
      // setTemplate(template);
      // const YAML = require("json-to-pretty-yaml");
      // setContent(YAML.stringify(template));
    }
  }, [stepValue]);

  useEffect(() => {
    resetDeployment();
    initTargetClusters([]);
  }, [open]);

  const CreateTamplateComponent = () => {
    if (stepValue === 1) {
      return (
        <>
          <CreateTamplateStepOne />
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "32px",
            }}
          >
            <div
              style={{
                display: "flex",
                width: "240px",
                justifyContent: "center",
              }}
            >
              <Button onClick={handleClose}>취소</Button>
              <ButtonNext onClick={goStepTwo}>다음</ButtonNext>
            </div>
          </div>
        </>
      );
    } else if (stepValue === 2) {
      return (
        <>
          <CreateTamplateStepThree />
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "32px",
            }}
          >
            <div
              style={{
                display: "flex",
                width: "240px",
                justifyContent: "center",
              }}
            >
              <Button onClick={backStepOne}>이전</Button>
              <ButtonNext onClick={goStepThree}>다음</ButtonNext>
            </div>
          </div>
        </>
      );
    } else if (stepValue === 3) {
      return (
        <>
          <CreateTamplateStepFour />
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "32px",
            }}
          >
            <div
              style={{
                display: "flex",
                width: "300px",
                justifyContent: "center",
              }}
            >
              <Button onClick={backStepTwo}>이전</Button>
              <ButtonNext onClick={createApp}>Create App</ButtonNext>
            </div>
          </div>
        </>
      );
    }
  };

  return (
    <CDialogNew
      id="myDialog"
      open={open}
      maxWidth="md"
      title={"Create Template"}
      onClose={handleClose}
      bottomArea={false}
      modules={["custom"]}
    >
      {CreateTamplateComponent()}
    </CDialogNew>
  );
});

export default TamplateCreate;
