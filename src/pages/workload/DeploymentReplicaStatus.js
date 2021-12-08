// import React, { Component } from 'react';
import React, { Component, useEffect } from 'react';
import { Card, CardBody, Row, Col } from "reactstrap";
import store from "../../store/Monitor/store/Store"
import { observer } from "mobx-react";
//Import Charts
import ReactApexChart from 'react-apexcharts';
import "../Dashboard/dashboard.scss";
// export default function DeploymentReplicaStatus(props) {

const DeploymentReplicaStatus = observer((props) => {
    const { query, workloadData } = props;
    const { callApiStore } = store;
    const workload = workloadData
    useEffect(() => {
        // if (callApiStore.projectDetail != null) {
        //     project = callApiStore.projectDetail
        // }
    }, []);

    let updatedReplicas = 0;
    let availableReplicas = 0;
    let unavailableReplicas = 0;
    let replicas = 0;
    let readyReplicas = 0;

    // if (/workload.length > 0) {
    console.log(workload.replica.availableReplicas, "workload.replica.availableReplicas")
    updatedReplicas = workload.replica.updatedReplicas
    availableReplicas = workload.replica.availableReplicas
    unavailableReplicas = workload.replica.unavailableReplicas
    replicas = workload.replica.replicas
    readyReplicas = workload.replica.readyReplicas
    // }

    // console.log(detailList)
    const state = {
        series: [updatedReplicas, availableReplicas, unavailableReplicas],
        options: {
            labels: ["update", "available", "unavailable"],
            plotOptions: {
                pie: {
                    donut: {
                        size: '75%'
                    }
                }
            },
            dataLabels: {
                enabled: false
            },
            legend: {
                show: false,
            },
            colors: ['#AFB8F6', '#46D7FB', '#F6ACDC'],
        }
    }
    return (
        <React.Fragment>
            <hr />
            <h4 className="card-title">레플리카</h4>
            <hr />
            <div id="donut-chart" className="apex-charts">
                <ReactApexChart options={state.options} series={state.series} type="donut" height="230" />
            </div>

            <Row>
                <Col xs={4}>
                    <div className="text-center mt-4">
                        <p className="mb-2 text-truncate"><i className="mdi mdi-circle text-primary font-size-10 mr-1"></i> update</p>
                        <h5>수정필요 %</h5>
                    </div>
                </Col>
                <Col xs={4}>
                    <div className="text-center mt-4">
                        <p className="mb-2 text-truncate"><i className="mdi mdi-circle text-success font-size-10 mr-1"></i> available</p>
                        <h5>수정필요 %</h5>
                    </div>
                </Col>
                <Col xs={4}>
                    <div className="text-center mt-4">
                        <p className="mb-2 text-truncate"><i className="mdi mdi-circle text-warning font-size-10 mr-1"></i> unavailable</p>
                        <h5>수정필요 %</h5>
                    </div>
                </Col>
            </Row>
        </React.Fragment>
    )
});

export default DeploymentReplicaStatus