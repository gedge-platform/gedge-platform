import { observer } from "mobx-react";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { swalError } from "@/utils/swal-utils";
import { CDialogNew } from "@/components/dialogs";
import {
  claimStore,
  deploymentStore,
  projectStore,
  StorageClassStore,
  volumeStore,
} from "@/store";
import ClaimBasicInformation from "./ClaimBasicInformation";
// import VolumeAdvancedSetting from "../Dialog/VolumeAdvancedSetting";
import VolumYamlPopup from "../Dialog/VolumYamlPopup";
import VolumePopup from "../Dialog/VolumePopup";
import ClaimAdvancedSetting from "./ClaimAdvancedSetting";
import ClaimYamlPopup from "./ClaimYamlPopup";
import { stringify } from "json-to-pretty-yaml2";

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

const CreateClaim = observer((props) => {
  const { open, labelsList } = props;
  const [stepValue, setStepValue] = useState(1);
  const { setProjectListinWorkspace } = projectStore;
  const {
    claimName,
    setClaimName,
    accessMode,
    volumeCapacity,
    setContent,
    clearAll,
    createVolumeClaim,
    setProject,
    project,
    selectClusters,
    labelList,
    labels,
    annotations,
    labelInput,
    annotationInput,
    labelKey,
    labelValue,
    annotationKey,
    annotationValue,
    setTemplate,
    setClearLA,
  } = claimStore;

  const { workspace, setWorkspace } = deploymentStore;
  const {
    storageClass,
    setStorageClass,
    selectStorageClass,
    setSelectStorageClass,
  } = StorageClassStore;

  const template = {
    apiVersion: "v1",
    kind: "PersistentVolumeClaim",
    metadata: {
      name: claimName,
      namespace: project,
      labels: labelInput,
      annotations: annotationInput,
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

  const onClickStepOne = (e) => {
    const checkRegex = /^[a-z0-9]([-a-z0-9]*[a-z0-9])*$/;
    if (claimName === "") {
      swalError("Claim 이름을 입력해주세요");
      return;
    } else if (!checkRegex.test(claimName)) {
      swalError("영어소문자와 숫자만 입력해주세요.");
      return;
    }
    if (workspace === "") {
      swalError("Workspace를 선택해주세요");
      return;
    }
    if (project === "") {
      swalError("Project를 선택해주세요");
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
      setStepValue(2);
    }
  };

  const handleClose = () => {
    props.onClose && props.onClose();
    setProjectListinWorkspace();
    setStepValue(1);
    clearAll();
    setClaimName("");
    setWorkspace("");
    setProject("");
    setSelectStorageClass("");
    setClearLA();
  };

  const onClickStepTwo = (e) => {
    if (labelKey.length < 1 || labelValue.length < 1) {
      swalError("Labels를 입력해주세요");
      return;
    }

    const LabelKeyArr = [];
    const AnnotationKeyArr = [];

    labels.map((data) => LabelKeyArr.push(data.labelKey));
    annotations.map((data) => AnnotationKeyArr.push(data.annotationKey));
    setStepValue(3);
  };

  const handlePreStepValue = () => {
    setClearLA();
    setWorkspace("");
    setProject("");
  };

  const CreateVolume = () => {
    createVolumeClaim(stringify(template));
    handleClose();
    props.reloadFunc && props.reloadFunc();
  };

  const onClickBackStepTwo = () => {
    setClearLA();
    setStepValue(2);
  };

  useEffect(() => {
    if (stepValue === 3) {
      setTemplate(template);
      if (template) {
        if (
          template.metadata?.annotations === ': ""' ||
          isEmpty(template.metadata?.annotations)
        ) {
          delete template.metadata.annotations;
        }
        if (
          template.metadata?.labels === ': ""' ||
          isEmpty(template.metadata.labels)
        ) {
          delete template.metadata.labels;
        }
        setContent(stringify(template));
      }
      setContent(stringify(template));
    }
  }, [stepValue]);

  const stepOfComponent = () => {
    if (stepValue === 1) {
      return (
        <>
          <ClaimBasicInformation />
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
              <ButtonNext onClick={(e) => onClickStepOne(e)}>다음</ButtonNext>
            </div>
          </div>
        </>
      );
    } else if (stepValue === 2) {
      return (
        <>
          <ClaimAdvancedSetting />
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
              <ButtonNext onClick={(e) => onClickStepTwo(e)}>다음</ButtonNext>
            </div>
          </div>
        </>
      );
    } else if (stepValue === 3) {
      return (
        <>
          <ClaimYamlPopup labelsList={labelsList} />
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
              <Button onClick={() => onClickBackStepTwo()}>이전</Button>
              <ButtonNext onClick={() => CreateVolume()}>
                Schedule Apply
              </ButtonNext>
            </div>
          </div>
        </>
      );
    } else <VolumePopup />;
  };

  return (
    <CDialogNew
      id="myDialog"
      open={open}
      maxWidth="md"
      title={"Create Claim"}
      onClose={handleClose}
      bottomArea={false}
      modules={["custom"]}
    >
      {stepOfComponent()}
    </CDialogNew>
  );
});

export default CreateClaim;
