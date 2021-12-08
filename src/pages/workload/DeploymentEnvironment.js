import React, { useEffect } from 'react';
import { TabContent, TabPane, NavLink, NavItem, CardText, Nav, Card, Row, Col, CardBody, Container, Table, Dropdown, DropdownMenu, DropdownItem, DropdownToggle, Modal, ModalHeader, ModalBody, Form, Input, Label, FormGroup, Button, Alert } from "reactstrap";
import { observer } from "mobx-react";
import store from "../../store/Monitor/store/Store"
//Import Charts
import "../Dashboard/dashboard.scss";
import "./detail.scss";
import img1 from "../../assets/images/companies/img-1.png";


const DeploymentEnvironment = observer((props) => {
    const apitoData = props.apitoData;
    let containers = []
    let annotations = []
    let temp = [];
    apitoData.map((list, key) => {
        console.log(list.containers)
        containers = list.containers

    })
    const containerTable = containers.map((container, key) => {
        let resource = ""
        let resource1 = ""
        let resource2 = ""
        console.log(container.resources, "container.resources")
        console.log(Object.entries(container.resources), "resources")
        if (Object.entries(container.resources).length > 0) {
            resource1 = ""
            resource2 = ""
            Object.entries(container.resources).forEach(([keys, values]) => {
                console.log(`${keys}: ${values}`, "1")
                resource1 = `${keys}` + "\n";
                temp = values
                console.log(`${values}`)
                Object.entries(temp).forEach(([keys, values]) => {
                    resource1 = resource1 + " - " + `${keys}: ${values}` + "\n"
                })
                resource = resource + resource1
            });

        } else {
            resource = "EMPTY"
        }
        console.log(resource)
        return (
            <tr>

                <td>
                    <h5 className="font-size-14 mb-0" >{container.name}</h5>
                </td>
                <td>
                    <h5 className="font-size-14 mb-0" >{container.image}</h5>
                </td>
                <td>
                    <h5 className="font-size-14 mb-0" style={{ whiteSpace: 'pre-line' }}>{resource}</h5>
                </td>
            </tr>
        )
    })
    const annotationsTable = annotations.map((tempAnnotations, key) => {
        return (
            <tr>
                <td>
                    <h5 className="font-size-14 mb-0" style={{ whiteSpace: 'pre-line' }} >{tempAnnotations}</h5>
                </td>
            </tr>
        )
    })

    return (
        <React.Fragment>
            <div className="table-responsive">
                <Table responsive className="mb-0">
                    <thead>
                        <tr>
                            <th style={{ width: "100%" }} >컨테이너</th>
                        </tr>
                    </thead>
                </Table>
            </div>
            <Table className=" mb-0 table-centered table-nowrap">
                <thead>
                    <tr>
                        <td>이름</td>
                        <td>이미지</td>
                        <td>리소스</td>
                    </tr>
                </thead>
                <tbody>
                    {containerTable}
                </tbody>
            </Table>
        </React.Fragment >

    )
});

export default DeploymentEnvironment