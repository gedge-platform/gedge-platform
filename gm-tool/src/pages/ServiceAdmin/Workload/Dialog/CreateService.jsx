import React, { useState, useEffect } from "react";
import { CDialog } from "@/components/dialogs";
import styled from "styled-components";
import { observer } from "mobx-react";
import serviceStore from "../../../../store/Service";
import ServiceBasicInformation from "../Dialog/ServiceBasicInformation";
import ServiceYaml from "./ServiceYaml";
import { CDialogNew } from "../../../../components/dialogs";
import projectStore from "../../../../store/Project";
import schedulerStore from "../../../../store/Scheduler";
import { randomString } from "../../../../utils/common-utils";

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

const CreatePod = observer((props) => {
  const { open } = props;
  const [stepValue, setStepValue] = useState(1);
  const [loading, setLoading] = useState(false);
  const { setProjectListinWorkspace } = projectStore;
  const { postWorkload, postScheduler } = schedulerStore;

  const {
    serviceName,
    appName,
    protocol,
    port,
    targetPort,
    workspace,
    project,
    content,
    clearAll,
    setContent,
    postService,
  } = serviceStore;

  const template = {
    apiVersion: "v1",
    kind: "Service",
    metadata: {
      name: serviceName,
    },
    spec: {
      selector: {
        app: appName,
      },
      ports: [
        {
          protocol: protocol,
          port: port,
          targetPort: targetPort,
        },
      ],
    },
  };

  const handleClose = () => {
    props.reloadFunc && props.reloadFunc();
    props.onClose && props.onClose();
    setProjectListinWorkspace();
    setStepValue(1);
    clearAll();
  };

  const createService = () => {
    const requestId = `${serviceName}-${randomString()}`;

    postWorkload(requestId, workspace, project, "Service");
    postScheduler(requestId, content, handleClose);
  };

  useEffect(() => {
    if (stepValue === 2) {
      const YAML = require("json-to-pretty-yaml");
      setContent(YAML.stringify(template));
    }
  }, [stepValue]);

  const stepOfComponent = () => {
    if (stepValue === 1) {
      return (
        <>
          <ServiceBasicInformation />
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
          <ServiceYaml />
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
              <Button onClick={() => setStepValue(1)}>이전</Button>
              <ButtonNext onClick={createService}>Schedule Apply</ButtonNext>
            </div>
          </div>
        </>
      );
    } else if (stepValue === 3) {
      return (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                width: "430px",
                justifyContent: "space-around",
              }}
            >
              <Button onClick={handleClose}>취소</Button>
              <Button onClick={() => setStepValue(2)}>이전</Button>
              <ButtonNext onClick={() => console.log("")}>
                Schedule Apply
              </ButtonNext>
              <ButtonNext onClick={() => console.log("")}>
                Default Apply
              </ButtonNext>
            </div>
          </div>
        </>
      );
    } else return <>4</>;
  };

  return (
    <CDialogNew
      id="myDialog"
      open={open}
      maxWidth="md"
      title={"Create Service"}
      onClose={handleClose}
      bottomArea={false}
      modules={["custom"]}
    >
      {stepOfComponent()}
    </CDialogNew>
  );
});
export default CreatePod;
