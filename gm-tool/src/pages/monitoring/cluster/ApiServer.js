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

import CallReceivedIcon from '@material-ui/icons/CallReceived';
import CallMissedIcon from '@material-ui/icons/CallMissed';

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


const ApiServer = observer((props) => {

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

  // const [cur_cluster, setCur_cluster] = React.useState(clusterStore.cur_cluster);
  const [curtime, setCurtime] = React.useState(new Date());
  const [flag, setFlag] = React.useState(false);

  const interval = useRef();

  useEffect(() => {
    setFlag(false);
    clearInterval(interval);
  }, [value])

  useEffect(() => {
    interval.current = setInterval(() => handleClock(), 5000);
    return () => {
      clearInterval(interval.current);
    };
  }, [time_interval, time_step, curtime, flag]);

  const handleClock = () => {
    if (flag) {
      clusterStore.real_apiserver_request(0, 1 / 60, clusterStore.cur_cluster, "apiserver_request_rate", "cluster");
      setCurtime(new Date());
    }
  };

  const cluster_menu_list = clusterNameList.map((item, index) => {
    return (
      <MenuItem onClick={() => handleClose3(item)}>{item}</MenuItem>
    )
  })

  const onClickStart = () => {
    clusterStore.apiserver_request(60, 1, clusterStore.cur_cluster, "apiserver_request_rate", "cluster");
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
    clusterStore.apiserver_request(value, time_step, "all", "apiserver_request_rate", "cluster");
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
    clusterStore.apiserver_request(time_interval, value, "all", "apiserver_request_rate", "cluster");
    setFlag(false);
    clearInterval(interval);
    setAnchorE2(null);
  };

  const handleClick3 = (event) => {
    setAnchorE3(event.currentTarget);
  };

  const handleClose3 = (value) => {
    clusterStore.cur_cluster = value;
    setFlag(false);
    clearInterval(interval);
    setAnchorE3(null);
  };

  const apiserver_request_rate = clusterStore.apiserver_request_rate.filter(item => item.metric.cluster == clusterStore.cur_cluster);
  // const apiserver_latency = clusterStore.apiserver_latency.filter(item => item.metric.cluster == clusterStore.cur_cluster);

  let apiserver_request_rate_data = [[new Date(), 0], [new Date(), 0]];;
  // let apiserver_latency_data = [[new Date(), 0], [new Date(), 0]];;

  let now_apiserver_request_rate_data = 0;
  // let now_apiserver_latency_data = 0;

  if (apiserver_request_rate.length > 0) {
    apiserver_request_rate_data = apiserver_request_rate[0].values
    now_apiserver_request_rate_data = apiserver_request_rate_data[apiserver_request_rate_data.length - 1][1]

    // apiserver_latency_data = apiserver_latency[0].values
    // now_apiserver_latency_data = apiserver_latency_data[apiserver_latency_data.length - 1][1]
  }



  // console.log(apiserver_request_rate_data)

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
        <Tab label={"Request"} icon={<CallReceivedIcon />}{...a11yProps(0)} />
        <Tab label={"Latency"} icon={<CallMissedIcon />}{...a11yProps(1)} />
        <Tab label={""} disabled {...a11yProps(2)} />

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
              <h5 >ApiServer Info</h5>
              <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "2%" }}>
                <div style={{ display: "flex" }}>
                  {/* <MemorySharpIcon style={{ width: "50px", height: "50px" }} /> */}
                  <div style={{ marginTop: "auto", marginBottom: "auto" }}>
                    <div><h5>{now_apiserver_request_rate_data} times/s</h5></div>
                    <div><h6>Per Second</h6></div>
                  </div>
                </div>
                <div style={{ display: "flex" }}>
                  {/* <MemorySharpIcon style={{ width: "50px", height: "50px" }} /> */}
                  <div style={{ marginTop: "auto", marginBottom: "auto" }}>
                    {/* <div><h5>{now_apiserver_latency_data} ms</h5></div> */}
                    <div><h6>Latency</h6></div>
                  </div>
                </div>

              </div>
            </div>
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>
            <div style={{ marginLeft: "3%", marginRight: "auto" }}>
              <h5 >ApiServer Info</h5>
              <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "2%" }}>
                <div style={{ display: "flex" }}>
                  {/* <StorageSharpIcon style={{ width: "50px", height: "50px" }} /> */}
                  <div style={{ marginTop: "auto", marginBottom: "auto" }}>
                    <div><h5>{now_apiserver_request_rate_data} times/s</h5></div>
                    <div><h6>Per Second</h6></div>
                  </div>
                </div>
                <div style={{ display: "flex" }}>
                  {/* <StorageSharpIcon style={{ width: "50px", height: "50px" }} /> */}
                  <div style={{ marginTop: "auto", marginBottom: "auto" }}>
                    {/* <div><h5>{now_apiserver_latency_data} ms</h5></div> */}
                    <div><h6>Latency</h6></div>
                  </div>
                </div>

              </div>
            </div>
          </TabPanel>

          <hr></hr>
          {timeSet}
          <TabPanel value={value} index={0} dir={theme.direction}>
            <div style={{ marginLeft: "3%", marginRight: "auto" }}>
              <h5 >Request</h5>
              <div style={{ height: "120px" }}><LineCharts kind={"times"} cluster_data={apiserver_request_rate_data} /></div>
              <h5 >Latency</h5>
              {/* <div style={{ height: "120px" }}><LineCharts kind={"ms"} cluster_data={apiserver_latency_data} /></div> */}
            </div>
          </TabPanel>

          <TabPanel value={value} index={1} dir={theme.direction}>
            <div style={{ marginLeft: "3%", marginRight: "auto" }}>
              <h5 >Fail</h5>
              {/* <div style={{ height: "120px" }}><LineCharts /></div> */}
              <h5 >Total</h5>
              {/* <LineCharts kind={"fail"} cluster_data={schedule_data4} /> */}
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

export default ApiServer;