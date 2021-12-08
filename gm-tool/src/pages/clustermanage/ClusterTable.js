import React, { useEffect, useState } from 'react';
import { UncontrolledTooltip, Input, Label } from "reactstrap";
import { Link } from "react-router-dom";
import store from "../../store/Monitor/store/Store"
import { observer } from "mobx-react";
import { MDBDataTable } from "mdbreact";
import { Axioscall } from '../../components/Common/api';
import LinearProgress from '@material-ui/core/LinearProgress';

const ClusterTable = observer((props) => {
    const { clusterType } = props;
    const { callApiStore } = store;
    let clusterlist = []
    let check = true
    useEffect(() => {
        // console.log(clusterType, "clusterType")
        callApiStore.getClusterList("clusters", clusterType);
        // dbApiStore.getClusterList("clusters");
    }, []);


    if (callApiStore.clusterList !== undefined) {
        clusterlist = callApiStore.clusterList;

    }
    console.log(clusterlist, "clusterlist")
    check = callApiStore.dataCheck
    const rows = clusterlist.map(list => ({
        checkbox:
            <div className="custom-control custom-checkbox">
                <Input type="checkbox" className="custom-control-input" id="ordercheck1" />
                <Label className="custom-control-label" htmlFor="ordercheck1">&nbsp;</Label>
            </div>,
        name: <Link to={"/cluster/" + clusterType + "/" + list.clusterName} className="text-dark font-weight-bold" searchvalue={list.clusterName} >{list.clusterName}</Link>,
        status: <div className="badge badge-soft-success font-size-12">{list.status}</div>,
        // gpu: <div className="badge badge-soft-success font-size-12">{list.gpu}</div>,
        cpu: <Link to={"/cluster/" + clusterType + "/" + list.clusterName} className="text-dark font-weight-bold" searchvalue={list.resourceUsage.cpu_usage} >{list.resourceUsage.cpu_usage}</Link>,
        memory: <Link to={"/cluster/" + clusterType + "/" + list.clusterName} className="text-dark font-weight-bold" searchvalue={list.resourceUsage.cpu_usage} >{list.resourceUsage.memory_usage}</Link>,
        pods: <Link to={" /cluster/ " + clusterType + " /" + list.clusterName} className="text-dark font-weight-bold" searchvalue={list.resourceUsage.cpu_usage} >{list.resourceUsage.pod_running}</Link>,

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
            width: 28,
        },
        {
            label: "이름",
            field: "name",
            sort: "asc",
            width: 150,
        },
        {
            label: "상태",
            field: "status",
            sort: "asc",
            width: 270,
        },
        {
            label: "GPU",
            field: "gpu",
            sort: "asc",
            width: 200,
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
            width: 120,
        },
    ];

    const Tabledata = { columns, rows };

    return (
        <div>
            <MDBDataTable responsive data={Tabledata} searching={true} sorting={true}  className="mt-4" />
        </div>
    )
    // if (check) {
    //     return (
    //         <div>
    //             <LinearProgress />
    //         </div>
    //     )
    // } else {
    //     return (
    //         <div>
    //             <MDBDataTable responsive data={Tabledata} className="mt-4" />
    //         </div>
    //     )
    // }
});

export default ClusterTable