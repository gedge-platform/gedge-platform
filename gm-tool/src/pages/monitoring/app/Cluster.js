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
import axios from "axios";

const Cluster = observer(() => {
    // const Cluster = (props) => {
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

    // 실시간 변화를 위한 함수 useeffect 에서 연결
    const handleClock = () => {
        if (flag) { //flag로 on/off
            // clusterStore.test(30, 5 / 60);
            clusterStore.real_physical_request(0, 1 / 60, clusterStore.cur_cluster, "cpu_usage|memory_usage", "cluster");
            setCurtime(new Date());
        }
    };

    //menu 함수
    const onClickStart = () => {
        // clusterStore.test(30, 5 / 60);
        clusterStore.physical_request(60, 1, clusterStore.cur_cluster, "cpu_usage|memory_usage", "cluster");
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

        clusterStore.physical_request(value, time_step, "all", "cpu_usage|memory_usage", "cluster");
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

        clusterStore.physical_request(time_interval, value, "all", "cpu_usage|memory_usage", "cluster");
        setFlag(false);
        clearInterval(interval);
        setAnchorE2(null);
    };

    let cpu_usage = []
    let memory_usage = []
    if (clusterStore.cpu_usage !== undefined) {
        cpu_usage = clusterStore.cpu_usage.filter(item => item.metric.cluster == clusterStore.cur_cluster);
    }
    if (clusterStore.memory_usage !== undefined) {
        memory_usage = clusterStore.memory_usage.filter(item => item.metric.cluster == clusterStore.cur_cluster);
    }

    let cpu_usage_data = [[new Date(), 0], [new Date(), 0]];
    let memory_usage_data = [[new Date(), 0], [new Date(), 0]];

    let now_cpu_usage_data = 0;
    let now_memory_usage_data = 0;

    if (cpu_usage.length > 0) {
        cpu_usage_data = cpu_usage[0].values
        now_cpu_usage_data = cpu_usage_data[cpu_usage_data.length - 1][1]
    }

    if (memory_usage.length > 0) {
        memory_usage_data = memory_usage[0].values
        now_memory_usage_data = memory_usage_data[memory_usage_data.length - 1][1]
    }

    const timeSet = (<div style={{ display: "flex", justifyContent: "flex-end" }} >
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
        <div >
            <hr></hr>
            {timeSet}
            <div style={{ display: "flex" }}>
                <div style={{ width: "50%", marginLeft: "2%" }}><h5>{now_cpu_usage_data} Cpu</h5></div>
                <div style={{ width: "50%", marginLeft: "2%" }}><h5>{now_memory_usage_data} Memory</h5></div>
            </div>
            <div style={{ display: "flex", height: "120px" }}>
                <div style={{ width: "50%" }}><LineCharts kind={"test"} cluster_data={cpu_usage_data} /></div>
                <div style={{ width: "50%" }}><LineCharts kind={"test"} cluster_data={memory_usage_data} /></div>
            </div>
        </div >
    )

});

export default Cluster;
