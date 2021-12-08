import React, { Component } from "react";

import { Row, Col, Card, CardBody, CardText, Container, Table } from "reactstrap";
//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { getAPI } from '../../components/Common/api';
import { render } from "@testing-library/react";

export default function CronjobResource(props) {

    // const { apiList, apiListtest } = props
    const joblist = props.joblist;
    console.log(props.joblist)

    let apitoDatats = [];



    const joblistTable = joblist.map(list => {

        console.log(list, "list");


        return (
            <div className="table-responsive">

                <tr>
                    <th style={{ width: "100%" }} >REFER JOB Information</th>
                </tr>
                {list.map((testte) => (

                    <div className="div-content-detail">
                        <div className="div-content-detail-3">
                            <div className="avatar-xs">
                                <div className="avatar-title rounded-circle bg-light">
                                    img
                                </div>
                            </div>
                        </div>
                        <div className="div-content-detail-1">
                            <div>
                                <div className="div-content-text-2">
                                    이름
                                </div>
                                <div className="div-content-text-1">
                                    {testte.metadata.name}
                                </div>
                            </div>
                        </div>
                        <div className="div-content-detail-1">
                            <div>
                                <div className="div-content-text-2" >
                                    Namespace
                                </div>
                                <div className="div-content-text-1">
                                    {testte.metadata.namespace}
                                </div>
                            </div>
                        </div>
                        {/* <div className="div-content-detail-2">
                            <div>
                                <div className="div-content-text-2">
                                    Image
                                </div>
                                <div className="div-content-text-1">

                                </div>
                            </div>
                        </div> */}

                    </div>

                ))}


            </div>
        )

    })
    return (
        <React.Fragment>
            <div className="table-responsive">
                <div className="content-detail">
                    {joblistTable}
                </div>
            </div>
        </React.Fragment >

    );
}