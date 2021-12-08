import React, { Component } from "react";

import { Row, Col, Card, CardBody, CardText, Container, Table } from "reactstrap";
//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { getAPI } from '../../components/Common/api';
import img1 from "../../assets/images/companies/img-1.png";
export default function JobDetailMeta(props) {

    const { apilistinfo } = props
    console.log(apilistinfo, "test");
    let temp = []
    let labels = []
    let annotations = []
    temp.map((list, key) => {
        console.log(list.label)
        if (list.label == undefined) {
            labels.push(`-`)
        }
        else {
            Object.entries(list.label).forEach(([keys, values]) => {
                labels.push(`${keys}: ${values}`)
            });
        }
        if (list.annotations == undefined) {
            annotations.push(`-`)
        }
        else {
            Object.entries(list.annotations).forEach(([keys, values]) => {
                annotations.push(`${keys}: ${values}`)
            });
        }
    })
    console.log(labels)
    const labelTable = labels.map((tempLabel, index) => {
        return (
            <tr key={index}>
                <td>
                    <h5 className="font-size-14 mb-0" style={{ whiteSpace: 'pre-line' }} >{tempLabel}</h5>
                </td>
            </tr>
        )
    })
    const annotationsTable = annotations.map((tempAnnotations, index) => {
        return (
            <tr key={index}>

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

                        <th style={{ width: "100%" }} >라벨</th>

                    </thead>
                </Table>
            </div>
            <Table className=" mb-0 table-centered table-nowrap">
                <tbody>
                    {/* <tr> */}
                    {labelTable}
                    {/* </tr> */}
                </tbody>
            </Table>
            <div className="table-responsive">
                <Table responsive className="mb-0">
                    <thead>

                        <th style={{ width: "100%" }} >어노테이션</th>

                    </thead>
                </Table>
            </div>
            <Table className="mb-0 table-centered table-nowrap">
                <tbody>
                    {annotationsTable}
                </tbody>
            </Table>
        </React.Fragment >
    );
}