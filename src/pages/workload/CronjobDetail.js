import React, { Component } from "react";
import { TabContent, TabPane, NavLink, NavItem, CardText, Nav, Card, Row, Col, CardBody, Container, Table, Dropdown, DropdownMenu, DropdownItem, DropdownToggle, Modal, ModalHeader, ModalBody, Input, Label, FormGroup, Button, Form } from "reactstrap";
import { Link } from "react-router-dom";
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import img1 from "../../assets/images/companies/img-1.png";
//Import Breadcrumb
import "../workload/detail.css";
import ReactApexChart from "react-apexcharts";
import classnames from "classnames";
import "../Dashboard/dashboard.scss";
import { getDetailAPI } from "../../components/Common/api";
import * as api from "../../components/Common/api";
import Service from "./Service";
// import CronjobDetailMeta from "./CronjobDetailMeta";
import AceEditor from "react-ace";
import CronjobResource from "./CronjobResource";
import JobDetailMeta from "./JobDetailMeta";
import Event from "./PodDetailEvent";
class CronjobDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            breadcrumbItems: [
                { title: "워크로드 ", link: "#" },
                { title: "크론잡", link: "#" },
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
            apiList: [],
            joblist: [],
            eventlist: [],
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
                activeTab: tab,
            });
        }
    }
    toggle1(tab) {
        if (this.state.activeTab1 !== tab) {
            this.setState({
                activeTab1: tab,
            });
        }
    }
    toggle2(tab) {
        if (this.state.activeTab2 !== tab) {
            this.setState({
                activeTab2: tab,
            });
        }
    }
    toggle3(tab) {
        if (this.state.activeTab3 !== tab) {
            this.setState({
                activeTab3: tab,
            });
        }
    }

    toggleCustomJustified(tab) {
        if (this.state.activeTabJustify !== tab) {
            this.setState({
                activeTabJustify: tab,
            });
        }
    }

    toggleCustom(tab) {
        if (this.state.customActiveTab !== tab) {
            this.setState({
                customActiveTab: tab,
            });
        }
    }

    loadApilist() {
        const { params } = this.props.match;

        let link = "namespaces/" + params.namespace + "/cronjobs/" + params.name;
        console.log(link, "link");
        let test = api.getDetailAPI(link, "GET");
        console.log(api.getDetailAPI(link, "GET"), "laodAPIlist");
        return test;
    }
    loadApilist2() {
        const { params } = this.props.match;
        let link = params.namespace + "/cronjobs/" + params.name + "/list";
        // + "/podlist";
        console.log(link, "link123456");
        let joblist = api.getDetailAPIv2(link, "GET");
        console.log(api.getDetailAPIv2(link, "GET"), "joblist");
        return joblist
    }
    loadApilist3() {
        const { params } = this.props.match;
        let link = params.namespace + "/cronjobs/" + params.name + "/events";
        console.log(link, "EVNET LINK");
        let eventlist = api.getDetailAPIv2(link, "GET");
        console.log(api.getDetailAPIv2(link, "GET"), "cronjobs");
        return eventlist
    }

    EvnetList() {
        this.loadApilist3().then((res) => {
            this.setState({
                evnetlist: res.items,
            });

        });
    }

    JobList() {
        let data = [];
        this.loadApilist2().then((res) => {
            console.log(res, "res");
            data.push(res.items);
            console.log(data, "data");
            this.setState({
                joblist: data,
            });
        });
    }
    componentDidMount() {
        let data = [];
        this.loadApilist().then((res) => {
            console.log(res, "res");
            // data = JSON.stringify(res)
            // data = JSON.parse(data);
            data.push(res);
            console.log(data, "data");
            this.setState({
                apiList: data,
            });
        });
        this.JobList();
        this.EvnetList();
    }
    render() {
        // console.log(this.props);
        const apiList = this.state.apiList;
        const { params } = this.props.match;

        console.log(this.state.apiList, "jobdetail");
        let status = "";
        let apitoData = [];
        let dataFromApi = apiList.map((list) => {
            console.log(list, "list");

            if (list.spec.suspend == false) {
                status = "READY"
            } else {
                status = "NOR READY"
            }
            return {
                name: list.metadata.name,
                namespace: list.metadata.namespace,
                uid: list.metadata.uid,
                schedule: list.spec.schedule,
                successfulJobsHistoryLimit: list.spec.successfulJobsHistoryLimit,
                failedJobsHistoryLimit: list.spec.failedJobsHistoryLimit,
                status: status,
                backoffLimit: list.spec.backoffLimit,
                completions: list.spec.completions,
                parallelism: list.spec.parallelism,
                // restartCount: list.status.containerStatuses[0].restartCount,
                qosClass: list.status.qosClass,
                creationTimestamp: list.metadata.creationTimestamp

            };
        });
        apitoData = dataFromApi;

        const joblist = this.state.joblist;
        const eventlist = this.state.eventlist;
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>
                        <Breadcrumbs title="CronJOB Detail" breadcrumbItems={this.state.breadcrumbItems} />
                        <Row>
                            <Col lg={4}>
                                <Card className="checkout-order-summary">
                                    <CardBody>
                                        {/* <div className="p-3 bg-light mb-4"> */}
                                        <h5 className="text-dark font-weight-bold">
                                            {params.name}
                                        </h5>
                                        <Card></Card>
                                        <Row>
                                            {/* 정보 수정 */}
                                            <div>
                                                <Link onClick={() => this.setState({ isModal: !this.state.modal })} to="#" className="popup-form btn btn-primary" >정보 수정</Link>
                                            </div>

                                            <Col sm={3}>
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
                                                        정보수정
                                                    </ModalHeader>
                                                    <ModalBody>
                                                        <Form>
                                                            <Row>
                                                                <Col lg={6}>
                                                                    <FormGroup>
                                                                        <Label htmlFor="name">이름</Label>
                                                                        <Input
                                                                            type="text"
                                                                            className="form-control"
                                                                            id="name"
                                                                            placeholder={params.name}
                                                                            disabled
                                                                            required
                                                                        />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col lg={6}>
                                                                    <FormGroup>
                                                                        <Label htmlFor="email">Alias</Label>
                                                                        <Input
                                                                            type="email"
                                                                            className="form-control"
                                                                            id="email"
                                                                            placeholder="Enter Alias"
                                                                            required
                                                                        />
                                                                    </FormGroup>
                                                                </Col>

                                                            </Row>
                                                            <Row>
                                                                <Col lg={12}>
                                                                    <FormGroup>
                                                                        <Label htmlFor="subject">Description</Label>
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
                                                                            Update
                                                                        </Button>
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </Form>
                                                    </ModalBody>
                                                </Modal>
                                                {/* 더보기 */}

                                                <Dropdown
                                                    isOpen={this.state.singlebtn}
                                                    toggle={() =>
                                                        this.setState({ singlebtn: !this.state.singlebtn })
                                                    }
                                                >
                                                    <DropdownToggle color="primary" caret> 더보기 <i className="mdi mdi-chevron-down"></i>
                                                    </DropdownToggle>
                                                    <DropdownMenu>
                                                        <DropdownItem>Rerun</DropdownItem>
                                                        <DropdownItem href="/view_yaml">View YAML</DropdownItem>
                                                        <DropdownItem>삭제</DropdownItem>
                                                    </DropdownMenu>
                                                </Dropdown>
                                            </Col>

                                            {/* <h4 className="card-title">Popup with form</h4> */}
                                        </Row>
                                        {/* </div> */}
                                        <div className="table-responsive">
                                            <Table responsive className="mb-0">
                                                <div>
                                                    <thead>
                                                        <tr>
                                                            <th style={{ width: "100%" }} className="border-top-0">상세정보</th>
                                                        </tr>
                                                    </thead>
                                                </div>
                                                {apitoData.map((test) => (
                                                    <tbody key={test.name}>
                                                        <tr>
                                                            <td>클러스터</td>
                                                            <td>{test.name}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>프로젝트</td>
                                                            <td>{test.namespace}</td>
                                                        </tr>

                                                        <tr>
                                                            <td>Status</td>
                                                            <td>{test.status}</td>
                                                        </tr>

                                                        <tr>
                                                            <td>schedule</td>
                                                            <td>{test.schedule}</td>
                                                        </tr>

                                                        <tr>
                                                            <td>successfulJobsHistoryLimit</td>
                                                            <td>{test.successfulJobsHistoryLimit}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>failedJobsHistoryLimit</td>
                                                            <td>{test.failedJobsHistoryLimit}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Created</td>
                                                            <td>{test.creationTimestamp}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Creator</td>
                                                            <td></td>
                                                        </tr>

                                                    </tbody>
                                                ))}
                                            </Table>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col lg={8}>
                                <Card>
                                    <CardBody>
                                        {/* <h4 className="card-title">Justify Tabs</h4> */}
                                        {/* <p className="card-title-desc">
                                            Use the tab JavaScript plugin—include it individually or through the compiled{" "} <code className="highlighter-rouge">bootstrap.js</code> file—to extend our navigational tabs and pills to create tabbable panes of local content, even via dropdown menus.
                                        </p> */}

                                        <Nav pills className="navtab-bg nav-justified">
                                            <NavItem>
                                                <NavLink
                                                    style={{ cursor: "pointer" }}
                                                    className={classnames({
                                                        active: this.state.activeTab1 === "5",
                                                    })}
                                                    onClick={() => {
                                                        this.toggle1("5");
                                                    }}
                                                >
                                                    job Records
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    style={{ cursor: "pointer" }}
                                                    className={classnames({
                                                        active: this.state.activeTab1 === "6",
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
                                                        active: this.state.activeTab1 === "7",
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
                                                        <div >
                                                            <CronjobResource joblist={joblist} />
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </TabPane>
                                            <TabPane tabId="6" className="p-3">
                                                <Row>
                                                    <Col sm="12">
                                                        <JobDetailMeta apiList={apiList} />
                                                    </Col>
                                                </Row>
                                            </TabPane>
                                            <TabPane tabId="7" className="p-3">
                                                <Row>
                                                    <Col sm="12">
                                                        <div className="table-responsive">
                                                            <Event eventlist={eventlist} />
                                                        </div>
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

export default CronjobDetail;
