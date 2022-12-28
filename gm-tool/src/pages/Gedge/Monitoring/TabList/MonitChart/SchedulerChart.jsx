import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { observer } from "mobx-react";
import { monitoringStore } from "@/store";
import { ClusterMetricTypes } from "../../Utils/MetricsVariables";
import { unixToTime, unixStartTime, unixCurrentTime } from "../../Utils/MetricsVariableFormatter";

const SchedulerAreaChart = observer(({ value }) => {
  const { allMetrics, lastTime, interval } = monitoringStore;
  console.log(allMetrics);

  let title = "";
  let metrics = [];

  const searchMetrics = filter => {
    Object.entries(allMetrics).map(([key, value]) => {
      console.log(["key: ", key, "value:", value]);
      if (key === filter) {
        if (value?.length === 0) {
          for (let index = unixStartTime(lastTime.value); index < unixCurrentTime(); index = index + 60 * interval.value) {
            const tempMetrics = {
              time: unixToTime(index),
              value: 0,
            };
            metrics.push(tempMetrics);
          }
        } else {
          value[0]?.values.forEach(element => {
            const tempMetrics = {
              time: unixToTime(element[0]),
              value: element[1],
            };
            metrics.push(tempMetrics);
          });
        }
      }
    });
  };

  switch (value) {
    case ClusterMetricTypes.SCHEDULER_ATTEMPTS_TOTAL:
      title = "Scheduler Attpemts Total";
      searchMetrics(value);
      break;
    case ClusterMetricTypes.SCHEDULER_FAIL_TOTAL:
      title = "Scheduler Fail Total";
      searchMetrics(value);
      break;
    case ClusterMetricTypes.SCHEDULER_LATENCY:
      title = "Scheduler Latency";
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
          <Area type="monotone" dataKey="value" stroke="#007EFF" fill="#0080ff30" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
});

export { SchedulerAreaChart };
