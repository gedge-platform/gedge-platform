
import React, { useEffect, useState } from 'react';
import { Nav, NavItem, NavLink, UncontrolledTooltip, Input, Label } from "reactstrap";
import classnames from 'classnames';
import { Link } from "react-router-dom";
import store from "../../store/Monitor/store/Store"
import { observer } from "mobx-react";
import { MDBDataTable } from "mdbreact"

const JobData = observer((props) => {
    const { workloadStore } = store;
    const { dbApiStore } = store;
    const { apitoData, job, activeTab } = props
    // const [activeTab, setactiveTab] = useState("1");
    let joblist = [];
    let joblistall = [];
    //test
    let clusterpodlist = []
    useEffect(() => {
        console.log(workloadStore.getJobList(), "joblist")
        workloadStore.getJobList()
        dbApiStore.getWorkspaceList("workspaces");
        //cronjob test
        workloadStore.getPodList()

    }, []);
    clusterpodlist = workloadStore.podList;
    console.log(clusterpodlist)
    joblist = workloadStore.jobList
    console.log(joblist)
    // console.log(workloadStore.temp2)

    // joblist.map((list, key) => {

    //     console.log(list, "joballlist")
    //     joblistall.push(list)
    // })
    // const toggleTab = (tab) => {
    //     if (activeTab !== tab) {
    //         setactiveTab({
    //             activeTab: tab,
    //         });

    //     }

    // }
    console.log(joblistall)
    console.log(job, "workloadData")
    let jobfilterdata = []
    jobfilterdata = workloadStore.jobList
    // let apitoData = [];
    let dataFromApi = [];
    console.log(workloadStore.temp3)
    if (workloadStore.temp3[0] == null || workloadStore.temp3 == "All Cluster") {
        console.log(workloadStore.temp3);
        joblistall = jobfilterdata

    }
    else {
        console.log(workloadStore.temp3)
        joblist.map((list, key) => {
            if (list.cluster == workloadStore.temp3) {
                console.log(list.cluster, "joballlist")
                joblistall.push(list)
            }
        })
    }
    console.log(workloadStore.jobtab)
    dataFromApi = joblistall.map(list => {

        let updateTimes = '';
        let imageName = '';
        let status = '';
        let owner = '';
        if (list.metadata.managedFields.length > 1) {
            list.metadata.managedFields.map(time => {
                updateTimes = time.time
            })
        } else {
            updateTimes = list.metadata.managedFields[0].time;
        }
        if (list.spec.template.spec.containers[0].image == undefined) {
            imageName = '-';
        } else {
            imageName = list.spec.template.spec.containers[0].image
        }
        if (list.status.succeeded == 1) {
            status = "running"
        } else {
            status = "pending"
        }
        if (list.metadata.ownerReferences == undefined) {
            owner = "-"
        } else {
            owner = list.metadata.ownerReferences[0].kind + " / " + list.metadata.ownerReferences[0].name;
        }
        return {
            cluster: list.cluster,
            link: "/workload/job/" + list.metadata.namespace + "/" + list.metadata.name,
            name: list.metadata.name,
            image: imageName,
            status: status,
            updateTime: updateTimes,
            ownerReferences: owner,
            kind: list.kind
        }
    })

    jobfilterdata = dataFromApi;
    console.log(jobfilterdata, "apitoData")

    let Tabledata = '';
    // if (activeTab == '1') {

    // job = "jobs"
    // if (job == "jobs") {
    // console.log(activeTab, "jobtab")
    console.log(workloadStore.jobtab)
    // if (workloadStore.jobtab === "jobtab") {
    // if (workloadStore.jobtab === '1') {
    const rows = jobfilterdata.map(test => ({
        checkbox:
            <div className="custom-control custom-checkbox">
                <Input type="checkbox" className="custom-control-input" id="ordercheck1" />
                <Label className="custom-control-label" htmlFor="ordercheck1">&nbsp;</Label>
            </div>,
        name: <Link to={test.link} className="text-dark font-weight-bold">{test.name}</Link>,
        namespace: <Link to={test.link} className="text-dark font-weight-bold">{test.namespace}</Link>,
        createTime: <Link to={test.link} className="text-dark font-weight-bold">{test.createTime}</Link>,
        ownerReferences: <Link to={test.link} className="text-dark font-weight-bold">{test.ownerReferences}</Link>,
        cluster: <Link to={test.link} className="text-dark font-weight-bold">{test.cluster}</Link>,
        updateTime: <Link to={test.link} className="text-dark font-weight-bold">{test.updateTime}</Link>,
        status: <div className="badge badge-soft-success font-size-12">{test.status}</div>,
        //invoice: <Button className="btn-rounded" color="light">//invoice <i className="mdi mdi-download ml-2"></i></Button>,
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
        // {
        //     label: "프로젝트",
        //     field: "namespace",
        //     sort: "asc",
        //     width: 78
        // },
        {
            label: "상위",
            field: "ownerReferences",
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
    Tabledata = { columns, rows };

    // }

    // else if (workloadStore.jobtab === "cron") {
    // console.log(activeTab, "cron")

    // else if (workloadStore.jobtab === '2') {
    // else {
    // const rows = clusterpodlist.map(test => ({
    //     checkbox:
    //         <div className="custom-control custom-checkbox">
    //             <Input type="checkbox" className="custom-control-input" id="ordercheck1" />
    //             <Label className="custom-control-label" htmlFor="ordercheck1">&nbsp;</Label>
    //         </div>,
    //     name: <Link to={test.link} className="text-dark font-weight-bold">{test.metadata.name}</Link>,
    //     image: <Link to={test.link} className="text-dark font-weight-bold">{test.image}</Link>,
    //     schedule: <Link to={test.link} className="text-dark font-weight-bold">{test.schedule}</Link>,
    //     lastSchedule: <Link to={test.link} className="text-dark font-weight-bold">{test.lastSchedule}</Link>,
    //     createTime: <Link to={test.link} className="text-dark font-weight-bold">{test.createTime}</Link>,
    //     status: <div className="badge badge-soft-success font-size-12">{test.status}</div>,
    //     //invoice: <Button className="btn-rounded" color="light">//invoice <i className="mdi mdi-download ml-2"></i></Button>,
    //     action: <><Link to="#" className="mr-3 text-primary" id="edit1"><i className="mdi mdi-pencil font-size-18"></i></Link>
    //         <UncontrolledTooltip placement="top" target="edit1">
    //             Edit
    //         </UncontrolledTooltip >
    //         <Link to="#" className="text-danger" id="delete1"><i className="mdi mdi-trash-can font-size-18"></i></Link>
    //         <UncontrolledTooltip placement="top" target="delete1">
    //             Delete
    //         </UncontrolledTooltip >
    //     </>
    // }
    // ))
    // const columns = [
    //     {
    //         label: <div className="custom-control custom-checkbox"> <Input type="checkbox" className="custom-control-input" id="ordercheck" /><Label className="custom-control-label" htmlFor="ordercheck">&nbsp;</Label></div>,
    //         field: "checkbox",
    //         sort: "asc",
    //         width: 28
    //     },
    //     {
    //         label: "이름",
    //         field: "name",
    //         sort: "asc",
    //         width: 78
    //     },
    //     {
    //         label: "이미지",
    //         field: "image",
    //         sort: "asc",
    //         width: 78
    //     },
    //     {
    //         label: "스케쥴",
    //         field: "schedule",
    //         sort: "asc",
    //         width: 135
    //     },
    //     {
    //         label: "Last 스케쥴",
    //         field: "lastSchedule",
    //         sort: "asc",
    //         width: 135
    //     },

    //     {
    //         label: "생성 시간",
    //         field: "createTime",
    //         sort: "asc",
    //         width: 48
    //     },
    //     {
    //         label: "Action",
    //         field: "action",
    //         sort: "asc",
    //         width: 120
    //     },
    //     ////

    // ]
    // Tabledata = { columns, rows };
    // // }




    return (
        <div>
            {/* <Nav pills className="pricing-nav-tabs">
                <NavItem>
                    <NavLink className={classnames({ active: activeTab === 'jobs' })} onClick={() => { toggleTab('jobs'); }}>
                        잡
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink className={classnames({ active: activeTab === 'cron' })} onClick={() => { toggleTab('cron'); }}>
                        크론잡
                    </NavLink>
                </NavItem>
            </Nav> */}
            <MDBDataTable responsive data={Tabledata} className="mt-4" />
        </div>
    )

});

export default JobData