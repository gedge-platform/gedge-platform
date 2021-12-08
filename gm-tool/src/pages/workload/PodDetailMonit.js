import React, { useState, useEffect, useRef } from "react";
import LineCharts from "../AllCharts/recharts/LineCharts";
import { observer } from "mobx-react";

import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Fade from '@material-ui/core/Fade';
import store from "../../store/Monitor/store/Store"

import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import IconButton from '@material-ui/core/IconButton';
import PauseIcon from '@material-ui/icons/Pause';

import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import TagFacesIcon from '@material-ui/icons/TagFaces';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        listStyle: 'none',
        padding: theme.spacing(0.5),
        margin: 0,
    },
    chip: {
        margin: theme.spacing(0.5),
    },
}));

const PodDetailMonit = observer((props) => {
    const classes = useStyles();
    const { apilistinfo } = props
    const { clusterStore } = store;

    // const [pod_cpu_data, setPod_cpu_data] = React.useState([[new Date(), 0], [new Date(), 0]]);
    // const [pod_memory_data, setPod_memory_data] = React.useState([[new Date(), 0], [new Date(), 0]]);
    // const [pod_net_bytes_tran_data, setPod_net_bytes_tran_data] = React.useState([[new Date(), 0], [new Date(), 0]]);
    // const [pod_net_bytes_rec_data, setPod_net_bytes_rec_data] = React.useState([[new Date(), 0], [new Date(), 0]]);

    // const [container_cpu_data, setContainer_cpu_data] = React.useState([[new Date(), 0], [new Date(), 0]]);
    // const [container_memory_data, setContainer_memory_data] = React.useState([[new Date(), 0], [new Date(), 0]]);
    console.log(apilistinfo)
    const [cpuContainer, setCpuContainer] = React.useState(apilistinfo.Podcontainers[0].name);
    const [memContainer, setMemContainer] = React.useState(apilistinfo.Podcontainers[0].name);
    const [curtime, setCurtime] = React.useState(new Date());
    const [flag, setFlag] = React.useState(false);
    const interval = useRef();

    const [time_interval, setTime_interval] = React.useState(60);
    const [time_step, setTime_step] = React.useState(10);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [anchorE2, setAnchorE2] = React.useState(null);

    const open = Boolean(anchorEl);
    const open2 = Boolean(anchorE2);

    useEffect(() => {
        async function fetchAndSetUser() {
            await clusterStore.pod_request(time_interval, time_step, apilistinfo.cluster, apilistinfo.project, apilistinfo.name, "container_cpu|container_memory|pod_cpu|pod_memory|pod_net_bytes_transmitted|pod_net_bytes_received", "pod")
        }
        fetchAndSetUser();

        setFlag(false);
        clearInterval(interval);
    }, [])

    useEffect(() => {
        interval.current = setInterval(() => handleClock(), 5000);
        return () => {
            clearInterval(interval.current);
        };
    }, [curtime, flag]);

    const handleClock = () => {
        if (flag) {
            setCurtime(new Date());
        }
    };

    const onClickStart = () => {
        setFlag(true);
    };

    const onClickEnd = () => {
        setFlag(false);
        clearInterval(interval);
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    //time step
    const handleClick2 = (event) => {
        setAnchorE2(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setAnchorE2(null);
    };

    const handleClose1 = (value) => {
        if (time_step >= value) {
            setTime_step(value / 2);
            setTime_interval(value)
        }
        else {
            setTime_interval(value)
        }
        clusterStore.pod_request(value, time_step, apilistinfo.cluster, apilistinfo.project, apilistinfo.name, "container_cpu|container_memory|pod_cpu|pod_memory|pod_net_bytes_transmitted|pod_net_bytes_received", "pod")

        setFlag(false);
        clearInterval(interval);
        setAnchorEl(null);
    };

    const handleClose2 = (value) => {

        if (time_interval <= value) {
            setTime_interval(value * 2);
            setTime_step(value)
        }
        else {
            setTime_step(value)
        }

        clusterStore.pod_request(time_interval, value, apilistinfo.cluster, apilistinfo.project, apilistinfo.name, "container_cpu|container_memory|pod_cpu|pod_memory|pod_net_bytes_transmitted|pod_net_bytes_received", "pod")

        // setContainer_cpu_data(clusterStore.container_cpu.filter(item => item.metric.container === apilistinfo.Podcontainers[0].name)[0].values)
        // setContainer_memory_data(clusterStore.container_memory.filter(item => item.metric.container === apilistinfo.Podcontainers[0].name)[0].values)
        // setPod_cpu_data(clusterStore.pod_cpu[0].values)
        // setPod_memory_data(clusterStore.pod_memory[0].values)
        // setPod_net_bytes_tran_data(clusterStore.pod_net_bytes_transmitted[0].values)
        // setPod_net_bytes_rec_data(clusterStore.pod_net_bytes_received[0].values)

        setFlag(false);
        clearInterval(interval);
        setAnchorE2(null);
    };


    let chipData = []
    if (apilistinfo.length !== 0) {
        chipData = apilistinfo.Podcontainers
    }

    const pod_cpu = clusterStore.pod_cpu
    const pod_memory = clusterStore.pod_memory
    const pod_net_bytes_rec = clusterStore.pod_net_bytes_received
    const pod_net_bytes_tran = clusterStore.pod_net_bytes_transmitted
    const container_cpu = clusterStore.container_cpu
    const container_memory = clusterStore.container_memory

    let pod_cpu_data = [[new Date(), 0], [new Date(), 0]]
    let pod_memory_data = [[new Date(), 0], [new Date(), 0]]
    let pod_net_bytes_rec_data = [[new Date(), 0], [new Date(), 0]]
    let pod_net_bytes_tran_data = [[new Date(), 0], [new Date(), 0]]

    let container_cpu_data = [[new Date(), 0], [new Date(), 0]]
    let container_memory_data = [[new Date(), 0], [new Date(), 0]]

    console.log(pod_cpu)

    if (pod_cpu !== undefined && pod_cpu.length > 0) {
        pod_cpu_data = pod_cpu[0].values
    }

    if (pod_memory !== undefined && pod_memory.length > 0) {
        pod_memory_data = pod_memory[0].values
    }
    if (pod_net_bytes_rec !== undefined && pod_net_bytes_rec.length > 0) {
        pod_net_bytes_rec_data = pod_net_bytes_rec[0].values
    }
    if (pod_net_bytes_tran !== undefined && pod_net_bytes_tran.length > 0) {
        pod_net_bytes_tran_data = pod_net_bytes_tran[0].values
    }

    if (container_cpu !== undefined && container_cpu.length > 0) {
        container_cpu_data = container_cpu.filter(item => item.metric.container === cpuContainer)[0].values
    }
    if (container_memory !== undefined && container_memory.length > 0) {
        container_memory_data = container_memory.filter(item => item.metric.container === memContainer)[0].values
    }


    const CpuClick = (container) => {
        console.info('You clicked the Cpu.', container);
        setCpuContainer(container)
    };

    const MemoryClick = (container) => {
        console.info('You clicked the Memory.', container);
        setMemContainer(container)
    };

    return (
        <React.Fragment>
            <div>
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
                </div>
                Pod Cpu
                <div style={{ height: "120px" }}><LineCharts kind={"net"} cluster_data={pod_cpu_data} /></div>

                <hr></hr>
                Pod Memory
                <div style={{ height: "120px" }}><LineCharts kind={"net"} cluster_data={pod_memory_data} /></div>

                <hr></hr>
                Pod Net In
                <div style={{ height: "120px" }}><LineCharts kind={"net"} cluster_data={pod_net_bytes_tran_data} /></div>

                <hr></hr>
                Pod Net Out
                <div style={{ height: "120px" }}><LineCharts kind={"net"} cluster_data={pod_net_bytes_rec_data} /></div>

                <hr></hr>
                Cpu
                <div style={{ height: "120px" }}><LineCharts kind={"cpu"} cluster_data={container_cpu_data} /></div>
                {chipData.map((data) => {
                    let icon;
                    if (data.label === 'React') {
                        icon = <TagFacesIcon />;
                    }
                    return (
                        <Chip label={data.name} onClick={() => CpuClick(data.name)} className={classes.chip} />
                    );
                })}
                <hr></hr>
                Memory
                <div style={{ height: "120px" }}><LineCharts kind={"memory"} cluster_data={container_memory_data} /></div>
                {chipData.map((data) => {
                    let icon;
                    if (data.label === 'React') {
                        icon = <TagFacesIcon />;
                    }
                    return (
                        <Chip label={data.name} onClick={() => MemoryClick(data.name)} className={classes.chip} />
                    );
                })}
                <hr></hr>
            </div >
        </React.Fragment>
    )

})

export default PodDetailMonit;