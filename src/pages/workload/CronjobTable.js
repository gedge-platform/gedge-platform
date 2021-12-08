import React, { useEffect, useState } from 'react';
import { UncontrolledTooltip, Input, Label, Spinner } from "reactstrap";
import { Link } from "react-router-dom";
import store from "../../store/Monitor/store/Store"
import { observer } from "mobx-react";
import { MDBDataTable } from "mdbreact";
// import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';


const CronjobTable = observer((props) => {

    const { params = "" } = props;
    const { callApiStore } = store;
    let rows = ""
    let columns = []
    // const [isLoading, setLoading] = useState(true)
    let DataList = [];
    let check = true
    useEffect(() => {
        callApiStore.dataCheck = true
        // if (callApiStore.projectFilter == "all") {
        if (callApiStore.projectFilter == "all") {
            callApiStore.getFilterList("cronjobs", callApiStore.workspaceFilter, null)
        }
        // }
    }, []);
    console.log(callApiStore.workspaceFilter, callApiStore.projectFilter)
    DataList = callApiStore.cronjobFilterList
    check = callApiStore.dataCheck
    console.log(check, "check")
    function status(jobstatus) {
        let state = ""
        if (jobstatus == '1') {
            state = "succeeded"
        }
        return state
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
            label: "클러스터",
            field: "cluster",
            sort: "asc",
            width: 135
        },
        {
            label: "프로젝트",
            field: "project",
            sort: "asc",
            width: 78
        },
        {
            label: "스케쥴",
            field: "schedule",
            sort: "asc",
            width: 135
        },
        {
            label: "생성 시간",
            field: "creationTimestamp",
            sort: "asc",
            width: 48
        },
        {
            label: "완료 시간",
            field: "lastScheduleTime",
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
    if (callApiStore.cronjobFilterList != null) {
        rows = DataList.map(test => ({
            checkbox:
                <div className="custom-control custom-checkbox">
                    <Input type="checkbox" className="custom-control-input" id="ordercheck1" />
                    <Label className="custom-control-label" htmlFor="ordercheck1">&nbsp;</Label>
                </div>,
            name: <Link to={test.link} className="text-dark font-weight-bold" searchvalue={test.name} >{test.name}</Link>,
            cluster: <Link to={test.link} className="text-dark font-weight-bold" searchvalue={test.cluster} >{test.cluster}</Link>,
            project: <Link to={test.link} className="text-dark font-weight-bold" searchvalue={test.project} >{test.project}</Link>,

            // type: <Link to={test.link} className="text-dark font-weight-bold" searchvalue={test.type} >{test.type}</Link>,
            // clusterIP: <div className="text-dark font-weight-bold">{test.clusterIp}</div>,
            // port: setport(test.port),
            // externalIp: status(test.type, test.externalIp),
            schedule: <div className="text-dark font-weight-bold">{test.schedule}</div>,
            lastScheduleTime: <Link to={test.link} className="text-dark font-weight-bold" searchvalue={test.lastScheduleTime} >{test.lastScheduleTime}</Link>,
            creationTimestamp: <Link to={test.link} className="text-dark font-weight-bold" searchvalue={test.creationTimestamp} >{test.creationTimestamp}</Link>,
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

export default CronjobTable
