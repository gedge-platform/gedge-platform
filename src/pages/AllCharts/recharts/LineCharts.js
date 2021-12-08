import React, { useState, useEffect } from "react";
import { observer } from "mobx-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  ResponsiveContainer,
  AreaChart
} from "recharts";


function Unix_timestamp(t) {
  var date = new Date(t * 1000);
  var year = date.getFullYear();
  var month = "0" + (date.getMonth() + 1);
  var day = "0" + date.getDate();
  var hour = "0" + date.getHours();
  var minute = "0" + date.getMinutes();
  var second = "0" + date.getSeconds();

  return (
    // year +
    // "-" +
    // month.substr(-2) +
    // "-" +
    // day.substr(-2) +
    // " " +
    // hour.substr(-2) +s
    // ":" +
    // minute.substr(-2) +
    // ":" +
    // second.substr(-2)

    hour.substr(-2) + ":" + minute.substr(-2) + ":" + second.substr(-2)
  );
}

function Unix_timestampConv() {
  return Math.floor(new Date().getTime() / 1000);
}

const LineCharts = ((props) => {

  const { kind, cluster_data = []} = props;
  let data = [];

  cluster_data.map((value) => {
          data.push({
            time: Unix_timestamp(value[0]),
            [kind]: value[1] * 1,
          });
  })
  // console.log(data,kind)
  return (
  
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
        width={1500}
        height={200}
        data={data}
          margin={{
            top: 0,
            right: 10,
            left: -20,
            bottom: 0,
          }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
          <Tooltip />
        <Area type="monotone" dataKey={kind} stroke="#4472C4" fill="#E9F4F1" />
        {/* <Line type="monotone" dataKey={kind} stroke="#5A61FF" /> */}
        </AreaChart>
      </ResponsiveContainer>
    
  );
});
export default LineCharts;
