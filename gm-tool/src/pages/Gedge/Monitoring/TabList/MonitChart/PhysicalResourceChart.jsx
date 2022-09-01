import React, { useState, useEffect, PureComponent } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { observer } from "mobx-react";
import monitoringStore from "../../../../../store/Monitoring";
import { ClusterMetricTypes } from "../../Utils/MetricsVariables";
import {
  unixCurrentTime,
  unixStartTime,
  unixToTime,
} from "../../Utils/MetricsVariableFormatter";

const PrAreaChart = observer(({ value }) => {
  const { lastTime, interval, allMetrics } = monitoringStore;

  let title = "";
  let metrics = [];

  const searchMetrics = (filter) => {
    Object.entries(allMetrics).map(([key, value]) => {
      if (key === filter) {
        value[0]?.values.forEach((element) => {
          const tempMetrics = {
            time: unixToTime(element[0]),
            value: element[1],
          };
          metrics.push(tempMetrics);
        });
      }
    });
  };

  switch (value) {
    case ClusterMetricTypes.CPU_USAGE:
      title = "CPU Usage (Core)";
      searchMetrics(value);
      break;
    case ClusterMetricTypes.CPU_UTIL:
      title = "CPU Util (%)";
      searchMetrics(value);
      break;
    case ClusterMetricTypes.CPU_TOTAL:
      title = "CPU Total (Core)";
      searchMetrics(value);
      break;
    case ClusterMetricTypes.MEMORY_USAGE:
      title = "Memory Usage (GB)";
      searchMetrics(value);
      break;
    case ClusterMetricTypes.MEMORY_UTIL:
      title = "Memory Util (%)";
      searchMetrics(value);
      break;
    case ClusterMetricTypes.MEMORY_TOTAL:
      title = "Memory Total (GB)";
      searchMetrics(value);
      break;
    case ClusterMetricTypes.DISK_USAGE:
      title = "Disk Usage (GB)";
      searchMetrics(value);
      break;
    case ClusterMetricTypes.DISK_UTIL:
      title = "Disk Util (%)";
      searchMetrics(value);
      break;
    case ClusterMetricTypes.DISK_TOTAL:
      title = "Disk Total (GB)";
      searchMetrics(value);
      break;
    case ClusterMetricTypes.POD_QUOTA:
      title = "Pod_Quota";
      searchMetrics(value);
      break;
    case ClusterMetricTypes.POD_RUNNING:
      title = "Pod Running";
      searchMetrics(value);
      break;
    case ClusterMetricTypes.POD_UTIL:
      title = "Pod Util (%)";
      searchMetrics(value);
      break;
    default:
      break;
  }

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div
        style={{
          paddingLeft: "20px",
          paddingTop: "20px",
          color: "#929da5",
          fontWeight: "bold",
        }}
      >
        {title}
      </div>
      <ResponsiveContainer>
        <AreaChart
          data={metrics}
          margin={{
            top: 10,
            right: 30,
            left: -15,
            bottom: 30,
          }}
        >
          <CartesianGrid
            // horizontalPoints="3 3"
            strokeWidth={0.3}
            vertical={false}
            strokeDasharray="3 5"
          />
          <XAxis tickLine="false" dataKey="time" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#007EFF"
            fill="#0080ff30"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
});

export { PrAreaChart };
