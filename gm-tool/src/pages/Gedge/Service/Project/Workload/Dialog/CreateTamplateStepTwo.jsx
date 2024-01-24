import styled from "styled-components";
import { observer } from "mobx-react";
import Button from "@mui/material/Button";
import { useState } from "react";
import { workspaceStore, projectStore, deploymentStore } from "@/store";
import { CTextField } from "@/components/textfields";
import FormControl from "@material-ui/core/FormControl";

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

const ImgButton = styled.button`
  background-image: url(/images/resource/nginx.png);
  border: black;
`;

const CreateTamplateStepTwo = observer((props) => {
  const { workSpaceList, selectClusterInfo, loadWorkspaceDetail } =
    workspaceStore;
  const { loadProjectListInWorkspace, projectListinWorkspace } = projectStore;
  const { setDeployment, setAppInfo, appInfo } = deploymentStore;

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "appName") {
      setAppInfo(name, value);
    }
    if (name === "appWorkspace") {
      setAppInfo(name, value);
      loadProjectListInWorkspace(value);
      loadWorkspaceDetail(value);
    }
    if (name === "appProject") {
      setAppInfo(name, value);
    }
    if (name === "appPort") {
      setAppInfo(name, value);
    }
  };

  return (
    <>
      <div className="step-container">
        <div className="signup-step">
          <div className="arr"></div>
          <div className="step">
            <span>앱 선택</span>
          </div>
          <div className="arr"></div>
          <div className="step current">
            <span>기본 정보</span>
          </div>
          <div className="arr"></div>
          <div className="step">
            <span>스케줄러</span>
          </div>
          <div className="arr"></div>
          <div className="step">
            <span>설정 검토</span>
          </div>
        </div>
      </div>
      <table className="tb_data_new tb_write">
        <tbody>
          <tr>
            <th style={{ width: "200px" }}>
              Name <span className="requried">*</span>
            </th>
            <td colSpan="3">
              <CTextField
                type="text"
                placeholder="Name(영어소문자, 숫자만 가능)"
                className="form_fullWidth"
                name="appName"
                onChange={onChange}
                value={appInfo.appName}
              />
            </td>
          </tr>

          <tr>
            <th>
              Workspace <span className="requried">*</span>
            </th>
            <td colSpan="3">
              <FormControl className="form_fullWidth">
                <select
                  name="appWorkspace"
                  onChange={onChange}
                  value={appInfo.appWorkspace}
                >
                  <option value={""} selected disabled hidden>
                    Select Workspace
                  </option>
                  {workSpaceList.map((workspace) => (
                    <option value={workspace.workspaceName}>
                      {workspace.workspaceName}
                    </option>
                  ))}
                </select>
              </FormControl>
            </td>
          </tr>

          <tr>
            <th>
              Project <span className="requried">*</span>
            </th>
            <td colSpan="3">
              <FormControl className="form_fullWidth">
                <select
                  // disabled={!deployment.workspace}
                  name="appProject"
                  onChange={onChange}
                  value={appInfo.appProject}
                >
                  <option value={""} selected hidden disabled>
                    Select Project
                  </option>
                  {projectListinWorkspace.map((project) => (
                    <option value={project.projectName}>
                      {project.projectName}
                    </option>
                  ))}
                </select>
              </FormControl>
            </td>
          </tr>

          <tr>
            <th>
              Replicas <span className="requried">*</span>
            </th>
            <td colSpan="3">
              <CTextField
                type="number"
                placeholder="1"
                className="form_fullWidth"
                name="appReplicas"
                onChange={onChange}
                value="1"
              />
            </td>
          </tr>

          <tr>
            <th>Port</th>
            <td colSpan="3">
              <CTextField
                type="number"
                placeholder="port"
                className="form_fullWidth"
                name="appPort"
                onChange={onChange}
                value={appInfo.appPort}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
});

export default CreateTamplateStepTwo;
