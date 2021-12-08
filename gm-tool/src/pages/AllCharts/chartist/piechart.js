import React, { Component } from "react";
import ChartistGraph from "react-chartist";

class piechart extends Component {
  render() {
    var pieChartData = {
      series: [5, 3, 4],
      labels: ["42%", "25%", "33%"]
    };
    var pieChartOptions = {
      showLabel: true
    };
    return (
      <React.Fragment>
        <ChartistGraph
          data={pieChartData}
          options={pieChartOptions}
          style={{ height: "300px" }}
          type={"Pie"}
        />
      </React.Fragment>
    );
  }
}

export default piechart;
