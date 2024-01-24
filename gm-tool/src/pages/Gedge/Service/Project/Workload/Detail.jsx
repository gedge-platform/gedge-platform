import React, { useState, useEffect } from "react";
import { PanelBox } from "@/components/styles/PanelBox";
import { CTabs, CTab, CTabPanel } from "@/components/tabs";
import styled from "styled-components";
import { deploymentStore } from "@/store";
import { observer } from "mobx-react";
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
    deploymentDetail,
    events,
    strategy,
    labels,
    annotations,
    pods,
    depServices,
    containersTemp,
  } = deploymentStore;

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

  let strategyTable = [];
  let strategyTemp = strategy;

  if (strategyTemp.type === "Recreate") {
    strategyTable = strategyTemp.type;
  } else if (strategyTemp.type === "RollingUpdate") {
    strategyTable =
      "maxUnavailable : " +
      strategyTemp.rollingUpdate.maxUnavailable +
      "\n" +
      "maxSurge : " +
      strategyTemp.rollingUpdate.maxSurge;
  }

  useEffect(() => {});

  return (
    <PanelBox>
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
              {deploymentDetail ? (
                <>
                  <tr>
                    <th className="tb_workload_detail_th">Name</th>
                    <td>
                      {deploymentDetail.name ? deploymentDetail.name : "-"}
                    </td>
                    <th className="tb_workload_detail_th">Cluster</th>
                    <td>
                      {deploymentDetail.cluster
                        ? deploymentDetail.cluster
                        : "-"}
                    </td>
                  </tr>
                  <tr>
                    <th>Project</th>
                    <td>
                      {deploymentDetail.project
                        ? deploymentDetail.project
                        : "-"}
                    </td>
                    <th>Workspace</th>
                    <td>
                      {deploymentDetail.workspace
                        ? deploymentDetail.workspace
                        : "-"}
                    </td>
                  </tr>
                  <tr>
                    <th>Status</th>
                    <td>
                      {deploymentDetail.ready ? deploymentDetail.ready : "-"}
                    </td>
                    <th>Strategy</th>
                    <td style={{ whiteSpace: "pre-line" }}>{strategyTable}</td>
                  </tr>
                  <tr>
                    <th>Created</th>
                    <td>{dateFormatter(deploymentDetail.createAt)}</td>
                    <th>Updated</th>
                    <td>{dateFormatter(deploymentDetail.updateAt)}</td>
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
      <CTabPanel value={tabvalue} index={1}>
        <div className="tb_container">
          <TableTitle>Containers</TableTitle>
          {containersTemp ? (
            containersTemp.map((containers) => (
              <table className="tb_data" style={{ tableLayout: "fixed" }}>
                <tbody className="tb_data_container">
                  <tr>
                    <th>Container Name</th>
                    <td>{containers?.name}</td>
                  </tr>
                  <tr>
                    <th>Image</th>
                    <td>{containers?.image}</td>
                  </tr>
                  <tr>
                    <th>ImagePullPolicy</th>
                    <td>{containers?.imagePullPolicy}</td>
                  </tr>

                  <tr>
                    <th>Environment</th>
                    <td>
                      {containers?.env === undefined ? (
                        <>-</>
                      ) : (
                        <table className="tb_data">
                          <tbody>
                            <tr>
                              <th style={{ width: "33%" }}>Name</th>
                              <th style={{ width: "33%" }}>Value</th>
                              <th style={{ width: "33%" }}>Source</th>
                            </tr>
                            {containers.env.map((env) => (
                              <tr>
                                <td>{env.name}</td>
                                <td>{env.value}</td>
                                <td>{env.valueFrom?.fieldRef?.fieldPath}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th>Args</th>
                    <td>
                      {containers.args ? (
                        JSON.stringify(containers.args)
                      ) : (
                        <>-</>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th>Ports</th>
                    <td>
                      {containers.ports === undefined ? (
                        <>-</>
                      ) : (
                        <table className="tb_data">
                          <tbody>
                            <tr>
                              <th style={{ width: "50%" }}>ContainerPort</th>
                              <th style={{ width: "50%" }}>Protocol</th>
                            </tr>
                            {containers.ports?.map((port) => (
                              <tr>
                                <td>{port.containerPort}</td>
                                <td>{port.protocol}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </td>
                  </tr>
                  {/* <tr>
                  <th>Resources</th>
                  <td>
                    <table className="tb_data">
                      <tbody>
                        <tr>
                          <th style={{ width: "50%" }}>Limits</th>
                        </tr>
                        <tr>
                          <td>
                            {Object.entries(containers?.resources).map(
                              ([key, value]) =>
                                Object.entries(value).map(([key1, value1]) => (
                                  <tr>
                                    <th>{key1}</th>
                                    <td>{value1}</td>
                                  </tr>
                                ))
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr> */}
                  {/* <tr>
                  <th>SecurityContext</th>
                  <td>
                  {containers?.securityContext === undefined ? (
                      <>-</>
                    ) : (
                      Object.entries(containers?.securityContext).map(
                        ([key, value]) => (
                          <table className="tb_data" style={{ width: "30%" }}>
                            <tbody>
                              <tr>
                                <th>{key}</th>
                              </tr>
                              <tr>
                                <td>{value}</td>
                              </tr>
                            </tbody>
                          </table>
                        )
                      )
                    )}
                  </td>
                </tr> */}

                  <tr>
                    <th>VolumeMounts</th>
                    <td>
                      {containers.volumeMounts ? (
                        <table className="tb_data">
                          <tbody>
                            <tr>
                              <th style={{ width: "33%" }}>Name</th>
                              <th style={{ width: "33%" }}>MountPath</th>
                              <th style={{ width: "33%" }}>Propagation</th>
                            </tr>
                            {containers.volumeMounts?.map((vol) => (
                              <tr>
                                <td>{vol.name}</td>
                                <td>{vol.mountPath}</td>
                                <td></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <>-</>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            ))
          ) : (
            <LabelContainer>
              <p>No Resources Info</p>
            </LabelContainer>
          )}
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
              <tbody>
                {Object.entries(annotations).map(([key, value]) => (
                  <tr>
                    <th className="tb_workload_detail_labels_th">{key}</th>
                    <td>{value}</td>
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
            pods?.map((pod) => (
              <>
                <table className="tb_data">
                  <tbody className="tb_workload_detail_th">
                    <tr>
                      <th>Name</th>
                      <td>{pod?.name ? pod?.name : "-"}</td>

                      <th>Status</th>
                      <td>{pod?.status ? pod?.status : "-"}</td>
                    </tr>
                    <tr>
                      <th>Node</th>
                      <td>{pod?.node === "" ? <>-</> : <>{pod?.node}</>}</td>

                      <th>Restarts</th>
                      <td>{pod?.restart ? pod?.restart : "-"}</td>
                    </tr>
                  </tbody>
                </table>
              </>
            ))
          ) : (
            <LabelContainer>
              <p>No Pod Info</p>
            </LabelContainer>
          )}

          <TableTitle>Service</TableTitle>
          {depServices.name === "" ? (
            <>
              <LabelContainer>
                <p>No Service Info</p>
              </LabelContainer>
            </>
          ) : (
            <>
              <table className="tb_data" style={{ tableLayout: "fixed" }}>
                <tbody>
                  <tr>
                    <th style={{ width: "25%" }}>Name</th>
                    <td>{depServices?.name}</td>
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
                          {depServices.port?.map((port) => (
                            <tr>
                              <td>
                                {port.name === undefined ? (
                                  <>-</>
                                ) : (
                                  <>{port?.name}</>
                                )}
                              </td>
                              <td>{port.port ? port.port : "-"}</td>
                              <td>{port.protocol ? port.protocol : "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </>
          )}
        </div>
      </CTabPanel>
    </PanelBox>
  );
});

export default Detail;
