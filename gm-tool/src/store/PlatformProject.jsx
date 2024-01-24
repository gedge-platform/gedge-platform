import axios from "axios";
import { makeAutoObservable, runInAction, toJS } from "mobx";
import { SERVER_URL } from "../config";
import { getItem } from "@/utils/sessionStorageFn";

class PlatformProject {
  platformProjectList = [
    {
      clusterName: "",
    },
  ];
  platformProjectLists = [];
  totalElements = 0;
  adminList = [];
  adminList = [];
  clusterList = [];
  platformProjectDetail = {};
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
  detailInfo = {};

  currentPage = 1;
  totalPages = 1;
  resultList = {};
  viewList = null;

  constructor() {
    makeAutoObservable(this);
  }

  initViewList = () => {
    runInAction(() => {
      this.viewList = null;
      this.currentPage = 1;
    });
  };

  goPrevPage = () => {
    runInAction(() => {
      if (this.currentPage > 1) {
        this.currentPage = this.currentPage - 1;
        this.paginationList();
        this.loadPlatformProjectDetail(
          this.viewList[0].projectName,
          this.viewList[0].clusterName
        );
      }
    });
  };

  goNextPage = () => {
    runInAction(() => {
      if (this.totalPages > this.currentPage) {
        this.currentPage = this.currentPage + 1;
        this.paginationList();
        this.loadPlatformProjectDetail(
          this.viewList[0].projectName,
          this.viewList[0].clusterName
        );
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
      apiList === null
        ? (cntCheck = false)
        : Object.entries(apiList).map(([_, value]) => {
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
      this.setCurrentPage(1);
      setFunc(this.resultList);
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

  paginationList = () => {
    runInAction(() => {
      if (this.platformProjectList !== null) {
        this.viewList = this.platformProjectList.slice(
          (this.currentPage - 1) * 10,
          this.currentPage * 10
        );
      }
    });
  };

  loadPlatformProjectList = async () => {
    let { id, role } = getItem("user");
    role === "SA" ? (id = id) : (id = "");
    await axios
      .get(`${SERVER_URL}/systemProjects?user=${id}`)
      .then((res) => {
        runInAction(() => {
          if (res.data.data !== null) {
            this.platformProjectList = res.data.data;
            this.platformProjectLists = res.data.data;
            this.platformDetail = res.data.data[0];
            this.totalPages = Math.ceil(res.data.data.length / 10);
            this.totalElements = res.data.data.length;
          } else {
            this.platformProjectList = [];
          }
        });
      })
      .then(() => {
        this.paginationList();
      })
      .then(() => {
        this.loadPlatformProjectDetail(
          this.viewList[0].projectName,
          this.viewList[0].clusterName
        );
        // this.loadCluster(
        //   this.viewList[0].projectName,
        //   this.viewList[0].clusterName
        // this.platformProjectList[0].projectName,
        // this.platformProjectList[0].clusterName
        // );
      });
  };

  loadAdminPlatformProjectList = async () => {
    let { id, role } = getItem("user");
    role === "SA" ? (id = id) : (id = "");
    await axios
      .get(`${SERVER_URL}/systemProjects?user=${id}`)
      .then((res) => {
        runInAction(() => {
          this.adminList = res.data.data;
          this.platformProjectLists = res.data.data.filter(
            (data) => data.clusterName === "gm-cluster"
          );
          this.platformProjectList = this.adminList.filter(
            (data) => data.clusterName === "gm-cluster"
          );
          // this.totalElements = this.platformProjectLists.length;
          // if (this.platformProjectList.length !== 0) {
          //   this.platformDetail = this.platformProjectList[0];
          //   this.totalElements = this.platformProjectList.length;
          //   this.totalPages = Math.ceil(this.platformProjectList.length / 10);
          // } else {
          //   this.platformProjectList = [];
          // }
        });
      })
      // .then(() => {
      //   this.paginationList();
      // })
      .then(() => {
        this.loadPlatformProjectDetail(
          this.platformProjectList[0].projectName,
          this.platformProjectList[0].clusterName
        );
        // this.loadCluster(
        //   this.viewList[0].projectName,
        //   this.viewList[0].clusterName
        // this.platformProjectList[0].projectName,
        // this.platformProjectList[0].clusterName
        // );
      })
      .catch((err) => {
        this.platformProjectList = [];
        // this.paginationList();
      });
  };

  loadPlatformProjectDetail = async (projectName, clusterName) => {
    await axios
      .get(`${SERVER_URL}/systemProjects/${projectName}?cluster=${clusterName}`)
      .then((res) => {
        runInAction(() => {
          this.platformProjectDetail = res.data;
          this.detailInfo = res.data.DetailInfo;
          this.labels = this.detailInfo.labels ? this.detailInfo.labels : "-";

          this.annotations = this.detailInfo.annotations;
          this.resource = this.detailInfo.resource;
          this.evetns = res.data.events;
          // if (data.events !== null) {
          //   this.events = data.events;
          // } else {
          //   this.events = null;
          // }
          this.resourceUsage = this.detailInfo.resourceUsage
            ? this.detailInfo.resourceUsage
            : 0;
        });
      });
  };

  // loadCluster = async (projectName, clusterName) => {
  //   await axios
  //     .get(`${SERVER_URL}/systemProjects/${projectName}?cluster=${clusterName}`)
  //     .then(({ data: { data } }) => {
  //       runInAction(() => {
  //         this.platformDetail = data;
  //         this.labels = data.labels;
  //         this.annotations = data.annotations;
  //         this.resource = data.resource;
  //         if (data.events !== null) {
  //           this.events = data.events;
  //         } else {
  //           this.events = null;
  //         }
  //         this.resourceUsage = data.resourceUsage;
  //       });
  //     });
  // };
}

const platformProjectStore = new PlatformProject();
export default platformProjectStore;
