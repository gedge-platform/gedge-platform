import { Dropdown, Selection } from 'react-dropdown-now';
import 'react-dropdown-now/style.css';
import React, { useEffect, useState } from 'react';
import { UncontrolledTooltip, Input, Label } from "reactstrap";
import { Link } from "react-router-dom";
import store from "../../store/Monitor/store/Store"
import { observer } from "mobx-react";
import { MDBDataTable } from "mdbreact";

const WorkspaceFilter = observer((props) => {
    const { params = "", projectType = "" } = props
    const { callApiStore } = store;
    let workspaceList = [];

    let option = ["all"];

    useEffect(() => {
        callApiStore.workspaceFilter = "all"
        callApiStore.getWorkspaceList("workspaces");
    }, []);
    workspaceList = callApiStore.workspaceList
    workspaceList.map(list => {
        option.push(list.workspaceName)
    })

    return (
        <div className="btn  mb-2">
            <Dropdown
                placeholder="Select an workspace"
                className="my-className"
                options={option}
                value="one"
                // onOpen={}
                onChange={(value) => {
                    callApiStore.workspaceFilter = ""
                    callApiStore.workspaceFilter = value.value
                    callApiStore.getProjectWorkspaceFilterList(params, callApiStore.workspaceFilter, projectType)

                }}
            />
        </div>

    )


});
// if (projectType == "system" && dbApiStore.clusterList !== undefined) {
//     // console.log("=================================================================system")
//     option = ["All clusters"]
//     clusterlist = dbApiStore.clusterList;
//     clusterlist.map((name, key) => {
//         option.push(name.clusterName)
//     })


// }
// if (projectType == "user" && dbApiStore.workspaceList !== undefined) {
//     // console.log("=================================================================user")
//     option = ["All workspaces"]
//     workspacelist = dbApiStore.workspaceList;
//     workspacelist.map((name, key) => {
//         option.push(name.workspaceName)
//     })
//     return (
//         <div className="btn  mb-2">
//             <Dropdown
//                 placeholder="Select an option"
//                 className="my-className"
//                 options={option}
//                 value="one"
//                 onChange={(value) => {
//                     namespacelist = workloadDetailStore.namespaceList;
//                     if (value.value !== "All workspaces") {
//                         workloadDetailStore.userProjectList = namespacelist.filter(namespace => namespace.workspaceName == value.value)
//                         // workloadDetailStore.projectList = namespacelist.filter(namespace => namespace.workspace == value.value)
//                     } else {
//                         workloadDetailStore.userProjectList = namespacelist
//                     }
//                 }}
//             />
//         </div>
//     )
// }
// console.log(namespacelist, "namespacelist")




export default WorkspaceFilter
// normal usage
