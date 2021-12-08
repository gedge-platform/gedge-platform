import React, { Component, useEffect } from "react";

import { TabContent, TabPane, NavLink, NavItem, Collapse, CardText, Nav, Card, Row, Col, CardBody, Container, Table, CardHeader, Dropdown, DropdownMenu, DropdownItem, DropdownToggle, Modal, ModalHeader, ModalBody, Form, Input, Label, FormGroup, Button } from "reactstrap";
import { MDBDataTable } from "mdbreact";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";
import FormXeditable from "../Forms/FormXeditable";
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

import classnames from "classnames";
import ProjectDetail_detail from "./ProjectDetail_detail";
import ProjectResource from "./ProjectResource";
import ProjectMetadata from "./projectMetadata";
import ProjectEvent from "./ProjectEvent"
// import EarningReports from "../Dashboard/EarningReports"
import store from "../../store/Monitor/store/Store"


import { makeStyles } from '@material-ui/core/styles';
import queryString from "query-string";
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
const ProjectDetail = observer((props) => {

    const classes = useStyles();
    const { match } = props
    // console.log(match)
    const { callApiStore } = store;
    const query = queryString.parse(props.location.search);
    const [breadcrumbItems, setBreadcrumbItems] = React.useState([
        { title: "프로젝트", link: "#" },
        { title: "프로젝트", link: "#" },
        { title: "상세 보기", link: "#" },
    ]);
    const [breadcrumbTitle, setBreadcrumbTitle] = React.useState("프로젝트");
    const projectTitle = () => {
        if (match.params.projectType == "user") {
            setBreadcrumbItems([
                { title: "프로젝트", link: "#" },
                { title: "사용자 프로젝트", link: "#" },
                { title: "상세 보기", link: "#" },
            ])
            setBreadcrumbTitle("사용자 프로젝트")
        } else {
            setBreadcrumbItems([
                { title: "프로젝트", link: "#" },
                { title: "시스템 프로젝트", link: "#" },
                { title: "상세 보기", link: "#" },
            ])
            setBreadcrumbTitle("시스템 프로젝트")
        }
    }

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
    console.log(query)


    useEffect(() => {
        projectTitle()
        if (query != undefined && match != undefined) {
            const clusters = query.cluster.split(",");
            console.log(clusters)
            callApiStore.getProjectDetail("projects", match.params.name, clusters, query.workspace);
        }
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
    let projectData = []
    if (callApiStore.projectDetail == undefined || projectData.length > 0) {
        projectData = []
    } else {
        projectData = callApiStore.projectDetail
    }

    console.log(projectData)
    console.log(projectData.length, "length")
    // let deployment_count = 0;
    // let pod_count = 0;
    // let service_count = 0;
    // let cronjob_count = 0;
    // let job_count = 0;
    // let volume_count = 0;

    // let annotations = []
    // let clusterName = ""
    // let created_at = ""
    // let events = ""
    // let labels = []
    // let projectCreator = ""
    // let projectDescription = ""
    // let projectName = ""
    // let projectNum = ""
    // let projectOwner = ""
    // let projectType = ""
    // let resource = ""
    // let selectCluster = ""
    // let status = ""
    // let workspaceName = ""

    // if (clusterMasterData.length != 0) {

    //     ipAddr = clusterMasterData[0].ipAddr
    //     clusterEndpoint = clusterMasterData[0].clusterEndpoint
    //     clusterCreator = clusterMasterData[0].clusterCreator
    //     gpu = clusterMasterData[0].gpu
    //     kubeVersion = clusterMasterData[0].kubeVersion
    //     status = clusterMasterData[0].stauts
    //     network = clusterMasterData[0].network
    //     os = clusterMasterData[0].os
    //     kernel = clusterMasterData[0].kernel
    //     created_at = clusterMasterData[0].created_at
    //     events = clusterMasterData[0].events
    //     labels = clusterMasterData[0].lables
    //     annotations = clusterMasterData[0].annotations
    //     resource = clusterMasterData[0].resource
    // }

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title={breadcrumbTitle} breadcrumbItems={breadcrumbItems} />

                    <Row>
                        <Col lg={4}>
                            <Card className="checkout-order-summary" >
                                <CardBody>
                                    {/* <div className="p-3 bg-light mb-4"> */}
                                    <h5 className="text-dark font-weight-bold" style={{ width: "100%" }}>{match.params.name}</h5>
                                    {/* <Row>
                                        <Col sm={3}>
// button
                                        </Col>
                                    </Row> */}

                                    <div className="table-responsive">
                                        {projectData.length != 0 ? <ProjectDetail_detail projectData={projectData} query={query} /> : <></>}

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
                                                모니터링
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
                                            {projectData.length != 0 ? <ProjectResource projectData={projectData} query={query} /> : <></>}

                                        </TabPane>
                                    </TabContent>

                                    <TabContent activeTab={activeTabTop}>
                                        <TabPane tabId="2" className="p-3">

                                            {/* <CoreDetailNode clusterWorkerData={clusterWorkerData} /> */}
                                        </TabPane>
                                    </TabContent>

                                    <TabContent activeTab={activeTabTop}>
                                        <TabPane tabId="3" className="p-3">
                                            {projectData.length != 0 ? <ProjectMetadata projectData={projectData} query={query} /> : <></>}
                                            {/* <ProjectMetadata projectData={projectData} /> */}
                                        </TabPane>
                                    </TabContent>
                                    <TabContent activeTab={activeTabTop}>
                                        <TabPane tabId="4" className="p-3">
                                            {projectData.length != 0 ? <ProjectEvent events={[]} query={query} /> : <></>}
                                            {/* <CoreDetailEvent events={events} /> */}
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

export default ProjectDetail;