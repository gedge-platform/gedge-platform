import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';

class LineBar extends Component {
    getOption = () => {
        return {
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
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: '#999'
                    }
                }
            },
            toolbox: {
                feature: {
                    dataView: { show: true, readOnly: false },
                    magicType: { show: true, type: ['line', 'bar'] },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            color: ['#3c4ccf', '#02a499', '#38a4f8'],
            legend: {
                data: ['Evaporation', 'Precipitation', 'Average temperature'],
                textStyle: {
                    color: ['#74788d']
                }
            },
            xAxis: [
                {
                    type: 'category',
                    data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                    axisPointer: {
                        type: 'shadow'
                    },
                    axisLine: {
                        lineStyle: {
                            color: "#74788d"
                        }
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: 'Water volume',
                    min: 0,
                    max: 250,
                    interval: 50,
                    axisLabel: {
                        formatter: '{value} ml'
                    },
                    axisLine: {
                        lineStyle: {
                            color: "#74788d"
                        }
                    }
                },
                {
                    type: 'value',
                    name: 'Temperature',
                    min: 0,
                    max: 25,
                    interval: 5,
                    axisLabel: {
                        formatter: '{value} °C'
                    }
                }
            ],
            series: [
                {
                    name: 'Evaporation',
                    type: 'bar',
                    data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2]
                },
                {
                    name: 'Precipitation',
                    type: 'bar',
                    data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2]
                },
                {
                    name: 'Average Temperature',
                    type: 'line',
                    yAxisIndex: 1,
                    data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4]
                }
            ],
            textStyle: {
                color: ['#74788d']
            }
        };
    };
    render() {
        return (
            <React.Fragment>
                <ReactEcharts style={{ height: "350px" }} option={this.getOption()} />
            </React.Fragment>
        );
    }
}
export default LineBar;

