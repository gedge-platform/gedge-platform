import React, { useState, useEffect, PureComponent } from "react";
import { PanelBox } from "@/components/styles/PanelBox";
import { PanelBoxM } from "@/components/styles/PanelBoxM";
import CommActionBar from "@/components/common/CommActionBar";
import { AgGrid } from "@/components/datagrids";
import { agDateColumnFilter } from "@/utils/common-utils";
import { CReflexBox } from "@/layout/Common/CReflexBox";
import offAPILogo from "@/images/ico-action/api_icon_normal.png";
import onAPILogo from "@/images/ico-action/api_icon_select.png";
import offScheduleLogo from "@/images/ico-action/schedule_icon_normal.png";
import onScheduleLogo from "@/images/ico-action/schedule_icon_select.png";
import { COPieChartCPU, COPieChartDisk, COPieChartMemory, COPieChartPod, COPieChartETC } from "../MonitChart/ClusterOverviewChart";
import { observer } from "mobx-react";
import monitoringStore from "@/store/Monitoring";

const COButtonCPU = observer(({ isOn, onClick }) => {
  const { coPieCPU } = monitoringStore;

  return (
    <div onClick={onClick} className={isOn ? "on-tab1-button" : "off-tab1-button"}>
      <div
        className="tab1-button-circle-graph-area"
        style={{
          cursor: "pointer",
        }}
      >
        <COPieChartCPU isOn={isOn} />
      </div>
      <div className="tab1-button-key-value-area">
        <div className="tab1-button-key-area">CPU(Core)</div>
        <div className="tab1-button-value-area">
          <p className="tab1-button-value-majer">
            {coPieCPU[1]?.metrics[coPieCPU[1]?.metrics.length - 1].value}
            <span className="tab1-button-value-minor">/{coPieCPU[0]?.metrics[coPieCPU[0]?.metrics.length - 1].value}</span>
          </p>
        </div>
      </div>
    </div>
  );
});

const COButtonMemory = observer(({ isOn, onClick }) => {
  const { coPieMemory } = monitoringStore;

  return (
    <div onClick={onClick} className={isOn ? "on-tab1-button" : "off-tab1-button"}>
      <div
        className="tab1-button-circle-graph-area"
        style={{
          cursor: "pointer",
        }}
      >
        <COPieChartMemory isOn={isOn} />
      </div>
      <div className="tab1-button-key-value-area">
        <div className="tab1-button-key-area">Memory(GB)</div>
        <div className="tab1-button-value-area">
          <p className="tab1-button-value-majer">
            {coPieMemory[1]?.metrics[coPieMemory[1]?.metrics.length - 1].value}
            <span className="tab1-button-value-minor">/{coPieMemory[0]?.metrics[coPieMemory[0]?.metrics.length - 1].value}</span>
          </p>
        </div>
      </div>
    </div>
  );
});

const COButtonDisk = observer(({ isOn, onClick }) => {
  const { coPieDisk } = monitoringStore;

  return (
    <div onClick={onClick} className={isOn ? "on-tab1-button" : "off-tab1-button"}>
      <div
        className="tab1-button-circle-graph-area"
        style={{
          cursor: "pointer",
        }}
      >
        <COPieChartDisk isOn={isOn} />
      </div>
      <div className="tab1-button-key-value-area">
        <div className="tab1-button-key-area">Disk(GB)</div>
        <div className="tab1-button-value-area">
          <p className="tab1-button-value-majer">
            {coPieDisk[1]?.metrics[coPieDisk[1]?.metrics.length - 1].value}
            <span className="tab1-button-value-minor">/{coPieDisk[0]?.metrics[coPieDisk[0]?.metrics.length - 1].value}</span>
          </p>
        </div>
      </div>
    </div>
  );
});

const COButtonPod = observer(({ isOn, onClick }) => {
  const { coPiePod } = monitoringStore;

  return (
    <div onClick={onClick} className={isOn ? "on-tab1-button" : "off-tab1-button"}>
      <div
        className="tab1-button-circle-graph-area"
        style={{
          cursor: "pointer",
        }}
      >
        <COPieChartPod isOn={isOn} />
      </div>
      <div className="tab1-button-key-value-area">
        <div className="tab1-button-key-area">Pods</div>
        <div className="tab1-button-value-area">
          <p className="tab1-button-value-majer">
            {coPiePod[1]?.metrics[coPiePod[1]?.metrics.length - 1].value}
            <span className="tab1-button-value-minor">/{coPiePod[0]?.metrics[coPiePod[0]?.metrics.length - 1].value}</span>
          </p>
        </div>
      </div>
    </div>
  );
});

const COButtonAPILatency = observer(({ isOn, onClick }) => {
  return (
    <div onClick={onClick} className={isOn ? "on-tab1-button" : "off-tab1-button"}>
      <div
        className="tab1-button-circle-graph-area"
        style={{
          cursor: "pointer",
        }}
      >
        <img src={isOn ? onAPILogo : offAPILogo} />
      </div>
      <div className="tab1-button-key-value-area">
        <div className="tab1-button-key-area">API Server</div>
        <div className="tab1-button-value-area">
          <span className="tab1-button-value-minor-bottom">Request/ Latency</span>
        </div>
      </div>
    </div>
  );
});

const COButtonAPIRate = observer(({ isOn, onClick }) => {
  return (
    <div onClick={onClick} className={isOn ? "on-tab1-button" : "off-tab1-button"}>
      <div
        className="tab1-button-circle-graph-area"
        style={{
          cursor: "pointer",
        }}
      >
        <img src={isOn ? onAPILogo : offAPILogo} />
      </div>
      <div className="tab1-button-key-value-area">
        <div className="tab1-button-key-area">API Server</div>
        <div className="tab1-button-value-area">
          <span className="tab1-button-value-minor-bottom">Request Rate</span>
        </div>
      </div>
    </div>
  );
});

const COButtonSchedulerAttempts = observer(({ isOn, onClick }) => {
  return (
    <div onClick={onClick} className={isOn ? "on-tab1-button" : "off-tab1-button"}>
      <div
        className="tab1-button-circle-graph-area"
        style={{
          cursor: "pointer",
        }}
      >
        <img src={isOn ? onScheduleLogo : offScheduleLogo} />
      </div>
      <div className="tab1-button-key-value-area">
        <div className="tab1-button-key-area">Scheduler</div>
        <div className="tab1-button-value-area">
          <span className="tab1-button-value-minor-bottom">Scheduling Attempts</span>
        </div>
      </div>
    </div>
  );
});

const COButtonSchedulerRate = observer(({ isOn, onClick }) => {
  return (
    <div onClick={onClick} className={isOn ? "on-tab1-button" : "off-tab1-button"}>
      <div
        className="tab1-button-circle-graph-area"
        style={{
          cursor: "pointer",
        }}
      >
        {/* <COPieChartETC isOn={isOn} /> */}
        <img src={isOn ? onScheduleLogo : offScheduleLogo} />
      </div>
      <div className="tab1-button-key-value-area">
        <div className="tab1-button-key-area" style={{ fontSize: "12px" }}>
          Scheduler
        </div>
        <div className="tab1-button-value-area">
          <span className="tab1-button-value-minor-bottom">Scheduling Rate</span>
        </div>
      </div>
    </div>
  );
});

export {
  COButtonCPU,
  COButtonDisk,
  COButtonPod,
  COButtonMemory,
  COButtonAPILatency,
  COButtonAPIRate,
  COButtonSchedulerAttempts,
  COButtonSchedulerRate,
};
