import React, { useEffect } from 'react';
import { UncontrolledTooltip, Input, Label } from "reactstrap";
import { Link } from "react-router-dom";
import store from "../../store/Monitor/store/Store"
import { observer } from "mobx-react";
import { MDBDataTable } from "mdbreact";
import LinearProgress from '@material-ui/core/LinearProgress';
const WorkspaceTable = observer((props) => {
    // const { projectType } = props;
    const { callApiStore } = store;
    let check = true
    let workspaceList = []

    useEffect(() => {
        console.log("렌더링됨")
        callApiStore.getWorkspaceList("workspaces");
        const err= callApiStore.postWorkspaceMessage
    }, []);
    if (callApiStore.workspaceList !== undefined) {
        workspaceList = callApiStore.workspaceList;
    }
    // console.log("렌더링됨")
    console.log(workspaceList)
console.log(callApiStore.postWorkspaceMessage, "workspace err")
    check = callApiStore.dataCheck
    const rows = workspaceList.map(test => ({
        // const rows = apilistinfo.map((test, index) => ({
        checkbox:
            <div className="custom-control custom-checkbox">
                <Input type="checkbox" className="custom-control-input" id="ordercheck1" />
                <Label className="custom-control-label" htmlFor="ordercheck1">&nbsp;</Label>
            </div>,
        name: <Link to="#" className="text-dark font-weight-bold" searchvalue={test.workspaceName}>{test.workspaceName}</Link>,
        description: <Link to="#" className="text-dark font-weight-bold" searchvalue={test.workspaceDescription}> {test.workspaceDescription}</Link>,
        cluster: <div className="text-dark font-weight-bold">{test.selectCluster}</div>,
        owner: <div className="text-dark font-weight-bold">{test.workspaceOwner}</div>,
        creator: <div className="text-dark font-weight-bold">{test.workspaceCreator}</div>,
        createTime: <div className="text-dark font-weight-bold">{test.created_at}</div>,

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
            width: 28
        },
        {
            label: "이름",
            field: "name",
            sort: "asc",
            width: 78
        },
        {
            label: "설명",
            field: "description",
            sort: "asc",
            width: 93
        },
        {
            label: "클러스터",
            field: "cluster",
            sort: "asc",
            width: 109
        },
        {
            label: "OWNER",
            field: "owner",
            sort: "asc",
            width: 109
        },
        {
            label: "CREATOR",
            field: "creator",
            sort: "asc",
            width: 48
        },
        {
            label: "생성 시간",
            field: "createTime",
            sort: "asc",
            width: 135
        },
        {
            label: "",
            field: "action",
            sort: "asc",
            width: 120
        },
    ]
    const Tabledata = { columns, rows };

    return (
        <div>
            <MDBDataTable responsive data={Tabledata} searching={true} sorting={true} className="mt-4" />
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
export default WorkspaceTable