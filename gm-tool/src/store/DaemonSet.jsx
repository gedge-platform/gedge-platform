import axios from "axios";
import { makeAutoObservable, runInAction, toJS } from "mobx";
import { BASIC_AUTH, SERVER_URL2 } from "../config";

class DaemonSet {
  currentPage = 1;
  totalPages = 1;
  resultList = {};
  viewList = [];
  pDaemonSetList = [];
  daemonSetList = [];
  daemonSetDetail = {
    status: {},
    strategy: {},
  };
  totalElements = 0;
  label = {};
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
  pods = [
    {
      name: "",
      status: "",
      node: "",
      podIP: "",
      restart: 0,
    },
  ];
  services = {
    name: "",
    port: 0,
  };

  containers = [{}];

  constructor() {
    makeAutoObservable(this);
  }

  goPrevPage = () => {
    runInAction(() => {
      if (this.currentPage > 1) {
        this.currentPage = this.currentPage - 1;
        this.setViewList(this.currentPage - 1);
        this.loadDaemonSetDetail(this.viewList[0].name, this.viewList[0].cluster, this.viewList[0].project);
      }
    });
  };

  goNextPage = () => {
    runInAction(() => {
      if (this.totalPages > this.currentPage) {
        this.currentPage = this.currentPage + 1;
        this.setViewList(this.currentPage - 1);
        this.loadDaemonSetDetail(this.viewList[0].name, this.viewList[0].cluster, this.viewList[0].project);
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
      this.setViewList(0);
    });
  };

  setPDaemonSetList = (list) => {
    runInAction(() => {
      this.pDaemonSetList = list;
    })
  };

  setViewList = (n) => {
    runInAction(() => {
      this.viewList = this.pDaemonSetList[n];
    });
  };

  loadDaemonSetList = async (type) => {
    await axios.get(`${SERVER_URL2}/daemonsets`).then((res) => {
      runInAction(() => {
        const list = res.data.data.filter((item) => item.projectType === type);
        this.daemonSetList = list;
        // this.daemonSetDetail = list[0];
        this.totalElements = list.length;
      });
    })
    .then(() => {
      this.convertList(this.daemonSetList, this.setPDaemonSetList);
    })
    this.loadDaemonSetDetail(
      this.daemonSetList[0].name,
      this.daemonSetList[0].cluster,
      this.daemonSetList[0].project
    );
  };

  loadDaemonSetDetail = async (name, cluster, project) => {
    await axios
      .get(
        `${SERVER_URL2}/daemonsets/${name}?cluster=${cluster}&project=${project}`
      )
      .then(({ data: { data, involvesData } }) => {
        runInAction(() => {
          this.daemonSetDetail = data;
          this.involvesData = involvesData;
          this.pods = involvesData.pods;
          this.containers = data.containers;
          this.services = involvesData.services;
          this.label = data.label;
          this.annotations = data.annotations;
          if (data.events !== null) {
            this.events = data.events;
          } else {
            this.events = null;
          }
        });
      });
  };
}

const daemonSetStore = new DaemonSet();
export default daemonSetStore;
