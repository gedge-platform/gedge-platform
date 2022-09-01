import { display, padding } from "@mui/system";
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
import { unixToTime } from "../../Utils/MetricsVariableFormatter";

const APIAreaChart = observer(({ value }) => {
  const { allMetrics } = monitoringStore;

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
    case ClusterMetricTypes.APISERVER_REQUEST_RATE:
      title = "API Server Request Rate";
      searchMetrics(value);
      break;
    case ClusterMetricTypes.APISERVER_LATENCY:
      title = "API Server Latency";
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
            top: 40,
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

export { APIAreaChart };
