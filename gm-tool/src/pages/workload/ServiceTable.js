import React, { useEffect, useState } from 'react';
import { UncontrolledTooltip, Input, Label, Spinner } from "reactstrap";
import { Link } from "react-router-dom";
import store from "../../store/Monitor/store/Store"
import { observer } from "mobx-react";
import { MDBDataTable } from "mdbreact";
// import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';


const ServiceTable = observer((props) => {
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
            callApiStore.getFilterList("services", callApiStore.workspaceFilter, null)
        }
        // DeploymentList = [];
    }, []);
    // if (callApiStore.workspaceFilterList.length > 0) {
    DataList = callApiStore.serviceFilterList
    check = callApiStore.dataCheck
    console.log(check, "check")
    function status(clusterType, Ip) {
        let externalIp = ""
        if (clusterType == "LoadBalancer") {
            if (Ip == undefined) {
                externalIp = "Pending"
            } else {
                externalIp = Ip
            }
        } else {
            externalIp = "-"
        }
        return <div className="text-dark font-weight-bold">{externalIp}</div>
    }
    function setport(portList) {
        let ports = ""
        let temp = ""
        if (portList == undefined) {
            ports = "-"
        } else {
            portList.forEach(port => {
                if (port.nodePort == undefined) {
                    temp = port.port + " / " + port.protocol + "\n";
                } else {
                    temp = port.port + " : " + port.nodePort + " / " + port.protocol + "\n";
                }
                ports = ports + temp
            });
        }
        return <div className="text-dark font-weight-bold" style={{ whiteSpace: 'pre-line' }}>{ports}</div>
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
            width: 93
        },
        {
            label: "프로젝트",
            field: "project",
            sort: "asc",
            width: 93
        },
        {
            label: "서비스 타입",
            field: "type",
            sort: "asc",
            width: 93
        },
        {
            label: "클러스터IP",
            field: "clusterIP",
            sort: "asc",
            width: 109
        },
        {
            label: "포트",
            field: "port",
            sort: "asc",
            width: 109
        },
        {
            label: "ExternalIp",
            field: "externalIp",
            sort: "asc",
            width: 109
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
    console.log(DataList)
    if (callApiStore.serviceFilterList != null) {
        rows = DataList.map(test => ({
            checkbox:
                <div className="custom-control custom-checkbox">
                    <Input type="checkbox" className="custom-control-input" id="ordercheck1" />
                    <Label className="custom-control-label" htmlFor="ordercheck1">&nbsp;</Label>
                </div>,
            name: <Link to={"/workload/service/" + test.name + "?workspace=" + test.workspace + "&project=" + test.project + "&cluster=" + test.cluster} className="text-dark font-weight-bold" searchvalue={test.name} >{test.name}</Link>,
            cluster: <Link to={test.link} className="text-dark font-weight-bold" searchvalue={test.cluster} >{test.cluster}</Link>,
            project: <Link to={test.link} className="text-dark font-weight-bold" searchvalue={test.project} >{test.project}</Link>,

            type: <Link to={test.link} className="text-dark font-weight-bold" searchvalue={test.type} >{test.type}</Link>,
            clusterIP: <div className="text-dark font-weight-bold">{test.clusterIp}</div>,
            port: setport(test.port),
            externalIp: status(test.type, test.externalIp),
            // status: status(test.stauts),
            createTime: <Link to={test.link} className="text-dark font-weight-bold" searchvalue={test.createAt} >{test.createAt}</Link>,
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

export default ServiceTable
