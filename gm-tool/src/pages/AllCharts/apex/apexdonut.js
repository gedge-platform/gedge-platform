import React, { Component } from 'react';
import ReactApexChart from 'react-apexcharts';

class RadialChart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            options: {
                plotOptions: {
                    radialBar: {
                        hollow: {
                            size: '45%',
                        },
                        dataLabels: {
                            value: {
                                show: false
                            }
                        }
                    },
                },
                colors: ['rgb(2, 164, 153)'],
                labels: ['']
            },
            series: [80],
        }
    }

    render() {
        return (
            <React.Fragment>
                <ReactApexChart options={this.state.options} series={this.state.series} type="radialBar" height="320" />
            </React.Fragment>
        );
    }
}

export default RadialChart;