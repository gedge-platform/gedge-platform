import React, { useState, useEffect, PureComponent } from "react";
import { PanelBox } from "@/components/styles/PanelBox";
import { PanelBoxM } from "@/components/styles/PanelBoxM";
import CommActionBar from "@/components/common/CommActionBar";
import { AgGrid } from "@/components/datagrids";
import { agDateColumnFilter } from "@/utils/common-utils";
import { CReflexBox } from "@/layout/Common/CReflexBox";
import {
  COAreaChartTop,
  COAreaChartBottom,
} from "./MonitChart/ClusterOverviewChart";
import {
  CCreateButton,
  CSelectButton,
  CSelectButtonM,
  CIconButton,
} from "@/components/buttons";
import { observer } from "mobx-react";
import dayjs from "dayjs";
import { monitoringStore } from "@/store";
import {
  stepConverter,
  unixCurrentTime,
  unixStartTime,
  combinationMetrics,
} from "../Utils/MetricsVariableFormatter";

import { ClusterMetricTypes, TargetTypes } from "../Utils/MetricsVariables";
import {
  COButtonCPU,
  COButtonMemory,
  COButtonPod,
  COButtonDisk,
  COButtonAPILatency,
  COButtonAPIRate,
  COButtonSchedulerAttempts,
  COButtonSchedulerRate,
} from "./ClusterOverviewComponent/COButton";

const ClusterOverview = observer(() => {
  const [open1, setOpen1] = useState(true);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [open4, setOpen4] = useState(false);
  const [open5, setOpen5] = useState(true);
  const [open6, setOpen6] = useState(false);
  const [open7, setOpen7] = useState(false);
  const [open8, setOpen8] = useState(false);
  const [chartValueTop, setChartValueTop] = useState("CPU");
  const [chartValueBottom, setChartValueBottom] = useState("APISERVER_LATENCY");
  const [tabvalue, setTabvalue] = useState(0);
  const [open, setOpen] = useState(false);
  const handleTabChange = (event, newValue) => {
    setTabvalue(newValue);
  };

  const {
    clusterName,
    clusterNames,
    loadClusterNames,
    loadCoCPU,
    loadCoMemory,
    loadCoDisk,
    loadCoPod,
    loadCoAPILatency,
    loadCoAPIRate,
    loadCoSchedulerAttempts,
    loadCoSchedulerRate,
    setClusterName,
  } = monitoringStore;

  const calledMetrics = () => {
    loadCoCPU(
      TargetTypes.CLUSTER,
      unixStartTime(60 * 6),
      unixCurrentTime(),
      stepConverter(5),
      combinationMetrics(
        ClusterMetricTypes.CPU_TOTAL,
        ClusterMetricTypes.CPU_USAGE,
        ClusterMetricTypes.CPU_UTIL
      )
    );
    loadCoMemory(
      TargetTypes.CLUSTER,
      unixStartTime(60 * 6),
      unixCurrentTime(),
      stepConverter(5),
      combinationMetrics(
        ClusterMetricTypes.MEMORY_TOTAL,
        ClusterMetricTypes.MEMORY_USAGE,
        ClusterMetricTypes.MEMORY_UTIL
      )
    );
    loadCoDisk(
      TargetTypes.CLUSTER,
      unixStartTime(60 * 6),
      unixCurrentTime(),
      stepConverter(5),
      combinationMetrics(
        ClusterMetricTypes.DISK_TOTAL,
        ClusterMetricTypes.DISK_USAGE,
        ClusterMetricTypes.DISK_UTIL
      )
    );
    loadCoPod(
      TargetTypes.CLUSTER,
      unixStartTime(60 * 6),
      unixCurrentTime(),
      stepConverter(5),
      combinationMetrics(
        ClusterMetricTypes.POD_QUOTA,
        ClusterMetricTypes.POD_RUNNING,
        ClusterMetricTypes.POD_UTIL
      )
    );
    loadCoAPILatency(
      TargetTypes.CLUSTER,
      unixStartTime(60 * 6),
      unixCurrentTime(),
      stepConverter(5),
      ClusterMetricTypes.APISERVER_LATENCY
    );
    loadCoAPIRate(
      TargetTypes.CLUSTER,
      unixStartTime(60 * 6),
      unixCurrentTime(),
      stepConverter(5),
      ClusterMetricTypes.APISERVER_REQUEST_RATE
    );
    loadCoSchedulerAttempts(
      TargetTypes.CLUSTER,
      unixStartTime(60 * 6),
      unixCurrentTime(),
      stepConverter(5),
      ClusterMetricTypes.SCHEDULER_ATTEMPTS_TOTAL
    );
    loadCoSchedulerRate(
      TargetTypes.CLUSTER,
      unixStartTime(60 * 6),
      unixCurrentTime(),
      stepConverter(5),
      ClusterMetricTypes.SCHEDULER_LATENCY
    );
  };

  const changedTopState = (index) => {
    switch (index) {
      case 1:
        setOpen1(true);
        setOpen2(false);
        setOpen3(false);
        setOpen4(false);
        loadCoCPU(
          TargetTypes.CLUSTER,
          unixStartTime(60 * 6),
          unixCurrentTime(),
          stepConverter(5),
          combinationMetrics(
            ClusterMetricTypes.CPU_TOTAL,
            ClusterMetricTypes.CPU_UTIL,
            ClusterMetricTypes.CPU_USAGE
          )
        );
        setChartValueTop("CPU");
        break;
      case 2:
        setOpen1(false);
        setOpen2(true);
        setOpen3(false);
        setOpen4(false);
        loadCoMemory(
          TargetTypes.CLUSTER,
          unixStartTime(60 * 6),
          unixCurrentTime(),
          stepConverter(5),
          combinationMetrics(
            ClusterMetricTypes.MEMORY_TOTAL,
            ClusterMetricTypes.MEMORY_USAGE,
            ClusterMetricTypes.MEMORY_UTIL
          )
        );
        setChartValueTop("MEMORY");
        break;
      case 3:
        setOpen1(false);
        setOpen2(false);
        setOpen3(true);
        setOpen4(false);
        loadCoDisk(
          TargetTypes.CLUSTER,
          unixStartTime(60 * 6),
          unixCurrentTime(),
          stepConverter(5),
          combinationMetrics(
            ClusterMetricTypes.DISK_TOTAL,
            ClusterMetricTypes.DISK_USAGE,
            ClusterMetricTypes.DISK_UTIL
          )
        );
        setChartValueTop("DISK");
        break;
      case 4:
        setOpen1(false);
        setOpen2(false);
        setOpen3(false);
        setOpen4(true);
        loadCoPod(
          TargetTypes.CLUSTER,
          unixStartTime(60 * 6),
          unixCurrentTime(),
          stepConverter(5),
          combinationMetrics(
            ClusterMetricTypes.POD_QUOTA,
            ClusterMetricTypes.POD_RUNNING,
            ClusterMetricTypes.POD_UTIL
          )
        );
        setChartValueTop("POD");
        break;

      default:
        break;
    }
  };

  const changedBottomState = (index) => {
    switch (index) {
      case 5:
        setOpen5(true);
        setOpen6(false);
        setOpen7(false);
        setOpen8(false);
        loadCoAPILatency(
          TargetTypes.CLUSTER,
          unixStartTime(60 * 6),
          unixCurrentTime(),
          stepConverter(5),
          ClusterMetricTypes.APISERVER_LATENCY
        );
        setChartValueBottom("APISERVER_LATENCY");
        break;
      case 6:
        setOpen5(false);
        setOpen6(true);
        setOpen7(false);
        setOpen8(false);
        loadCoAPIRate(
          TargetTypes.CLUSTER,
          unixStartTime(60 * 6),
          unixCurrentTime(),
          stepConverter(5),
          ClusterMetricTypes.APISERVER_REQUEST_RATE
        );
        setChartValueBottom("APISERVER_REQUEST_RATEMORY");
        break;
      case 7:
        setOpen5(false);
        setOpen6(false);
        setOpen7(true);
        setOpen8(false);
        loadCoSchedulerAttempts(
          TargetTypes.CLUSTER,
          unixStartTime(60 * 6),
          unixCurrentTime(),
          stepConverter(5),
          ClusterMetricTypes.SCHEDULER_ATTEMPTS_TOTAL
        );
        setChartValueBottom("SCHEDULER_ATTEMPT_TOTAL");
        break;
      case 8:
        setOpen5(false);
        setOpen6(false);
        setOpen7(false);
        setOpen8(true);
        loadCoSchedulerRate(
          TargetTypes.CLUSTER,
          unixStartTime(60 * 6),
          unixCurrentTime(),
          stepConverter(5),
          ClusterMetricTypes.SCHEDULER_LATENCY
        );
        setChartValueBottom("SCHEDULER_LATENCY");
        break;

      default:
        break;
    }
  };

  const clusterNameActionList = clusterNames.map((item) => {
    return {
      name: item,
      onClick: () => {
        setClusterName(item);
        calledMetrics();
      },
    };
  });

  useEffect(() => {
    if (clusterName === "") {
      loadClusterNames(calledMetrics);
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
        style={{ height: "453px", margin: "5px 0 5px 0" }}
      >
        <div className="panelTitBar panelTitBar_clear">
          <div className="tit" style={{ color: "white " }}>
            Cluster Resource Usage
          </div>
        </div>

        <div className="tab1-panel-area">
          <div className="tab1-button-area">
            <COButtonCPU isOn={open1} onClick={() => changedTopState(1)} />
            <COButtonMemory isOn={open2} onClick={() => changedTopState(2)} />
            <COButtonDisk isOn={open3} onClick={() => changedTopState(3)} />
            <COButtonPod isOn={open4} onClick={() => changedTopState(4)} />
          </div>
          <div className="tab1-chart-area">
            <div className="tab-chart">
              <COAreaChartTop chartValue={chartValueTop} />
            </div>
          </div>
        </div>
      </PanelBox>
      <PanelBox
        className="panel_graph"
        style={{ height: "453px", margin: "5px 0 5px 0" }}
      >
        <div className="panelTitBar panelTitBar_clear">
          <div className="tit" style={{ color: "white " }}>
            Service Component Monitoring
          </div>
        </div>

        <div className="tab1-panel-area">
          <div className="tab1-button-area">
            <COButtonAPILatency
              isOn={open5}
              onClick={() => changedBottomState(5)}
            />
            <COButtonAPIRate
              isOn={open6}
              onClick={() => changedBottomState(6)}
            />
            <COButtonSchedulerAttempts
              isOn={open7}
              onClick={() => changedBottomState(7)}
            />
            <COButtonSchedulerRate
              isOn={open8}
              onClick={() => changedBottomState(8)}
            />
          </div>
          <div className="tab1-chart-area">
            <div className="tab-chart">
              <COAreaChartBottom chartValue={chartValueBottom} />
            </div>
          </div>
        </div>
      </PanelBox>
    </PanelBoxM>
  );
});
export default ClusterOverview;
