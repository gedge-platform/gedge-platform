import styled from "styled-components";
import { observer } from "mobx-react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useEffect, useState } from "react";
import { CTextField } from "@/components/textfields";
import { workspaceStore, projectStore, deploymentStore } from "@/store";
import templateStore from "../../../../../../store/Template";
import { getItem } from "@/utils/sessionStorageFn";

const Button = styled.button`
  border: none;
  height: 28px;
  width: 30px;
  font-size: 20px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: normal;
  color: #36435c;
  background-color: #eff4f9;
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

const ImgButton = styled.button`
  background-image: url(/images/resource/nginx.png);
  border: black;
`;

const CreateTamplateStepOne = observer((props) => {
  const { workSpaceList, loadSourceCluster } = workspaceStore;
  const {
    loadProjectListInWorkspace,
    projectListinWorkspace,
    loadProjectDetail,
    loadProjectList,
    projectLists,
  } = projectStore;
  const { setDeployment, setAppInfo, appInfo, initTargetClusters } =
    deploymentStore;
  const { containerImageList } = templateStore;

  const [env, setEnv] = useState({ name: "", value: "" });

  const onChange = (e) => {
    const { name, value } = e.target;

    if (name === "app") {
      setAppInfo(name, value);
      setAppInfo("appVersion", "");
      setAppInfo(
        "appPort",
        containerImageList.filter((image) => image.name === e.target.value)[0]
          .port
      );
      setAppInfo(
        "appEnv",
        containerImageList.filter((image) => image.name === e.target.value)[0]
          .env
      );
    }
    if (name === "appVersion") {
      setAppInfo(name, value);
    }
    if (name === "appName") {
      setAppInfo(name, value);
    }
    if (name === "appWorkspace") {
      const selectedWorkspace = workSpaceList.find(
        (workspace) => workspace.workspaceName === value
      );

      setAppInfo(name, value);
      setAppInfo("workspacetag", selectedWorkspace.workspaceTag);
      setAppInfo("workspaceuuid", selectedWorkspace.workspaceUUID);
      loadProjectListInWorkspace(value);
      loadSourceCluster(value);
    }
    if (name === "appProject") {
      setAppInfo(name, value);
      loadProjectDetail(value);

      // 프로젝트 기준의 클러스터리스트
      const selectedProject = projectLists.find(
        (data) => data.workspace.workspaceName === appInfo.appWorkspace
      );

      initTargetClusters(
        selectedProject.selectCluster?.map((cluster) => cluster.clusterName)
      );
    }
    if (name === "appReplicas") {
      setAppInfo(name, value);
      setAppInfo(name, Number.parseInt(value));
    }
    if (name === "appPort") {
      setAppInfo(name, value);
      setAppInfo(name, value);
    }
    if (name === "envKey") {
      setEnv({ name: value, value: env.value });
    }
    if (name === "envValue") {
      setEnv({ name: env.name, value: value });
    }
  };

  const addEnv = () => {
    setAppInfo("appEnv", [...appInfo.appEnv, env]);
    setEnv({ name: "", value: "" });
  };

  const removeEnv = (index) => {
    setAppInfo(
      "appEnv",
      appInfo.appEnv.filter((env, idx) => idx !== index)
    );
  };

  useEffect(() => {
    loadProjectList();
  }, []);

  return (
    <>
      <div className="step-container">
        <div className="signup-step">
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
            <th>
              App <span className="requried">*</span>
            </th>
            <td colSpan="3">
              <FormControl className="form_fullWidth">
                <select name="app" onChange={onChange} value={appInfo.app}>
                  <option value={""} selected disabled hidden>
                    Select App
                  </option>
                  <option value="nginx">nginx</option>
                  <option value="mysql">mysql</option>
                  <option value="web">web</option>
                </select>
              </FormControl>
            </td>
          </tr>
          <tr>
            <th>
              Version <span className="requried">*</span>
            </th>
            <td colSpan="3">
              <FormControl className="form_fullWidth">
                <select
                  name="appVersion"
                  onChange={onChange}
                  value={appInfo.appVersion}
                >
                  <option value={""} selected disabled hidden>
                    Select Version
                  </option>
                  {containerImageList
                    .filter((image) => image.name === appInfo.app)[0]
                    ?.versions.map((version) => (
                      <option value={version}>{version}</option>
                    ))}
                </select>
              </FormControl>
            </td>
          </tr>

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

          {/* <tr>
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
          </tr> */}
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
                  <option value={""} disabled hidden>
                    Select Workspace
                  </option>
                  {workSpaceList.map((workspace) => (
                    <option
                      key={workspace.workspaceUUID}
                      value={workspace.workspaceName}
                    >
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
                  name="appProject"
                  onChange={onChange}
                  value={appInfo.appProject}
                >
                  <option value={""} selected hidden disabled>
                    Select Project
                  </option>
                  {projectListinWorkspace ? (
                    projectListinWorkspace.map((project) => (
                      <option value={project.projectName}>
                        {project.projectName}
                      </option>
                    ))
                  ) : (
                    <option value={""}>No Data</option>
                  )}
                </select>
              </FormControl>
            </td>
          </tr>

          {appInfo.app === "web" ? (
            <tr>
              <th>
                Replicas <span className="requried">*</span>
              </th>
              <td colSpan="3">
                <CTextField
                  type="number"
                  className="form_fullWidth"
                  name="appReplicas"
                  value="1"
                  disabled={true}
                />
              </td>
            </tr>
          ) : (
            <tr>
              <th>
                Replicas <span className="requried">*</span>
              </th>
              <td colSpan="3">
                <CTextField
                  type="number"
                  className="form_fullWidth"
                  name="appReplicas"
                  onChange={onChange}
                  value={appInfo.appReplicas}
                />
              </td>
            </tr>
          )}

          {appInfo.app === "web" ? (
            <tr>
              <th>Port</th>
              <td colSpan="3">
                <CTextField
                  type="number"
                  placeholder="port"
                  className="form_fullWidth"
                  name="appPort"
                  onChange={onChange}
                  value="80"
                  disabled={true}
                />
              </td>
            </tr>
          ) : (
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
                  disabled={true}
                />
              </td>
            </tr>
          )}

          {appInfo.app === "nginx" || "web" ? (
            ""
          ) : (
            <tr>
              <th rowSpan={appInfo.appEnv.length + 1}>Env</th>
              <td style={{ width: "400px" }}>
                <CTextField
                  type="text"
                  placeholder="Key"
                  className="form_fullWidth"
                  name="envKey"
                  onChange={onChange}
                  value={env.name}
                />
              </td>
              <td style={{ width: "400px" }}>
                <CTextField
                  type="text"
                  placeholder="Value"
                  className="form_fullWidth"
                  name="envValue"
                  onChange={onChange}
                  value={env.value}
                />
              </td>
              <td>
                <Button onClick={addEnv}>+</Button>
              </td>
            </tr>
          )}
          {/* {appInfo.appEnv?.map((env, index) => (
            <tr>
              <td style={{ width: "350px" }}>{env.name}</td>
              <td style={{ width: "350px", padding: "8px" }}>{env.value}</td>
              <td>
                <Button onClick={() => removeEnv(index)}>-</Button>
              </td>
            </tr>
          ))} */}
        </tbody>
      </table>
    </>
  );
});

export default CreateTamplateStepOne;
