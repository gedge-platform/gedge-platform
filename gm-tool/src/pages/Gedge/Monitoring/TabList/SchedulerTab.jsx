import React, { useState, useEffect, PureComponent } from "react";
import { PanelBox } from "@/components/styles/PanelBox";
import { PanelBoxM } from "@/components/styles/PanelBoxM";
import { SchedulerAreaChart } from "./MonitChart/SchedulerChart";
import { CSelectButtonM } from "@/components/buttons";
import { CIconButton } from "@/components/buttons";
import { observer } from "mobx-react";
import dayjs from "dayjs";
import { monitoringStore } from "@/store";
import {
  unixCurrentTime,
  combinationMetrics,
  LastTimeList,
  IntervalList,
} from "../Utils/MetricsVariableFormatter";

import { ClusterMetricTypes, TargetTypes } from "../Utils/MetricsVariables";

const Scheduler = observer(() => {
  const [tabvalue, setTabvalue] = useState(0);
  const [open, setOpen] = useState(false);
  const handleTabChange = (event, newValue) => {
    setTabvalue(newValue);
  };

  const [play, setPlay] = useState(false);
  const [playMetrics, setPlayMetrics] = useState(null);

  const {
    clusterName,
    clusterNames,
    lastTime,
    interval,
    setMetricsLastTime,
    setMetricsInterval,
    setClusterName,
    loadAllMetrics,
    loadRealAllMetrics,
  } = monitoringStore;

  const clusterNameActionList = clusterNames.map((item) => {
    return {
      name: item,
      onClick: () => {
        setClusterName(item);
        calledMetrics();
        ckeckedInterval();
      },
    };
  });

  const lastTimeActionList = LastTimeList.map((item) => {
    return {
      name: item.name,
      onClick: () => {
        setMetricsLastTime(item);
        calledMetrics();
        ckeckedInterval();
      },
    };
  });

  const intervalTimeActionList = IntervalList.map((item) => {
    return {
      name: item.name,
      onClick: () => {
        setMetricsInterval(item);
        calledMetrics();
        ckeckedInterval();
      },
    };
  });

  const calledMetrics = () => {
    loadAllMetrics(
      TargetTypes.CLUSTER,
      unixCurrentTime(),
      ClusterMetricTypes.SCHEDULER_ALL
    );
  };

  const playCalledMetrics = () => {
    setPlay(true);
    setPlayMetrics(
      setInterval(() => {
        loadRealAllMetrics(
          TargetTypes.CLUSTER,
          unixCurrentTime(),
          combinationMetrics(ClusterMetricTypes.SCHEDULER_ALL)
        );
      }, 5000)
    );
  };

  const stopCalledMetrics = () => {
    setPlay(false);
    clearInterval(playMetrics);
    setPlayMetrics(null);
  };

  const ckeckedInterval = () => (play ? stopCalledMetrics() : null);

  useEffect(() => {
    calledMetrics();
  }, []);

  return (
    <PanelBoxM>
      <div className="panelTitBar panelTitBar_clear">
        <div className="tit">
          <span style={{ marginRight: "10px", color: "white " }}>
            Select Cluster
          </span>
          <CSelectButtonM
            className="none_transform"
            items={clusterNameActionList}
          >
            {clusterName}
          </CSelectButtonM>
        </div>
        <div className="date">
          {dayjs(new Date()).format("YYYY-MM-DD")}
          <CIconButton
            onClick={calledMetrics}
            icon="refresh"
            type="btn1"
            tooltip="Refresh"
            style={{
              marginLeft: "10px",
            }}
          ></CIconButton>
        </div>
      </div>
      <PanelBox
        className="panel_graph"
        style={{ height: "100%", margin: "5px 0 5px 0" }}
      >
        <div className="panelTitBar panelTitBar_clear">
          <div
            className="tit"
            style={{ color: "white ", display: "flex", alignItems: "center" }}
          >
            <span style={{ marginRight: "10px", color: "white " }}>Last :</span>
            <CSelectButtonM
              className="none_transform"
              items={lastTimeActionList}
            >
              {lastTime.name}
            </CSelectButtonM>
            <span
              style={{
                marginLeft: "10px",
                marginRight: "10px",
                color: "white ",
              }}
            >
              Interval :
            </span>
            <CSelectButtonM
              className="none_transform"
              items={intervalTimeActionList}
            >
              {interval.name}
            </CSelectButtonM>
            <div
              style={{
                width: "1104px",
                display: "flex",
                justifyContent: "right",
              }}
            >
              <CIconButton
                onClick={playCalledMetrics}
                icon="play"
                type="btn1"
                tooltip="Play"
                isPlay={play}
              ></CIconButton>
              <CIconButton
                onClick={stopCalledMetrics}
                icon="pause"
                type="btn1"
                tooltip="Pause"
              ></CIconButton>
            </div>
          </div>
        </div>
        <div className="tabN-chart-div-area">
          <div
            className="tab2-chart-area"
            style={{
              width: "100%",
            }}
          >
            <div
              className="tab2-chart"
              style={{ width: "100%", margin: "5px 0 5px 0" }}
            >
              <SchedulerAreaChart
                value={ClusterMetricTypes.SCHEDULER_ATTEMPTS_TOTAL}
              />
            </div>
          </div>
        </div>
        <div className="tabN-chart-div-area">
          <div
            className="tab2-chart-area"
            style={{
              width: "100%",
            }}
          >
            <div
              className="tab2-chart"
              style={{ width: "100%", margin: "5px 0 5px 0" }}
            >
              <SchedulerAreaChart
                value={ClusterMetricTypes.SCHEDULER_FAIL_TOTAL}
              />
            </div>
          </div>
        </div>
        <div className="tabN-chart-div-area">
          <div
            className="tab2-chart-area"
            style={{
              width: "100%",
            }}
          >
            <div
              className="tab2-chart"
              style={{ width: "100%", margin: "5px 0 5px 0" }}
            >
              <SchedulerAreaChart
                value={ClusterMetricTypes.SCHEDULER_LATENCY}
              />
            </div>
          </div>
        </div>
      </PanelBox>
    </PanelBoxM>
  );
});
export default Scheduler;
