import React, { useEffect, useState } from 'react';
import { UncontrolledTooltip, Input, Label, Spinner } from "reactstrap";
import { Link } from "react-router-dom";
import store from "../../store/Monitor/store/Store"
import { observer } from "mobx-react";
import { MDBDataTable } from "mdbreact";
// import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';


const DeploymentTable = observer((props) => {
    const { params = "" } = props;
    const { callApiStore } = store;
    let rows = ""
    let columns = []
    // const [isLoading, setLoading] = useState(true)
    let DataList = [];
    let check = true
    useEffect(() => {
        callApiStore.dataCheck = true
        if (callApiStore.projectFilter == "all") {
            callApiStore.getFilterList("deployments", callApiStore.workspaceFilter, null)

        }
        // DeploymentList = [];

    }, []);
    // if (callApiStore.workspaceFilterList.length > 0) {
    DataList = callApiStore.deploymentFilterList
    check = callApiStore.dataCheck
    console.log(check, "check")
    function status(deploystatus) {
        if (deploystatus == "True") {
            return (
                <div className="badge badge-soft-success font-size-12">Active</div>
            )
        } else {
            return (

                <div className="badge badge-soft-warning font-size-12">Fail</div>
            )
        }
    }
    function setReplica(replica) {
        let data = 0
        // console.log(replica, replica)
        if (replica != undefined) {
            data = replica
            return data
        } else {
            return data
        }
    }
    columns = [
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
            label: "READY",
            field: "ready",
            sort: "asc",
            width: 135
        },
        {
            label: "클러스터",
            field: "cluster",
            sort: "asc",
            width: 135
        },
        {
            label: "AVAILABLE",
            field: "available",
            sort: "asc",
            width: 135
        },
        {
            label: "상태",
            field: "status",
            sort: "asc",
            width: 135
        },
        {
            label: "업데이트 시간",
            field: "updateTime",
            sort: "asc",
            width: 48
        },
        {
            label: "Action",
            field: "action",
            sort: "asc",
            width: 120
        },

    ]

    if (callApiStore.deploymentFilterList != null) {
        rows = DataList.map(test => ({
            checkbox:
                <div className="custom-control custom-checkbox">
                    <Input type="checkbox" className="custom-control-input" id="ordercheck1" />
                    <Label className="custom-control-label" htmlFor="ordercheck1">&nbsp;</Label>
                </div>,
            name: <Link to={"/workload/deployment/" + test.name + "?workspace=" + test.workspace + "&project=" + test.project + "&cluster=" + test.cluster} className="text-dark font-weight-bold" searchvalue={test.name} >{test.name}</Link>,
            cluster: <Link to={test.link} className="text-dark font-weight-bold" searchvalue={test.cluster} >{test.cluster}</Link>,
            ready: <div className="text-dark font-weight-bold">{setReplica(test.replica.readyReplicas) + " / " + setReplica(test.replica.replicas)}</div>,
            available: <div className="text-dark font-weight-bold">{setReplica(test.replica.availableReplicas)}</div>,
            status: status(test.status),
            updateTime: <Link to={test.link} className="text-dark font-weight-bold" searchvalue={test.updateAt} >{test.updateAt}</Link>,
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
    }
    const Tabledata = { columns, rows };

    if (check) {
        return (
            <div>
                <LinearProgress />
            </div>
        )
    } else {
        return (
            <div>
                <MDBDataTable responsive data={Tabledata} className="mt-4" />
            </div>
        )
    }
});

export default DeploymentTable
