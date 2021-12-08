import React, { Component, useState, useEffect } from 'react';
import { Container, Card, CardBody, Row, Col, Nav, NavItem, NavLink, UncontrolledTooltip, Input, Label, Button } from "reactstrap";
import { Link } from "react-router-dom";
import classnames from 'classnames';
import { MDBDataTable, MDBNavLink } from "mdbreact";
// import "./datatables.scss";
import axios from 'axios';
import { observer } from "mobx-react";
import Breadcrumbs from '../../components/Common/Breadcrumb';
import Search from '../Tables/Search';
import store from "../../store/Monitor/store/Store"

import DeploymentTable from './DeploymentTable';
import WorkspaceFilter from './WorkspaceFilter';
import ProjectFilter from './ProjectFilter';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import MuiAlert from '@material-ui/lab/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Deployment = observer((props) => {
    const { callApiStore } = store;

    const [activeTab, setActiveTab] = React.useState("1");
    const [params, setParams] = React.useState("deployments");

    const [breadcrumbItems, setBreadcrumbItems] = React.useState([
        { title: "워크로드", link: "#" },
        { title: "디플로이먼트", link: "#" },
    ]);

    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = React.useState("");
    const [codeState, setCodeState] = React.useState("error");
    // const handleValueChange =(e) =>{
    //     let nextState = {};
    //     nextState[e.target.name] = e.target.value;
    //     this.setState(nextState);
    // }

    // const toggleTab = (tab)=> {
    //     if (activeTab !== tab) {
    //         setActiveTab(tab)
    //     }
    // }

    useEffect(() => {

        console.log(callApiStore.postCode)
        console.log(callApiStore.postMessage)

        switch (callApiStore.postCode) {
            case 200:
                setOpen(true)
                setMessage(callApiStore.postMessage)
                callApiStore.postCode = 0
                setCodeState("success")
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

    // const onInputChange = (e) => { // 2. input 태그의 값이 변경 될 때마다 this.state.keyword 값이 변경
    //     this.setState({
    //         keyword: e.target.value
    //     });
    // }

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
                    <Breadcrumbs title="디플로이먼트" breadcrumbItems={breadcrumbItems} />
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
                                        <Link to="/workload/deployment/add" onClick={() => { }} className="btn btn-success mb-2"><i className="mdi mdi-plus mr-2"></i> 추가</Link>
                                        <WorkspaceFilter params={params} />
                                        <ProjectFilter params={params} />
                                    </div>

                                    {/* {api.getAPI()} */}
                                    <DeploymentTable />
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
export default Deployment;


// class Deployment extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             breadcrumbItems: [
//                 { title: "워크로드", link: "#" },
//                 { title: "디플로이먼트", link: "#" },
//             ],
//             activeTab: '1',
//             params: 'deployments'
//         }
//         this.toggleTab = this.toggleTab.bind(this);
//         // this.stateRefresh = this.stateRefresh.bind(this);
//         this.handleValueChange = this.handleValueChange.bind(this)
//         // this.loadApilist = this.loadApilist.bind(this);
//     }

//     handleValueChange(e) {
//         let nextState = {};
//         nextState[e.target.name] = e.target.value;
//         this.setState(nextState);
//     }
//     toggleTab(tab) {
//         if (this.state.activeTab !== tab) {
//             this.setState({
//                 activeTab: tab
//             });
//         }
//     }
//     componentDidMount() {
//         this.setState({
//             params: 'deployments'
//         });
//     }

//     onInputChange = (e) => { // 2. input 태그의 값이 변경 될 때마다 this.state.keyword 값이 변경
//         this.setState({
//             keyword: e.target.value
//         });
//     }
//     render() {
//         const params = this.state.params;
//         return (
//             <React.Fragment>
//                 <div className="page-content">
//                     <Container fluid>
//                         {/* <Table rows={rows} columns={columns} />; */}
//                         <Breadcrumbs title="디플로이먼트" breadcrumbItems={this.state.breadcrumbItems} />
//                         <Row>
//                             <Col lg={12}>
//                                 <Card>
//                                     <CardBody className="pt-0">
//                                         <Nav tabs className="nav-tabs-custom mb-4">

//                                         </Nav>
//                                         <div>
//                                             <Link to="/workload/deployment/add" onClick={() => this.setState({ modal_static: true, isAlertOpen: false })} className="btn btn-success mb-2"><i className="mdi mdi-plus mr-2"></i> 추가</Link>
//                                             <WorkspaceFilter params={params} />
//                                             <ProjectFilter params={params} />
//                                         </div>
//                                         {/* {api.getAPI()} */}
//                                         <DeploymentTable />
//                                         {/* <MDBDataTable searching={true} sortRows={['name']}  responsive data={data} className="mt-4" /> */}
//                                     </CardBody>
//                                 </Card>
//                             </Col>
//                         </Row>


//                     </Container>
//                 </div>
//             </React.Fragment>


//         )

//     }
// }

// export default Deployment;
