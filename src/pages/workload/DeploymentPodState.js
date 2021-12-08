import React, { Component, useEffect } from "react";
import { observer } from "mobx-react";
import { Link, Route } from "react-router-dom";
import store from "../../store/Monitor/store/Store"
import img1 from "../../assets/images/companies/img-1.png";
import { TabContent, TabPane, NavLink, NavItem, Collapse, CardText, Nav, Card, Row, Col, CardBody, Container, Table, CardHeader, Dropdown, DropdownMenu, DropdownItem, DropdownToggle, Modal, ModalHeader, ModalBody, Form, Input, Label, FormGroup, Button } from "reactstrap";
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Alert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';


const DeploymentPodState = observer((props) => {
    const { query, workloadInvolveData } = props
    useEffect(() => {
        return () => {
        };
    }, []);

    const podsData = workloadInvolveData.pods
    let podList = []
    if (podsData !== "") {
        podList = podsData.map((item) => {
            return (
                <tr>

                    <td><Link to={"/workload/pod/" + item.name + "?workspace=" + query.workspace + "&project=" + query.project + "&cluster=" + query.cluster}>{item.name}</Link></td>
                    <td>{item.status}</td>
                    <td>{item.node}</td>
                    <td>{item.podIP}</td>
                </tr>
            )
        })
    } else {
        podList.push(
            <tr>
                <td>None</td>
                <td>None</td>
                <td>None</td>
                <td>None</td>
            </tr>
        )
    }
    return (
        <React.Fragment>
            <hr />
            <h4 className="card-title">Pod Info</h4>
            <hr />
            <div className="table-responsive mb-0" data-pattern="priority-columns">
                <Table id="tech-companies-1" striped bordered responsive>
                    <thead>
                        <tr>
                            <th data-priority="3">이름</th>
                            <th data-priority="2">상태</th>
                            <th data-priority="1">노드 IP</th>
                            <th data-priority="1">파드 IP</th>
                        </tr>
                    </thead>
                    <tbody>
                        {podList}
                    </tbody>
                </Table>
            </div>
            <hr />



        </React.Fragment>

    )
    // console.log(temp, "pod Temp")


    // const portTable = podList.map((list, key) => {
    //     let deploy_status = "Running"
    //     let pod_count = 0;
    //     restart = 0;
    //     list.status.containerStatuses.map(container => {
    //         pod_count = 0;
    //         restart = restart + container.restartCount;
    //         if (container.ready) {
    //             pod_count++;
    //         }
    //         if (container.state.running == undefined) {
    //             temp = Object.values(container.state)
    //             deploy_status = temp[0].reason
    //             if (temp[0].reason == "ContainerCreating") {
    //                 deploy_status = "Pending"
    //             }
    //         }
    //     })
    //     // console.log(restart, "restart")
    //     // console.log(deploy_status, "deploy_status")
    //     // console.log(podList, "podList")

    //     return (
    //         <div className="div-content-detail" >
    //             <div className="div-content-detail-1" >
    //                 <div>
    //                     <div className="div-content-text-1">{list.metadata.name}</div>
    //                     {/* <Link to={podLink} className="div-content-text-2">{list.metadata.name}</Link> */}
    //                     <div className="div-content-text-2">{deploy_status}</div>
    //                 </div>
    //             </div>
    //             <div className="div-content-detail-2">
    //                 <div>
    //                     <div className="div-content-text-1">{list.spec.nodeName}({list.status.hostIP})</div>
    //                     <div className="div-content-text-2">Node</div>
    //                 </div>
    //             </div>
    //             <div className="div-content-detail-2">
    //                 <div>
    //                     <div className="div-content-text-1">{list.status.podIP}</div>
    //                     <div className="div-content-text-2">Pod IP</div>
    //                 </div>
    //             </div>
    //             <div className="div-content-detail-3">
    //                 <div>
    //                     <div className="div-content-text-1">{restart}</div>
    //                     <div className="div-content-text-2">restart</div>
    //                 </div>
    //             </div>
    //         </div >
    //     )

    // })

    // return (
    //     <React.Fragment>
    //         <div className="table-responsive">
    //             <div className="content-detail">
    //                 {portTable}
    //             </div>
    //         </div>
    //     </React.Fragment >

    // )
});

export default DeploymentPodState