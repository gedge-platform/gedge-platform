import React, { useState } from "react";
import { PanelBox } from "@/components/styles/PanelBox";
import { CTabs, CTab, CTabPanel } from "@/components/tabs";
import { observer } from "mobx-react";
import styled from "styled-components";
import { dateFormatter } from "@/utils/common-utils";
import { platformProjectStore } from "@/store";
import "@grapecity/wijmo.styles/wijmo.css";
import EventAccordion from "@/components/detail/EventAccordion";

const TableTitle = styled.p`
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

const Detail = observer(() => {
  const {
    labels,
    annotations,
    events,
    resource,
    resourceUsage,
    detailInfo,
    platformProjectDetail,
  } = platformProjectStore;

  const [open, setOpen] = useState(false);
  const [tabvalue, setTabvalue] = useState(0);

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
              {platformProjectDetail ? (
                <>
                  <tr>
                    <th className="tb_workload_detail_th">Project Name</th>
                    <td>
                      {platformProjectDetail.projectName
                        ? platformProjectDetail.projectName
                        : "-"}
                    </td>
                    <th className="tb_workload_detail_th">Cluster Name</th>
                    <td>
                      {detailInfo.clusterName ? detailInfo.clusterName : "-"}
                    </td>
                  </tr>
                  <tr>
                    <th>Status</th>
                    <td>
                      {platformProjectDetail.status
                        ? platformProjectDetail.status
                        : "-"}
                    </td>
                    <th>Created</th>
                    <td>
                      {platformProjectDetail.created_at
                        ? dateFormatter(platformProjectDetail.created_at)
                        : "-"}
                    </td>
                  </tr>
                  <tr>
                    <th>CPU Usage</th>
                    <td>
                      {resourceUsage.namespace_cpu
                        ? resourceUsage.namespace_cpu
                        : 0}
                    </td>
                    <th>Memory Usage</th>
                    <td>
                      {resourceUsage.namespace_memory
                        ? resourceUsage.namespace_memory
                        : 0}
                    </td>
                  </tr>
                </>
              ) : (
                <LabelContainer>
                  <p>No Detail Info</p>
                </LabelContainer>
              )}
            </tbody>
          </table>
        </div>
      </CTabPanel>
      <CTabPanel value={tabvalue} index={1}>
        <div className="tb_container">
          <table className="tb_data" style={{ tableLayout: "fixed" }}>
            <tbody>
              {resource ? (
                <>
                  <tr>
                    <th className="tb_workload_detail_th">Deployment</th>
                    <td>
                      {resource.namespace_count
                        ? resource.namespace_count
                        : "-"}
                    </td>
                    <th className="tb_workload_detail_th">Deployment</th>
                    <td>
                      {resource.deployment_count
                        ? resource.deployment_count
                        : "-"}
                    </td>
                    <th className="tb_workload_detail_th">Pod</th>
                    <td>{resource.pod_count ? resource.pod_count : "-"}</td>
                  </tr>
                  <tr>
                    <th>Service</th>
                    <td>
                      {resource.service_count ? resource.service_count : "-"}
                    </td>
                    <th>Job</th>
                    <td>{resource.job_count ? resource.job_count : "-"}</td>
                    <th>CronJob</th>
                    <td>
                      {resource.cronjob_count ? resource.cronjob_count : "-"}
                    </td>
                  </tr>
                  <tr>
                    <th>Daemonset</th>
                    <td>
                      {resource.daemonset_count
                        ? resource.daemonset_count
                        : "-"}
                    </td>
                    <th>Statefulset</th>
                    <td>
                      {resource.statefulset_count
                        ? resource.statefulset_count
                        : "-"}
                    </td>
                    <th>Volume</th>
                    <td>{resource.pv_count ? resource.pv_count : "-"}</td>
                  </tr>
                </>
              ) : (
                <LabelContainer>
                  <p>No Resources Info</p>
                </LabelContainer>
              )}
            </tbody>
          </table>
        </div>
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
        </div>
      </CTabPanel>
      <CTabPanel value={tabvalue} index={3}>
        <EventAccordion events={events} />
      </CTabPanel>
    </PanelBox>
  );
});
export default Detail;
