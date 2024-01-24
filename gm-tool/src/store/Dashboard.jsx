import axios from "axios";
import { makeAutoObservable, runInAction, toJS } from "mobx";
import { createContext } from "react";
import { SERVER_URL, SPIDER_URL } from "../config";
// import { SERVER_URL } from "../config";

class Dashboard {
  viewList = [];
  dashboardDetail = {};
  clusterCnt = 0;
  credentialCnt = 0;
  edgeClusterCnt = 0;
  workspaceCnt = 0;
  coreClusterCnt = 0;
  projectCnt = 0;
  coreClusterCnt = 0;
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
      clusterName: "",
      clusterType: "",
      status: "",
      token: "",
    },
  ];

  point = {};
  x = [];
  y = [];
  pointArr = [];

  connectionconfig = [
    {
      ConfigName: "",
      ProviderName: "",
      DriverName: "",
      CredentialName: "",
      RegionName: " ",
    },
  ];
  ConfigName = [];
  ProviderName = [];
  CredentialName = [];
  ConfigNameCnt = 0;

  VMCnt = 0;
  Paused = 0;
  Running = 0;
  Stop = 0;

  VMList = [];
  vmStatusList = [];
  ConfigNameList = [];
  configName = [];

  clusterNameList = [];
  cloudNameList = [];
  clusterName = "";
  setClusterName = (value) => {
    runInAction(() => {
      this.clusterName = value;
    });
  };

  cloudName = "";
  setCloudName = (value) => {
    runInAction(() => {
      this.cloudName = value;
    });
  };

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

  resourceCnt = {
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
  };

  cloudResourceCnt = {};

  edgeNodeRunning = [];
  nodeRunning = [];

  firstCloudName = "";

  totalCpu = "";
  totalMem = "";
  totalDisk = "";
  usageTotalCpu = "";
  usageTotalMem = "";
  usageTotalDisk = "";

  mapZoom = 6;
  setMapZoom = (value) => {
    runInAction(() => {
      this.mapZoom = value;
    });
  };

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
      .get(`${SERVER_URL}/totalDashboard`)
      .then(({ data: { data } }) => {
        runInAction(() => {
          this.dashboardDetail = data;
          this.edgeInfo = data.edgeInfo;
          this.clusterCnt = data.clusterCnt;
          this.credentialCnt = data.credentialCnt;
          this.edgeClusterCnt = data.edgeClusterCnt;
          this.workspaceCnt = data.workspaceCnt;
          this.projectCnt = data.projectCnt;
          this.coreClusterCnt = data.coreClusterCnt;

          this.totalCpu = data.totalCpu;
          this.totalMem = data.totalMem;
          this.totalDisk = data.totalDisk;

          this.usageTotalCpu = data.usageTotalCpu;
          this.usageTotalMem = data.usageTotalMem;
          this.usageTotalDisk = data.usageTotalDisk;
        });
      });
  };

  loadClusterRecent = async () => {
    await axios
      .get(`${SERVER_URL}/totalDashboard`)
      .then(({ data: { data, involvesData } }) => {
        runInAction(() => {
          this.dashboardDetail = data;
          this.clusterCpuTop5 = data.clusterCpuTop5;
          this.podCpuTop5 = data.podCpuTop5;
          this.clusterMemTop5 = data.clusterMemTop5;
          this.podMemTop5 = data.podMemTop5;
        });
      });
  };

  loadMapStatus = async () => {
    await axios
      .get(`${SERVER_URL}/totalDashboard`)
      .then(({ data: { data } }) => {
        runInAction(() => {
          this.edgeNodeRunning = data.nodeRunning;
        });
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
      // .get(`${SPIDER_URL}/spider/connectionconfig`)
      .get(`http://101.79.4.15:1024/spider/connectionconfig`)
      .then((res) => {
        runInAction(() => {
          this.connectionconfig = res.data.connectionconfig;
          this.ConfigNameList = this.connectionconfig
            ? this.connectionconfig.map((name) => name.ConfigName)
            : "";
          this.ProviderName = this.connectionconfig
            ? this.connectionconfig.map((provider) => provider.ProviderName)
            : "";
          this.ProviderName = this.connectionconfig
            ? this.connectionconfig.map(
                (credentialName) => credentialName.CredentialName
              )
            : "";
        });
      })
      .then(() => {
        for (let i = 0; i < this.ConfigNameList.length; i++) {
          this.loadVMStatusCnt(this.ConfigNameList[i], this.ProviderName[i]);
        }
        // this.ConfigNameList.map((name) => this.loadVMCnt(name));
        // this.loadVMCnt();
        // this.ConfigNameList.map((val) => this.loadVMStatusCnt(val, val2));
      });
  };

  setVmStatusList = async () => {
    runInAction(() => {
      this.vmStatusList = [];
    });
  };

  loadVMStatusCnt = async () => {
    const urls = axios.get(`${SERVER_URL}/spider/connectionconfig`);
    const configResult = await Promise.all([urls]).then((res) => {
      return res;
    });

    this.configName = configResult[0].data.data.connectionconfig;
  };

  edgeType = [];
  cloudType = [];

  loadEdgeZoneDashboard = async () => {
    await axios.get(`${SERVER_URL}/clusters`).then(({ data: { data } }) => {
      runInAction(() => {
        this.edgeType = data.filter((item) => item.clusterType === "edge");
        this.clusterNameList = this.edgeType.map((item) => item.clusterName);
        this.totalElements = data.length;
      });
    });
    this.loadEdgeZoneDetailDashboard(this.clusterNameList[0]);
  };

  loadEdgeZoneDetailDashboard = async (clusterName) => {
    await axios
      .get(`${SERVER_URL}/cloudDashboard?cluster=${clusterName}`)
      .then(({ data: { data } }) =>
        runInAction(() => {
          this.clusterInfo = data.ClusterInfo;
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
          this.cpuUsage = data.cpuUsage ? data.cpuUsage : 0;
          this.cpuUtil = data.cpuUtil ? data.cpuUtil : 0;
          this.cpuTotal = data.cpuTotal ? data.cpuTotal : 0;
          this.memoryUsage = data.memoryUsage ? data.memoryUsage : 0;
          this.memoryUtil = data.memoryUtil ? data.memoryUtil : 0;
          this.memoryTotal = data.memoryTotal ? data.memoryTotal : 0;
          this.diskUsage = data.diskUsage ? data.diskUsage : 0;
          this.diskUtil = data.diskUtil ? data.diskUtil : 0;
          this.diskTotal = data.diskTotal ? data.diskTotal : 0;
          this.resourceCnt = data.resourceCnt ? data.resourceCnt : 0;
          this.nodeRunning = data.nodeRunning ? data.nodeRunning : 0;
          this.nodeReady = this.nodeRunning
            ? this.nodeRunning.filter((element) => "Ready" === element).length
            : 0;
          this.nodeNotReady = this.nodeRunning
            ? this.nodeRunning.filter((element) => "NotReady" === element)
                .length
            : 0;
        })
      );
  };

  loadCloudZoneDashboard = async () => {
    await axios.get(`${SERVER_URL}/clusters`).then(({ data: { data } }) => {
      runInAction(() => {
        this.cloudType = data.filter((item) => item.clusterType === "cloud");
        this.cloudNameList = this.cloudType.map((item) => item.clusterName);
        this.firstCloudName = this.cloudNameList[0];
        this.totalElements = data.length;
      });
    });
    this.loadCloudZoneDetailDashboard(this.firstCloudName);
  };

  loadCloudZoneDetailDashboard = async (cloudName) => {
    await axios
      .get(`${SERVER_URL}/cloudDashboard?cluster=${cloudName}`)
      .then(({ data: { data } }) =>
        runInAction(() => {
          this.cloudName = cloudName;
          this.clusterInfo = data.ClusterInfo;
          this.nodeInfo = data.nodeInfo;
          this.type = this.nodeInfo ? this.nodeInfo.map((val) => val.type) : "";
          this.master = this.type
            ? this.type.reduce(
                (cnt, element) => cnt + ("master" === element),
                0
              )
            : 0;
          this.worker = this.type
            ? this.type.reduce(
                (cnt, element) => cnt + ("worker" === element),
                0
              )
            : 0;
          this.cpuUsage = data.cpuUsage ? data.cpuUsage : 0;
          this.cpuUtil = data.cpuUtil ? data.cpuUtil : 0;
          this.cpuTotal = data.cpuTotal ? data.cpuTotal : 0;
          this.memoryUsage = data.memoryUsage ? data.memoryUsage : 0;
          this.memoryUtil = data.memoryUtil ? data.memoryUtil : 0;
          this.memoryTotal = data.memoryTotal ? data.memoryTotal : 0;
          this.diskUsage = data.diskUsage ? data.diskUsage : 0;
          this.diskUtil = data.diskUtil ? data.diskUtil : 0;
          this.diskTotal = data.diskTotal ? data.diskTotal : 0;
          this.cloudResourceCnt = data.resourceCnt ? data.resourceCnt : 0;
          this.nodeRunning = data.nodeRunning ? data.nodeRunning : 0;
        })
      );
  };
}
const dashboardStore = new Dashboard();
export default dashboardStore;
