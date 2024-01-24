import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { CDialogNew } from "@/components/dialogs";
import { FormControl } from "@material-ui/core";
import { CTextField } from "@/components/textfields";
import styled from "styled-components";
import { userStore } from "@/store";
import { swalError } from "@/utils/swal-utils";
import UserInfo from "../TabList/UserInfo";
import CreateWorkSpace from "../../WorkSpace/Dialog/CreateWorkSpace";
import UserProject from "../TabList/UserProject,";
import workspaceStore from "../../../../store/WorkSpace";
import clusterStore from "../../../../store/Cluster";
import { CDialogUser } from "../../../../components/dialogs/CDialogUser";

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

const CreateUser = observer((props) => {
  const { open } = props;
  const [stepValue, setStepValue] = useState(1);

  const { postUser, inputs, setInputs } = userStore;
  const {
    check,
    workspaceName,
    workspaceDescription,
    createWorkspace,
    setWorkspaceName,
    setWorkspaceDescription,
  } = workspaceStore;
  const { selectCluster, setSelectCluster } = clusterStore;

  const handleClose = () => {
    props.onClose && props.onClose();
    setInputs({
      memberId: "",
      memberName: "",
      password: "",
      email: "",
      contact: "",
      memberDescription: "",
      memberRole: "PA",
    });
    setWorkspaceName("");
    setWorkspaceDescription("");
    setSelectCluster([]);
    setStepValue(1);
  };

  const onChange = ({ target: { name, value } }) => {
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const onClickCreateUser = () => {
    if ((inputs.memberId === "") | (inputs.memberId === undefined)) {
      swalError("ID를 입력해주세요");
      return;
    }
    if ((inputs.password === "") | (inputs.password === undefined)) {
      swalError("Password를 입력해주세요");
      return;
    }
    if ((inputs.memberName === "") | (inputs.memberName === undefined)) {
      swalError("Name을 입력해주세요");
      return;
    }
    if ((inputs.email === "") | (inputs.email === undefined)) {
      swalError("Email을 입력해주세요");
      return;
    }
    if ((inputs.contact === "") | (inputs.contact === undefined)) {
      swalError("Contact를 입력해주세요");
      return;
    } else {
      createUser(inputs);
      setStepValue(2);
    }
  };

  const createUser = async () => {
    const result = await postUser(inputs);
    handleClose();
    props.reloadFunc && props.reloadFunc();
  };

  const create = async () => {
    if (!check) {
      swalError("중복확인이 필요합니다!");
      return;
    }
    if (selectCluster.length === 0) {
      swalError("클러스터를 확인해주세요!");
      return;
    }
    createWorkspace(
      workspaceName,
      workspaceDescription,
      selectCluster,
      handleClose
    );

    props.reloadFunc && props.reloadFunc();
  };

  useEffect(() => {}, []);

  const stepOfComponent = () => {
    if (stepValue === 1) {
      return (
        <>
          <UserInfo />
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
              <Button onClick={handleClose}>취소</Button>
              <ButtonNext onClick={() => onClickCreateUser()}>다음</ButtonNext>
            </div>
          </div>
        </>
      );
    } else if (stepValue === 2) {
      return (
        <>
          <UserProject />
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
              {/* <Button
                onClick={() => {
                  // handlePreStepValue();
                  setStepValue(1);
                }}
              >
                이전
              </Button> */}
              <ButtonNext onClick={create}>생성</ButtonNext>
            </div>
          </div>
        </>
      );
    }
  };
  return (
    <CDialogUser
      id="myDialog"
      open={open}
      maxWidth="md"
      title={`Create Member`}
      onClose={handleClose}
      bottomArea={false}
      modules={["custom"]}
    >
      {stepOfComponent()}
    </CDialogUser>
  );
});
export default CreateUser;
