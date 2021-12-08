import React, { useState, useEffect, useRef } from "react";
import LineCharts from "../../AllCharts/recharts/LineCharts";
import { observer } from "mobx-react";

import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Fade from '@material-ui/core/Fade';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import IconButton from '@material-ui/core/IconButton';
import PauseIcon from '@material-ui/icons/Pause';

import store from "../../../store/Monitor/store/Store"

const Application = observer((props) => {

    const { clusterStore } = store;

    const [time_interval, setTime_interval] = React.useState(60);
    const [time_step, setTime_step] = React.useState(10);
    // 메뉴 컴포넌트 on,off
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [anchorE2, setAnchorE2] = React.useState(null);

    const open = Boolean(anchorEl);
    const open2 = Boolean(anchorE2);

    const [curtime, setCurtime] = React.useState(new Date());

    const [flag, setFlag] = React.useState(false);

    const interval = useRef();

    useEffect(() => {
        interval.current = setInterval(() => handleClock(), 5000);
        return () => {
            clearInterval(interval.current);
        };
    }, [time_interval, time_step, curtime, flag]);


    const handleClock = () => {
        if (flag) {
            clusterStore.real_resource_request(0, 1 / 60, clusterStore.cur_cluster, "pod_count|service_count|deployment_count|cronjob_count|job_count|pv_count|pvc_count|namespace_count", "app");
            setCurtime(new Date());
        }
    };

    const onClickStart = () => {
        clusterStore.resource_request(60, 1, clusterStore.cur_cluster, "pod_count|service_count|deployment_count|cronjob_count|job_count|pv_count|pvc_count|namespace_count", "app");
        setFlag(true);
    };

    const onClickEnd = () => {
        setFlag(false);
        clearInterval(interval);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setAnchorE2(null);
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose1 = (value) => {
        if (time_step >= value) {
            setTime_step(value / 2);
            setTime_interval(value)
        }
        else {
            setTime_interval(value)
        }

        clusterStore.resource_request(value, time_step, "all", "pod_count|service_count|deployment_count|cronjob_count|job_count|pv_count|pvc_count|namespace_count", "app");
        setFlag(false);
        clearInterval(interval);
        setAnchorEl(null);
    };

    const handleClick2 = (event) => {
        setAnchorE2(event.currentTarget);
    };

    const handleClose2 = (value) => {

        if (time_interval <= value) {
            setTime_interval(value * 2);
            setTime_step(value)
        }
        else {
            setTime_step(value)
        }

        clusterStore.resource_request(time_interval, value, "all", "pod_count|service_count|deployment_count|cronjob_count|job_count|pv_count|pvc_count|namespace_count", "app");
        setFlag(false);
        clearInterval(interval);
        setAnchorE2(null);
    };

    let pod_count = []
    let service_count = []
    let deployment_count = []
    let cronjob_count = []
    let job_count = []
    let pv_count = []
    let pvc_count = []
    let namespace_count = []

    if (clusterStore.pod_count !== undefined) {
        pod_count = clusterStore.pod_count.filter(item => item.metric.cluster == clusterStore.cur_cluster);
    }
    if (clusterStore.service_count !== undefined) {
        service_count = clusterStore.service_count.filter(item => item.metric.cluster == clusterStore.cur_cluster);
    }
    if (clusterStore.deployment_count !== undefined) {
        deployment_count = clusterStore.deployment_count.filter(item => item.metric.cluster == clusterStore.cur_cluster);
    }
    if (clusterStore.cronjob_count !== undefined) {
        cronjob_count = clusterStore.cronjob_count.filter(item => item.metric.cluster == clusterStore.cur_cluster);
    }
    if (clusterStore.job_count !== undefined) {
        job_count = clusterStore.job_count.filter(item => item.metric.cluster == clusterStore.cur_cluster);
    }
    if (clusterStore.pv_count !== undefined) {
        pv_count = clusterStore.pv_count.filter(item => item.metric.cluster == clusterStore.cur_cluster);
    }
    if (clusterStore.pvc_count !== undefined) {
        pvc_count = clusterStore.pvc_count.filter(item => item.metric.cluster == clusterStore.cur_cluster);
    }
    if (clusterStore.namespace_count !== undefined) {
        namespace_count = clusterStore.namespace_count.filter(item => item.metric.cluster == clusterStore.cur_cluster);
    }


    let pod_count_data = [[new Date(), 0], [new Date(), 0]];
    let service_count_data = [[new Date(), 0], [new Date(), 0]];
    let deployment_count_data = [[new Date(), 0], [new Date(), 0]];
    let cronjob_count_data = [[new Date(), 0], [new Date(), 0]];
    let job_count_data = [[new Date(), 0], [new Date(), 0]];
    let pv_count_data = [[new Date(), 0], [new Date(), 0]];
    let pvc_count_data = [[new Date(), 0], [new Date(), 0]];
    let namespace_count_data = [[new Date(), 0], [new Date(), 0]];

    let pods = 0;
    let service = 0;
    let deployments = 0;
    let jobs = 0;
    let cronjob = 0;
    let pv = 0;
    let pvc = 0;
    let namespace = 0;

    if (pod_count.length > 0) {
        pod_count_data = pod_count[0].values
        pods = pod_count_data[pod_count_data.length - 1][1]
    }

    if (service_count.length > 0) {
        service_count_data = service_count[0].values
        service = pods = service_count_data[service_count_data.length - 1][1]
    }

    if (deployment_count.length > 0) {
        deployment_count_data = deployment_count[0].values
        deployments = pods = deployment_count_data[deployment_count_data.length - 1][1]
    }

    if (cronjob_count.length > 0) {
        cronjob_count_data = cronjob_count[0].values
        cronjob = pods = cronjob_count_data[cronjob_count_data.length - 1][1]
    }

    if (job_count.length > 0) {
        job_count_data = job_count[0].values
        jobs = pods = job_count_data[job_count_data.length - 1][1]
    }

    if (pvc_count.length > 0) {
        pvc_count_data = pvc_count[0].values
        pvc = pods = pvc_count_data[pvc_count_data.length - 1][1]
    }

    if (pv_count.length > 0) {
        pv_count_data = pv_count[0].values
        pv = pods = pv_count_data[pv_count_data.length - 1][1]
    }

    if (namespace_count.length > 0) {
        namespace_count_data = namespace_count[0].values
        namespace = pods = namespace_count_data[namespace_count_data.length - 1][1]
    }

    const timeSet = (
        <div style={{ display: "flex", justifyContent: "flex-end" }} >
            {/* <div style={{ marginBottom: "auto", marginTop: "auto" }}>{curtime.getFullYear()}년 {curtime.getMonth()}월 {curtime.getDate()}일 {curtime.getHours()}시 {curtime.getMinutes()}분{curtime.getSeconds()}초</div> */}
            <div style={{ marginRight: "10px", marginBottom: "auto", marginTop: "auto" }}>

                {flag === false ? <IconButton color="primary" aria-label="play" onClick={onClickStart}>
                    <PlayArrowIcon fontSize="medium" />
                </IconButton> :
                    <IconButton color="primary" aria-label="play" onClick={onClickEnd}>
                        <PauseIcon fontSize="medium" />
                    </IconButton>
                }
            </div>
            <div style={{ marginRight: "10px", marginBottom: "auto", marginTop: "auto" }}>
                <Button variant="contained" color="primary" aria-controls="fade-menu" aria-haspopup="true" onClick={handleClick}>
                    {time_interval < 60 ? time_interval + "m" : time_interval / 60 + "h"}
                </Button>
                <Menu
                    id="fade-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={open}
                    onClose={handleClose}
                    TransitionComponent={Fade}
                >
                    <MenuItem onClick={() => handleClose1(10)}>10m</MenuItem>
                    <MenuItem onClick={() => handleClose1(20)}>20m</MenuItem>
                    <MenuItem onClick={() => handleClose1(30)}>30m</MenuItem>
                    <MenuItem onClick={() => handleClose1(60)}>1hour</MenuItem>
                    <MenuItem onClick={() => handleClose1(120)}>2hour</MenuItem>
                    <MenuItem onClick={() => handleClose1(180)}>3hour</MenuItem>
                    <MenuItem onClick={() => handleClose1(240)}>4hour</MenuItem>
                    <MenuItem onClick={() => handleClose1(300)}>5hour</MenuItem>
                    <MenuItem onClick={() => handleClose1(720)}>12hour</MenuItem>
                </Menu>
            </div>

            <div style={{ marginBottom: "auto", marginTop: "auto" }}>
                <Button variant="contained" color="primary" aria-controls="fade-menu" aria-haspopup="true" onClick={handleClick2}>
                    {time_step < 1 ? time_step * 60 + "s" : time_step < 60 ? time_step + "m" : time_step / 60 + "h"}
                </Button>
                <Menu
                    id="fade-menu"
                    anchorEl={anchorE2}
                    keepMounted
                    open={open2}
                    onClose={handleClose}
                    TransitionComponent={Fade}
                >
                    <MenuItem onClick={() => handleClose2(0.5)}>30s</MenuItem>
                    <MenuItem onClick={() => handleClose2(1)}>1minute</MenuItem>
                    <MenuItem onClick={() => handleClose2(2)}>2minute</MenuItem>
                    <MenuItem onClick={() => handleClose2(5)}>5minute</MenuItem>
                    <MenuItem onClick={() => handleClose2(10)}>10minute</MenuItem>
                    <MenuItem onClick={() => handleClose2(15)}>15minute</MenuItem>
                    <MenuItem onClick={() => handleClose2(30)}>30minute</MenuItem>
                    <MenuItem onClick={() => handleClose2(60)}>1hour</MenuItem>
                    <MenuItem onClick={() => handleClose2(120)}>2hour</MenuItem>
                </Menu>
            </div>
        </div>);

    return (

        <div>
            <hr></hr>
            {timeSet}
            <div style={{ display: "flex" }}>
                <div style={{ width: "100%" }}><h5>{pods} Pods</h5></div>
            </div>
            <div style={{ display: "flex", height: "120px" }}>
                <div style={{ width: "100%" }}><LineCharts kind={"test"} cluster_data={pod_count_data} /></div>
            </div>
            <div style={{ display: "flex" }}>
                <div style={{ width: "50%" }}><h5>{deployments} Deployments</h5></div>
                <div style={{ width: "50%" }}><h5>{service} Service</h5></div>

            </div>
            <div style={{ display: "flex", height: "120px" }}>
                <div style={{ width: "50%" }}><LineCharts kind={"test"} cluster_data={deployment_count_data} /></div>
                <div style={{ width: "50%" }}><LineCharts kind={"test"} cluster_data={service_count_data} /></div>
            </div>
            <div style={{ display: "flex" }}>
                <div style={{ width: "50%" }}><h5>{jobs} Jobs</h5></div>
                <div style={{ width: "50%" }}><h5>{pv} PV</h5></div>
            </div>
            <div style={{ display: "flex", height: "120px" }}>
                <div style={{ width: "50%" }}><LineCharts kind={"test"} cluster_data={job_count_data} /></div>
                <div style={{ width: "50%" }}><LineCharts kind={"test"} cluster_data={pv_count_data} /></div>
            </div>
            <div style={{ display: "flex" }}>
                <div style={{ width: "50%" }}><h5>{pvc} PVC</h5></div>
                <div style={{ width: "50%" }}><h5>{namespace} Namespace</h5></div>
            </div>
            <div style={{ display: "flex", height: "120px" }}>
                <div style={{ width: "50%" }}><LineCharts kind={"test"} cluster_data={pvc_count_data} /></div>
                <div style={{ width: "50%" }}><LineCharts kind={"test"} cluster_data={namespace_count_data} /></div>
            </div>
        </div >
    )

})

export default Application;
