import React, { useState } from "react";
import Chart from "react-apexcharts";
import { observer } from "mobx-react";

const AreaCharts = observer((props) => {
  const { seriesData } = props;
  console.log(seriesData)
  const categoryArray = ["enero", "febrero", "marzo", "abril", "mayo"];


  const option = {
    chart: {
      // stacked: true,
      width: "100%",
      toolbar: {
        show: false
      },
      // stackType: "normal"
    },
    // responsive: [{
    //   breakpoint: 480,
    //   options: {
    //     chart: {
    //       height: "100%"
    //     },
    //   }
    // }],
    colors: ["#4893fd", "#ff7a6d", "#7f73ff", "#161571", "#3b3f45"],
    fill: {
      // type: "solid",
      // opacity: 1
    },
    stroke: {
      width: 1,
      colors: ["#fff"]
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      offsetY: 5,
      labels: {
        colors: "#fff",
      },
      markers: {
        radius: 12
      }
    },
    grid: {
      show: false,
      yaxis: {
        lines: {
          show: true
        }
      },
      xaxis: {
        lines: {
          show: false
        }
      },
      padding: {
        bottom: 20
      }
    },
    dataLabels: {
      enabled: false
    },
    // plotOptions: {
    //   bar: {
    //     barHeight: "98%",
    //     dataLabels: {
    //       position: "center",
    //       hideOverflowingLabels: true
    //     }
    //   }
    // },
    xaxis: {
      tooltip: {
        enabled: false,
      },
      // type: 'category',
      tickPlacement: "between",
      labels: {
        show: true,
        style: {
          colors: 'white',
          fontSize: '12px'
        },
      }

    },
    yaxis: {
      labels: {
        show: true,
        style: {
          colors: ["#fff"],
        }
      }
    },
    tooltip: {
      enabled: true,
      theme: "dark",
    }
  };
  const series = seriesData
  //   [
  //   {
  //     name: "applied",
  //     data: [
  //       { x: "28-Feb-2017 GMT", y: 34 },
  //       { x: "31-Mar-2017 GMT", y: 43 },
  //       { x: "30-Apr-2017 GMT", y: 31 },
  //       { x: "31-May-2017 GMT", y: 43 },
  //       { x: "30-Jun-2017 GMT", y: 33 },
  //       { x: "31-Jul-2017 GMT", y: 52 }
  //     ]
  //   },
  //   {
  //     name: "uploaded",
  //     data: [
  //       { x: "28-Feb-2017 GMT", y: 34 },
  //       { x: "31-Mar-2017 GMT", y: 43 },
  //       { x: "30-Apr-2017 GMT", y: 31 },
  //       { x: "31-May-2017 GMT", y: 43 },
  //       { x: "30-Jun-2017 GMT", y: 33 },
  //       { x: "31-Jul-2017 GMT", y: 52 }
  //     ]
  //   },
  //   {
  //     name: "recommended",
  //     data: [
  //       { x: "28-Feb-2017 GMT", y: 34 },
  //       { x: "31-Mar-2017 GMT", y: 43 },
  //       { x: "30-Apr-2017 GMT", y: 31 },
  //       { x: "31-May-2017 GMT", y: 43 },
  //       { x: "30-Jun-2017 GMT", y: 33 },
  //       { x: "31-Jul-2017 GMT", y: 52 }
  //     ]
  //   }
  // ]



  return (
    <div >
      <Chart
        options={option}
        series={series}
        type="area"
        width="100%"
        height="100%"
      />
    </div >)
    ;

});
export default AreaCharts;
