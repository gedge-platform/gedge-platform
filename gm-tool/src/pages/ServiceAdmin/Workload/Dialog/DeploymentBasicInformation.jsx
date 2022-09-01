import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import workspacesStore from "../../../../store/WorkSpace";
import projectStore from "../../../../store/Project";
import deploymentStore from "../../../../store/Deployment";
import FormControl from "@material-ui/core/FormControl";
import { CTextField } from "@/components/textfields";
import clusterStore from "../../../../store/Cluster";
import { CCreateButton } from "@/components/buttons";
import { PanelBox } from "@/components/styles/PanelBox";
import { swalError } from "../../../../utils/swal-utils";
import styled from "styled-components";
import DeploymentPodSettins from "./DeploymentPodSettins";
import CreateDeployment from "./CreateDeployment";

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

const DeploymentBasicInformation = observer((props) => {
  const [projectEnable, setProjectEnable] = useState(true);
  const [clusterEnable, setClusterEnable] = useState(true);
  const { loadWorkSpaceList, workSpaceList, workspace } = workspacesStore;
  const { loadProjectListInWorkspace, projectListinWorkspace } = projectStore;
  const {
    deploymentName,
    setDeployName,
    setCluster,
    setWorkspace,
    setProject,
    workspaceName,
    setWorkspaceName,
  } = deploymentStore;

  const { loadClusterInProject, clusters } = clusterStore;

  const onChange = (e) => {
    const { value, name } = e.target;
    if (name === "workspace") {
      loadProjectListInWorkspace(value);
      setWorkspace(value);
      setProjectEnable(false);
      return;
    } else if (name === "project") {
      loadClusterInProject(value);
      setProject(value);
      setClusterEnable(false);
    } else if (name === "Deployment Name") {
      setDeployName(value);
    }
    // else if (name === "cluster") setCluster(value);
  };

  useEffect(() => {
    loadWorkSpaceList();
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
            <span>Pod 설정</span>
          </div>
          <div className="arr"></div>
          <div className="step">
            <span>Volume 설정</span>
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
              Workspace <span className="requried">*</span>
            </th>
            <td style={{ width: "50%" }}>
              <FormControl className="form_fullWidth">
                <select name="workspace" onChange={onChange}>
                  <option value={""}>Select Workspace</option>
                  {workspace.map((item) => (
                    <option value={item}>{item}</option>
                  ))}
                </select>
              </FormControl>
            </td>
            <th></th>
          </tr>
          <tr>
            <th>
              Project <span className="requried">*</span>
            </th>
            <td>
              <FormControl className="form_fullWidth">
                <select
                  disabled={projectEnable}
                  name="project"
                  onChange={onChange}
                >
                  <option value={""}>Select Project</option>
                  {projectListinWorkspace.map((project) => (
                    <option value={project.projectName}>
                      {project.projectName}
                    </option>
                  ))}
                </select>
              </FormControl>
            </td>
            <th></th>
          </tr>
          {/* <tr>
          <th>
            Cluster <span className="requried">*</span>
          </th>
          <td>
            <FormControl className="form_fullWidth">
              <select
                disabled={clusterEnable && projectEnable}
                name="cluster"
                onChange={onChange}
              >
                {clusterList.map((cluster) => (
                  <option value={cluster.clusterName}>
                    {cluster.clusterName}
                  </option>
                ))}
                <option value={"dafault"}>default</option>
              </select>
            </FormControl>
          </td>
          <th></th>
        </tr> */}
          <tr>
            <th>
              Deployment Name
              <span className="requried">*</span>
            </th>
            <td>
              <CTextField
                type="text"
                placeholder="Deployment Name"
                className="form_fullWidth"
                name="Deployment Name"
                onChange={onChange}
                value={deploymentName}
              />
            </td>
            <th></th>
          </tr>
        </tbody>
      </table>
    </>
  );
});

export default DeploymentBasicInformation;
