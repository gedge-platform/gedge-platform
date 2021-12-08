import React, { useEffect, useState } from 'react';
// import { UncontrolledTooltip, Input, Label, Dropdown, DropdownMenu, DropdownItem, DropdownToggle, FormGroup } from "reactstrap";
import { Link } from "react-router-dom";
import store from "../../store/Monitor/store/Store"
import { observer } from "mobx-react";
import { MDBDataTable } from "mdbreact";
import Select from 'react-select'
import 'react-dropdown-now/style.css';
import { Dropdown, Selection } from 'react-dropdown-now';
// import worklaodDetailStore from '../../store/Monitor/store/WorkloadDetailStore';
const Project = observer((props) => {
    // const { workloadStore } = store;
    // const { dbApiStore } = store;
    // const { workloadDetailStore } = store;
    // const [selectedValue, setSelectedValue,] = useState('');
    // // const { projectType } = "user"
    // const handleChange = e => {
    //     setSelectedValue(e.value);
    //     props.onChange(e.value)
    //     console.log(e.value)
    // }
    // let workspaceName = []
    // let projectName = []
    // let namespacelist = []
    // let temp = []
    // let data2 = []
    // let clusterpodlist = []
    // let projectlist = []
    // let userworkspace = []
    // let workspaceList = []
    // let option = []
    // let userNamespace = []
    // useEffect(() => {
    //     workloadStore.getNamespaceListV2("projects")
    //     dbApiStore.getProjectList("projects")
    //     // workloadDetailStore.getNamespaceList("namespaces");
    //     // console.log(workloadDetailStore.getNamespaceList("namespaces"))
    //     dbApiStore.getWorkspaceList("workspaces");

    // }, []);
    // userNamespace = workloadStore.namespaceList
    // console.log(userNamespace)
    // userworkspace = dbApiStore.workspaceList
    // console.log(userworkspace, "userworkspace")
    // projectlist = dbApiStore.projectList
    // console.log(projectlist, "proejdctlsti")
    // projectlist.map(test => {
    //     console.log(test.projectName)
    //     console.log(test.workspaceName)

    //     // workspaceName.push({ pn: test.projectName, wn: test.workspaceName })
    //     workspaceName.push(test.projectName)
    //     projectName.push(test.workspaceName)
    //     console.log(workspaceName)
    //     console.log(projectName)
    //     if (workloadStore.temp1 == workspaceName) {
    //         console.log("equal")
    //     }
    // })


    // if (dbApiStore.projectList !== undefined) {
    //     workspaceList = dbApiStore.workspaceList;
    // }
    // workspaceList = dbApiStore.workspaceList
    // console.log(workspaceList, "workspacelist")
    // workspaceList.map(test => {
    //     console.log(test.workspaceName, "namelist")
    //     data2.push(test.workspaceName)
    //     // data2.push(test.selectCluster)
    //     console.log(data2)
    // })
    // console.log(data2)

    // if (workloadStore.temp1 == projectlist.workspaceName) {
    //     console.log("equal")
    // }
    // clusterpodlist = workloadStore.podList;
    // console.log(clusterpodlist, "pods")
    // // podlist = clusterpodlist.map(((list, key) => {
    // //     list.forEach((listtest) => {
    // //         podlisttest.push({
    // //             name: listtest.metadata.name,
    // //             namespace: listtest.metadata.namespace,

    // //         })


    // //     })
    // //     data2 = podlisttest
    // //     console.log(data2, "project-podlist")
    // // }))


    // if (workloadDetailStore.namespaceList !== undefined) {
    //     namespacelist = workloadDetailStore.namespaceList;
    //     temp = namespacelist;
    // }
    // console.log(namespacelist, "namespacelist")
    // console.log(temp, "namspace temp")

    // // namespacelist.map(list => {
    // //     test.push({ value: list.metadata.name, label: list.metadata.name })

    // // })
    // // namespacelist.map(list => {
    // //     test.push(list.metadata.name)

    // // })
    // // data1 = test
    // // console.log(data1, "data")
    // // console.log(data1.namespace)
    // option = ["All Namespace"]
    // namespacelist = workloadDetailStore.namespaceList
    // console.log(namespacelist, "name")
    // temp.map((name, key) => {
    //     console.log(name, "temp.name")
    //     option.push(name.metadata.name)
    //     console.log(option)
    // })
    // console.log(workloadStore.temp2)
    return (
        // <div className="btn  mb-2">
        //     <Dropdown
        //         placeholder="Select Workspace"
        //         className="my-className"
        //         options={data2}
        //         value="one"
        //         onChange={(value) => {

        //             workloadStore.temp1 = value.value
        //             console.log(value.value)
        //             // workloadStore.temp1 == value.value
        //             // podlist = workloadStore.podList;
        //             // workloadStore.podList = podlist.filter(namespace => namespace.metadata.namespace == value.value)

        //             // console.log(podlist)
        //             // workloadDetailStore.podList = namespacelist
        //         }}
        //     />

        //     <Dropdown
        //         placeholder="Select Namespace"
        //         className="my-className"
        //         options={workspaceName}
        //         value="one"
        //         onChange={(value) => {

        //             workloadStore.temp2 = value.value
        //             console.log(value.value)
        //             // workloadStore.temp1 == value.value
        //             // podlist = workloadStore.podList;
        //             // workloadStore.podList = podlist.filter(namespace => namespace.metadata.namespace == value.value)

        //             // console.log(podlist)
        //             // workloadDetailStore.podList = namespacelist
        //         }}
        //     />
        // </div>
        <div></div>
    )

})

export default Project

