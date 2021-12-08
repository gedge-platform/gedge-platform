import React, { Component } from 'react';
import { Row, Col, Card, CardBody, ButtonGroup, Button } from 'reactstrap';

//Import Charts
import ReactApexChart from 'react-apexcharts';
import "./dashboard.scss";

class RevenueAnalytics extends Component {
    state = {
        series: [{
            name: '2020',
            type: 'column',
            data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16]
        }, {
            name: '2019',
            type: 'line',
            data: [23, 32, 27, 38, 27, 32, 27, 38, 22, 31, 21, 16]
        }],
        options: {
            chart: {
                toolbar: {
                    show: false,
                }
            },
            stroke: {
                width: [0, 3],
                curve: 'smooth'
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '20%',
                },
            },
            dataLabels: {
                enabled: false,
            },
            legend: {
                show: false,
            },
            colors: ['#5664d2', '#1cbb8c'],
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        }
    }
    render() {
        return (
            <React.Fragment>
                <Card>

                    <CardBody>
                        <div className="float-right d-none d-md-inline-block">
                            <ButtonGroup className="mb-2">
                                <Button size="sm" color="light" type="button">Today</Button>
                                <Button size="sm" color="light" active type="button">Weekly</Button>
                                <Button size="sm" color="light" type="button">Monthly</Button>
                            </ButtonGroup>
                        </div>
                        <h4 className="card-title mb-4">Revenue Analytics</h4>
                        <div>
                            <div id="line-column-chart" className="apex-charts" dir="ltr">
                                <ReactApexChart options={this.state.options} series={this.state.series} type="line" height="280" />
                            </div>
                        </div>
                    </CardBody>

                    <CardBody className="border-top text-center">
                        <Row>
                            <Col sm={4}>
                                <div className="d-inline-flex">
                                    <h5 className="mr-2">$12,253</h5>
                                    <div className="text-success">
                                        <i className="mdi mdi-menu-up font-size-14"> </i>2.2 %
                                    </div>
                                </div>
                                <p className="text-muted text-truncate mb-0">This month</p>
                            </Col>

                            <Col sm={4}>
                                <div className="mt-4 mt-sm-0">
                                    <p className="mb-2 text-muted text-truncate"><i className="mdi mdi-circle text-primary font-size-10 mr-1"></i> This Year :</p>
                                    <div className="d-inline-flex">
                                        <h5 className="mb-0 mr-2">$ 34,254</h5>
                                        <div className="text-success">
                                            <i className="mdi mdi-menu-up font-size-14"> </i>2.1 %
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col sm={4}>
                                <div className="mt-4 mt-sm-0">
                                    <p className="mb-2 text-muted text-truncate"><i className="mdi mdi-circle text-success font-size-10 mr-1"></i> Previous Year :</p>
                                    <div className="d-inline-flex">
                                        <h5 className="mb-0">$ 32,695</h5>
                                    </div>
                                </div>
                            </Col>

                        </Row>
                    </CardBody>
                </Card>
            </React.Fragment>
        );
    }
}

export default RevenueAnalytics;