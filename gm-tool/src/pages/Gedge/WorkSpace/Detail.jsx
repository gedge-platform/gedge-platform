import React, { useState, useEffect } from "react";
import { PanelBox } from "@/components/styles/PanelBox";
import { CTabs, CTab, CTabPanel } from "@/components/tabs";
import { observer } from "mobx-react";
import styled from "styled-components";
import workspaceStore from "../../../store/WorkSpace";
import "@grapecity/wijmo.styles/wijmo.css";
import { dateFormatter } from "@/utils/common-utils";
import { Projection } from "leaflet";
import EventAccordion from "@/components/detail/EventAccordion";

const EventWrap = styled.div`
  .MuiInputBase-input {
    color: rgba(255, 255, 255, 0.8);
    width: 200px;
    margin: 10px;
    font-weight: 400;
    font-size: 15px;
  }

  .MuiInputBase-root {
    font: inherit;
    line-height: inherit;
  }

  .MuiPopover-paper {
    color: red;
  }

  .MuiOutlinedInput-notchedOutline {
    border: none;
  }

  .MuiSvgIcon-root {
    color: white;
  }

  .MuiOutlinedInput-input {
    padding: 8px;
    box-sizing: content-box;
  }

  .MuiPopover-paper {
    color: rgba(255, 255, 255, 0.8);
  }

  .MuiPaper-elevation8 {
    height: 40px;
  }
`;

const TableTitle = styled.p`
  font-size: 14px;
  font-weight: 500;
  margin: 8px 0;
  color: rgba(255, 255, 255, 0.8);
`;

const ClusterTitle = styled.p`
  font-size: 13px;
  font-weight: 500;
  margin: 6px 0;
  color: rgba(255, 255, 255, 0.7);
`;

const LabelContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  padding: 12px;
  border-radius: 4px;
  background-color: #2f3855;

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

const Detail = observer(() => {
  const {
    workSpaceDetail,
    labels,
    annotations,
    detailInfo,
    dataUsage,
    events,
    changeProject,
    selectClusterInfo,
  } = workspaceStore;
  const [tabvalue, setTabvalue] = useState(0);

  const projectChange = (e) => {
    changeProject(e.target.value);
  };

  const clusterResourceTable = () => {
    return (
      <>
        {/* <ClusterTitle>{workSpaceDetail.workspaceName}</ClusterTitle> */}
        <table className="tb_data">
          <tbody className="tb_workload_detail_th">
            <tr>
              {dataUsage ? (
                <>
                  <th>CPU</th>
                  <td>{dataUsage?.cpu_usage}</td>
                  <th>MEMORY</th>
                  <td>{dataUsage?.memory_usage}</td>
                </>
              ) : (
                <></>
              )}
            </tr>
          </tbody>
        </table>
        <br />
      </>
    );
  };

  const clusterProjectTable = () => {
    return detailInfo ? (
      detailInfo.map((project) => (
        <>
          <table className="tb_data" style={{ tableLayout: "fixed" }}>
            <tbody className="project_table">
              <tr>
                {detailInfo ? (
                  <>
                    <tr>
                      <th> Name</th>
                      <td>{project?.projectName}</td>
                      <th>Cluster</th>
                      <td style={{ whiteSpace: "pre-wrap" }}>
                        {selectClusterInfo.map(
                          (item) => item.clusterName + "\n"
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th>Created</th>
                      <td>{dateFormatter(project?.created_at)}</td>
                      <th>Creator</th>
                      <td>
                        {project?.projectCreator
                          ? project?.projectCreator
                          : "-"}
                      </td>
                    </tr>
                  </>
                ) : (
                  <></>
                )}
              </tr>
            </tbody>
          </table>
          <br />
        </>
      ))
    ) : (
      <>
        <table className="tb_data" style={{ tableLayout: "fixed" }}>
          <tbody className="project_table">
            <tr>
              {
                <>
                  <tr>
                    <th> Name</th>
                    <td>-</td>
                    <th>Cluster</th>
                    <td>-</td>
                  </tr>
                  <tr>
                    <th>Created</th>
                    <td>-</td>
                    <th>Creator</th>
                    <td>-</td>
                  </tr>
                </>
              }
            </tr>
          </tbody>
        </table>
        <br />
      </>
    );
  };

  const resourcesTable = () => {
    return (
      <>
        {/* <ClusterTitle>{workSpaceDetail.workspaceName}</ClusterTitle> */}
        <table className="tb_data" style={{ tableLayout: "fixed" }}>
          <tbody>
            {workSpaceDetail.resource ? (
              <>
                <tr>
                  <th>Deployment</th>
                  <td>{workSpaceDetail.resource.deployment_count}</td>
                  <th>Pod</th>
                  <td>{workSpaceDetail.resource.pod_count}</td>
                </tr>
                <tr>
                  <th>Service</th>
                  <td>{workSpaceDetail.resource.service_count}</td>
                  <th>CronJob</th>
                  <td>{workSpaceDetail.resource.cronjob_count}</td>
                </tr>
                <tr>
                  <th>Job</th>
                  <td>{workSpaceDetail.resource.job_count}</td>
                  <th>Volume</th>
                  <td>{workSpaceDetail.resource.volume_count}</td>
                </tr>
                <tr>
                  <th>Statefulset</th>
                  <td>{workSpaceDetail.resource.Statefulset_count}</td>
                  <th>Daemonset</th>
                  <td>{workSpaceDetail.resource.daemonset_count}</td>
                </tr>
              </>
            ) : (
              <></>
            )}
          </tbody>
        </table>
        <br />
      </>
    );
  };

  const handleTabChange = (event, newValue) => {
    setTabvalue(newValue);
  };

  return (
    <PanelBox style={{ overflowY: "hidden" }}>
      <CTabs type="tab2" value={tabvalue} onChange={handleTabChange}>
        <CTab label="Overview" />
        <CTab label="Resources" />
        <CTab label="Projects" />
        <CTab label="Metadata" />
        <CTab label="Events" />
      </CTabs>
      <CTabPanel value={tabvalue} index={0}>
        <div className="tb_container">
          <table className="tb_data" style={{ tableLayout: "fixed" }}>
            <tbody>
              <tr className="tb_workload_detail_th">
                <th>Workspace Name</th>
                <td>{workSpaceDetail.workspaceName}</td>
                <th>Description</th>
                <td>{workSpaceDetail.workspaceDescription}</td>
              </tr>
              <tr>
                <th>Cluster Name</th>
                <td style={{ whiteSpace: "pre-wrap" }}>
                  {selectClusterInfo.map((item) => item.clusterName + "\n")}
                </td>
                <th>Creator</th>
                <td>{workSpaceDetail.memberName}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="tb_container">
          <TableTitle>Resource Usage</TableTitle>
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
                            {dataUsage?.cpu_usage}
                          </td>
                        </tr>
                        <tr>
                          <th style={{ width: "307px" }}>MEMORY</th>
                          <td style={{ width: "307px" }}>
                            {dataUsage?.memory_usage}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </>
                ) : (
                  <>-</>
                )}
              </td>
            </tr>
          </tbody>
        </div>
      </CTabPanel>
      <CTabPanel value={tabvalue} index={1}>
        <div className="tb_container">{resourcesTable()}</div>
      </CTabPanel>
      <CTabPanel value={tabvalue} index={2}>
        <div className="tb_container">{clusterProjectTable()}</div>
      </CTabPanel>
      <CTabPanel value={tabvalue} index={3}>
        <div className="tb_container">
          <TableTitle>Labels</TableTitle>
          <LabelContainer>
            {labels ? (
              Object.entries(labels).map(([key, value]) => (
                <Label>
                  <span className="key">{key}</span>
                  <span className="value">{value}</span>
                </Label>
              ))
            ) : (
              <p>No Labels Info.</p>
            )}
          </LabelContainer>
          <br />

          <TableTitle>Annotations</TableTitle>
          {annotations ? (
            <table className="tb_data" style={{ tableLayout: "fixed" }}>
              <tbody style={{ whiteSpace: "pre-line" }}>
                {Object.entries(annotations).map(([key, value]) => (
                  <tr>
                    <th className="tb_workload_detail_labels_th">{key}</th>
                    <td style={{ whiteSpace: "pre-line" }}>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <LabelContainer>
              <p>No Annotations Info.</p>
            </LabelContainer>
          )}
          <br />
        </div>
      </CTabPanel>
      <CTabPanel value={tabvalue} index={4}>
        <EventAccordion events={events} />
      </CTabPanel>
    </PanelBox>
  );
});
export default Detail;
