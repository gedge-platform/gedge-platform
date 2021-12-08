import React, { Component, useEffect } from "react";
import { observer } from "mobx-react";
import store from "../../store/Monitor/store/Store"
import img1 from "../../assets/images/companies/img-1.png";
import { Row, Col, Card, CardBody, CardText, Container, Table } from "reactstrap";

import pod from "../../assets/images/resource/pod.png";
import deployment from "../../assets/images/resource/deployment.png";
import service from "../../assets/images/resource/service.png";
import jobs from "../../assets/images/resource/jobs.png";
import volume from "../../assets/images/resource/volume.png";

const CoreDetailResource = observer((props) => {
    const { resource } = props
    const { clusterStore } = store;

    console.log(resource)

    useEffect(() => {
        return () => { };
    }, []);

    let deployment_count = 0;
    let pod_count = 0;
    let service_count = 0;
    let cronjob_count = 0;
    let job_count = 0;
    let volume_count = 0;

    if (resource) {
        deployment_count = resource.deployment_count
        pod_count = resource.pod_count
        service_count = resource.service_count
        cronjob_count = resource.cronjob_count
        job_count = resource.job_count
        volume_count = resource.volume_count
    }

    return (
        <React.Fragment>
            <div>
                <hr />
                <h4 className="card-title">리소스 사용량 </h4>
                <hr />
                <div className="div-content-detail">
                    <div style={{ width: "40px" }}>
                        <div className="resource-div">
                            <div className="avatar-title rounded-circle bg-light">
                                <img src={deployment} alt="" height="25" />
                            </div>
                        </div>
                    </div>
                    <div className="resource-content-1">
                        <div className="resource-text-1 ">
                            디플로이먼트
                        </div>
                    </div>
                    <div className="resource-content-1">
                        <div className="resource-text-1 ">
                            {deployment_count}
                        </div>
                    </div>
                </div>
                <div className="div-content-detail">
                    <div style={{ width: "40px" }}>
                        <div className="resource-div">
                            <div className="avatar-title rounded-circle bg-light">
                                <img src={pod} alt="" height="25" />
                            </div>
                        </div>
                    </div>
                    <div className="resource-content-1">
                        <div className="resource-text-1 ">
                            파드
                        </div>
                    </div>
                    <div className="resource-content-1">
                        <div className="resource-text-1 ">
                            {pod_count}
                        </div>
                    </div>
                </div>
                <div className="div-content-detail">
                    <div style={{ width: "40px" }}>
                        <div className="resource-div">
                            <div className="avatar-title rounded-circle bg-light">
                                <img src={service} alt="" height="25" />
                            </div>
                        </div>
                    </div>
                    <div className="resource-content-1">
                        <div className="resource-text-1 ">
                            서비스
                        </div>
                    </div>
                    <div className="resource-content-1">
                        <div className="resource-text-1 ">
                            {service_count}
                        </div>
                    </div>
                </div>
                <div className="div-content-detail">
                    <div style={{ width: "40px" }}>
                        <div className="resource-div">
                            <div className="avatar-title rounded-circle bg-light">
                                <img src={jobs} alt="" height="25" />
                            </div>
                        </div>
                    </div>
                    <div className="resource-content-1">
                        <div className="resource-text-1 ">
                            크론잡
                        </div>
                    </div>
                    <div className="resource-content-1">
                        <div className="resource-text-1 ">
                            {cronjob_count}
                        </div>
                    </div>
                </div>
                <div className="div-content-detail">
                    <div style={{ width: "40px" }}>
                        <div className="resource-div">
                            <div className="avatar-title rounded-circle bg-light">
                                <img src={jobs} alt="" height="25" />
                            </div>
                        </div>
                    </div>
                    <div className="resource-content-1">
                        <div className="resource-text-1 ">
                            잡
                        </div>
                    </div>
                    <div className="resource-content-1">
                        <div className="resource-text-1 ">
                            {job_count}
                        </div>
                    </div>
                </div>
                <div className="div-content-detail">
                    <div style={{ width: "40px" }}>
                        <div className="resource-div">
                            <div className="avatar-title rounded-circle bg-light">
                                <img src={volume} alt="" height="25" />
                            </div>
                        </div>
                    </div>
                    <div className="resource-content-1">
                        <div className="resource-text-1 ">
                            볼륨
                        </div>
                    </div>
                    <div className="resource-content-1">
                        <div className="resource-text-1 ">
                            {volume_count}
                        </div>
                    </div>
                </div>
            </div >
        </React.Fragment >
    )

})

export default CoreDetailResource;