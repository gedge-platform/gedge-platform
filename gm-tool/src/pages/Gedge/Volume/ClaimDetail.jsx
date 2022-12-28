import React, { useState, useEffect } from "react";
import { PanelBox } from "@/components/styles/PanelBox";
import { CTabs, CTab, CTabPanel } from "@/components/tabs";
import { observer } from "mobx-react";
import ReactJson from "react-json-view";
import { isValidJSON } from "@/utils/common-utils";
import EventAccordion from "@/components/detail/EventAccordion";
import { claimStore } from "@/store";
import styled from "styled-components";

const TableTitle = styled.p`
  font-size: 14px;
  font-weight: 500;
  margin: 8px 0;
  color: rgba(255, 255, 255, 0.8);
`;
const TableSubTitle = styled.p`
  font-size: 12px;
  font-weight: 500;
  margin: 12px 0;
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

const ClaimDetail = observer(({ pvClaim1, metadata }) => {
  const [open, setOpen] = useState(false);
  const [tabvalue, setTabvalue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabvalue(newValue);
  };

  const { pvClaimLables, pvClaim, events, label } = claimStore;

  const annotationTable = [];

  Object.entries(metadata).map(([key, value]) => {
    annotationTable.push(
      <tr>
        <th className="tb_volume_detail_th">{key}</th>
        <td>{value}</td>
      </tr>,
    );
  });

  const metaTable = [];
  if (pvClaim?.annotations) {
    Object.entries(pvClaim?.annotations).map(([key, value]) => {
      metaTable.push(
        <tr>
          <th style={{ width: "20%" }}>{key}</th>
          <td>
            {isValidJSON(value) ? (
              <ReactJson src={JSON.parse(value)} theme="summerfruit" displayDataTypes={false} displayObjectSize={false} />
            ) : (
              value
            )}
          </td>
        </tr>,
      );
    });
  }

  return (
    <PanelBox style={{ overflowY: "scroll" }}>
      <CTabs type="tab2" value={tabvalue} onChange={handleTabChange}>
        <CTab label="Overview" />
        <CTab label="Metadata" />
        <CTab label="Events" />
        <CTab label="Finalizers" />
      </CTabs>
      <CTabPanel value={tabvalue} index={0}>
        <div className="panelCont">
          <table className="tb_data">
            <tbody className="tb_data_detail">
              <tr>
                <th>Claim Name</th>
                <td>{pvClaim.name ? pvClaim?.name : "-"}</td>
                <th>capacity</th>
                <td>{pvClaim?.capacity ? pvClaim?.capacity : "-"}</td>
              </tr>
              <tr>
                <th>namespace</th>
                <td>{pvClaim?.namespace ? pvClaim?.namespace : "-"}</td>
                <th>accessMode</th>
                <td>{pvClaim?.accessMode ? pvClaim?.accessMode : "-"}</td>
              </tr>
              <tr>
                <th>status</th>
                <td>{pvClaim?.status ? pvClaim?.status : "-"}</td>
                <th>volume Name</th>
                <td>{pvClaim?.volume ? pvClaim?.volume : "-"}</td>
              </tr>
              <tr>
                <th>cluster Name</th>
                <td>{pvClaim?.clusterName ? pvClaim?.clusterName : "-"}</td>
                <th>storageClass</th>
                <td>{pvClaim?.storageClass ? pvClaim?.storageClass : "-"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CTabPanel>
      <CTabPanel value={tabvalue} index={1}>
        <div className="panelCont">
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
          <TableTitle>Annotaions</TableTitle>
          <table className="tb_data">
            <tbody>{metaTable}</tbody>
          </table>
        </div>
      </CTabPanel>
      <CTabPanel value={tabvalue} index={2}>
        <EventAccordion events={events} />
      </CTabPanel>
      <CTabPanel value={tabvalue} index={3}>
        <div className="panelCont">
          <table className="tb_data">
            <tbody>
              <tr>
                <th className="tb_volume_detail_th">value</th>
                <td>{pvClaim?.finalizers}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CTabPanel>
    </PanelBox>
  );
});
export default ClaimDetail;
