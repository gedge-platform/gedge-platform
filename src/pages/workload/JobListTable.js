import React, { useEffect, useState } from 'react';
import { UncontrolledTooltip, Input, Label } from "reactstrap";
import { Link } from "react-router-dom";
import store from "../../store/Monitor/store/Store"
import { observer } from "mobx-react";
import { MDBDataTable } from "mdbreact";

const JobListTable = observer((props) => {
    const { dbApiStore } = store;
    const { workloadStore } = store;

    let podList = []
    let clusterpodlist = []
    let clusterlists = []
    let clustername = []
    let podlisttest = [];
    let podData = [];
    let podData1 = [];
    let temp = [];
    let data1 = [];
    let pod_count = 0;
    let restart = 0;
    useEffect(() => {
        console.log(workloadStore.getPodList(), "podlist")
        workloadStore.getPodList()
        dbApiStore.getClusterList("clusters")

    }, []);
    temp = dbApiStore.clusterList
    console.log(temp, "clustername")


    clusterpodlist = workloadStore.podList;
    console.log(clusterpodlist)
    console.log(workloadStore.temp1[0])
    if (workloadStore.temp1[0] == null || workloadStore.temp1 == "All Namespace") {
        console.log(workloadStore.temp1)
        podList = clusterpodlist
        console.log(podList)
    } else {
        console.log(workloadStore.temp1)
        clusterpodlist.map((list, key) => {
            if (list.metadata.namespace == workloadStore.temp1) {
                console.log(list.metadata.namespace)
                podList.push(list)
            }

        })
        // console.log(clusterpodlist.filter(data => data.metadata.namespace == workloadStore.temp1))

    }
    console.log(podList)
    const statusDiv = (test) => {
        if (test == "Running") {
            return <div className="badge badge-soft-success font-size-12">{test}</div>
        } else if (test == "Pending") {
            return <div className="badge badge-soft-warning font-size-12">{test}</div>
        } else {
            return <div className="badge badge-soft-danger font-size-12">{test}</div>
        }
    }
    podData = podList.map((list, key) => {
        console.log(list.cluster)

        // podlisttest.push(listtest.metadata.name)
        // link: "/workload/pod/" + listtest.metadata.namespace + "/" + listtest.metadata.name,
        let images = '';
        let deploy_status = "Running"
        let temp = ""
        let podIP = ""
        restart = 0;
        if (list.status.containerStatuses !== undefined) {
            list.status.containerStatuses.map(container => {
                pod_count = 0;
                restart = restart + container.restartCount;
                if (container.ready) {
                    pod_count++;
                }
                if (container.state.running == undefined) {
                    temp = Object.values(container.state)
                    deploy_status = temp[0].reason
                    if (temp[0].reason == "ContainerCreating") {
                        deploy_status = "Pending"
                    }
                }
                images = container.image + "\n" + images
            })
        }
        if (list.status.podIP == undefined) {
            podIP = "-"
        } else {
            podIP = list.status.podIP
        }
        return {
            link: "pod/" + list.cluster + "/" + list.metadata.namespace + "/" + list.metadata.name,
            name: list.metadata.name,
            clustername: list.cluster,
            namespace: list.metadata.namespace,
            // nodeName: list.spec.nodeName + " \n( " + list.status.hostIP + " )",
            podIp: podIP,
            status: deploy_status,
            // image: images,
            ready: pod_count + "/ " + list.spec.containers.length,
            restart: restart,
            createTime: list.status.startTime
        }


        // console.log(podlisttest)


        // console.log(data1, "data1")
        // list.map((listdata) => {
        //     // console.log(listdata.metadata.name)
        // })
    }
    )
    data1 = podData
    // apitoData = dataFromApi;
    console.log(data1, "apitoData")



    const rows = data1.map(test => ({
        checkbox:
            <div className="custom-control custom-checkbox">
                <Input type="checkbox" className="custom-control-input" id="ordercheck1" />
                <Label className="custom-control-label" htmlFor="ordercheck1">&nbsp;</Label>
            </div>,
        name: <Link to={test.link} className="text-dark font-weight-bold" searchvalue={test.name} >{test.name}</Link>,
        // node: <Link to={test.link} className="text-dark font-weight-bold" style={{ whiteSpace: 'pre-line' }} searchvalue={test.nodeName} >{test.nodeName}</Link>,
        podIp: <Link to={test.link} className="text-dark font-weight-bold" searchvalue={test.podIp} >{test.podIp}</Link>,
        ready: <Link to={test.link} className="text-dark font-weight-bold"  >{test.ready}</Link>,
        status: statusDiv(test.status),
        // image: <Link to={test.link} className="text-dark font-weight-bold" style={{ whiteSpace: 'pre-line' }} searchvalue={test.image} >{test.image}</Link>,
        clustername: <Link to={test.link} className="text-dark font-weight-bold" searchvalue={test.clustername} >{test.clustername}</Link>,
        restart: <Link to={test.link} className="text-dark font-weight-bold"  >{test.restart}</Link>,
        createTime: <Link to={test.link} className="text-dark font-weight-bold" searchvalue={test.createTime} >{test.createTime}</Link>,
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
            label: "READY",
            field: "ready",
            sort: "asc",
            width: 135
        },
        {
            label: "상태",
            field: "status",
            sort: "asc",
            width: 135
        },
        // {
        //     label: "노드",
        //     field: "node",
        //     sort: "asc",
        //     width: 135
        // },
        {
            label: "Pod IP",
            field: "podIp",
            sort: "asc",
            width: 135
        },
        // {
        //     label: "이미지",
        //     field: "image",
        //     sort: "asc",
        //     width: 135
        // },
        {
            label: "클러스터 이름",
            field: "clustername",
            sort: "asc",
            width: 135
        },
        {
            label: "재시작",
            field: "restart",
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
    ],


        Tabledata = { columns, rows };


    return (
        <div>
            <MDBDataTable responsive data={Tabledata} className="mt-4" />
        </div>
    )
});

export default JobListTable