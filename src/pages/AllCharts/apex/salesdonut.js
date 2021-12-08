import React, { Component } from 'react';
import ReactApexChart from 'react-apexcharts';

class Salesdonut extends Component {
    constructor(props) {
        super(props);

        this.state = {
            options: {
                dataLabels: {
                    enabled: false,
                },
                legend: {
                    show: false
                },
                plotOptions: {
                    pie: {
                        donut: {
                            size: '80%'
                        }
                    }
                },
                colors: ['#626ed4', '#02a499', '#f8b425'],
            },
            series: [54, 28, 17],
            labels: [1, 2, 3],


        }
    }
    render() {
        return (
            <React.Fragment>
                <ReactApexChart options={this.state.options} series={this.state.series} type="donut" height="220" />
            </React.Fragment>
        );
    }
}

export default Salesdonut;