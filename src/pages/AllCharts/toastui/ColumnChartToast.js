import React, { Component } from "react";

import "tui-chart/dist/tui-chart.css";
import { ColumnChart } from "@toast-ui/react-chart";
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
        '#34c38f', '#556ee6', '#f46a6a'
    ]
}
};
TuiChart.registerTheme('skoteTheme', theme);

class ColumnChartToast extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const data = {
      categories: ['Jun, 2019', 'Jul, 2019', 'Aug, 2019', 'Sep, 2019', 'Oct, 2019', 'Nov, 2019', 'Dec, 2019'],
    series: [
        {
            name: 'Budget',
            data: [5000, 3000, 5000, 7000, 6000, 4000, 1000]
        },
        {
            name: 'Income',
            data: [8000, 1000, 7000, 2000, 6000, 3000, 5000]
        },
        {
            name: 'Expenses',
            data: [4000, 4000, 6000, 3000, 4000, 5000, 7000]
        }
    ]
    };

    const options = {
      chart: {
        width: this.props.chartWidth,
        height: 380,
        title: 'Monthly Revenue',
        format: '1,000'
    },
    yAxis: {
        title: 'Amount',
        min: 0,
        max: 9000
    },
    xAxis: {
        title: 'Month'
    },
    legend: {
        align: 'top'
    }
    };

    return (
      <React.Fragment>
        <ColumnChart data={data} options={options} />
      </React.Fragment>
    );
  }
}

export default ColumnChartToast;
