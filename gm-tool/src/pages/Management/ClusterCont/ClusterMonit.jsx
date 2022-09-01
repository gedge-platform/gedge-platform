import React, { useState, useEffect } from "react";
// import { observer } from "mobx-react";

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

const ClusterMonit = ((props) => {

    const data = [
        {
            "name": "Page A",
            "uv": 4000,
            "pv": 2400,
            "amt": 2400
        },
        {
            "name": "Page B",
            "uv": 3000,
            "pv": 1398,
            "amt": 2210
        },
        {
            "name": "Page C",
            "uv": 2000,
            "pv": 9800,
            "amt": 2290
        },
        {
            "name": "Page D",
            "uv": 2780,
            "pv": 3908,
            "amt": 2000
        },
        {
            "name": "Page E",
            "uv": 1890,
            "pv": 4800,
            "amt": 2181
        },
        {
            "name": "Page F",
            "uv": 2390,
            "pv": 3800,
            "amt": 2500
        },
        {
            "name": "Page G",
            "uv": 3490,
            "pv": 4300,
            "amt": 2100
        }
    ]
  
    return (
<>
<div style={{ height: "300px" }}>
                <ResponsiveContainer width="100%" height="100%">
          <LineChart width={800} height={340} data={data}
                    margin={{ top: 80, right: 30, left: 10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="pv" stroke="#8884d8" />
                    <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                </LineChart>

        </ResponsiveContainer>
        </div>
</>
    );
});
export default ClusterMonit;