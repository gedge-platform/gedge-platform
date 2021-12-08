import React, { Component } from "react";

import "tui-chart/dist/tui-chart.css";
import { LineChart } from "@toast-ui/react-chart";
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
xAxis: {
    title: {
        color: '#8791af'
    },
    label: {
        color: '#8791af'
    },
    tickColor: '#8791af'
},
yAxis: {
    title: {
        color: '#8791af'
    },
    label: {
        color: '#8791af'
    },
    tickColor: '#8791af'
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
        '#f46a6a', '#34c38f', '#556ee6'
    ]
}
};
TuiChart.registerTheme('skoteTheme', theme);

class LineChartToast extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const data = {
      categories: ['June', 'July', 'Aug', 'Sep', 'Oct', 'Nov'],
    series: [
        {
            name: 'Budget',
            data: [5000, 3000, 6000, 3000, 6000, 4000]
        },
        {
            name: 'Income',
            data: [8000, 1000, 7000, 2000, 5000, 3000]
        },
        {
            name: 'Outgo',
            data: [900, 6000, 1000, 9000, 3000, 1000]
        }
    ]
    };

    const options = {
      chart: {
        width: this.props.chartWidth,
        height: 380,
        title: '24-hr Average Temperature'
    },
    yAxis: {
        title: 'Amount',
        pointOnColumn: true
    },
    xAxis: {
        title: 'Month'
    },
    series: {
        spline: true,
        showDot: false
    },
    tooltip: {
        suffix: '°C'
    }
    };

    return (
      <React.Fragment>
        <LineChart data={data} options={options} />
      </React.Fragment>
    );
  }
}

export default LineChartToast;
