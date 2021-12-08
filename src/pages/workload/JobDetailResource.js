import React, { Component } from "react";

import { Table } from "reactstrap";
import "./detail.scss"
import img1 from "../../assets/images/companies/img-1.png";

export default function JobDetailResource(props) {

    const { apilistinfo, involveData } = props
    console.log(apilistinfo, "test");
    console.log(involveData, "podList")
    console.log(apilistinfo.conditions, "job conditions");
    console.log(involveData)
    let jobCondition = apilistinfo.conditions
    console.log(jobCondition)

    let podList = involveData

    if (podList == undefined) {

        podList = []
    }
    console.log(podList, "파드")
    if (jobCondition == undefined) {

        jobCondition = []
    }
    const jobConditionOnfo = jobCondition.map((list, index) => {
        console.log(list)


        return (
            <div key={index}>
                <div className="div-content-detail" >
                    <div className="div-content-detail-5">
                        <div className="avatar-xs">
                            <div className="avatar-title rounded-circle bg-light">
                                <img src={img1} alt="" height="20" />
                            </div>
                        </div>
                    </div>
                    <div className="div-content-detail-1">
                        <div >
                            <div className="div-content-text-2">
                                Status
                            </div>
                            <div className="div-content-text-1">
                                {list.metadata}
                            </div>
                        </div>
                    </div>
                    <div className="div-content-detail-1">
                        <div>
                            <div className="div-content-text-2" >
                                Type
                            </div>
                            <div className="div-content-text-1">
                                {list.type}
                            </div>
                        </div>
                    </div>
                    <div className="div-content-detail-1">
                        <div>
                            <div className="div-content-text-2">
                                lastUpdated
                            </div>
                            <div className="div-content-text-1">
                                {list.lastProbeTime}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )

    })

    return (
        <React.Fragment>
            <div>
                <h5 className="font-size-14 mb-0" style={{ width: "100%" }}>Execution Records</h5>
            </div>

            <div>
                {jobConditionOnfo}
            </div>
            <div>
                <h5 className="font-size-14 mb-0" style={{ width: "100%" }}> Pod List</h5>
            </div>
            <div>

            </div>
        </React.Fragment >
    );
}