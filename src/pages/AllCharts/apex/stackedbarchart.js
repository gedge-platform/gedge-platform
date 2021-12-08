import React, { Component } from 'react';
import ReactApexChart from 'react-apexcharts';

class stackedbarchart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            options: {
                colors: ['#3c4ccf', '#f0f1f4'],
                chart: {
                    stacked: true,
                    toolbar: {
                        show: false,
                    },
                },
                dataLabels: {
                    enabled: false,
                },
                plotOptions: {
                    bar: {
                        columnWidth: '40%',
                    },
                },
                grid: {
                    borderColor: '#f8f8fa',
                    row: {
                        colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
                        opacity: 0.5
                    },
                },

                xaxis: {
                    categories: [2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018],
                    labels: {
                        formatter: function (val) {
                            return val
                        },
                    },
                    axisBorder: {
                        show: false
                    },
                    axisTicks: {
                        show: false
                    }
                },
                yaxis: {
                    title: {
                        text: undefined
                    },
                },
                tooltip: {
                    y: {
                        formatter: function (val) {
                            return val
                        }
                    }
                },
                fill: {
                    opacity: 1
                },

                legend: {
                    show: false,
                    position: 'top',
                    horizontalAlign: 'left',
                    offsetX: 40
                }
            },
            series: [{
                name: 'Series A',
                data: [45, 75, 100, 75, 100, 75, 50, 75, 50, 75, 100, 80]
            }, {
                name: 'Series B',
                data: [180, 65, 90, 65, 90, 65, 40, 65, 40, 65, 90, 65]
            }],
        }
    }
    render() {
        return (
            <React.Fragment>
                <ReactApexChart options={this.state.options} series={this.state.series} type="bar" height="290" />
            </React.Fragment>
        );
    }
}

export default stackedbarchart;