import React, { Component } from "react";

import { Row, Col, Card, CardBody, CardText, Container, Table } from "reactstrap";
//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { getAPI } from '../../components/Common/api';
import { render } from "@testing-library/react";
import img1 from "../../assets/images/companies/img-1.png";

export default function PodStatus(props) {

    const { apilistinfo } = props
    console.log(apilistinfo, "test");
    console.log(apilistinfo.statusConditions, "test2");

    let status = apilistinfo.statusConditions
    console.log(status)
    // // temp.push(labels)
    // // annotations = labels
    if (status == undefined) {
        status = []
    }

    const content = status.map((list, index) => {
        // console.log(list.type)
        // portList = list.ports;
        // podReadyList = list.addresses;
        // podNotReadyList = list.notReadyAddresses
        return (
            <tbody key={index}>
                <tr>
                    <td >
                        {list.type}
                    </td>
                    <td>
                        {list.status}
                    </td>
                    <td>
                        {list.lastTransitionTime}
                    </td>
                </tr>
            </tbody>
        )
    })


    return (
        <React.Fragment>
            <Table
                hover
                bordered
                responsive
                className=" mb-0 table-centered table-nowrap">
                <thead>
                    <tr>
                        <th><h5 className="font-size-14 mb-0">Conditions</h5></th>
                        <th><h5 className="font-size-14 mb-0">Status</h5></th>
                        <th><h5 className="font-size-14 mb-0">Updated</h5></th>
                    </tr>
                </thead>

                {content}


            </Table>
        </React.Fragment >
    );
}