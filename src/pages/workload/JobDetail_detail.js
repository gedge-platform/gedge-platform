import React, { Component } from "react";
import { useParams } from "react-router-dom";

import { Row, Col, Card, CardBody, CardText, Container, Table } from "reactstrap";
//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { getAPI } from '../../components/Common/api';
import { render } from "@testing-library/react";

export default function JobDetail_detail(props) {

    const { apilistinfo } = props
    console.log(apilistinfo, "test");



    return (

        <React.Fragment>
            <Table responsive className="mb-0">
                <div>
                    <thead>
                        <tr>
                            <th style={{ width: "100%" }} className="border-top-0">상세정보</th>
                        </tr>
                    </thead>
                </div>
                {/* {apitoData.map((test) => ( */}
                {/* <tbody key={apilistinfo.name}> */}
                <tbody >
                    <tr>
                        <td>클러스터</td>
                        <td>{apilistinfo.name}</td>
                    </tr>
                    <tr>
                        <td>프로젝트</td>
                        <td>{apilistinfo.project}</td>
                    </tr>

                    <tr>
                        <td>Status</td>
                        <td>{apilistinfo.status}</td>
                    </tr>

                    <tr>
                        <td>backoffLimit</td>
                        <td>{apilistinfo.backoffLimit}</td>
                    </tr>

                    <tr>
                        <td>completions</td>
                        <td>{apilistinfo.completions}</td>
                    </tr>
                    {/* <tr>
                        <td>parallelism</td>
                        <td>{apilistinfo.parallelism}</td>
                    </tr> */}
                    <tr>
                        <td>Created</td>
                        <td>{apilistinfo.created_at}</td>
                    </tr>
                    <tr>
                        <td>Creator</td>
                        <td></td>
                    </tr>

                </tbody>
                {/* ))} */}
            </Table>
        </React.Fragment >
    );
}