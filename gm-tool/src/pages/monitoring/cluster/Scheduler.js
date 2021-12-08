import React, { useState, useEffect, useRef } from "react";
import LineCharts from "../../AllCharts/recharts/LineCharts";
import { observer } from "mobx-react";

import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Fade from '@material-ui/core/Fade';
import store from "../../../store/Monitor/store/Store"

import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import IconButton from '@material-ui/core/IconButton';
import PauseIcon from '@material-ui/icons/Pause';

import PropTypes from 'prop-types';

import { makeStyles, useTheme } from '@material-ui/core/styles';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import ViewModuleIcon from '@material-ui/icons/ViewModule';

import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';
import Piechart from "./Piechart"

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      style={{ paddingTop: "5px" }}
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <div p={3} style={{}}>
          <div>{children}</div>
        </div>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}


const Scheduler = observer((props) => {

  const { clusterNameList = [] } = props;

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const theme = useTheme();
  //
  const { clusterStore } = store;

  const [time_interval, setTime_interval] = React.useState(60);
  const [time_step, setTime_step] = React.useState(10);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorE2, setAnchorE2] = React.useState(null);
  const [anchorE3, setAnchorE3] = React.useState(null);

  const open = Boolean(anchorEl);
  const open2 = Boolean(anchorE2);
  const open3 = Boolean(anchorE3);

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
      // clusterStore.test2(30, 5 / 60);
      clusterStore.real_shceduler_request(0, 1 / 60, clusterStore.cur_cluster, "scheduler_attempts|scheduler_attempts_total|scheduler_fail|scheduler_fail_total|scheduler_latency|pod_running|pod_quota|pod_util", "cluster");
      setCurtime(new Date());
    }
  };

  const cluster_menu_list = clusterNameList.map((item, index) => {
    return (
      <MenuItem onClick={() => handleClose3(item)}>{item}</MenuItem>
    )
  })

  const onClickStart = () => {
    clusterStore.shceduler_request(60, 1, clusterStore.cur_cluster, "scheduler_attempts|scheduler_attempts_total|scheduler_fail|scheduler_fail_total|scheduler_latency|pod_running|pod_quota|pod_util", "cluster");

    setFlag(true);
    clearInterval(interval);
  };

  const onClickEnd = () => {
    setFlag(false);
    clearInterval(interval);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setAnchorE2(null);
    setAnchorE3(null);
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

    clusterStore.shceduler_request(value, time_step, "all", "scheduler_attempts|scheduler_attempts_total|scheduler_fail|scheduler_fail_total|scheduler_latency|pod_running|pod_quota|pod_util", "cluster");
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

    clusterStore.shceduler_request(time_interval, value, "all", "scheduler_attempts|scheduler_attempts_total|scheduler_fail|scheduler_fail_total|scheduler_latency|pod_running|pod_quota|pod_util", "cluster");
    setFlag(false);
    clearInterval(interval);
    setAnchorE2(null);
  };

  const handleClick3 = (event) => {
    setAnchorE3(event.currentTarget);
  };

  const handleClose3 = (value) => {
    clusterStore.cur_cluster = value
    setFlag(false);
    clearInterval(interval);
    setAnchorE3(null);
  };

  const scheduler_attempt_total = clusterStore.scheduler_attempts_total.filter(item => item.metric.cluster == clusterStore.cur_cluster);
  const scheduler_fail_total = clusterStore.scheduler_fail_total.filter(item => item.metric.cluster == clusterStore.cur_cluster);
  const scheduler_attempts = clusterStore.scheduler_attempts.filter(item => item.metric.cluster == clusterStore.cur_cluster);
  const scheduler_fail = clusterStore.scheduler_fail.filter(item => item.metric.cluster == clusterStore.cur_cluster);

  const pod_running = clusterStore.pod_running.filter(item => item.metric.cluster == clusterStore.cur_cluster);
  const pod_quota = clusterStore.pod_quota.filter(item => item.metric.cluster == clusterStore.cur_cluster);
  const pod_util = clusterStore.pod_util.filter(item => item.metric.cluster == clusterStore.cur_cluster);

  let scheduler_attempt_total_data = [[new Date(), 0], [new Date(), 0]];
  let scheduler_attempt_data = [[new Date(), 0], [new Date(), 0]];
  let scheduler_fail_total_data = [[new Date(), 0], [new Date(), 0]];
  let scheduler_fail_data = [[new Date(), 0], [new Date(), 0]];

  let pod_running_data = [[new Date(), 0], [new Date(), 0]];
  let pod_quota_data = [[new Date(), 0], [new Date(), 0]];
  let pod_util_data = [[new Date(), 0], [new Date(), 0]];


  let now_scheduler_attempt_total_data = 0;
  let now_scheduler_attempt_data = 0;
  let now_scheduler_fail_total_data = 0;
  let now_scheduler_fail_data = 0;

  let now_pod_running_data = 0;
  let now_pod_quota_data = 0;
  let now_pod_util_data = 0;

  if (scheduler_attempt_total.length > 0) {
    scheduler_attempt_total_data = scheduler_attempt_total[0].values
    now_scheduler_attempt_total_data = scheduler_attempt_total_data[scheduler_attempt_total_data.length - 1][1]
    scheduler_fail_total_data = scheduler_fail_total[0].values
    now_scheduler_fail_total_data = scheduler_fail_total_data[scheduler_fail_total_data.length - 1][1]
    scheduler_attempt_data = scheduler_attempts[0].values
    now_scheduler_attempt_data = scheduler_attempt_data[scheduler_attempt_data.length - 1][1]
    scheduler_fail_data = scheduler_fail[0].values
    now_scheduler_fail_data = scheduler_fail_data[scheduler_fail_data.length - 1][1]

    pod_running_data = pod_running[0].values
    now_pod_running_data = pod_running_data[pod_running_data.length - 1][1]
    pod_quota_data = pod_quota[0].values
    now_pod_quota_data = pod_quota_data[pod_quota_data.length - 1][1]
    pod_util_data = pod_util[0].values
    now_pod_util_data = pod_util_data[pod_util_data.length - 1][1]
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
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ marginBottom: "auto", marginTop: "auto" }}>
          <Button variant="contained" color="primary" aria-controls="fade-menu" aria-haspopup="true" onClick={handleClick3}>
            {clusterStore.cur_cluster}
          </Button>
          <Menu
            id="fade-menu"
            anchorEl={anchorE3}
            keepMounted
            open={open3}
            onClose={handleClose}
            TransitionComponent={Fade}
          >
            {cluster_menu_list}
          </Menu>
        </div>
      </div>
      <hr></hr>
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        aria-label="full width tabs example"
      >
        <Tab label={"Attempt"} icon={<SystemUpdateAltIcon />}{...a11yProps(0)} />
        <Tab label={"fail"} icon={<HighlightOffIcon />}{...a11yProps(1)} />
        <Tab label={"Pod"} icon={<ViewModuleIcon />}{...a11yProps(2)} />

      </Tabs>
      {/* </Paper> */}
      <hr></hr>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {/* <div><h5>Allocated Resources</h5></div>
        <div>
          <hr></hr>
        </div> */}
        <div>
          {/* <Paper square> */}
          <TabPanel value={value} index={0} dir={theme.direction}>
            <div style={{ marginLeft: "3%", marginRight: "auto" }}>
              <h5 >Scheduler Info</h5>
              <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "2%" }}>
                <div style={{ display: "flex" }}>
                  {/* <MemorySharpIcon style={{ width: "50px", height: "50px" }} /> */}
                  <div style={{ marginTop: "auto", marginBottom: "auto" }}>
                    <div><h5>{now_scheduler_attempt_data} Pod</h5></div>
                    <div><h6>Attempt (1m)</h6></div>
                  </div>
                </div>
                <div style={{ display: "flex" }}>
                  {/* <MemorySharpIcon style={{ width: "50px", height: "50px" }} /> */}
                  <div style={{ marginTop: "auto", marginBottom: "auto" }}>
                    <div><h5>{now_scheduler_attempt_total_data} Pod</h5></div>
                    <div><h6>Total</h6></div>
                  </div>
                </div>

              </div>
            </div>
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>
            <div style={{ marginLeft: "3%", marginRight: "auto" }}>
              <h5 >Scheduler Info</h5>
              <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "2%" }}>
                <div style={{ display: "flex" }}>
                  {/* <StorageSharpIcon style={{ width: "50px", height: "50px" }} /> */}
                  <div style={{ marginTop: "auto", marginBottom: "auto" }}>
                    <div><h5>{now_scheduler_fail_data} Pod</h5></div>
                    <div><h6>Fail</h6></div>
                  </div>
                </div>
                <div style={{ display: "flex" }}>
                  {/* <StorageSharpIcon style={{ width: "50px", height: "50px" }} /> */}
                  <div style={{ marginTop: "auto", marginBottom: "auto" }}>
                    <div><h5>{now_scheduler_fail_total_data} Pod</h5></div>
                    <div><h6>Total</h6></div>
                  </div>
                </div>

              </div>
            </div>
          </TabPanel>
          <TabPanel value={value} index={2} dir={theme.direction}>
            <div style={{ marginLeft: "3%", marginRight: "auto" }}>
              <h5 >Scheduler Info</h5>
              <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "2%" }}>
                <div style={{ display: "flex" }}>
                  <div><Piechart data={now_pod_util_data} /></div>
                  <div style={{ marginTop: "auto", marginBottom: "auto" }}>
                    <div><h5>{now_pod_util_data} %</h5></div>
                    <div><h6>Pod</h6></div>
                  </div>
                </div>
                <div style={{ display: "flex" }}>
                  {/* <StorageSharpIcon style={{ width: "50px", height: "50px" }} /> */}
                  <div style={{ marginTop: "auto", marginBottom: "auto" }}>
                    <div><h5>{now_pod_running_data} Pod</h5></div>
                    <div><h6>Used</h6></div>
                  </div>
                </div>
                <div style={{ display: "flex" }}>
                  {/* <StorageSharpIcon style={{ width: "50px", height: "50px" }} /> */}
                  <div style={{ marginTop: "auto", marginBottom: "auto" }}>
                    <div><h5>{now_pod_quota_data} Pod</h5></div>
                    <div><h6>Quota</h6></div>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>

          <hr></hr>
          <TabPanel value={value} index={0} dir={theme.direction}>
            <div style={{ marginLeft: "3%", marginRight: "auto" }}>
              {timeSet}
              <h5 >Attempt</h5>
              <div style={{ height: "120px" }}><LineCharts kind={"attempt"} cluster_data={scheduler_attempt_data} /></div>
              <hr></hr>
              <h5 >Total</h5>
              <div style={{ height: "120px" }}><LineCharts kind={"attempt"} cluster_data={scheduler_attempt_total_data} /></div>
            </div>
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>
            <div style={{ marginLeft: "3%", marginRight: "auto" }}>
              {timeSet}
              <h5 >Fail</h5>
              <div style={{ height: "120px" }}><LineCharts kind={"fail"} cluster_data={scheduler_fail_data} /></div>
              <hr></hr>
              <h5 >Total</h5>
              <div style={{ height: "120px" }}><LineCharts kind={"fail"} cluster_data={scheduler_fail_total_data} /></div>
            </div>
          </TabPanel>
          <TabPanel value={value} index={2} dir={theme.direction}>
            <div style={{ marginLeft: "3%", marginRight: "auto" }}>
              {timeSet}
              <h5 >Used</h5>
              <div style={{ height: "120px" }}><LineCharts kind={"pod"} cluster_data={pod_running_data} /></div>
              <hr></hr>
              <h5 >Total</h5>
              <div style={{ height: "120px" }}><LineCharts kind={"pod"} cluster_data={pod_quota_data} /></div>
            </div>
          </TabPanel>
        </div>
        <div>
          <hr></hr>
        </div>
      </div>
    </div >
  )

})

export default Scheduler;