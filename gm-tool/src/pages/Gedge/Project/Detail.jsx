import React, { useState } from "react";
import { PanelBox } from "@/components/styles/PanelBox";
import { CTabs, CTab, CTabPanel } from "@/components/tabs";
import { observer } from "mobx-react";
import styled from "styled-components";
import { dateFormatter } from "@/utils/common-utils";
import projectStore from "../../../store/Project";
import "@grapecity/wijmo.styles/wijmo.css";
import { MenuItem, FormControl, Select } from "@mui/material";
import EventAccordion from "@/components/detail/EventAccordion";

const EventWrap = styled.div`
  .MuiInputBase-input {
    color: rgba(255, 255, 255, 0.8);
    width: 200px;
    margin: 10px;
    font-weight: 400;
    font-size: 15px;
    box-size: small;
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
    projectDetail,
    labels,
    annotations,
    detailInfo,
    clusterList,
    selectClusterInfo,
    changeCluster,
    workspace,
    events,
    resourceUsage,
  } = projectStore;
  console.log(resourceUsage);

  // const { projectDetail :{selectCluster, resources:{deployment_count}} } = projectStore;
  const [open, setOpen] = useState(false);
  const [tabvalue, setTabvalue] = useState(0);

  const eventsTable = () => {
    return (
      <EventWrap className="event-wrap">
        <FormControl>
          <Select
            value={selectCluster}
            inputProps={{ "aria-label": "Without label" }}
            onChange={clusterChange}
          >
            {clusterList.map((cluster) => (
              <MenuItem
                style={{
                  color: "black",
                  backgroundColor: "white",
                  fontSize: 15,
                }}
                value={cluster}
              >
                {cluster}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </EventWrap>
    );
  };

  const clusterChange = (e) => {
    changeCluster(e.target.value);
  };

  const clusterResourceTable = () => {
    return detailInfo.map((cluster) => (
      <>
        <ClusterTitle>{cluster.clusterName}</ClusterTitle>
        <table className="tb_data">
          <tbody className="tb_workload_detail_th">
            <tr>
              {cluster.resourceUsage ? (
                <>
                  <th>CPU</th>
                  <td>
                    {cluster.resourceUsage?.namespace_cpu
                      ? cluster.resourceUsage?.namespace_cpu
                      : "-"}
                  </td>
                  <th>MEMORY</th>
                  <td>
                    {cluster.resourceUsage?.namespace_memory
                      ? cluster.resourceUsage?.namespace_memory
                      : "-"}
                  </td>
                </>
              ) : (
                <></>
              )}
            </tr>
          </tbody>
        </table>
        <br />
      </>
    ));
  };

  const resourcesTable = () => {
    return detailInfo.map((resources) => (
      <>
        <ClusterTitle>{resources.clusterName}</ClusterTitle>
        <table className="tb_data" style={{ tableLayout: "fixed" }}>
          <tbody>
            {resources?.resource ? (
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
                  <th>Volume</th>
                  <td>
                    {resources?.resource?.volume_count
                      ? resources?.resource?.volume_count
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
            ) : (
              <></>
            )}
          </tbody>
        </table>
        <br />
      </>
    ));
  };

  const handleTabChange = (event, newValue) => {
    setTabvalue(newValue);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
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
          <table className="tb_data" style={{ tableLayout: "fixed" }}>
            <tbody>
              <tr>
                <th className="tb_workload_detail_th">Project Name</th>
                <td>{projectDetail.projectName}</td>
                <th>Project Type</th>
                <td>{projectDetail.projectType}</td>
              </tr>
              <tr>
                <th className="tb_workload_detail_th">Workspace Name</th>
                <td>{Object.values(workspace)[1]}</td>
                <th>Workspace Description</th>
                <td>{Object.values(workspace)[2]}</td>
              </tr>
              <tr>
                <th>Cluster Name</th>
                <td style={{ whiteSpace: "pre-wrap" }}>
                  {selectClusterInfo?.map(
                    (cluster) => cluster.clusterName + "\n"
                  )}
                </td>
                <th>Creator</th>
                <td>{projectDetail.memberName}</td>
              </tr>
            </tbody>
          </table>
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
      <CTabPanel value={tabvalue} index={3}>
        <EventAccordion events={events} />
      </CTabPanel>
    </PanelBox>
  );
});
export default Detail;
