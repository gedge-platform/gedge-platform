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
        callApiStore.filterList = []
        callApiStore.dataCheck = true
    }, []);
    if (callApiStore.projectFilterList != null) {
        workspacefilters = callApiStore.projectFilterList
        projectList = workspacefilters.filter((schema, index, self) => index === self.findIndex((obj) => (obj.projectName === schema.projectName)))
        projectList.map(list => {

            option.push(list.projectName)
        })
    }

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
                    callApiStore.getFilterList(params, callApiStore.workspaceFilter, callApiStore.projectFilter)
                }}
            />
        </div>
    )
});



export default ProjectFilter
// normal usage
