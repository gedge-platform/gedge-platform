// import React, { useState, useEffect, PureComponent } from "react";
// import { observer } from "mobx-react";
// import Chart from "react-apexcharts";
// import { serviceAdminDashboardStore } from "@/store";

// const ServiceAdminChart = observer((props) => {
//   const { seriesData } = props;
//   const series = seriesData;
//   const { loadProjectName, resourceMetricData } = serviceAdminDashboardStore;

//   // const cronjob = resourceMetricData.filter(
//   //   (type) => type.metricType === "cronjob_count"
//   // );
//   // const cronjobMetrics = cronjob.map((item) => item.metrics[0]);

//   const option = {
//     chart: {
//       type: "line",
//       zoom: {
//         enabled: false,
//       },
//       toolbar: {
//         show: false,
//       },
//     },
//     dataLabels: {
//       enabled: false,
//     },
//     noData: {
//       text: "noData",
//       style: {
//         color: "#fff",
//       },
//     },
//     series: { seriesData },
//     stroke: {
//       width: [3, 5, 3],
//       curve: "straight",
//       dashArray: [0, 6, 3],
//     },
//     labels: {
//       datetimeFormatter: {
//         year: "yyyy",
//         month: "MMM 'yy",
//         day: "dd MMM",
//         hour: "HH:mm",
//       },
//     },
//     colors: ["#2E93fA", "#66DA26", "#546E7A", "#E91E63", "#FF9800", "#EAEAEA"],
//     legend: {
//       position: "top",
//       horizontalAlign: "right",
//       offsetY: 5,
//       labels: {
//         colors: "#fff",
//       },
//       markers: {
//         size: 0,
//         hover: {
//           sizeOffset: 6,
//         },
//       },
//     },
//     grid: {
//       show: false,
//       yaxis: {
//         lines: {
//           show: true,
//         },
//       },
//       padding: {
//         bottom: 20,
//       },
//     },
//     xaxis: {
//       // type: "datetime",
//       tooltip: {
//         enabled: false,
//       },
//       // type: "category",
//       tickPlacement: "between",
//       labels: {
//         show: true,
//         style: {
//           colors: "white",
//           fontSize: "12px",
//         },
//         datetimeUTC: true,
//         datetimeFormatter: {
//           year: "yyyy",
//           month: "MMM 'yy",
//           day: "dd MMM",
//           hour: "HH:mm",
//         },
//       },
//     },
//     yaxis: {
//       labels: {
//         show: true,
//         style: {
//           colors: ["#fff"],
//         },
//       },
//       min: 0,
//       max: 30,
//       showForNullSeries: true,
//       tickAmount: 5, // y축 간격. 숫자가 작을수록 간격이 넓어짐
//     },
//     tooltip: {
//       enabled: true,
//       theme: "dark",
//     },
//   };

//   useEffect(() => {
//     loadProjectName();
//   }, []);

//   return (
//     <div style={{ width: "100%", height: "100%" }}>
//       <Chart
//         options={option}
//         series={series}
//         type="line"
//         // width="100%"
//         height={290}
//       />
//     </div>

//     // <div style={{ width: "100%", height: "100%" }}>
//     //   <div
//     //     style={{
//     //       paddingLeft: "20px",
//     //       paddingTop: "10px",
//     //       // color: "#929da5",
//     //       color: "darkgray",
//     //       fontWeight: "bold",
//     //     }}
//     //   ></div>

//     //   <ResponsiveContainer>
//     //     <LineChart
//     //       data={cronjobMetrics}
//     //       // 그래프 크기 조절
//     //       margin={{
//     //         top: 5,
//     //         right: 20,
//     //         left: -35,
//     //         bottom: 5,
//     //       }}
//     //     >
//     //       <CartesianGrid
//     //         strokeWidth={0.3}
//     //         vertical={false}
//     //         strokeDasharray="2 2"
//     //       />
//     //       <XAxis dataKey="time" />
//     //       <YAxis dataKey="value" domain={[0, 50]} />
//     //       <Tooltip />
//     //       <Line
//     //         type="monotone"
//     //         dataKey="deployment"
//     //         stroke="#FF5A5A"
//     //         strokeDasharray="3 3"
//     //         activeDot={{ r: 3 }}
//     //       />
//     //     </LineChart>
//     //   </ResponsiveContainer>
//     // </div>
//   );
// });

// export default ServiceAdminChart;

import React, { useState, useEffect, PureComponent } from "react";
import { observer } from "mobx-react";
import Chart from "react-apexcharts";
import { serviceAdminDashboardStore } from "@/store";

const ServiceAdminChart = observer((props) => {
  const { seriesData } = props;
  const series = seriesData;
  const { loadProjectName, resourceMetricData } = serviceAdminDashboardStore;

  // const cronjob = resourceMetricData.filter(
  //   (type) => type.metricType === "cronjob_count"
  // );
  // const cronjobMetrics = cronjob.map((item) => item.metrics[0]);

  const option = {
    chart: {
      type: "line",
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    noData: {
      text: "noData",
      style: {
        color: "#fff",
      },
    },
    series: { seriesData },
    stroke: {
      width: [3, 5, 3],
      curve: "straight",
      dashArray: [0, 6, 3],
    },
    labels: {
      datetimeFormatter: {
        year: "yyyy",
        month: "MMM 'yy",
        day: "dd MMM",
        hour: "HH:mm",
      },
    },
    colors: ["#2E93fA", "#66DA26", "#546E7A", "#E91E63", "#FF9800", "#EAEAEA"],
    legend: {
      position: "top",
      horizontalAlign: "right",
      offsetY: 5,
      labels: {
        colors: "#fff",
      },
      markers: {
        size: 0,
        hover: {
          sizeOffset: 6,
        },
      },
    },
    grid: {
      show: false,
      yaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        bottom: 20,
      },
    },
    xaxis: {
      // type: "datetime",
      tooltip: {
        enabled: false,
      },
      // type: "category",
      tickPlacement: "between",
      labels: {
        show: true,
        style: {
          colors: "white",
          fontSize: "12px",
        },
        datetimeUTC: true,
        datetimeFormatter: {
          year: "yyyy",
          month: "MMM 'yy",
          day: "dd MMM",
          hour: "HH:mm",
        },
      },
    },
    yaxis: {
      labels: {
        show: true,
        style: {
          colors: ["#fff"],
        },
      },
      min: 0,
      max: 30,
      showForNullSeries: true,
      tickAmount: 5, // y축 간격. 숫자가 작을수록 간격이 넓어짐
    },
    tooltip: {
      enabled: true,
      theme: "dark",
    },
  };

  useEffect(() => {
    // loadProjectName();
  }, []);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Chart
        options={option}
        series={series}
        type="line"
        // width="100%"
        height={290}
      />
    </div>

    // <div style={{ width: "100%", height: "100%" }}>
    //   <div
    //     style={{
    //       paddingLeft: "20px",
    //       paddingTop: "10px",
    //       // color: "#929da5",
    //       color: "darkgray",
    //       fontWeight: "bold",
    //     }}
    //   ></div>

    //   <ResponsiveContainer>
    //     <LineChart
    //       data={cronjobMetrics}
    //       // 그래프 크기 조절
    //       margin={{
    //         top: 5,
    //         right: 20,
    //         left: -35,
    //         bottom: 5,
    //       }}
    //     >
    //       <CartesianGrid
    //         strokeWidth={0.3}
    //         vertical={false}
    //         strokeDasharray="2 2"
    //       />
    //       <XAxis dataKey="time" />
    //       <YAxis dataKey="value" domain={[0, 50]} />
    //       <Tooltip />
    //       <Line
    //         type="monotone"
    //         dataKey="deployment"
    //         stroke="#FF5A5A"
    //         strokeDasharray="3 3"
    //         activeDot={{ r: 3 }}
    //       />
    //     </LineChart>
    //   </ResponsiveContainer>
    // </div>
  );
});

export default ServiceAdminChart;
