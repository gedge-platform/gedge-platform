import React, { useEffect, useState } from 'react';
import { UncontrolledTooltip, Input, Label } from "reactstrap";
import { Link } from "react-router-dom";
import store from "../../store/Monitor/store/Store"
import { observer } from "mobx-react";
import { MDBDataTable } from "mdbreact";
import LinearProgress from '@material-ui/core/LinearProgress';
const ProjectTable = observer((props) => {
    const { projectType = "" } = props
    const { callApiStore } = store;
    let ProjectList = [];
    let check = true
    let workspaceName = callApiStore.workspaceFilter
    console.log(workspaceName, "workspaceFilter")
    let clusterName = callApiStore.clusterFilter
    console.log(clusterName, "clusterFilter")

    useEffect(() => {
        if (projectType == "user") {
            callApiStore.getProjectWorkspaceFilterList("projects", callApiStore.workspaceFilter, projectType)
            ProjectList = callApiStore.workspaceFilterList
            // callApiStore.getFilterList("projects", workspaceName, "", projectType)
            // ProjectList = callApiStore.filterList
        } else if (projectType == "system") {
            callApiStore.getClusterFilterList("projects", callApiStore.clusterFilter, projectType)
            ProjectList = callApiStore.clusterFilterList
            // callApiStore.getFilterList("projects", clusterName, "", projectType)
            // ProjectList = callApiStore.filterList
        }

    }, []);
    // console.log(callApiStore.filterList, "callApiStore.filterList")
    // ProjectList = callApiStore.filterList
    if (projectType == "user" && callApiStore.workspaceFilterList.length > 0) {
        ProjectList = callApiStore.workspaceFilterList
        // ProjectList = ProjectList.filter((schema, index, self) => index === self.findIndex((obj) => (obj.projectName === schema.projectName)))
    } else if (projectType == "system" && callApiStore.clusterFilterList.length > 0) {
        console.log(projectType, "projectType")
        ProjectList = callApiStore.clusterFilterList
    }
    check = callApiStore.dataCheck
    console.log(ProjectList, "ProjectList")
    function workspaceTemp(projectName, workspaceName, projectType) {
        let workspaceTemp = "";
        if (projectType == "user") {
            workspaceTemp = <Link to={"/project/" + projectType + "/" + projectName + "?workspace=" + workspaceName} className="text-dark font-weight-bold" >{workspaceName}</Link>;
        } else if (projectType == "system") {
            workspaceTemp = <Link to={"/project/" + projectType + "/" + projectName + "?cluster=" + workspaceName} className="text-dark font-weight-bold" >SystemProject</Link>;
        }
        return workspaceTemp
    }
    function status(status) {
        if (status == "Active") {
            return (
                <div className="badge badge-soft-success font-size-12">{status}</div>
            )
        } else if (status == "Terminating") {
            return (

                <div className="badge badge-soft-warning font-size-12">{status}</div>
            )
        }
    }


    const rows = ProjectList.map(list => ({
        // const rows = apilistinfo.map((test, index) => ({
        checkbox:
            <div className="custom-control custom-checkbox">
                <Input type="checkbox" className="custom-control-input" id="ordercheck1" />
                <Label className="custom-control-label" htmlFor="ordercheck1">&nbsp;</Label>
            </div>,
        name: <Link to={"/project/" + projectType + "/" + list.projectName + "?workspace=" + list.workspaceName + "&cluster=" + list.selectCluster} className="text-dark font-weight-bold" searchvalue={list.projectName}>{list.projectName}</Link>,


        workspace: workspaceTemp(list.projectName, list.workspaceName, projectType),
        cluster: <Link to={"/project/" + projectType + "/" + list.projectName + "?workspace=" + list.workspaceName + "&cluster=" + list.selectCluster} className="text-dark font-weight-bold" searchvalue={list.selectCluster}> {list.selectCluster}</Link>,
        status: status(list.status),
        cpu: <div className="text-dark font-weight-bold">{list.resourceUsage.namespace_cpu}</div>,
        memory: <div className="text-dark font-weight-bold">{list.resourceUsage.namespace_memory}</div>,
        pods: <div className="text-dark font-weight-bold">{list.resourceUsage.namespace_pod_count}</div>,
        action: <><Link to="#" className="mr-3 text-primary" id="edit1"><i className="mdi mdi-pencil font-size-18"></i></Link>
            <UncontrolledTooltip placement="top" target="edit1">
                Edit
            </UncontrolledTooltip >
            <Link to="#" className="text-danger" id="delete1"><i className="mdi mdi-trash-can font-size-18"></i></Link>
            <UncontrolledTooltip placement="top" target="delete1">
                Delete
            </UncontrolledTooltip >
        </>
    }))

    const columns = [
        {
            label: <div className="custom-control custom-checkbox"> <Input type="checkbox" className="custom-control-input" id="ordercheck" /><Label className="custom-control-label" htmlFor="ordercheck">&nbsp;</Label></div>,
            field: "checkbox",
            sort: "asc",
            width: 28
        },
        {
            label: "이름",
            field: "name",
            sort: "asc",
            width: 78
        },
        {
            label: "상태",
            field: "status",
            sort: "asc",
            width: 93
        },
        {
            label: "워크스페이스",
            field: "workspace",
            sort: "asc",
            width: 109
        },
        {
            label: "클러스터 명",
            field: "cluster",
            sort: "asc",
            width: 109
        },
        {
            label: "CPU 사용량(core)",
            field: "cpu",
            sort: "asc",
            width: 100,
        },
        {
            label: "Memory 사용량(Gi)",
            field: "memory",
            sort: "asc",
            width: 100,
        },
        {
            label: "Pods 수(개)",
            field: "pods",
            sort: "asc",
            width: 150,
        },
        {
            label: "",
            field: "action",
            sort: "asc",
            width: 120
        },
    ]
    const Tabledata = { columns, rows };
    return (
        <div>
            <MDBDataTable responsive data={Tabledata} className="mt-4" />
        </div>
    )
});

//     if (check) {
//         return (
//             <div>
//                 <LinearProgress />
//             </div>
//         )
//     } else {
//         return (
//             <div>
//                 <MDBDataTable responsive data={Tabledata} className="mt-4" />
//             </div>
//         )
//     }
// });

export default ProjectTable