import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import { projectStore, deploymentStore, clusterStore, serviceStore, workspaceStore } from "@/store";
import FormControl from "@material-ui/core/FormControl";
import { CTextField } from "@/components/textfields";

const DeploymentBasicInformation = observer(() => {
  const [projectEnable, setProjectEnable] = useState(true);
  const [clusterEnable, setClusterEnable] = useState(true);
  const { loadWorkSpaceList, workSpaceList, workspace } = workspaceStore;
  const { loadProjectListInWorkspace, projectListinWorkspace } = projectStore;
  const {
    cluster,
    serviceName,
    protocol,
    appName,
    port,
    targetPort,
    setTargetPort,
    setPort,
    setProtocol,
    setServiceName,
    setClusterList,
    setWorkspace,
    setProject,
    setAppName,
  } = serviceStore;
  const { loadClusterInProject, clusterList } = clusterStore;

  const checkChange = ({ target: { checked, name } }) => {
    if (checked) {
      setClusterList([...cluster, name]);
    } else {
      setClusterList(cluster.filter(item => item !== name));
    }
  };

  const onChange = e => {
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
    } else if (name === "Service Name") setServiceName(value);
    else if (name === "protocol") {
      setProtocol(value);
    } else if (name === "Port") {
      setPort(Number(value));
    } else if (name === "Target Port") {
      setTargetPort(Number(value));
    } else if (name === "App Name") {
      setAppName(value);
    }
  };
  useEffect(() => {
    loadWorkSpaceList();
  }, []);
  return (
    <>
      <div className="step-container2">
        <div className="signup-step">
          <div className="step current">
            <span>기본 정보</span>
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
                  {workspace.map(item => (
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
                <select disabled={projectEnable} name="project" onChange={onChange}>
                  {projectListinWorkspace.map(project => (
                    <option value={project.projectName}>{project.projectName}</option>
                  ))}
                  <option value={""}>Select Project</option>
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
            <FormGroup className="form_fullWidth" onChange={checkChange}>
              {clusterList.map((cluster) => (
                <FormControlLabel
                  control={<Checkbox name={cluster.clusterName} />}
                  label={cluster.clusterName}
                />
              ))}
            </FormGroup>
          </td>
          <th></th>
        </tr> */}
          <tr>
            <th>
              Service Name
              <span className="requried">*</span>
            </th>
            <td>
              <CTextField
                type="text"
                placeholder="Service Name"
                className="form_fullWidth"
                name="Service Name"
                onChange={onChange}
                value={serviceName}
              />
            </td>
            <th></th>
          </tr>
          <tr>
            <th>
              App Name
              <span className="requried">*</span>
            </th>
            <td>
              <CTextField type="text" placeholder="App Name" className="form_fullWidth" name="App Name" onChange={onChange} value={appName} />
            </td>
            <th></th>
          </tr>
          <tr>
            <th>
              Protocol <span className="requried">*</span>
            </th>
            <td style={{ width: "50%" }}>
              <FormControl className="form_fullWidth">
                <select name="protocol" onChange={onChange}>
                  <option value={"TCP"}>TCP</option>
                  <option value={"UDP"}>UDP</option>
                </select>
              </FormControl>
            </td>
            <th></th>
          </tr>
          <tr>
            <th>
              Port
              <span className="requried">*</span>
            </th>
            <td>
              <CTextField type="text" placeholder="Port" className="form_fullWidth" name="Port" onChange={onChange} value={port} />
            </td>
            <th></th>
          </tr>
          <tr>
            <th>
              Target Port
              <span className="requried">*</span>
            </th>
            <td>
              <CTextField
                type="text"
                placeholder="Target Port"
                className="form_fullWidth"
                name="Target Port"
                onChange={onChange}
                value={targetPort}
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
