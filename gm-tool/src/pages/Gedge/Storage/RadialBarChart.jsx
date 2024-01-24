import React, { Component } from "react";
import Chart from "react-apexcharts";
import { observer } from "mobx-react";

const RadialBarChart = observer((props) => {
  const { label, value } = props;
  const options = {
    chart: {
      height: 275,
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        offsetY: 0,
        startAngle: 0,
        endAngle: 270,
        hollow: {
          margin: 5,
          size: "20%",
          background: "transparent",
          image: undefined,
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            show: false,
          },
        },
      },
    },
    colors: ["#1ab7ea", "#0084ff", "#39539E", "#0077B5"],
    labels: label,
    legend: {
      show: true,
      floating: true,
      fontSize: "14px",
      // fontFamily: "Helvetica, Arial, sans-serif",
      position: "left",
      offsetX: 0,
      offsetY: 8,
      labels: {
        useSeriesColors: true,
        fontFamily: "Helvetica, Arial, sans-serif",
      },
      markers: {
        size: 0,
      },
      formatter: function (seriesName, opts) {
        return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex];
      },
      itemMargin: {
        vertical: 3,
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            show: false,
          },
        },
      },
    ],
  };
  const series = value;

  return (
    <div className="donut">
      <Chart options={options} series={series} type="radialBar" width="275" />
    </div>
  );
});
export default RadialBarChart;
