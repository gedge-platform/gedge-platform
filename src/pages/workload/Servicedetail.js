import React, { Component, useEffect } from "react";
import { observer } from "mobx-react";
import { TabContent, TabPane, NavLink, NavItem, CardText, Nav, Card, Row, Col, CardBody, Container, Table, Dropdown, DropdownMenu, DropdownItem, DropdownToggle, Modal, ModalHeader, ModalBody, Form, Input, Label, FormGroup, Button, Alert } from "reactstrap";
import { Link } from "react-router-dom";
//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import img1 from "../../assets/images/companies/img-1.png";
//Import Breadcrumb
import "../workload/detail.css";
import classnames from 'classnames';
import "../Dashboard/dashboard.scss";
import * as api from '../../components/Common/api';
import Detail from './Detail'
// import ServiceDetail_detail from "./ServiceDetail_detail";
import ServicePodState from "./ServicePodState"
import { load } from "dotenv";
import ServicePorts from "./ServicePorts";
import ServiceDeploy from "./ServiceDeploy";
import DeploymentMeta from "./DeploymentMeta";
import store from "../../store/Monitor/store/Store"
import queryString from "query-string";

import { makeStyles } from '@material-ui/core/styles';

import ServiceDetail_detail from "./ServiceDetail_detail"
import ServiceDetailEvent from "./ServiceDetailEvent";
import ServiceDetailMeta from "./ServiceDetailMeta"
import ServiceDetailPort from "./ServiceDetailPort"
import ServiceDetailResource from "./ServiceDetailResource"
// import EarningReports from "../Dashboard/EarningReports"
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

const Servicedetail = observer((props) => {

    const classes = useStyles();
    const { match } = props
    const query = queryString.parse(props.location.search);
    // console.log(match)
    // console.log(query)
    const { callApiStore } = store;
    const [breadcrumbItems, setBreadcrumbItems] = React.useState([
        { title: "워크로드", link: "#" },
        { title: "서비스", link: "#" },
        { title: "상세 보기", link: "#" },
    ]);

    const [activeTabTop, setActiveTabTop] = React.useState("1")
    const [activeTabCont, setActiveTabCont] = React.useState("1")
    const [col1, setCol1] = React.useState(false)

    useEffect(() => {
        callApiStore.getWorkloadDetail("services", match.params.name, query.workspace, query.project, query.cluster);
        //params = param + "/" + name + "?workspace=" + workspaceName + "&project=" + projectName + "&cluster=" + clusterName
        //param, name, workspaceName, projectName, clusterName
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

    let serviceData = []
    serviceData = callApiStore.serviceDetail
    if (serviceData === undefined) {
        serviceData = []
    }
    let serviceinvolvesData = []
    serviceinvolvesData = callApiStore.serviceDetailInvolve
    // console.log(serviceData, "serviceData")
    if (serviceinvolvesData === undefined) {
        serviceinvolvesData = []
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="서비스" breadcrumbItems={breadcrumbItems} />

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
                                            {/*  {apilistinfo.length != 0 ? <PodDetailMonit apilistinfo={apilistinfo} /> : <></>} */}
                                            {serviceData.length != 0 ? <ServiceDetail_detail workloadData={serviceData} /> : <></>}
                                            {/* <DeploymentDetail_detail workloadData={serviceData} /> */}
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
                                                포트 정보
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
                                            {/* <CoreDetailResource resource={resource} /> */}
                                            {Object.keys(serviceData).length !== 0 ? <ServiceDetailResource resource={serviceinvolvesData} /> : <></>}
                                            {/* {serviceData.length != 0 ? <ServiceDetailResource resource={serviceinvolvesData} /> : <></>} */}
                                        </TabPane>
                                    </TabContent>

                                    <TabContent activeTab={activeTabTop}>
                                        <TabPane tabId="2" className="p-3">
                                            {/* <CoreDetailNode clusterWorkerData={clusterWorkerData} /> */}
                                            {Object.keys(serviceData).length !== 0 ? <ServiceDetailPort port={serviceData.port} /> : <></>}
                                            {/* {serviceData.length != 0 ? <ServiceDetailPort port={serviceData.port} /> : <></>} */}
                                        </TabPane>
                                    </TabContent>

                                    <TabContent activeTab={activeTabTop}>
                                        <TabPane tabId="3" className="p-3">
                                            {/* <CoreDetailMeta labels={labels} annotations={annotations} /> */}
                                            {Object.keys(serviceData).length !== 0 ? <ServiceDetailMeta selector={serviceData.selector} /> : <></>}
                                            {/* {serviceData.length != 0 ? <ServiceDetailMeta selector={serviceData.selector} /> : <></>} */}
                                            {/* <ServiceDetailMeta selector={serviceData.selector} /> */}
                                        </TabPane>
                                    </TabContent>
                                    <TabContent activeTab={activeTabTop}>
                                        <TabPane tabId="4" className="p-3">
                                            {Object.keys(serviceData).length !== 0 ? <ServiceDetailEvent events={serviceData.events} /> : <></>}
                                            {/* {serviceData.length != 0 ? <ServiceDetailEvent events={serviceData.events} /> : <></>} */}
                                            {/* <ServiceDetailEvent events={events} /> */}
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
})

export default Servicedetail;

// class Servicedetail extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             breadcrumbItems: [
//                 { title: "워크로드", link: "#" },
//                 { title: "서비스", link: "#" },
//             ],
//             activeTab: "1",
//             activeTab1: "5",
//             activeTab2: "9",
//             activeTab3: "13",
//             customActiveTab: "1",
//             activeTabJustify: "5",
//             col1: true,
//             col2: false,
//             col3: false,
//             col5: true,
//             apiList: [],
//         };

//         this.toggle = this.toggle.bind(this);
//         this.toggle1 = this.toggle1.bind(this);

//         this.t_col1 = this.t_col1.bind(this);
//         this.t_col2 = this.t_col2.bind(this);
//         this.t_col3 = this.t_col3.bind(this);
//         this.t_col5 = this.t_col5.bind(this);

//         this.toggle2 = this.toggle2.bind(this);
//         this.toggle3 = this.toggle3.bind(this);

//         this.toggleCustomJustified = this.toggleCustomJustified.bind(this);
//         this.toggleCustom = this.toggleCustom.bind(this);
//     }

//     t_col1() {
//         this.setState({ col1: !this.state.col1, col2: false, col3: false });
//     }
//     t_col2() {
//         this.setState({ col2: !this.state.col2, col1: false, col3: false });
//     }
//     t_col3() {
//         this.setState({ col3: !this.state.col3, col1: false, col2: false });
//     }
//     t_col5() {
//         this.setState({ col5: !this.state.col5 });
//     }

//     toggle(tab) {
//         if (this.state.activeTab !== tab) {
//             this.setState({
//                 activeTab: tab
//             });
//         }
//     }
//     toggle1(tab) {
//         if (this.state.activeTab1 !== tab) {
//             this.setState({
//                 activeTab1: tab
//             });
//         }
//     }
//     toggle2(tab) {
//         if (this.state.activeTab2 !== tab) {
//             this.setState({
//                 activeTab2: tab
//             });
//         }
//     }
//     toggle3(tab) {
//         if (this.state.activeTab3 !== tab) {
//             this.setState({
//                 activeTab3: tab
//             });
//         }
//     }

//     toggleCustomJustified(tab) {
//         if (this.state.activeTabJustify !== tab) {
//             this.setState({
//                 activeTabJustify: tab
//             });
//         }
//     }

//     toggleCustom(tab) {
//         if (this.state.customActiveTab !== tab) {
//             this.setState({
//                 customActiveTab: tab
//             });
//         }
//     }

//     loadApilist() {
//         const { params } = this.props.match;
//         // console.log(this.props.username)
//         let link = "namespaces/" + params.namespace + "/services/" + params.name
//         // console.log(link, "link")
//         let test = api.getDetailAPI(link, 'GET')
//         // console.log(api.getDetailAPI(link, 'GET'), "laodAPIlist")
//         return test;
//     }

//     componentDidMount() {
//         let data = [];
//         this.loadApilist().then(res => {
//             // console.log(res, "res");
//             // data = JSON.stringify(res)
//             // data = JSON.parse(data);
//             data.push(res);
//             // console.log(data, "data");
//             this.setState({
//                 apiList: data
//             })
//         })

//     }
//     render() {
//         // console.log(this.props);
//         const apiList = this.state.apiList;
//         const { params } = this.props.match;
//         let link = "namespaces/" + params.namespace + "/services/" + params.name
//         // console.log(params.namespace, params.name)
//         // console.log(this.state.apiList, "serviceDetail")
//         let apitoData = []
//         let labels = []
//         let selectors = []
//         let updateTime = []
//         let loadBalancer = []
//         let annotations = [];
//         let dataFromApi = apiList.map(list => {
//             if (list.metadata.annotations == undefined) {
//                 annotations = "-"
//             } else {
//                 annotations = list.metadata.annotations;
//             }
//             // labels.push(list.metadata.labels);
//             if (list.metadata.managedFields.length > 1) {
//                 list.metadata.managedFields.map(time => {
//                     updateTime = time.time
//                 })
//             } else {
//                 updateTime = list.metadata.managedFields[0].time;
//             }
//             labels = list.metadata.labels;
//             if (list.spec.selector === undefined) {
//                 selectors = "-"
//             } else {
//                 selectors = list.spec.selector
//             }
//             if (Object.keys(list.status.loadBalancer).length < 1) {
//                 loadBalancer = "-"
//             } else {
//                 loadBalancer = list.status.loadBalancer;
//             }
//             return {
//                 name: list.metadata.name,
//                 namespace: list.metadata.namespace,
//                 createTime: list.metadata.creationTimestamp,
//                 label: labels,
//                 ip: list.spec.clusterIP,
//                 uid: list.metadata.uid,
//                 selector: selectors,
//                 port: list.spec.ports,
//                 sessionAffinity: list.spec.sessionAffinity,
//                 loadBalancer: loadBalancer,
//                 type: list.spec.type,
//                 updateTime: updateTime,
//                 annotations: annotations
//             }
//         })
//         apitoData = dataFromApi;
//         console.log(apitoData, "apitoData");

//         return (
//             <React.Fragment>
//                 <div className="page-content">
//                     <Container fluid>
//                         <Breadcrumbs title="Service Detail" breadcrumbItems={this.state.breadcrumbItems} />

//                         <Row>
//                             <Col lg={4}>
//                                 <Card className="checkout-order-summary">
//                                     <CardBody>
//                                         {/* <div className="p-3 bg-light mb-4"> */}
//                                         <h5 className="text-dark font-weight-bold">{params.name}</h5>
//                                         <Card>
//                                         </Card>
//                                         <Row>
//                                             <div>
//                                                 <Link
//                                                     onClick={() =>
//                                                         this.setState({ isModal: !this.state.modal })
//                                                     }
//                                                     to="#"
//                                                     className="popup-form btn btn-primary"
//                                                 >
//                                                     정보수정
//                                                 </Link>
//                                             </div>
//                                             <Modal
//                                                 size="xl"
//                                                 isOpen={this.state.isModal}
//                                                 centered={true}
//                                                 toggle={() =>
//                                                     this.setState({ isModal: !this.state.isModal })
//                                                 }
//                                             >
//                                                 <ModalHeader
//                                                     toggle={() =>
//                                                         this.setState({ isModal: !this.state.isModal })
//                                                     }
//                                                 >
//                                                     Form
//                                                 </ModalHeader>
//                                                 <ModalBody>
//                                                     <Form>
//                                                         <Row>
//                                                             <Col lg={4}>
//                                                                 <FormGroup>
//                                                                     <Label htmlFor="name">Name</Label>
//                                                                     <Input
//                                                                         type="text"
//                                                                         className="form-control"
//                                                                         id="name"
//                                                                         placeholder="Enter Name"
//                                                                         required
//                                                                     />
//                                                                 </FormGroup>
//                                                             </Col>
//                                                             <Col lg={4}>
//                                                                 <FormGroup>
//                                                                     <Label htmlFor="email">Email</Label>
//                                                                     <Input
//                                                                         type="email"
//                                                                         className="form-control"
//                                                                         id="email"
//                                                                         placeholder="Enter Email"
//                                                                         required
//                                                                     />
//                                                                 </FormGroup>
//                                                             </Col>
//                                                             <Col lg={4}>
//                                                                 <FormGroup>
//                                                                     <Label htmlFor="password">Password</Label>
//                                                                     <Input
//                                                                         type="text"
//                                                                         className="form-control"
//                                                                         id="password"
//                                                                         placeholder="Enter Password"
//                                                                         required
//                                                                     />
//                                                                 </FormGroup>
//                                                             </Col>
//                                                         </Row>
//                                                         <Row>
//                                                             <Col lg={12}>
//                                                                 <FormGroup>
//                                                                     <Label htmlFor="subject">Subject</Label>
//                                                                     <textarea
//                                                                         className="form-control"
//                                                                         id="subject"
//                                                                         rows="3"
//                                                                     ></textarea>
//                                                                 </FormGroup>
//                                                             </Col>
//                                                         </Row>
//                                                         <Row>
//                                                             <Col lg={12}>
//                                                                 <div className="text-right">
//                                                                     <Button
//                                                                         type="submit"
//                                                                         color="primary"
//                                                                     >
//                                                                         Submit
//                                                                     </Button>
//                                                                 </div>
//                                                             </Col>
//                                                         </Row>
//                                                     </Form>
//                                                 </ModalBody>
//                                             </Modal>
//                                             <Col sm={3}>
//                                                 {/* 정보 수정 */}
//                                                 {/* 더보기 */}

//                                                 <Dropdown
//                                                     isOpen={this.state.singlebtn}
//                                                     toggle={() =>
//                                                         this.setState({ singlebtn: !this.state.singlebtn })
//                                                     }
//                                                 >
//                                                     <DropdownToggle color="primary" caret>
//                                                         더보기{" "}
//                                                         <i className="mdi mdi-chevron-down"></i>
//                                                     </DropdownToggle>
//                                                     <DropdownMenu>
//                                                         <DropdownItem>서비스 수정</DropdownItem>
//                                                         <DropdownItem>인터넷 접근 수정</DropdownItem>
//                                                         <DropdownItem>수정(YAML)</DropdownItem>
//                                                         <DropdownItem>삭제</DropdownItem>
//                                                     </DropdownMenu>
//                                                 </Dropdown>
//                                             </Col>
//                                         </Row>
//                                         {/* </div> */}
//                                         <div className="table-responsive">
//                                             <Table responsive className="mb-0">
//                                                 <thead>
//                                                     <div>
//                                                         <tr>
//                                                             <th style={{ width: "100%" }} className="border-top-0">상세정보</th>
//                                                         </tr>
//                                                     </div>
//                                                 </thead>
//                                                 <ServiceDetail_detail apitoData={apitoData} />
//                                             </Table>
//                                         </div>
//                                     </CardBody>
//                                 </Card>
//                             </Col>
//                             <Col lg={8}>
//                                 <Card>
//                                     <CardBody>
//                                         <Nav pills className="navtab-bg nav-justified">
//                                             <NavItem>
//                                                 <NavLink
//                                                     style={{ cursor: "pointer" }}
//                                                     className={classnames({
//                                                         active: this.state.activeTab1 === "5"
//                                                     })}
//                                                     onClick={() => {
//                                                         this.toggle1("5");
//                                                     }}
//                                                 >
//                                                     리소스 상태
//                                                 </NavLink>
//                                             </NavItem>
//                                             <NavItem>
//                                                 <NavLink
//                                                     style={{ cursor: "pointer" }}
//                                                     className={classnames({
//                                                         active: this.state.activeTab1 === "6"
//                                                     })}
//                                                     onClick={() => {
//                                                         this.toggle1("6");
//                                                     }}
//                                                 >
//                                                     메타 데이터
//                                                 </NavLink>
//                                             </NavItem>
//                                             <NavItem>
//                                                 <NavLink
//                                                     style={{ cursor: "pointer" }}
//                                                     className={classnames({
//                                                         active: this.state.activeTab1 === "7"
//                                                     })}
//                                                     onClick={() => {
//                                                         this.toggle1("7");
//                                                     }}
//                                                 >
//                                                     이벤트
//                                                 </NavLink>
//                                             </NavItem>
//                                         </Nav>

//                                         <TabContent activeTab={this.state.activeTab1}>
//                                             <TabPane tabId="5" className="p-3">
//                                                 <Row>
//                                                     <Col sm="12">
//                                                         <ServicePorts params={params} apitoData={apitoData} />
//                                                         <ServiceDeploy params={params} apitoData={apitoData} />
//                                                         <ServicePodState params={params} apitoData={apitoData} />
//                                                     </Col>
//                                                 </Row>
//                                             </TabPane>
//                                             <TabPane tabId="6" className="p-3">
//                                                 <Row>
//                                                     <Col sm="12">
//                                                         <DeploymentMeta apitoData={apitoData} />
//                                                     </Col>
//                                                 </Row>
//                                             </TabPane>
//                                             <TabPane tabId="7" className="p-3">
//                                                 <Row>
//                                                     <Col sm="12">
//                                                         {/* <CardText> */}
//                                                         <div className="table-responsive">
//                                                             {/* <Table className=" table-centered mb-0 table-nowrap"> */}
//                                                             <Table hover className=" mb-0 table-centered table-nowrap">
//                                                                 <thead>
//                                                                     <tr>
//                                                                         <th className="border-top-0" style={{ width: "110px" }} scope="col">이벤트</th>
//                                                                     </tr>
//                                                                 </thead>
//                                                                 <tbody>
//                                                                     <tr>
//                                                                         <Alert color="primary" >
//                                                                             A simple primary alert—check it out!
//                                                                         </Alert>
//                                                                         <Alert color="secondary" role="alert">
//                                                                             A simple secondary alert—check it out!
//                                                                         </Alert>
//                                                                         <Alert color="success" role="alert">
//                                                                             A simple success alert—check it out!
//                                                                         </Alert>
//                                                                         <Alert ccolor="danger" role="alert">
//                                                                             A simple danger alert—check it out!
//                                                                         </Alert>
//                                                                         <Alert color="warning" role="alert">
//                                                                             A simple warning alert—check it out!
//                                                                         </Alert>
//                                                                         <Alert color="info" className="mb-0" role="alert">
//                                                                             A simple info alert—check it out!
//                                                                         </Alert>
//                                                                     </tr>
//                                                                 </tbody>
//                                                             </Table>
//                                                         </div>
//                                                         {/* </CardText> */}
//                                                     </Col>
//                                                 </Row>
//                                             </TabPane>
//                                         </TabContent>
//                                     </CardBody>
//                                 </Card>
//                             </Col>

//                         </Row>



//                     </Container>
//                 </div>

//             </React.Fragment>
//         );
//     }
// }

// export default Servicedetail;
