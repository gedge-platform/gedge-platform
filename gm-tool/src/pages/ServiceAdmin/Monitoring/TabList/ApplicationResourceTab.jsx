import React, { useState, useEffect, PureComponent } from "react";
import { PanelBox } from "@/components/styles/PanelBox";
import { PanelBoxM } from "@/components/styles/PanelBoxM";
import { AppAreaChart } from "./ApplicationResourceChart";
import {
  CCreateButton,
  CSelectButton,
  CSelectButtonM,
  CIconButton,
} from "@/components/buttons";
import { observer } from "mobx-react";
import moment from "moment";
import monitoringStore from "@/store/Monitoring";
import {
  stepConverter,
  unixCurrentTime,
  unixStartTime,
  combinationMetrics,
  LastTimeList,
  IntervalList,
} from "@/pages/Gedge/Monitoring/Utils/MetricsVariableFormatter";

import {
  ClusterMetricTypes,
  TargetTypes,
  AppMetricValues,
} from "@/pages/Gedge/Monitoring/Utils/MetricsVariables";

const ApplicationResource = observer(() => {
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
    loadClusterNames,
    loadAppMetrics,
    loadRealAppMetrics,
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
    calledClusterMetrics();
    calledAppMetrics();
  };

  const calledClusterMetrics = () => {
    loadAllMetrics(
      TargetTypes.CLUSTER,
      unixCurrentTime(),
      combinationMetrics(
        ClusterMetricTypes.CPU_USAGE,
        ClusterMetricTypes.MEMORY_USAGE
      )
    );
  };

  const calledAppMetrics = () => {
    loadAppMetrics(
      TargetTypes.APPLICATION,
      unixCurrentTime(),
      combinationMetrics(AppMetricValues.ALL)
    );
  };

  const calledRealClusterMetrics = () => {
    loadRealAllMetrics(
      TargetTypes.CLUSTER,
      unixCurrentTime(),
      combinationMetrics(
        ClusterMetricTypes.CPU_USAGE,
        ClusterMetricTypes.MEMORY_USAGE
      )
    );
  };

  const calledRealAppMetrics = () => {
    loadRealAppMetrics(
      TargetTypes.APPLICATION,
      unixCurrentTime(),
      combinationMetrics(AppMetricValues.ALL)
    );
  };

  const playCalledMetrics = () => {
    setPlay(true);
    console.log(play);
    setPlayMetrics(
      setInterval(() => {
        calledRealClusterMetrics();
        calledRealAppMetrics();
      }, 5000)
    );
  };

  const stopCalledMetrics = () => {
    setPlay(false);
    console.log(play);
    clearInterval(playMetrics);
    setPlayMetrics(null);
  };

  const ckeckedInterval = () => (play ? stopCalledMetrics() : null);

  useEffect(() => {
    if (clusterName === "") {
      loadClusterNames(calledMetrics);
    } else {
      calledMetrics();
    }
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
          {moment(new Date()).format("YYYY-MM-DD")}
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
          <PanelBox className="panel_graph tabN-chart-area">
            <div className="tab2-chart-area">
              <div className="tab2-chart">
                <AppAreaChart value={ClusterMetricTypes.CPU_USAGE} />
              </div>
            </div>
          </PanelBox>
          <PanelBox className="panel_graph tabN-chart-area">
            <div className="tab2-chart-area">
              <div className="tab2-chart">
                <AppAreaChart value={ClusterMetricTypes.MEMORY_USAGE} />
              </div>
            </div>
          </PanelBox>
        </div>
      </PanelBox>
      <PanelBox
        className="panel_graph"
        style={{ height: "100%", margin: "5px 0 5px 0" }}
      >
        <div className="panelTitBar panelTitBar_clear">
          <div className="tit" style={{ color: "white " }}>
            <span style={{ marginRight: "10px", color: "white " }}>
              Application Resource
            </span>
          </div>
        </div>
        <div className="tabN-chart-div-area">
          <PanelBox className="panel_graph tabN-chart-area">
            <div className="tab2-chart-area">
              <div className="tab2-chart">
                <AppAreaChart value={AppMetricValues.POD_COUNT} />
              </div>
            </div>
          </PanelBox>
          <PanelBox className="panel_graph tabN-chart-area">
            <div className="tab2-chart-area">
              <div className="tab2-chart">
                <AppAreaChart value={AppMetricValues.SERVICE_COUNT} />
              </div>
            </div>
          </PanelBox>
        </div>
        <div className="tabN-chart-div-area">
          <PanelBox className="panel_graph tabN-chart-area">
            <div className="tab2-chart-area">
              <div className="tab2-chart">
                <AppAreaChart value={AppMetricValues.DEVPLOYMENT_COUNT} />
              </div>
            </div>
          </PanelBox>
          <PanelBox className="panel_graph tabN-chart-area">
            <div className="tab2-chart-area">
              <div className="tab2-chart">
                <AppAreaChart value={AppMetricValues.CRONJOB_COUNT} />
              </div>
            </div>
          </PanelBox>
        </div>
        <div className="tabN-chart-div-area">
          <PanelBox className="panel_graph tabN-chart-area">
            <div className="tab2-chart-area">
              <div className="tab2-chart">
                <AppAreaChart value={AppMetricValues.PV_COUNT} />
              </div>
            </div>
          </PanelBox>
          <PanelBox className="panel_graph tabN-chart-area">
            <div className="tab2-chart-area">
              <div className="tab2-chart">
                <AppAreaChart value={AppMetricValues.PVC_COUNT} />
              </div>
            </div>
          </PanelBox>
        </div>
        <div className="tabN-chart-div-area">
          <PanelBox className="panel_graph tabN-chart-area">
            <div className="tab2-chart-area">
              <div className="tab2-chart">
                <AppAreaChart value={AppMetricValues.NAMESPACE_COUNT} />
              </div>
            </div>
          </PanelBox>
        </div>
      </PanelBox>
    </PanelBoxM>
  );
});
export default ApplicationResource;
