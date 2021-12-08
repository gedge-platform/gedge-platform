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
        callApiStore.filterList = []
        callApiStore.dataCheck = true
        callApiStore.workspaceFilter = "all"
        callApiStore.projectFilter = "all"
        callApiStore.getWorkspaceList("workspaces");
        callApiStore.getProjectList(callApiStore.workspaceFilter, null)
    }, []);
    workspaceList = callApiStore.workspaceList
    workspaceList.map(list => {
        option.push(list.workspaceName)
    })
    option.push("system")
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
                    callApiStore.getFilterList(params, callApiStore.workspaceFilter, null)
                    if (callApiStore.workspaceFilter == "all") {
                        callApiStore.getProjectList("all", null)
                    } else if (callApiStore.workspaceFilter == "system") {
                        callApiStore.getProjectList("all", "system")
                    } else {
                        callApiStore.getProjectList(callApiStore.workspaceFilter, "user")
                    }

                }}
            />
        </div>

    )


});


export default WorkspaceFilter
// normal usage
