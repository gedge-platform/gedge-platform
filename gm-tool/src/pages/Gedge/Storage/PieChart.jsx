import React, { Component } from "react";
import Chart from "react-apexcharts";
import { observer } from "mobx-react";

const PieChart = observer((props) => {
  const { total, label, value, customOption } = props;

  const options = {
    labels: label,
    chart: {
      type: "donut",
    },
    ...customOption,
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: "100%",
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
    legend: {
      show: false,
    },
    plotOptions: {
      pie: {
        horizontal: true,
        barHeight: "60%",
        borderRadius: 5, // Here is the issue ...
        donut: {
          size: "60%",
          background: "transparent",
          borderRadius: 25,
          labels: {
            show: true,
            borderRadius: 25,
            name: {
              show: true,

              fontSize: "20px",
              color: "#fff",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 600,
              // color: undefined,
              offsetY: -10,
              borderRadius: 100,
              formatter: function (val) {
                return val;
              },
            },
            value: {
              show: true,
              label: "Total",
              borderRadius: 25,
              fontSize: "16px",
              color: "#fff",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 400,
              // color: undefined,
              offsetY: 12,
              formatter: function (val) {
                return val;
              },
            },
            total: {
              show: total,
              showAlways: false,
              borderRadius: 25,
              label: "Total",
              fontSize: "20px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 600,
              color: "#fff",
              formatter: function (w) {
                const a = parseFloat(w.globals.seriesTotals[0]);
                const b = parseFloat(w.globals.seriesTotals[1]);
                const seriesTotal = a + b;

                if (isNaN(seriesTotal)) {
                  return "N/A"; // 숫자가 아닌 경우에 대한 처리
                }

                if (seriesTotal > 1023) {
                  return (seriesTotal / 1024).toFixed(2) + "TB";
                } else {
                  return seriesTotal.toFixed(2) + "GB";
                }
              },
            },
          },
        },
      },
    },
  };
  const series = value;

  return (
    <div className="donut">
      <Chart options={options} series={series} type="donut" width="100%" />
    </div>
  );
});
export default PieChart;
