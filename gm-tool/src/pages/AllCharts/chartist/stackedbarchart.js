import React, { Component } from "react";
import ChartistGraph from "react-chartist";

class stackedbarchart extends Component {
  render() {
    var barChartData = {
      labels: ["Q1", "Q2", "Q3", "Q4", "Q5", "Q6"],
      series: [
        [800000, 1200000, 1400000, 1300000, 1520000, 1400000],
        [200000, 400000, 500000, 300000, 452000, 500000],
        [160000, 290000, 410000, 600000, 588000, 410000]
      ]
    };
    var barChartOptions = {
      stackBars: true,
      axisY: {
        labelInterpolationFnc: function (value) {
          return value / 1000 + "k";
        }
      }
    };
    return (
      <React.Fragment>
        <ChartistGraph
          data={barChartData}
          style={{ height: "300px" }}
          options={barChartOptions}
          type={"Bar"}
        />
      </React.Fragment>
    );
  }
}

export default stackedbarchart;
