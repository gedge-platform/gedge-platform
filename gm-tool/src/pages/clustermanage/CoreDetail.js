import React, { Component, useEffect } from "react";

import { TabContent, TabPane, NavLink, NavItem, Collapse, CardText, Nav, Card, Row, Col, CardBody, Container, Table, CardHeader, Dropdown, DropdownMenu, DropdownItem, DropdownToggle, Modal, ModalHeader, ModalBody, Form, Input, Label, FormGroup, Button } from "reactstrap";
import { MDBDataTable } from "mdbreact";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";
import FormXeditable from "../Forms/FormXeditable";
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

import classnames from "classnames";

// import EarningReports from "../Dashboard/EarningReports"
import store from "../../store/Monitor/store/Store"

import CoreDetailResource from "./CoreDetailResource";
import CoreDetailNode from "./CoreDetailNode";
import CoreDetailMeta from "./CoreDetailMeta";
import CoreDetailEvent from "./CoreDetailEvent";
import DetailMeta from "../../components/Common/DetailMeta";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  alert: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const CoreDetail = observer((props) => {

  const classes = useStyles();
  const { match } = props
  // console.log(match)
  const { callApiStore } = store;
  const [breadcrumbItems, setBreadcrumbItems] = React.useState([
    { title: "클러스터 관리", link: "#" },
    { title: "클라우드 코어", link: "#" },
    { title: "상세 보기", link: "#" },
  ]);

  const [activeTabTop, setActiveTabTop] = React.useState("1")
  const [activeTabCont, setActiveTabCont] = React.useState("1")
  // const [activeTab2, setActiveTab2] = React.useState("9")
  // const [activeTab3, setActiveTab3] = React.useState("13")
  // const [customActiveTab, setCustomActiveTab] = React.useState("1")
  // const [activeTabJustify, setActiveTabJustify] = React.useState("5")
  const [col1, setCol1] = React.useState(false)
  // const [col2, setCol2] = React.useState(false)
  // const [col3, setCol3] = React.useState(false)
  // const [col5, setCol5] = React.useState(true)
  // const [projectType, setProjectType] = React.useState()


  useEffect(() => {

    callApiStore.getClusterDetail("clusters", match.params.name);
    return () => {
    }
  }, [])

  const toggleTop = (tab) => {
    if (activeTabTop !== tab) {
      setActiveTabTop(tab)
    }
  }

  const toggleCont = (tab) => {
    if (activeTabCont !== tab) {
      setActiveTabCont(tab)
    }
  }

  const t_col1 = () => {
    setCol1(!col1)
  }
  let clusterMasterData = []
  if (callApiStore.clusterDetailMaster == undefined || clusterMasterData.length < 0) {
    clusterMasterData = []
  } else {
    clusterMasterData = callApiStore.clusterDetailMaster
  }

  const clusterWorkerData = callApiStore.clusterDetailWorker

  let ipAddr = ""
  let clusterEndpoint = ""
  let clusterCreator = ""
  let gpu = ""
  let kubeVersion = ""
  let status = ""
  let network = ""
  let os = ""
  let kernel = ""
  let created_at = ""
  let events = []
  let labels = [];
  let annotations = [];

  let resource = {};

  if (clusterMasterData.length != 0) {

    ipAddr = clusterMasterData[0].ipAddr
    clusterEndpoint = clusterMasterData[0].clusterEndpoint
    clusterCreator = clusterMasterData[0].clusterCreator
    gpu = clusterMasterData[0].gpu
    kubeVersion = clusterMasterData[0].kubeVersion
    status = clusterMasterData[0].stauts
    network = clusterMasterData[0].network
    os = clusterMasterData[0].os
    kernel = clusterMasterData[0].kernel
    created_at = clusterMasterData[0].created_at
    events = clusterMasterData[0].events
    labels = clusterMasterData[0].labels
    annotations = clusterMasterData[0].annotations
    resource = clusterMasterData[0].resource
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="클라우드 코어 관리" breadcrumbItems={breadcrumbItems} />

          <Row>
            <Col lg={4}>
              <Card className="checkout-order-summary">
                <CardBody>
                  {/* <div className="p-3 bg-light mb-4"> */}
                  <h5 className="text-dark font-weight-bold">{match.params.name}</h5>
                  <Row>
                    <Col sm={3}>

                    </Col>
                  </Row>

                  <div className="table-responsive">
                    <Table responsive className="mb-0">
                      <thead>
                        <tr>
                          {/* 상세정보 */}
                          <th style={{ width: "100%" }}>상세정보</th>
                          <th style={{ width: "100%" }}>내용</th>
                          {/* <th>Examples</th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {/* {apitoData.map((test) => (
                             <tr key={test.name}>
                               <td>kubeProxyVersion</td>
                              <td>{test.kubeProxyVersion}</td>
                             </tr>
                           ))}
                           {apitoData.map(({ machineID, kernelVersion, osImage }) => (
                             <tr >
                               <td>상태</td>
                               <td>{osImage}</td>
                             </tr>
                           ))} */}
                        <tr>
                          <td>Status</td>
                          <td>{status}</td>
                        </tr>
                        <tr>
                          <td>IP</td>
                          <td>{clusterEndpoint}</td>
                        </tr>
                        <tr>
                          <td>Creator</td>
                          <td>{clusterCreator}</td>
                        </tr>

                        <tr>
                          <td>Os</td>
                          <td>{os}</td>
                        </tr>

                        <tr>
                          <td>Gpu </td>
                          <td>GPU_List</td>
                        </tr>
                        <tr>
                          <td>KubeVersion</td>
                          <td>{kubeVersion}</td>
                        </tr>
                        <tr>
                          <td>Network </td>
                          <td>{network}</td>
                        </tr>
                        <tr>
                          <td>Kernel </td>
                          <td>{kernel}</td>
                        </tr>
                        <tr>
                          <td>Created</td>
                          <td>{created_at}</td>
                        </tr>
                      </tbody>

                    </Table>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col lg={8}>
              <Card>
                <CardBody>
                  <Nav pills className="navtab-bg nav-justified">
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: activeTabTop === "1"
                        })}
                        onClick={() => {
                          toggleTop("1");
                        }}
                      >
                        리소스 상태
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: activeTabTop === "2"
                        })}
                        onClick={() => {
                          toggleTop("2");
                        }}
                      >
                        노드 정보
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: activeTabTop === "3"
                        })}
                        onClick={() => {
                          toggleTop("3");
                        }}
                      >
                        메타데이터
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: activeTabTop === "4"
                        })}
                        onClick={() => {
                          toggleTop("4");
                        }}
                      >
                        이벤트
                      </NavLink>
                    </NavItem>
                  </Nav>
                  {/* 리소스 상태 탭 내용 */}
                  <TabContent activeTab={activeTabTop}>
                    <TabPane tabId="1" className="p-3">
                      <CoreDetailResource resource={resource} />
                    </TabPane>
                  </TabContent>

                  <TabContent activeTab={activeTabTop}>
                    <TabPane tabId="2" className="p-3">
                      <CoreDetailNode clusterWorkerData={clusterWorkerData} />
                    </TabPane>
                  </TabContent>

                  <TabContent activeTab={activeTabTop}>
                    <TabPane tabId="3" className="p-3">
                      {Object.keys(clusterMasterData).length !== 0 ? <DetailMeta data={clusterMasterData[0]} /> : <></>}
                      {/* <DetailMeta data={clusterMasterData} /> */}
                      {/* <CoreDetailMeta labels={labels} annotations={annotations} /> */}
                    </TabPane>
                  </TabContent>
                  <TabContent activeTab={activeTabTop}>
                    <TabPane tabId="4" className="p-3">
                      <CoreDetailEvent events={events} />
                    </TabPane>
                  </TabContent>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
})

export default CoreDetail;


