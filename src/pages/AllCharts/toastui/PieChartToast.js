import React, { Component } from "react";

import "tui-chart/dist/tui-chart.css";
import { PieChart } from "@toast-ui/react-chart";
import TuiChart from 'tui-chart';
import "./toastui.scss";

var theme = {
  chart: {
    background: {
        color: '#fff',
        opacity: 0
    },
},
title: {
    color: '#8791af',
},

plot: {
    lineColor: 'rgba(166, 176, 207, 0.1)'
},
legend: {
    label: {
        color: '#8791af'
    }
},
series: {
    colors: [
        '#556ee6', '#34c38f', '#f46a6a', '#50a5f1', '#f1b44c'
    ]
}
};
TuiChart.registerTheme('skoteTheme', theme);

class PieChartToast extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const data = {
      categories: ['Browser'],
      series: [
          {
              name: 'Chrome',
              data: 46.02
          },
          {
              name: 'IE',
              data: 20.47
          },
          {
              name: 'Firefox',
              data: 17.71
          },
          {
              name: 'Safari',
              data: 5.45
          },
          {
              name: 'Etc',
              data: 10.35
          }
      ]
    };

    const options = {
      chart: {
        width: this.props.chartWidth,
        height: 380,
        title: 'Usage share of web browsers'
    },
    tooltip: {
        suffix: '%'
    }
    };

    return (
      <React.Fragment>
        <PieChart data={data} options={options} />
      </React.Fragment>
    );
  }
}

export default PieChartToast;
