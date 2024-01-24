import { FormControl } from "@material-ui/core";
import styled from "styled-components";
import projectStore from "../../../../../store/Project";
import gsLinkStore from "../../../../../store/GsLink";
import clusterStore from "../../../../../store/Cluster";
import { useEffect, useState } from "react";
import workspaceStore from "../../../../../store/WorkSpace";
import podStore from "../../../../../store/Pod";
import { observer } from "mobx-react";
import serviceStore from "../../../../../store/Service";

const Table = styled.table`
  tbody {
    display: block;
    height: 110px;
    overflow: auto;
  }
  thead,
  tbody tr {
    display: table;
    width: 100%;
    table-layout: fixed;
  }
  thead {
    width: 100%;
  }
`;

const CreateGsLinkStepThree = observer(() => {
  const { gsLinkInfo, setGsLinkInfo, parameters, setParameters } = gsLinkStore;
  const { loadProjectList, projectLists } = projectStore;
  const { loadCluster, clusterDetail } = clusterStore;
  const { sourceClusterList } = workspaceStore;
  const { loadPodList, podList } = podStore;
  const [selectedPod, setSelectedPod] = useState([]);
  const [selectedService, setSelectedService] = useState([]);
  const { loadServiceList, serviceList } = serviceStore;

  const onChange = (e) => {
    const { name, value } = e.target;

    if (name === "targetCluster") {
      setParameters("target_cluster", value);
    }
  };

  console.log("parameters", parameters);

  return (
    <>
      <div className="step-container">
        <div className="signup-step">
          <div className="step">
            <span>기본 정보</span>
          </div>
          <div className="arr"></div>
          <div className="step">
            <span>소스 클러스터</span>
          </div>
          <div className="arr"></div>
          <div className="step current">
            <span>대상 클러스터</span>
          </div>
        </div>
      </div>

      <table className="tb_data_new tb_write">
        <tbody>
          <tr>
            <th style={{ width: "144px" }}>
              Target Cluster <span className="requried">*</span>
            </th>
            <td colSpan="3">
              <Table className="tb_data_new">
                <thead>
                  <tr>
                    <th style={{ textAlign: "center", width: "7%" }}></th>
                    <th style={{ textAlign: "center", width: "70%" }}>Name</th>
                    <th style={{ textAlign: "center" }}>Type</th>
                  </tr>
                </thead>
                <tbody className="tb_data_nodeInfo">
                  {sourceClusterList ? (
                    sourceClusterList?.map((cluster) => (
                      <tr>
                        <td style={{ textAlign: "center", width: "7%" }}>
                          <input
                            type="radio"
                            // checked={cluster.clusterName}
                            name="targetCluster"
                            onChange={onChange}
                            value={cluster.clusterName}
                          />
                        </td>
                        <td style={{ width: "70%" }}>{cluster.clusterName}</td>
                        <td>{cluster.clusterType}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3">No Data</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
});

export default CreateGsLinkStepThree;
