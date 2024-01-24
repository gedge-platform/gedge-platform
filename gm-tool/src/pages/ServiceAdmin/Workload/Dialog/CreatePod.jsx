import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import {
  podStore,
  projectStore,
  schedulerStore,
  claimStore,
  workspaceStore,
} from "@/store";
import PodBasicInformation from "./PodBasicInformation";
import PodSettings from "./PodSettings";
import PodYaml from "./PodYaml";
import { CDialogNew } from "@/components/dialogs";
import { randomString } from "@/utils/common-utils";
import CreatePodStepOne from "./CreatePodStepOne";
import CreatePodStepTwo from "./CreatePodStepTwo";
import CreatePodStepThree from "./CreatePodStepThree";
import { swalError } from "@/utils/swal-utils";
import { stringify } from "json-to-pretty-yaml2";

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

const DeleteButton = styled.button`
  margin: 0px 0px 0px 3px;
  overflow: hidden;
  position: relative;
  border: none;
  width: 1.5em;
  height: 1.5em;
  border-radius: 50%;
  background: transparent;
  font: inherit;
  text-indent: 100%;
  cursor: pointer;

  &:hover {
    background: rgba(29, 161, 142, 0.1);
  }

  &:before,
  &:after {
    position: absolute;
    top: 15%;
    left: calc(50% - 0.0625em);
    width: 0.125em;
    height: 70%;
    border-radius: 0.125em;
    transform: rotate(45deg);
    background: currentcolor;
    content: "";
  }

  &:after {
    transform: rotate(-45deg);
  }
`;

const CreatePod = observer((props) => {
  const { open } = props;
  const {
    podInfo,
    initPodInfo,
    setContent,
    setClearLA,
    setTemplate,
    labels,
    annotations,
    labelInput,
    annotationInput,
    postPodGLowLatencyPriority,
    postPodGMostRequestPriority,
    postPodGSelectedClusterPriority,
    postPodGSetClusterPriority,
    labelKey,
    labelValue,
    targetClusters,
  } = podStore;

  const [stepValue, setStepValue] = useState(1);

  const { loadPVClaims } = claimStore;
  const { loadWorkSpaceList } = workspaceStore;

  const template = {
    apiVersion: "v1",
    kind: "Pod",
    metadata: {
      name: podInfo.podName,
      annotations: annotationInput,
      labels: labelInput,
    },
    spec: {
      restartPolicy: "Always",
      terminationGracePeriodSeconds: 30,
      ...(podInfo.containers && podInfo.containers.some((e) => e.pullSecret)
        ? {
            imagePullSecrets: podInfo.containers
              .filter((e) => e.pullSecret)
              .map((e) => {
                return { name: e.pullSecret };
              }),
          }
        : {}),
      containers: podInfo.containers?.map((e) => {
        return {
          name: e.containerName,
          image: e.containerImage,
          command: e.command.length !== 0 ? e.command.split(/[\s,]+/) : [],
          args: e.arguments.length !== 0 ? e.arguments.split(/[\s,]+/) : [],
          env: e.variables.map((i) => {
            if (i.type === "KeyValuePair") {
              return {
                name: i.value,
                value: i.variableName,
              };
            } else {
              return {
                name: i.type + "_key",
                valueForm: {
                  [i.type + "Ref"]: {
                    name: i.variableName,
                    key: i.type + "-key",
                  },
                },
              };
            }
          }),
          ports: e.ports.map((i) => {
            return {
              containerPort: parseInt(i.privateContainerPort),
              protocol: i.protocol,
            };
          }),
          resources: {
            requests: {
              cpu: e.cpuReservation + "m",
              memory: e.memoryReservation + "Mi",
            },
            limits: {
              cpu: e.cpuLimit + "m",
              memory: e.memoryLimit + "Mi",
              "nvidia.com/gpu": e.NVIDIAGPU,
            },
          },
        };
      }),
    },
  };

  const handleClose = () => {
    props.onClose && props.onClose();
    setStepValue(1);
    setClearLA();
    initPodInfo();
  };

  const onClickStepTwo = (e) => {
    const checkRegex = /^[a-z0-9]([-a-z0-9]*[a-z0-9])*$/;

    if (podInfo.podName === "") {
      swalError("Pod 이름을 입력해주세요");
      return;
    } else if (!checkRegex.test(podInfo.podName)) {
      swalError("영어소문자와 숫자만 입력해주세요.");
      return;
    }
    if (podInfo.workspace === "") {
      swalError("Workspace를 선택해주세요");
      return;
    }
    if (podInfo.project === "") {
      swalError("Project를 선택해주세요");
      return;
    }

    if (podInfo.containers.length === 0) {
      swalError("Container를 선택해주세요");
      return;
    }
    setClearLA();
    setStepValue(2);
  };

  const onClickStepThree = (e) => {
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

  const onClickStepFour = () => {
    if (
      podInfo.priority.mode === "from_node" &&
      podInfo.priority.sourceCluster === ""
    ) {
      swalError("sourceCluster를 선택해주세요");
      return;
    }
    if (
      (podInfo.priority.mode === "from_node") &
      (podInfo.priority.sourceNode === "")
    ) {
      swalError("sourceNode를 선택해주세요");
      return;
    }
    if (
      podInfo.priority.mode === "from_pod" &&
      podInfo.priority.sourceCluster === ""
    ) {
      swalError("sourceCluster를 선택해주세요");
      return;
    }
    if (
      (podInfo.priority.mode === "from_pod") &
      (podInfo.priority.podName === "")
    ) {
      swalError("pod를 선택해주세요");
      return;
    }
    if (targetClusters.length === 0) {
      swalError("targetClusters를 선택해주세요.");
      return;
    }
    if (
      (podInfo.priority.mode === "node") &
      (podInfo.priority.sourceNode === "")
    ) {
      swalError("sourceNode를 선택해주세요");
      return;
    }
    setStepValue(4);
  };

  const onClickBackStepOne = () => {
    setStepValue(1);
  };

  const onClickBackStepTwo = () => {
    setStepValue(2);
  };

  const onClickBackStepThree = () => {
    setStepValue(3);
  };

  const createPod = () => {
    if (podInfo.priority.name === "GLowLatencyPriority") {
      postPodGLowLatencyPriority(stringify(template));
    }
    if (podInfo.priority.name === "GMostRequestPriority") {
      postPodGMostRequestPriority(stringify(template));
    }
    if (podInfo.priority.name === "GSelectedClusterPriority") {
      postPodGSelectedClusterPriority(stringify(template));
    }
    if (podInfo.priority.name === "GSetClusterPriority") {
      postPodGSetClusterPriority(stringify(template));
    }
    handleClose();
    props.reloadFunc && props.reloadFunc();
  };

  useEffect(() => {
    loadWorkSpaceList();
    loadPVClaims();
    if (stepValue === 4) {
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

  const CreatePodComponent = () => {
    if (stepValue === 1) {
      return (
        <>
          <CreatePodStepOne />
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
              <ButtonNext onClick={(e) => onClickStepTwo(e)}>다음</ButtonNext>
            </div>
          </div>
        </>
      );
    } else if (stepValue === 2) {
      return (
        <>
          <CreatePodStepTwo />
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
              <Button onClick={() => onClickBackStepOne()}>이전</Button>
              <ButtonNext onClick={() => onClickStepThree()}>다음</ButtonNext>
            </div>
          </div>
        </>
      );
    } else if (stepValue === 3) {
      return (
        <>
          <CreatePodStepThree />
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
              <Button onClick={() => onClickBackStepTwo()}>이전</Button>
              <ButtonNext onClick={() => onClickStepFour()}>다음</ButtonNext>
            </div>
          </div>
        </>
      );
    } else {
      return (
        <>
          <PodYaml />
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
              <Button onClick={() => onClickBackStepThree()}>이전</Button>
              <ButtonNext onClick={createPod}>확인</ButtonNext>
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
      title={"Create Pod"}
      onClose={handleClose}
      bottomArea={false}
      modules={["custom"]}
    >
      {CreatePodComponent()}
    </CDialogNew>
  );
});
export default CreatePod;
