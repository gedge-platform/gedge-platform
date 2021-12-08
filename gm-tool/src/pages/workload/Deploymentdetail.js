import React, { Component, useEffect } from "react";

import { TabContent, TabPane, NavLink, NavItem, Collapse, CardText, Nav, Card, Row, Col, CardBody, Container, Table, CardHeader, Dropdown, DropdownMenu, DropdownItem, DropdownToggle, Modal, ModalHeader, ModalBody, Form, Input, Label, FormGroup, Button } from "reactstrap";
import { MDBDataTable } from "mdbreact";
import store from "../../store/Monitor/store/Store"
import { observer } from "mobx-react";
import { Link } from "react-router-dom";
import FormXeditable from "../Forms/FormXeditable";
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

import classnames from "classnames";

import queryString from "query-string";

import { makeStyles } from '@material-ui/core/styles';
import DeploymentDetail_detail from './DeploymentDetail_detail'
import DeploymentReplicaStatus from './DeploymentReplicaStatus'
import DeploymentPorts from './DeploymentPorts'
import DeploymentPodState from './DeploymentPodState'
import DeploymentMeta from "./DeploymentMeta";
import DeploymentEvent from "./DeploymentEvent"
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

const Deploymentdetail = observer((props) => {

    const classes = useStyles();
    const { match } = props
    const query = queryString.parse(props.location.search);
    const { callApiStore } = store;
    const [breadcrumbItems, setBreadcrumbItems] = React.useState([
        { title: "워크로드", link: "#" },
        { title: "디플로이먼트", link: "#" },
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
        callApiStore.getWorkloadDetail("deployments", match.params.name, query.workspace, query.project, query.cluster);
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
    let workloadData = []
    let workloadInvolveData = []
    console.log(workloadData, "workloadData")
    if (callApiStore.deploymentDetail == undefined || workloadData.length < 0) {
        workloadData = []
    } else {
        workloadData = callApiStore.deploymentDetail
    }
    if (callApiStore.deploymentDetailInvolve == undefined || workloadInvolveData.length < 0) {
        workloadInvolveData = []
    } else {
        workloadInvolveData = callApiStore.deploymentDetailInvolve
    }
    console.log(workloadData, "workloadData")
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="디플로이먼트" breadcrumbItems={breadcrumbItems} />

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
                                            {/* Overview */}
                                            {workloadData.length != 0 ? <DeploymentDetail_detail workloadData={workloadData} /> : <></>}
                                            {/* <DeploymentDetail_detail workloadData={workloadData} /> */}
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
                                                메타데이터
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
                                                환경변수
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
                                            {workloadData.length != 0 ? <DeploymentReplicaStatus workloadData={workloadData} /> : <></>}
                                            {workloadInvolveData.length != 0 ? <DeploymentPorts workloadInvolveData={workloadInvolveData} query={query} /> : <></>}
                                            {workloadInvolveData.length != 0 ? <DeploymentPodState workloadInvolveData={workloadInvolveData} query={query} /> : <></>}
                                            {/* <CoreDetailResource resource={resource} /> */}
                                        </TabPane>
                                    </TabContent>

                                    <TabContent activeTab={activeTabTop}>
                                        <TabPane tabId="2" className="p-3">
                                            {workloadData.length != 0 ? <DeploymentMeta workloadData={workloadData} /> : <></>}
                                            {/* <CoreDetailNode clusterWorkerData={clusterWorkerData} /> */}
                                        </TabPane>
                                    </TabContent>

                                    <TabContent activeTab={activeTabTop}>
                                        <TabPane tabId="3" className="p-3">
                                            {/* <CoreDetailMeta labels={labels} annotations={annotations} /> */}
                                        </TabPane>
                                    </TabContent>
                                    <TabContent activeTab={activeTabTop}>
                                        <TabPane tabId="4" className="p-3">
                                            {/* <CoreDetailEvent events={events} /> */}
                                            {workloadData.length != 0 ? <DeploymentEvent events={workloadData.events} /> : <></>}
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

export default Deploymentdetail;


