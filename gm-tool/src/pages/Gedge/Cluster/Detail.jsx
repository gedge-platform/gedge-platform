import React, { useState, useEffect } from "react";
import { PanelBox } from "@/components/styles/PanelBox";
import { CTabs, CTab, CTabPanel } from "@/components/tabs";
import { observer } from "mobx-react";
import { clusterStore } from "@/store";
import styled from "styled-components";
import { dateFormatter, isValidJSON, nullCheck } from "@/utils/common-utils";
import ReactJson from "react-json-view";
import EventAccordion from "@/components/detail/EventAccordion";
import { CCreateButton, CDeleteButton } from "@/components/buttons";
import EdgeZoneAddNode from "./Dialog/EdgeZoneAddNode";

const TableTitle = styled.span`
  flex: 1;
  flex-direction: row;
  font-size: 14px;
  font-weight: 500;
  margin: 8px 0;
  color: rgba(255, 255, 255, 0.8);
`;

const LabelContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  padding: 12px;
  border: 1px double #141a30;
  background-color: #2f3855;
  margin: 10px 0;
  p {
    color: rgba(255, 255, 255, 0.6);
  }
`;

const Label = styled.span`
  height: 20px;
  background-color: #20263a;
  vertical-align: middle;
  padding: 0 2px 0 2px;
  line-height: 20px;
  font-weight: 600;
  margin: 6px 6px;
  .key {
    padding: 0 2px;
    background-color: #eff4f9;
    color: #36435c;
    text-align: center;
  }
  .value {
    padding: 0 2px;
    text-align: center;
    color: #eff4f9;
  }
`;

const Detail = observer((props) => {
  const {
    clusterDetail: {
      clusterName,
      events,
      nodes,
      resource: {
        cronjob_count,
        deployment_count,
        job_count,
        pod_count,
        service_count,
        volume_count,
        Statefulset_count,
        daemonset_count,
      },
    },
    dataUsage,
    loadCluster,
    gpuInfo,
  } = clusterStore;

  const nodesChk = nodes === null ? 0 : nodes;

  const [open, setOpen] = useState(false);
  const [tabvalue, setTabvalue] = useState(0);
  const [nodeNum, setNodeNum] = useState(0);
  const [AddNode, setAddNodeOpen] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabvalue(newValue);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleAddNodeOpen = () => {
    setAddNodeOpen(true);
  };

  const handleAddNodeClose = () => {
    setAddNodeOpen(false);
  };

  const reloadData = () => {
    setReRun(true);
  };

  const nodeTemp = nodes ? nodes?.map((data) => data.name).join(", ") : "-";
  const containerRuntimeVersionTemp = nodes
    ? nodes?.map((data) => data.containerRuntimeVersion).join(", ")
    : "-";

  const FormatNewLines = (nodeTemp) => {
    // 쉼표를 기준으로 분리하고 trim() 메서드로 양쪽 공백 제거
    const dataArray = nodeTemp.split(",").map((item) => item.trim());

    // 각 항목을 새 줄로 이어붙이기
    // html 부분에도 style={{ whiteSpace: "pre-line" }} 추가해야함
    const nodeResult = dataArray.join("\n");

    return nodeResult;
  };

  const allocatableData = () => {
    let allocatableResult = 0;
    const allocatableArray = gpuInfo?.map((data) => data.allocatable);

    if (allocatableArray) {
      for (let i = 0; i < allocatableArray.length; i++) {
        const allocatableValue = allocatableArray[i]?.["nvidia.com/gpu"];

        allocatableResult += allocatableValue;
      }

      return allocatableResult;
    } else {
      return 0;
    }
  };

  const limitsData = () => {
    let limitsResult = 0;

    const limitsArray = gpuInfo?.map((data) => data.limits);

    if (limitsArray) {
      for (let i = 0; i < limitsArray.length; i++) {
        const limitsValue =
          limitsArray[i]?.["nvidia.com/gpu"] !== undefined
            ? limitsArray[i]?.["nvidia.com/gpu"]
            : 0;

        limitsResult += limitsValue;
      }

      return limitsResult;
    } else {
      return 0;
    }
  };

  const nodeList = () => {
    return nodes.map((node, idx) => (
      <tr onClick={() => setNodeNum(idx)}>
        <td>{node.name}</td>
        <td>{node.type}</td>
        <td>{node.nodeIP}</td>
        <td>{node.kubeVersion}</td>
        <td>{node.os}</td>
        <td>{dateFormatter(node.created_at)}</td>
      </tr>
    ));
  };

  const labelByNode = () => {
    return Object.entries(nodes[nodeNum].labels).map(([key, value]) => (
      <Label>
        <span className="key">{key}</span>
        <span className="value">{value}</span>
      </Label>
    ));
  };
  const annotationByNode = () => {
    return Object.entries(nodes[nodeNum].annotations).map(([key, value]) => (
      <tr>
        <th style={{ width: "40%" }}>{key}</th>
        <td>
          {isValidJSON(value) ? (
            <ReactJson
              src={JSON.parse(value)}
              theme="summerfruit"
              displayDataTypes={false}
              displayObjectSize={false}
            />
          ) : (
            value
          )}
        </td>
      </tr>
    ));
  };

  useEffect(() => {
    if (nodesChk.length >= 1) {
      labelByNode();
      annotationByNode();
      loadCluster(clusterName);
    }
  }, [nodeNum]);

  return (
    <PanelBox>
      <CTabs type="tab2" value={tabvalue} onChange={handleTabChange}>
        <CTab label="Overview" />
        <CTab label="Resource Status" />
        <CTab label="Node Info" />
        <CTab label="Metadata" />
        <CTab label="Events" />
      </CTabs>
      <CTabPanel style={{ overflowY: "scroll" }} value={tabvalue} index={0}>
        <div className="tb_container">
          <>
            <div>
              <table className="tb_data" style={{ tableLayout: "fixed" }}>
                <tbody className="tb_data_detail">
                  <tr>
                    <th>clusterName</th>
                    <td>{clusterName ? clusterName : "-"}</td>
                    <th>node</th>
                    <td style={{ whiteSpace: "pre-line" }}>
                      {FormatNewLines(nodeTemp)}
                    </td>
                  </tr>
                  <tr>
                    <th>gpu (used / total)</th>
                    <td>
                      {limitsData()} / {allocatableData()}
                    </td>
                    <th>container</th>
                    <td style={{ whiteSpace: "pre-line" }}>
                      {FormatNewLines(containerRuntimeVersionTemp)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <br />
            <TableTitle>Resource Usage</TableTitle>
            <div style={{ padding: "3px" }}></div>
            <tbody>
              <tr className="tb_workload_detail_th">
                <td colSpan={4}>
                  {dataUsage ? (
                    <>
                      <table className="tb_data">
                        <tbody>
                          <tr>
                            <th style={{ width: "307px" }}>CPU</th>
                            <td style={{ width: "307px" }}>
                              {dataUsage?.cpuUsage
                                ? dataUsage?.cpuUsage.value
                                : "-"}
                            </td>
                            <th style={{ width: "307px" }}>MEMORY</th>
                            <td style={{ width: "307px" }}>
                              {dataUsage?.memoryUsage
                                ? dataUsage?.memoryUsage.value
                                : "-"}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </>
                  ) : (
                    <LabelContainer>
                      <p>No Resource Usage Information</p>
                    </LabelContainer>
                  )}
                </td>
              </tr>
            </tbody>
          </>
        </div>
      </CTabPanel>
      <CTabPanel style={{ overflowY: "scroll" }} value={tabvalue} index={1}>
        <div className="tb_container">
          <table className="tb_data">
            <tbody className="tb_data_detail">
              <tr>
                <th>Deployment</th>
                <td>{deployment_count ? deployment_count : "-"}</td>
                <th>Pod</th>
                <td>{pod_count ? pod_count : "-"}</td>
              </tr>
              <tr>
                <th>Service</th>
                <td>{service_count ? service_count : "-"}</td>
                <th>Cronjob</th>
                <td>{cronjob_count ? cronjob_count : "-"}</td>
              </tr>
              <tr>
                <th>StatefulSet</th>
                <td>{Statefulset_count ? Statefulset_count : "-"}</td>
                <th>DaemonSet</th>
                <td>{daemonset_count ? daemonset_count : "-"}</td>
              </tr>
              <tr>
                <th>Job</th>
                <td>{job_count ? job_count : "-"}</td>
                <th>Volume</th>
                <td>{volume_count ? volume_count : "-"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CTabPanel>
      <CTabPanel style={{ overflowY: "scroll" }} value={tabvalue} index={2}>
        <div className="tb_container">
          <TableTitle>Node List</TableTitle>&nbsp;&nbsp;&nbsp;&nbsp;
          {/* <CCreateButton onClick={handleAddNodeOpen} styled={{ flex: 1 }}>
            Node 추가
          </CCreateButton>
         */}
          <EdgeZoneAddNode
            open={AddNode}
            onClose={handleAddNodeClose}
            reloadFunc={reloadData}
          />
          <br />
          <br />
          <table className="tb_data" style={{ tableLayout: "fixed" }}>
            <tbody>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>IP</th>
                <th>Kube-Version</th>
                <th>OS</th>
                <th>Created</th>
              </tr>
              {nodesChk.length >= 1 ? (
                nodeList()
              ) : (
                <tr>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CTabPanel>
      <CTabPanel style={{ overflowY: "scroll" }} value={tabvalue} index={3}>
        <div className="tb_container">
          <TableTitle>Labels</TableTitle>
          <LabelContainer>
            {nodesChk.length >= 1 ? labelByNode() : <p>No Labels Info</p>}
          </LabelContainer>

          <TableTitle>Annotations</TableTitle>
          {nodesChk.length >= 1 ? (
            <table className="tb_data" style={{ margin: "10px 0" }}>
              <tbody>{annotationByNode()}</tbody>
            </table>
          ) : (
            <LabelContainer>
              <p>No Annotations Info</p>
            </LabelContainer>
          )}
        </div>
      </CTabPanel>
      <CTabPanel style={{ overflowY: "scroll" }} value={tabvalue} index={4}>
        <EventAccordion events={events} />
      </CTabPanel>
    </PanelBox>
  );
});
export default Detail;
