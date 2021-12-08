import React, { Component } from "react";
import ChartistGraph from "react-chartist";

class chartbar extends Component {
  render() {
    var barChartData = {
      labels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9", "W10"],
      series: [[1, 2, 4, 8, 6, -2, -1, -4, -6, -2]]
    };
    var barChartOptions = {
      high: 10,
      low: -10
    };
    return (
      <React.Fragment>
        <ChartistGraph
          style={{ height: "300px" }}
          data={barChartData}
          options={barChartOptions}
          type={"Bar"}
        />
      </React.Fragment>
    );
  }
}

export default chartbar;
