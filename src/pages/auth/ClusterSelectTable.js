import React, { useEffect, useState } from 'react';
import { UncontrolledTooltip, Input, Label, Spinner } from "reactstrap";
import { Link } from "react-router-dom";
import store from "../../store/Monitor/store/Store"
import { observer } from "mobx-react";
import { MDBDataTable } from "mdbreact";
// import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

const ClusterSelectTable = observer((props) => {
    const { EdgeList, CoreList } = props;
    const { callApiStore } = store;
    // let rows_core = ""
    // let rows_edge = ""

    useEffect(() => {

    }, []);

    const [checkedInputs, setCheckedInputs] = useState([]);

    const core_columns = [
        {
            label: <div className="custom-control custom-checkbox"> <Input type="checkbox" className="custom-control-input" id="ordercheck" /><Label className="custom-control-label" htmlFor="ordercheck"></Label></div>,
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
            label: "EndPoint",
            field: "endpoint",
            sort: "asc",
            width: 135
        },
        {
            label: "OS",
            field: "os",
            sort: "asc",
            width: 135
        },
        {
            label: "커널",
            field: "kernel",
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
            label: "쿠버네티스 버전",
            field: "kubeVersion",
            sort: "asc",
            width: 48
        },
    ]

    const edge_columns = [
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
            label: "EndPoint",
            field: "endpoint",
            sort: "asc",
            width: 135
        },
        {
            label: "OS",
            field: "os",
            sort: "asc",
            width: 135
        },
        {
            label: "커널",
            field: "kernel",
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
            label: "쿠버네티스 버전",
            field: "kubeVersion",
            sort: "asc",
            width: 48
        },
    ]

    const changeHandler = (checked, clusterName) => {
        // console.log(checked, id)
        if (checked) {
            setCheckedInputs([...checkedInputs, clusterName])
        }
        else {
            setCheckedInputs(checkedInputs.filter(list => list !== clusterName))
        }
    };

    let rows_core = CoreList.map((test, key) => ({
        checkbox:
            <div className="custom-control custom-checkbox">
                <Input type="checkbox" className="custom-control-input" id={test.clusterName} onChange={(e) => {
                    changeHandler(e.target.checked, test.clusterName)
                }} />
                <Label className="custom-control-label" htmlFor={test.clusterName}>&nbsp;</Label>
            </div>,
        name: <Link to={"#"} className="text-dark font-weight-bold" searchvalue={test.clusterName} >{test.clusterName}</Link>,
        endpoint: <Link to={"#"} className="text-dark font-weight-bold" searchvalue={test.clusterEndpoint} >{test.clusterEndpoint}</Link>,
        os: <Link to={"#"} className="text-dark font-weight-bold" searchvalue={test.os} >{test.os}</Link>,
        kernel: <Link to={"#"} className="text-dark font-weight-bold" searchvalue={test.kernel} >{test.kernel}</Link>,
        status: <Link to={"#"} className="text-dark font-weight-bold" searchvalue={test.status} >{test.status}</Link>,
        kubeVersion: <Link to={"#"} className="text-dark font-weight-bold" searchvalue={test.kubeVersion} >{test.kubeVersion}</Link>,
    }))

    let rows_edge = EdgeList.map(test => ({
        checkbox:
            <div className="custom-control custom-checkbox">
                <Input type="checkbox" className="custom-control-input" id={test.clusterName} value={test.clusterName} onChange={(e) => {
                    changeHandler(e.target.checked, test.clusterName)
                }} />
                {/* checked={checkedInputs.includes(test.clusterName) ? true : false} */}
                <Label className="custom-control-label" htmlFor={test.clusterName}>&nbsp;</Label>
            </div>,
        name: <Link to={"#"} className="text-dark font-weight-bold" searchvalue={test.clusterName} >{test.clusterName}</Link>,
        endpoint: <Link to={"#"} className="text-dark font-weight-bold" searchvalue={test.clusterEndpoint} >{test.clusterEndpoint}</Link>,
        os: <Link to={"#"} className="text-dark font-weight-bold" searchvalue={test.os} >{test.os}</Link>,
        kernel: <Link to={"#"} className="text-dark font-weight-bold" searchvalue={test.kernel} >{test.kernel}</Link>,
        status: <Link to={"#"} className="text-dark font-weight-bold" searchvalue={test.status} >{test.status}</Link>,
        kubeVersion: <Link to={"#"} className="text-dark font-weight-bold" searchvalue={test.kubeVersion} >{test.kubeVersion}</Link>,
    }))

    let rows = rows_core
    let columns = core_columns
    const Tablecore = { columns, rows };
    rows = rows_edge
    columns = edge_columns
    const TableEdge = { columns, rows };
    let clusterNames= ""
    if(checkedInputs.length > 1){
        callApiStore.clusterCheck = ""
        checkedInputs.map((clusters)=>{
            clusterNames = clusterNames + clusters + ","
            console.log(clusters,"clusters")
        })
        callApiStore.clusterCheck = clusterNames
    }else if(checkedInputs.length == 1){
        callApiStore.clusterCheck = ""
        callApiStore.clusterCheck = checkedInputs[0]
    }
    
    console.log( checkedInputs )
    return (
        <div>
            <hr />
            <Label for="basicpill-pancard-input18">Select Core Cloud</Label>
            <hr />
            <MDBDataTable responsive data={Tablecore} className="mt-4" />
            <hr />
            <Label for="basicpill-pancard-input18">Select Edge Cloud</Label>
            <hr />
            <MDBDataTable responsive data={TableEdge} className="mt-4" />
        </div>

    )

});

export default ClusterSelectTable
