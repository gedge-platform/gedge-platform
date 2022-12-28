import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { observer } from "mobx-react";
import { monitoringStore } from "@/store";
import { ClusterMetricTypes } from "../../Utils/MetricsVariables";
import { unixCurrentTime, unixStartTime, unixToTime } from "../../Utils/MetricsVariableFormatter";

const PrAreaChart = observer(({ value }) => {
  const { lastTime, interval, allMetrics } = monitoringStore;

  let title = "";
  let metrics = [];
  let metricsY = 0;
  let dataMax = [];
  let maxData = 0;

  const searchMetrics = filter => {
    Object.entries(allMetrics).map(([key, value]) => {
      if (key === filter) {
        maxData = 0;
        value[0]?.values.forEach(element => {
          const tempMetrics = {
            time: unixToTime(element[0]),
            value: element[1],
          };
          metrics.push(tempMetrics);
          if (maxData < parseFloat(element[1])) {
            maxData = parseFloat(element[1]);
          }
        });
      }
    });
  };

  const searchMax = filter => {
    Object.entries(allMetrics).map(([key, value]) => {
      if (key === filter) {
        value[0]?.values.forEach(element => {
          metricsY = element[1];
        });
      }
    });
  };

  switch (value) {
    case ClusterMetricTypes.CPU_USAGE:
      title = "CPU Usage (Core)";
      searchMax("cpu_total");
      dataMax = [0, Number(metricsY)];
      searchMetrics(value);
      // dataMax = [0, Math.round(maxData * 1.2)];
      break;
    case ClusterMetricTypes.CPU_UTIL:
      title = "CPU Util (%)";
      // dataMax = [0, 100];
      // searchMetrics(value);
      searchMetrics(value);
      dataMax = [0, Math.round(maxData * 1.2)];
      break;
    case ClusterMetricTypes.CPU_TOTAL:
      title = "CPU Total (Core)";
      searchMetrics(value);
      break;
    case ClusterMetricTypes.MEMORY_USAGE:
      title = "Memory Usage (GB)";
      // searchMetrics(value);
      searchMax("memory_total");
      dataMax = [0, Number(metricsY)];
      searchMetrics(value);
      // dataMax = [0, Math.round(maxData * 1.2)];
      break;
    case ClusterMetricTypes.MEMORY_UTIL:
      title = "Memory Util (%)";
      // searchMetrics(value);
      // dataMax = [0, 100];
      searchMetrics(value);
      dataMax = [0, Math.round(maxData * 1.2)];
      break;
    case ClusterMetricTypes.MEMORY_TOTAL:
      title = "Memory Total (GB)";
      searchMetrics(value);
      break;
    case ClusterMetricTypes.DISK_USAGE:
      title = "Disk Usage (GB)";
      // searchMetrics(value);
      searchMax("disk_total");

      dataMax = [0, Number(metricsY)];
      searchMetrics(value);
      // dataMax = [0, Math.round(maxData * 1.2)];
      break;
    case ClusterMetricTypes.DISK_UTIL:
      title = "Disk Util (%)";
      // searchMetrics(value);
      // dataMax = [0, 100];
      searchMetrics(value);
      dataMax = [0, Math.round(maxData * 1.2)];
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
      searchMax("pod_quota");
      dataMax = [0, Number(metricsY)];
      // searchMetrics(value);
      searchMetrics(value);
      // dataMax = [0, Math.round(maxData * 1.2)];
      break;
    case ClusterMetricTypes.POD_UTIL:
      title = "Pod Util (%)";
      // searchMetrics(value);
      // dataMax = [0, 100];
      searchMetrics(value);
      dataMax = [0, Math.round(maxData * 1.2)];
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
          <YAxis type="number" domain={dataMax} />
          <Tooltip />
          <Area type="monotone" dataKey="value" stroke="#007EFF" fill="#0080ff30" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
});

export { PrAreaChart };
