import styled from "styled-components";
import gsLinkStore from "../../../../../store/GsLink";
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

const CreateGsLinkStepTwo = observer(() => {
  const { setParameters } = gsLinkStore;
  const { sourceClusterList } = workspaceStore;
  const { loadPodList, podList } = podStore;
  const [selectedPod, setSelectedPod] = useState([]);
  const [selectedService, setSelectedService] = useState([]);
  const { loadServiceList, serviceList } = serviceStore;

  useEffect(() => {
    loadPodList();
    loadServiceList();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;

    if (name === "sourceCluster") {
      const clusterListTemp = podList?.filter((data) => data.cluster === value);
      setSelectedPod(clusterListTemp);
      const serviceListTemp = serviceList?.filter(
        (data) => data.cluster === value
      );
      setSelectedService(serviceListTemp);

      setParameters("source_cluster", value);
    }

    if (name === "service") {
      setParameters("source_service", value);
    }
  };

  return (
    <>
      <div className="step-container">
        <div className="signup-step">
          <div className="step">
            <span>기본 정보</span>
          </div>
          <div className="arr"></div>
          <div className="step current">
            <span>소스 클러스터</span>
          </div>
          <div className="arr"></div>
          <div className="step">
            <span>대상 클러스터</span>
          </div>
        </div>
      </div>

      <table className="tb_data_new tb_write">
        <tbody>
          <tr>
            <th>
              Source Cluster <span className="requried">*</span>
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
                            name="sourceCluster"
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

          <tr>
            <th style={{ width: "144px" }}>Service</th>
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
                  {selectedService.length > 0 ? (
                    selectedService?.map((data, index) => (
                      <tr key={data.name}>
                        <td style={{ textAlign: "center", width: "7%" }}>
                          <input
                            type="radio"
                            // checked={deployment.pvcName === pvc.name}
                            name="service"
                            onChange={onChange}
                            value={data.name}
                          />
                        </td>
                        <td style={{ width: "70%" }}>{data.name}</td>
                        <td>{data.type}</td>
                      </tr>
                    ))
                  ) : (
                    <tr style={{ textAlign: "center", margin: "5% 0 0 0 " }}>
                      No Data
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

export default CreateGsLinkStepTwo;
