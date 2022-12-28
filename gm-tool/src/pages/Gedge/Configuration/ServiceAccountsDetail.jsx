import React, { useState } from "react";
import { PanelBox } from "@/components/styles/PanelBox";
import { CTabs, CTab, CTabPanel } from "@/components/tabs";
import { observer } from "mobx-react";
import styled from "styled-components";
import { serviceAccountStore } from "@/store";
import { dateFormatter } from "@/utils/common-utils";

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

const ServiceAccountsDetail = observer(() => {
  const {
    serviceAccountDetail: { annotations, cluster, createAt, label, name, namespace, secretCnt, secrets },
  } = serviceAccountStore;

  console.log(secrets);
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
        <CTab label="Metadata" />
      </CTabs>
      <CTabPanel value={tabvalue} index={0}>
        <div className="tb_container">
          <table className="tb_data">
            <tbody>
              <tr>
                <th style={{ width: "15%" }}>Name</th>
                <td>{name}</td>
              </tr>
              <tr>
                <th>Created</th>
                <td>{dateFormatter(createAt)}</td>
              </tr>
            </tbody>
          </table>
          <br />

          <TableTitle>Secrets</TableTitle>
          <table className="tb_data">
            <tbody>
              <tr>
                <th style={{ width: "15%" }}>Secrets Name</th>
                <td style={{ whiteSpace: "pre-wrap" }}>{secrets !== null ? secrets.map(secret => secret.name + "\n") : <></>}</td>
              </tr>
              <tr>
                <th>Secrets Count</th>
                <td>{secretCnt}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CTabPanel>

      <CTabPanel value={tabvalue} index={1}>
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
              <p>No Annotations Info.</p>
            </LabelContainer>
          )}
          {/* <LabelContainer>
            {annotations ? (
              Object.entries(annotations).map(([key, value]) => (
                <tr>
                  <th style={{ width: "20%" }}>{key}</th>
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
              ))
            ) : (
              <p>No Annotations Info.</p>
            )}
          </LabelContainer> */}
        </div>
      </CTabPanel>
    </PanelBox>
  );
});
export default ServiceAccountsDetail;
