import React, { Component, useState, useEffect } from 'react';
import { Container, Card, CardBody, Row, Col, Nav, NavItem, NavLink, UncontrolledTooltip, Input, Label, Button } from "reactstrap";
import { Link } from "react-router-dom";
import classnames from 'classnames';
import { MDBDataTable, MDBNavLink } from "mdbreact";
import store from "../../store/Monitor/store/Store"
// import "./datatables.scss";
import axios from 'axios';
import { observer } from "mobx-react";
import Breadcrumbs from '../../components/Common/Breadcrumb';
import Search from '../Tables/Search';

import { getAPI } from '../../components/Common/api';
import * as api from '../../components/Common/api'
import Moment from 'react-moment';
import WorkspaceTable from './WorkspaceTable';
import { call } from '@redux-saga/core/effects';
import callApiStore from '../../store/Monitor/store/CallApiStore';

import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import MuiAlert from '@material-ui/lab/Alert';
import queryString from "query-string";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Workspace = observer((props) => {
    const { callApiStore } = store;

    const [breadcrumbItems, setBreadcrumbItems] = React.useState([
        { title: "워크스페이스", link: "#" },
    ]);
    const [button, setButton] = React.useState([
        { modal_static: true, isAlertOpen: false },
    ]);

    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = React.useState("");
    const [codeState, setCodeState] = React.useState("error");

    useEffect(() => {
        // console.log(callApiStore.postCode)
        setMessage(callApiStore.postMessage)

        switch (callApiStore.postCode) {
            case 200:
                setOpen(true)
                setMessage(callApiStore.postMessage)
                callApiStore.postCode = 0
                setCodeState("success")
                break;
            case 417:
                setOpen(true)
                setMessage(callApiStore.postMessage)
                callApiStore.postCode = 0
                setCodeState("error")
                break;
            case 404:
                setOpen(true)
                setMessage(callApiStore.postMessage)
                callApiStore.postCode = 0
                setCodeState("error")
                break;
            default:
                break;
        }


        return () => {
        }
    }, [])

    // const [isShowingAlert, setShowingAlert] = React.useState(false);
    // if (callApiStore.postWorkspaceMessage == "can't create workspace") {
    //     console.log("err!")
    //     setShowingAlert(true)
    // }
    // const check_err = () => {

    // }

    // handleValueChange(e) {
    //     let nextState = {};
    //     nextState[e.target.name] = e.target.value;
    //     this.setState(nextState);
    // }
    // toggleTab(tab) {
    //     if (this.state.activeTab !== tab) {
    //         this.setState({
    //             activeTab: tab
    //         });
    //     }
    // }
    // const [activeTab, setActiveTab] = React.useState("1")
    // const toggleTab = (tab) => {
    //     if (activeTab !== tab) {
    //         setActiveTab(tab)
    //     }
    // }
    // onInputChange = (e) => { // 2. input 태그의 값이 변경 될 때마다 this.state.keyword 값이 변경
    //     this.setState({
    //         keyword: e.target.value
    //     });
    // }


    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const action = (
        <React.Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    {/* <Table rows={rows} columns={columns} />; */}
                    <Breadcrumbs title="워크스페이스" breadcrumbItems={breadcrumbItems} />

                    <Snackbar open={open}
                        autoHideDuration={3000}
                        message={message}
                        action={action}
                        onClose={handleClose}
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                        <Alert onClose={handleClose} severity={codeState} sx={{ width: '100%' }}>
                            {message}
                        </Alert>
                    </Snackbar>
                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardBody className="pt-0">
                                    <Nav tabs className="nav-tabs-custom mb-4">

                                    </Nav>
                                    <div>
                                        <Link to="/workspace/add" onClick={() => { }} className="btn btn-success mb-2"><i className="mdi mdi-plus mr-2"></i> 추가</Link>
                                    </div>
                                    {/* <div
                                        className={`alert alert-success ${isShowingAlert ? 'alert-shown' : 'alert-hidden'}`}
                                        onTransitionEnd={() => setShowingAlert(false)} >
                                        <strong>Success!</strong> Thank you for subscribing!
                                    </div> */}

                                    {/* {api.getAPI()} */}
                                    <WorkspaceTable />
                                    {/* <MDBDataTable searching={true} sortRows={['name']}  responsive data={data} className="mt-4" /> */}
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>


                </Container>
            </div>
        </React.Fragment>


    )


})
export default Workspace;
