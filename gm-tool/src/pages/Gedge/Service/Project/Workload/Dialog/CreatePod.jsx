import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import { podStore, projectStore, schedulerStore } from "@/store";
import PodBasicInformation from "./PodBasicInformation";
import PodSettings from "./PodSettings";
import PodYaml from "./PodYaml";
import { CDialogNew } from "@/components/dialogs";
import { randomString } from "@/utils/common-utils";

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

const CreatePod = observer(props => {
  const { open } = props;
  const [stepValue, setStepValue] = useState(1);

  const { setProjectListinWorkspace } = projectStore;
  const { postWorkload, postScheduler } = schedulerStore;

  const { podName, containerName, containerImage, containerPort, workspace, project, content, clearAll, setContent } = podStore;

  const template = {
    apiVersion: "v1",
    kind: "Pod",
    metadata: {
      name: podName,
      namespace: project,
    },
    spec: {
      containers: [
        {
          name: containerName,
          image: containerImage,
          ports: [
            {
              containerPort: Number(containerPort),
            },
          ],
        },
      ],
    },
  };

  const handleClose = () => {
    props.onClose && props.onClose();
    setProjectListinWorkspace();
    setStepValue(1);
    clearAll();
  };

  const createPod = () => {
    const requestId = `${podName}-${randomString()}`;

    postWorkload(requestId, workspace, project, "Pod");
    postScheduler(requestId, content, handleClose);
    props.reloadFunc && props.reloadFunc();
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
          <PodBasicInformation />
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
              <ButtonNext onClick={() => setStepValue(2)}>다음</ButtonNext>
            </div>
          </div>
        </>
      );
    } else if (stepValue === 2) {
      return (
        <>
          <PodSettings />
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
              <Button onClick={() => setStepValue(1)}>이전</Button>
              <ButtonNext onClick={() => setStepValue(3)}>다음</ButtonNext>
            </div>
          </div>
        </>
      );
    } else if (stepValue === 3) {
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
                width: "300px",
                justifyContent: "center",
              }}
            >
              <Button onClick={() => setStepValue(2)}>이전</Button>
              <ButtonNext onClick={createPod}>Schedule Apply</ButtonNext>
            </div>
          </div>
        </>
      );
    } else return <>4</>;
  };

  return (
    <CDialogNew id="myDialog" open={open} maxWidth="md" title={"Create Pod"} onClose={handleClose} bottomArea={false} modules={["custom"]}>
      {stepOfComponent()}
    </CDialogNew>
  );
});
export default CreatePod;
