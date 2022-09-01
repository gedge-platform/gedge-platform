import { Dropdown, Selection } from 'react-dropdown-now';
import 'react-dropdown-now/style.css';
import React, { useEffect, useState } from 'react';
import { UncontrolledTooltip, Input, Label } from "reactstrap";
import { Link } from "react-router-dom";
import store from "../../store/Monitor/store/Store"
import { observer } from "mobx-react";
import { MDBDataTable } from "mdbreact";

const ProjectFilter = observer((props) => {
    const { params = "", projectType = "" } = props
    const { callApiStore } = store;
    let workspacefilters = [];
    let projectList = [];
    let option = ["all"];

    useEffect(() => {
        // console.log(callApiStore.workspaceFilter, "workspaceFilter")

        // callApiStore.getProjectList("projects");

        // console.log(callApiStore.workspaceFilter)
        // callApiStore.getWorkspaceFilterList("projects");
    }, []);
    if (callApiStore.workspaceFilterList.length > 0) {
        workspacefilters = callApiStore.workspaceFilterList
        projectList = workspacefilters.filter((schema, index, self) => index === self.findIndex((obj) => (obj.project === schema.project)))
        projectList.map(list => {
            option.push(list.project)
        })
    }
    // workspacefilters = callApiStore.workspaceFilterList
    // projectList = workspacefilters.filter((schema, index, self) => index === self.findIndex((obj) => (obj.project === schema.project)))
    // projectList.map(list => {
    // option.push(list.project)
    // })

    return (
        <div className="btn  mb-2">
            <Dropdown
                placeholder="Select a Project"
                className="my-className"
                options={option}
                value="one"
                onChange={(value) => {
                    console.log("value", value.value)
                    callApiStore.projectFilter = value.value
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




export default ProjectFilter
// normal usage