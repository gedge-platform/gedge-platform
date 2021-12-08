import React, { Component } from "react";

import "tui-chart/dist/tui-chart.css";
import { BoxPlotChart } from "@toast-ui/react-chart";
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
            '#556ee6', '#34c38f'
        ]
    }
};
TuiChart.registerTheme('skoteTheme', theme);

class BoxPlotChartToast extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const data = {
            categories: ['Budget', 'Income', 'Expenses', 'Debt'],
            series: [{
                name: '2015',
                data: [
                    [1000, 2500, 3714, 5500, 7000],
                    [1000, 2750, 4571, 5250, 8000],
                    [3000, 4000, 4714, 6000, 7000],
                    [1000, 2250, 3142, 4750, 6000]
                ],
                outliers: [
                    [0, 14000],
                    [2, 10000],
                    [3, 9600]
                ]
            }, {
                name: '2016',
                data: [
                    [2000, 4500, 6714, 11500, 13000],
                    [3000, 5750, 7571, 8250, 9000],
                    [5000, 8000, 8714, 9000, 10000],
                    [7000, 9250, 10142, 11750, 12000]
                ],
                outliers: [
                    [1, 14000]
                ]
            }]
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
        max: 15000
    },
    xAxis: {
        title: 'Month'
    },
    legend: {
        align: 'bottom'
    }
};
    
        return (
            <React.Fragment>
                <BoxPlotChart data={data} options={options} theme={theme} />
            </React.Fragment>
        );
    }
}

export default BoxPlotChartToast;
