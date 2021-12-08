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

const ProjectResource = observer((props) => {
    const { projectData } = props
    const [isOpen1, setOpen1] = React.useState(false);
    const [isOpen2, setOpen2] = React.useState(false);
    const [isOpen3, setOpen3] = React.useState(false);
    const [isOpen4, setOpen4] = React.useState(false);
    const [isOpen5, setOpen5] = React.useState(false);
    const [isOpen6, setOpen6] = React.useState(false);
    // console.log(resource)

    useEffect(() => {
        return () => { };
    }, []);
    function resourceTable(clusterName, conut) {
        return (
            [
                <div className="accordion-content">
                    <div className="div-content-detail-2" >
                        <div>
                            <div className="div-content-text-1">{clusterName}</div>
                            <div className="div-content-text-2">클러스터</div>
                        </div>
                    </div>
                    <div className="div-content-detail-2">
                        <div>
                            <div className="div-content-text-1">{conut} 개</div>
                            {/* <div className="div-content-text-2">개</div> */}
                        </div>
                    </div>
                </div >]);
    }
    let deployment_count = 0;
    let pod_count = 0;
    let service_count = 0;
    let cronjob_count = 0;
    let job_count = 0;
    let volume_count = 0;
    let resource = []
    let deploytable = []
    let podtable = []
    let servicetable = []
    let cronjobtable = []
    let jobtable = []
    let volumetable = []
    if (projectData.length != 0) {
        if (projectData.length > 1) {
            projectData.map((data, index) => {
                console.log(data.resource.deployment_count, "list")
                // resource[index] = data.resource
                // resource[index]["clusterName"] = data.clusterName
                deployment_count = deployment_count + data.resource.deployment_count;
                pod_count = pod_count + data.resource.pod_count;
                service_count = service_count + data.resource.service_count;
                cronjob_count = cronjob_count + data.resource.cronjob_count;
                job_count = job_count + data.resource.job_count;
                volume_count = volume_count + data.resource.volume_count;
                // table[index]["test"] = ["test"]
                deploytable[index] = resourceTable(data.clusterName, data.resource.deployment_count)
                podtable[index] = resourceTable(data.clusterName, data.resource.pod_count)
                servicetable[index] = resourceTable(data.clusterName, data.resource.service_count)
                cronjobtable[index] = resourceTable(data.clusterName, data.resource.cronjob_count)
                jobtable[index] = resourceTable(data.clusterName, data.resource.job_count)
                volumetable[index] = resourceTable(data.clusterName, data.resource.volume_count)
            })
            const DeployTotalTable = (
                <div className="div-content-resource">
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
                </div>)
            const PodTotalTable = (
                <div className="div-content-resource">
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
                </div>)
            const ServiceTotalTable = (
                <div className="div-content-resource">
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
                </div>)
            const JobTotalTable = (
                <div className="div-content-resource">
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
                </div>)
            const CronJobTotalTable = (
                <div className="div-content-resource">
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
                </div>)
            const VolumeTotalTable = (
                <div className="div-content-resource">
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
                </div>)
            return (
                <React.Fragment>
                    <hr />
                    <h4 className="card-title">리소스 사용량 </h4>
                    <hr />
                    <div className="accordion-wrapper">
                        <div className={`accordion-title ${isOpen1 ? "open" : ""}`} onClick={() => setOpen1(!isOpen1)} > {DeployTotalTable}</div>
                        <div className={`accordion-item ${!isOpen1 ? "collapsed" : ""}`}>
                            {/* <div className="accordion-content"> */}
                            <div className="content-detail">
                                {deploytable}
                            </div>
                        </div>
                    </div>
                    <div className="accordion-wrapper">
                        <div className={`accordion-title ${isOpen2 ? "open" : ""}`} onClick={() => setOpen2(!isOpen2)} > {PodTotalTable}</div>
                        <div className={`accordion-item ${!isOpen2 ? "collapsed" : ""}`}>
                            {/* <div className="accordion-content"> */}
                            <div className="content-detail">
                                {podtable}
                            </div>
                        </div>
                    </div>
                    <div className="accordion-wrapper">
                        <div className={`accordion-title ${isOpen3 ? "open" : ""}`} onClick={() => setOpen3(!isOpen3)} > {ServiceTotalTable}</div>
                        <div className={`accordion-item ${!isOpen3 ? "collapsed" : ""}`}>
                            {/* <div className="accordion-content"> */}
                            <div className="content-detail">
                                {servicetable}
                            </div>
                        </div>
                    </div>
                    <div className="accordion-wrapper">
                        <div className={`accordion-title ${isOpen4 ? "open" : ""}`} onClick={() => setOpen4(!isOpen4)} > {JobTotalTable}</div>
                        <div className={`accordion-item ${!isOpen4 ? "collapsed" : ""}`}>
                            {/* <div className="accordion-content"> */}
                            <div className="content-detail">
                                {jobtable}
                            </div>
                        </div>
                    </div>

                    <div className="accordion-wrapper">
                        <div className={`accordion-title ${isOpen5 ? "open" : ""}`} onClick={() => setOpen5(!isOpen5)} > {CronJobTotalTable} </div>
                        <div className={`accordion-item ${!isOpen5 ? "collapsed" : ""}`}>
                            {/* <div className="accordion-content"> */}
                            <div className="content-detail">
                                {cronjobtable}
                            </div>
                        </div>
                    </div>
                    <div className="accordion-wrapper">
                        <div className={`accordion-title ${isOpen6 ? "open" : ""}`} onClick={() => setOpen6(!isOpen6)} > {VolumeTotalTable} </div>
                        <div className={`accordion-item ${!isOpen6 ? "collapsed" : ""}`}>
                            {/* <div className="accordion-content"> */}
                            <div className="content-detail">
                                {volumetable}
                            </div>
                        </div>
                    </div>
                </React.Fragment >
            )
        } else {
            // resource = projectData.resource
            // resource["cluster"] = projectData.clusterName
            deployment_count = projectData.resource.deployment_count;
            pod_count = projectData.resource.pod_count;
            service_count = projectData.resource.service_count;
            cronjob_count = projectData.resource.cronjob_count;
            job_count = projectData.resource.job_count;
            volume_count = projectData.resource.volume_count;

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
            // deployment_count = deployment_count + data.resource.deployment_count;
            // pod_count = pod_count + data.resource.pod_count;
            // service_count = service_count + data.resource.service_count;
            // cronjob_count = cronjob_count + data.resource.cronjob_count;
            // job_count = job_count + data.resource.job_count;
            // volume_count = volume_count + data.resource.volume_count;
        }
    }


})

export default ProjectResource;