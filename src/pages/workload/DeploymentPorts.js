import React, { Component, useState, useEffect } from 'react';
import { Card, CardBody, Row, Col, Table, TabContent, TabPane, Collapse, NavLink, NavItem, CardText, Nav, CardHeader, Container } from "reactstrap";
import { observer } from "mobx-react";
import store from "../../store/Monitor/store/Store"
import { Link, Route } from "react-router-dom";
//Import Charts
import ReactApexChart from 'react-apexcharts';
import { getAPI } from '../../components/Common/api';
import * as api from '../../components/Common/api';
import "../Dashboard/dashboard.scss";
import "./detail.scss"

const DeploymentPorts = observer((props) => {
    const { query, workloadInvolveData } = props;
    const { callApiStore } = store;
    const workload = workloadInvolveData
    const [isOpen, setOpen] = React.useState(false);
    useEffect(() => {

    }, []);
    console.log(workloadInvolveData, "workloadInvolveData")
    let ServiceName = "-"
    if (workload.services.name != "") {
        ServiceName = workload.services.name
    } else {
        ServiceName = "-"
    }
    console.log(ServiceName)
    useEffect(() => {
        return () => {
        };
    }, []);
    let port = [];
    port = workload.services.port
    let portList = port.map((item, key) => {
        return (
            <tr>
                <th>{item.name} </th>
                <td>{item.port}</td>
                <td>{item.protocol}</td>
            </tr>
        )
    })

    return (
        <React.Fragment>
            <hr />
            <h4 className="card-title">Service Info</h4>
            <hr />
            <div className="table-rep-plugin">
                <div className="table-responsive mb-0" data-pattern="priority-columns">
                    <Table id="tech-companies-1" striped bordered responsive>
                        <thead>
                            <tr>
                                <th data-priority="1">서비스 명 </th>
                                <th data-priority="3"> <Link to={"/workload/service/" + ServiceName + "?workspace=" + query.workspace + "&project=" + query.project + "&cluster=" + query.cluster}>{ServiceName}</Link></th>
                            </tr>
                        </thead>

                    </Table>
                    <Table id="tech-companies-1" striped bordered responsive>

                        <thead>
                            <tr>
                                <th data-priority="1">이름</th>
                                <th data-priority="3">포트</th>
                                <th data-priority="1">프로토콜</th>

                            </tr>
                        </thead>
                        <tbody>
                            {portList}
                        </tbody>
                    </Table>
                </div>
            </div>
            <hr />
        </React.Fragment >
    )
    // if (ServiceList.length == 0) {
    //     console.log("empty");
    //     serviceTable = (
    //         < div className="service-Title" >
    //             <div className="div-content-detail-1" >
    //                 <div>
    //                     <div className="div-content-text-1">Service Nothing!</div>
    //                     <div className="div-content-text-2">name</div>
    //                 </div>
    //             </div>
    //         </div >
    //     )
    // } else {
    //     console.log("Notempty");
    //     serviceTable = ServiceList.map((list, key) => {
    //         return (
    //             < div className="service-Title">
    //                 <div className="div-content-detail-1" >
    //                     <div>
    //                         <div className="div-content-text-1">{list.metadata.name}</div>
    //                         <div className="div-content-text-2">name</div>
    //                     </div>
    //                 </div>
    //                 <div className="div-content-detail-2">
    //                     <div>
    //                         <div className="div-content-text-1">{list.spec.clusterIP}</div>
    //                         <div className="div-content-text-2">{list.spec.type}</div>
    //                     </div>
    //                 </div>
    //             </div>
    //         )

    //     });
    // }

    // ServiceList.map((list, key) => {
    //     let portName = "null"
    //     portTable = list.spec.ports.map((port, key) => {
    //         if (port.name !== undefined) {
    //             portName = port.name
    //         } else {
    //             portName = "null"
    //         }
    //         return (
    //             <div className="accordion-content">

    //                 <div className="div-content-detail-2" >
    //                     <div>
    //                         <div className="div-content-text-1">{portName}</div>
    //                         <div className="div-content-text-2">name</div>
    //                     </div>
    //                 </div>
    //                 <div className="div-content-detail-2">
    //                     <div>
    //                         <div className="div-content-text-1">{port.port}</div>
    //                         <div className="div-content-text-2">port</div>
    //                     </div>
    //                 </div>
    //                 <div className="div-content-detail-2">
    //                     <div>
    //                         <div className="div-content-text-1">{port.protocol}</div>
    //                         <div className="div-content-text-2">protocol</div>
    //                     </div>
    //                 </div>
    //                 <div className="div-content-detail-2">
    //                     <div>
    //                         <div className="div-content-text-1">{port.targetPort}</div>
    //                         <div className="div-content-text-2">targetPort</div>
    //                     </div>
    //                 </div>

    //             </div>
    //         )

    //     })
    // })

    // return (

    //     <React.Fragment>
    //         <div className="accordion-wrapper">
    //             {/* <div className={`accordion-title ${isOpen ? "open" : ""}`} onClick={() => setOpen(!isOpen)} > {serviceTable}</div> */}
    //             <div className={`accordion-item ${!isOpen ? "collapsed" : ""}`}>
    //                 {/* <div className="accordion-content"> */}
    //                 <div className="content-detail">
    //                     {/* {portTable} */}
    //                 </div>
    //             </div>
    //         </div>
    //     </React.Fragment >

    // )
});

export default DeploymentPorts