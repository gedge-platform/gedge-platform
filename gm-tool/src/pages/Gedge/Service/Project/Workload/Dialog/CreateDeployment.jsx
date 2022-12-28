import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import DeploymentBasicInformation from "./DeploymentBasicInformation";
import DeploymentPodSettins from "./DeploymentPodSettins";
import { deploymentStore, projectStore, schedulerStore, volumeStore, StorageClassStore } from "@/store";
import DeploymentYaml from "./DeploymentYaml";
import DeploymentPopup from "./DeploymentPopup";
import DeploymentVolumeSetting from "./DeploymentVolumeSetting";
import DeploymentVolumeYaml from "./DeploymentVolumeYaml";
import { swalError } from "@/utils/swal-utils";
import { CDialogNew } from "@/components/dialogs";

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

const CreateDeployment = observer(props => {
  const { open } = props;
  const [stepValue, setStepValue] = useState(1);
  const [size, setSize] = useState("md");

  const {
    deploymentName,
    podReplicas,
    containerName,
    containerImage,
    containerPort,
    project,
    workspace,
    setWorkspace,
    setContent,
    clearAll,
    setProject,
    containerPortName,
    postDeploymentGM,
    postDeploymentPVC,
    setContentVolume,
  } = deploymentStore;

  const { setVolumeName, setAccessMode, setVolumeCapacity, volumeCapacity, volumeName, selectClusters, accessMode } = volumeStore;

  const { setStorageClass, selectStorageClass } = StorageClassStore;

  const { setProjectListinWorkspace } = projectStore;
  const { postWorkload, postScheduler } = schedulerStore;

  const template = {
    apiVersion: "apps/v1",
    kind: "Deployment",
    metadata: {
      name: deploymentName,
      namespace: project,
      labels: {
        app: deploymentName,
      },
    },
    spec: {
      replicas: podReplicas,
      selector: {
        matchLabels: {
          app: deploymentName,
        },
      },
      template: {
        metadata: {
          labels: {
            app: deploymentName,
          },
        },
        spec: {
          containers: [
            {
              image: containerImage,
              name: containerName,
              ports: [
                {
                  containerPort: Number(containerPort),
                },
              ],
            },
          ],
        },
      },
    },
  };

  const templatePVC = {
    apiVersion: "v1",
    kind: "PersistentVolumeClaim",
    metadata: {
      name: volumeName,
      namespace: project,
      labels: {
        app: "",
      },
    },
    spec: {
      storageClassName: selectStorageClass,
      accessModes: [accessMode],
      resources: {
        requests: {
          storage: Number(volumeCapacity) + "Gi",
        },
      },
    },
  };

  const onClickStepOne = () => {
    if (workspace === "") {
      swalError("워크스페이스를 선택해주세요");
      return;
    }
    if (project === "") {
      swalError("프로젝트를 선택해주세요");
      return;
    }
    if (deploymentName === "") {
      swalError("이름을 입력해주세요");
      return;
    } else {
      setStepValue(2);
    }
  };

  const onClickStepTwo = () => {
    if (podReplicas === 0) {
      swalError("레플리카 개수를 입력하세요!");
      return;
    }
    if (containerName === "") {
      swalError("컨테이너 이름을 입력하세요!");
      return;
    }
    if (containerImage === "") {
      swalError("컨테이너 이미지를 입력하세요!");
      return;
    }
    if (containerPortName === "") {
      swalError("포트 이름을 입력하세요!");
      return;
    }
    if (containerPort === "") {
      swalError("포트를 입력하세요!");
      return;
    } else {
      setStepValue(3);
    }
  };

  const onClickStepThree = () => {
    if (volumeName === "") {
      swalError("Volume 이름을 입력해주세요");
      return;
    }
    if (selectClusters.length === 0) {
      swalError("클러스터를 확인해주세요!");
      return;
    }
    if (selectStorageClass === "") {
      swalError("StorageClass를 선택해주세요");
      return;
    }
    if (accessMode === "") {
      swalError("Access Mode를 선택해주세요");
      return;
    }
    if (volumeCapacity === "") {
      swalError("Volume 용량을 입력해주세요");
      return;
    } else {
      setStepValue(4);
    }
  };

  const onClickStepFour = () => {
    postDeploymentPVC(require("json-to-pretty-yaml").stringify(templatePVC));
    setStepValue(5);
  };

  const handleClose = () => {
    props.onClose && props.onClose();
    setProjectListinWorkspace();
    setStepValue(1);
    clearAll();
    setVolumeName();
    setAccessMode();
    setVolumeCapacity();
    setStorageClass();
  };

  const handlePreStepValue = () => {
    setWorkspace();
    setProject();
  };

  // const createDeployment = () => {
  //   postDeployment(handleClose);
  // };
  // const createDeployment = () => {
  //   const requestId = `${deploymentName}-${randomString()}`;

  //   postWorkload(requestId, workspace, project, "Deployment");
  //   console.log(requestId, workspace, project, "Deployment");
  //   postScheduler(requestId, content, handleClose);
  //   console.log(requestId, content, handleClose);

  // let formData = new FormData();
  // formData.append("callbackUrl", `${REQUEST_UR2}`); // 수정 필요
  // formData.append("requestId", requestId);
  // formData.append("yaml", content);
  // formData.append("clusters", JSON.stringify(clusters));

  // axios
  //   .post(`http://101.79.4.15:32527/yaml`, formData)
  //   .then(function (response) {
  //     if (response.status === 200) {
  //       setResponseData(response.data);

  //       const popup = window.open(
  //         "",
  //         "Gedge scheduler",
  //         `width=${screen.width},height=${screen.height}`,
  //         "fullscreen=yes"
  //       );
  //       popup.document.open().write(response.data);
  //       popup.document.close();

  //       handleClose();
  //       // setStepValue(4);
  //     }
  //   })
  //   .catch(function (error) {
  //     console.log(error);
  //   });
  // };

  const createDeployment = () => {
    postDeploymentGM(require("json-to-pretty-yaml").stringify(template));
    handleClose();
    props.reloadFunc && props.reloadFunc();
  };

  // useEffect는 component가 rendeing될 때마다 특정 작업을 실행할 수 있도록하는 Hook
  // 클래스형 컴포넌트에서 사용할 수 있었던 생명주기 메소드를 함수형 컴포넌트에서도 사용할 수 있게 됨

  useEffect(() => {
    if (stepValue === 4) {
      const YAML = require("json-to-pretty-yaml");
      setContentVolume(YAML.stringify(templatePVC));
    }
  }, [stepValue]);

  useEffect(() => {
    if (stepValue === 5) {
      const YAML = require("json-to-pretty-yaml");
      setContent(YAML.stringify(template));
    }
  }, [stepValue]);

  const stepOfComponent = () => {
    if (stepValue === 1) {
      return (
        <>
          <DeploymentBasicInformation />
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
              <ButtonNext onClick={() => onClickStepOne()}>다음</ButtonNext>
            </div>
          </div>
        </>
      );
    } else if (stepValue === 2) {
      return (
        <>
          <DeploymentPodSettins />
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
              <Button
                onClick={() => {
                  handlePreStepValue();
                  setStepValue(1);
                }}
              >
                이전
              </Button>
              <ButtonNext onClick={onClickStepTwo}>다음</ButtonNext>
            </div>
          </div>
        </>
      );
    } else if (stepValue === 3) {
      return (
        <>
          <DeploymentVolumeSetting />
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
              <Button onClick={() => setStepValue(2)}>이전</Button>
              <ButtonNext onClick={onClickStepThree}>다음</ButtonNext>
              {/* <ButtonNext onClick={createDeployment}>Default Apply</ButtonNext> */}
            </div>
          </div>
        </>
      );
    } else if (stepValue === 4) {
      return (
        <>
          <DeploymentVolumeYaml />
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
              <Button onClick={() => setStepValue(3)}>이전</Button>
              <ButtonNext onClick={onClickStepFour}>다음</ButtonNext>
              {/* <ButtonNext onClick={createDeployment}>Default Apply</ButtonNext> */}
            </div>
          </div>
        </>
      );
    } else if (stepValue === 5) {
      return (
        <>
          <DeploymentYaml />
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
              <Button onClick={() => setStepValue(4)}>이전</Button>
              <ButtonNext onClick={createDeployment}>Schedule Apply</ButtonNext>
              {/* <ButtonNext onClick={createDeployment}>Default Apply</ButtonNext> */}
            </div>
          </div>
        </>
      );
    } else return <DeploymentPopup />;
  };

  return (
    <CDialogNew id="myDialog" open={open} maxWidth="md" title={"Create Deployment"} onClose={handleClose} bottomArea={false} modules={["custom"]}>
      {stepOfComponent()}
    </CDialogNew>
  );
});
export default CreateDeployment;
