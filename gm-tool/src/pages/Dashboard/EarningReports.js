import React, { Component } from 'react';
import { Card, CardBody, Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";

//Import Charts
import ReactApexChart from 'react-apexcharts';
import "./dashboard.scss";

class EarningReports extends Component {
    state = {
        menu: false,
        series: [72],
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
        series2: [65],
        options2: {
            chart: {
                sparkline: {
                    enabled: true
                }
            },
            dataLabels: {
                enabled: false
            },
            colors: ['#1cbb8c'],
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
        }
    }
    render() {
        return (
            <React.Fragment>
                <Card>
                    <CardBody>
                        <Dropdown className="float-right" isOpen={this.state.menu} toggle={() => this.setState({ menu: !this.state.menu })} >
                            <DropdownToggle tag="i" className="arrow-none card-drop" >
                                <i className="mdi mdi-dots-vertical"></i>
                            </DropdownToggle>
                            <DropdownMenu right>

                                <DropdownItem href="">Sales Report</DropdownItem>

                                <DropdownItem href="">Export Report</DropdownItem>

                                <DropdownItem href="">Profit</DropdownItem>

                                <DropdownItem href="">Action</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>

                        <h4 className="card-title mb-4">Earning Reports</h4>
                        <div className="text-center">
                            <Row>
                                <Col sm={6}>
                                    <div>
                                        <div className="mb-3">
                                            <div id="radialchart-1" className="apex-charts">
                                                <ReactApexChart options={this.state.options} series={this.state.series} type="radialBar" height="60" />
                                            </div>
                                        </div>

                                        <p className="text-muted text-truncate mb-2">Weekly Earnings</p>
                                        <h5>$2,523</h5>
                                    </div>
                                </Col>

                                <Col sm={6}>
                                    <div className="mt-5 mt-sm-0">
                                        <div className="mb-3">
                                            <div id="radialchart-2" className="apex-charts">
                                                <ReactApexChart options={this.state.options2} series={this.state.series2} type="radialBar" height="60" />
                                            </div>
                                        </div>

                                        <p className="text-muted text-truncate mb-2">Monthly Earnings</p>
                                        <h5>$11,235</h5>
                                    </div>
                                </Col>

                            </Row>
                            <Row>
                                <Col sm={6}>
                                    <div>
                                        <div className="mb-3">
                                            <div id="radialchart-1" className="apex-charts">
                                                <ReactApexChart options={this.state.options} series={this.state.series} type="radialBar" height="60" />
                                            </div>
                                        </div>

                                        <p className="text-muted text-truncate mb-2">Weekly Earnings</p>
                                        <h5>$2,523</h5>
                                    </div>
                                </Col>

                                <Col sm={6}>
                                    <div className="mt-5 mt-sm-0">
                                        <div className="mb-3">
                                            <div id="radialchart-2" className="apex-charts">
                                                <ReactApexChart options={this.state.options2} series={this.state.series2} type="radialBar" height="60" />
                                            </div>
                                        </div>

                                        <p className="text-muted text-truncate mb-2">Monthly Earnings</p>
                                        <h5>$11,235</h5>
                                    </div>
                                </Col>

                            </Row>

                        </div>
                    </CardBody>
                </Card>
            </React.Fragment>
        );
    }
}

export default EarningReports;