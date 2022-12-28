import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { CDialogNew } from "@/components/dialogs";
import { CTextField } from "@/components/textfields";
import styled from "styled-components";
import { clusterStore, workspaceStore } from "@/store";
import { dateFormatter, duplicateCheck } from "@/utils/common-utils";
import { swalConfirm, swalError } from "@/utils/swal-utils";

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

const CreateWorkSpace = observer(props => {
  const { open } = props;
  const { loadClusterList, clusterListInWorkspace } = clusterStore;
  const { createWorkspace } = workspaceStore;
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceDescription, setWorkspaceDescription] = useState("");
  const [selectCluster, setSelectCluster] = useState([]);
  const [check, setCheck] = useState(false);

  const handleClose = () => {
    props.onClose && props.onClose();
    setSelectCluster([]);
    setWorkspaceName("");
    setWorkspaceDescription("");
    setCheck(false);
  };

  const onChange = ({ target: { name, value } }) => {
    if (name === "workspaceName") setWorkspaceName(value);
    else if (name === "workspaceDescription") setWorkspaceDescription(value);
  };
  const checkCluster = ({ target: { checked } }, clusterName) => {
    if (checked) {
      setSelectCluster([...selectCluster, clusterName]);
    } else {
      setSelectCluster(selectCluster.filter(cluster => cluster !== clusterName));
    }
  };

  const postWorkspace = () => {
    if (!check) {
      swalError("중복확인이 필요합니다!");
      return;
    }
    if (selectCluster.length === 0) {
      swalError("클러스터를 확인해주세요!");
      return;
    }
    createWorkspace(workspaceName, workspaceDescription, selectCluster, handleClose);
    props.reloadFunc && props.reloadFunc();
  };
  const checkWorkspaceName = async () => {
    const result = await duplicateCheck(workspaceName, "workspace");

    if (result) {
      swalError("사용 가능한 이름입니다.");
      setCheck(true);
    } else {
      swalError("사용할 수 없는 이름입니다.");
      setWorkspaceName("");
      setCheck(false);
    }
  };

  useEffect(() => {
    loadClusterList();
  }, []);

  return (
    <CDialogNew id="myDialog" open={open} maxWidth="md" title={`Create Workspace`} onClose={handleClose} bottomArea={false} modules={["custom"]}>
      <table className="tb_data_new tb_write">
        <tbody>
          <tr>
            <th style={{ width: "20%" }}>
              Workspace Name
              <span className="requried">*</span>
            </th>
            <td style={{ display: "flex", justifyContent: "space-around" }}>
              <CTextField
                type="text"
                placeholder="Workspace Name"
                style={{ flex: 3 }}
                name="workspaceName"
                onChange={onChange}
                value={workspaceName}
              />
              <ButtonNext onClick={checkWorkspaceName} style={{ height: "32px" }}>
                중복확인
              </ButtonNext>
            </td>
          </tr>
          <tr>
            <th>Workspace Description</th>
            <td>
              <CTextField
                type="text"
                placeholder="Workspace Description"
                className="form_fullWidth"
                name="workspaceDescription"
                onChange={onChange}
                value={workspaceDescription}
              />
            </td>
          </tr>
          <tr>
            <th>
              Cluster <span className="requried">*</span>
            </th>
            <td>
              <table className="tb_data_new">
                <tbody className="tb_data_nodeInfo">
                  <tr>
                    <th></th>
                    <th>이름</th>
                    <th>타입</th>
                    <th>노드개수</th>
                    <th>IP</th>
                  </tr>
                  {/* paginetion 때문에 clusterList -> viewList */}
                  {clusterListInWorkspace.map(({ clusterName, clusterType, clusterEndpoint, nodeCnt }) => (
                    <tr>
                      <td style={{ textAlign: "center" }}>
                        <input type="checkbox" name="clusterCheck" onChange={e => checkCluster(e, clusterName)} />
                      </td>
                      <td>{clusterName}</td>
                      <td>{clusterType}</td>
                      <td>{nodeCnt}</td>
                      <td>{clusterEndpoint}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
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
          <ButtonNext onClick={postWorkspace}>생성</ButtonNext>
        </div>
      </div>
    </CDialogNew>
  );
});
export default CreateWorkSpace;
