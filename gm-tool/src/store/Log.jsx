import axios from "axios";
import { makeAutoObservable, runInAction, toJS } from "mobx";
import { LOG_URL } from "../config";
import { getItem } from "../utils/sessionStorageFn";

class LogStatus {
  logList = [];
  logDetail = {};

  totalElements = 0;
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
    });
  };

  goPrevPage = () => {
    runInAction(() => {
      if (this.currentPage > 1) {
        this.currentPage = this.currentPage - 1;
        this.paginationList();
      }
    });
  };

  goNextPage = () => {
    runInAction(() => {
      if (this.totalPages > this.currentPage) {
        this.currentPage = this.currentPage + 1;
        this.paginationList();
      }
    });
  };

  paginationList = () => {
    runInAction(() => {
      if (this.logList !== null) {
        this.viewList = this.logList.slice(
          (this.currentPage - 1) * 20,
          this.currentPage * 20
        );
      }
    });
  };

  loadLogListAPI = async () => {
    await axios
      .get(`${LOG_URL}/log`)
      .then((res) => {
        runInAction(() => {
          if (res.data.data !== null) {
            this.logList = res.data;
            this.logDetail = res.data[0];
            this.totalPages = Math.ceil(res.data.length / 20);
            this.totalElements = res.data.length;
          } else {
            this.logList = [];
          }
        });
      })
      .then(() => {
        this.paginationList();
      })
      .catch((error) => {
        this.logList = [];
        this.paginationList();
      });
  };
  loadUserLogListAPI = async () => {
    let { id, role } = getItem("user");
    role === "SA" ? (id = id) : (id = "");
    await axios
      .get(`${LOG_URL}/log/${id}`)
      .then((res) => {
        runInAction(() => {
          if (res.data.data !== null) {
            this.logList = res.data;
            this.logDetail = res.data[0];
            this.totalPages = Math.ceil(res.data.length / 20);
            this.totalElements = res.data.length;
          } else {
            this.logList = [];
          }
        });
      })
      .then(() => {
        this.paginationList();
      })
      .catch((error) => {
        this.logList = [];
        this.paginationList();
      });
  };
}

const logStore = new LogStatus();
export default logStore;
