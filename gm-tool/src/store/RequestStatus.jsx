import axios from "axios";
import { makeAutoObservable, runInAction, toJS } from "mobx";
import { SERVER_URL } from "../config";

class RequestStatus {
  requestList = [];
  cluster = [{}];

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
        // this.loadDeploymentDetail(
        //   this.viewList[0].name,
        //   this.viewList[0].cluster,
        //   this.viewList[0].project
        // );
      }
    });
  };

  goNextPage = () => {
    runInAction(() => {
      if (this.totalPages > this.currentPage) {
        this.currentPage = this.currentPage + 1;
        this.paginationList();
        // this.loadDeploymentDetail(
        //   this.viewList[0].name,
        //   this.viewList[0].cluster,
        //   this.viewList[0].project
        // );
      }
    });
  };

  paginationList = () => {
    runInAction(() => {
      if (this.requestList !== null) {
        this.viewList = this.requestList.slice(
          (this.currentPage - 1) * 10,
          this.currentPage * 10
        );
      }
    });
  };

  loadRequestList = async () => {
    await axios
      .get(`${SERVER_URL}`)
      .then((res) => {
        runInAction(() => {
          if (res.data.data !== null) {
            this.requestList = res.data.data;
            this.totalPages = Math.ceil(res.data.data.length / 10);
            this.totalElements = res.data.data.length;
          } else {
            this.requestList = [];
            this.totalPages = "1";
          }
        });
      })
      .then(() => {
        this.paginationList();
      })
      .catch((error) => {
        this.requestList = [];
        this.paginationList();
      });
  };
}

const requestStatusStore = new RequestStatus();
export default requestStatusStore;
