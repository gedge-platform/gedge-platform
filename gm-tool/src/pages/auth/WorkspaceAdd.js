import React, { Component, useEffect, useState } from "react";
import { Alert, Container, Card, CardBody, Row, NavItem, NavLink, TabPane, TabContent, Col, Form, FormGroup, Progress, Label, Input, InputGroup, Button, InputGroupAddon, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Dropdown, Selection } from 'react-dropdown-now';
import { Link } from "react-router-dom";
import classnames from 'classnames';
import store from "../../store/Monitor/store/Store"
import { observer } from "mobx-react";
import ClusterSelectTable from './ClusterSelectTable'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'

//select

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';
import AppTable from '../workload/Apptable';
import { times } from "chartist";
import SelectInput from "@material-ui/core/Select/SelectInput";

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import queryString from "query-string";

const WorkspaceAdd = observer((props) => {


    const { callApiStore } = store;
    const [workspaceName, setWorkspaceName] = React.useState("")
    // const [duplicate, setduplicate] = React.useState()
    const [alias, setAlias] = React.useState("")
    const [description, setDescription] = React.useState("")
    const [clusterSelect, setClusterSelect] = React.useState("")
    const [administrator, setAdministrator] = React.useState("")
    const [breadcrumbItems, setBreadcrumbItems] = React.useState([
        { title: "워크스페이스", link: "#" },
        { title: "워크스페이스 추가", link: "#" },
    ]);
    const [activeTab, setActiveTab] = React.useState(1)
    const [activeTabProgress, setActiveTabProgress] = React.useState(1)
    const [progressValue, setProgressValue] = React.useState(33)
    const [col1, setCol1] = React.useState(true)
    const [col2, setCol2] = React.useState(false)
    const [col3, setCol3] = React.useState(false)

    const [loading, setLoading] = React.useState(false)

    const t_col1 = () => {
        setCol1(!col1)
        setCol2(false)
        setCol3(false)
    }

    const t_col2 = () => {
        setCol1(false)
        setCol2(!col2)
        setCol3(false)
    }

    const t_col3 = () => {
        setCol1(false)
        setCol2(false)
        setCol3(!col3)
    }

    const toggleTab = (tab) => {
        if (activeTab !== tab) {
            if (tab >= 1 && tab <= 3) {
                setActiveTab(tab)
            }
        }
    }

    const toggleTabProgress = (tab) => {
        if (activeTabProgress !== tab) {
            if (tab >= 1 && tab <= 3) {
                setActiveTabProgress(tab)
                if (tab === 1) { setProgressValue(30) }
                if (tab === 2) { setProgressValue(60) }
                if (tab === 3) { setProgressValue(100) }
            }
        }
    }
    const inputChange = (value) => {
        if (value === "workspaceName") {
            setWorkspaceName(value)
        }
        if (value === "alias") {
            setAlias(value)
        }
        if (value === "administrator") {
            setAdministrator(value)
        }
        if (value === "description") {
            setDescription(value)
        }
        if (value === "clusterSelect") {
            setClusterSelect(value)
        }
    }
    const duplicateCheck = () => {
        console.log(`workspace name : ${workspaceName}`)

        callApiStore.workspaceDuplicationCheck(workspaceName)
        console.log(callApiStore.duplicateCheck, "callApiStore.duplicateCheck")
        // console.log(duplicate,"duplicate")
        // setduplicate(callApiStore.duplicateCheck)
        // if(callApiStore.duplicateCheck == 0){
        //     setduplicate(false)     
        // }else if(callApiStore.duplicateCheck > 0){
        //     setduplicate(true)
        // }
        // console.log(duplicate,"change duplicate")
    }

    useEffect(() => {
        // const unblock = props.history.block('정말 떠나실건가요?');
        setLoading(false)
        callApiStore.getMemberList("members")
        callApiStore.getClusterList("clusters")
        return () => {
            // unblock();
        };
    }, [props.history]);

    const buttonClick = () => {
        // console.log(`workspace name : ${workspaceName}\nAlias : ${alias} \nAdministrator: ${administrator}\nDescription: $description} \nclusterSelect: ${clusterSelect}`);
        setClusterSelect(callApiStore.clusterCheck)
        const body =
        {
            workspaceName: workspaceName,
            workspaceDescription: description,
            selectCluster: callApiStore.clusterCheck,
            workspaceOwner: administrator,
            workspaceCreator: "innogrid"
        }
        if (workspaceName != "" && callApiStore.clusterCheck != "" && administrator != "") {
            console.log(body, "body")
            callApiStore.postWorkspaceList("workspaces", body)
            setLoading(true)
            // callApiStore.posteCode = 200
            setTimeout(function () {
                props.history.push("/workspace")
            }, 500);
        }
    }
    let CoreList = [];
    let EdgeList = [];
    if (callApiStore.coreCloudList == undefined) {
        CoreList = []
    } else {
        CoreList = callApiStore.coreCloudList
    }
    if (callApiStore.cloudEdgeList == undefined) {
        EdgeList = []
    } else {
        EdgeList = callApiStore.cloudEdgeList
    }
    // const appKeyPress = (e) => {
    //     if (e.key === 'Enter') {
    //         buttonClick();
    //     }
    // }

    const options = [
        { value: "TO", label: "Touchscreen" },
        { value: "CF", label: "Call Function" },
        { value: "NO", label: "Notifications" },
        { value: "FI", label: "Fitness" },
        { value: "OU", label: "Outdoor" },
    ]
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>

                    <Breadcrumbs title="Workspace 추가" breadcrumbItems={breadcrumbItems} />

                    <Row>
                        <Col lg="12">
                            <Card>
                                <CardBody>

                                    <div id="progrss-wizard" className="twitter-bs-wizard">
                                        <ul className="twitter-bs-wizard-nav nav-justified nav nav-pills">
                                            <NavItem>
                                                <NavLink className={classnames({ active: activeTabProgress === 1 })} onClick={() => { toggleTabProgress(1) }} >
                                                    <span className="step-number">01</span>
                                                    <span className="step-title">기본 정보</span>
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink className={classnames({ active: activeTabProgress === 2 })} onClick={() => { toggleTabProgress(2) }} >
                                                    <span className="step-number">02</span>
                                                    <span className="step-title">Select Cluster</span>
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink className={classnames({ active: activeTabProgress === 3 })} onClick={() => { toggleTabProgress(3) }} >
                                                    <span className="step-number">03</span>
                                                    <span className="step-title">Workspace 생성</span>
                                                </NavLink>
                                            </NavItem>

                                        </ul>

                                        <div id="bar" className="mt-4">
                                            <Progress color="success" striped animated value={progressValue} />

                                        </div>
                                        <TabContent activeTab={activeTabProgress} className="twitter-bs-wizard-tab-content">
                                            <TabPane tabId={1}>
                                                <div>
                                                    <Form>
                                                        <Row>
                                                            <Col lg="6">

                                                                <FormGroup>
                                                                    <Label for="basicpill-namecard-input24">Workspace Name</Label>
                                                                    {/* {this.props.loginError && this.props.loginError ? <Alert color="danger">{this.props.loginError}</Alert> : null} */}

                                                                    <Input type="text" className="form-control" id="basicpill-namecard-input24" name="workspaceName" value={workspaceName} required={true} onChange={(e) => (setWorkspaceName(e.target.value))} />
                                                                </FormGroup>
                                                                <div className="div-alert">
                                                                    <Link to="#" className="btn btn-success" onClick={duplicateCheck}> 중복체크</Link>
                                                                    {callApiStore.duplicateCheck > 0 ? <Alert color="danger">중복입니다</Alert> : <></>}
                                                                    {/* {callApiStore.duplicateCheck = 0 ? <Alert color="success">사용할 수 있는 워크스페이스</Alert> : <></>} */}
                                                                    {/* {callApiStore.duplicateCheck < 0 ? <Alert color="warning">중복 체크 미완료</Alert> : <></>} */}
                                                                </div>

                                                            </Col>
                                                            <Col lg="6">
                                                                <Label>Workspace Description</Label>

                                                                <Input
                                                                    type="textarea"
                                                                    id="textarea"
                                                                    name="description"
                                                                    onChange={(e) => setDescription(e.target.value)}
                                                                    maxLength="225"
                                                                    rows="3"
                                                                    placeholder="This description has a limit of 225 chars."
                                                                />
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col lg="6">
                                                                <FormGroup>
                                                                    <Label for="basicpill-pancard-input18">Administrator</Label>
                                                                    <Dropdown
                                                                        placeholder="Select Administrator "
                                                                        className="selectWorkspace"
                                                                        options={callApiStore.memberNameList}
                                                                        value=""
                                                                        onChange={(value) => { setAdministrator(value.value) }
                                                                        }
                                                                    />
                                                                </FormGroup>
                                                            </Col>

                                                        </Row>

                                                    </Form>
                                                </div>
                                            </TabPane>

                                            <TabPane tabId={2}>
                                                <div>
                                                    <Form>
                                                        <Row>
                                                            <Col lg="12">
                                                                <FormGroup>
                                                                    {Object.keys(CoreList).length !== 0 && Object.keys(EdgeList).length ? <ClusterSelectTable CoreList={CoreList} EdgeList={EdgeList} /> : <></>}
                                                                    {/* <ClusterSelectTable CoreList={CoreList} EdgeList={EdgeList}/> */}
                                                                    {/* <select className="custom-select" name="clusterSelect" onChange={(e) => inputChange(e.target.value)}>
                                                                        <option defaultValue>Select Cluster</option>
                                                                        <option value="cluster1">cluster1</option>
                                                                        <option value="cluster2">cluster2</option>
                                                                        <option value="cluster3">cluster3</option>
                                                                    </select> */}
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>

                                                    </Form>

                                                </div>
                                            </TabPane>

                                            <TabPane tabId={3}>
                                                <div className="row justify-content-center">
                                                    <Col lg="6">
                                                        <div className="text-center">
                                                            <div className="mb-4">
                                                                <i className="mdi mdi-check-circle-outline text-success display-4"></i>
                                                            </div>
                                                            <div>
                                                                <h5>Confirm Detail</h5>
                                                                <p className="text-muted">Name : {workspaceName}</p>
                                                                <p className="text-muted">Description : {description}</p>
                                                                <p className="text-muted">Administrator : {administrator}</p>
                                                                <p className="text-muted">Select Cluster : {callApiStore.clusterCheck}</p>
                                                            </div>
                                                        </div>

                                                    </Col>
                                                </div>
                                                <div className="btn btn-success" onClick={buttonClick}>
                                                    <Backdrop
                                                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                                                        open={loading}
                                                    >
                                                        <CircularProgress color="inherit" />
                                                    </Backdrop>
                                                    {/* <Link to="/workspace" className="btn btn-success" onClick={buttonClick}>
                                                        완료
                                                    </Link> */}
                                                    완료
                                                </div>
                                            </TabPane>
                                        </TabContent>
                                        <ul className="pager wizard twitter-bs-wizard-pager-link">
                                            <li className={activeTabProgress === 1 ? "next-btn previous disabled" : "next-btn previous"} onClick={() => { toggleTabProgress(activeTabProgress - 1); }}> 이전</li>
                                            <li className={activeTabProgress === 3 ? "next-btn next disabled" : "next-btn next"} onClick={() => { toggleTabProgress(activeTabProgress + 1); }}>다음</li>
                                        </ul>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                </Container>
            </div>
        </React.Fragment>
    );

})

export default WorkspaceAdd;


// class WorkspaceAdd extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             workspaceName: '',
//             alias: '',
//             description: '',
//             breadcrumbItems: [
//                 { title: "Workspace", link: "#" },
//                 { title: "Workspace 추가", link: "#" },
//             ],
//             activeTab: 1,
//             activeTabProgress: 1,
//             progressValue: 33,
//             col1: true,
//             col2: false,
//             col3: false,
//         };
//         this.toggleTab.bind(this);
//         this.toggleTabProgress.bind(this);
//         this.t_col1 = this.t_col1.bind(this);
//         this.t_col2 = this.t_col2.bind(this);
//         this.t_col3 = this.t_col3.bind(this);

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

//     toggleTab(tab) {
//         if (this.state.activeTab !== tab) {
//             if (tab >= 1 && tab <= 3) {
//                 this.setState({
//                     activeTab: tab
//                 });
//             }
//         }
//     }

//     toggleTabProgress(tab) {
//         if (this.state.activeTabProgress !== tab) {
//             if (tab >= 1 && tab <= 3) {
//                 this.setState({
//                     activeTabProgress: tab
//                 });

//                 if (tab === 1) { this.setState({ progressValue: 33 }) }
//                 if (tab === 2) { this.setState({ progressValue: 66 }) }
//                 if (tab === 3) { this.setState({ progressValue: 100 }) }
//             }

//         }
//     }
//     inputChange = (e) => {
//         this.setState({
//             [e.target.name]: e.target.value
//         });
//     }
//     buttonClick = () => {
//         console.log(`workspace name : ${this.state.workspaceName}\nAlias : ${this.state.alias} \nAdministrator: ${this.state.administrator}\nDescription: ${this.state.description} \nclusterSelect: ${this.state.clusterSelect}`);
//     }
//     appKeyPress = (e) => {
//         if (e.key === 'Enter') {
//             this.buttonClick();
//         }
//     }

//     render() {
//         const { workspaceName, alias, description, select } = this.state;
//         const { inputChange, buttonClick, appKeyPress } = this;

//         const options = [
//             { value: "TO", label: "Touchscreen" },
//             { value: "CF", label: "Call Function" },
//             { value: "NO", label: "Notifications" },
//             { value: "FI", label: "Fitness" },
//             { value: "OU", label: "Outdoor" },
//         ]
//         return (
//             <React.Fragment>
//                 <div className="page-content">
//                     <Container fluid>

//                         <Breadcrumbs title="Workspace 추가" breadcrumbItems={this.state.breadcrumbItems} />

//                         <Row>
//                             <Col lg="12">
//                                 <Card>
//                                     <CardBody>

//                                         <div id="progrss-wizard" className="twitter-bs-wizard">
//                                             <ul className="twitter-bs-wizard-nav nav-justified nav nav-pills">
//                                                 <NavItem>
//                                                     <NavLink className={classnames({ active: this.state.activeTabProgress === 1 })} onClick={() => { this.toggleTabProgress(1); }} >
//                                                         <span className="step-number">01</span>
//                                                         <span className="step-title">기본 정보</span>
//                                                     </NavLink>
//                                                 </NavItem>
//                                                 <NavItem>
//                                                     <NavLink className={classnames({ active: this.state.activeTabProgress === 2 })} onClick={() => { this.toggleTabProgress(2); }} >
//                                                         <span className="step-number">02</span>
//                                                         <span className="step-title">Select Cluster</span>
//                                                     </NavLink>
//                                                 </NavItem>
//                                                 <NavItem>
//                                                     <NavLink className={classnames({ active: this.state.activeTabProgress === 3 })} onClick={() => { this.toggleTabProgress(3); }} >
//                                                         <span className="step-number">03</span>
//                                                         <span className="step-title">Workspace 생성</span>
//                                                     </NavLink>
//                                                 </NavItem>

//                                             </ul>

//                                             <div id="bar" className="mt-4">
//                                                 <Progress color="success" striped animated value={this.state.progressValue} />
//                                             </div>
//                                             <TabContent activeTab={this.state.activeTabProgress} className="twitter-bs-wizard-tab-content">
//                                                 <TabPane tabId={1}>
//                                                     <div>
//                                                         <Form>
//                                                             <Row>
//                                                                 <Col lg="6">
//                                                                     <FormGroup>
//                                                                         <Label for="basicpill-namecard-input24">Workspace Name</Label>
//                                                                         <Input type="text" className="form-control" id="basicpill-namecard-input24" name="workspaceName" onChange={inputChange} />
//                                                                     </FormGroup>
//                                                                 </Col>

//                                                                 <Col lg="6">
//                                                                     <FormGroup>
//                                                                         <Label for="basicpill-namecard-input24">Alias</Label>
//                                                                         <Input type="text" className="form-control" id="basicpill-namecard-input24" name="alias" onChange={inputChange} />
//                                                                     </FormGroup>
//                                                                 </Col>


//                                                             </Row>
//                                                             <Row>
//                                                                 <Col lg="12">
//                                                                     <FormGroup>
//                                                                         <Label for="basicpill-pancard-input18">Administrator</Label>
//                                                                         <select className="custom-select" name="administrator" onChange={inputChange}>
//                                                                             <option defaultValue>Select Administrator</option>
//                                                                             <option value="user">user</option>
//                                                                             <option value="admin">admin</option>
//                                                                             <option value="multi_test">multi_test</option>
//                                                                         </select>
//                                                                     </FormGroup>
//                                                                 </Col>
//                                                                 <Col lg="12">
//                                                                     <Label>Workspace Description</Label>

//                                                                     <Input
//                                                                         type="textarea"
//                                                                         id="textarea"
//                                                                         name="description"
//                                                                         onChange={this.inputChange}
//                                                                         maxLength="225"
//                                                                         rows="3"
//                                                                         placeholder="This description has a limit of 225 chars."
//                                                                     />
//                                                                 </Col>
//                                                             </Row>

//                                                         </Form>
//                                                     </div>
//                                                 </TabPane>

//                                                 <TabPane tabId={2}>
//                                                     <div>
//                                                         <Form>
//                                                             <Row>
//                                                                 <Col lg="12">
//                                                                     <FormGroup>
//                                                                         <Label for="basicpill-pancard-input18">Clusters</Label>
//                                                                         <select className="custom-select" name="clusterSelect" onChange={inputChange}>
//                                                                             <option defaultValue>Select Cluster</option>
//                                                                             <option value="cluster1">cluster1</option>
//                                                                             <option value="cluster2">cluster2</option>
//                                                                             <option value="cluster3">cluster3</option>
//                                                                         </select>
//                                                                     </FormGroup>
//                                                                 </Col>
//                                                             </Row>

//                                                         </Form>
//                                                     </div>
//                                                 </TabPane>

//                                                 <TabPane tabId={3}>
//                                                     <div className="row justify-content-center">
//                                                         <Col lg="6">
//                                                             <div className="text-center">
//                                                                 <div className="mb-4">
//                                                                     <i className="mdi mdi-check-circle-outline text-success display-4"></i>
//                                                                 </div>
//                                                                 <div>
//                                                                     <h5>Confirm Detail</h5>
//                                                                     <p className="text-muted">Cluster Name :{this.state.workspaceName}</p>
//                                                                 </div>

//                                                             </div>

//                                                         </Col>
//                                                     </div>
//                                                     <div className="mt-4 text-right">
//                                                         <Link to="/workspace" className="btn btn-success" onClick={buttonClick}>
//                                                             완료
//                                                         </Link>
//                                                     </div>
//                                                 </TabPane>
//                                             </TabContent>
//                                             <ul className="pager wizard twitter-bs-wizard-pager-link">
//                                                 <li className={this.state.activeTabProgress === 1 ? "previous disabled" : "previous"}><Link to="#" onClick={() => { this.toggleTabProgress(this.state.activeTabProgress - 1); }}>이전</Link></li>
//                                                 <li className={this.state.activeTabProgress === 3 ? "next disabled" : "next"}><Link to="#" onClick={() => { this.toggleTabProgress(this.state.activeTabProgress + 1); }}>다음</Link></li>
//                                             </ul>
//                                         </div>
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
// export default WorkspaceAdd;