import React, { Component } from 'react';
import { TabContent, TabPane, Container, Card, CardBody, Row, Col, Nav, NavItem, NavLink, UncontrolledTooltip, Input, Label, Button, Dropdown, DropdownMenu, DropdownItem, DropdownToggle, ButtonDropdown, ButtonGroup } from "reactstrap";
import { Link } from "react-router-dom";
import classnames from 'classnames';
import { getAPI } from '../../components/Common/api';
import * as api from '../../components/Common/api';
import { MDBDataTable } from "mdbreact";
import JobData from './JobData';
import WorkspaceFilter from './WorkspaceFilter';
import ProjectFilter from './ProjectFilter';
// import "./datatables.scss";

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';
import JobFilter from './JobFilter';
import JobTable from './JobTable';
import CronjobTable from './CronjobTable';

class Job extends Component {
    constructor(props) {
        super(props);
        this.state = {
            breadcrumbItems: [
                { title: "워크로드", link: "#" },
                { title: "잡", link: "#" },
            ],
            activeTab: '1',
            params: "jobs",
            // infoList: [],
            // infoList2: []
        }
        this.toggleTab = this.toggleTab.bind(this);

    }

    toggleTab(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab,
            });
            if (tab == '1') {
                this.setState({
                    params: "jobs",
                });
            } else if (tab == '2') {
                this.setState({
                    params: "cronjobs",
                });
            }
        }
    }

    componentDidMount() {

        // if (this.state.activeTab == '1') {
        //     this.setState({
        //         // projectType: 'user',
        //         params: 'jobs'
        //     });
        // } else if (this.state.activeTab == '2') {
        //     this.setState({
        //         // projectType: 'user',
        //         params: 'cronjobs'
        //     });
        // }
    }
    //     document.getElementsByClassName("pagination")[0].classList.add("pagination-rounded");
    //     this.loadApilist().then(res => {
    //         // console.log(res);
    //         this.setState({
    //             infoList: res
    //         })
    //     })
    //     this.loadApilist2().then(res => {
    //         // console.log(res);
    //         this.setState({
    //             infoList2: res
    //         })
    //     })
    // }
    // loadApilist() {
    //     let test = ""
    //     test = getAPI('jobs', 'GET')
    //     console.log(api.getAPI('jobs', 'GET'), "jobs")
    //     return test;
    // }
    // loadApilist2() {
    //     let test = ""
    //     test = getAPI('cronjobs', 'GET')
    //     console.log(api.getAPI('cronjobs', 'GET'), "jobs")
    //     return test;
    // }
    render() {

        const params = this.state.params;
        console.log(params)
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>

                        <Breadcrumbs title="잡" breadcrumbItems={this.state.breadcrumbItems} />

                        <Row>
                            <Col lg={12}>
                                <Card>
                                    <CardBody className="pt-0">
                                        <Nav tabs className="nav-tabs-custom mb-4">

                                        </Nav>
                                        <div>
                                            <Link to="/workload/job/add" onClick={() => this.setState({ modal_static: true, isAlertOpen: false })} className="btn btn-success mb-2"><i className="mdi mdi-plus mr-2"></i> 추가</Link>
                                            <WorkspaceFilter params={params} />
                                            <ProjectFilter params={params} />
                                        </div>
                                        <div>
                                            <Nav pills className="pricing-nav-tabs">
                                                <NavItem>
                                                    <NavLink className={classnames({ active: this.state.activeTab === '1' })} onClick={() => { this.toggleTab('1'); }}>
                                                        잡
                                                    </NavLink>
                                                </NavItem>

                                                <NavItem>
                                                    <NavLink className={classnames({ active: this.state.activeTab === '2' })} onClick={() => { this.toggleTab('2'); }}>
                                                        크론잡
                                                    </NavLink>
                                                </NavItem>
                                            </Nav>
                                        </div>
                                        <TabContent activeTab={this.state.activeTab} className="pt-5">
                                            <TabPane tabId="1">
                                                <JobTable params={params} />
                                            </TabPane>
                                            <TabPane tabId="2">
                                                <CronjobTable params={params} />
                                            </TabPane>
                                        </TabContent>
                                        {/* <JobTable params={params} /> */}
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

export default Job;