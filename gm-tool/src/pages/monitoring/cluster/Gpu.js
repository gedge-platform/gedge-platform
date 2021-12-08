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


const Gpu = observer((props) => {
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
  const [anchorE4, setAnchorE4] = React.useState(null);

  const open = Boolean(anchorEl);
  const open2 = Boolean(anchorE2);
  const open3 = Boolean(anchorE3);
  const open4 = Boolean(anchorE4);

  const [cur_cluster, setCur_cluster] = React.useState("");
  const [cur_gpu_info, setCur_gpu_info] = React.useState({ "gpu_name": "none", "gpu_uuid": "" });
  const [curtime, setCurtime] = React.useState(new Date());
  const [flag, setFlag] = React.useState(false);

  const interval = useRef();

  const cluster_list = clusterStore.cluster_list;
  let clusters = [];
  let cluster_first = "";

  cluster_list.map((item) => {
    clusters.push({ cluster: item.metric.cluster })
  })

  const cluster_menu_list = clusters.map((item, index) => {
    if (index == 0) {
      cluster_first = item.cluster
    }
    return (
      <MenuItem onClick={() => handleClose3(item.cluster)}>{item.cluster}</MenuItem>
    )
  })

  const gpu_list = clusterStore.gpu_list;
  let gpu_first = { "gpu_name": "none", "gpu_uuid": "" }
  let gpu_list_test = [];

  if (cur_cluster == "") {
    gpu_list_test = gpu_list.filter((item) => (item.metric.cluster == cluster_first))
  }
  else{
    gpu_list_test = gpu_list.filter((item) => (item.metric.cluster == cur_cluster))
  }

  const cluster_gpu_list = gpu_list_test.map((item, index) => {
    if (index == 0) {
      gpu_first.gpu_name = item.metric.name
      gpu_first.gpu_uuid = item.metric.uuid
    }
    return (
      <MenuItem onClick={() => handleClose4(item.metric.name, item.metric.uuid)}>{item.metric.name}</MenuItem>
    )
  })
  
  useEffect(() => {
    interval.current = setInterval(() => handleClock(), 1000);

    return () => {
      //component willmount 부분
      clearInterval(interval.current);
    };
    //상태값이 변할때마다 다시 렌더링 한다.
  }, [time_interval, time_step, curtime, flag, cur_cluster]);

  const handleClock = () => {
    if (flag) {
      clusterStore.cluster_apiserver_request_rate(time_interval, time_step)
      setCurtime(new Date());
    }
  };

  const onClickStart = () => {
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
    setAnchorE4(null);
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

    clusterStore.cluster_apiserver_request_rate(value, time_step);
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

    clusterStore.cluster_apiserver_request_rate(time_interval, value);
    setAnchorE2(null);
  };

  const handleClick3 = (event) => {
    setAnchorE3(event.currentTarget);
  };

  const handleClose3 = (value) => {
    setCur_cluster(value);
    setAnchorE3(null);
  };


  const handleClick4 = (event) => {
    setAnchorE4(event.currentTarget);
  };

  const handleClose4 = (name,uuid) => {
    setCur_gpu_info({ "gpu_name": name, "gpu_uuid": uuid });
    setAnchorE4(null);
  };

  let gpu_temperature = [];
  let gpu_power = [];
  let gpu_power_limit = [];
  let gpu_memory_total = [];
  let gpu_memory_used = [];
  let gpu_memory_free = [];
  let gpu_ratio = [];
  let gpu_memory_ratio = [];
  let gpu_fan_speed_ratio = [];

  let gpu_temperature_data = 0;
  let gpu_power_data = 0;
  let gpu_power_limit_data = 0;

  let gpu_memory_total_data = 0;
  let gpu_memory_used_data = 0;
  let gpu_memory_free_data = 0;

  let gpu_ratio_data = 0;
  let gpu_memory_ratio_data = 0;
  let gpu_fan_speed_ratio_data = 0;

  if (gpu_first.gpu_name != "none") {
    
    gpu_temperature = clusterStore.gpu_temperature;
    gpu_power = clusterStore.gpu_power;
    gpu_power_limit = clusterStore.gpu_power_limit;
    gpu_memory_total = clusterStore.gpu_memory_total;
    gpu_memory_used = clusterStore.gpu_memory_used;
    gpu_memory_free = clusterStore.gpu_memory_free;
    gpu_ratio = clusterStore.gpu_ratio;
    gpu_memory_ratio = clusterStore.gpu_memory_ratio;
    gpu_fan_speed_ratio = clusterStore.gpu_fan_speed_ratio;

    if (cur_gpu_info.gpu_name == "none" && gpu_temperature.length > 0) {
      gpu_temperature = gpu_temperature.filter((item) => (item.metric.uuid == gpu_first.gpu_uuid));      
      gpu_power = gpu_power.filter((item) => (item.metric.uuid == gpu_first.gpu_uuid));    
      gpu_power_limit = gpu_power_limit.filter((item) => (item.metric.uuid == gpu_first.gpu_uuid));    
      gpu_memory_total = gpu_memory_total.filter((item) => (item.metric.uuid == gpu_first.gpu_uuid));      
      gpu_memory_used = gpu_memory_used.filter((item) => (item.metric.uuid == gpu_first.gpu_uuid));   
      gpu_memory_free = gpu_memory_free.filter((item) => (item.metric.uuid == gpu_first.gpu_uuid));   
      gpu_ratio = gpu_ratio.filter((item) => (item.metric.uuid == gpu_first.gpu_uuid));    
      gpu_memory_ratio = gpu_memory_ratio.filter((item) => (item.metric.uuid == gpu_first.gpu_uuid));    
      gpu_fan_speed_ratio = gpu_fan_speed_ratio.filter((item) => (item.metric.uuid == gpu_first.gpu_uuid));    
    }
    else if (gpu_temperature.length > 0){
      gpu_temperature = gpu_temperature.filter((item) => (item.metric.uuid == cur_gpu_info.gpu_uuid));
      gpu_power = gpu_power.filter((item) => (item.metric.uuid == cur_gpu_info.gpu_uuid));
      gpu_power_limit = gpu_power_limit.filter((item) => (item.metric.uuid == cur_gpu_info.gpu_uuid));
      gpu_memory_total = gpu_memory_total.filter((item) => (item.metric.uuid == cur_gpu_info.gpu_uuid));
      gpu_memory_used = gpu_memory_used.filter((item) => (item.metric.uuid == cur_gpu_info.gpu_uuid));
      gpu_memory_free = gpu_memory_free.filter((item) => (item.metric.uuid == cur_gpu_info.gpu_uuid));
      gpu_ratio = gpu_ratio.filter((item) => (item.metric.uuid == cur_gpu_info.gpu_uuid));
      gpu_memory_ratio = gpu_memory_ratio.filter((item) => (item.metric.uuid == cur_gpu_info.gpu_uuid));
      gpu_fan_speed_ratio = gpu_fan_speed_ratio.filter((item) => (item.metric.uuid == cur_gpu_info.gpu_uuid));
    }
  }
  else {
    gpu_temperature = [[0, 0], [0, 0], [0, 0]];
    gpu_power = [[0, 0], [0, 0], [0, 0]];
    // gpu_power_limit = [[0, 0], [0, 0], [0, 0]];
    gpu_memory_total = [[0, 0], [0, 0], [0, 0]];
    gpu_memory_used = [[0, 0], [0, 0], [0, 0]];
    // gpu_memory_free = [[0, 0], [0, 0], [0, 0]];
    gpu_ratio = [[0, 0], [0, 0], [0, 0]];
    gpu_memory_ratio = [[0, 0], [0, 0], [0, 0]];
    gpu_fan_speed_ratio = [[0, 0], [0, 0], [0, 0]];
  }

  if (gpu_temperature.length && gpu_power.length && gpu_power.length && gpu_power_limit.length && gpu_memory_total.length && gpu_memory_used.length && gpu_memory_free.length && gpu_ratio.length && gpu_memory_ratio.length && gpu_fan_speed_ratio.length) {
    gpu_temperature = gpu_temperature[0].values;
    gpu_temperature_data = gpu_temperature[gpu_temperature.length - 1][1];
    gpu_power = gpu_power[0].values;
    gpu_power_data = gpu_power[gpu_power.length - 1][1];
    gpu_power_limit = gpu_power_limit[0].values;
    gpu_power_limit_data = gpu_power_limit[gpu_power_limit.length - 1][1];
    gpu_memory_total = gpu_memory_total[0].values;
    gpu_memory_total_data = gpu_memory_total[gpu_memory_total.length - 1][1];
    gpu_memory_used = gpu_memory_used[0].values;
    gpu_memory_used_data = gpu_memory_used[gpu_memory_used.length - 1][1];
    gpu_memory_free = gpu_memory_free[0].values;
    gpu_memory_free_data = gpu_memory_free[gpu_memory_free.length - 1][1];
    gpu_ratio = gpu_ratio[0].values;
    gpu_ratio_data = gpu_ratio[gpu_ratio.length - 1][1];
    gpu_memory_ratio = gpu_memory_ratio[0].values;
    gpu_memory_ratio_data = gpu_memory_ratio[gpu_memory_ratio.length - 1][1];
    gpu_fan_speed_ratio = gpu_fan_speed_ratio[0].values;
    gpu_fan_speed_ratio_data = gpu_fan_speed_ratio[gpu_fan_speed_ratio.length - 1][1];
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
      <hr></hr>
      <div style={{ display: "flex" }}>
        
          <div style={{ marginBottom: "auto", marginTop: "auto" }}>
            <Button variant="contained" color="primary" aria-controls="fade-menu" aria-haspopup="true" onClick={handleClick3}>
              {cur_cluster == "" ? cluster_first : cur_cluster}
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
        
        <div style={{ marginBottom: "auto", marginTop: "auto" }}>
          <Button variant="contained" color="primary" aria-controls="fade-menu" aria-haspopup="true" onClick={handleClick4}>
            {gpu_first.gpu_name == "none" ? gpu_first.gpu_name : cur_gpu_info.gpu_name == "none" ? gpu_first.gpu_name : cur_gpu_info.gpu_name}
          </Button>
          {cluster_gpu_list.length > 0 ?
            <Menu
            id="fade-menu"
            anchorEl={anchorE4}
            keepMounted
            open={open4}
            onClose={handleClose}
            TransitionComponent={Fade}
          >
            {cluster_gpu_list}
            </Menu>
            : ""}
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
        <Tab label={"Gpu"} icon={<CallReceivedIcon />}{...a11yProps(0)} />
        <Tab label={"Memory"} icon={<CallMissedIcon />}{...a11yProps(1)} />
        <Tab label={"Etc"} icon={<CallMissedIcon />} {...a11yProps(2)} />

      </Tabs>
      {/* </Paper> */}
      <hr></hr>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div>
          {/* <Paper square> */}
          <TabPanel value={value} index={0} dir={theme.direction}>
            <div style={{ marginLeft: "3%", marginRight: "auto" }}>
              <h5 >GPU Info</h5>
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                <div style={{ display: "flex" }}>
                  {/* <StorageSharpIcon style={{ width: "50px", height: "50px" }} /> */}
                  <div style={{ marginTop: "auto", marginBottom: "auto" }}>
                    <div><h5>{gpu_ratio_data} %</h5></div>
                    <div><h6>GPU</h6></div>
                  </div>
                </div>
                <div style={{ display: "flex" }}>         
                  <div style={{ marginTop: "auto", marginBottom: "auto" }}>
                    <div><h5>{gpu_ratio_data}test </h5></div>
                    <div><h6>Name</h6></div>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>
            <div style={{ marginLeft: "3%", marginRight: "auto" }}>
              <h5 >GPU Info</h5>
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                <div style={{ display: "flex" }}>
                  {/* <StorageSharpIcon style={{ width: "50px", height: "50px" }} /> */}
                  <div style={{ marginTop: "auto", marginBottom: "auto" }}>
                    <div><h5>{gpu_memory_ratio_data } %</h5></div>
                    <div><h6>Memory</h6></div>
                  </div>
                </div>
                <div style={{ display: "flex" }}>
                  
                  <div style={{ marginTop: "auto", marginBottom: "auto" }}>
                    <div><h5>{gpu_memory_used_data } MiB</h5></div>
                    <div><h6>Used</h6></div>
                  </div>
                </div>
                <div style={{ display: "flex" }}>
                  
                  <div style={{ marginTop: "auto", marginBottom: "auto" }}>
                    <div><h5>{gpu_memory_total_data } MiB</h5></div>
                    <div><h6>Total</h6></div>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>
          <TabPanel value={value} index={2} dir={theme.direction}>
            <div style={{ marginLeft: "3%", marginRight: "auto" }}>
              <h5 >GPU Info</h5>
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                <div style={{ display: "flex" }}>
                  {/* <StorageSharpIcon style={{ width: "50px", height: "50px" }} /> */}
                  <div style={{ marginTop: "auto", marginBottom: "auto" }}>
                    <div><h5>{gpu_power_data} / {gpu_power_limit_data} Watt</h5></div>
                    <div><h6>Power</h6></div>
                  </div>
                </div>
                <div style={{ display: "flex" }}>
                  {/* <StorageSharpIcon style={{ width: "50px", height: "50px" }} /> */}
                  <div style={{ marginTop: "auto", marginBottom: "auto" }}>
                    <div><h5>{gpu_temperature_data } C</h5></div>
                    <div><h6>Temperature</h6></div>
                  </div>
                </div>
                <div style={{ display: "flex" }}>
                  {/* <StorageSharpIcon style={{ width: "50px", height: "50px" }} /> */}
                  <div style={{ marginTop: "auto", marginBottom: "auto" }}>
                    <div><h5>{gpu_fan_speed_ratio_data } %</h5></div>
                    <div><h6>Fan</h6></div>
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
              <div style={{ height: "120px" }}><LineCharts kind={"Gpu"} cluster_data={gpu_ratio}/></div>
              {/* cluster_data={gpu_temperature} */}
              <h5 >Total</h5>
              <div style={{ height: "120px" }}><LineCharts kind={"Gpu"} cluster_data={gpu_ratio}/></div>
            </div>
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>
            <div style={{ marginLeft: "3%", marginRight: "auto" }}>
              <h5 >GPU</h5>
              <div style={{ height: "120px" }}><LineCharts kind={"Memory"} cluster_data={gpu_memory_ratio}/></div>
              <h5 >Total</h5>
              <div style={{ height: "120px" }}><LineCharts kind={"Memory"} cluster_data={gpu_memory_used} /></div>
              <h5 >Total</h5>
              <div style={{ height: "120px" }}><LineCharts kind={"Memory"} cluster_data={gpu_memory_total} /></div>
            </div>
          </TabPanel>
          <TabPanel value={value} index={2} dir={theme.direction}>
            <div style={{ marginLeft: "3%", marginRight: "auto" }}>
              <h5 >GPU</h5>
              <div style={{ height: "120px" }}><LineCharts kind={"Power"} cluster_data={gpu_power}/></div>
              <h5 >Total</h5>
              <div style={{ height: "120px" }}><LineCharts kind={"Temp"} cluster_data={gpu_temperature} /></div>
              <h5 >Total</h5>
              <div style={{ height: "120px" }}><LineCharts kind={"Fan"} cluster_data={gpu_fan_speed_ratio} /></div>
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

export default Gpu;
