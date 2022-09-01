import axios from "axios";
import { makeAutoObservable, runInAction, toJS } from "mobx";
import { BASIC_AUTH, SERVER_URL4 } from "../config";

class PlatformProject {
  platformProjectList = [
    {
      clusterName: "",
    },
  ];
  totalElements = 0;
  clusterList = [];
  platformDetail = [{}];
  labels = {};
  annotations = {};
  events = [
    {
      kind: "",
      name: "",
      namespace: "",
      cluster: "",
      message: "",
      reason: "",
      type: "",
      eventTime: "",
    },
  ];
  resource = {
    deployment_count: 0,
    daemonset_count: 0,
    Statefulset_count: 0,
    pod_count: 0,
    service_count: 0,
    cronjob_count: 0,
    job_count: 0,
    volume_count: 0,
  };
  resourceUsage = {
    namespace_cpu: "",
    namespace_memory: "",
    namespace_pod_count: "",
  };

  currentPage = 1;
  totalPages = 1;
  resultList = {};
  viewList = [];

  constructor() {
    makeAutoObservable(this);
  }

  goPrevPage = () => {
    runInAction(() => {
      if (this.currentPage > 1) {
        this.currentPage = this.currentPage - 1;
        this.setViewList(this.currentPage - 1);
        this.loadPlatformDetail(this.viewList[0].projectName);
      }
    });
  };

  goNextPage = () => {
    runInAction(() => {
      if (this.totalPages > this.currentPage) {
        this.currentPage = this.currentPage + 1;
        this.setViewList(this.currentPage - 1);
        this.loadPlatformDetail(this.viewList[0].projectName);
      }
    });
  };

  setCurrentPage = (n) => {
    runInAction(() => {
      this.currentPage = n;
    });
  };

  setTotalPages = (n) => {
    runInAction(() => {
      this.totalPages = n;
    });
  };

  convertList = (apiList, setFunc) => {
    runInAction(() => {
      let cnt = 1;
      let totalCnt = 0;
      let tempList = [];
      let cntCheck = true;
      this.resultList = {};

      Object.entries(apiList).map(([_, value]) => {
        cntCheck = true;
        tempList.push(toJS(value));
        cnt = cnt + 1;
        if (cnt > 10) {
          cntCheck = false;
          cnt = 1;
          this.resultList[totalCnt] = tempList;
          totalCnt = totalCnt + 1;
          tempList = [];
        }
      });

      if (cntCheck) {
        this.resultList[totalCnt] = tempList;
        totalCnt = totalCnt === 0 ? 1 : totalCnt + 1;
      }

      this.setTotalPages(totalCnt);
      setFunc(this.resultList);
      console.log(this.platformProjectList);
      this.setViewList(0);
    });
  };

  setPlatformProjectList = (list) => {
    runInAction(() => {
      this.platformProjectList = list;
    });
  };

  setViewList = (n) => {
    runInAction(() => {
      this.viewList = this.platformProjectList[n];
    });
  };

  loadPlatformProjectList = async (type) => {
    await axios
      .get(`${SERVER_URL4}/systemProjects`)
      .then(({ data: { data } }) => {
        runInAction(() => {
          this.platformProjectList = data;
          this.platformDetail = data[0];
          // const temp = new Set(
          //   res.data.data.map((cluster) => cluster.clusterName)
          // );
          // this.clusterList = [...temp];
          this.totalElements = data.length;
        });
      })
      .then(() => {
        this.convertList(this.platformProjectList, this.setPlatformProjectList);
      })
      .then(() => {
        this.loadPlatformDetail(this.viewList[0].projectName);
        this.loadCluster(
          this.viewList[0].projectName,
          this.viewList[0].clusterName
          // this.platformProjectList[0].projectName,
          // this.platformProjectList[0].clusterName
        );
      });
  };

  loadPlatformDetail = async (projectName) => {
    await axios
      .get(`${SERVER_URL4}/systemProjects/${projectName}`)
      .then((res) => {
        runInAction(() => {});
      });
  };

  loadCluster = async (projectName, clusterName) => {
    await axios
      .get(
        `${SERVER_URL4}/systemProjects/${projectName}?cluster=${clusterName}`
      )
      .then(({ data: { data } }) => {
        runInAction(() => {
          this.platformDetail = data;
          this.labels = data.labels;
          this.annotations = data.annotations;
          this.resource = data.resource;
          if (data.events !== null) {
            this.events = data.events;
          } else {
            this.events = null;
          }
          this.resourceUsage = data.resourceUsage;
        });
      });
  };
}

const platformProjectStore = new PlatformProject();
export default platformProjectStore;
