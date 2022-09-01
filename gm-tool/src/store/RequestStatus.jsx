import axios from "axios";
import { makeAutoObservable, runInAction, toJS } from "mobx";
import { SERVER_URL3 } from "../config";

class RequestStatus {
  requestList = [];
  cluster = [{}];

  totalElements = 0;
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
        this.setViewList(this.currentPage - 1);
        // this.loadDeploymentDetail(
        //   this.viewList[0].name,
        //   this.viewList[0].cluster,
        //   this.viewList[0].project
        // );
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

  setViewList = (n) => {
    runInAction(() => {
      this.viewList = this.requestList[n];
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
        if (cnt > 21) {
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

  setRequestList = (list) => {
    runInAction(() => {
      this.requestList = list;
    });
  };

  loadRequestList = async () => {
    await axios
      .get(`${SERVER_URL3}`)
      .then(({ data }) => {
        runInAction(() => {
          this.requestList = data;
          this.totalElements = data.length;
          console.log(this.requestList);
        });
      })
      .then(() => {
        this.convertList(this.requestList, this.setRequestList);
      });
  };
}

const requestStatusStore = new RequestStatus();
export default requestStatusStore;
