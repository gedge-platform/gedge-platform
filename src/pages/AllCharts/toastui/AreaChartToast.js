import React, { Component } from "react";

import "tui-chart/dist/tui-chart.css";
import { AreaChart } from "@toast-ui/react-chart";
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

class AreaChartToast extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const data = {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    series: [
        {
            name: 'Seoul',
            data: [20, 40, 25, 50, 15, 45, 33, 34, 20, 30, 22, 13]
        },
        {
            name: 'Sydney',
            data: [5, 30, 21, 18, 59, 50, 28, 33, 7, 20, 10, 30]
        },
        {
            name: 'Moskva',
            data: [30, 5, 18, 21, 33, 41, 29, 15, 30, 10, 33, 5]
        }
    ]
    };

    const options = {
      chart: {
        width: this.props.chartWidth,
        height: 380,
        title: '24-hr Average Temperature'
    },
    series: {
        zoomable: true,
        showDot: false,
        areaOpacity: 1
    },
    yAxis: {
        title: 'Temperature (Celsius)',
        pointOnColumn: true
    },
    xAxis: {
        title: 'Month'
    },
    tooltip: {
        suffix: '°C'
    }
    };

    return (
      <React.Fragment>
        <AreaChart data={data} options={options} />
      </React.Fragment>
    );
  }
}

export default AreaChartToast;
