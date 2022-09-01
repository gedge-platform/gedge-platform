import axios from "axios";
import { makeAutoObservable, runInAction, toJS } from "mobx";
import { createContext } from "react";
import { BASIC_AUTH, SERVER_URL2 } from "../config";

class Dashboard {
  viewList = [];
  dashboardDetail = {};
  clusterCnt = 0;
  credentialCnt = 0;
  edgeClusterCnt = 0;
  workspaceCnt = 0;
  projectCnt = 0;
  clusterCpuTop5 = [
    {
      cluster: "",
      value: "",
    },
  ];
  podCpuTop5 = [
    {
      cluster: "",
      name: "",
      namespace: "",
      value: "",
    },
  ];
  clusterMemTop5 = [
    {
      cluster: "",
      value: "",
    },
  ];
  podMemTop5 = [
    {
      cluster: "",
      name: "",
      namespace: "",
      value: "",
    },
  ];

  edgeInfo = [
    {
      _id: "",
      address: "",
      clusterEndpoint: "",
      // clusterName: "",
      clusterType: "",
      status: "",
      token: "",
    },
  ];

  point = {};
  x = [];
  y = [];
  pointArr = [];

  connectionconfig = [];
  ConfigName = [];
  ProviderName = [];
  ConfigNameCnt = 0;

  VMCnt = 0;
  Paused = 0;
  Running = 0;
  Stop = 0;

  VMList = [];

  clusterNameList = [];
  clusterName = "";
  cloudDashboardDetail = [];
  clusterInfo = {
    address: "",
  };
  nodeInfo = [
    {
      nodeName: "",
      type: "",
      nodeIP: "",
      kubeVersion: "",
      os: "",
      created_at: "",
      constainerRuntimeVersion: "",
    },
  ];

  master = "";
  worker = "";

  cpuUsage = "";
  cpuUtil = "";
  cpuTotal = "";

  memoryUsage = "";
  memoryUtil = "";
  memoryTotal = "";

  diskUsage = "";
  diskUtil = "";
  diskTotal = "";

  resourceCnt = [
    {
      cronjob_count: 0,
      daemonset_count: 0,
      deployment_count: 0,
      job_count: 0,
      namespace_count: 0,
      pod_count: 0,
      project_count: 0,
      pv_count: 0,
      service_count: 0,
      statefulset_count: 0,
      workspace_count: 0,
    },
  ];

  constructor() {
    makeAutoObservable(this);
  }

  setPointX = (x) => {
    runInAction(() => {
      this.x = x;
    });
  };

  setPointY = (y) => {
    runInAction(() => {
      this.y = y;
    });
  };

  loadDashboardCnt = async () => {
    await axios
      .get(`${SERVER_URL2}/totalDashboard`)
      // .get(`${SERVER_URL2}/totalDashboard`)
      .then(({ data: { data } }) => {
        runInAction(() => {
          this.dashboardDetail = data;
          this.clusterCnt = data.clusterCnt;
          // this.coreClusterCnt = data.coreClusterCnt;
          this.credentialCnt = data.credentialCnt;
          this.edgeClusterCnt = data.edgeClusterCnt;
          this.workspaceCnt = data.workspaceCnt;
          this.projectCnt = data.projectCnt;
        });
        // console.log(this.credentialCnt);
      });
  };

  loadClusterRecent = async () => {
    await axios
      .get(`${SERVER_URL2}/totalDashboard`)
      .then(({ data: { data, involvesData } }) => {
        runInAction(() => {
          this.dashboardDetail = data;
          this.clusterCpuTop5 = data.clusterCpuTop5;
          this.podCpuTop5 = data.podCpuTop5;
          this.clusterMemTop5 = data.clusterMemTop5;
          this.podMemTop5 = data.podMemTop5;
        });
        // console.log(toJS(this.clusterCpuTop5))
      });
  };

  // loadMapInfo = async () => {
  //   await axios
  //     .get(`http://192.168.160.230:8011/gmcapi/v2/totalDashboard`)
  //     .then(({ data: { data } }) => {
  //       runInAction(() => {
  //         this.dashboardDetail = data;
  //         this.edgeInfo = data.edgeInfo;
  //         this.point = this.edgeInfo.map((point) =>
  //           Object.entries(point.point)
  //         );
  //         this.pointArr = this.edgeInfo.map((p) => p.point);
  //         this.x = this.point
  //           .map((x) => Object.values(x[0]))
  //           .map((val) => val[1]);
  //         this.y = this.point
  //           .map((y) => Object.values(y[1]))
  //           .map((val) => val[1]);
  //       });
  //     });
  // };

  loadCredentialName = async () => {
    await axios
      .get(`http://210.207.104.188:1024/spider/connectionconfig`)
      .then((res) => {
        runInAction(() => {
          this.connectionconfig = res.data.connectionconfig;
          this.ConfigNameList = this.connectionconfig.map(
            (name) => name.ConfigName
          );
          // const ConfigNameList = Object.values(this.ConfigName);
          this.ProviderName = this.connectionconfig.map(
            (provider) => provider.ProviderName
          );
        });
        console.log(this.ConfigNameList);
      })
      .then(() => {
        // console.log(this.ConfigName);
        // for (let i = 1; i <= this.ConfigName.length; i++) {
        //   this.loadVMCnt(this.ConfigName[i]);
        // }
        // this.ConfigNameList.map((name) => this.loadVMCnt(name));
        // this.loadVMCnt();
        // this.ConfigName.map(val => this.loadVMStatusCnt(val));
      });
  };

  loadVMStatusCnt = async () => {
    const urls = axios.get(
      `http://210.207.104.188:1024/spider/connectionconfig`
    );
    const configResult = await Promise.all([urls]).then((res) => {
      return res;
    });
    const configNameList = configResult[0].data.connectionconfig;
    const vmList = [];
    await configNameList.forEach((config) => {
      let configName = config.ConfigName;
      axios
        .post(
          `http://192.168.160.216:8010/gmcapi/v2/spider/vm/vmstatus/vmstatusCount`,
          {
            ConnectionName: configName,
          }
        )
        .then((res) => {
          vmList.push(res);
        });
    });

    // res.forEach((result) => {
    //   Object.values(result.data.connectionconfig).map(
    //     (val) => val.ConfigName
    // );
    // })
  };

  // ConfigName = this.ConfigName.map(name => this.loadVMCnt(name));

  // loadVMCnt = async (ConfigName) => {
  //   await axios.post(`http://192.168.160.216:8010/gmcapi/v2/spider/vm/vmCount`,
  //   {ConnectionName: ConfigName})
  //   .then((res) => {
  //     // console.log(res);
  //     runInAction(() => {
  //       console.log("step3");
  //       this.VMCnt = res.data.VMCnt;
  //       // this.VMList.configName = ConfigName;
  //       // this.VMList.vmCnt = this.VMCnt;
  //     })
  //     console.log(this.VMCnt);
  //     return this.VMCnt
  //   });
  // .then((res) => {
  //   console.log("step4");
  // //   console.log(res);
  //   this.VMList.configName = ConfigName;
  //   this.VMList.vmCnt = this.VMCnt;
  // console.log(this.VMList);
  //   // this.ConfigName.map(val => this.loadVMStatusCnt(val));
  // })
  // .then(() => {
  //   console.log("step5" + ConfigName);
  //     this.loadVMCnt(this.ConfigName);
  // });
  // };
  loadVMCnt = async () => {
    const urls = axios.get(
      `http://210.207.104.188:1024/spider/connectionconfig`
    );
    const configResult = await Promise.all([urls]).then((res) => {
      console.log(res);
      return res;
    });
    const configNameList = configResult[0].data.connectionconfig;
    const vmCntList = [];
    await configNameList.forEach((config) => {
      let configName = config.ConfigName;
      axios
        .post(`http://192.168.160.216:8010/gmcapi/v2/spider/vm/vmCount`, {
          ConnectionName: configName,
        })
        .then((res) => {
          const vmCnt = res.data.VMCnt;
          // console.log("test : ", res);
          vmCntList.push({ configName, vmCnt });
          return vmCntList;
        });
    });
    console.log(vmCntList);
    // res.forEach((result) => {
    //   Object.values(result.data.connectionconfig).map(
    //     (val) => val.ConfigName
    // );
    // })

    console.log(configNameList);
  };

  loadVMStatusCnt = async () => {
    const urls = axios.get(
      `http://210.207.104.188:1024/spider/connectionconfig`
    );
    const configResult = await Promise.all([urls]).then((res) => {
      console.log(res);
      return res;
    });
    const configNameList = configResult[0].data.connectionconfig;
    const vmStatusList = [];
    await configNameList.forEach((config) => {
      let configName = config.ConfigName;
      axios
        .post(
          `http://192.168.160.216:8010/gmcapi/v2/spider/vm/vmstatus/vmstatusCount`,
          {
            ConnectionName: configName,
          }
        )
        .then((res) => {
          const stop = res.data.Stop;
          const running = res.data.Running;
          const paused = res.data.Paused;
          // vmStatusList.push(configName);
          // vmStatusList.push(running);
          // vmStatusList.push(stop);
          // vmStatusList.push(paused);
          vmStatusList.push([configName, running, stop, paused]);
          // console.log(vmStatusList);
          return vmStatusList;
        });
    });

    // console.log(configNameList);
  };

  // loadVMStatusCnt = async (ConfigName) => {
  //   await axios.post(`http://192.168.160.216:8010/gmcapi/v2/spider/vm/vmstatus/vmstatusCount`,
  //   {ConnectionName: ConfigName})
  //   .then((res) => {
  //     runInAction(() => {
  //       console.log("step6");
  //       // console.log(res);
  //       this.Paused = res.data.Paused;
  //       this.Running = res.data.Running;
  //       this.Stop = res.data.Stop;
  //     })
  //     return (
  //       this.Paused,
  //       this.Running,
  //       this.Stop
  //     )
  //   });
  // .then(() => {
  //   // if(ConfigName === VMList.ConfigName) {
  //     console.log("step7");
  //     // console.log(res);
  //     VMList.paused = this.Paused;
  //     VMList.running = this.Running;
  //     VMList.stop = this.Stop;
  //     console.log(VMList);
  //   // }
  // })
  // };

  loadClusterList = async (type = "") => {
    await axios
      .get(`${SERVER_URL2}/clusters`)
      .then((res) => {
        runInAction(() => {
          const list =
            type === ""
              ? res.data
              : res.data.filter((item) => item.clusterType === type);
          this.clusterList = list;
          this.clusterNameList = list.map((item) => item.clusterName);
          this.totalElements = list.length;
        });
      })
      .then(() => {
        this.loadClusterDetail(this.clusterNameList[0]);
      });
  };

  loadClusterDetail = async (clusterName) => {
    await axios
      .get(`${SERVER_URL2}/cloudDashboard?cluster=${clusterName}`)
      .then(({ data: { data } }) => {
        runInAction(() => {
          this.clusterName = clusterName;
          this.cloudDashboardDetail = data;
          this.clusterInfo = data.ClusterInfo;
          this.address = data.ClusterInfo.address;
          this.nodeInfo = data.nodeInfo;
          this.type = this.nodeInfo.map((val) => val.type);
          this.master = this.type.reduce(
            (cnt, element) => cnt + ("master" === element),
            0
          );
          this.worker = this.type.reduce(
            (cnt, element) => cnt + ("worker" === element),
            0
          );
          this.cpuUsage = data.cpuUsage;
          this.cpuUtil = data.cpuUtil;
          this.cpuTotal = data.cpuTotal;
          this.memoryUsage = data.memoryUsage;
          this.memoryUtil = data.memoryUtil;
          this.memoryTotal = data.memoryTotal;
          this.diskUsage = data.diskUsage;
          this.diskUtil = data.diskUtil;
          this.diskTotal = data.diskTotal;
          this.resourceCnt = data.resourceCnt;
          console.log(this.resourceCnt);
        });
      });
  };
}
const dashboardStore = new Dashboard();
export default dashboardStore;
