import React, { Component } from 'react';
import { Container, Card, CardBody, Row, Col, Nav, NavItem, NavLink } from "reactstrap";
import { Link } from "react-router-dom";
import classnames from 'classnames';

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

class Pricing extends Component {
    constructor(props) {
        super(props);
        this.state={
            breadcrumbItems : [
                { title : "Utility", link : "#" },
                { title : "Pricing", link : "#" },
            ],
            activeTab: '1',
        }
        this.toggleTab = this.toggleTab.bind(this);
    }

    toggleTab(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    render() {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>

                    <Breadcrumbs title="Pricing" breadcrumbItems={this.state.breadcrumbItems} />
                    <Row className="justify-content-center">
                            <Col lg={5}>
                                <div className="text-center mb-5">
                                    <h4>Simple Pricing Plans</h4>
                                    <p className="text-muted mb-4">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo veritatis</p>

                                    <Nav pills className="pricing-nav-tabs">
                                        <NavItem>
                                            <NavLink className={classnames({ active: this.state.activeTab === '1' })} onClick={() => { this.toggleTab('1'); }}>Monthly</NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink className={classnames({ active: this.state.activeTab === '2' },"ml-1")} onClick={() => { this.toggleTab('2'); }}>Yearly</NavLink>
                                        </NavItem>
                                    </Nav>
                                </div>
                            </Col>
                        </Row>

                        <Row>
                            <Col xl={3} sm={6}>
                                <Card className="pricing-box">
                                    <CardBody className="p-4">
                                        <div className="text-center">
                                            <div className="mt-3">
                                                <i className="ri-edit-box-line text-primary h1"></i>
                                            </div>
                                            <h5 className="mt-4">Starter</h5>

                                            <div className="font-size-14 mt-4 pt-2">
                                                <ul className="list-unstyled plan-features">
                                                    <li>Free Live Support</li>
                                                    <li>Unlimited User</li>
                                                    <li>No Time Tracking</li>
                                                </ul>
                                            </div>

                                            <div className="mt-5">
                                                <h1 className="font-weight-bold mb-1"><sup className="mr-1"><small>$</small></sup>19</h1>
                                                <p className="text-muted">Per month</p>
                                            </div>

                                            <div className="mt-5 mb-3">
                                                <Link to="#" className="btn btn-primary w-md">Get started</Link>
                                            </div>
                                        </div>

                                    </CardBody>
                                </Card>
                            </Col>
                            <Col xl={3} sm={6}>
                                <Card className="pricing-box">
                                    <CardBody className="p-4">
                                        <div className="text-center">
                                            <div className="mt-3">
                                                <i className="ri-medal-line text-primary h1"></i>
                                            </div>
                                            <h5 className="mt-4">Professional</h5>

                                            <div className="font-size-14 mt-4 pt-2">
                                                <ul className="list-unstyled plan-features">
                                                    <li>Free Live Support</li>
                                                    <li>Unlimited User</li>
                                                    <li>No Time Tracking</li>
                                                </ul>
                                            </div>

                                            <div className="mt-5">
                                                <h1 className="font-weight-bold mb-1"><sup className="mr-1"><small>$</small></sup>29</h1>
                                                <p className="text-muted">Per month</p>
                                            </div>

                                            <div className="mt-5 mb-3">
                                                <Link to="#" className="btn btn-primary w-md">Get started</Link>
                                            </div>
                                        </div>

                                    </CardBody>
                                </Card>
                            </Col>
                            <Col xl={3} sm={6}>
                                <Card className="pricing-box">
                                    <CardBody className="p-4">
                                        <div className="text-center">
                                            <div className="mt-3">
                                                <i className="ri-stack-line text-primary h1"></i>
                                            </div>
                                            <h5 className="mt-4">Enterprise</h5>

                                            <div className="font-size-14 mt-4 pt-2">
                                                <ul className="list-unstyled plan-features">
                                                    <li>Free Live Support</li>
                                                    <li>Unlimited User</li>
                                                    <li>No Time Tracking</li>
                                                </ul>
                                            </div>

                                            <div className="mt-5">
                                                <h1 className="font-weight-bold mb-1"><sup className="mr-1"><small>$</small></sup>39</h1>
                                                <p className="text-muted">Per month</p>
                                            </div>

                                            <div className="mt-5 mb-3">
                                                <Link to="#" className="btn btn-primary w-md">Get started</Link>
                                            </div>
                                        </div>

                                    </CardBody>
                                </Card>
                            </Col>
                            <Col xl={3} sm={6}>
                                <Card className="pricing-box">
                                    <CardBody className="p-4">
                                        <div className="text-center">
                                            <div className="mt-3">
                                                <i className="ri-vip-crown-line text-primary h1"></i>
                                            </div>
                                            <h5 className="mt-4">Unlimited</h5>

                                            <div className="font-size-14 mt-4 pt-2">
                                                <ul className="list-unstyled plan-features">
                                                    <li>Free Live Support</li>
                                                    <li>Unlimited User</li>
                                                    <li>No Time Tracking</li>
                                                </ul>
                                            </div>

                                            <div className="mt-5">
                                                <h1 className="font-weight-bold mb-1"><sup className="mr-1"><small>$</small></sup>49</h1>
                                                <p className="text-muted">Per month</p>
                                            </div>

                                            <div className="mt-5 mb-3">
                                                <Link to="#" className="btn btn-primary w-md">Get started</Link>
                                            </div>
                                        </div>

                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Container> 
                </div>
            </React.Fragment>
        );
    }
}

export default Pricing;