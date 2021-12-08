import React, { Component, useEffect } from "react";
import { observer } from "mobx-react";
import store from "../../store/Monitor/store/Store"
import img1 from "../../assets/images/companies/img-1.png";
import { Row, Col, Card, CardBody, CardText, Container, Table } from "reactstrap";

const EdgeDetailInfo = observer((props) => {
    const { clusterMasterData = [] } = props
    const { clusterStore } = store;


    useEffect(() => {
        return () => {
        };
    }, []);

    let ipAddr = ""
    let clusterEndpoint = ""
    let clusterCreator = ""
    let gpu = ""
    let kubeVersion = ""
    let status = ""
    let network = ""
    let os = ""
    let kernel = ""
    let created_at = ""

    if (clusterMasterData.length != 0) {
        ipAddr = clusterMasterData[0].ipAddr
        clusterEndpoint = clusterMasterData[0].clusterEndpoint
        clusterCreator = clusterMasterData[0].clusterCreator
        gpu = clusterMasterData[0].gpu
        kubeVersion = clusterMasterData[0].kubeVersion
        status = clusterMasterData[0].stauts
        network = clusterMasterData[0].network
        os = clusterMasterData[0].os
        kernel = clusterMasterData[0].kernel
        created_at = clusterMasterData[0].created_at
    }

    return (
        <React.Fragment>

            <Table responsive className="mb-0">
                <thead>
                    <tr>
                        {/* 상세정보 */}
                        <th style={{ width: "50%" }}>상세정보</th>
                        <th style={{ width: "50%" }}>내용</th>
                        {/* <th>Examples</th> */}
                    </tr>
                </thead>
                <tbody>
                    {/* {apitoData.map((test) => (
                             <tr key={test.name}>
                               <td>kubeProxyVersion</td>
                              <td>{test.kubeProxyVersion}</td>
                             </tr>
                           ))}
                           {apitoData.map(({ machineID, kernelVersion, osImage }) => (
                             <tr >
                               <td>상태</td>
                               <td>{osImage}</td>
                             </tr>
                           ))} */}
                    <tr>
                        <td>Status</td>
                        <td>{status}</td>
                    </tr>
                    <tr>
                        <td>IP</td>
                        <td>{clusterEndpoint}</td>
                    </tr>
                    <tr>
                        <td>Creator</td>
                        <td>{clusterCreator}</td>
                    </tr>

                    <tr>
                        <td>Os</td>
                        <td>{os}</td>
                    </tr>

                    <tr>
                        <td>Gpu </td>
                        <td>GPU_List</td>
                    </tr>
                    <tr>
                        <td>KubeVersion</td>
                        <td>{kubeVersion}</td>
                    </tr>
                    <tr>
                        <td>Network </td>
                        <td>{network}</td>
                    </tr>
                    <tr>
                        <td>Kernel </td>
                        <td>{kernel}</td>
                    </tr>
                    <tr>
                        <td>Created</td>
                        <td>{created_at}</td>
                    </tr>
                </tbody>

            </Table>

        </React.Fragment >
    )

})

export default EdgeDetailInfo;