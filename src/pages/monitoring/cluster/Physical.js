import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import LineCharts from "../../AllCharts/recharts/LineCharts";
// import PieCharts from "../../AllCharts/recharts/PieCharts";
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

import MemorySharpIcon from '@material-ui/icons/MemorySharp';
import StorageSharpIcon from '@material-ui/icons/StorageSharp';

import Piechart from "./Piechart"

//tab 패널 
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
//tab 패널 
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};
//tab 패널 
function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const Physical = observer((props) => {

  const { clusterNameList = [] } = props;

  //tab index value
  const [value, setValue] = React.useState(0);
  //tab index change
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const theme = useTheme();
  //store 호출
  const { clusterStore } = store;

  // API 호출시 time interval, step 설정
  const [time_interval, setTime_interval] = React.useState(60);
  const [time_step, setTime_step] = React.useState(10);
  // 메뉴 컴포넌트 on,off
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorE2, setAnchorE2] = React.useState(null);
  const [anchorE3, setAnchorE3] = React.useState(null);

  const open = Boolean(anchorEl);
  const open2 = Boolean(anchorE2);
  const open3 = Boolean(anchorE3);
  //시간 설정
  // const [cur_cluster, setCur_cluster] = React.useState(clusterStore.cur_cluster);
  const [curtime, setCurtime] = React.useState(new Date());
  // 실시간 동작을 위한 flag
  const [flag, setFlag] = React.useState(false);
  // 실시간 동작을 위한 useRef
  const interval = useRef();

  useEffect(() => {
    setFlag(false);
    clearInterval(interval);
  }, [value])

  useEffect(() => {
    // 시간 값 변화 5초마다 변화
    interval.current = setInterval(() => handleClock(), 5000);
    return () => {
      //component willmount 부분
      clearInterval(interval.current);
    };
    //상태값이 변할때마다 다시 렌더링 한다.
  }, [time_interval, time_step, curtime, flag]);

  // 실시간 변화를 위한 함수 useeffect 에서 연결
  const handleClock = () => {
    if (flag) { //flag로 on/off
      clusterStore.real_physical_request(0, 1 / 60, clusterStore.cur_cluster, "cpu_util|cpu_usage|cpu_total|memory_util|memory_usage|memory_total|disk_util|disk_usage|disk_total", "cluster");
      setCurtime(new Date());
    }
  };

  const cluster_menu_list = clusterNameList.map((item, index) => {
    return (
      <MenuItem onClick={() => handleClose3(item)}>{item}</MenuItem>
    )
  })
  //실시간 함수
  const onClickStart = () => {
    clusterStore.physical_request(60, 1, clusterStore.cur_cluster, "cpu_util|cpu_usage|cpu_total|memory_util|memory_usage|memory_total|disk_util|disk_usage|disk_total", "cluster");
    setFlag(true);
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

  //time interval
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

    clusterStore.physical_request(value, time_step, "all", "cpu_util|cpu_usage|cpu_total|memory_util|memory_usage|memory_total|disk_util|disk_usage|disk_total", "cluster");
    setFlag(false);
    clearInterval(interval);
    setAnchorEl(null);
  };

  //time step
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

    clusterStore.physical_request(time_interval, value, "all", "cpu_util|cpu_usage|cpu_total|memory_util|memory_usage|memory_total|disk_util|disk_usage|disk_total", "cluster");
    setFlag(false);
    clearInterval(interval);
    setAnchorE2(null);
  };

  //clusterMenu
  const handleClick3 = (event) => {
    setAnchorE3(event.currentTarget);
  };

  const handleClose3 = (value) => {
    clusterStore.cur_cluster = value
    setFlag(false);
    clearInterval(interval);
    setAnchorE3(null);
  };

  let cpu_util = []
  let cpu_usage = []
  let cpu_total = []
  let memory_util = []
  let memory_usage = []
  let memory_total = []
  let disk_util = []
  let disk_usage = []
  let disk_total = []

  if (clusterStore.cpu_util !== undefined) {
    cpu_util = clusterStore.cpu_util.filter(item => item.metric.cluster == clusterStore.cur_cluster);
  }
  if (clusterStore.cpu_usage !== undefined) {
    cpu_usage = clusterStore.cpu_usage.filter(item => item.metric.cluster == clusterStore.cur_cluster);
  }
  if (clusterStore.cpu_total !== undefined) {
    cpu_total = clusterStore.cpu_total.filter(item => item.metric.cluster == clusterStore.cur_cluster);
  }
  if (clusterStore.memory_util !== undefined) {
    memory_util = clusterStore.memory_util.filter(item => item.metric.cluster == clusterStore.cur_cluster);
  }
  if (clusterStore.memory_usage !== undefined) {
    memory_usage = clusterStore.memory_usage.filter(item => item.metric.cluster == clusterStore.cur_cluster);
  }
  if (clusterStore.memory_total !== undefined) {
    memory_total = clusterStore.memory_total.filter(item => item.metric.cluster == clusterStore.cur_cluster);
  }
  if (clusterStore.disk_util !== undefined) {
    disk_util = clusterStore.disk_util.filter(item => item.metric.cluster == clusterStore.cur_cluster);
  }
  if (clusterStore.disk_usage !== undefined) {
    disk_usage = clusterStore.disk_usage.filter(item => item.metric.cluster == clusterStore.cur_cluster);
  }
  if (clusterStore.disk_total !== undefined) {
    disk_total = clusterStore.disk_total.filter(item => item.metric.cluster == clusterStore.cur_cluster);
  }


  let cpu_util_data = [[new Date(), 0], [new Date(), 0]];
  let cpu_usage_data = [[new Date(), 0], [new Date(), 0]];
  let cpu_total_data = [[new Date(), 0], [new Date(), 0]];

  let memory_util_data = [[new Date(), 0], [new Date(), 0]];
  let memory_usage_data = [[new Date(), 0], [new Date(), 0]];
  let memory_total_data = [[new Date(), 0], [new Date(), 0]];

  let disk_util_data = [[new Date(), 0], [new Date(), 0]];
  let disk_usage_data = [[new Date(), 0], [new Date(), 0]];
  let disk_total_data = [[new Date(), 0], [new Date(), 0]];

  let now_cpu_util_data = 0;
  let now_cpu_usage_data = 0;
  let now_cpu_total_data = 0;

  let now_memory_util_data = 0;
  let now_memory_usage_data = 0;
  let now_memory_total_data = 0;

  let now_disk_util_data = 0;
  let now_disk_usage_data = 0;
  let now_disk_total_data = 0;

  if (cpu_util.length > 0) {
    cpu_util_data = cpu_util[0].values
    now_cpu_util_data = cpu_util_data[cpu_util_data.length - 1][1]
  }
  if (cpu_usage.length > 0) {
    cpu_usage_data = cpu_usage[0].values
    now_cpu_usage_data = cpu_usage_data[cpu_usage_data.length - 1][1]
  }
  if (cpu_total.length > 0) {
    cpu_total_data = cpu_total[0].values
    now_cpu_total_data = cpu_total_data[cpu_total_data.length - 1][1]
  }
  if (memory_util.length > 0) {
    memory_util_data = memory_util[0].values
    now_memory_util_data = memory_util_data[memory_util_data.length - 1][1]
  }
  if (memory_usage.length > 0) {
    memory_usage_data = memory_usage[0].values
    now_memory_usage_data = memory_usage_data[memory_usage_data.length - 1][1]
  }
  if (memory_total.length > 0) {
    memory_total_data = memory_total[0].values
    now_memory_total_data = memory_total_data[memory_total_data.length - 1][1]
  }
  if (disk_util.length > 0) {
    disk_util_data = disk_util[0].values
    now_disk_util_data = disk_util_data[disk_util_data.length - 1][1]
  }
  if (disk_usage.length > 0) {
    disk_usage_data = disk_usage[0].values
    now_disk_usage_data = disk_usage_data[disk_usage_data.length - 1][1]
  }
  if (disk_total.length > 0) {
    disk_total_data = disk_total[0].values
    now_disk_total_data = disk_total_data[disk_total_data.length - 1][1]
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
        <Tab label={"CPU"} icon={<MemorySharpIcon />}{...a11yProps(0)} />
        <Tab label={"Memory"} icon={<MemorySharpIcon />}{...a11yProps(1)} />
        <Tab label={"Storage"} icon={<StorageSharpIcon />}{...a11yProps(2)} />

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
              <h5 >CPU Info</h5>
              <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "2%" }}>
                <div style={{ display: "flex", width: "18%" }}>
                  <div><Piechart data={now_cpu_util_data} /></div>
                  <div style={{ margin: "auto" }}>
                    <div><h5>{now_cpu_util_data} %</h5></div>
                    <div><h6>CPU</h6></div>
                  </div>
                </div>
                <div style={{ display: "flex" }}>
                  {/* <MemorySharpIcon style={{width:"50px",height:"50px"}}/> */}
                  <div style={{ marginTop: "auto", marginBottom: "auto" }}>
                    <div><h5>{now_cpu_usage_data} Core</h5></div>
                    <div><h6>Used</h6></div>
                  </div>
                </div>
                <div style={{ display: "flex" }}>
                  {/* <MemorySharpIcon style={{ width: "50px", height: "50px" }} /> */}
                  <div style={{ marginTop: "auto", marginBottom: "auto" }}>
                    <div><h5>{now_cpu_total_data} Core</h5></div>
                    <div><h6>Total</h6></div>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>
            <div style={{ marginLeft: "3%", marginRight: "auto" }}>
              <h5 >Memory Info</h5>
              <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "2%" }}>
                <div style={{ display: "flex", width: "18%" }}>
                  <div ><Piechart data={now_memory_util_data} /></div>
                  <div style={{ margin: "auto" }}>
                    <div><h5>{now_memory_util_data} %</h5></div>
                    <div><h6>Memory</h6></div>
                  </div>
                </div>
                <div style={{ display: "flex" }}>
                  {/* <StorageSharpIcon style={{ width: "50px", height: "50px" }} /> */}
                  <div style={{ marginTop: "auto", marginBottom: "auto" }}>
                    <div><h5>{now_memory_usage_data} Gi</h5></div>
                    <div><h6>Used</h6></div>
                  </div>
                </div>
                <div style={{ display: "flex" }}>
                  {/* <StorageSharpIcon style={{ width: "50px", height: "50px" }} /> */}
                  <div style={{ marginTop: "auto", marginBottom: "auto" }}>
                    <div><h5>{now_memory_total_data} Gi</h5></div>
                    <div><h6>Total</h6></div>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>
          <TabPanel value={value} index={2} dir={theme.direction}>
            <div style={{ marginLeft: "3%", marginRight: "auto" }}>
              <h5 >Disk Info</h5>
              <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "2%" }}>
                <div style={{ display: "flex", width: "18%" }}>
                  <div ><Piechart data={now_disk_util_data} /></div>
                  <div style={{ margin: "auto" }}>
                    <div><h5>{now_disk_util_data} %</h5></div>
                    <div><h6>Disk</h6></div>
                  </div>
                </div>
                <div style={{ display: "flex" }}>
                  {/* <StorageSharpIcon style={{ width: "50px", height: "50px" }} /> */}
                  <div style={{ marginTop: "auto", marginBottom: "auto" }}>
                    <div><h5>{now_disk_usage_data} GB</h5></div>
                    <div><h6>Used</h6></div>
                  </div>
                </div>
                <div style={{ display: "flex" }}>
                  {/* <StorageSharpIcon style={{ width: "50px", height: "50px" }} /> */}
                  <div style={{ marginTop: "auto", marginBottom: "auto" }}>
                    <div><h5>{now_disk_total_data} GB</h5></div>
                    <div><h6>Total</h6></div>
                  </div>
                </div>

              </div>
            </div>
          </TabPanel>
          <hr></hr>
          {/* <div>
            <h5>Resource Usage Status</h5>
          </div>
          <div>
            <hr></hr>
          </div> */}
          <TabPanel value={value} index={0} dir={theme.direction}>
            <div style={{ marginLeft: "1%", marginRight: "auto" }}>
              {timeSet}
              <div><h5 >Utilization (%)</h5></div>
              <div style={{ height: "120px" }}><LineCharts kind={"cpu"} cluster_data={cpu_util_data} /></div>
              <hr></hr>
              <h5 >Used (Core)</h5>
              <div style={{ height: "120px" }}><LineCharts kind={"core"} cluster_data={cpu_usage_data} /></div>
              <hr></hr>
              <h5 >Total (Core)</h5>
              <div style={{ height: "120px" }}><LineCharts kind={"core"} cluster_data={cpu_total_data} /></div>
            </div>
          </TabPanel>

          <TabPanel value={value} index={1} dir={theme.direction}>
            <div style={{ marginLeft: "1%", marginRight: "auto" }}>
              {timeSet}
              <h5 >Utilization (%)</h5>
              <div style={{ height: "120px" }}><LineCharts kind={"memory"} cluster_data={memory_util_data} /></div>
              <hr></hr>
              <h5 >Used (Gi)</h5>
              <div style={{ height: "120px" }}><LineCharts kind={"Gi"} cluster_data={memory_usage_data} /></div>
              <hr></hr>
              <h5 >Total (Gi)</h5>
              <div style={{ height: "120px" }}><LineCharts kind={"Gi"} cluster_data={memory_total_data} /></div>
            </div>
          </TabPanel>

          <TabPanel value={value} index={2} dir={theme.direction}>
            <div style={{ marginLeft: "1%", marginRight: "auto" }}>
              {timeSet}
              <h5>Utilization (%)</h5>
              <div style={{ height: "120px" }}><LineCharts kind={"disk"} cluster_data={disk_util_data} /></div>
              <hr></hr>
              <h5>Used (GB)</h5>
              <div style={{ height: "120px" }}><LineCharts kind={"GB"} cluster_data={disk_usage_data} /></div>
              <hr></hr>
              <h5>Total (GB)</h5>
              <div style={{ height: "120px" }}><LineCharts kind={"GB"} cluster_data={disk_total_data} /></div>
            </div>
          </TabPanel>

        </div>
        <div>
          <hr></hr>
        </div>
      </div>
    </div >
  );
});
export default Physical;