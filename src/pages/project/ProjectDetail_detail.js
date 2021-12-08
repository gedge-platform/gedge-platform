import React, { useEffect } from 'react';
import { UncontrolledTooltip, Input, Label, Table } from "reactstrap";
import { Link } from "react-router-dom";
import store from "../../store/Monitor/store/Store"
import { observer } from "mobx-react";
import { MDBDataTable } from "mdbreact";

const ProjectDetail_detail = observer((props) => {
    const { params, projectType, query, projectData } = props;
    const { callApiStore } = store;

    let clusters = ""
    const project = projectData
    useEffect(() => {
        // if (callApiStore.projectDetail != null) {
        //     project = callApiStore.projectDetail
        // }
    }, []);
    // console.log(project, "project")
    let clusterName = "-"
    let created_at = "-"
    let projectCreator = "-"
    let projectDescription = "-"
    let projectName = "-"
    let projectOwner = "-"
    let selectCluster = "-"
    let status = "-"
    let workspaceName = "-"
    if (project.length > 1) {
        // console.log("mulit")
        clusterName = project[0].selectCluster
        projectCreator = project[0].projectCreator
        created_at = project[0].created_at
        projectCreator = project[0].projectCreator
        projectDescription = project[0].projectDescription
        projectName = project[0].projectName
        projectOwner = project[0].projectOwner
        // selectCluster = project[0].projectCreator
        status = project[0].status
        workspaceName = project[0].workspaceName
    } else {
        clusterName = project.selectCluster
        if (project.workspaceName == "system") {
            projectCreator = "-"
            projectDescription = "-"
            projectOwner = "-"
        } else {
            projectCreator = project.projectCreator
            projectDescription = project.projectDescription

            projectOwner = project.projectOwner
        }
        projectName = project.projectName
        created_at = project.created_at
        // selectCluster = project[0].projectCreator
        status = project.status
        workspaceName = project.workspaceName
    }

    return (
        <Table responsive className="mb-0">
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
                    <td>상태</td>
                    <td style={{ whiteSpace: 'pre-line' }}>
                        {status}
                    </td>
                </tr>
                <tr>
                    <td>projectDescription</td>

                    <td>
                        {projectDescription}
                    </td>
                </tr>
                <tr>
                    <td>projectCreator</td>
                    <td>
                        {projectCreator}
                    </td>
                </tr>
                <tr>
                    <td>projectOwner</td>
                    <td>
                        {projectOwner}
                    </td>
                </tr>
                <tr>
                    <td>
                        생성일
                    </td>
                    <td style={{ whiteSpace: 'pre-line' }}>
                        {created_at}
                    </td>
                </tr>
            </tbody>
        </Table >
    )

});

export default ProjectDetail_detail