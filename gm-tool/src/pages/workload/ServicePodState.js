import React, { useEffect } from 'react';
import { observer } from "mobx-react";
import { TabContent, TabPane, NavLink, NavItem, CardText, Nav, Card, Row, Col, CardBody, Container, Table, Dropdown, DropdownMenu, DropdownItem, DropdownToggle, Modal, ModalHeader, ModalBody, Form, Input, Label, FormGroup, Button, Alert } from "reactstrap";
import store from "../../store/Monitor/store/Store"
//Import Charts
import "../Dashboard/dashboard.scss";
import "./detail.scss";

const ServicePodState = observer((props) => {
    const { workloadDetailStore } = store;
    const { params } = props;

    let temp = [];
    let podReadyList = [];
    let podNotReadyList = [];
    let portList = [];

    const link = "namespaces/" + params.namespace + "/endpoints/" + params.name
    // console.log(link)
    useEffect(() => {
        workloadDetailStore.getEndpointList(link);
    }, []);

    if (workloadDetailStore.endpointList !== undefined) {
        temp = workloadDetailStore.endpointList
    }

    // console.log(temp, "service Temp")
    temp.map((list, key) => {
        // console.log(list)
        portList = list.ports;
        podReadyList = list.addresses;
        podNotReadyList = list.notReadyAddresses
    })
    console.log(podReadyList, "podReadyList")
    // })

    const podTable = podReadyList.map((list) => {
        // console.log(list)
        // console.log(list.ip)
        return (
            <div className="div-content-detail" >
                <div className="div-content-detail-1" >
                    <div>
                        {/* <div className="div-content-text-1">{list.targetRef.name}</div> */}
                        <div className="div-content-text-2">Pod Name</div>
                    </div>
                </div>
                <div className="div-content-detail-2">
                    <div>
                        <div className="div-content-text-1">{list.nodeName}</div>
                        <div className="div-content-text-2">Node</div>
                    </div>
                </div>
                <div className="div-content-detail-2">
                    <div>
                        <div className="div-content-text-1">{list.ip}</div>
                        <div className="div-content-text-2">Pod IP</div>
                    </div>
                </div>
            </div >
        )

    })

    return (
        <React.Fragment>
            <div className="table-responsive">
                <Table responsive className="mb-0">
                    <thead>
                        <tr>
                            <th style={{ width: "100%" }} >파드</th>
                        </tr>
                    </thead>
                </Table>
            </div>
            <div className="table-responsive">
                <div className="content-detail">
                    {podTable}
                </div>
            </div>
        </React.Fragment >

    )
});

export default ServicePodState