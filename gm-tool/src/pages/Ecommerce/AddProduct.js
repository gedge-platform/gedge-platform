import React, { Component } from 'react';
import { Container, Card, CardBody, Row, Nav, NavItem, NavLink, TabPane, TabContent, Col, Form, FormGroup, Progress, Label, Input, Button } from "reactstrap";
import { Link } from "react-router-dom";
import classnames from 'classnames';

//Dropzone
import Dropzone from "react-dropzone";

//select
import Select from 'react-select';

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

class AddProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            breadcrumbItems: [
                { title: "Forms", link: "#" },
                { title: "Form Wizard", link: "#" },
            ],
            activeTab: 1,
            activeTabProgress: 1,
            progressValue: 25
        };
        this.toggleTab.bind(this);
        this.toggleTabProgress.bind(this);
    }


    toggleTab(tab) {
        if (this.state.activeTab !== tab) {
            if (tab >= 1 && tab <= 4) {
                this.setState({
                    activeTab: tab
                });
            }
        }
    }

    toggleTabProgress(tab) {
        if (this.state.activeTabProgress !== tab) {
            if (tab >= 1 && tab <= 4) {
                this.setState({
                    activeTabProgress: tab
                });

                if (tab === 1) { this.setState({ progressValue: 25 }) }
                if (tab === 2) { this.setState({ progressValue: 50 }) }
                if (tab === 3) { this.setState({ progressValue: 75 }) }
                if (tab === 4) { this.setState({ progressValue: 100 }) }
            }
        }
    }

    render() {
        const options = [
            { value: "TO", label: "Touchscreen" },
            { value: "CF", label: "Call Function" },
            { value: "NO", label: "Notifications" },
            { value: "FI", label: "Fitness" },
            { value: "OU", label: "Outdoor" },
        ]
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>

                        <Breadcrumbs title="Add Product" breadcrumbItems={this.state.breadcrumbItems} />

                        <Row>
                            <Col lg="12">
                                <Card>
                                    <CardBody>
                                        <h4 className="card-title mb-4">Wizard with progressbar</h4>

                                        <div id="progrss-wizard" className="twitter-bs-wizard">
                                            <ul className="twitter-bs-wizard-nav nav-justified nav nav-pills">
                                                <NavItem>
                                                    <NavLink className={classnames({ active: this.state.activeTabProgress === 1 })} onClick={() => { this.toggleTabProgress(1); }} >
                                                        <span className="step-number">01</span>
                                                        <span className="step-title">기본 정보</span>
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink className={classnames({ active: this.state.activeTabProgress === 2 })} onClick={() => { this.toggleTabProgress(2); }} >
                                                        <span className="step-number">02</span>
                                                        <span className="step-title">서비스 설정</span>
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink className={classnames({ active: this.state.activeTabProgress === 3 })} onClick={() => { this.toggleTabProgress(3); }} >
                                                        <span className="step-number">03</span>
                                                        <span className="step-title">고급 설정</span>
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink className={classnames({ active: this.state.activeTabProgress === 4 })} onClick={() => { this.toggleTabProgress(4); }} >
                                                        <span className="step-number">04</span>
                                                        <span className="step-title">Confirm Detail</span>
                                                    </NavLink>
                                                </NavItem>
                                            </ul>

                                            <div id="bar" className="mt-4">
                                                <Progress color="success" striped animated value={this.state.progressValue} />
                                            </div>
                                            <TabContent activeTab={this.state.activeTabProgress} className="twitter-bs-wizard-tab-content">
                                                <TabPane tabId={1}>
                                                    <Form>
                                                        <Row>
                                                            <Col lg="6">
                                                                <FormGroup>
                                                                    <Label for="basicpill-firstname-input14">서비스 명</Label>
                                                                    <Input type="text" className="form-control" id="basicpill-firstname-input14" />
                                                                </FormGroup>
                                                            </Col>
                                                            <Col lg="6">
                                                                <FormGroup>
                                                                    <Label for="basicpill-lastname-input15">별칭</Label>
                                                                    <Input type="text" className="form-control" id="basicpill-lastname-input15" />
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col lg="6">
                                                                <FormGroup>
                                                                    <Label for="basicpill-phoneno-input16">프로젝트 명</Label>
                                                                    <FormGroup>
                                                                        <select className="custom-select">
                                                                            <option defaultValue>프로젝트명을 선택해주세요</option>
                                                                            <option value="AE">A</option>
                                                                            <option value="VI">B</option>
                                                                            <option value="MC">C</option>
                                                                            <option value="DI">D</option>
                                                                        </select>
                                                                    </FormGroup>

                                                                </FormGroup>
                                                            </Col>
                                                            <Col lg="6">
                                                                <FormGroup>
                                                                    <Label for="basicpill-address-input2">Address</Label>
                                                                    <textarea id="basicpill-address-input2" className="form-control" rows="2"></textarea>
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>
                                                        {/* <Row>
                                                            <Col lg="12">
                                                                <FormGroup>
                                                                    <Label for="basicpill-address-input2">Address</Label>
                                                                    <textarea id="basicpill-address-input2" className="form-control" rows="2"></textarea>
                                                                </FormGroup>
                                                            </Col>
                                                        </Row> */}
                                                    </Form>
                                                </TabPane>
                                                <TabPane tabId={2}>
                                                    <div>
                                                        <Form>
                                                            <Row>
                                                                <Col lg="12">
                                                                    <FormGroup>
                                                                        <Label for="basicpill-pancard-input18">엑세스 타입</Label>
                                                                        <select className="custom-select">
                                                                            <option defaultValue>Virtual IP: 클러스터의 내부 IP를 통해 서비스에 엑세스 합니다</option>
                                                                            <option value="AE">A</option>
                                                                            <option value="VI">B</option>
                                                                            <option value="MC">C</option>
                                                                            <option value="DI">D</option>
                                                                        </select>
                                                                    </FormGroup>
                                                                </Col>

                                                                {/* <Col lg="6">
                                                                    <FormGroup>
                                                                        <Label for="basicpill-vatno-input19">VAT/TIN No.</Label>
                                                                        <Input type="text" className="form-control" id="basicpill-vatno-input19" />
                                                                    </FormGroup>
                                                                </Col> */}
                                                            </Row>
                                                            <Row>
                                                                <Col lg="6">
                                                                    <FormGroup>
                                                                        <Label for="basicpill-cstno-input20">CST No.</Label>
                                                                        <select className="custom-select">
                                                                            <option defaultValue>키</option>
                                                                            <option value="AE">A</option>
                                                                            <option value="VI">B</option>
                                                                            <option value="MC">C</option>
                                                                            <option value="DI">D</option>
                                                                        </select>

                                                                    </FormGroup>
                                                                </Col>
                                                                {/* 
                                                                <Col lg="6">
                                                                    <FormGroup>
                                                                        <select className="custom-select">
                                                                            <option defaultValue>값</option>
                                                                            <option value="AE">A</option>
                                                                            <option value="VI">B</option>
                                                                            <option value="MC">C</option>
                                                                            <option value="DI">D</option>
                                                                        </select>
                                                                    </FormGroup>
                                                                </Col> */}
                                                            </Row>
                                                            <Row>
                                                                <Col lg="12">
                                                                    <FormGroup>
                                                                        <Label for="basicpill-companyuin-input22">Company UIN</Label>
                                                                        <Input type="text" className="form-control" id="basicpill-companyuin-input22" />
                                                                    </FormGroup>
                                                                </Col>

                                                                {/* <Col lg="6">
                                                                    <FormGroup>
                                                                        <Label for="basicpill-declaration-input23">Declaration</Label>
                                                                        <Input type="text" className="form-control" id="basicpill-Declaration-input23" />
                                                                    </FormGroup>
                                                                </Col> */}
                                                            </Row>
                                                        </Form>
                                                    </div>
                                                </TabPane>
                                                <TabPane tabId={3}>
                                                    <div>
                                                        <Form>
                                                            <Row>
                                                                <Col lg="6">
                                                                    <FormGroup>
                                                                        <Label for="basicpill-namecard-input24">Name on Card</Label>
                                                                        <Input type="text" className="form-control" id="basicpill-namecard-input24" />
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col lg="6">
                                                                    <FormGroup>
                                                                        <Label>Credit Card Type</Label>
                                                                        <select className="custom-select">
                                                                            <option defaultValue>Select Card Type</option>
                                                                            <option value="AE">American Express</option>
                                                                            <option value="VI">Visa</option>
                                                                            <option value="MC">MasterCard</option>
                                                                            <option value="DI">Discover</option>
                                                                        </select>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col lg="6">
                                                                    <FormGroup>
                                                                        <Label for="basicpill-cardno-input25">Credit Card Number</Label>
                                                                        <Input type="text" className="form-control" id="basicpill-cardno-input25" />
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col lg="6">
                                                                    <FormGroup>
                                                                        <Label for="basicpill-card-verification-input26">Card Verification Number</Label>
                                                                        <Input type="text" className="form-control" id="basicpill-card-verification-input26" />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col lg="6">
                                                                    <FormGroup>
                                                                        <Label for="basicpill-expiration-input27">Expiration Date</Label>
                                                                        <Input type="text" className="form-control" id="basicpill-expiration-input27" />
                                                                    </FormGroup>
                                                                </Col>

                                                            </Row>
                                                        </Form>
                                                    </div>
                                                </TabPane>
                                                <TabPane tabId={4}>
                                                    <div className="row justify-content-center">
                                                        <Col lg="6">
                                                            <div className="text-center">
                                                                <div className="mb-4">
                                                                    <i className="mdi mdi-check-circle-outline text-success display-4"></i>
                                                                </div>
                                                                <div>
                                                                    <h5>Confirm Detail</h5>
                                                                    <p className="text-muted">If several languages coalesce, the grammar of the resulting</p>
                                                                </div>

                                                            </div>

                                                        </Col>
                                                    </div>
                                                    <div className="mt-4 text-right">
                                                        <Link to="#" className="btn btn-success">
                                                            완료
                                                        </Link>
                                                    </div>
                                                </TabPane>
                                            </TabContent>
                                            <ul className="pager wizard twitter-bs-wizard-pager-link">
                                                <li className={this.state.activeTabProgress === 1 ? "previous disabled" : "previous"}><Link to="#" onClick={() => { this.toggleTabProgress(this.state.activeTabProgress - 1); }}>이전</Link></li>
                                                <li className={this.state.activeTabProgress === 4 ? "next disabled" : "next"}><Link to="#" onClick={() => { this.toggleTabProgress(this.state.activeTabProgress + 1); }}>다음</Link></li>
                                            </ul>
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

export default AddProduct;