import React, { Component } from "react";
import { TabContent, TabPane, NavLink, NavItem, CardText, Nav, Card, Row, Col, CardBody, Container, Table, Dropdown, DropdownMenu, DropdownItem, DropdownToggle, Modal, ModalHeader, ModalBody, Form, Input, Label, FormGroup, Button, Alert } from "reactstrap";
import { Link } from "react-router-dom";
//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';
// import "ace-builds/src-noconflict/mode-java";
// import "ace-builds/src-noconflict/theme-github";
import img1 from "../../assets/images/companies/img-1.png";
//Import Breadcrumb
import "../workload/detail.css";
import classnames from 'classnames';
import "../Dashboard/dashboard.scss";
import ProjectDetail_detail from "./ProjectDetail_detail";
// import * as api from '../../components/Common/api';
// import Detail from './Detail'
// import ServiceDetail_detail from "./ServiceDetail_detail";
// import ServicePodState from "./ServicePodState"
// import { load } from "dotenv";
// import ServicePorts from "./ServicePorts";
// import ServiceDeploy from "./ServiceDeploy";
// import DeploymentMeta from "./DeploymentMeta";
class WorkspaceDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            breadcrumbItems: [
                { title: "프로젝트", link: "#" },
                { title: "사용자", link: "#" },
            ],
            activeTab: "1",
            activeTab1: "5",
            activeTab2: "9",
            activeTab3: "13",
            customActiveTab: "1",
            activeTabJustify: "5",
            col1: true,
            col2: false,
            col3: false,
            col5: true,
            projectType: "-",
        };
        this.toggle = this.toggle.bind(this);
        this.toggle1 = this.toggle1.bind(this);

        this.t_col1 = this.t_col1.bind(this);
        this.t_col2 = this.t_col2.bind(this);
        this.t_col3 = this.t_col3.bind(this);
        this.t_col5 = this.t_col5.bind(this);

        this.toggle2 = this.toggle2.bind(this);
        this.toggle3 = this.toggle3.bind(this);

        this.toggleCustomJustified = this.toggleCustomJustified.bind(this);
        this.toggleCustom = this.toggleCustom.bind(this);
    }


    t_col1() {
        this.setState({ col1: !this.state.col1, col2: false, col3: false });
    }
    t_col2() {
        this.setState({ col2: !this.state.col2, col1: false, col3: false });
    }
    t_col3() {
        this.setState({ col3: !this.state.col3, col1: false, col2: false });
    }
    t_col5() {
        this.setState({ col5: !this.state.col5 });
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }
    toggle1(tab) {
        if (this.state.activeTab1 !== tab) {
            this.setState({
                activeTab1: tab
            });
        }
    }
    toggle2(tab) {
        if (this.state.activeTab2 !== tab) {
            this.setState({
                activeTab2: tab
            });
        }
    }
    toggle3(tab) {
        if (this.state.activeTab3 !== tab) {
            this.setState({
                activeTab3: tab
            });
        }
    }

    toggleCustomJustified(tab) {
        if (this.state.activeTabJustify !== tab) {
            this.setState({
                activeTabJustify: tab
            });
        }
    }

    toggleCustom(tab) {
        if (this.state.customActiveTab !== tab) {
            this.setState({
                customActiveTab: tab
            });
        }
    }
    loadApilist() {
        const { params } = this.props.match;
        // console.log(this.props.username)
        // let link = "namespaces/" + params.namespace + "/services/" + params.name
        // // console.log(link, "link")
        // let test = api.getDetailAPI(link, 'GET')
        // // console.log(api.getDetailAPI(link, 'GET'), "laodAPIlist")
        // return test;
    }
    componentDidMount() {
        this.setState({
            projectType: "user"
        })
        // let data = [];
        // this.loadApilist().then(res => {
        //     // console.log(res, "res");
        //     // data = JSON.stringify(res)
        //     // data = JSON.parse(data);
        //     data.push(res);
        //     // console.log(data, "data");
        //     this.setState({
        //         apiList: data
        //     })
        // })

    }
    render() {
        const projectType = this.state.projectType;
        const { params } = this.props.match;
        // let link = "namespaces/" + params.namespace + "/services/" + params.name
        // // console.log(params.namespace, params.name)
        // // console.log(this.state.apiList, "serviceDetail")
        // let apitoData = []
        // let labels = []
        // let selectors = []
        // let updateTime = []
        // let loadBalancer = []
        // let annotations = [];
        // let dataFromApi = apiList.map(list => {
        //     if (list.metadata.annotations == undefined) {
        //         annotations = "-"
        //     } else {
        //         annotations = list.metadata.annotations;
        //     }
        //     // labels.push(list.metadata.labels);
        //     if (list.metadata.managedFields.length > 1) {
        //         list.metadata.managedFields.map(time => {
        //             updateTime = time.time
        //         })
        //     } else {
        //         updateTime = list.metadata.managedFields[0].time;
        //     }
        //     labels = list.metadata.labels;
        //     if (list.spec.selector === undefined) {
        //         selectors = "-"
        //     } else {
        //         selectors = list.spec.selector
        //     }
        //     if (Object.keys(list.status.loadBalancer).length < 1) {
        //         loadBalancer = "-"
        //     } else {
        //         loadBalancer = list.status.loadBalancer;
        //     }
        //     return {
        //         name: list.metadata.name,
        //         namespace: list.metadata.namespace,
        //         createTime: list.metadata.creationTimestamp,
        //         label: labels,
        //         ip: list.spec.clusterIP,
        //         uid: list.metadata.uid,
        //         selector: selectors,
        //         port: list.spec.ports,
        //         sessionAffinity: list.spec.sessionAffinity,
        //         loadBalancer: loadBalancer,
        //         type: list.spec.type,
        //         updateTime: updateTime,
        //         annotations: annotations
        //     }
        // })
        // apitoData = dataFromApi;
        // console.log(apitoData, "apitoData");

        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>
                        <Breadcrumbs title="Project Detail" breadcrumbItems={this.state.breadcrumbItems} />

                        <Row>
                            <Col lg={4}>
                                <Card className="checkout-order-summary">
                                    <CardBody>
                                        {/* <div className="p-3 bg-light mb-4"> */}
                                        <h5 className="text-dark font-weight-bold">{params.name}</h5>
                                        <Card>
                                        </Card>
                                        <Row>
                                            <div>
                                                <Link
                                                    onClick={() =>
                                                        this.setState({ isModal: !this.state.modal })
                                                    }
                                                    to="#"
                                                    className="popup-form btn btn-primary"
                                                >
                                                    정보수정
                                                </Link>
                                            </div>
                                            <Modal
                                                size="xl"
                                                isOpen={this.state.isModal}
                                                centered={true}
                                                toggle={() =>
                                                    this.setState({ isModal: !this.state.isModal })
                                                }
                                            >
                                                <ModalHeader
                                                    toggle={() =>
                                                        this.setState({ isModal: !this.state.isModal })
                                                    }
                                                >
                                                    Form
                                                </ModalHeader>
                                                <ModalBody>
                                                    <Form>
                                                        <Row>
                                                            <Col lg={4}>
                                                                <FormGroup>
                                                                    <Label htmlFor="name">Name</Label>
                                                                    <Input
                                                                        type="text"
                                                                        className="form-control"
                                                                        id="name"
                                                                        placeholder="Enter Name"
                                                                        required
                                                                    />
                                                                </FormGroup>
                                                            </Col>
                                                            <Col lg={4}>
                                                                <FormGroup>
                                                                    <Label htmlFor="email">Email</Label>
                                                                    <Input
                                                                        type="email"
                                                                        className="form-control"
                                                                        id="email"
                                                                        placeholder="Enter Email"
                                                                        required
                                                                    />
                                                                </FormGroup>
                                                            </Col>
                                                            <Col lg={4}>
                                                                <FormGroup>
                                                                    <Label htmlFor="password">Password</Label>
                                                                    <Input
                                                                        type="text"
                                                                        className="form-control"
                                                                        id="password"
                                                                        placeholder="Enter Password"
                                                                        required
                                                                    />
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col lg={12}>
                                                                <FormGroup>
                                                                    <Label htmlFor="subject">Subject</Label>
                                                                    <textarea
                                                                        className="form-control"
                                                                        id="subject"
                                                                        rows="3"
                                                                    ></textarea>
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col lg={12}>
                                                                <div className="text-right">
                                                                    <Button
                                                                        type="submit"
                                                                        color="primary"
                                                                    >
                                                                        Submit
                                                                    </Button>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </Form>
                                                </ModalBody>
                                            </Modal>
                                            <Col sm={3}>
                                                {/* 정보 수정 */}
                                                {/* 더보기 */}

                                                <Dropdown
                                                    isOpen={this.state.singlebtn}
                                                    toggle={() =>
                                                        this.setState({ singlebtn: !this.state.singlebtn })
                                                    }
                                                >
                                                    <DropdownToggle color="primary" caret>
                                                        더보기{" "}
                                                        <i className="mdi mdi-chevron-down"></i>
                                                    </DropdownToggle>
                                                    <DropdownMenu>
                                                        <DropdownItem>서비스 수정</DropdownItem>
                                                        <DropdownItem>인터넷 접근 수정</DropdownItem>
                                                        <DropdownItem>수정(YAML)</DropdownItem>
                                                        <DropdownItem>삭제</DropdownItem>
                                                    </DropdownMenu>
                                                </Dropdown>
                                            </Col>
                                        </Row>
                                        {/* </div> */}
                                        <div className="table-responsive">
                                            {/* project detail info table */}
                                            <ProjectDetail_detail params={params} projectType={projectType} />
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
                                                        active: this.state.activeTab1 === "5"
                                                    })}
                                                    onClick={() => {
                                                        this.toggle1("5");
                                                    }}
                                                >
                                                    리소스 상태
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    style={{ cursor: "pointer" }}
                                                    className={classnames({
                                                        active: this.state.activeTab1 === "6"
                                                    })}
                                                    onClick={() => {
                                                        this.toggle1("6");
                                                    }}
                                                >
                                                    메타 데이터
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    style={{ cursor: "pointer" }}
                                                    className={classnames({
                                                        active: this.state.activeTab1 === "7"
                                                    })}
                                                    onClick={() => {
                                                        this.toggle1("7");
                                                    }}
                                                >
                                                    이벤트
                                                </NavLink>
                                            </NavItem>
                                        </Nav>

                                        <TabContent activeTab={this.state.activeTab1}>
                                            <TabPane tabId="5" className="p-3">
                                                <Row>
                                                    <Col sm="12">
                                                        {/* <ServicePorts params={params} apitoData={apitoData} />
                                                        <ServiceDeploy params={params} apitoData={apitoData} />
                                                        <ServicePodState params={params} apitoData={apitoData} /> */}
                                                    </Col>
                                                </Row>
                                            </TabPane>
                                            <TabPane tabId="6" className="p-3">
                                                <Row>
                                                    <Col sm="12">
                                                        {/* <DeploymentMeta apitoData={apitoData} /> */}
                                                    </Col>
                                                </Row>
                                            </TabPane>
                                            <TabPane tabId="7" className="p-3">
                                                <Row>
                                                    <Col sm="12">
                                                        {/* <CardText> */}
                                                        <div className="table-responsive">
                                                            {/* <Table className=" table-centered mb-0 table-nowrap"> */}
                                                            <Table hover className=" mb-0 table-centered table-nowrap">
                                                                <thead>
                                                                    <tr>
                                                                        <th className="border-top-0" style={{ width: "110px" }} scope="col">이벤트</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <tr>
                                                                        <Alert color="primary" >
                                                                            A simple primary alert—check it out!
                                                                        </Alert>
                                                                        <Alert color="secondary" role="alert">
                                                                            A simple secondary alert—check it out!
                                                                        </Alert>
                                                                        <Alert color="success" role="alert">
                                                                            A simple success alert—check it out!
                                                                        </Alert>
                                                                        <Alert ccolor="danger" role="alert">
                                                                            A simple danger alert—check it out!
                                                                        </Alert>
                                                                        <Alert color="warning" role="alert">
                                                                            A simple warning alert—check it out!
                                                                        </Alert>
                                                                        <Alert color="info" className="mb-0" role="alert">
                                                                            A simple info alert—check it out!
                                                                        </Alert>
                                                                    </tr>
                                                                </tbody>
                                                            </Table>
                                                        </div>
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
    }
}

export default WorkspaceDetail;
