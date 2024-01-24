import React, { useState } from "react";
import { PanelBox } from "@/components/styles/PanelBox";
import { CTabs, CTab, CTabPanel } from "@/components/tabs";
import { observer } from "mobx-react";
import { configmapsStore } from "@/store";
import styled from "styled-components";
import { dateFormatter, isValidJSON } from "@/utils/common-utils";
import ReactJson from "react-json-view";

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

const ConfigmapsAdminDetail = observer(() => {
  const { configmapsTabList } = configmapsStore;

  const dataTable = [];
  const metadata = configmapsTabList.data;

  const annotationsTable = [];
  const annotations = configmapsTabList.annotations;

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

  // Object.entries(metadata).map(([key, value]) => {
  //   dataTable.push(
  //     <tr>
  //       <th style={{ width: "15%" }}>{key}</th>
  //       <td>{value}</td>
  //     </tr>
  //   );
  // });

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
              {configmapsTabList ? (
                <>
                  <tr>
                    <th style={{ width: "15%" }}>Name</th>
                    <td>
                      {configmapsTabList.name ? configmapsTabList.name : "-"}
                    </td>
                  </tr>
                  <tr>
                    <th>Data Count</th>
                    <td>
                      {configmapsTabList.dataCnt
                        ? configmapsTabList.dataCnt
                        : "-"}
                    </td>
                  </tr>
                  <tr>
                    <th>Created</th>
                    <td>
                      {configmapsTabList.createAt
                        ? dateFormatter(configmapsTabList.createAt)
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
          <br />
          <TableTitle>Data</TableTitle>
          {metadata ? (
            <table className="tb_data">
              <tbody
                className="tb_data_detail"
                style={{ whiteSpace: "pre-line" }}
              >
                {Object.entries(metadata).map(([key, value]) => (
                  <tr>
                    <th style={{ width: "5%" }}>{key}</th>
                    <td
                      style={{ wordBreak: "break-all", wordWrap: "break-word" }}
                    >
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <LabelContainer>
              <p>No Data Info</p>
            </LabelContainer>
          )}
          {/* <table className="tb_data">
            <tbody>
              {dataTable ? (
                dataTable
              ) : (
                <LabelContainer>
                  <p>No Data Info</p>
                </LabelContainer>
              )}
            </tbody>
          </table> */}
          <br />
        </div>
      </CTabPanel>
      <CTabPanel value={tabvalue} index={1}>
        <div className="tb_container" style={{ width: "95%" }}>
          <TableTitle>Annotations</TableTitle>
          {/* {annotationsTable.length > 0 ? ( */}
          {annotations ? (
            <table className="tb_data" style={{ tableLayout: "fixed" }}>
              <tbody>
                {Object.entries(annotations).map(([key, value]) => (
                  <tr>
                    <th className="tb_workload_detail_labels_th">{key}</th>
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
    </PanelBox>
  );
});
export default ConfigmapsAdminDetail;
