import React, { useEffect } from "react";
import dashboardStore from "../../../../store/Dashboard";
import { observer } from "mobx-react";

const EdgeZoneSummary = observer(() => {
  const { resourceCnt } = dashboardStore;

  return (
    <div className="edgezone_summary_circleWrap">
      <div className="edgezone_summary_circle">
        <span className="count">
          {resourceCnt?.map((item) => item?.workspace_count)}
        </span>
        <div className="title">Workspace</div>
      </div>

      <div className="edgezone_summary_circle">
        <span className="count">
          {resourceCnt?.map((item) => item?.project_count)}
        </span>
        <div className="title">Project</div>
      </div>

      <div className="edgezone_summary_circle">
        <span className="count">
          {resourceCnt?.map((item) => item?.deployment_count)}
        </span>
        <div className="title">Deployment</div>
      </div>

      <div className="edgezone_summary_circle">
        <span className="count">
          {resourceCnt?.map((item) => item?.pod_count)}
        </span>
        <div className="title">Pod</div>
      </div>

      <div className="edgezone_summary_circle">
        <span className="count">
          {resourceCnt?.map((item) => item?.service_count)}
        </span>
        <div className="title">Service</div>
      </div>

      <div className="edgezone_summary_circle">
        <span className="count">
          {resourceCnt?.map((item) => item.cronjob_count === undefined)
            ? 0
            : resourceCnt?.map((item) => item.cronjob_count)}
        </span>
        <div className="title">Cronjob</div>
      </div>

      <div className="edgezone_summary_circle">
        <span className="count">
          {resourceCnt?.map((item) => item?.job_count)}
        </span>
        <div className="title">Job</div>
      </div>

      <div className="edgezone_summary_circle">
        <span className="count">
          {resourceCnt?.map((item) => item?.pv_count)}
        </span>
        <div className="title">Volume</div>
      </div>
    </div>
  );
});
export default EdgeZoneSummary;
