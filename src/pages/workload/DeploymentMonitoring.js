import React, { useState, useEffect, useRef } from "react";
import LineCharts from "../AllCharts/recharts/LineCharts";
import { observer } from "mobx-react";
import Chip from '@material-ui/core/Chip';
import store from "../../store/Monitor/store/Store"
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Fade from '@material-ui/core/Fade';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import IconButton from '@material-ui/core/IconButton';
import PauseIcon from '@material-ui/icons/Pause';

const DeploymentMonitoring = observer((props) => {

    let pod_list = ["http-go2", "prometheus-kube-prometheus-operator-6486f884f7-8mf5d", "minio-d4964f7f4-wtv5c"];
    const [pod_cpu, setPod_cpu] = React.useState("");
    const [pod_memory, setPod_memory] = React.useState("");
    const [pod_traf_in, setPod_traf_in] = React.useState("");
    const [pod_traf_out, setPod_traf_out] = React.useState("");

    const { clusterStore } = store;

    const [time_interval, setTime_interval] = React.useState(60);
    const [time_step, setTime_step] = React.useState(10);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [anchorE2, setAnchorE2] = React.useState(null);

    const open = Boolean(anchorEl);
    const open2 = Boolean(anchorE2);
    
    const [curtime, setCurtime] = React.useState(new Date());
    
    const [flag, setFlag] = React.useState(false);
   
    const interval = useRef();

    useEffect(() => {
        clusterStore.pod_data(time_interval, time_step);
        setPod_cpu(pod_list[0]);
        setPod_memory(pod_list[0]);
        setPod_traf_in(pod_list[0]);
        setPod_traf_out(pod_list[0]);
    }, [])
    
    useEffect(() => {
        interval.current = setInterval(() => handleClock(), 5000);
        // clusterStore.pod_data(time_interval, time_step);
        return () => {
            clearInterval(interval.current);
        };   
    }, [time_interval, time_step, curtime, flag]);

    // 파드 리스트는 넘겨받음

    const handleClock = () => {
        if (flag) { //flag로 on/off
            clusterStore.pod_data(30, 5/60);
            setCurtime(new Date());
        }
    };

    const onClickStart = () => {
        clusterStore.pod_data(30, 5/60);
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

        clusterStore.pod_data(value, time_step);
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

        clusterStore.pod_data(time_interval, value);
        setFlag(false);
        clearInterval(interval);
        setAnchorE2(null);
    };

    const CpuhandleClick = (value) => {
        setPod_cpu(value);   
    };

    const MemoryhandleClick = (value) => {
        setPod_memory(value);
    };

    const OutboundhandleClick = (value) => {
        setPod_traf_in(value);
    };

    const InboundhandleClick = (value) => {
        setPod_traf_out(value);
    };

    const Cpu_pod_list = pod_list.map((item) => {
        return (
            <>
                {item === pod_cpu ?
                <Chip
                    label={item}
                    color="primary"
                    onClick={() => CpuhandleClick(item)}
                /> : <Chip
                    label={item}
                    onClick={() => CpuhandleClick(item)}
                />}
            </>
        )
    })

    const Memory_pod_list = pod_list.map((item) => {
        return (
            <>
                {item === pod_memory ?
                    <Chip
                        label={item}
                        color="primary"
                        onClick={() => MemoryhandleClick(item)}
                    /> : <Chip
                        label={item}
                        onClick={() => MemoryhandleClick(item)}
                    />}
            </>
        )
    })

    const Outbound_pod_list = pod_list.map((item) => {
        return (
            <>
                {item === pod_traf_in ?
                    <Chip
                        label={item}
                        color="primary"
                        onClick={() => OutboundhandleClick(item)}
                    /> : <Chip
                label={item}
                onClick={() =>OutboundhandleClick(item)}
            />}
            </>

            
        )
    })

    const Inbound_pod_list = pod_list.map((item) => {
        return (
            <>
                {item === pod_traf_out ?
                    <Chip
                        label={item}
                        color="primary"
                        onClick={() => InboundhandleClick(item)}
                    /> : <Chip
                        label={item}
                        onClick={() => InboundhandleClick(item)}
                    />}
            </>
        )
    })

    //test
    const data = clusterStore.pod_cpu;
    const data2 = clusterStore.pod_memory;
    const data3 = clusterStore.pod_traffic_in;
    const data4 = clusterStore.pod_traffic_out;
    // console.log(data,"data");

    let test = [];
    let test2 = [];
    let test3 = [];
    let test4 = [];

    test = data.filter((item) => (pod_cpu === item.metric.pod));
    test2 = data2.filter((item) => (pod_memory === item.metric.pod)); //단위 변환 필요
    test3 = data3.filter((item) => (pod_traf_in === item.metric.pod));
    test4 = data4.filter((item) => (pod_traf_out === item.metric.pod));

    if (test.length > 0 && test2.length > 0 && test3.length > 0 && test4.length > 0) {
        test = test[0].values;
        test2 = test2[0].values;
        test3 = test3[0].values;
        test4 = test4[0].values;
    }

    const timeSet = (<div style={{ display: "flex", justifyContent: "flex-end" }} >
        <div style={{ marginBottom: "auto", marginTop: "auto" }}>{curtime.getFullYear()}년 {curtime.getMonth()}월 {curtime.getDate()}일 {curtime.getHours()}시 {curtime.getMinutes()}분{curtime.getSeconds()}초</div>
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
       
           {timeSet}
                <hr></hr>
            <div>
                <h6>CPU Usage (m)</h6>
                <div style={{ height: "120px" }}><LineCharts kind={"test"} cluster_data={test}/></div>
                {Cpu_pod_list}
            </div>
            <hr></hr>
            <div>
                <h6>Memory Usage (Mi)</h6>
                <div style={{ height: "120px" }}><LineCharts kind={"test"} cluster_data={test2}/></div>
                {Memory_pod_list}
            </div>
            <hr></hr>
            <div>
                <h6>OutBound Traffic(kbps)</h6 >
                <div style={{ height: "120px" }}><LineCharts kind={"test"} cluster_data={test3}/></div>
                {Outbound_pod_list}
            </div>
            <hr></hr>
            <div>
                <h6>Inbound Traffic(kbps)</h6 >
                <div style={{ height: "120px" }}><LineCharts kind={"test"} cluster_data={test4}/></div>
                {Inbound_pod_list}
            </div>
            <hr></hr>
        </div >

    )

})

export default DeploymentMonitoring;
