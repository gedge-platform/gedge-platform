import React, { Component } from "react";

import "tui-chart/dist/tui-chart.css";
import { RadialChart } from "@toast-ui/react-chart";
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
            '#556ee6', '#34c38f', '#f1b44c', '#f46a6a'
        ]
    }
};
TuiChart.registerTheme('skoteTheme', theme);

class RadialChartToast extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const data = {
            categories: ["Jan", "Feb", "Mar", "April", "May", "Jun"],
    series: [
        {
            name: 'Budget',
            data: [5000, 3000, 5000, 7000, 6000, 4000]
        },
        {
            name: 'Income',
            data: [8000, 8000, 7000, 2000, 5000, 3000]

        },
        {
            name: 'Expenses',
            data: [4000, 4000, 6000, 3000, 4000, 5000]
        },
        {
            name: 'Debt',
            data: [6000, 3000, 3000, 1000, 2000, 4000]
        }
    ]
        };

const options = {
    chart: {
        title: 'Annual Incomes',
        width: this.props.chartWidth,
        height: 380
    },
    series: {
        showDot: false,
        showArea: false
    },
    plot: {
        type: 'circle'
    },
    legend: {
        align: 'bottom'
    }
};
    
        return (
            <React.Fragment>
                <RadialChart data={data} options={options} theme={theme} />
            </React.Fragment>
        );
    }
}

export default RadialChartToast;
