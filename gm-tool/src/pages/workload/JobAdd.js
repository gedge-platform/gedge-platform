import React, { Component, useEffect, useState } from "react";
import { Alert, Container, Card, CardBody, Row, NavItem, NavLink, TabPane, TabContent, Col, Form, FormGroup, Progress, Label, Input, InputGroup, Button, InputGroupAddon, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Dropdown, Selection } from 'react-dropdown-now';
import { Link } from "react-router-dom";
import classnames from 'classnames';
import store from "../../store/Monitor/store/Store"
import { observer } from "mobx-react";
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

const JobAdd = observer((props) => {


    const { callApiStore } = store;
    const [workspaceName, setWorkspaceName] = React.useState("")
    // const [duplicate, setduplicate] = React.useState()
    const [alias, setAlias] = React.useState("")
    const [description, setDescription] = React.useState("")
    const [clusterSelect, setClusterSelect] = React.useState("")
    const [administrator, setAdministrator] = React.useState("")
    const [breadcrumbItems, setBreadcrumbItems] = React.useState([
        { title: "서비스", link: "#" },
        { title: "서비스 추가", link: "#" },
    ]);

    const [activeTabProgress, setActiveTabProgress] = React.useState(1)
    const [progressValue, setProgressValue] = React.useState(33)

    const [loading, setLoading] = React.useState(false)

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

        setLoading(false)
        return () => {

        };
    }, [props.history]);

    const buttonClick = () => {

        const body =
        {
            workspaceName: "1234",
            workspaceDescription: "innogrid",
            selectCluster: "cluster1",
            workspaceOwner: "innogrid",
            workspaceCreator: "innogrid"
        }
        // callApiStore.postWorkspaceList("workspaces", body)
        setLoading(true)
        // callApiStore.posteCode = 200
        setTimeout(function () {
            props.history.push("/workload/job")
        }, 500);
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>

                    <Breadcrumbs title="Service 추가" breadcrumbItems={breadcrumbItems} />

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

                                                                    <Input type="text" className="form-control" id="basicpill-namecard-input24" name="workspaceName" value={workspaceName} onChange={(e) => (setWorkspaceName(e.target.value))} />
                                                                </FormGroup>

                                                                {callApiStore.duplicateCheck > 0 ? <Alert color="danger">중복입니다</Alert> : <></>}
                                                                <Link to="#" className="btn btn-success" onClick={duplicateCheck}> 중복체크</Link>

                                                            </Col>

                                                            <Col lg="6">
                                                                <FormGroup>
                                                                    <Label for="basicpill-namecard-input24">Alias</Label>
                                                                    <Input type="text" className="form-control" id="basicpill-namecard-input24" name="alias" onChange={(e) => setAlias(e.target.value)} />
                                                                </FormGroup>
                                                            </Col>


                                                        </Row>
                                                        <Row>
                                                            <Col lg="12">
                                                                <FormGroup>
                                                                    <Label for="basicpill-pancard-input18">Administrator</Label>
                                                                    <select className="custom-select" name="administrator" onChange={(e) => setAdministrator(e.target.value)}>
                                                                        <option defaultValue>Select Administrator</option>
                                                                        <option value="user">user</option>
                                                                        <option value="admin">admin</option>
                                                                        <option value="multi_test">multi_test</option>
                                                                    </select>
                                                                </FormGroup>
                                                            </Col>
                                                            <Col lg="12">
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

                                                    </Form>
                                                </div>
                                            </TabPane>

                                            <TabPane tabId={2}>
                                                <div>
                                                    <Form>
                                                        <Row>
                                                            <Col lg="12">
                                                                <FormGroup>
                                                                    <Label for="basicpill-pancard-input18">Clusters</Label>
                                                                    <select className="custom-select" name="clusterSelect" onChange={(e) => setClusterSelect(e.target.value)}>
                                                                        <option defaultValue>Select Cluster</option>
                                                                        <option value="cluster1">cluster1</option>
                                                                        <option value="cluster2">cluster2</option>
                                                                        <option value="cluster3">cluster3</option>
                                                                    </select>
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
                                                                <p className="text-muted">Cluster Name :{workspaceName}</p>
                                                            </div>
                                                        </div>

                                                    </Col>
                                                </div>
                                                <div className="mt-4 text-right" onClick={buttonClick}>
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
                                            <li className={activeTabProgress === 1 ? "previous disabled" : "previous"} onClick={() => { toggleTabProgress(activeTabProgress - 1); }}> 이전</li>
                                            <li className={activeTabProgress === 3 ? "next disabled" : "next"} onClick={() => { toggleTabProgress(activeTabProgress + 1); }}>다음</li>
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

export default JobAdd;
