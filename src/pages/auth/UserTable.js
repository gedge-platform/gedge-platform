import React, { useEffect, useState } from 'react';
import { UncontrolledTooltip, Input, Label } from "reactstrap";
import { Link } from "react-router-dom";
import store from "../../store/Monitor/store/Store"
import { observer } from "mobx-react";
import { MDBDataTable } from "mdbreact";
import { Axioscall } from '../../components/Common/api';
import LinearProgress from '@material-ui/core/LinearProgress';

const UserTable = observer((props) => {
    const { callApiStore } = store;

    useEffect(() => {
        // console.log(clusterType, "clusterType")
        callApiStore.getMemberList("members");
        // dbApiStore.getClusterList("clusters");
    }, []);

    let memberList = []
    if (callApiStore.memberList !== undefined) {
        memberList = callApiStore.memberList;

    }
    const rows = memberList.map(list => ({
        checkbox:
            <div className="custom-control custom-checkbox">
                <Input type="checkbox" className="custom-control-input" id="ordercheck1" />
                <Label className="custom-control-label" htmlFor="ordercheck1">&nbsp;</Label>
            </div>,
        id: <div className="text-dark font-weight-bold" searchvalue={list.memberId} >{list.memberId}</div>,
        name: <div className="text-dark font-weight-bold" searchvalue={list.memberName} >{list.memberName}</div>,
        email: <div className="text-dark font-weight-bold" searchvalue={list.memberEmail} >{list.memberEmail}</div>,
        contact: <div className="text-dark font-weight-bold" searchvalue={list.memberContact} >{list.memberContact}</div>,
        description: <div className="text-dark font-weight-bold" searchvalue={list.memberDescription} >{list.memberDescription}</div>,
        role: <div className="text-dark font-weight-bold" searchvalue={list.memberRole} >{list.memberRole}</div>,
        createAt: <div className="text-dark font-weight-bold" searchvalue={list.created_at} >{list.created_at}</div>,
        loginAt: <div className="text-dark font-weight-bold" searchvalue={list.logined_at} >{list.logined_at}</div>,

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
            label: "ID",
            field: "id",
            sort: "asc",
            width: 150,
        },
        {
            label: "이름",
            field: "name",
            sort: "asc",
            width: 150,
        },
        {
            label: "Email",
            field: "email",
            sort: "asc",
            width: 270,
        },
        {
            label: "Contact",
            field: "contact",
            sort: "asc",
            width: 200,
        },
        {
            label: "Description",
            field: "description",
            sort: "asc",
            width: 200,
        },
        {
            label: "역할",
            field: "role",
            sort: "asc",
            width: 100,
        },
        {
            label: "생성일",
            field: "createAt",
            sort: "asc",
            width: 100,
        },
        {
            label: "마지막 로그인",
            field: "loginAt",
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
            <MDBDataTable responsive data={Tabledata}searching={true} sorting={true}  className="mt-4" />
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

export default UserTable