import React, { Component } from "react";

import { Row, Col, Card, CardBody, CardText, Container, Table } from "reactstrap";
//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { getAPI } from '../../components/Common/api';
import { render } from "@testing-library/react";

export default function CronjobDetailMeta(props) {

    const { apiList } = props
    console.log(apiList, "test");
    let metadata = apiList.metadata
    console.log(metadata)
    let temp = []
    let temp2 = []
    let selector = ""
    let detailList = []
    apiList.map(listobj => {
        selector = listobj.metadata.annotations;
        console.log(selector)

        Object.entries(listobj.metadata.annotations).forEach(([key, value]) => {
            console.log(` ${value}`)
            temp.push(` ${value}`)
        });
        console.log(temp, "Temp")
        // Object.entries(temp).forEach(([key, value]) => {
        //     console.log(`${key}: ${value}`)
        //     temp2.push(`${key}: ${value}`)
        // });
        // console.log(temp2)
        if (temp.length > 1) {
            temp = temp.toString();
            temp = temp.replaceAll(",", " ");

        }
        selector = temp

        detailList = listobj
        // const value = Object.values(detailList);
        // console.log(value)
    })

    console.log(temp)
    console.log(detailList, "labels")
    const annotationsTable = temp.map((tempAnnotations, key) => {
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
                {/* <Table className=" table-centered mb-0 table-nowrap"> */}
                <Table
                    hover
                    className=" mb-0 table-centered table-nowrap"
                >
                    <thead>
                        <tr>
                            <th>annotations </th>
                        </tr>
                    </thead>
                    <tbody>

                        <tr>

                            <td>
                                <h5 className="font-size-14 mb-0">
                                    {annotationsTable}
                                </h5>
                            </td>
                            <td>
                                <div id="spak-chart1"></div>
                            </td>
                            {/* <td>
                                    <h5 className="font-size-14 mb-0">
                                        {selector}
                                    </h5>
                                </td> */}
                        </tr>

                    </tbody>
                </Table>
                {/* <Table
                    hover
                    className=" mb-0 table-centered table-nowrap"
                >
                    <thead>
                        <tr>
                            <th
                                className="border-top-0"
                                style={{ width: "110px" }}
                                scope="col"
                            >
                                어노테이션
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <tr>
                                <td style={{ width: "60px" }}>
                                    <div className="avatar-xs">
                                        <div className="avatar-title rounded-circle bg-light">
                                            <img

                                                alt=""
                                                height="20"
                                            />
                                        </div>
                                    </div>
                                </td>

                                <td>
                                    <h5 className="font-size-14 mb-0">
                                        Source 1
                                    </h5>
                                </td>
                                <td>
                                    <div id="spak-chart1"></div>
                                </td>
                            </tr>
                        </tr>
                    </tbody>
                </Table> */}
            </div>
        </React.Fragment>
    );
}