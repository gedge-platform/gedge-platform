import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { dashboardStore } from "@/store";

const ClusterSummary = observer(() => {
  const {
    dashboardDetail,
    clusterCnt,
    // coreClusterCnt,
    credentialCnt,
    edgeClusterCnt,
    workspaceCnt,
    projectCnt,
    loadClusterCnt,
    loadDashboardCnt,
    setClusterCnt,
    setDashBoardDetail,
  } = dashboardStore;

  useEffect(() => {
    loadDashboardCnt();
  }, []);

  return (
    <div className="ClusterSummaryWrap">
      <div className="ClusterSummary Cluster">
        <div className="ClusterCountTitle">전체 클러스터 개수</div>
        <div className="ClusterCount">{clusterCnt}</div>
      </div>

      <div className="ClusterSummary Core">
        <div className="ClusterCountTitle">클라우드 개수</div>
        <div className="ClusterCount">{credentialCnt}</div>
      </div>

      <div className="ClusterSummary Edge">
        <div className="ClusterCountTitle">엣지 개수</div>
        <div className="ClusterCount">{edgeClusterCnt}</div>
      </div>

      <div className="ClusterSummary Workspace">
        <div className="ClusterCountTitle">전체 워크스페이스 개수</div>
        <div className="ClusterCount">{workspaceCnt}</div>
      </div>

      <div className="ClusterSummary Project">
        <div className="ClusterCountTitle">전체 프로젝트 개수</div>
        <div className="ClusterCount">{projectCnt}</div>
      </div>
    </div>
  );
});
export default ClusterSummary;
