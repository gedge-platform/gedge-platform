import { Dropdown, Selection } from 'react-dropdown-now';
import 'react-dropdown-now/style.css';
import React, { useEffect, useState } from 'react';
import { UncontrolledTooltip, Input, Label } from "reactstrap";
import { Link } from "react-router-dom";
import store from "../../store/Monitor/store/Store"
import { observer } from "mobx-react";
import { MDBDataTable } from "mdbreact";

const Projectbutton = observer((props) => {
    const { params, projectType, query } = props;

    useEffect(() => {

        // workloadDetailStore.getDetailNamespaceList("/namespaces/" + params.name);
        // dbApiStore.getDetailProject("projects/" + projectName[0]);
    }, []);
    let option = ["cluster1"]
    console.log(query)
    return (
        <div className="btn mb-2">
            <Dropdown
                // placeholder="Select an option"
                className="my-className"
                options={option}
                value="one"
                onChange={(value) => {
                    // workloadDetailStore.projectClusterName = value.value
                    console.log(value)
                }}
            />
        </div>
    )

});

export default Projectbutton
// normal usage
