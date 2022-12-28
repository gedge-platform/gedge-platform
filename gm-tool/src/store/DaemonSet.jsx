import axios from "axios";
import { makeAutoObservable, runInAction, toJS } from "mobx";
import { SERVER_URL } from "../config";
import { getItem } from "../utils/sessionStorageFn";

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
        this.loadDaemonSetDetail(
          this.viewList[0].name,
          this.viewList[0].cluster,
          this.viewList[0].project
        );
      }
    });
  };

  goNextPage = () => {
    runInAction(() => {
      if (this.totalPages > this.currentPage) {
        this.currentPage = this.currentPage + 1;
        this.setViewList(this.currentPage - 1);
        this.loadDaemonSetDetail(
          this.viewList[0].name,
          this.viewList[0].cluster,
          this.viewList[0].project
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
        ? "-"
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
      setFunc(this.resultList);
      this.setViewList(0);
    });
  };

  setPDaemonSetList = (list) => {
    runInAction(() => {
      this.pDaemonSetList = list;
    });
  };

  setViewList = (n) => {
    runInAction(() => {
      this.viewList = this.pDaemonSetList[n];
    });
  };

  loadDaemonSetList = async () => {
    let { id, role } = getItem("user");
    role === "SA" ? (id = id) : (id = "");
    await axios
      .get(`${SERVER_URL}/daemonsets?user=${id}`)
      .then((res) => {
        runInAction(() => {
          this.daemonSetList = res.data.data;
          this.totalElements =
            res.data.data === null ? 0 : res.data.data.length;
        });
      })
      .then(() => {
        this.convertList(this.daemonSetList, this.setPDaemonSetList);
      });
    this.totalElements === 0
      ? ((this.daemonSetDetail = null),
        (this.involvesData = null),
        (this.pods = null),
        (this.containers = null),
        (this.services = null),
        (this.label = null),
        (this.annotations = null))
      : this.loadDaemonSetDetail(
          this.viewList[0].name,
          this.viewList[0].cluster,
          this.viewList[0].project
        );
  };

  loadDaemonSetDetail = async (name, cluster, project) => {
    await axios
      .get(
        `${SERVER_URL}/daemonsets/${name}?cluster=${cluster}&project=${project}`
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

  deleteDaemonSet = async (daemonsetName, callback) => {
    axios
      .delete(`${SERVER_URL}/daemonsets/${daemonsetName}`)
      .then((res) => {
        if (res.status === 201)
          swalError("DaemonSet이 삭제되었습니다.", callback);
      })
      .catch((err) => swalError("삭제에 실패하였습니다."));
  };
}

const daemonSetStore = new DaemonSet();
export default daemonSetStore;
