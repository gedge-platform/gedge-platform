
import React, { useEffect, useState } from 'react';
import { Nav, NavItem, NavLink, UncontrolledTooltip, Input, Label } from "reactstrap";
import classnames from 'classnames';
import store from "../../store/Monitor/store/Store"
import { observer } from "mobx-react";
import { MDBDataTable } from "mdbreact";

import 'react-dropdown-now/style.css';
import { Dropdown, Selection } from 'react-dropdown-now';

const JobFilter = observer(() => {
    const { workloadStore } = store
    const { dbApiStore } = store;
    // const [activeTab, setactiveTab] = useState('1');
    useEffect(() => {

        dbApiStore.getWorkspaceList("workspaces");
        dbApiStore.getClusterList("clusters");

    }, []);
    // const toggleTab = (tab) => {
    //     if (activeTab !== tab) {
    //         setactiveTab({
    //             activeTab: tab,
    //         });

    //     }

    // }
    let data2 = [];
    let workspaceList = [];
    let clusterList = [];
    let data3 = [];
    if (dbApiStore.clusterList !== undefined) {
        clusterList = dbApiStore.clusterList;
    }


    if (dbApiStore.projectList !== undefined) {
        workspaceList = dbApiStore.workspaceList;
    }

    workspaceList = dbApiStore.workspaceList
    console.log(workspaceList, "workspacelist")
    data2 = ["All Workspace"]
    workspaceList.map(test => {
        console.log(test.workspaceName, "namelist")
        data2.push(test.workspaceName)
        console.log(data2)
    })
    clusterList = dbApiStore.clusterList
    console.log(clusterList, "clusterlist")
    data3 = ["All Cluster"]

    clusterList.map(test => {
        console.log(test.clusterName, "clusternamelist")
        data3.push(test.clusterName)
        console.log(data3)
    })
    // console.log(activeTab, "ghkfehdwnddls active")
    // workloadStore.jobtab = activeTab
    // console.log(workloadStore.jobtab)
    return (
        <div className="btn  mb-2">
            {/* <Nav pills className="pricing-nav-tabs">
                <NavItem>
                    <NavLink className={classnames({ active: setactiveTab === '1' })} onClick={() => { setactiveTab('1'); }}>
                        <NavLink className={classnames({ active: this.state.activeTab === '1' })} onClick={() => { this.toggleTab('1'); }}>
                        잡
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink className={classnames({ active: setactiveTab === '2' })} onClick={() => { setactiveTab('2'); }}>
                        크론잡
                    </NavLink>
                </NavItem>
            </Nav> */}
            <Dropdown
                placeholder="Select Workspace"
                className="my-className"
                options={data3}
                value="one"
                onChange={(value) => {

                    workloadStore.temp3 = value.value
                    console.log(value.value)
                    // workloadStore.temp1 == value.value
                    // podlist = workloadStore.podList;
                    // workloadStore.podList = podlist.filter(namespace => namespace.metadata.namespace == value.value)

                    // console.log(podlist)
                    // workloadDetailStore.podList = namespacelist
                }}
            />
        </div>
    )


})
export default JobFilter