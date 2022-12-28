import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import { CDialogNew } from "@/components/dialogs";
import { swalError } from "@/utils/swal-utils";
import VolumeBasicInformation from "./VolumeBasicInformation";
import VolumeAdvancedSetting from "./VolumeAdvancedSetting";
import VolumYamlPopup from "./VolumYamlPopup";
import VolumePopup from "./VolumePopup";
import { deploymentStore, volumeStore, projectStore, StorageClassStore } from "@/store";

const Button = styled.button`
  background-color: #fff;
  border: 1px solid black;
  color: black;
  padding: 10px 35px;
  margin-right: 10px;
  border-radius: 4px;
`;

const ButtonNext = styled.button`
  background-color: #0f5ce9;
  color: white;
  border: none;
  padding: 10px 35px;
  border-radius: 4px;
`;

const CreateVolume = observer(props => {
  const { open } = props;
  const [stepValue, setStepValue] = useState(1);
  const { setProjectListinWorkspace } = projectStore;
  const {
    volumeName,
    setVolumeName,
    accessMode,
    volumeCapacity,
    setVolumeCapacity,
    responseData,
    setResponseData,
    content,
    setContent,
    clearAll,
    createVolume,
    setProject,
    project,
    selectClusters,
    setSelectClusters,
    clusterName,
  } = volumeStore;
  const { workspace, setWorkspace } = deploymentStore;
  const { storageClass, setStorageClass } = StorageClassStore;

  const template = {
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
      storageClassName: storageClass,
      accessModes: [accessMode],
      resources: {
        requests: {
          storage: Number(volumeCapacity) + "Gi",
        },
      },
    },
  };

  const onClickStepOne = e => {
    console.log(e);
    if (volumeName === "") {
      swalError("Volume 이름을 입력해주세요");
      return;
    }
    if (workspace === "") {
      swalError("Workspace를 선택해주세요");
      console.log(volumeName);
      return;
    }
    if (project === "") {
      swalError("Project를 선택해주세요");
      console.log(workspace);
      return;
    }
    if (selectClusters.length === 0) {
      swalError("클러스터를 확인해주세요!");
      console.log(project);
      return;
    }
    if (accessMode === "") {
      swalError("Access Mode를 선택해주세요");
      console.log(accessMode);
      return;
    }
    if (storageClass === "") {
      swalError("StorageClass를 선택해주세요");
      console.log(storageClass);
      return;
    }
    if (volumeCapacity === "") {
      swalError("Volume 용량을 입력해주세요");
      console.log(volumeCapacity);
      return;
    } else {
      setStepValue(2);
    }
  };

  const handleClose = () => {
    props.onClose && props.onClose();
    setProjectListinWorkspace();
    setStepValue(1);
    clearAll();
    setVolumeName("");
    setWorkspace("");
    setProject("");
    setStorageClass("");
  };

  const onClickStepTwo = () => {
    setStepValue(3);
  };

  const handlePreStepValue = () => {
    setWorkspace();
    setProject();
  };

  const CreateVolume = () => {
    // for문으로 복수의 클러스터이름 보내게
    createVolume(require("json-to-pretty-yaml").stringify(template));
    handleClose();
    props.reloadFunc && props.reloadFunc();
    // setSelectClusters();
  };

  useEffect(() => {
    if (stepValue === 3) {
      const YAML = require("json-to-pretty-yaml");
      setContent(YAML.stringify(template));
    }
  }, [stepValue]);

  const stepOfComponent = () => {
    if (stepValue === 1) {
      return (
        <>
          <VolumeBasicInformation />
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
              <ButtonNext onClick={e => onClickStepOne(e)}>다음</ButtonNext>
            </div>
          </div>
        </>
      );
    } else if (stepValue === 2) {
      return (
        <>
          <VolumeAdvancedSetting />
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
              <ButtonNext onClick={() => onClickStepTwo()}>다음</ButtonNext>
            </div>
          </div>
        </>
      );
    } else if (stepValue === 3) {
      return (
        <>
          <VolumYamlPopup />
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
              <ButtonNext onClick={() => CreateVolume()}>Schedule Apply</ButtonNext>
            </div>
          </div>
        </>
      );
    } else <VolumePopup />;
  };

  return (
    <CDialogNew id="myDialog" open={open} maxWidth="md" title={"Create Volume"} onClose={handleClose} bottomArea={false} modules={["custom"]}>
      {stepOfComponent()}
    </CDialogNew>
  );
});
export default CreateVolume;
