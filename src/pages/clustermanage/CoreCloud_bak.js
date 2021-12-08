import React, { Component, useState, useEffect } from 'react';
import { Container, Card, CardBody, Row, Col, Nav, NavItem, NavLink, UncontrolledTooltip, Input, Label, Button } from "reactstrap";
import { Link } from "react-router-dom";
import classnames from 'classnames';
import { MDBDataTable, MDBNavLink } from "mdbreact";
// import "./datatables.scss";
import axios from 'axios';

import Breadcrumbs from '../../components/Common/Breadcrumb';
import Search from '../Tables/Search';
import CommonTable from './CommonTable';
import { getAPI } from '../../components/Common/api';
import * as api from '../../components/Common/api'
import Moment from 'react-moment';

class CoreCloud extends Component {
    constructor(props) {
        super(props);
        this.state = {
            breadcrumbItems: [
                { title: "클러스터 관리", link: "#" },
                { title: "엣지 클라우드 관리", link: "#" },
            ],
            activeTab: '1',
            apilistinfo: []

        }
        this.toggleTab = this.toggleTab.bind(this);
        // this.stateRefresh = this.stateRefresh.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this)
        this.loadApilist = this.loadApilist.bind(this);
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
    loadApilist() {
        // console.log(this.props.username)
        let test = getAPI('cluster', 'GET')
        // console.log(api.getAPI('pods', 'GET'))
        // console.log("+++++" + api.getAPI('pods', 'GET'));
        console.log(test);
        return test;
    }
    componentDidMount() {
        this.loadApilist().then(res => {
            // console.log(res);
            this.setState({
                apilistinfo: res
            })
        })
    }

    onInputChange = (e) => { // 2. input 태그의 값이 변경 될 때마다 this.state.keyword 값이 변경
        this.setState({
            keyword: e.target.value
        });
    }
    render() {
        const apilistinfo = this.state.apilistinfo;
        // const infoList = this.state.infoList;
        console.log(apilistinfo)
        let apitoData = [];
        let deploy_status = '';
        let appName = '';
        // let labels = apilistinfo.metadata.labels.beta.kubernetes.io;
        // console.log(labels)
        let dataFromApi = apilistinfo.map(list => {
            // if (list.status.availableReplicas == list.status.replicas) {
            //     deploy_status = "running"
            // } else {
            //     deploy_status = "provisioning"
            // }
            // if (list.metadata.labels.app == undefined) {
            //     appName = "-"
            // } else {
            //     appName = list.metadata.labels.app
            // }
            return {
                link: "/cluster/namespace=" + list.metadata.resourceVersion + "/edge/" + list.metadata.name,
                // link: "/workload/deployment/" + list.metadata.name,
                name: list.metadata.name,
                cpu: list.status.capacity.cpu,
                memeory: list.status.capacity.memeory,
                version: list.status.nodeInfo.kubeletVersion,

            }


        })
        apitoData = dataFromApi;
        console.log(apitoData, "apitoData")

        const rows = apitoData.map(test => ({
            // const rows = apilistinfo.map((test, index) => ({
            checkbox:
                <div className="custom-control custom-checkbox">
                    <Input type="checkbox" className="custom-control-input" id="ordercheck1" />
                    <Label className="custom-control-label" htmlFor="ordercheck1">&nbsp;</Label>
                </div>,
            id: <Link to="/cluster/core-detail" className="text-dark font-weight-bold">{test.id}</Link>,
            // name: <Link to={`/cluster/namespace=${test.metadata.resourceVersion}/edge/${test.metadata.name}`} className="text-dark font-weight-bold" searchvalue={test.metadata.name}>{test.metadata.name}</Link>,
            name: <Link to={test.link} className="text-dark font-weight-bold" searchvalue={test.name}>{test.name}</Link>,

            // Target: <Link to="/cluster/edge-detail" className="text-dark font-weight-bold" searchvalue={port[index]} key={index}>{port[index]}</Link>,
            // status: <Link to="/cluster/edge-detail" className="text-dark font-weight-bold" searchvalue={test.username}> <Moment format="YYYY/MM/DD HH:mm:ss" date={test.metadata.creationTimestamp}></Moment></Link>,
            status: <Link to="/cluster/edge-detail" className="text-dark font-weight-bold" searchvalue={test.username}> {test.username}</Link>,
            role: <div className="badge badge-soft-success font-size-12">{test.name}</div>,
            cpu: <div className="text-dark font-weight-bold">{test.cpu}</div>,
            memeory: <div className="text-dark font-weight-bold">{test.memory}</div>,
            version: <div className="text-dark font-weight-bold">{test.version}</div>,
            // status: <div className="badge badge-soft-success font-size-12"></div>,
            action: <><Link to="#" className="mr-3 text-primary" id="edit1"><i className="mdi mdi-pencil font-size-18"></i></Link>
                <UncontrolledTooltip placement="top" target="edit1">
                    Edit
                </UncontrolledTooltip >
                <Link to="#" className="text-danger" id="delete1"><i className="mdi mdi-trash-can font-size-18"></i></Link>
                <UncontrolledTooltip placement="top" target="delete1">
                    Delete
                </UncontrolledTooltip >
            </>
        }))

        const data = {
            columns: [
                {
                    label: <div className="custom-control custom-checkbox"> <Input type="checkbox" className="custom-control-input" id="ordercheck" /><Label className="custom-control-label" htmlFor="ordercheck">&nbsp;</Label></div>,
                    field: "checkbox",
                    sort: "asc",
                    width: 28
                },
                {
                    label: '이름',
                    field: 'name',
                    sort: 'asc',
                    width: 150
                },
                {
                    label: '상태',
                    field: 'status',
                    sort: 'asc',
                    width: 270
                },
                {
                    label: '역할',
                    field: 'role',
                    sort: 'asc',
                    width: 200
                },
                {
                    label: 'cpu',
                    field: 'cpu',
                    sort: 'asc',
                    width: 100
                },
                {
                    label: 'memeory',
                    field: 'memeory',
                    sort: 'asc',
                    width: 100
                },
                {
                    label: 'version',
                    field: 'version',
                    sort: 'asc',
                    width: 150
                },
                {
                    label: "",
                    field: "action",
                    sort: "asc",
                    width: 120
                },
            ],
            rows
        };
        // console.log(this.state.users + "last");
        // console.log(api.getAPI());
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>
                        {/* <Table rows={rows} columns={columns} />; */}
                        <Breadcrumbs title="클라우드 엣지 관리" breadcrumbItems={this.state.breadcrumbItems} />
                        <Row>
                            <Col lg={12}>
                                <Card>
                                    <CardBody className="pt-0">
                                        <Nav tabs className="nav-tabs-custom mb-4">

                                        </Nav>
                                        <div>
                                            <Link to="/cluster/edge/add" onClick={() => this.setState({ modal_static: true, isAlertOpen: false })} className="btn btn-success mb-2"><i className="mdi mdi-plus mr-2"></i> 추가</Link>
                                        </div>
                                        {/* {api.getAPI()} */}
                                        <MDBDataTable
                                            searching={true}
                                            sortRows={['name']}
                                            // entries={50}
                                            // entriesOptions={[20, 30, 50, 100]}

                                            responsive data={data} className="mt-4" />
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
