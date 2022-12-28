import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import FormControl from "@material-ui/core/FormControl";
import { CTextField } from "@/components/textfields";
import styled from "styled-components";
import { workspaceStore, projectStore, deploymentStore, volumeStore, StorageClassStore } from "@/store";

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

const DeploymentVolumeSetting = observer(() => {
  const { loadWorkSpaceList } = workspaceStore;
  const { selectClusterInfo, setSelectClusterInfo, loadProjectDetail } = projectStore;
  const { project } = deploymentStore;

  const { setVolumeName, setAccessMode, setVolumeCapacity, volumeCapacity, volumeName, setSelectClusters } = volumeStore;

  const { loadStorageClassName, storageClassNameData, setSelectStorageClass } = StorageClassStore;

  const onChange = async e => {
    const { value, name } = e.target;
    if (name === "volumeName") {
      if (value === "") {
        setSelectClusterInfo([]);
        return;
      }
      setVolumeName(value);
      loadProjectDetail(project); // value 값에 project 넣어서 cluster list 가져옴
      setSelectClusters([...selectClusterInfo]);
      return;
    } else if (name === "selectClusters") {
      setSelectClusters(value);
      return;
    } else if (name === "selectStorageClass") {
      setSelectStorageClass(value);
      return;
    } else if (name === "accessMode") {
      setAccessMode(value);
      return;
    } else if (name === "volumeCapacity") {
      setVolumeCapacity(value);
      return;
    }
  };

  const checkCluster = ({ target: { checked } }, clusterName) => {
    // checked가 true일 때
    if (checked) {
      // setSelectClusters([...selectClusters, clusterName]); //cluster 배열
      setSelectClusters(clusterName);
      loadStorageClassName(clusterName);
    }
    // checked가 false일 때
    // else {
    // setSelectClusters(
    //   selectClusters.filter((cluster) => cluster !== clusterName)
    // );
    // }
  };

  useEffect(() => {
    loadWorkSpaceList(true);
    setSelectClusterInfo([]);
  }, []);

  useEffect(() => {
    setSelectClusters([...selectClusterInfo]);
  }, []);

  return (
    <>
      <div className="step-container">
        <div className="signup-step">
          <div className="step">
            <span>기본 정보</span>
          </div>
          <div className="arr"></div>
          <div className="step">
            <span>Pod 설정</span>
          </div>
          <div className="arr"></div>
          <div className="step current">
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
              Volume Name
              <span className="requried">*</span>
            </th>
            <td>
              <CTextField type="text" placeholder="Volume Name" className="form_fullWidth" name="volumeName" onChange={onChange} value={volumeName} />
            </td>
            <th></th>
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
                    <th>IP</th>
                  </tr>
                  {selectClusterInfo.map(({ clusterName, clusterType, clusterEndpoint }) => (
                    <tr>
                      <td style={{ textAlign: "center" }}>
                        <input type="checkbox" name="selectClusters" onChange={e => checkCluster(e, clusterName)} />
                      </td>
                      <td>{clusterName}</td>
                      <td>{clusterType}</td>
                      <td>{clusterEndpoint}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </td>
            <th></th>
          </tr>
          <tr>
            <th>
              StorageClass <span className="requried">*</span>
            </th>
            <td>
              <FormControl className="form_fullWidth">
                <select
                  //   disabled={storageClassEnable}
                  name="selectStorageClass"
                  onChange={onChange}
                >
                  <option value={""}>Select StorageClass</option>
                  {storageClassNameData
                    ? storageClassNameData.map(storageClass => <option value={storageClass.name}>{storageClass.name}</option>)
                    : ""}
                </select>
              </FormControl>
            </td>
            <th></th>
          </tr>
          <tr>
            <th>
              Access Mode <span className="requried">*</span>
            </th>
            <td>
              <FormControl className="form_fullWidth">
                <select name="accessMode" onChange={onChange}>
                  <option value="Select Access Mode">Select Access Mode</option>
                  <option value="ReadWriteOnce">ReadWriteOnce</option>
                  <option value="ReadOnlyMany">ReadOnlyMany</option>
                  <option value="ReadWriteMany">ReadWriteMany</option>
                  <option value="ReadWriteOncePod">ReadWriteOncePod</option>
                </select>
              </FormControl>
            </td>
            <th></th>
          </tr>
          <tr>
            <th>
              Volume Capacity
              <span className="requried">*</span>
            </th>
            <td>
              <CTextField
                type="number"
                placeholder="Volume Capacity"
                className="form_fullWidth"
                name="volumeCapacity"
                onChange={onChange}
                value={volumeCapacity || ""}
              />
            </td>
            <th></th>
          </tr>
        </tbody>
      </table>
    </>
  );
});

export default DeploymentVolumeSetting;
