import React, { Component, useState, useEffect } from 'react';
import { Container, Card, CardBody, Row, Col, Nav, NavItem, NavLink, UncontrolledTooltip, Input, Label, Button } from "reactstrap";
import { Link } from "react-router-dom";
import classnames from 'classnames';
import { MDBDataTable, MDBNavLink } from "mdbreact";
// import "./datatables.scss";
import axios from 'axios';

import Breadcrumbs from '../../components/Common/Breadcrumb';
import Search from '../Tables/Search';

import { getAPI } from '../../components/Common/api';
import * as api from '../../components/Common/api'
import Moment from 'react-moment';
import ProjectTable from './ProjectTable';
import WorkspaceFilter from './WorkspaceFilter';

class ProjectUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            breadcrumbItems: [
                { title: "프로젝트", link: "#" },
                { title: "사용자 프로젝트", link: "#" },
            ],
            projectType: 'user',
            params: 'projects'
        }
        // this.toggleTab = this.toggleTab.bind(this);
        // this.stateRefresh = this.stateRefresh.bind(this);
        // this.handleValueChange = this.handleValueChange.bind(this)
        // this.loadApilist = this.loadApilist.bind(this);
    }

    handleValueChange(e) {
        let nextState = {};
        nextState[e.target.name] = e.target.value;
        this.setState(nextState);
    }
    // toggleTab(tab) {
    //     if (this.state.activeTab !== tab) {
    //         this.setState({
    //             activeTab: tab
    //         });
    //     }
    // }
    componentDidMount() {
        this.setState({
            projectType: 'user',
            params: 'projects'
        });
    }

    // onInputChange = (e) => { // 2. input 태그의 값이 변경 될 때마다 this.state.keyword 값이 변경
    //     this.setState({
    //         keyword: e.target.value
    //     });
    // }
    render() {
        const projectType = this.state.projectType;
        const params = this.state.params;
        console.log(projectType, "usertype");
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>
                        {/* <Table rows={rows} columns={columns} />; */}
                        <Breadcrumbs title="사용자 프로젝트" breadcrumbItems={this.state.breadcrumbItems} />
                        <Row>
                            <Col lg={12}>
                                <Card>
                                    <CardBody className="pt-0">
                                        <Nav tabs className="nav-tabs-custom mb-4">

                                        </Nav>
                                        <div>
                                            <Link to="/cluster/edge/add" onClick={() => this.setState({ modal_static: true, isAlertOpen: false })} className="btn btn-success mb-2"><i className="mdi mdi-plus mr-2"></i> 추가</Link>
                                            <WorkspaceFilter projectType={projectType} params={params} />
                                        </div>
                                        {/* {api.getAPI()} */}
                                        <ProjectTable projectType={projectType} />
                                        {/* <MDBDataTable searching={true} sortRows={['name']}  responsive data={data} className="mt-4" /> */}
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>


                    </Container>
                </div>
            </React.Fragment>


        )

    }
}

export default ProjectUser;
