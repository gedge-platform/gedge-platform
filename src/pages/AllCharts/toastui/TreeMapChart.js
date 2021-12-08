import React, { Component } from "react";

import "tui-chart/dist/tui-chart.css";
import { TreeMapChart } from "@toast-ui/react-chart";
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
        series: {
            colors: [
                '#556ee6', '#34c38f', '#f46a6a', '#50a5f1', '#f1b44c'
            ]
        },
        label: {
            color: '#fff',
            fontFamily: 'sans-serif'
        }
    }
};
TuiChart.registerTheme('skoteTheme', theme);

class TreeMapChartToast extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const data = {
            series: [
                {
                    label: 'Documents',
                    children: [
                        {
                            label: 'docs',
                            children: [
                                {
                                    label: 'pages',
                                    value: 1.3
                                },
                                {
                                    label: 'keynote',
                                    value: 2.5
                                },
                                {
                                    label: 'numbers',
                                    value: 1.2
                                }
                            ]
                        },
                        {
                            label: 'photos',
                            value: 5.5
                        },
                        {
                            label: 'videos',
                            value: 20.7
                        }
                    ]
                }, {
                    label: 'Downloads',
                    children: [
                        {
                            label: 'recents',
                            value: 5.3
                        }, {
                            label: '2015',
                            value: 10.1
                        }, {
                            label: '2014',
                            value: 8.2
                        }
                    ]
                }, {
                    label: 'Application',
                    value: 16.4
                }, {
                    label: 'Desktop',
                    value: 4.5
                }
            ]
        };

        var options = {
            chart: {
                width: this.props.chartWidth,
                height: 380,
                title: 'Used disk space'
            },
            series: {
                showLabel: true,
                zoomable: false,
                useLeafLabel: true
            },
            
            tooltip: {
                suffix: 'GB'
            }
        };
    
        return (
            <React.Fragment>
                <TreeMapChart data={data} options={options} theme={theme} />
            </React.Fragment>
        );
    }
}

export default TreeMapChartToast;
