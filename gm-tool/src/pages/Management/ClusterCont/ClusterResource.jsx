import React, { useState, useEffect } from 'react';
// import APIAppTab from './APIAppTab

import pod from "@/images/resource/pod.png";
import deployment from "@/images/resource/deployment.png";
import service from "@/images/resource/service.png";
import jobs from "@/images/resource/jobs.png";
import volume from "@/images/resource/volume.png";


const ClusterResource = (props) => {
    const [tabvalue, setTabvalue] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabvalue(newValue);
    };
    console.log("aa")
    return (
      <>
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
                                    44
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
                                    35
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
                                    14
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
                                   0
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
                                    1
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
                                    2
                                </div>
                            </div>
                        </div>
                   
            </>
    );
}

export default ClusterResource;