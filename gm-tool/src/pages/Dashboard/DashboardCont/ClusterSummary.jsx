import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { dashboardStore } from "@/store";

const ClusterSummary = observer(() => {
  const {
    clusterCnt,
    credentialCnt,
    edgeClusterCnt,
    workspaceCnt,
    projectCnt,
    loadDashboardCnt,
    coreClusterCnt,
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
        <div className="ClusterCount">{coreClusterCnt}</div>
      </div>

      {/* <div className="ClusterSummary Test">
        <div className="ClusterCountTitle">이동 엣지 개수</div>
        <div className="ClusterCount">{credentialCnt}</div>
      </div> */}

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
