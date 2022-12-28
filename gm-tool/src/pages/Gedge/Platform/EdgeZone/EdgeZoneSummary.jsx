import React from "react";
import { dashboardStore } from "@/store";
import { observer } from "mobx-react";

const EdgeZoneSummary = observer(() => {
  const { resourceCnt } = dashboardStore;

  return (
    <div className="edgezone_summary_circleWrap">
      <div className="edgezone_summary_circle">
        <span className="count">{resourceCnt?.workspace_count}</span>
        <div className="title">Workspace</div>
      </div>

      <div className="edgezone_summary_circle">
        <span className="count">{resourceCnt?.project_count}</span>
        <div className="title">Project</div>
      </div>

      <div className="edgezone_summary_circle">
        <span className="count">{resourceCnt?.deployment_count}</span>
        <div className="title">Deployment</div>
      </div>

      <div className="edgezone_summary_circle">
        <span className="count">{resourceCnt?.pod_count}</span>
        <div className="title">Pod</div>
      </div>

      <div className="edgezone_summary_circle">
        <span className="count">{resourceCnt?.service_count}</span>
        <div className="title">Service</div>
      </div>

      <div className="edgezone_summary_circle">
        <span className="count">{resourceCnt?.cronjob_count}</span>
        <div className="title">Cronjob</div>
      </div>

      <div className="edgezone_summary_circle">
        <span className="count">{resourceCnt?.job_count}</span>
        <div className="title">Job</div>
      </div>

      <div className="edgezone_summary_circle">
        <span className="count">{resourceCnt?.pv_count}</span>
        <div className="title">Volume</div>
      </div>
    </div>
  );
});
export default EdgeZoneSummary;
