import React, { useEffect } from 'react';
import { TabContent, TabPane, NavLink, NavItem, CardText, Nav, Card, Row, Col, CardBody, Container, Table, Dropdown, DropdownMenu, DropdownItem, DropdownToggle, Modal, ModalHeader, ModalBody, Form, Input, Label, FormGroup, Button, Alert } from "reactstrap";
import { observer } from "mobx-react";
import store from "../../store/Monitor/store/Store"
//Import Charts
import "../Dashboard/dashboard.scss";
import "./detail.scss";
import img1 from "../../assets/images/companies/img-1.png";

const DeploymentMeta = observer((props) => {
    const { workloadData } = props

    let labelTable = [];
    let AnnotationTable = [];
    let labels = workloadData.labels
    let annotations = workloadData.annotations
    Object.entries(labels).forEach(([keys, values]) => {
        labelTable.push(
            // <h5 className="font-size-14 mb-0" style={{ whiteSpace: 'pre-line' }}>{keys}:{values}</h5>
            <tr>
                <th>{keys} </th>
                <td>{values}</td>
            </tr>
        )
    });
    Object.entries(annotations).forEach(([keys, values]) => {
        AnnotationTable.push(
            // <h5 className="font-size-14 mb-0" style={{ whiteSpace: 'pre-line' }}>{keys}:{values}</h5>
            <tr>
                <th>{keys} </th>
                <td>{values}</td>
            </tr>
        )
    });

    // let annotationsTable = [];
    // Object.entries(annotations).forEach(([keys, values]) => {
    //     annotationsTable.push(

    //         <h5 className="font-size-14 mb-0" style={{ whiteSpace: 'pre-line' }}>{keys}:{values}</h5>

    //     )
    // });

    useEffect(() => {
        return () => {
        };
    }, []);

    return (
        <React.Fragment>
            <hr />
            <h4 className="card-title">라벨</h4>
            <hr />
            <div className="table-responsive mb-0" data-pattern="priority-columns">
                <Table id="tech-companies-1" striped bordered responsive>
                    <thead>
                        <tr>
                            <th data-priority="1">Key</th>
                            <th data-priority="3">Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {labelTable}
                    </tbody>
                </Table>
            </div>
            <hr />
            <h4 className="card-title">어노테이션</h4>
            <hr />
            <div className="table-responsive mb-0" data-pattern="priority-columns">
                <Table id="tech-companies-1" striped bordered responsive>
                    <thead>
                        <tr>
                            <th data-priority="1">Key</th>
                            <th data-priority="3">Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {AnnotationTable}
                    </tbody>
                </Table>
            </div>
            {/* {labelTable.length > 0 ? labelTable : "Empty"} */}
            {/* <div className="table-responsive">
                <Table responsive >
                    <thead>
                        <tr>
                            <th style={{ width: "100%" }} >라벨</th>
                        </tr>
                    </thead>
                    <tbody>
                        {labelTable}
                    </tbody>
                </Table>
            </div> */}
            <hr />
            {/* <h4 className="card-title">Annotations</h4> */}
            {/* <hr /> */}
            {/* {annotationsTable} */}
            {/* <div className="table-responsive">
                <Table responsive >
                    <thead>
                        <tr>
                            <th style={{ width: "100%" }} >어노테이션</th>
                        </tr>
                    </thead>
                    <tbody>
                        {annotationsTable}
                    </tbody>
                </Table>
            </div> */}


        </React.Fragment >
    )
});

export default DeploymentMeta