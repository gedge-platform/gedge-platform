// import React, { Component } from 'react';
// import { Container, Card, CardBody, Row, Col, Nav, NavItem, NavLink, UncontrolledTooltip, Input, Label, Button, Dropdown, DropdownMenu, DropdownItem, DropdownToggle, ButtonDropdown, ButtonGroup } from "reactstrap";
// import { Link } from "react-router-dom";
// import classnames from 'classnames';
// import { getAPI } from '../../components/Common/api';
// import * as api from '../../components/Common/api';
// import { MDBDataTable } from "mdbreact";
// import JobData from './JobData';
// // import "./datatables.scss";

// //Import Breadcrumb
// import Breadcrumbs from '../../components/Common/Breadcrumb';


// // console.log(apiList, "test");
// class EvnetTest extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {

//             activeTab: '1',
//             infoList: [],
//         }


//     }

//     componentDidMount() {
//         this.loadApilist().then(res => {
//             // console.log(res);
//             this.setState({
//                 infoList: res
//             })
//         })

//     }
//     loadApilist() {
//         let test = ""
//         test = getAPI('events', 'GET')
//         console.log(api.getAPI('events', 'GET'), "events")
//         return test;
//     }

//     render() {
//         const { apiList } = this.props;
//         console.log(apiList)
//         console.log(this.props.uid)
//         let infoList = [];
//         let job = ''
//         let apitoData = [];
//         let dataFromApi = [];
//         let updateTimes = '';
//         let imageName = '';
//         let status = '';
//         let owner = '';

//         infoList = this.state.infoList;
//         console.log(infoList)
//         dataFromApi = infoList.map(list => {
//             if (list.regarding.kind == "Pod" && this.props.uid == list.regarding.uid) {
//                 console.log(this.props.uid)
//                 console.log(list)
//             }
//             return {
//                 uid: list.regarding.uid,
//                 kind: list.regarding.kind

//             }
//         })



//         apitoData = dataFromApi;
//         console.log(apitoData, "apitoData")


//         return (
//             <React.Fragment>
//                 {apitoData.map((test) => (

//                     <div className="div-content-detail">
//                         <div className="div-content-detail-3">
//                             <div className="avatar-xs">
//                                 <div className="avatar-title rounded-circle bg-light">
//                                     img
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="div-content-detail-2">
//                             <div>
//                                 <div className="div-content-text-2">
//                                     이름
//                                 </div>
//                                 <div className="div-content-text-1">

//                                     {test.uid}
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="div-content-detail-3">
//                             <div>
//                                 <div className="div-content-text-2" >
//                                     이미지
//                                 </div>
//                                 <div className="div-content-text-1">
//                                     {test.image}
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="div-content-detail-2">
//                             <div>
//                                 <div className="div-content-text-2">
//                                     상태
//                                 </div>
//                                 <div className="div-content-text-1">
//                                     {test.status}
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="div-content-detail-3">
//                             <div>
//                                 <div className="div-content-text-2">
//                                     restartCount
//                                 </div>
//                                 <div className="div-content-text-1">
//                                     {test.restartCount}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                 ))}
//             </React.Fragment>
//         );
//     }
// }

// export default EvnetTest;