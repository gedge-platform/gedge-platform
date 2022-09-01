import React, { useState, useEffect, useLayoutEffect } from "react";
import { PanelBox } from "@/components/styles/PanelBox";
import { agDateColumnFilter, dateFormatter } from "@/utils/common-utils";
import { CReflexBox } from "@/layout/Common/CReflexBox";
import { CTabPanel } from "@/components/tabs";
import { useHistory } from "react-router";
import { observer } from "mobx-react";
import Detail from "../Detail";
import clusterStore from "../../../../store/Cluster";
import { Title } from "@/pages";
import ClusterInfo from "@/pages/Dashboard/DashboardCont/ClusterInfo";
import CloudZoneSummary from "./CloudZoneSummary";
import CloudZoneSlider from "./CloudZoneSlider";
import styled from "styled-components";
import NodeList from "../../../Dashboard/DashboardCont/NodeList";

const CloudZoneWrap = styled.div`
  .panel_summary {
    width: 100%;
    padding: 20px;
    background: #202842;
    border: 0;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    &::before {
      display: none;
    }
  }
`;

const CloudZoneDashboard = observer(() => {
  const [tabvalue, setTabvalue] = useState(0);
  const handleTabChange = (event, newValue) => {
    setTabvalue(newValue);
  };

  const { clusterDetail, loadClusterList } = clusterStore;

  const history = useHistory();

  useLayoutEffect(() => {
    loadClusterList("core");
  }, []);

  return (
    <>
      <CloudZoneWrap>
        <PanelBox className="panel_summary">
          <div className="tabPanelContainer">
            <CTabPanel value={tabvalue} index={1}></CTabPanel>
          </div>
          <div className="ClusterInfoWrap">
            <ClusterInfo />
          </div>
          <div className="ClusterSliderWrap">
            <CloudZoneSlider />
          </div>

          <div className="SummaryWrap">
            <CloudZoneSummary />
          </div>
        </PanelBox>
        <div className="panel_summary">
          <CReflexBox>
            {/* <Detail cluster={clusterDetail} /> */}
            <NodeList />
          </CReflexBox>
        </div>
      </CloudZoneWrap>
    </>

    // <Layout currentPageTitle={currentPageTitle}>
    //   <CloudZoneWrap>
    //     <PanelBox className="panel_summary">
    //       <div className="ClusterInfoWrap">
    //         <ClusterInfo />
    //       </div>

    //       <div className="ClusterSliderWrap">
    //         <CloudZoneSlider />
    //       </div>

    //       <div className="SummaryWrap">
    //         <CloudZoneSummary />
    //       </div>
    //     </PanelBox>
    //     <div className="panel_summary">
    //       <CReflexBox>
    //         <Detail cluster={clusterDetail} />
    //       </CReflexBox>
    //     </div>
    //   </CloudZoneWrap>
    // </Layout>
  );
});

export default CloudZoneDashboard;
