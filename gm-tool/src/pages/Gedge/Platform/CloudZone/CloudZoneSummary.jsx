import React from "react";
import { observer } from "mobx-react";
import dashboardStore from "../../../../store/Dashboard";

const EdgeZoneSummary = observer(() => {
  const { resourceCnt } = dashboardStore;

  return (
    <div className="edgezone_summary_circleWrap">
      <div className="edgezone_summary_circle">
        <span className="count">15</span>
        <div className="title">Workspace</div>
      </div>
      <div className="edgezone_summary_circle">
        <span className="count">8</span>
        <div className="title">Project</div>
      </div>

      <div className="edgezone_summary_circle">
        <span className="count">8</span>
        <div className="title">Deployment</div>
      </div>

      <div className="edgezone_summary_circle">
        <span className="count">4</span>
        <div className="title">Pod</div>
      </div>

      <div className="edgezone_summary_circle">
        <span className="count">12</span>
        <div className="title">Service</div>
      </div>

      <div className="edgezone_summary_circle">
        <span className="count">2</span>
        <div className="title">Cronjob</div>
      </div>

      <div className="edgezone_summary_circle">
        <span className="count">3</span>
        <div className="title">Job</div>
      </div>

      <div className="edgezone_summary_circle">
        <span className="count">5</span>
        <div className="title">Volume</div>
      </div>
    </div>
  );
});
export default EdgeZoneSummary;
