import axios from "axios";
import { makeAutoObservable, runInAction, toJS } from "mobx";
import { SERVER_URL } from "../config";
import { getItem } from "../utils/sessionStorageFn";

class DaemonSet {
  currentPage = 1;
  totalPages = 1;
  resultList = {};
  viewList = null;
  adminList = [];
  pDaemonSetList = [];
  daemonSetList = [];
  daemonSetDetail = [];
  totalElements = 0;
  label = [];
  annotations = [];
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
  pods = [];
  services = {};

  containers = [];

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
        this.paginationList();
        this.loadDaemonSetDetail(
          this.viewList[0].name,
          this.viewList[0].cluster,
          this.viewList[0].project
        );
      }
    });
  };

  paginationList = () => {
    runInAction(() => {
      if (this.daemonSetList !== null) {
        this.viewList = this.daemonSetList.slice(
          (this.currentPage - 1) * 10,
          this.currentPage * 10
        );
      }
    });
  };

  loadDaemonSetList = async () => {
    let { id, role } = getItem("user");
    role === "SA" ? (id = id) : (id = "");
    await axios
      .get(`${SERVER_URL}/daemonsets?user=${id}`)
      .then((res) => {
        runInAction(() => {
          if (res.data.data !== null) {
            this.daemonSetList = res.data.data;
            this.daemonSetDetail = res.data.data[0];
            this.totalPages = Math.ceil(res.data.data.length / 10);
            this.totalElements = res.data.data.length;
          } else {
            this.daemonSetList = [];
          }
        });
      })
      .then(() => {
        this.paginationList();
        this.daemonSetList === null
          ? this.daemonSetDetail === null
          : this.loadDaemonSetDetail(
              this.daemonSetList[0].name,
              this.daemonSetList[0].cluster,
              this.daemonSetList[0].project
            );
      })
      .catch(() => {
        this.daemonSetList = [];
        this.paginationList();
      });
  };

  loadAdminDaemonSetList = async () => {
    let { id, role } = getItem("user");
    role === "SA" ? (id = id) : (id = "");
    await axios
      .get(`${SERVER_URL}/daemonsets?user=${id}`)
      .then((res) => {
        runInAction(() => {
          this.adminList = res.data.data;
          this.daemonSetList = this.adminList.filter(
            (data) => data.cluster === "gm-cluster"
          );
          if (this.daemonSetList.length !== 0) {
            this.daemonSetDetail = this.daemonSetList[0];
            this.totalPages = Math.ceil(this.daemonSetList.length / 10);
            this.totalElements = this.daemonSetList.length;
          } else {
            this.daemonSetList = [];
          }
        });
      })
      .then(() => {
        this.paginationList();
        this.daemonSetList === null
          ? this.daemonSetDetail === null
          : this.loadDaemonSetDetail(
              this.daemonSetList[0].name,
              this.daemonSetList[0].cluster,
              this.daemonSetList[0].project
            );
      })
      .catch(() => {
        this.daemonSetList = [];
        this.paginationList();
      });
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
