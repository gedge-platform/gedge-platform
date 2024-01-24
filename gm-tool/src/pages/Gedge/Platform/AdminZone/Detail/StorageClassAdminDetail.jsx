import React, { useState } from "react";
import { PanelBox } from "@/components/styles/PanelBox";
import { CTabs, CTab, CTabPanel } from "@/components/tabs";
import { observer } from "mobx-react";
import ReactJson from "react-json-view";
import {
  agDateColumnFilter,
  dateFormatter,
  isValidJSON,
  nullCheck,
} from "@/utils/common-utils";
import styled from "styled-components";
import { StorageClassStore } from "@/store";

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

const StorageClassAdminDetail = observer(({}) => {
  const [open, setOpen] = useState(false);
  const [tabvalue, setTabvalue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabvalue(newValue);
  };

  const { storageClass, annotations, label, scParameters } = StorageClassStore;

  const metaTable = [];
  if (storageClass?.annotations) {
    Object.entries(storageClass?.annotations).map(([key, value]) => {
      metaTable.push(
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
      );
    });
  }

  return (
    <PanelBox style={{ overflowY: "scroll" }}>
      <CTabs type="tab2" value={tabvalue} onChange={handleTabChange}>
        <CTab label="Overview" />
        <CTab label="Metadata" />
        <CTab label="Parameters" />
      </CTabs>
      <CTabPanel value={tabvalue} index={0}>
        <div className="panelCont">
          <table className="tb_data">
            <tbody className="tb_data_detail">
              {storageClass ? (
                <>
                  <tr>
                    <th>Name</th>
                    <td>{storageClass?.name ? storageClass?.name : "-"}</td>
                    <th>Cluster Name</th>
                    <td>
                      {storageClass?.cluster ? storageClass?.cluster : "-"}
                    </td>
                  </tr>
                  <tr>
                    <th>Reclaim Policy</th>
                    <td>
                      {storageClass?.reclaimPolicy
                        ? storageClass?.reclaimPolicy
                        : "-"}
                    </td>
                    <th>Provisioner</th>
                    <td>
                      {storageClass?.provisioner
                        ? storageClass?.provisioner
                        : "-"}
                    </td>
                  </tr>
                  <tr>
                    <th>VolumeBindingMode</th>
                    <td>
                      {storageClass?.volumeBindingMode
                        ? storageClass?.volumeBindingMode
                        : "-"}
                    </td>
                    {/* <th>AllowVolumeExpansion</th>
                <td>
                  {storageClass?.allowVolumeExpansion
                    ? storageClass?.allowVolumeExpansion
                    : "-"}
                </td> */}
                    <th>Created</th>
                    <td>
                      {storageClass?.createAt
                        ? dateFormatter(storageClass?.createAt)
                        : "-"}
                    </td>
                  </tr>
                  {/* <tr>
              <th>{null}</th>
              <td>{null}</td>
            </tr> */}
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
              <p>No Labels Info</p>
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
              <p>No Annotations Info</p>
            </LabelContainer>
          )}
          <br />
        </div>
      </CTabPanel>
      <CTabPanel value={tabvalue} index={2}>
        <div className="tb_container">
          {scParameters !== "" ? (
            <table className="tb_data" style={{ tableLayout: "fixed" }}>
              <tbody style={{ whiteSpace: "pre-line" }}>
                {Object.entries(scParameters).map(([key, value]) => (
                  <tr>
                    <th className="tb_workload_detail_labels_th">{key}</th>
                    <td style={{ whiteSpace: "pre-line" }}>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <LabelContainer>
              <p>No parameters Info</p>
            </LabelContainer>
          )}
        </div>
      </CTabPanel>
      {/* <CTabPanel value={tabvalue} index={3}>
        <div className="panelCont">
          <table className="tb_data">
            <tbody>
              <tr>
                <th className="tb_volume_detail_th">value</th>
                <td>{storageClass?.finalizers}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CTabPanel> */}
    </PanelBox>
  );
});

export default StorageClassAdminDetail;
