import React, { Component } from "react";
import { TabContent, TabPane, NavLink, NavItem, CardText, Nav, Card, Row, Col, CardBody, Container, Table, Dropdown, DropdownMenu, DropdownItem, DropdownToggle, Modal, ModalHeader, ModalBody, } from "reactstrap";
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
import { Axioscall } from "../../components/Common/api";
import * as api from "../../components/Common/api";
import Service from "./Service";
import PodDetailResorce from "./PodDetailResorce";
import PoddetailMeta from "./PodDetailMeta";
import AceEditor from "react-ace";
import PodDetailEvent from "./PodDetailEvent";
import PodStatus from "./PodStatus";
import PodDetail_detail from "./PodDetail_detail";
import PodDetailMonit from "./PodDetailMonit"
import qs from 'qs';
import Project from "./Project";
import { Search } from "react-bootstrap-table2-toolkit";
import queryString from "query-string";

import DeploymentAdd from "./DeploymentAdd"

class PodDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            breadcrumbItems: [
                { title: "워크로드 ", link: "#" },
                { title: "파드", link: "#" },
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
            apilistinfo: [],
            eventlist: []
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
        console.log(this.props.location.search)
        console.log(this.props.location.pathname)
        console.log(this.props.locatin);
        const url = "/pods/" + this.props.match.params.name + this.props.location.search
        const { params } = this.props.match;
        console.log(this.props)
        let link = url
        console.log(link)
        // /workload/pod / prometheus - kube - prometheus - operator - 86bf746fcd - njr6g ? cluster = cluster2 & project=default& workspace=all
        // const query = queryString.parse(location.search);
        // console.log(query)
        // console.log(link, "link");
        let test = api.Axioscall(link, "GET");
        // console.log(api.getDetailAPI(link, "GET"), "laodAPIlist");
        return test;
    }
    componentDidMount() {

        this.loadApilist().then((res) => {
            console.log(res);
            this.setState({
                apilistinfo: res.data,
                involveData: res.involvesData
            });
        });
    }

    render() {
        const apilistinfo = this.state.apilistinfo;
        const involveData = this.state.involveData;

        const { params } = this.props.match;


        let labels = []
        let apitoData = [];
        let annotations = [];
        let restartCount = [];

        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>
                        <Breadcrumbs title="POD Detail" breadcrumbItems={this.state.breadcrumbItems} />
                        <Row>
                            <Col lg={4}>
                                <Card className="checkout-order-summary">
                                    <CardBody>
                                        <h5 className="text-dark font-weight-bold">
                                            {params.name}
                                        </h5>
                                        <Card></Card>
                                        <Row>
                                            <div>
                                                <Link onClick={() => this.setState({ isModal: !this.state.modal })} to="#" className="popup-form btn btn-primary" >VIEW YAML</Link>
                                            </div>
                                            <Modal size="xl" isOpen={this.state.isModal} centered={true} toggle={() => this.setState({ isModal: !this.state.isModal })}>
                                                <ModalHeader toggle={() => this.setState({ isModal: !this.state.isModal })} > YAML </ModalHeader>
                                                <ModalBody>
                                                    <TabPane tabId="8" className="p-3">
                                                        <Row>
                                                            <Col sm="12">
                                                                <CardText>
                                                                    <AceEditor
                                                                        placeholder="Placeholder Text"
                                                                        mode="javascript"
                                                                        theme="xcode"
                                                                        name="blah2"
                                                                        onLoad={this.onLoad}
                                                                        onChange={this.onChange}
                                                                        fontSize={14}
                                                                        showPrintMargin={true}
                                                                        showGutter={true}
                                                                        highlightActiveLine={true}
                                                                        value={`function onLoad(editor) {
                                                                             console.log("seohwa yeonguwonnim babo melong~~~~~~~");
                                                                                         }`}
                                                                        setOptions={{
                                                                            enableBasicAutocompletion: false,
                                                                            enableLiveAutocompletion: false,
                                                                            enableSnippets: false,
                                                                            showLineNumbers: true,
                                                                            tabSize: 2,
                                                                        }} />
                                                                </CardText>
                                                            </Col>
                                                        </Row>
                                                    </TabPane>
                                                </ModalBody>
                                            </Modal>
                                            <Col sm={3}>

                                                {/* 더보기 */}

                                                <Dropdown isOpen={this.state.singlebtn} toggle={() =>
                                                    this.setState({ singlebtn: !this.state.singlebtn })
                                                } >
                                                    <DropdownToggle color="primary" caret>
                                                        더보기 <i className="mdi mdi-chevron-down"></i>
                                                    </DropdownToggle>
                                                    <DropdownMenu>
                                                        <DropdownItem>삭제</DropdownItem>
                                                    </DropdownMenu>
                                                </Dropdown>
                                            </Col>

                                            {/* <h4 className="card-title">Popup with form</h4> */}
                                        </Row>
                                        {/* </div> */}
                                        <div className="table-responsive">
                                            <PodDetail_detail apilistinfo={apilistinfo} />

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
                                                        active: this.state.activeTab1 === "5",
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
                                                    상태
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    style={{ cursor: "pointer" }}
                                                    className={classnames({
                                                        active: this.state.activeTab1 === "8",
                                                    })}
                                                    onClick={() => {
                                                        this.toggle1("8");
                                                    }}
                                                >
                                                    모니터링
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    style={{ cursor: "pointer" }}
                                                    className={classnames({
                                                        active: this.state.activeTab1 === "9",
                                                    })}
                                                    onClick={() => {
                                                        this.toggle1("9");
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
                                                        <div className="table-responsive">
                                                            {/* <PodDetailResorce apilistinfo={apilistinfo} /> */}
                                                            {Object.keys(apilistinfo).length !== 0 ? <PodDetailResorce apilistinfo={apilistinfo} /> : <></>}
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </TabPane>
                                            <TabPane tabId="6" className="p-3">
                                                <Row>
                                                    <Col sm="12">
                                                        {/* <PoddetailMeta apilistinfo={apilistinfo} /> */}
                                                        {Object.keys(apilistinfo).length !== 0 ? <PoddetailMeta apilistinfo={apilistinfo} /> : <></>}
                                                    </Col>
                                                </Row>
                                            </TabPane>
                                            <TabPane tabId="7" className="p-3">
                                                <Row>
                                                    <Col sm="12">
                                                        {/* <PodStatus apilistinfo={apilistinfo} /> */}
                                                        {Object.keys(apilistinfo).length !== 0 ? <PodStatus apilistinfo={apilistinfo} /> : <></>}
                                                    </Col>
                                                </Row>
                                            </TabPane>
                                            <TabPane tabId="8" className="p-3">
                                                <Row>
                                                    <Col sm="12">
                                                        {Object.keys(apilistinfo).length !== 0 ? <PodDetailMonit apilistinfo={apilistinfo} /> : <></>}
                                                        {/* <PodDetailMonit apilistinfo={apilistinfo} /> */}
                                                    </Col>
                                                </Row>
                                            </TabPane>
                                            <TabPane tabId="9" className="p-3">
                                                <Row>
                                                    <Col sm="12">
                                                        <div className="table-responsive">
                                                            {/* <PodDetailEvent apilistinfo={apilistinfo} /> */}
                                                            {Object.keys(apilistinfo).length !== 0 ? <PodDetailEvent apilistinfo={apilistinfo} /> : <></>}
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

export default PodDetail;
