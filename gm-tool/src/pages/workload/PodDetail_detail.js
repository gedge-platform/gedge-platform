import React, { Component } from "react";
import { useParams } from "react-router-dom";

import { Row, Col, Card, CardBody, CardText, Container, Table } from "reactstrap";
//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { getAPI } from '../../components/Common/api';
import { render } from "@testing-library/react";

export default function PodDetail_detail(props) {

    const { apilistinfo } = props
    console.log(apilistinfo, "test");
    // const { id } = useParams();
    // console.log(id)
    // let apitoData = [];
    // apitoData = apilistinfo
    // console.log(apilistinfo)
    // console.log(apilistinfo.Podcontainers, "pod 상태")
    let status = apilistinfo.containerStatuses
    console.log(status, "for restartcount ")
    if (status == undefined) {
        status = []
    }
    let t = 0;
    t = status.map((count, key) => {
        console.log(count)
        console.log(count.restartCount)
        let total = 0;
        var parse = parseInt(count.restartCount)
        console.log(parse, "1111")
        total += count.restartCount
        console.log(total)

        return total
    })
    const result = t.reduce(function add(sum, currValue) {
        return sum + currValue;
    }, 0);
    console.log(result, "변환cccc")

    console.log(t, "total data")
    return (
        <React.Fragment>
            <div className="table-responsive">
                {/* <Table className=" table-centered mb-0 table-nowrap"> */}

                <Table responsive className="mb-0">
                    <thead>
                        <tr>
                            <th style={{ width: "100%" }} className="border-top-0">상세정보</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr></tr>
                    </tbody>
                </Table>
                <Table responsive className="mb-0">
                    <thead>
                        <tr>
                        </tr>
                    </thead>

                    <tbody key={apilistinfo.name}>
                        <tr>
                            <td >클러스터</td>
                            <td>{apilistinfo.cluster}</td>
                        </tr>
                        <tr>
                            <td>프로젝트</td>
                            <td>{apilistinfo.project}</td>
                        </tr>
                        <tr>
                            <td>APP</td>
                            <td>수정 필요</td>
                        </tr>

                        <tr>
                            <td>Status</td>
                            <td>{apilistinfo.status}</td>
                        </tr>

                        <tr>
                            <td>Pod IP</td>
                            <td>{apilistinfo.podIP}</td>
                        </tr>
                        <tr>
                            <td>Node Name</td>
                            <td>{apilistinfo.node_name}</td>
                        </tr>
                        <tr>
                            <td>Node IP</td>
                            <td>{apilistinfo.hostIP}</td>
                        </tr>
                        <tr>
                            <td>Restart Count</td>
                            <td>{result}</td>
                        </tr>
                        <tr>
                            <td>Qos Class</td>
                            <td>{apilistinfo.qosClass}</td>
                        </tr>
                        <tr>
                            <td>Created</td>
                            <td>{apilistinfo.creationTimestamp}</td>
                        </tr>

                    </tbody>

                </Table>

            </div>
        </React.Fragment>
    );
}