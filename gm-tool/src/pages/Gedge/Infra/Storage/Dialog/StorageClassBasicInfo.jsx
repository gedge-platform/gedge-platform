import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { CTextField } from "@/components/textfields";
import { FormControl } from "@material-ui/core";
import { StorageClassStore, clusterStore, projectStore } from "@/store";

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

const StorageClassBasicInfo = observer(() => {
  const {
    storageClassName,
    setStorageClassName,
    storageSystem,
    setStorageSystem,
    volumeExpansion,
    setVolumeExpansion,
    reclaimPolicy,
    setReclaimPolicy,
    accessMode,
    setAccessMode,
    volumeBindingMode,
    setVolumeBindingMode,
    selectClusters,
    setSelectClusters,
    loadStorageClassName,
  } = StorageClassStore;

  const { loadClusterList, viewList } = clusterStore;
  const { selectClusterInfo, loadProjectDetail } = projectStore;
  const [chk, setChk] = useState(false);

  const onChange = e => {
    const { value, name } = e.target;
    if (name === "storageClassName") {
      setStorageClassName(value);
      return;
    }
    if (name === "selectClusters") {
      setSelectClusters(value);
      return;
    }
    if (name === "storageSystem") {
      setStorageSystem(value);
      return;
    }
    if (name === "volumeExpansion") {
      setVolumeExpansion(value);
      return;
    }
    if (name === "reclaimPolicy") {
      setReclaimPolicy(value);
      return;
    }
    if (name === "accessMode") {
      setAccessMode(value);
      return;
    }
    if (name === "volumeBindingMode") {
      setVolumeBindingMode(value);
      return;
    }
  };

  const checkCluster = ({ target: { checked } }, clusterName) => {
    if (checked) {
      setSelectClusters(clusterName);
      loadStorageClassName(clusterName);
    } else {
      setSelectClusters([]); // check가 fasle일 때 selectClusters의 길이가 0이 되도록
    }
  };

  useEffect(() => {
    loadClusterList();
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
            <span>고급 설정</span>
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
              StorageClass Name
              <span className="requried">*</span>
            </th>
            <td>
              <CTextField
                type="text"
                placeholder="StorageClass Name"
                className="form_fullWidth"
                name="storageClassName"
                onChange={onChange}
                value={storageClassName}
              />
            </td>
            <th></th>
          </tr>
          <tr>
            <th>
              Storage System <span className="requried">*</span>
            </th>
            <td>
              <FormControl className="form_fullWidth">
                <select name="storageSystem" onChange={onChange}>
                  <option value="">Select Storage System</option>
                  <option value="CephFS">CephFS</option>
                  <option value="NFS">NFS</option>
                  <option value="BlockStorage">Block Storage</option>
                </select>
              </FormControl>
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
                  {viewList.map(({ clusterName, clusterType, clusterEndpoint }) => (
                    <tr>
                      <td style={{ textAlign: "center" }}>
                        <input
                          type="radio"
                          // type="checkbox"
                          name="selectClusters"
                          onChange={e => checkCluster(e, clusterName)}
                          value={selectClusters}
                        />
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
              Volume Expansion<span className="requried">*</span>
            </th>
            <td>
              <FormControl className="form_fullWidth">
                <select name="volumeExpansion" onChange={onChange}>
                  <option value="">Select Volume Expansion</option>
                  <option value="true">true</option>
                  <option value="false">false</option>
                </select>
              </FormControl>
            </td>
            <th></th>
          </tr>
          <tr>
            <th>
              Reclaim Policy <span className="requried">*</span>
            </th>
            <td>
              <FormControl className="form_fullWidth">
                <select name="reclaimPolicy" onChange={onChange}>
                  <option value="">Select Reclaim Policy</option>
                  <option value="Delete">Delete</option>
                  <option value="Retain">Retain</option>
                </select>
              </FormControl>
            </td>
            <th></th>
          </tr>
          <tr>
            <th>Access Mode</th>
            <td>
              <FormControl className="form_fullWidth">
                <select name="accessMode" onChange={onChange}>
                  <option value="">Select Access Mode</option>
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
              VolumeBinding Mode <span className="requried">*</span>
            </th>
            <td>
              <FormControl className="form_fullWidth">
                <select name="volumeBindingMode" onChange={onChange}>
                  <option value="">Select VolumeBinding Mode</option>
                  <option value="Immediate">Immediate</option>
                  <option value="Delayed">Delayed</option>
                </select>
              </FormControl>
            </td>
            <th></th>
          </tr>
          {/* <tr>
            <th>Pool</th>
            <td>
              <CTextField
                type="text"
                placeholder="Pool"
                className="form_fullWidth"
                name="Pool"
                onChange={onChange}
                // value={StorageClassName}
              />
            </td>
            <th></th>
          </tr>
          <tr>
            <th>UserSecretName</th>
            <td>
              <CTextField
                type="text"
                placeholder="UserSecretName"
                className="form_fullWidth"
                name="userSecretName"
                onChange={onChange}
                // value={StorageClassName}
              />
            </td>
            <th></th>
          </tr> */}
        </tbody>
      </table>
    </>
  );
});

export default StorageClassBasicInfo;
