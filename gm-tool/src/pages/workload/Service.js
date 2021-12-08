import React, { useState, useEffect, Component } from 'react';
import { Container, Card, CardBody, Row, Col, Nav, NavItem, NavLink, UncontrolledTooltip, Input, Label, Button, Dropdown, DropdownMenu, DropdownItem, DropdownToggle, ButtonDropdown, ButtonGroup } from "reactstrap";
import { Link } from "react-router-dom";
import classnames from 'classnames';
import { MDBDataTable } from "mdbreact";
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { getAPI } from '../../components/Common/api';
import * as api from '../../components/Common/api';
import { info } from 'toastr';
import IndexKanban from '../KanbanBoard';

import ServiceTable from './ServiceTable';
import WorkspaceFilter from './WorkspaceFilter';
import ProjectFilter from './ProjectFilter';
class Service extends Component {
  constructor(props) {
    super(props);
    this.state = {
      breadcrumbItems: [
        { title: "워크로드", link: "#" },
        { title: "서비스", link: "#" },
      ],
      activeTab: '1',
      // projectType: 'user',
      params: 'services'
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
      // projectType: 'user',
      params: 'services'
    });
  }

  onInputChange = (e) => { // 2. input 태그의 값이 변경 될 때마다 this.state.keyword 값이 변경
    this.setState({
      keyword: e.target.value
    });
  }
  render() {
    // const projectType = this.state.projectType;
    const params = this.state.params;
    // console.log(projectType, "usertype");
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid>
            {/* <Table rows={rows} columns={columns} />; */}
            <Breadcrumbs title="서비스" breadcrumbItems={this.state.breadcrumbItems} />
            <Row>
              <Col lg={12}>
                <Card>
                  <CardBody className="pt-0">
                    <Nav tabs className="nav-tabs-custom mb-4">

                    </Nav>
                    <div>
                      <Link to="/workload/service/add" onClick={() => this.setState({ modal_static: true, isAlertOpen: false })} className="btn btn-success mb-2"><i className="mdi mdi-plus mr-2"></i> 추가</Link>
                      <WorkspaceFilter params={params} />
                      <ProjectFilter params={params} />
                    </div>
                    {/* {api.getAPI()} */}
                    <ServiceTable />
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



export default Service;