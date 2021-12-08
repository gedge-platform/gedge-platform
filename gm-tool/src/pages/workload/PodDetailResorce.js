import { map } from "leaflet";
import React, { Component } from "react";

import { Row, Col, Card, CardBody, CardText, Container, Table } from "reactstrap";
import dockerimg from "../../assets/images/companies/docker.png";


export default function PodDetailResorce(props) {

    const { apilistinfo } = props
    console.log(apilistinfo, "test");
    console.log(apilistinfo.containerStatuses, "containerinfo");

    let containerInfo = apilistinfo.containerStatuses
    console.log(containerInfo)
    // // temp.push(labels)
    // // annotations = labels
    if (containerInfo == undefined) {
        containerInfo = []
    }
    let volumemounts = apilistinfo.Podcontainers
    console.log(volumemounts, "저장소 정보")

    if (volumemounts == undefined) {
        volumemounts = []
    }

    const test = volumemounts.map((list, index) => {
        console.log(list.volumemounts)
        return list.volumemounts
    })
    console.log(test)
    if (volumemounts == undefined) {

        volumemounts = []
    }
    const containercontent = containerInfo.map((list, index) => {
        let ready = "ready"
        if (list.ready == true) {
            list.ready = ready
        }
        if (list.restartCount == undefined) {
            list.restartCount = 0
        }
        console.log(list, "containercontent")
        console.log(list.containerID, "containercontent")
        console.log(list.restartCount)
        let total = 0
        total += list.restartCount
        console.log(total)
        // console.log(list.restartCount)
        // portList = list.ports;
        // podReadyList = list.addresses;
        // podNotReadyList = list.notReadyAddresses
        return (
            <div key={index}>
                <div className="div-content-detail" >
                    <div className="div-content-detail-5">
                        <div className="avatar-xs">
                            <div className="avatar-title rounded-circle bg-light">
                                <img src={dockerimg} alt="" height="20" />
                            </div>
                        </div>
                    </div>
                    <div className="div-content-detail-4">
                        <div >
                            <div className="div-content-text-2">
                                이름
                            </div>
                            <div className="div-content-text-1">
                                {list.name}
                            </div>
                        </div>
                    </div>
                    <div className="div-content-detail-2">
                        <div>
                            <div className="div-content-text-2" >
                                status
                            </div>
                            <div className="div-content-text-1">
                                {list.ready}
                            </div>
                        </div>
                    </div>
                    <div className="div-content-detail-5">
                        <div>
                            <div className="div-content-text-2">
                                RestartCount
                            </div>
                            <div className="div-content-text-1">
                                {list.restartCount}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    })

    let volumemountscon = [];
    test.map((list888, key) => {
        volumemountscon = list888.map((item, index) => {
            let readonly = "readOnly"

            if (item.readonly = true) {
                item.readonly = readonly
            }
            return (
                <div key={index}>
                    <div className="div-content-detail">
                        <div className="div-content-detail-2">
                            <div>
                                <div className="div-content-text-1">
                                    {item.name}
                                </div>
                            </div>
                        </div>

                        <div className="div-content-detail-4">
                            <div>
                                <div className="div-content-text-1">
                                    {item.mountpath}
                                </div>
                            </div>
                        </div>
                        <div className="div-content-detail-3">
                            <div>
                                <div className="div-content-text-1">
                                    {item.readonly}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            )
        })
    })


    return (
        <React.Fragment>
            <hr />
            <div>
                <h5 className="font-size-14 mb-0" style={{ width: "100%" }}>  Container Info</h5>
            </div>
            <hr />
            <div>
                {containercontent}
            </div>
            <hr />
            <div>
                <h5 className="font-size-14 mb-0" style={{ width: "100%" }}> Storage Info</h5>
            </div>
            <hr />
            <div>
                {volumemountscon}
            </div>
        </React.Fragment >
    );
}