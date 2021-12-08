import React, { useEffect } from 'react';
import { UncontrolledTooltip, Input, Label, Table } from "reactstrap";
import { Link } from "react-router-dom";
import store from "../../store/Monitor/store/Store"
import { observer } from "mobx-react";
import { MDBDataTable } from "mdbreact";

const DeploymentDetail_detail = observer((props) => {
    const { params, projectType, query, workloadData } = props;
    const { callApiStore } = store;

    let clusters = ""
    const workload = workloadData
    useEffect(() => {
        // if (callApiStore.projectDetail != null) {
        //     project = callApiStore.projectDetail
        // }
    }, []);
    // console.log(project, "project")


    let clusterName = "-"
    let created_at = "-"
    let projectName = "-"
    let workspaceName = "-"
    let status = "-"
    let strategyTemp = []
    let strategy = []
    let strategyType = "-"
    let createAt = "-"
    let updateAt = "-"
    let temp = []
    if (workloadData != undefined) {
        clusterName = workload.cluster
        projectName = workload.project
        workspaceName = workload.workspace
        status = workload.status
        strategyTemp = workloadData.strategy
        if (strategyTemp.type == "Recreate") {
            strategy = strategyTemp.type
        } else if (strategyTemp.type == "RollingUpdate") {
            strategy = "maxUnavailable : " + strategyTemp.rollingUpdate.maxUnavailable + "\nmaxSurge : " + strategyTemp.rollingUpdate.maxSurge
        }

        createAt = workload.createAt
        updateAt = workload.updateAt
    }

    return (
        <>
            <thead >
                <tr >
                    <th >상세정보</th>
                </tr>
            </thead>
            <tbody style={{ width: "100%" }}>
                <tr>
                    <td>워크스페이스</td>
                    <td>
                        {workspaceName}
                    </td>
                </tr>
                <tr>
                    <td>클러스터</td>
                    <td>
                        {clusterName}
                    </td>
                </tr>
                <tr>
                    <td>프로젝트</td>
                    <td>
                        {projectName}
                    </td>
                </tr>
                <tr>
                    <td>상태</td>
                    <td style={{ whiteSpace: 'pre-line' }}>
                        {status}
                    </td>
                </tr>
                <tr>
                    <td>Strategy</td>
                    <td style={{ whiteSpace: 'pre-line' }}>
                        {strategy}
                    </td>
                </tr>
                <tr>
                    <td>
                        생성일
                    </td>
                    <td style={{ whiteSpace: 'pre-line' }}>
                        {createAt}
                    </td>
                </tr>
                <tr>
                    <td>
                        업데이트일
                    </td>
                    <td style={{ whiteSpace: 'pre-line' }}>
                        {updateAt}
                    </td>
                </tr>
            </tbody>
        </>
    )

});

export default DeploymentDetail_detail