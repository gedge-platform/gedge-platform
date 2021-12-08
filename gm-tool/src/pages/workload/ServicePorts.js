import React, { useEffect } from 'react';
import { observer } from "mobx-react";
import { TabContent, TabPane, NavLink, NavItem, CardText, Nav, Card, Row, Col, CardBody, Container, Table, Dropdown, DropdownMenu, DropdownItem, DropdownToggle, Modal, ModalHeader, ModalBody, Form, Input, Label, FormGroup, Button, Alert } from "reactstrap";
import store from "../../store/Monitor/store/Store"
//Import Charts
import "../Dashboard/dashboard.scss";
import "./detail.scss";

const ServicePorts = observer((props) => {
    const { workloadDetailStore } = store;
    const { params } = props;
    const { apitoData } = props;

    let portList = [];

    const link = "namespaces/" + params.namespace + "/endpoints/" + params.name

    if (apitoData.length > 0) {
        apitoData.map((list, key) => {
            // console.log(list)
            portList = list.port

        })
    }

    const portTable = portList.map((port, key) => {
        let portName = "null"
        if (port.name !== undefined) {
            portName = port.name
        } else {
            portName = "null"
        }
        return (
            <div className="div-content-detail">

                <div className="div-content-detail-2" >
                    <div>
                        <div className="div-content-text-1">{portName}</div>
                        <div className="div-content-text-2">name</div>
                    </div>
                </div>
                <div className="div-content-detail-2">
                    <div>
                        <div className="div-content-text-1">{port.port}</div>
                        <div className="div-content-text-2">port</div>
                    </div>
                </div>
                <div className="div-content-detail-2">
                    <div>
                        <div className="div-content-text-1">{port.protocol}</div>
                        <div className="div-content-text-2">protocol</div>
                    </div>
                </div>
                <div className="div-content-detail-2">
                    <div>
                        <div className="div-content-text-1">{port.targetPort}</div>
                        <div className="div-content-text-2">targetPort</div>
                    </div>
                </div>

            </div>
        )



    })


    return (
        <React.Fragment>
            <div className="table-responsive">
                <Table responsive className="mb-0">
                    <thead>
                        <tr>
                            <th style={{ width: "100%" }} >서비스 포트</th>
                        </tr>
                    </thead>
                </Table>
            </div>
            <div className="table-responsive">
                <div className="content-detail">
                    {portTable}
                </div>
            </div>
        </React.Fragment >

    )
});

export default ServicePorts