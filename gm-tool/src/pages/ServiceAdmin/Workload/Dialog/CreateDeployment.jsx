import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import { deploymentStore, workspaceStore, claimStore } from "@/store";
import DeploymentYaml from "./DeploymentYaml";
import DeploymentPopup from "./DeploymentPopup";
import { CDialogNew } from "@/components/dialogs";
import CreateDeploymentStepOne from "./CreateDeploymentStepOne";
import CreateDeploymentStepTwo from "./CreateDeploymentStepTwo";
import CreateDeploymentStepThree from "./CreateDeploymentStepThree";
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
const Table = styled.table`
  tbody {
    display: block;
    height: 170px;
    overflow: auto;
  }
  thead,
  tbody tr {
    display: table;
    width: 100%;
    table-layout: fixed;
  }
  thead {
    width: calc(100% - 1em);
  }
`;

const CreateDeployment = observer((props) => {
  const { open } = props;
  const [stepValue, setStepValue] = useState(1);

  const {
    deployment,
    setContent,
    setClearLA,
    setTemplate,
    labels,
    annotations,
    labelInput,
    annotationInput,
    keyValuePair,
    secretConfigmap,
    postGLowLatencyPriority,
    postGSelectedClusterPriority,
    postGMostRequestPriority,
    postGSetClusterPriority,
    resetDeployment,
    labelKey,
    labelValue,
    targetClusters,
  } = deploymentStore;

  const { loadPVClaims } = claimStore;

  const { loadWorkSpaceList } = workspaceStore;

  const [projectDisable, setProjectDisable] = useState(true);
  const [prioritytDisable, setPriorityDisable] = useState(true);
  const [prioritytPodDisable, setPrioritytPodDisable] = useState(true);

  const template = {
    apiVersion: "apps/v1",
    kind: "Deployment",
    metadata: {
      name: deployment.deploymentName,
      annotations: annotationInput,
      labels: labelInput,
    },
    spec: {
      selector: {
        matchLabels: labelInput,
      },
      replicas: deployment.replicas,
      template: {
        metadata: {
          annotations: annotationInput,
          labels: labelInput,
        },
        spec: {
          ...(deployment.containers &&
          deployment.containers.some((e) => e.pullSecret)
            ? {
                imagePullSecrets: deployment.containers
                  .filter((e) => e.pullSecret)
                  .map((e) => {
                    return { name: e.pullSecret };
                  }),
              }
            : {}),

          containers: deployment.containers?.map((e) => {
            const resources = {
              limits: {},
              requests: {},
            };
            if (e.cpuLimit !== "") {
              resources.limits.cpu = e.cpuLimit + "m";
            }
            if (e.memoryLimit !== "") {
              resources.limits.memory = e.memoryLimit + "Mi";
            }
            if (e.cpuLimit !== "") {
              resources.limits.NVIDIAGPU = e.NVIDIAGPU;
            }
            if (e.cpuLimit !== "") {
              resources.requests.cpu = e.cpuReservation + "m";
            }
            if (e.cpuLimit !== "") {
              resources.requests.memory = e.memoryReservation + "Mi";
            }
            return {
              name: e.containerName,
              image: e.containerImage,
              imagePullPolicy: e.pullPolicy,
              command: e.command.length !== 0 ? e.command.split(/[\s,]+/) : [],
              args: e.arguments.length !== 0 ? e.arguments.split(/[\s,]+/) : [],
              resources: resources,
              ports: e.ports.map((i) => {
                return {
                  name: i.name,
                  containerPort: parseInt(i.privateContainerPort),
                  protocol: i.protocol,
                };
              }),
              envFrom: secretConfigmap.map((i) => {
                const item = i.type + "Ref";
                return {
                  [i.type + "Ref"]: { name: i.variableName },
                };
              }),
              env: keyValuePair.map((i) => {
                return {
                  name: i[0],
                  value: i[1],
                };
              }),
            };
          }),
        },
      },
    },
  };

  const handleClose = () => {
    props.onClose && props.onClose();
    setStepValue(1);
    resetDeployment();
    setClearLA();
    setProjectDisable(true);
    setPriorityDisable(true);
    setPrioritytPodDisable(true);
  };

  const createDeployment = () => {
    if (deployment.priority.name === "GLowLatencyPriority") {
      postGLowLatencyPriority(stringify(template));
    }
    if (deployment.priority.name === "GMostRequestPriority") {
      postGMostRequestPriority(stringify(template));
    }
    if (deployment.priority.name === "GSelectedClusterPriority") {
      postGSelectedClusterPriority(stringify(template));
    }
    if (deployment.priority.name === "GSetClusterPriority") {
      postGSetClusterPriority(stringify(template));
    }

    handleClose();
    props.reloadFunc && props.reloadFunc();
  };

  const onClickStepTwo = (e) => {
    const checkRegex = /^[a-z0-9]([-a-z0-9]*[a-z0-9])*$/;

    if (deployment.deploymentName === "") {
      swalError("Deployment 이름을 입력해주세요");
      return;
    } else if (!checkRegex.test(deployment.deploymentName)) {
      swalError("영어소문자와 숫자만 입력해주세요.");
      return;
    }
    if (deployment.workspace === "") {
      swalError("Workspace를 선택해주세요");
      return;
    }
    if (deployment.project === "") {
      swalError("Project를 선택해주세요");
      return;
    }
    if (deployment.containers.length === 0) {
      swalError("Container를 선택해주세요");
      return;
    }
    setClearLA();
    setStepValue(2);
  };

  const onClickStepThree = (e) => {
    if (labelKey.length < 1 || labelValue.length < 1) {
      swalError("Labels를 선택해주세요");
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
      deployment.priority.mode === "from_node" &&
      deployment.priority.sourceCluster === ""
    ) {
      swalError("sourceCluster를 선택해주세요");
      return;
    }
    if (
      (deployment.priority.mode === "from_node") &
      (deployment.priority.sourceNode === "")
    ) {
      swalError("sourceNode를 선택해주세요");
      return;
    }
    if (
      deployment.priority.mode === "from_pod" &&
      deployment.priority.sourceCluster === ""
    ) {
      swalError("sourceCluster를 선택해주세요");
      return;
    }
    if (
      (deployment.priority.mode === "from_pod") &
      (deployment.priority.podName === "")
    ) {
      swalError("pod를 선택해주세요");
      return;
    }
    if (targetClusters.length === 0) {
      swalError("targetClusters를 선택해주세요.");
      return;
    }
    if (
      (deployment.priority.mode === "node") &
      (deployment.priority.sourceNode === "")
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
          delete template.spec.template.metadata.annotations;
          delete template.metadata.annotations;
        }
        if (
          template.metadata?.labels === ': ""' ||
          isEmpty(template.metadata.labels)
        ) {
          delete template.metadata.labels;
          delete template.spec.template.metadata.labels;
          delete template.metadata.labels;
        }
        setContent(stringify(template));
      }
      setContent(stringify(template));
    }
  }, [stepValue]);

  const CreateDeploymentComponent = () => {
    if (stepValue === 1) {
      return (
        <>
          <CreateDeploymentStepOne />
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
          <CreateDeploymentStepTwo />

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
              <Button onClick={() => onClickBackStepOne()}>이전</Button>
              <ButtonNext onClick={() => onClickStepThree()}>다음</ButtonNext>
            </div>
          </div>
        </>
      );
    } else if (stepValue === 3) {
      return (
        <>
          <CreateDeploymentStepThree />
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
              <ButtonNext onClick={() => onClickStepFour()}>다음</ButtonNext>
            </div>
          </div>
        </>
      );
    } else if (stepValue === 4) {
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
              <Button onClick={() => onClickBackStepThree()}>이전</Button>
              <ButtonNext onClick={createDeployment}>
                Create Deployment
              </ButtonNext>
            </div>
          </div>
        </>
      );
    } else <DeploymentPopup />;
  };

  return (
    <CDialogNew
      id="myDialog"
      open={open}
      maxWidth="md"
      title={"Create Deployment"}
      onClose={handleClose}
      bottomArea={false}
      modules={["custom"]}
    >
      {CreateDeploymentComponent()}
    </CDialogNew>
  );
});
export default CreateDeployment;
