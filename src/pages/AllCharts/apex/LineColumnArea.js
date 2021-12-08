import React, { Component } from 'react';
import ReactApexChart from 'react-apexcharts';

class LineColumnArea extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [{
                name: 'Team A',
                type: 'column',
                data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30]
            }, {
                name: 'Team B',
                type: 'area',
                data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43]
            }, {
                name: 'Team C',
                type: 'line',
                data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39]
            }],
            options : {
                chart: {
                    stacked: false,
                    toolbar: {
                        show: false
                    }
                },
                stroke: {
                    width: [0, 2, 4],
                    curve: 'smooth'
                },
                plotOptions: {
                    bar: {
                        columnWidth: '50%'
                    }
                },
                colors: ['#f46a6a', '#556ee6', '#34c38f'],
                
                fill: {
                    opacity: [0.85, 0.25, 1],
                    gradient: {
                        inverseColors: false,
                        shade: 'light',
                        type: "vertical",
                        opacityFrom: 0.85,
                        opacityTo: 0.55,
                        stops: [0, 100, 100, 100]
                    }
                },
                labels: ['01/01/2003', '02/01/2003', '03/01/2003', '04/01/2003', '05/01/2003', '06/01/2003', '07/01/2003', '08/01/2003', '09/01/2003', '10/01/2003', '11/01/2003'],
                markers: {
                    size: 0
                },
                legend: {
                    offsetY: 11,
                },
                xaxis: {
                    type: 'datetime'
                },
                yaxis: {
                    title: {
                        text: 'Points',
                    },
                },
                tooltip: {
                    shared: true,
                    intersect: false,
                    y: {
                        formatter: function (y) {
                            if (typeof y !== "undefined") {
                                return y.toFixed(0) + " points";
                            }
                            return y;
              
                        }
                    }
                },
                grid: {
                    borderColor: '#f1f1f1'
                }
              }
        }
    }
    render() {
        return (
            <React.Fragment>
                <ReactApexChart options={this.state.options} series={this.state.series} type="line" height="350" />
            </React.Fragment>
        );
    }
}

export default LineColumnArea;