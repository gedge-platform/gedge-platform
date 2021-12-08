import React, { Component, useState, useEffect, useLayoutEffect } from "react";
import {
  Container,
  Card,
  CardBody,
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  UncontrolledTooltip,
  Input,
  Label,
  Button,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  ButtonDropdown,
  ButtonGroup,
  TabContent,
  TabPane,
  CardText,
} from "reactstrap";
import { observer } from "mobx-react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  useRouteMatch,
} from "react-router-dom";

import Breadcrumbs from "../../components/Common/Breadcrumb";
import classnames from "classnames";

import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Fade from '@material-ui/core/Fade';

import Physical from "./cluster/Physical";
import ApiServer from "./cluster/ApiServer";
import Scheduler from "./cluster/Scheduler";
import GPU from "./cluster/Gpu";
import store from "../../store/Monitor/store/Store"
import axios from "axios";

const ClusterMonitor = observer((props) => {

  const [activeTab, setActiveTab] = React.useState("1");
  const [breadcrumbItems, setBreadcrumbItems] = React.useState([
    { title: "모니터링", link: "#" },
    { title: "클러스터 모니터링", link: "#" },
  ]);

  const { clusterStore } = store;

  const clusterList = clusterStore.cluster_list
  // console.log(clusterList)
  let clusterNameList = [];

  clusterList.map((item, idx) => {
    clusterNameList.push(item.clusterName)
  })

  useEffect(() => {
    clusterStore.cluster_lists();
    clusterStore.physical_request(60, 10, "all", "cpu_util|cpu_usage|cpu_total|memory_util|memory_usage|memory_total|disk_util|disk_usage|disk_total", "cluster");
    // clusterStore.apiserver_request(60, 10, "all", "apiserver_request_rate|apiserver_latency", "cluster");
    clusterStore.apiserver_request(60, 10, "all", "apiserver_request_rate", "cluster");
    clusterStore.shceduler_request(60, 10, "all", "scheduler_attempts|scheduler_attempts_total|scheduler_fail|scheduler_fail_total|scheduler_latency|pod_running|pod_quota|pod_util", "cluster");
    // clusterStore.cluster_request(60, 10, "all", "gpu_temperature|gpu_power|gpu_power_limit|gpu_memory_total|gpu_memory_used|gpu_memory_free|gpu_ratio|gpu_memory_ratio|gpu_fan_speed|gpu_info");

  }, []);

  const toggle = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  // console.log(fistClusterName)

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="모니터링" breadcrumbItems={breadcrumbItems} />
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <Nav pills className="navtab-bg nav-justified">
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: activeTab === "1",
                        })}
                        onClick={() => { toggle("1"); }}
                      >
                        물리자원
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: activeTab === "2",
                        })}
                        onClick={() => { toggle("2"); }}
                      >
                        API 서버
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: activeTab === "3",
                        })}
                        onClick={() => { toggle("3"); }}
                      >
                        스케줄러
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: activeTab === "4",
                        })}
                        onClick={() => { toggle("4"); }}
                      >
                        GPU
                      </NavLink>
                    </NavItem>
                  </Nav>
                  {/* <hr></hr> */}
                  <TabContent activeTab={activeTab}>
                    <TabPane tabId="1" >
                      <Row>
                        <Col sm="12">
                          <Physical clusterNameList={clusterNameList} />
                          {/* <CardText> */}
                          {/* <Physical first={cluster_first} cluster={cur_cluster} /> */}
                          {/* {activeTab === "1" ? <Physical /> : ""} */}
                          {/* </CardText> */}
                        </Col>
                      </Row>
                    </TabPane>
                    <TabPane tabId="2" >
                      <Row>
                        <Col sm="12">
                          {/* <CardText> */}
                          <ApiServer clusterNameList={clusterNameList} />
                          {/* {activeTab === "2" ? <ApiServer clusterNameList={clusterNameList} /> : ""} */}
                          {/* </CardText> */}
                        </Col>
                      </Row>
                    </TabPane>
                    <TabPane tabId="3" >
                      <Row>
                        <Col sm="12">
                          {/* <CardText> */}
                          <Scheduler clusterNameList={clusterNameList} />
                          {/* {activeTab === "3" ? <Scheduler /> : ""} */}
                          {/* </CardText> */}
                        </Col>
                      </Row>
                    </TabPane>
                    <TabPane tabId="4" >
                      <Row>
                        <Col sm="12">
                          {/* <CardText> */}
                          {/* <GPU /> */}
                          {/* </CardText> */}
                        </Col>
                      </Row>
                    </TabPane>
                  </TabContent>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
});
export default ClusterMonitor;
