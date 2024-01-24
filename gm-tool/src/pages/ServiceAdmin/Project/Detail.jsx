import React, { useState, useEffect } from "react";
import { PanelBox } from "@/components/styles/PanelBox";
import { CTabs, CTab, CTabPanel } from "@/components/tabs";
import { observer } from "mobx-react";
import styled from "styled-components";
import { projectStore } from "@/store";
import "@grapecity/wijmo.styles/wijmo.css";
import EventAccordion from "@/components/detail/EventAccordion";

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

const Detail = observer(() => {
  const {
    projectDetail,
    labels,
    annotations,
    detailInfo,
    clusterList,
    selectClusterInfo,
    changeCluster,
    workspace,
    events,
  } = projectStore;
  const [tabvalue, setTabvalue] = useState(0);

  const clusterResourceTable = () => {
    return detailInfo.map((cluster) => (
      <>
        <ClusterTitle>{cluster.clusterName}</ClusterTitle>
        {cluster?.resourceUsage ? (
          <table className="tb_data">
            <tbody className="tb_workload_detail_th">
              <tr>
                <>
                  <th>CPU</th>
                  <td>
                    {cluster?.resourceUsage?.namespace_cpu
                      ? cluster?.resourceUsage?.namespace_cpu
                      : "-"}
                  </td>
                  <th>MEMORY</th>
                  <td>
                    {cluster?.resourceUsage?.namespace_memory
                      ? cluster?.resourceUsage?.namespace_memory
                      : "-"}
                  </td>
                </>
              </tr>
            </tbody>
          </table>
        ) : (
          <LabelContainer>
            <p>No Resource Usage Info</p>
          </LabelContainer>
        )}
        <br />
      </>
    ));
  };

  const resourcesTable = () => {
    return detailInfo.map((resources) => (
      <>
        <ClusterTitle>{resources.clusterName}</ClusterTitle>
        {resources?.resource ? (
          <table className="tb_data" style={{ tableLayout: "fixed" }}>
            <tbody>
              <>
                <tr>
                  <th>Deployment</th>
                  <td>
                    {resources?.resource?.deployment_count
                      ? resources?.resource?.deployment_count
                      : "-"}
                  </td>
                  <th>Pod</th>
                  <td>
                    {resources?.resource?.pod_count
                      ? resources?.resource?.pod_count
                      : "-"}
                  </td>
                </tr>
                <tr>
                  <th>Service</th>
                  <td>
                    {resources?.resource?.service_count
                      ? resources?.resource?.service_count
                      : "-"}
                  </td>
                  <th>CronJob</th>
                  <td>
                    {resources?.resource?.cronjob_count
                      ? resources?.resource?.cronjob_count
                      : "-"}
                  </td>
                </tr>
                <tr>
                  <th>Job</th>
                  <td>
                    {resources?.resource?.job_count
                      ? resources?.resource?.job_count
                      : "-"}
                  </td>
                  <th>PV</th>
                  <td>
                    {resources?.resource?.pv_count
                      ? resources?.resource?.pv_count
                      : "-"}
                  </td>
                </tr>
                <tr>
                  <th>Statefulset</th>
                  <td>
                    {resources?.resource?.Statefulset_count
                      ? resources?.resource?.Statefulset_count
                      : "-"}
                  </td>
                  <th>Daemonset</th>
                  <td>
                    {resources?.resource?.daemonset_count
                      ? resources?.resource?.daemonset_count
                      : "-"}
                  </td>
                </tr>
              </>
            </tbody>
          </table>
        ) : (
          <LabelContainer>
            <p>No Resources Info</p>
          </LabelContainer>
        )}
        <br />
      </>
    ));
  };

  const handleTabChange = (event, newValue) => {
    setTabvalue(newValue);
  };

  return (
    <PanelBox style={{ overflowY: "hidden" }}>
      <CTabs type="tab2" value={tabvalue} onChange={handleTabChange}>
        <CTab label="Overview" />
        <CTab label="Resources" />
        <CTab label="Metadata" />
        <CTab label="Events" />
      </CTabs>
      <CTabPanel value={tabvalue} index={0}>
        <div className="tb_container">
          {projectDetail ? (
            <table className="tb_data" style={{ tableLayout: "fixed" }}>
              <tbody>
                <>
                  <tr>
                    <th className="tb_workload_detail_th">Project Name</th>
                    <td>
                      {projectDetail.projectName
                        ? projectDetail.projectName
                        : "-"}
                    </td>
                    <th>Project Type</th>
                    <td>
                      {projectDetail.projectType
                        ? projectDetail.projectType
                        : "-"}
                    </td>
                  </tr>
                  <tr>
                    <th className="tb_workload_detail_th">Workspace Name</th>
                    <td>
                      {workspace.workspaceName ? workspace.workspaceName : "-"}
                    </td>
                    <th>Workspace Description</th>
                    <td>
                      {workspace.workspaceDescription
                        ? workspace.workspaceDescription
                        : "-"}
                    </td>
                  </tr>
                  <tr>
                    <th>Cluster Name</th>
                    <td style={{ whiteSpace: "pre-wrap" }}>
                      {selectClusterInfo
                        ? selectClusterInfo?.map(
                            (cluster) => cluster.clusterName + "\n"
                          )
                        : "-"}
                    </td>
                    <th>Creator</th>
                    <td>
                      {projectDetail.memberName
                        ? projectDetail.memberName
                        : "-"}
                    </td>
                  </tr>
                </>
              </tbody>
            </table>
          ) : (
            <LabelContainer>
              <p>No Detail Info</p>
            </LabelContainer>
          )}
          <br />
          {clusterResourceTable()}
        </div>
      </CTabPanel>
      <CTabPanel value={tabvalue} index={1}>
        <div className="tb_container">{resourcesTable()}</div>
      </CTabPanel>
      <CTabPanel value={tabvalue} index={2}>
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
              <p>No Labels Info</p>
            )}
          </LabelContainer>

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
              <p>No Annotations Info</p>
            </LabelContainer>
          )}
          <br />
        </div>
      </CTabPanel>
      <CTabPanel value={tabvalue} index={3}>
        <EventAccordion events={events} />
      </CTabPanel>
    </PanelBox>
  );
});
export default Detail;
