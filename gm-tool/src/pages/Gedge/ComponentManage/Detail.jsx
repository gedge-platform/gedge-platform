import React, { useState, useEffect } from "react";
import { PanelBox } from "@/components/styles/PanelBox";
import { CTabs, CTab, CTabPanel } from "@/components/tabs";
import { observer } from "mobx-react";
import styled from "styled-components";

const TableTitle = styled.p`
  font-size: 16px;
  font-weight: 500;
  margin: 8px 0;
  color: rgba(255, 255, 255, 0.8);
`;

const Detail = observer((props) => {
  const { project } = props;
  const [open, setOpen] = useState(false);
  const [tabvalue, setTabvalue] = useState(1);

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
        <CTab label="리소스 상태" />
        <CTab label="메타데이터" />
      </CTabs>
      <CTabPanel value={tabvalue} index={0}>
        <div className="tb_container">
          <table className="tb_data">
            <tbody>
              <tr>
                <th>디플로이먼트</th>
                <td></td>
                <th>파드</th>
                <td></td>
              </tr>
              <tr>
                <th>서비스</th>
                <td></td>
                <th>크론잡</th>
                <td></td>
              </tr>
              <tr>
                <th>잡</th>
                <td></td>
                <th>볼륨</th>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </CTabPanel>
      <CTabPanel value={tabvalue} index={1}>
        <div className="tb_container">
          <TableTitle>라벨</TableTitle>
          <table className="tb_data">
            <tbody>
              <tr>
                <th>key</th>
                <th>Value</th>
              </tr>
              <tr>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
          <TableTitle>어노테이션</TableTitle>
          <table className="tb_data">
            <tbody>
              <tr>
                <th>key</th>
                <th>Value</th>
              </tr>
              <tr>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </CTabPanel>
    </PanelBox>
  );
});

export default Detail;

/*
    <PanelBox>
      <CTabs type="tab2" value={tabvalue} onChange={handleTabChange}>
        <CTab label="상세정보" />
        <CTab label="노드 정보" />
        <CTab label="채널 정보" />
      </CTabs>
      <div className="tabPanelContainer">
        <CTabPanel value={tabvalue} index={0}>
          <div className="tb_container">
            <table className="tb_data">
              <tbody>
                <tr>
                  <th>네트워크 이름</th>
                  <td>OOO 조회</td>
                  <th>조직ID</th>
                  <td>JSON</td>
                </tr>
                <tr>
                  <th>Import 여부</th>
                  <td colSpan={1}>N</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="tb_container">
            <table className="tb_data">
              <tbody>
                <tr>
                  <th>Node Type</th>
                  <th>Node 이름</th>
                  <th>상태</th>
                </tr>
                <tr>
                  <td>CA</td>
                  <td>block-ca</td>
                  <td>운영 중</td>
                </tr>
                <tr>
                  <td>Peer(Endorser)</td>
                  <td>block-peer1(Committer)</td>
                  <td>운영 중</td>
                </tr>
                <tr>
                  <td>Peer</td>
                  <td>block-peer2</td>
                  <td>운영 중</td>
                </tr>
                <tr>
                  <td>Peer</td>
                  <td>block-peer3</td>
                  <td>운영 중</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="tb_container">
            <table className="tb_data">
              <tbody>
                <tr>
                  <th>조직 이름</th>
                  <th>채널 이름</th>
                </tr>
                <tr>
                  <td>block-orderer</td>
                  <td>my-block-channel-1</td>
                </tr>
                <tr>
                  <td>block-orderer</td>
                  <td>my-block-channel-2</td>
                </tr>
                <tr>
                  <td>block-orderer</td>
                  <td>my-block-channel-3</td>
                </tr>
                <tr>
                  <td>block-orderer</td>
                  <td>my-block-channel-4</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CTabPanel>
        <CTabPanel value={tabvalue} index={1}>
          <div className="panelCont">
            <div className="grid-height">
              <table className="tb_data">
                <tbody>
                  <tr>
                    <th>Node Type</th>
                    <th>Node 이름</th>
                    <th>상태</th>
                  </tr>
                  <tr>
                    <td>CA</td>
                    <td>block-ca</td>
                    <td>운영 중</td>
                  </tr>
                  <tr>
                    <td>Peer(Endorser)</td>
                    <td>block-peer1(Committer)</td>
                    <td>운영 중</td>
                  </tr>
                  <tr>
                    <td>Peer</td>
                    <td>block-peer2</td>
                    <td>운영 중</td>
                  </tr>
                  <tr>
                    <td>Peer</td>
                    <td>block-peer3</td>
                    <td>운영 중</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </CTabPanel>
        <CTabPanel value={tabvalue} index={2}>
          <div className="panelCont">
            <div className="grid-height">
              <table className="tb_data">
                <tbody>
                  <tr>
                    <th>조직 이름</th>
                    <th>채널 이름</th>
                  </tr>
                  <tr>
                    <td>block-orderer</td>
                    <td>my-block-channel-1</td>
                  </tr>
                  <tr>
                    <td>block-orderer</td>
                    <td>my-block-channel-2</td>
                  </tr>
                  <tr>
                    <td>block-orderer</td>
                    <td>my-block-channel-3</td>
                  </tr>
                  <tr>
                    <td>block-orderer</td>
                    <td>my-block-channel-4</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </CTabPanel>
      </div>
    </PanelBox>
*/
