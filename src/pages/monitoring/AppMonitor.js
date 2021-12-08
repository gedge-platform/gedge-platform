import React, { Component, useState, useEffect, useRef, useLayoutEffect } from "react";
import {
  Container,
  Card,
  CardBody,
} from "reactstrap";

import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  useRouteMatch,
} from "react-router-dom";
import { observer } from "mobx-react";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import classnames from "classnames";

import store from "../../store/Monitor/store/Store"
import Cluster from "./app/Cluster"
import Application from "./app/Application"
import LineCharts from "../AllCharts/recharts/LineCharts";
import axios from "axios";

import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

// const AppMonitor = observer(() => {
const AppMonitor = observer(() => {
  const { clusterStore } = store;

  const [breadcrumbItems, setBreadcrumbItems] = React.useState([
    { title: "모니터링", link: "#" },
    { title: "어플리케이션 모니터링", link: "#" },
  ]);

  const [anchorEl, setAnchorEl] = React.useState(null);

  useEffect(() => {
    clusterStore.cluster_lists();
    clusterStore.physical_request(60, 10, "all", "cpu_usage|memory_usage", "cluster");
    clusterStore.resource_request(60, 10, "all", "pod_count|service_count|deployment_count|cronjob_count|job_count|pv_count|pvc_count|namespace_count", "app");
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const MenuClose = (value) => {
    clusterStore.cur_cluster = value
    setAnchorEl(null);
  };

  const ButtonClose = () => {
    setAnchorEl(null);
  };

  const clusterList = clusterStore.cluster_list
  const cur_cluster = clusterStore.cur_cluster
  // let clusterNameList = [];

  // clusterList.map((item, idx) => {
  //   clusterNameList.push(item.clusterName)
  // })

  const clusterNameList = clusterList.map((item, idx) => {
    return (
      <MenuItem onClick={() => MenuClose(item.clusterName)}>{item.clusterName}</MenuItem>
    )
  })

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="모니터링" breadcrumbItems={breadcrumbItems} />
          <Card>
            <CardBody>
              <div>
                <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                  {clusterStore.cur_cluster}
                </Button>
                <Menu
                  id="simple-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={ButtonClose}
                >
                  {clusterNameList}
                </Menu>
              </div>
              <hr></hr>
              <h4>클러스터 리소스 사용량</h4>
              <Cluster />
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <h4>어플리케이션 리소스 사용량</h4>
              <Application />
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
})

export default AppMonitor;
