import React, { useState } from "react";
import { PanelBox } from "@/components/styles/PanelBox";
import { CTabs, CTab, CTabPanel } from "@/components/tabs";
import { observer } from "mobx-react";
import secretStore from "../../../store/Secret";
import styled from "styled-components";
import EventAccordion from "@/components/detail/EventAccordion";
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

const SecretDetail = observer(() => {
  const { secretTabList, events, data, label, annotations } = secretStore;
  const secretTable = [];
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

  Object.entries(data).map(([keys, value]) => {
    secretTable.push(
      <tr>
        <th style={{ width: "15%" }}>{keys}</th>
        <td style={{ wordBreak: "break-all", wordWrap: "break-word" }}>
          {/* 강제로 줄바꿈 */}
          {value}
        </td>
      </tr>
    );
  });

  return (
    <PanelBox style={{ overflowY: "hidden" }}>
      <CTabs type="tab2" value={tabvalue} onChange={handleTabChange}>
        <CTab label="Overview" />
        <CTab label="Metadata" />
        <CTab label="Events" />
      </CTabs>
      <CTabPanel value={tabvalue} index={0}>
        <div className="tb_container">
          <table className="tb_data">
            <tbody>
              <tr>
                <th style={{ width: "15%" }}>Name</th>
                <td>{secretTabList.name}</td>
              </tr>
              <tr>
                <th>Type</th>
                <td>{secretTabList.type}</td>
              </tr>
              <tr>
                <th>Created</th>
                <td>{dateFormatter(secretTabList.createAt)}</td>
              </tr>
            </tbody>
          </table>
          <br />
          <TableTitle>Data</TableTitle>
          <table className="tb_data">
            <tbody>{secretTable}</tbody>
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
      <CTabPanel value={tabvalue} index={2}>
        <EventAccordion events={events} />
      </CTabPanel>
    </PanelBox>
  );
});
export default SecretDetail;
