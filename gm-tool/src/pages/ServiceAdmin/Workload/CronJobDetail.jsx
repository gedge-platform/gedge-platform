import React, { useState, useEffect } from "react";
import { PanelBox } from "@/components/styles/PanelBox";
import { CTabs, CTab, CTabPanel } from "@/components/tabs";
import styled from "styled-components";
import cronJobStore from "../../../store/CronJob";
import { observer } from "mobx-react-lite";
import { dateFormatter } from "@/utils/common-utils";
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
  border-radius: 4px;
  background-color: #2f3855;
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
  const { cronJobDetail, label, annotations, events, cronjobInvolvesJobs } =
    cronJobStore;
  const [open, setOpen] = useState(false);
  const [tabvalue, setTabvalue] = useState(0);
  const containers = cronJobDetail.containers;

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
        <CTab label="Involves Data" />
      </CTabs>
      <CTabPanel value={tabvalue} index={0}>
        <div className="tb_container">
          <table className="tb_data" style={{ tableLayout: "fixed" }}>
            <tbody>
              <tr>
                <th className="tb_workload_detail_th">Name</th>
                <td>{cronJobDetail.name ? cronJobDetail.name : "-"}</td>
                <th className="tb_workload_detail_th">Cluster</th>
                <td>{cronJobDetail.cluster ? cronJobDetail.cluster : "-"}</td>
              </tr>
              <tr>
                <th>Project</th>
                <td>{cronJobDetail.project ? cronJobDetail.project : "-"}</td>
                <th>Schedule</th>
                <td>{cronJobDetail.schedule ? cronJobDetail.schedule : "-"}</td>
              </tr>
              <tr>
                <th>Concurrency Policy</th>
                <td>{cronJobDetail.concurrencyPolicy ? cronJobDetail.concurrencyPolicy : "-"}</td>
                <th>Successful Jobs History Limit</th>
                <td>{cronJobDetail.successfulJobsHistoryLimit ? cronJobDetail.successfulJobsHistoryLimit : "-"}</td>
              </tr>
              <tr>
                <th>Created</th>
                <td>{cronJobDetail.creationTimestamp ? dateFormatter(cronJobDetail.creationTimestamp) : "-"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CTabPanel>
      <CTabPanel value={tabvalue} index={1}>
        <div className="tb_container">
          <TableTitle>Containers</TableTitle>
          <table className="tb_data">
            {containers?.map((item) => (
              <tbody>
                <tr>
                  <th className="tb_workload_detail_th">Name</th>
                  <td>{item?.name}</td>
                  <th>Image</th>
                  <td>{item?.image}</td>
                </tr>
              </tbody>
            ))}
          </table>
        </div>
      </CTabPanel>
      <CTabPanel value={tabvalue} index={2}>
        <div className="tb_container">
          <TableTitle>Labels</TableTitle>
          <LabelContainer>
            {label ? (
              Object.entries(label).map(([key, value]) => (
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
        </div>
      </CTabPanel>
      <CTabPanel value={tabvalue} index={3}>
        <EventAccordion events={events} />
      </CTabPanel>
      <CTabPanel value={tabvalue} index={4}>
        <div className="tb_container">
          <TableTitle>References</TableTitle>
          {cronjobInvolvesJobs
            ? cronjobInvolvesJobs.map((job) => (
                <>
                  <table className="tb_data" style={{ tableLayout: "fixed" }}>
                    <tbody>
                      <tr>
                        <th style={{ width: "25%" }}>Name</th>
                        <td>{job?.name}</td>
                      </tr>
                      <tr>
                        <th>CompletionTime</th>
                        <td>{dateFormatter(job?.completionTime)}</td>
                      </tr>
                      <tr>
                        <th>StartTime</th>
                        <td>{dateFormatter(job?.startTime)}</td>
                      </tr>
                      <tr>
                        <th>Succeeded</th>
                        <td>{job?.succeeded}</td>
                      </tr>
                    </tbody>
                  </table>
                  <br />
                </>
              ))
            : "No Info"}
          <br />
        </div>
      </CTabPanel>
    </PanelBox>
  );
});
export default Detail;
