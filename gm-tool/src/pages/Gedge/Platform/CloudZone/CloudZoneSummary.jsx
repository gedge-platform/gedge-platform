import React from "react";
import { observer } from "mobx-react";
import { dashboardStore } from "@/store";

const EdgeZoneSummary = observer(() => {
  const { cloudResourceCnt } = dashboardStore;

  return (
    <div className="edgezone_summary_circleWrap">
      <div className="edgezone_summary_circle">
        <span className="count">{cloudResourceCnt.workspace_count}</span>
        <div className="title">Workspace</div>
      </div>
      <div className="edgezone_summary_circle">
        <span className="count">{cloudResourceCnt.project_count}</span>
        <div className="title">Project</div>
      </div>

      <div className="edgezone_summary_circle">
        <span className="count">{cloudResourceCnt.deployment_count}</span>
        <div className="title">Deployment</div>
      </div>

      <div className="edgezone_summary_circle">
        <span className="count">{cloudResourceCnt.pod_count}</span>
        <div className="title">Pod</div>
      </div>

      <div className="edgezone_summary_circle">
        <span className="count">{cloudResourceCnt.service_count}</span>
        <div className="title">Service</div>
      </div>

      <div className="edgezone_summary_circle">
        <span className="count">{cloudResourceCnt.cronjob_count}</span>
        <div className="title">Cronjob</div>
      </div>

      <div className="edgezone_summary_circle">
        <span className="count">{cloudResourceCnt.job_count}</span>
        <div className="title">Job</div>
      </div>

      <div className="edgezone_summary_circle">
        <span className="count">{cloudResourceCnt.pv_count}</span>
        <div className="title">Volume</div>
      </div>
    </div>
  );
});
export default EdgeZoneSummary;
