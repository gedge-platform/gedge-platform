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

const VolumeDetail = observer(({ pVolume1, metadata }) => {
  const [open, setOpen] = useState(false);
  const [tabvalue, setTabvalue] = useState(0);

  const { pVolume, events, annotations, annotationsTmp } = volumeStore;

  const handleTabChange = (event, newValue) => {
    setTabvalue(newValue);
  };
  // const labelTable = [];

  // metadata
  //   ? Object.entries(metadata).map(([key, value]) => {
  //       labelTable.push(
  //         <tr>
  //           <th>{key}</th>
  //           <td>{value}</td>
  //         </tr>
  //       );
  //     })
  //   : null;

  // const metaTable = () => {
  //   if (annotationsTmp === null) {
  //     return (
  //       <LabelContainer>
  //         <p>No Annotations Info</p>
  //       </LabelContainer>
  //     );
  //   } else {
  //     return Object.entries(annotationsTmp).map(([key, value]) => {
  //       metaTable.push(
  //         <tr>
  //           <th style={{ width: "20%" }}>{key}</th>
  //           <td>
  //             {isValidJSON(value) ? (
  //               <ReactJson
  //                 src={JSON.parse(value)}
  //                 theme="summerfruit"
  //                 displayDataTypes={false}
  //                 displayObjectSize={false}
  //               />
  //             ) : (
  //               value
  //             )}
  //           </td>
  //         </tr>
  //       );
  //     });
  //   }
  // };

  const metaTable = [];
  if (annotationsTmp) {
    Object.entries(annotationsTmp).map(([key, value]) => {
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
        <CTab label="Claim Info" />
        <CTab label="Annotations" />
        <CTab label="Events" />
      </CTabs>
      <CTabPanel value={tabvalue} index={0}>
        <div className="panelCont">
          {pVolume ? (
            pVolume.length !== 0 ? (
              <table className="tb_data">
                <tbody className="tb_data_detail">
                  <tr>
                    <th>Name</th>
                    <td>{pVolume.name ? pVolume.name : "-"}</td>
                    <th>Capacity</th>
                    <td>{pVolume.capacity ? pVolume.capacity : "-"}</td>
                  </tr>
                  <tr>
                    <th>AccessMode</th>
                    <td>{pVolume.accessMode ? pVolume.accessMode : "-"}</td>
                    <th>ReclaimPolicy</th>
                    <td>
                      {pVolume.reclaimPolicy ? pVolume.reclaimPolicy : "-"}
                    </td>
                  </tr>
                  <tr>
                    <th>Status</th>
                    <td>{pVolume.status ? pVolume.status : "-"}</td>
                    <th>Claim</th>
                    <td>{pVolume?.claim?.name ? pVolume?.claim?.name : "-"}</td>
                  </tr>
                  <tr>
                    <th>Cluster</th>
                    <td>{pVolume.cluster ? pVolume.cluster : "-"}</td>
                    <th>StorageClass</th>
                    <td>{pVolume.storageClass ? pVolume.storageClass : "-"}</td>
                  </tr>
                  <tr>
                    <th>VolumeMode</th>
                    <td>{pVolume.volumeMode ? pVolume.volumeMode : "-"}</td>
                    <th>Created</th>
                    <td>
                      {pVolume.createAt
                        ? dateFormatter(pVolume?.createAt)
                        : "-"}
                    </td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <LabelContainer>
                <p>No Detail Info</p>
              </LabelContainer>
            )
          ) : (
            <LabelContainer>
              <p>No Datail Info</p>
            </LabelContainer>
          )}
        </div>
      </CTabPanel>
      <CTabPanel value={tabvalue} index={1}>
        <div className="panelCont">
          {pVolume ? (
            pVolume.length !== 0 ? (
              <table className="tb_data">
                <tbody className="tb_data_detail">
                  <tr>
                    <th className="tb_volume_detail_th">Name</th>
                    <td>{pVolume?.claim?.name ? pVolume?.claim?.name : "-"}</td>
                    <th className="tb_volume_detail_th">Namespace</th>
                    <td>
                      {pVolume?.claim?.namespace
                        ? pVolume?.claim?.namespace
                        : "-"}
                    </td>
                  </tr>
                  <tr>
                    <th>Kind</th>
                    <td>{pVolume?.claim?.kind ? pVolume?.claim?.kind : "-"}</td>
                    <th>ApiVersion</th>
                    <td>
                      {pVolume?.claim?.apiVersion
                        ? pVolume?.claim?.apiVersion
                        : "-"}
                    </td>
                  </tr>
                  <tr>
                    <th>ResourceVersion</th>
                    <td>
                      {pVolume?.claim?.resourceVersion
                        ? pVolume?.claim?.resourceVersion
                        : "-"}
                    </td>
                    <th>Uid</th>
                    <td>{pVolume?.claim?.uid ? pVolume?.claim?.uid : "-"}</td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <LabelContainer>
                <p>No Claim Info</p>
              </LabelContainer>
            )
          ) : (
            <LabelContainer>
              <p>No Claim Info</p>
            </LabelContainer>
          )}
        </div>
      </CTabPanel>
      <CTabPanel value={tabvalue} index={2}>
        <div className="panelCont">
          {metaTable.length !== 0 ? (
            <table className="tb_data">
              <tbody>{metaTable}</tbody>
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
    </PanelBox>
  );
});
export default VolumeDetail;
