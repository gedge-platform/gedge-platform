import React, { useState, useEffect, useLayoutEffect } from "react";
import { PanelBox } from "@/components/styles/PanelBox";
import { CReflexBox } from "@/layout/Common/CReflexBox";
import { CTabPanel } from "@/components/tabs";
import { useHistory } from "react-router";
import { observer } from "mobx-react";
import Detail from "../Detail";
import clusterStore from "../../../../store/Cluster";
import { Title } from "@/pages";
import ClusterInfo from "@/pages/Dashboard/DashboardCont/ClusterInfo";
import MapContent from "@/pages/Dashboard/DashboardCont/MapContent";
import EdgeZoneSummary from "./EdgeZoneSummary";
import styled from "styled-components";
import NodeList from "../../../Dashboard/DashboardCont/NodeList";
import dashboardStore from "../../../../store/Dashboard";

const EdgeZoneWrap = styled.div`
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

const EdgeZoneDashboard = observer(() => {
  const [tabvalue, setTabvalue] = useState(0);
  const handleTabChange = (event, newValue) => {
    setTabvalue(newValue);
  };

  const { clusterDetail, loadClusterList, loadCluster } = clusterStore;

  const {nodeInfo} =dashboardStore;

  const history = useHistory();

  const handleClick = (e) => {
    loadCluster(e.data.clusterName);
  };

  useLayoutEffect(() => {
    loadClusterList("edge");
  }, []);

  return (
    <>
      <EdgeZoneWrap>
        <PanelBox className="panel_summary">
          <div className="tabPanelContainer">
            <CTabPanel value={tabvalue} index={0}></CTabPanel>
          </div>
          <div className="ClusterInfoWrap">
            <ClusterInfo />
          </div>
          <div className="ClusterMapWrap">
            <MapContent />
          </div>

          <div className="SummaryWrap">
            <EdgeZoneSummary/>
          </div>
          {/* </PanelBox> */}

          <div className="panel_summary">
            <CReflexBox>
              {/* <Detail cluster={nodeInfo} /> */}
              <NodeList />
            </CReflexBox>
          </div>
        </PanelBox>
      </EdgeZoneWrap>
    </>
    // <Layout currentPageTitle={currentPageTitle}>
    //   <EdgeZoneWrap>
    //     <PanelBox className="panel_summary">
    //       {/* <CommActionBar
    //         // reloadFunc={() => loadClusterList("edge")}
    //         // isSearch={true}
    //         // isSelect={true}
    //         // keywordList={["이름"]}
    //       >
    //         <CCreateButton onClick={handleOpen}>생성</CCreateButton>
    //       </CommActionBar>

    //       <div className="tabPanelContainer">
    //         <CTabPanel value={tabvalue} index={0}>
    //           <div className="grid-height2">
    //             <AgGrid
    //               rowData={viewList}
    //               columnDefs={columDefs}
    //               isBottom={false}
    //               totalElements={totalElements}
    //               onCellClicked={handleClick}
    //               totalPages={totalPages}
    //               currentPage={currentPage}
    //               goNextPage={goNextPage}
    //               goPrevPage={goPrevPage}
    //             />
    //           </div>
    //         </CTabPanel>
    //       </div>
    //       <CreateCluster type={"edge"} open={open} onClose={handleClose} /> */}
    //       <div className="ClusterInfoWrap">
    //         <ClusterInfo />
    //       </div>

    //   <div className="ClusterMapWrap">
    //     <MapContent />
    //   </div>

    //   <div className="SummaryWrap">
    //     <EdgeZoneSummary />
    //   </div>
    // </PanelBox>

    // <div className="panel_summary">
    //   <CReflexBox>
    //     <Detail cluster={clusterDetail} />
    //   </CReflexBox>
    // </div>
    //   </EdgeZoneWrap>
    // </Layout>
  );
});

export default EdgeZoneDashboard;
