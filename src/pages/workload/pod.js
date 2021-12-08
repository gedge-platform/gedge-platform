import React, { useState, useEffect, Component } from 'react';
import { Container, Card, CardBody, Row, Col, Nav, NavItem, NavLink, UncontrolledTooltip, Input, Label, Button, Dropdown, DropdownMenu, DropdownItem, DropdownToggle, ButtonDropdown, ButtonGroup, TabContent, TabPane, CardText } from "reactstrap";
import { Link } from "react-router-dom";
import classnames from 'classnames';
import { MDBDataTable } from "mdbreact";
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { getAPI } from '../../components/Common/api';
import * as api from '../../components/Common/api';
import { info } from 'toastr';

import PodListTable from './PodListTable';
import Project from './Project';
import IndexKanban from '../KanbanBoard';
import Tab from './Tab';
import axios from 'axios'
import WorkspaceFilter from './WorkspaceFilter';
import ProjectFilter from './ProjectFilter';
class Pod extends Component {
    constructor(props) {
        super(props);

        this.state = {
            breadcrumbItems: [
                { title: "워크로드", link: "#" },
                { title: "파드", link: "#" },
            ],
            activeTab: '1',
            infoList: [],
            infoList2: [],
            namespace: '',
            params: 'pods'
        }
        this.toggleTab = this.toggleTab.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this)
    }
    handleValueChange(e) {
        let nextState = {};
        nextState[e.target.name] = e.target.value;
        this.setState(nextState);
    }
    toggleTab(tabId) {
        console.log(2);
        if (this.state.activeTab !== tabId) {
            this.setState({
                activeTab: tabId
            });
        }
    }
    componentDidMount() {
        this.setState({
            params: 'pods'
        });
    }
    onInputChange = (e) => { // 2. input 태그의 값이 변경 될 때마다 this.state.keyword 값이 변경
        this.setState({
            keyword: e.target.value
        });
    }

    render() {
        const params = this.state.params;
        console.log(params)
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>

                        <Breadcrumbs title="파드" breadcrumbItems={this.state.breadcrumbItems} />

                        <Row>
                            <Col lg={12}>
                                <Card>
                                    <CardBody className="pt-0">

                                        <div>
                                            <Link to="/workload/pod/add" onClick={() => this.setState({ modal_static: true, isAlertOpen: false })} className="btn btn-success mb-2"><i className="mdi mdi-plus mr-2"></i> 추가</Link>
                                            <WorkspaceFilter params={params} />
                                            <ProjectFilter params={params} />
                                        </div>

                                        <PodListTable />

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

export default Pod;
