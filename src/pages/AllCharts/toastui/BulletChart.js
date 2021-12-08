import React, { Component } from "react";

import "tui-chart/dist/tui-chart.css";
import { BulletChart } from "@toast-ui/react-chart";
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
            '#556ee6', '#34c38f','#f1b44c', '#f46a6a'
        ],
        ranges: [{ color: '#eee', opacity: 0.7 },
            null,
            { color: '#556ee6' }
        ]
    }
};
TuiChart.registerTheme('skoteTheme', theme);

class BulletChartToast extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const data = {
            categories: ['July', 'August'],
    series: [{
        name: 'Budget',
        data: 25,
        markers: [28, 2, 15],
        ranges: [[-1, 10], [10, 20], [20, 30]]
    }, {
        name: 'Hello',
        data: 11,
        markers: [20],
        ranges: [[0, 8], [8, 15]]
    }, {
        name: 'World',
        data: 30,
        markers: [25],
        ranges: [[0, 10], [10, 19], [19, 28]]
    }, {
        name: 'Income',
        data: 23,
        markers: [],
        ranges: [[19, 25], [13, 19], [0, 13]]
    }]
        };

const options = {
    chart: {
        width: this.props.chartWidth,
        height: 380,
        title: 'Monthly Revenue',
        format: '1,000'
    },
    legend: {
        visible: true
    },
    xAxis: {
        max: 35
    },
    series: {
        showLabel: true,
        vertical: false
    }
};
    
        return (
            <React.Fragment>
                <BulletChart data={data} options={options} theme={theme} />
            </React.Fragment>
        );
    }
}

export default BulletChartToast;
