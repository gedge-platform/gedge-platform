import React, { useState, useEffect, useLayoutEffect } from "react";
import Layout from "@/layout";
import { Title } from "@/pages";
import { PanelBox } from "@/components/styles/PanelBox";
import { CReflexBox } from "@/layout/Common/CReflexBox";
import { useHistory } from "react-router";
import { observer } from "mobx-react";
import styled from "styled-components";
import Detail from "@/pages/Gedge/Platform/Detail";
import clusterStore from "@/store/Cluster";

const StoragePageWrap = styled.div`
  padding: 0 10px;
  .panel_summary {
    width: 100%;
    margin-bottom: 12px;
    background: #202842;
    border: 0;
    border-radius: 8px;
    &::before {
      display: none;
    }
  }
  .panel_table {
    width: 100%;
    padding: 10px;
    background: #202842;
    border: 0;
    border-radius: 8px;
  }
`;

const StorageDashboard = () => {
  const currentPageTitle = Title.StorageDashboard;

  const [tabvalue, setTabvalue] = useState(0);
  const handleTabChange = (event, newValue) => {
    setTabvalue(newValue);
  };

  const { clusterDetail, loadClusterList } = clusterStore;

  const history = useHistory();

  useLayoutEffect(() => {
    loadClusterList("edge");
  }, []);

  return (
    <Layout currentPageTitle={currentPageTitle}>
      <StoragePageWrap>
        <PanelBox className="panel_summary">
          <div className="storageBoxWrap">
            <div className="storageBox">
              <div className="storageBoxTitle">HEALTH_OK</div>
              <div className="storageBoxTxt">Cluster Status</div>
            </div>

            <div className="storageBox">
              <div className="storageBoxTitle">3 up, 3 in / 3 total</div>
              <div className="storageBoxTxt">Hosts</div>
            </div>

            <div className="storageBox">
              <div className="storageBoxTitle">11</div>
              <div className="storageBoxTxt">Pools</div>
            </div>

            <div className="storageBox">
              <div className="storageBoxTitle">177</div>
              <div className="storageBoxTxt">PGs per OSD</div>
            </div>

            <div className="storageBox">
              <div className="storageBoxTitle">4 total</div>
              <div className="storageBoxTxt">Hosts</div>
            </div>

            <div className="storageBox">
              <div className="storageBoxTitle">1 total</div>
              <div className="storageBoxTxt">Object Gateways</div>
            </div>
          </div>
        </PanelBox>

        <PanelBox className="panel_summary">
          <div className="storageCircleBoxWrap">
            <div className="storageCircleBox">
              <div className="storageCircleBoxTitle">Row Capacity</div>
              <div className="storageCircleBoxCont">
                {/* 아래 Circle 의 원형 테두리는 예시임 실제 개발시에 CSS를 빼야함 */}
                <div className="circle capacity">
                  <div className="circleCount">20.06%</div>
                  <div className="circleTxt">of 240 GIB</div>
                </div>
              </div>
              <div className="contTxt">
                <ul>
                  <li className="used">
                    <span className="tit">Used</span> <span>48.1 GiB</span>
                  </li>
                  <li className="avail">
                    <span className="tit">Avail</span> <span>191.9 GiB</span>
                  </li>
                  <li className="none"></li>
                  <li className="none"></li>
                </ul>
              </div>
            </div>

            <div className="storageCircleBox">
              <div className="storageCircleBoxTitle">Objects</div>
              <div className="storageCircleBoxCont">
                {/* 아래 Circle 의 원형 테두리는 예시임 실제 개발시에 CSS를 빼야함 */}
                <div className="circle object">
                  <div className="circleCount">4.4k</div>
                  <div className="circleTxt">objects</div>
                </div>
              </div>
              <div className="contTxt">
                <ul>
                  <li className="clean">
                    <span className="tit">Healthy</span> <span>100%</span>
                  </li>
                  <li className="working">
                    <span className="tit">Misplaced</span> <span>100%</span>
                  </li>
                  <li className="warning">
                    <span className="tit">Degraded</span> <span>0</span>
                  </li>
                  <li className="unknown">
                    <span className="tit">Unfound</span> <span>0</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="storageCircleBox">
              <div className="storageCircleBoxTitle">PG Status</div>
              <div className="storageCircleBoxCont">
                {/* 아래 Circle 의 원형 테두리는 예시임 실제 개발시에 CSS를 빼야함 */}
                <div className="circle status">
                  <div className="circleCount">177</div>
                  <div className="circleTxt">PGs</div>
                </div>
              </div>
              <div className="contTxt">
                <ul>
                  <li className="clean">
                    <span className="tit">Clean</span> <span>0</span>
                  </li>
                  <li className="working">
                    <span className="tit">Working</span> <span>177</span>
                  </li>
                  <li className="warning">
                    <span className="tit">Warning</span> <span>0</span>
                  </li>
                  <li className="unknown">
                    <span className="tit">Unknown</span> <span>0</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="storageCircleBox">
              <div className="storageCircleBoxTitle">Client Read/Write</div>
              <div className="storageCircleBoxCont">
                {/* 아래 Circle 의 원형 테두리는 예시임 실제 개발시에 CSS를 빼야함 */}
                <div className="circle clientRW">
                  <div className="circleCount">38</div>
                  <div className="circleTxt">IOPS</div>
                </div>
              </div>
              <div className="contTxt">
                <ul>
                  <li className="reads">
                    <span className="tit">Reads</span> <span>2/s</span>
                  </li>
                  <li className="writes">
                    <span className="tit">Writes</span> <span>36/s</span>
                  </li>
                  <li className="none"></li>
                  <li className="none"></li>
                </ul>
              </div>
            </div>

            <div className="storageCircleBox">
              <div className="storageCircleBoxTitle">Client Throughput</div>
              <div className="storageCircleBoxCont">
                {/* 아래 Circle 의 원형 테두리는 예시임 실제 개발시에 CSS를 빼야함 */}
                <div className="circle clientT">
                  <div className="circleCount">12.8</div>
                  <div className="circleTxt">MiB/s</div>
                </div>
              </div>
              <div className="contTxt">
                <ul>
                  <li className="reads">
                    <span className="tit">Reads</span> <span>3.2 KiB/s</span>
                  </li>
                  <li className="writes">
                    <span className="tit">Writes</span> <span>12.8 MiB/s</span>
                  </li>
                  <li className="none"></li>
                  <li className="none"></li>
                </ul>
              </div>
            </div>
          </div>
        </PanelBox>

        <div className="panel_table">
          <CReflexBox>
            <Detail cluster={clusterDetail} />
          </CReflexBox>
        </div>
      </StoragePageWrap>
    </Layout>
  );
};
export default StorageDashboard;
