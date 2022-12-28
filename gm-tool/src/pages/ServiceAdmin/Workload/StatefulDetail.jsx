import React, { useState, useEffect } from "react";
import { PanelBox } from "@/components/styles/PanelBox";
import { CTabs, CTab, CTabPanel } from "@/components/tabs";
import styled from "styled-components";
import { statefulSetStore } from "@/store";
import { observer } from "mobx-react-lite";
import { isValidJSON } from "@/utils/common-utils";
import ReactJson from "react-json-view";
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

const StatefulSetDetail = observer(() => {
  const {
    // statefulSetDetail: {
    statefulSetDetail,
    annotations,
    cluster,
    containers,
    createAt,
    events,
    label,
    name,
    ownerReferences,
    project,
    status,
    // },
  } = statefulSetStore;
  console.log(containers);

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
    <PanelBox>
      <CTabs type="tab2" value={tabvalue} onChange={handleTabChange}>
        <CTab label="Overview" />
        <CTab label="Resources" />
        <CTab label="Metadata" />
        <CTab label="Events" />
      </CTabs>
      <CTabPanel value={tabvalue} index={0}>
        <div className="tb_container">
          <table className="tb_data" style={{ tableLayout: "fixed" }}>
            <tbody className="tb_data_detail">
              <tr>
                <th className="tb_workload_detail_th">Name</th>
                <td>{statefulSetDetail ? statefulSetDetail.name : "-"}</td>
                <th className="tb_workload_detail_th">Cluster</th>
                <td>{statefulSetDetail ? statefulSetDetail.cluster : "-"}</td>
              </tr>
              <tr>
                <th>Project</th>
                <td>{statefulSetDetail ? statefulSetDetail.project : "-"}</td>
                <th>Created</th>
                <td>{statefulSetDetail ? dateFormatter(statefulSetDetail.createAt) : "-"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CTabPanel>
      <CTabPanel value={tabvalue} index={1}>
        <div className="tb_container">
          <TableTitle>Containers</TableTitle>
          {containers ? (
            containers.map(container => (
              <table className="tb_data tb_data_container">
                <tbody>
                  <tr>
                    <th>Container Name</th>
                    <td>{container.name ? container.name : "-"}</td>
                  </tr>
                  <tr>
                    <th>Image</th>
                    <td>{container.image ? container.image : "-"}</td>
                  </tr>
                  <tr>
                    <th>Container Ports</th>
                    <td>
                      {container?.ports.containerPort ? (
                        container.ports?.map(port => (
                          <p>
                            {port.containerPort}/{port.protocol}
                          </p>
                        ))
                      ) : (
                        <p>-</p>
                      )}
                    </td>
                  </tr>

                  <tr>
                    <th>Environment</th>
                    <td>
                      {container.env.name ? (
                        <table className="tb_data">
                          <tbody>
                            <tr>
                              <th>Name</th>
                              <th>Value</th>
                              <th>Source</th>
                            </tr>
                            {container.env.map(item => (
                              <tr>
                                <td>{item.name ? item.name : "-"}</td>
                                <td>{item.value ? item.value : "-"}</td>
                                <td>{item.valueFrom?.fieldRef?.fieldPath ? item.valueFrom?.fieldRef?.fieldPath : "-"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        "No Env Info."
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th>Args</th>
                    <td>{container.args ? JSON.stringify(container.args) : "-"}</td>
                  </tr>
                  <tr>
                    <th>Volume Mounts</th>
                    <td>
                      {container.volumeMounts.length === 0 ? (
                        "No Volume Info."
                      ) : (
                        <table className="tb_data">
                          <tbody>
                            <tr>
                              <th>Name</th>
                              <th>Mount Path</th>
                              <th>Propagation</th>
                            </tr>
                            {container.volumeMounts.map(volume => (
                              <tr>
                                <td>{volume.name ? volume.name : "-"}</td>
                                <td>{volume.mountPath ? volume.mountPath : "-"}</td>
                                <td>-</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            ))
          ) : (
            <LabelContainer>
              <p>No Containers Info.</p>
            </LabelContainer>
          )}
        </div>
      </CTabPanel>
      <CTabPanel value={tabvalue} index={2}>
        <div className="tb_container">
          <TableTitle>Labels</TableTitle>
          <LabelContainer>
            {label != null ? (
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
          <TableTitle>Annotations</TableTitle>
          {annotations != null ? (
            <table className="tb_data" style={{ tableLayout: "fixed" }}>
              <tbody style={{ whiteSpace: "pre-line" }}>
                {Object.entries(annotations).map(([key, value]) => (
                  <tr>
                    <th style={{ width: "20%" }}>{key}</th>
                    <td>
                      {isValidJSON(value) ? (
                        <ReactJson src={JSON.parse(value)} theme="summerfruit" displayDataTypes={false} displayObjectSize={false} />
                      ) : (
                        value
                      )}
                    </td>
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
    </PanelBox>
  );
});
export default StatefulSetDetail;
