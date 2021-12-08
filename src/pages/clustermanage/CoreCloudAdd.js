import React, { Component } from 'react';
import { Container, Card, CardBody, Row, NavItem, NavLink, TabPane, TabContent, Col, Form, FormGroup, Progress, Label, Input } from "reactstrap";
import { Link } from "react-router-dom";
import classnames from 'classnames';
import store from "../../store/Monitor/store/Store"

//Dropzone

//select

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';
import AppTable from '../workload/Apptable';

class CoreCloudAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            workspaceName: '',
            alias: '',
            description: '',
            breadcrumbItems: [
                { title: "CoreCloud", link: "#" },
                { title: "CoreCloud 추가", link: "#" },
            ],
            activeTab: 1,
            activeTabProgress: 1,
            progressValue: 33,
            col1: true,
            col2: false,
            col3: false,
        };
        this.toggleTab.bind(this);
        this.toggleTabProgress.bind(this);
        this.t_col1 = this.t_col1.bind(this);
        this.t_col2 = this.t_col2.bind(this);
        this.t_col3 = this.t_col3.bind(this);

    }
    t_col1() {
        this.setState({ col1: !this.state.col1, col2: false, col3: false });
    }
    t_col2() {
        this.setState({ col2: !this.state.col2, col1: false, col3: false });
    }
    t_col3() {
        this.setState({ col3: !this.state.col3, col1: false, col2: false });
    }

    toggleTab(tab) {
        if (this.state.activeTab !== tab) {
            if (tab >= 1 && tab <= 3) {
                this.setState({
                    activeTab: tab
                });
            }
        }
    }

    toggleTabProgress(tab) {
        if (this.state.activeTabProgress !== tab) {
            if (tab >= 1 && tab <= 3) {
                this.setState({
                    activeTabProgress: tab
                });

                if (tab === 1) { this.setState({ progressValue: 33 }) }
                if (tab === 2) { this.setState({ progressValue: 66 }) }
                if (tab === 3) { this.setState({ progressValue: 100 }) }
            }

        }
    }
    appChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    appClick = () => {
        console.log(`workspace name : ${this.state.workspaceName}\nAlias : ${this.state.alias} \ntest: ${this.state.description} \ntest: ${this.state.select}`);
    }
    appKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.appClick();
        }
    }



    render() {
        const { workspaceName, alias, description, select } = this.state;
        const { appChange, appClick, appKeyPress } = this;

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

                        <Breadcrumbs title=" Cluster추가" breadcrumbItems={this.state.breadcrumbItems} />

                        <Row>
                            <Col lg="12">
                                <Card>
                                    <CardBody>
                                        {/* <h4 className="card-title mb-4"> 추가</h4> */}

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
                                                        <span className="step-title">Cluster Settings</span>
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink className={classnames({ active: this.state.activeTabProgress === 3 })} onClick={() => { this.toggleTabProgress(3); }} >
                                                        <span className="step-number">03</span>
                                                        <span className="step-title">Cluster 생성</span>
                                                    </NavLink>
                                                </NavItem>

                                            </ul>

                                            <div id="bar" className="mt-4">
                                                <Progress color="success" striped animated value={this.state.progressValue} />
                                            </div>
                                            <TabContent activeTab={this.state.activeTabProgress} className="twitter-bs-wizard-tab-content">
                                                <TabPane tabId={1}>
                                                    <div>
                                                        <Form>
                                                            <Row>
                                                                <Col lg="6">
                                                                    <FormGroup>
                                                                        <Label for="basicpill-namecard-input24">Cluster Name *</Label>
                                                                        <Input type="text" className="form-control" id="basicpill-namecard-input24" name="clusterName" onChange={appChange} />
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col lg="6">
                                                                    <FormGroup>
                                                                        <Label for="basicpill-namecard-input24">Tag </Label>
                                                                        <Input type="text" className="form-control" id="basicpill-namecard-input24" name="alias" onChange={appChange} />
                                                                    </FormGroup>
                                                                </Col>


                                                            </Row>
                                                            <Row>
                                                                <Col lg="12">
                                                                    <FormGroup>
                                                                        <Label for="basicpill-namecard-input24">Provider*</Label>
                                                                        <select className="custom-select" name="select" onChange={appChange}>
                                                                            <option defaultValue>Select Administrator</option>
                                                                            <option value="user">user</option>
                                                                            <option value="admin">admin</option>
                                                                            <option value="multi_test">multi_test</option>
                                                                            <option value="DI">D</option>
                                                                        </select>
                                                                    </FormGroup>
                                                                </Col>

                                                            </Row>
                                                            <Row>
                                                                <Col lg="12">
                                                                    <FormGroup>
                                                                        <Label for="basicpill-pancard-input18">Administrator</Label>
                                                                        <select className="custom-select" name="select" onChange={appChange}>
                                                                            <option defaultValue>Select Administrator</option>
                                                                            <option value="user">user</option>
                                                                            <option value="admin">admin</option>
                                                                            <option value="multi_test">multi_test</option>
                                                                            <option value="DI">D</option>
                                                                        </select>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col lg="12">
                                                                    <Label>Workspace Description</Label>

                                                                    <Input
                                                                        type="textarea"
                                                                        id="textarea"
                                                                        name="description"
                                                                        onChange={this.appChange}
                                                                        maxLength="225"
                                                                        rows="3"
                                                                        placeholder="This description has a limit of 225 chars."
                                                                    />
                                                                </Col>
                                                            </Row>

                                                        </Form>
                                                    </div>
                                                </TabPane>

                                                <TabPane tabId={2}>
                                                    <div>
                                                        <Form>
                                                            <Row>
                                                                <Col lg="12">
                                                                    <FormGroup>
                                                                        <Label for="basicpill-pancard-input18">Clusters</Label>
                                                                        <select className="custom-select">
                                                                            <option defaultValue>Select Clusters</option>
                                                                            <option value="AE">A</option>
                                                                            <option value="VI">B</option>
                                                                            <option value="MC">C</option>
                                                                            <option value="DI">D</option>
                                                                        </select>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>

                                                        </Form>
                                                    </div>
                                                </TabPane>

                                                <TabPane tabId={3}>
                                                    <div className="row justify-content-center">
                                                        <Col lg="6">
                                                            <div className="text-center">
                                                                <div className="mb-4">
                                                                    <i className="mdi mdi-check-circle-outline text-success display-4"></i>
                                                                </div>
                                                                <div>
                                                                    <h5>Confirm Detail</h5>
                                                                    {/* <p className="text-muted">If several languages coalesce, the grammar of the resulting</p> */}
                                                                </div>

                                                            </div>

                                                        </Col>
                                                    </div>
                                                    <div className="mt-4 text-right">
                                                        <Link to="/workspace" className="btn btn-success" onClick={appClick}>
                                                            완료
                                                        </Link>
                                                    </div>
                                                </TabPane>
                                            </TabContent>
                                            <ul className="pager wizard twitter-bs-wizard-pager-link">
                                                <li className={this.state.activeTabProgress === 1 ? "previous disabled" : "previous"}><Link to="#" onClick={() => { this.toggleTabProgress(this.state.activeTabProgress - 1); }}>이전</Link></li>
                                                <li className={this.state.activeTabProgress === 3 ? "next disabled" : "next"}><Link to="#" onClick={() => { this.toggleTabProgress(this.state.activeTabProgress + 1); }}>다음</Link></li>
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
export default CoreCloudAdd;