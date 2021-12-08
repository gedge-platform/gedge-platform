import React, { Component } from "react";
import { TabContent, TabPane, Collapse, NavLink, NavItem, CardText, Nav, Card, Row, Col, CardBody, CardHeader, Container, Media, Table, Dropdown, DropdownMenu, DropdownItem, DropdownToggle, ButtonDropdown, Modal, ModalHeader, ModalBody, Form, Input, Label, FormGroup, Button } from "reactstrap";
import { Link } from "react-router-dom";
import AceEditor from "react-ace";
//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-monokai";

import FormXeditable from "../Forms/FormXeditable";
//Import Breadcrumb
import "../workload/detail.css";

import classnames from 'classnames';
import Shops from "../Ecommerce/Shops";
import Detail from "../Ecommerce/Detail";
import LatestTransactions from "../Dashboard/LatestTransactions";
//chartimport "../workload/detail.css";
import RevenueAnalytics from "../Dashboard/RevenueAnalytics"
import Resource from "../Utility/Resource";
import "../workload/detail.css";
// import EarningReports from "../Dashboard/EarningReports"
class Appdetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            breadcrumbItems: [
                { title: "워크로드", link: "#" },
                { title: "앱", link: "#" },
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
            col5: true
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


    render() {
        const { params } = this.props.match;

        // <tr>
        //     <td>클러스터</td>
        //     <td>
        //         cluster1
        //     </td>
        // </tr>

        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>
                        <Breadcrumbs title="App Detail" breadcrumbItems={this.state.breadcrumbItems} />

                        <Row>
                            <Col lg={4}>
                                <Card className="checkout-order-summary">
                                    <CardBody>
                                        {/* <div className="p-3 bg-light mb-4"> */}
                                        <h5 className="text-dark font-weight-bold">{params.name} </h5>
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
                                                        <DropdownItem>접근 수정</DropdownItem>
                                                        <DropdownItem>수정(YAML)</DropdownItem>
                                                        <DropdownItem>삭제</DropdownItem>
                                                    </DropdownMenu>
                                                </Dropdown>
                                            </Col>

                                            {/* <h4 className="card-title">Popup with form</h4> */}




                                        </Row>
                                        {/* </div> */}
                                        <div className="table-responsive">

                                            <Table responsive className="mb-0">
                                                <thead>
                                                    <tr>
                                                        <th style={{ width: "100%" }}>상세정보</th>
                                                        {/* <th>Examples</th> */}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>클러스터</td>
                                                        <td>
                                                            cluster1
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>프로젝트</td>
                                                        <td>
                                                            test
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>상태</td>
                                                        <td>
                                                            Running
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td>앱</td>
                                                        <td>
                                                            redis
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            버전
                                                        </td>
                                                        <td>
                                                            14.6.1
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            생성일
                                                        </td>
                                                        <td>
                                                            @@@@
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td>
                                                            업데이트일
                                                        </td>
                                                        <td>
                                                            @@@@
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            생성자
                                                        </td>
                                                        <td>
                                                            yby654
                                                        </td>
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
                                        {/* <h4 className="card-title">Justify Tabs</h4> */}
                                        {/* <p className="card-title-desc">
                                            Use the tab JavaScript plugin—include it individually or through the compiled{" "} <code className="highlighter-rouge">bootstrap.js</code> file—to extend our navigational tabs and pills to create tabbable panes of local content, even via dropdown menus.
                                        </p> */}

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
                                                        active: this.state.activeTab1 === "8"
                                                    })}
                                                    onClick={() => {
                                                        this.toggle1("8");
                                                    }}
                                                >
                                                    앱 Configurations
                                                </NavLink>
                                            </NavItem>
                                        </Nav>

                                        <TabContent activeTab={this.state.activeTab1}>
                                            <TabPane tabId="5" className="p-3">
                                                <Row>
                                                    <Col sm="12">
                                                        <CardText>
                                                            <div className="table-responsive">
                                                                {/* <Table className=" table-centered mb-0 table-nowrap"> */}
                                                                <Table hover className=" mb-0 table-centered table-nowrap">
                                                                    <thead>
                                                                        <tr>
                                                                            <th className="border-top-0" style={{ width: "110px" }} scope="col">서비스</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        <tr>
                                                                            <div class="div-content-detail">
                                                                                <div class="div-content-detail-0">
                                                                                    <div className="avatar-xs">
                                                                                        <div className="avatar-title rounded-circle bg-light">
                                                                                            img
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div class="div-content-detail-1">
                                                                                    <div>
                                                                                        <div class="div-content-text-1"><a>redis-7qgzmk-headless</a></div>
                                                                                        <div class="div-contetn-text-2"><a>Headless</a></div>
                                                                                    </div>
                                                                                </div>
                                                                                <div class="div-content-detail-2">
                                                                                    <div>
                                                                                        <div class="div-content-text-1">Off</div>
                                                                                        <div class="div-content-text-2">Application Governance</div>
                                                                                    </div>
                                                                                </div>
                                                                                <div class="div-content-detail-2">
                                                                                    <div>
                                                                                        <div class="div-content-text-1">None</div>
                                                                                        <div class="div-content-text-2">ClusterIP</div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </tr>
                                                                    </tbody>
                                                                </Table>
                                                            </div>
                                                            <div className="table-responsive">
                                                                <Table hover className=" mb-0 table-centered table-nowrap">
                                                                    <thead>
                                                                        <tr>
                                                                            <th className="border-top-0" style={{ width: "110px" }} scope="col">디플로이먼트</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        <tr>
                                                                            <div class="div-content-detail">
                                                                                <div class="div-content-detail-0">
                                                                                    <div className="avatar-xs">
                                                                                        <div className="avatar-title rounded-circle bg-light">
                                                                                            img
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div class="div-content-detail-1">
                                                                                    <div>
                                                                                        <div class="div-content-text-1"><a>redis-7qgzmk-master</a></div>
                                                                                        <div class="div-contetn-text-2"><a>Updated at 21 hours ago</a></div>
                                                                                    </div>
                                                                                </div>
                                                                                <div class="div-content-detail-2">
                                                                                    <div>
                                                                                        <div class="div-content-text-1">Running (1/1)</div>
                                                                                        <div class="div-content-text-2">Status</div>
                                                                                    </div>
                                                                                </div>
                                                                                <div class="div-content-detail-2">
                                                                                    <div>
                                                                                        <div class="div-content-text-1">v1.0.0</div>
                                                                                        <div class="div-content-text-2">Version</div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </tr>
                                                                    </tbody>
                                                                </Table>
                                                            </div>
                                                        </CardText>
                                                    </Col>
                                                </Row>
                                            </TabPane>
                                            <TabPane tabId="6" className="p-3">
                                                <Row>
                                                    <Col sm="12">
                                                        <CardText>

                                                        </CardText>
                                                    </Col>
                                                </Row>
                                            </TabPane>
                                            <TabPane tabId="7" className="p-3">
                                                <Row>
                                                    <Col sm="12">
                                                        <CardText>


                                                        </CardText>
                                                    </Col>
                                                </Row>
                                            </TabPane>

                                            <TabPane tabId="8" className="p-3">
                                                <Row>
                                                    <Col sm="12">
                                                        <div className="table-responsive" style>
                                                            <AceEditor
                                                                placeholder="Placeholder Text"
                                                                mode="javascript"
                                                                theme="monokai"
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
                                                                    tabSize: 3,
                                                                }} />
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

export default Appdetail;
