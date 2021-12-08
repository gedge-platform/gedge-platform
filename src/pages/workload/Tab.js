import React, { useEffect, useState } from 'react';
import store from "../../store/Monitor/store/Store"
import { observer } from "mobx-react";
import classnames from 'classnames';
import { Nav, NavItem, NavLink } from "reactstrap";
import { Dropdown, Selection } from 'react-dropdown-now';
import 'react-dropdown-now/style.css';

const Tab = observer(() => {
    const { workloadStore } = store
    const { dbApiStore } = store;
    const [activeTab, setactiveTab] = useState('0')

    useEffect(() => {
        // dbApiStore.getClusterList("clusters")
        dbApiStore.getWorkspaceList("workspaces");

    }, []);
    let data2 = [];
    let workspaceList = [];
    let podlisttest = [];
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
        data2.splice()
        console.log(data2)
    })
    // workspaceList.map(test => {
    // workspaceList.forEach((listtest) => {
    //     console.log(p)
    //     podlisttest.push({
    //         name: listtest.id,
    //         namespace: listtest.workspaceName,

    //     })
    //     console.log(podlisttest)
    // })
    console.log(data2)
    const toggleTab = ((tab) => {
        if (activeTab !== tab) {
            console.log(activeTab, "active")
            setactiveTab({
                activeTab: tab
            });

        }

    })

    return (
        // <div>
        //     <Nav tabs className="nav-tabs-custom mb-4">
        //         {data2.map((test) =>
        //             <NavItem>
        //                 <NavLink onClick={() => { toggleTab({ test }); }} className={classnames({ active: setactiveTab.activeTab === { test } }, "font-weight-bold p-3")}>{test}</NavLink>
        //             </NavItem>
        //         )}
        //         {/* <NavItem>
        //             <NavLink onClick={() => { toggleTab('4'); }} className={classnames({ active: setactiveTab.activeTab === '4' }, "p-3 font-weight-bold")}>workspace1</NavLink>
        //         </NavItem>
        //         <NavItem>
        //             <NavLink onClick={() => { toggleTab('5'); }} className={classnames({ active: setactiveTab.activeTab === '5' }, " p-3 font-weight-bold")}>workspace2</NavLink>
        //         </NavItem> */}
        //     </Nav>
        // </div>
        <Dropdown
            placeholder="Select WorkSpace"
            className="my-className"
            options={data2}
            value="one"
            onChange={(value) => {

                workloadStore.temp2 = value.value
                console.log(value.value)
                // workloadStore.temp1 == value.value
                // podlist = workloadStore.podList;
                // workloadStore.podList = podlist.filter(namespace => namespace.metadata.namespace == value.value)

                // console.log(podlist)
                // workloadDetailStore.podList = namespacelist
            }}
        />

    )

})
export default Tab