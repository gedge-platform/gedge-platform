import React from "react";
import { Table } from "reactstrap";
//Import Breadcrumb

export default function ServiceDetail_detail(props) {
    console.log(props)

    let name = props.workloadData.name
    let workspace = props.workloadData.workspace
    let cluster = props.workloadData.cluster
    let project = props.workloadData.project
    let type = props.workloadData.type
    let clusterIp = props.workloadData.clusterIp
    let sessionAffinity = props.workloadData.sessionAffinity
    let createAt = props.workloadData.createAt
    let updateAt = props.workloadData.updateAt
    let externalIP = props.workloadData.externalIp

    return (

        <tbody>
            <tr>
                <td>프로젝트</td>
                <td>
                    {project}
                </td>
            </tr>
            <tr>
                <td>App</td>
                <td>
                    수정필요
                </td>
            </tr>

            <tr>
                <td>클러스터 IP</td>
                <td>
                    {clusterIp}
                </td>
            </tr>
            <tr>
                <td>External IP</td>
                <td>
                    {externalIP}
                </td>
            </tr>
            <tr>
                <td>Session Affinity</td>
                <td>
                    {sessionAffinity}
                </td>
            </tr>
            <tr>
                <td>Type</td>
                <td>
                    {type}
                </td>
            </tr>
            <tr>
                <td>
                    생성일
                </td>
                <td>
                    {createAt}
                </td>
            </tr>
            <tr>
                <td>
                    업데이트일
                </td>
                <td>
                    {updateAt}
                </td>
            </tr>
        </tbody>


    )
}
