import React, { useState, useEffect } from "react";
import { observer } from "mobx-react";
import { CTextField } from "@/components/textfields";
import styled from "styled-components";
import { CDialogNew } from "@/components/dialogs";
import { swalError } from "../../../../../utils/swal-utils";
import { FormControl, Table } from "@material-ui/core";
import gsLinkStore from "../../../../../store/GsLink";
import workspaceStore from "../../../../../store/WorkSpace";
import projectStore from "../../../../../store/Project";
import CreateGsLinkStepOne from "./CreateGsLinkStepOne";
import CreateGsLinkStepTwo from "./CreateGsLinkStepTwo";
import CreateGsLinkStepThree from "./CreateGsLinkStepThree";

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

const CreateGsLink = observer((props) => {
  const { open } = props;
  const [stepValue, setStepValue] = useState(1);

  const { loadWorkSpaceList, workSpaceList } = workspaceStore;
  const { projectListinWorkspace, loadProjectList, projectLists } =
    projectStore;
  const { postGsLink, gsLinkInfo, initGsLinkInfo, parameters } = gsLinkStore;

  useEffect(() => {
    loadWorkSpaceList();
    loadProjectList();
  }, []);

  const handleClose = () => {
    props.onClose && props.onClose();
    setStepValue(1);
    initGsLinkInfo();
  };

  const onClickStepTwo = (e) => {
    if (gsLinkInfo.workspace_name === "") {
      swalError("Workspace를 선택해주세요.");
      return;
    }
    if (gsLinkInfo.project_name === "") {
      swalError("Project를 선택해주세요");
      return;
    }

    // setClearLA();
    setStepValue(2);
  };

  const onClickStepThree = () => {
    if (parameters.source_cluster === "") {
      swalError("Cluster를 선택해주세요.");
      return;
    }
    if (parameters.source_service === "") {
      swalError("Service를 선택해주세요.");
      return;
    }
    setStepValue(3);
  };

  const onClickBackStepOne = () => {
    setStepValue(1);
  };

  const onClickBackStepTwo = () => {
    setStepValue(2);
  };

  const createtGsLink = () => {
    if (parameters.target_cluster === "") {
      swalError("Cluster를 선택해주세요.");
      return;
    }
    postGsLink();

    props.reloadFunc && props.reloadFunc();
    props.onClose && props.onClose();
  };

  const CreateGsLinkComponent = () => {
    if (stepValue === 1) {
      return (
        <>
          <CreateGsLinkStepOne />
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
          <CreateGsLinkStepTwo />

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
              <ButtonNext onClick={(e) => onClickStepThree(e)}>다음</ButtonNext>
            </div>
          </div>
        </>
      );
    } else if (stepValue === 3) {
      return (
        <>
          <CreateGsLinkStepThree />

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
              <ButtonNext onClick={() => createtGsLink()}>이동</ButtonNext>
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
      title={`Create GLink`}
      onClose={handleClose}
      bottomArea={false}
      modules={["custom"]}
    >
      {CreateGsLinkComponent()}
    </CDialogNew>
  );
});

export default CreateGsLink;
