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
import ClusterTable from './ClusterTable';
// import CoreCloud from './CoreCloud_bak';

class CoreCloud extends Component {
    constructor(props) {
        super(props);
        this.state = {
            breadcrumbItems: [
                { title: "클러스터 관리", link: "#" },
                { title: "코어 클라우드", link: "#" },
            ],
            activeTab: '1',
            clusterType: 'core'
        }
        this.toggleTab = this.toggleTab.bind(this);
        // this.stateRefresh = this.stateRefresh.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this)
        // this.loadApilist = this.loadApilist.bind(this);
    }

    handleValueChange(e) {
        let nextState = {};
        nextState[e.target.name] = e.target.value;
        this.setState(nextState);
    }
    toggleTab(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }
    componentDidMount() {
        this.setState({
            clusterType: 'core'
        });
    }

    onInputChange = (e) => { // 2. input 태그의 값이 변경 될 때마다 this.state.keyword 값이 변경
        this.setState({
            keyword: e.target.value
        });
    }
    render() {
        const clusterType = this.state.clusterType;
        console.log(clusterType, "usertype");
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>
                        {/* <Table rows={rows} columns={columns} />; */}
                        <Breadcrumbs title="코어 클라우드 관리" breadcrumbItems={this.state.breadcrumbItems} />
                        <Row>
                            <Col lg={12}>
                                <Card>
                                    <CardBody className="pt-0">
                                        <Nav tabs className="nav-tabs-custom mb-4">

                                        </Nav>
                                        <div>
                                            <Link to="/cluster/core/add" onClick={() => this.setState({ modal_static: true, isAlertOpen: false })} className="btn btn-success mb-2"><i className="mdi mdi-plus mr-2"></i> 추가</Link>
                                        </div>
                                        {/* {api.getAPI()} */}
                                        <ClusterTable clusterType={clusterType} />
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

export default CoreCloud;
