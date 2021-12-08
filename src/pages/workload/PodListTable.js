import React, { useEffect, useState } from 'react';
import { UncontrolledTooltip, Input, Label, Spinner } from "reactstrap";
import { Link } from "react-router-dom";
import store from "../../store/Monitor/store/Store"
import { observer } from "mobx-react";
import { MDBDataTable } from "mdbreact";
// import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

const PodListTable = observer((props) => {
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
            callApiStore.getFilterList("pods", callApiStore.workspaceFilter, null)
        }
        // DeploymentList = [];
    }, []);
    console.log(callApiStore.workspaceFilter)
    // if (callApiStore.workspaceFilterList.length > 0) {
    DataList = callApiStore.podFilterList
    check = callApiStore.dataCheck
    console.log(check, "check")
    const statusDiv = (test) => {
        if (test == "Running") {
            return <div className="badge badge-soft-success font-size-12">{test}</div>
        } else if (test == "Pending") {
            return <div className="badge badge-soft-warning font-size-12">{test}</div>
        } else {
            return <div className="badge badge-soft-danger font-size-12">{test}</div>
        }
    }


    const podIps = (test) => {
        let IP = ""
        // console.log(test)

        if (test == undefined) {
            return <div>-</div>
        } else {
            return <div className="text-dark font-weight-bold" style={{ whiteSpace: 'pre-line' }}>{test}</div>

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
            label: "상태",
            field: "status",
            sort: "asc",
            width: 135
        },
        {
            label: "HostIP",
            field: "hostIP",
            sort: "asc",
            width: 135
        },
        {
            label: "Pod IP",
            field: "podIp",
            sort: "asc",
            width: 135
        },

        {
            label: "클러스터",
            field: "clustername",
            sort: "asc",
            width: 135
        },

        {
            label: "생성 시간",
            field: "createTime",
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
    if (callApiStore.podFilterList != null) {
        rows = DataList.map(test => ({
            checkbox:
                <div className="custom-control custom-checkbox">
                    <Input type="checkbox" className="custom-control-input" id="ordercheck1" />
                    <Label className="custom-control-label" htmlFor="ordercheck1">&nbsp;</Label>
                </div>,
            name: <Link to={"/workload/pod/" + test.name + "?cluster=" + test.cluster + "&project=" + test.project + "&workspace=" + callApiStore.workspaceFilter} className="text-dark font-weight-bold" searchvalue={test.name} > {test.name}</Link >,
            hostIP: <Link to={test.link} className="text-dark font-weight-bold" style={{ whiteSpace: 'pre-line' }} searchvalue={test.hostIP} >{test.hostIP}</Link>,
            // podIp: <Link to={test.link} className="text-dark font-weight-bold" searchvalue={test.podIP} >{test.podIP}</Link>,
            podIp: podIps(test.podIP),

            ready: <Link to={test.link} className="text-dark font-weight-bold"  >{test.ready}</Link>,
            status: statusDiv(test.status),
            clustername: <Link to={test.link} className="text-dark font-weight-bold" searchvalue={test.cluster} >{test.cluster}</Link>,
            restart: <Link to={test.link} className="text-dark font-weight-bold"  >{test.restart}</Link>,
            createTime: <Link to={test.link} className="text-dark font-weight-bold" searchvalue={test.creationTimestamp} >{test.creationTimestamp}</Link>,
            action: <><Link to="#" className="mr-3 text-primary" id="edit1"><i className="mdi mdi-pencil font-size-18"></i></Link>
                <UncontrolledTooltip placement="top" target="edit1">

                    Edit
                </UncontrolledTooltip >
                <Link to="#" className="text-danger" id="delete1"><i className="mdi mdi-trash-can font-size-18"></i></Link>
                <UncontrolledTooltip placement="top" target="delete1">
                    Delete
                </UncontrolledTooltip >
            </>
        }
        ))
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
                <MDBDataTable responsive data={Tabledata}
                    searching={true}
                    sortRows={['name'], ['status'], ['clustername']} className="mt-4" />
            </div>
        )
    }
});

export default PodListTable