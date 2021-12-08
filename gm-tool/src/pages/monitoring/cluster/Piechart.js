import React, { Component } from 'react';
import { Card, CardBody, Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";

//Import Charts
import ReactApexChart from 'react-apexcharts';

class Piechart extends Component {
    state = {
        menu: false,
        series: [0],
        options: {
            chart: {
                sparkline: {
                    enabled: true
                }
            },
            dataLabels: {
                enabled: false
            },
            colors: ['#5664d2'],
            stroke: {
                lineCap: 'round'
            },
            plotOptions: {
                radialBar: {
                    hollow: {
                        margin: 0,
                        size: '70%'
                    },
                    track: {
                        margin: 0,
                    },

                    dataLabels: {
                        show: false
                    }
                }
            }
        },
    }
    render() {
        this.state.series = [this.props.data]
        return (
            <React.Fragment>
                        <div >
                            <Row>
                                <Col sm={6}>
                                   
                                        
                                            <div >
                                                <ReactApexChart options={this.state.options} series={this.state.series} type="radialBar" height="60" />
                                            </div>
                                       
                                </Col>
                            </Row>
                        </div> 
            </React.Fragment>
        );
    }
}

export default Piechart;