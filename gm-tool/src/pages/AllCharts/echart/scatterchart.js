import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';

class Scatter extends Component {
    getOption = () => {
        return {
            tooltip: {
                trigger: 'axis',
                show: false
            },
            toolbox: {
                show: false,
            },
            grid: {
                zlevel: 0,
                x: 50,
                x2: 50,
                y: 30,
                y2: 30,
                borderWidth: 0,
                backgroundColor: 'rgba(0,0,0,0)',
                borderColor: 'rgba(0,0,0,0)',
            },
            xAxis: {
                axisLine: {
                    lineStyle: {
                        color: "#74788d"
                    }
                }
            },
            yAxis: {
                axisLine: {
                    lineStyle: {
                        color: "#74788d"
                    }
                }
            },
            series: [{
                symbolSize: 10,
                data: [
                    [10.0, 8.04],
                    [8.0, 6.95],
                    [13.0, 7.58],
                    [9.0, 8.81],
                    [11.0, 8.33],
                    [14.0, 9.96],
                    [6.0, 7.24],
                    [4.0, 4.26],
                    [12.0, 10.84],
                    [7.0, 4.82],
                    [5.0, 5.68]
                ],
                type: 'scatter'
            }],
            color: ['#3c4ccf']
        };
    };
    render() {
        return (
            <React.Fragment>
                <ReactEcharts style={{ height: "350px" }}
                    option={this.getOption()}
                />
            </React.Fragment>
        );
    }
}
export default Scatter;

