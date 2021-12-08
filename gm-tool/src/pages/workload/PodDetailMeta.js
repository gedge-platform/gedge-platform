import React, { Component } from "react";

import { Row, Col, Card, CardBody, CardText, Container, Table } from "reactstrap";
//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { getAPI } from '../../components/Common/api';
import img1 from "../../assets/images/companies/img-1.png";

export default function PodDetailMeta(props) {

    const { apilistinfo } = props

    let labelTable = [];
    let annotationTable = [];
    let labels = apilistinfo.label
    let annotations = apilistinfo.annotations

    console.log(apilistinfo)
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
        annotationTable.push(
            // <h5 className="font-size-14 mb-0" style={{ whiteSpace: 'pre-line' }}>{keys}:{values}</h5>
            <tr>
                <th>{keys} </th>
                <td>{values}</td>
            </tr>
        )
    });


    return (
        <React.Fragment>
            <hr />
            <h4 className="card-title">라벨</h4>
            <hr />
            <div className="table-responsive mb-0" data-pattern="priority-columns">
                <Table hover id="tech-companies-1" bordered responsive>
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
                <Table id="tech-companies-1" bordered responsive>
                    <thead>
                        <tr>
                            <th data-priority="1">Key</th>
                            <th data-priority="3">Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {annotationTable}
                    </tbody>
                </Table>
            </div>
        </React.Fragment >
    );
}