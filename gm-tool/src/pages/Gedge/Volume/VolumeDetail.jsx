import React, { useState, useEffect } from "react";
import { PanelBox } from "@/components/styles/PanelBox";
import { CTabs, CTab, CTabPanel } from "@/components/tabs";
import { observer } from "mobx-react";
import ReactJson from "react-json-view";
import { isValidJSON } from "@/utils/common-utils";
import EventAccordion from "@/components/detail/EventAccordion";
import { volumeStore } from "@/store";
import styled from "styled-components";
import { dateFormatter } from "@/utils/common-utils";

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

const VolumeDetail = observer(({ pVolume1, metadata }) => {
  const [open, setOpen] = useState(false);
  const [tabvalue, setTabvalue] = useState(0);

  const { pVolume, events, annotations } = volumeStore;
  const handleTabChange = (event, newValue) => {
    setTabvalue(newValue);
  };
  const labelTable = [];

  metadata
    ? Object.entries(metadata).map(([key, value]) => {
        labelTable.push(
          <tr>
            <th>{key}</th>
            <td>{value}</td>
          </tr>,
        );
      })
    : null;

  const metaTable = () => {
    console.log(annotations);
    if (annotations === null) {
      return (
        <LabelContainer>
          <p>No Annotations Info.</p>
        </LabelContainer>
      );
    } else {
      return Object.entries(annotations).map(([key, value]) => {
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
  };

  useEffect(() => {});

  return (
    <PanelBox>
      <CTabs type="tab2" value={tabvalue} onChange={handleTabChange}>
        <CTab label="Overview" />
        <CTab label="Claim Info" />
        <CTab label="Annotations" />
        <CTab label="Events" />
      </CTabs>
      <CTabPanel value={tabvalue} index={0}>
        <div className="panelCont">
          <table className="tb_data">
            <tbody className="tb_data_detail">
              <tr>
                <th>name</th>
                <td>{pVolume ? pVolume.name : "-"}</td>
                <th>capacity</th>
                <td>{pVolume ? pVolume.capacity : "-"}</td>
              </tr>
              <tr>
                <th>accessMode</th>
                <td>{pVolume ? pVolume.accessMode : "-"}</td>
                <th>reclaimPolicy</th>
                <td>{pVolume ? pVolume.reclaimPolicy : "-"}</td>
              </tr>
              <tr>
                <th>status</th>
                <td>{pVolume ? pVolume.status : "-"}</td>
                <th>claim</th>
                <td>{pVolume ? pVolume?.claim?.name : "-"}</td>
              </tr>
              <tr>
                <th>cluster</th>
                <td>{pVolume ? pVolume.cluster : "-"}</td>
                <th>storageClass</th>
                <td>{pVolume ? pVolume.storageClass : "-"}</td>
              </tr>
              <tr>
                <th>volumeMode</th>
                <td>{pVolume ? pVolume.volumeMode : "-"}</td>
                <th>created</th>
                <td>{pVolume ? dateFormatter(pVolume?.createAt) : "-"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CTabPanel>
      <CTabPanel value={tabvalue} index={1}>
        <div className="panelCont">
          <table className="tb_data">
            <tbody className="tb_data_detail">
              <tr>
                <th className="tb_volume_detail_th">name</th>
                <td>{pVolume?.claim?.name ? pVolume?.claim?.name : "-"}</td>
                <th className="tb_volume_detail_th">namespace</th>
                <td>{pVolume?.claim?.namespace ? pVolume?.claim?.namespace : "-"}</td>
              </tr>
              <tr>
                <th>kind</th>
                <td>{pVolume?.claim?.kind ? pVolume?.claim?.kind : "-"}</td>
                <th>apiVersion</th>
                <td>{pVolume?.claim?.apiVersion ? pVolume?.claim?.apiVersion : "-"}</td>
              </tr>
              <tr>
                <th>resourceVersion</th>
                <td>{pVolume?.claim?.resourceVersion ? pVolume?.claim?.resourceVersion : "-"}</td>
                <th>uid</th>
                <td>{pVolume?.claim?.uid ? pVolume?.claim?.uid : "-"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CTabPanel>
      <CTabPanel value={tabvalue} index={2}>
        <div className="panelCont">
          <table className="tb_data">
            <tbody>{metaTable()}</tbody>
          </table>
        </div>
      </CTabPanel>
      <CTabPanel value={tabvalue} index={3}>
        <EventAccordion events={events} />
      </CTabPanel>
    </PanelBox>
  );
});
export default VolumeDetail;
