import React, { useState } from "react";
import { PanelBox } from "@/components/styles/PanelBox";
import { CTabs, CTab, CTabPanel } from "@/components/tabs";
import styled from "styled-components";
import { observer } from "mobx-react";
import { jobStore } from "@/store";
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
    jobDetailData,
    involvesPodList,
    labels,
    annotations,
    events,
    ownerReferences,
    containers,
  } = jobStore;

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
        <CTab label="Involves Data" />
      </CTabs>
      <CTabPanel value={tabvalue} index={0}>
        <div className="tb_container">
          {jobDetailData.length !== 0 ? (
            <>
              <table className="tb_data" style={{ tableLayout: "fixed" }}>
                <tbody>
                  <tr>
                    <th>Name</th>
                    <td>{jobDetailData.name ? jobDetailData.name : "-"}</td>
                    <th>Cluster</th>
                    <td>
                      {jobDetailData.cluster ? jobDetailData.cluster : "-"}
                    </td>
                  </tr>
                  <tr>
                    <th>Project</th>
                    <td>
                      {jobDetailData.project ? jobDetailData.project : "-"}
                    </td>
                    <th>Status</th>
                    <td>{jobDetailData.status ? jobDetailData.status : "-"}</td>
                  </tr>
                  <tr>
                    <th>BackOffLimit</th>
                    <td>
                      {jobDetailData.backoffLimit
                        ? jobDetailData.backoffLimit
                        : "-"}
                    </td>
                    <th>Completions</th>
                    <td>
                      {jobDetailData.completions
                        ? jobDetailData.completions
                        : "-"}
                    </td>
                  </tr>
                  <tr>
                    <th>Start Time</th>
                    <td>
                      {jobDetailData.startTime
                        ? dateFormatter(jobDetailData.startTime)
                        : "-"}
                    </td>
                    <th>Created</th>
                    <td>
                      {jobDetailData.created_at
                        ? dateFormatter(jobDetailData.created_at)
                        : "-"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </>
          ) : (
            <LabelContainer>
              <p>No Detail Info</p>
            </LabelContainer>
          )}
        </div>
      </CTabPanel>
      <CTabPanel value={tabvalue} index={1}>
        <div className="tb_container">
          <TableTitle>Containers</TableTitle>
          {containers.length !== 0 ? (
            containers.map((containers) => (
              <table className="tb_data" style={{ tableLayout: "fixed" }}>
                <tbody>
                  <tr>
                    <th style={{ width: "25%" }}>Container Name</th>
                    <td>{containers ? containers?.name : "-"}</td>
                  </tr>
                  <tr>
                    <th>Command</th>
                    <td>
                      {containers?.command?.map((item) => (
                        <p>{item ? item : "-"}</p>
                      ))}
                    </td>
                  </tr>
                  <tr>
                    <th>Args</th>
                    <td>
                      {containers?.args ? (
                        containers?.args?.map((item) => (
                          <p>{item ? item : "-"}</p>
                        ))
                      ) : (
                        <>-</>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th>Image</th>
                    <td>{containers?.image ? containers?.image : "-"}</td>
                  </tr>
                  <tr>
                    <th>ImagePullPolicy</th>
                    <td>
                      {containers?.imagePullPolicy
                        ? containers?.imagePullPolicy
                        : "-"}
                    </td>
                  </tr>
                  <tr>
                    <th>resources</th>
                    <td></td>
                  </tr>
                  <tr>
                    <th>TerminationMessagePath</th>
                    <td>
                      {containers?.terminationMessagePath
                        ? containers?.terminationMessagePath
                        : "-"}
                    </td>
                  </tr>
                  <tr>
                    <th>TerminationMessagePolicy</th>
                    <td>
                      {containers?.terminationMessagePolicy
                        ? containers?.terminationMessagePolicy
                        : "-"}
                    </td>
                  </tr>
                </tbody>
              </table>
            ))
          ) : (
            <LabelContainer>
              <p>No Container Info</p>
            </LabelContainer>
          )}
          <br />
        </div>
      </CTabPanel>
      <CTabPanel value={tabvalue} index={2}>
        <div className="tb_container">
          <TableTitle>Labels</TableTitle>
          <LabelContainer>
            {labels.length !== 0 ? (
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
          {annotations.length !== 0 ? (
            <table className="tb_data" style={{ tableLayout: "fixed" }}>
              <tbody>
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
      <CTabPanel value={tabvalue} index={4}>
        <div className="tb_container">
          <TableTitle>Pod</TableTitle>
          {involvesPodList.length !== 0 ? (
            involvesPodList.map((pod) => (
              <table className="tb_data" style={{ tableLayout: "fixed" }}>
                <tbody>
                  <tr>
                    <th style={{ width: "25%" }}>Name</th>
                    <td>{pod?.name ? pod?.name : "-"}</td>
                  </tr>
                  <tr>
                    <th>Pod IP</th>
                    <td>{pod?.podIP ? pod?.podIP : "-"}</td>
                  </tr>
                  <tr>
                    <th>Host IP</th>
                    <td>{pod?.hostIP ? pod?.hostIP : "-"}</td>
                  </tr>
                  <tr>
                    <th>Node Name</th>
                    <td>{pod?.nodeName ? pod?.nodeName : "-"}</td>
                  </tr>
                  <tr>
                    <th>Status</th>
                    <td>{pod?.status ? pod?.status : "-"}</td>
                  </tr>
                </tbody>
              </table>
            ))
          ) : (
            <LabelContainer>
              <p>No Pod Info</p>
            </LabelContainer>
          )}

          <TableTitle>References</TableTitle>

          {ownerReferences.kind ? (
            Object.entries(ownerReferences).map(([key, value]) => (
              <table className="tb_data" style={{ tableLayout: "fixed" }}>
                <tbody>
                  <tr>
                    <th style={{ width: "25%" }}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </th>
                    <td>{value}</td>
                  </tr>
                </tbody>
              </table>
            ))
          ) : (
            <LabelContainer>
              <p>No Reference Info</p>
            </LabelContainer>
          )}
        </div>
      </CTabPanel>
    </PanelBox>
  );
});
export default Detail;
