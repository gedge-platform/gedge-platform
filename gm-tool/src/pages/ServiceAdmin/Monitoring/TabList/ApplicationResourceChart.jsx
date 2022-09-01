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
import monitoringStore from "@/store/Monitoring";
import {
  ClusterMetricTypes,
  AppMetricValues,
} from "@/pages/Gedge/Monitoring/Utils/MetricsVariables";
import {
  unixCurrentTime,
  unixStartTime,
  unixToTime,
} from "@/pages/Gedge/Monitoring/Utils/MetricsVariableFormatter";

const AppAreaChart = observer(({ value }) => {
  const { lastTime, interval, allMetrics, appMetrics } = monitoringStore;

  let title = "";
  let metrics = [];

  const fillMetrics = () => {
    for (
      let index = unixStartTime(lastTime.value);
      index < unixCurrentTime();
      index = index + 60 * interval.value
    ) {
      metrics.push({
        time: unixToTime(index),
        value: 0,
      });
    }
  };
  const searchMetrics = (filter, isApp) => {
    if (isApp) {
      Object.entries(appMetrics).map(([key, value]) => {
        if (key === filter) {
          if (value?.length === 0) {
            fillMetrics();
          } else {
            value[0]?.values.forEach((element) => {
              const tempMetrics = {
                time: unixToTime(element[0]),
                value: element[1],
              };
              metrics.push(tempMetrics);
            });
          }
        }
      });
    } else {
      Object.entries(allMetrics).map(([key, value]) => {
        if (key === filter) {
          if (value?.length === 0) {
            fillMetrics();
          } else {
            value[0]?.values.forEach((element) => {
              const tempMetrics = {
                time: unixToTime(element[0]),
                value: element[1],
              };
              metrics.push(tempMetrics);
            });
          }
        }
      });
    }
  };

  switch (value) {
    case ClusterMetricTypes.CPU_USAGE:
      title = "CPU Usage (Core)";
      searchMetrics(value, false);
      break;
    case ClusterMetricTypes.MEMORY_USAGE:
      title = "Memory Usage (GB)";
      searchMetrics(value, false);
      break;
    case AppMetricValues.POD_COUNT:
      title = "Pods";
      searchMetrics(value, true);
      break;
    case AppMetricValues.SERVICE_COUNT:
      title = "Services";
      searchMetrics(value, true);
      break;
    case AppMetricValues.DEVPLOYMENT_COUNT:
      title = "Deployments";
      searchMetrics(value, true);
      break;
    case AppMetricValues.CRONJOB_COUNT:
      title = "Cronjobs";
      searchMetrics(value, true);
      break;
    case AppMetricValues.JOB_COUNT:
      title = "Jobs";
      searchMetrics(value, true);
      break;
    case AppMetricValues.PV_COUNT:
      title = "PVs";
      searchMetrics(value, true);
      break;
    case AppMetricValues.PVC_COUNT:
      title = "PVCs";
      searchMetrics(value, true);
      break;
    case AppMetricValues.NAMESPACE_COUNT:
      title = "Namespaces";
      searchMetrics(value, true);
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
            top: 20,
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

export { AppAreaChart };
