import React, { useState } from "react";
import { PanelBox } from "@/components/styles/PanelBox";
import { CTabs, CTab, CTabPanel } from "@/components/tabs";
import styled from "styled-components";
import { observer } from "mobx-react";
import { daemonSetStore } from "@/store";
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
    daemonSetDetail,
    label,
    annotations,
    events,
    pods,
    services,
    containers,
  } = daemonSetStore;
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
          <table className="tb_data" style={{ tableLayout: "fixed" }}>
            <tbody>
              {daemonSetDetail.length !== 0 ? (
                <>
                  <tr>
                    <th className="tb_workload_detail_th">Name</th>
                    <td>{daemonSetDetail.name ? daemonSetDetail.name : "-"}</td>
                    <th className="tb_workload_detail_th">Cluster</th>
                    <td>
                      {daemonSetDetail.cluster ? daemonSetDetail.cluster : "-"}
                    </td>
                  </tr>
                  <tr>
                    <th>Project</th>
                    <td>
                      {daemonSetDetail.project ? daemonSetDetail.project : "-"}
                    </td>
                    <th>Created</th>
                    <td>
                      {daemonSetDetail.createAt
                        ? dateFormatter(daemonSetDetail.createAt)
                        : "-"}
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
          <TableTitle>Containers</TableTitle>
          {containers.length !== 0 ? (
            containers.map((container) => (
              <>
                <table className="tb_data" style={{ tableLayout: "fixed" }}>
                  <tbody className="tb_workload_pod_detail">
                    <tr>
                      <th>Container Name</th>
                      <td>{container.name ? container.name : "-"}</td>
                    </tr>
                    <tr>
                      <th>Args</th>
                      <td>
                        {container.args ? (
                          JSON.stringify(container.args)
                        ) : (
                          <>-</>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th>Command</th>
                      <td>
                        {container.command ? (
                          JSON.stringify(container.command)
                        ) : (
                          <>-</>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th>Environment</th>
                      <td>
                        <table
                          className="tb_data"
                          style={{ tableLayout: "fixed" }}
                        >
                          <tbody className="tb_workload_pod_detail">
                            <tr>
                              <th>Name</th>
                              <th>Value</th>
                              <th>Source</th>
                            </tr>
                            {container.env ? (
                              container.env?.map((env) => (
                                <>
                                  <tr>
                                    <td>{env.name ? env.name : "-"}</td>
                                    <td>{env.value ? env.value : "-"}</td>
                                    <td>
                                      {env.valueFrom?.fieldRef?.fieldPath
                                        ? env.valueFrom?.fieldRef?.fieldPath
                                        : "-"}
                                    </td>
                                  </tr>
                                </>
                              ))
                            ) : (
                              <tr>
                                <td>-</td>
                                <td>-</td>
                                <td>-</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <th>Image</th>
                      <td>{container.image ? container.image : "-"}</td>
                    </tr>
                    <tr>
                      <th>volumeMounts</th>
                      <td>
                        <table
                          className="tb_data"
                          style={{ tableLayout: "fixed" }}
                        >
                          <tbody className="tb_workload_pod_detail">
                            <tr>
                              <th>Name</th>
                              <th>Mount Path</th>
                              <th>Propagation</th>
                            </tr>
                            {container.volumeMounts ? (
                              container.volumeMounts.map((volume) => (
                                <tr>
                                  <td>{volume.name ? volume.name : "-"}</td>
                                  <td>
                                    {volume.mountPath ? volume.mountPath : "-"}
                                  </td>
                                  <td></td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td>-</td>
                                <td>-</td>
                                <td>-</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </>
            ))
          ) : (
            <LabelContainer>
              <p>No Containers Info</p>
            </LabelContainer>
          )}
        </div>
      </CTabPanel>
      <CTabPanel value={tabvalue} index={2}>
        <div className="tb_container">
          <TableTitle>Labels</TableTitle>
          <LabelContainer>
            {label.length !== 0 ? (
              Object.entries(label).map(([key, value]) => (
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
      <CTabPanel value={tabvalue} index={4}>
        <div className="tb_container">
          <TableTitle>Pod</TableTitle>
          {pods ? (
            pods.length !== 0 ? (
              pods.map((item) => (
                <>
                  <table className="tb_data" style={{ tableLayout: "fixed" }}>
                    <tbody className="tb_workload_pod_detail">
                      <tr>
                        <th>Name</th>
                        <td>{item.name ? item.name : "-"}</td>
                      </tr>
                      <tr>
                        <th>Node</th>
                        <td>{item.node ? item.node : "-"}</td>
                      </tr>
                      <tr>
                        <th>Pod IP</th>
                        <td>{item.podIP ? item.podIP : "-"}</td>
                      </tr>
                      <tr>
                        <th>Status</th>
                        <td>{item.status ? item.status : "-"}</td>
                      </tr>
                      <tr>
                        <th>Restart</th>
                        <td>{item.restart ? item.restart : "-"}</td>
                      </tr>
                    </tbody>
                  </table>
                  <br />
                </>
              ))
            ) : (
              <LabelContainer>
                <p>No Pod Info</p>
              </LabelContainer>
            )
          ) : (
            <LabelContainer>
              <p>No Pod Info</p>
            </LabelContainer>
          )}
          <TableTitle>Service</TableTitle>

          {services.name ? (
            <table className="tb_data" style={{ tableLayout: "fixed" }}>
              <tbody className="tb_workload_pod_detail">
                <tr>
                  <th>Name</th>
                  <td>{services.name ? services.name : "-"}</td>
                </tr>
                <tr>
                  <th>Port</th>
                  <td>
                    <table className="tb_data">
                      <tbody className="tb_services_detail_th">
                        <tr>
                          <th>Name</th>
                          <th>Port</th>
                          <th>Protocol</th>
                        </tr>
                        {services?.port ? (
                          services.port?.map((port) => (
                            <tr>
                              <td>{port.name}</td>
                              <td>{port.port}</td>
                              <td>{port.protocol}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          ) : (
            <LabelContainer>
              <p>No Service Info</p>
            </LabelContainer>
          )}
        </div>
      </CTabPanel>
    </PanelBox>
  );
});

export default Detail;
