import axios from "axios";
import { makeAutoObservable, runInAction, toJS } from "mobx";
import { BASIC_AUTH, SERVER_URL2, SERVER_URL4 } from "../config";
import { swalError } from "../utils/swal-utils";

class User {
  userList = [];
  userDetail = {};
  // user = {
  //   id: "",
  //   role: "",
  // };

  totalElements = 0;
  currentPage = 1;
  totalPages = 1;
  resultList = {};
  viewList = [];

  constructor() {
    makeAutoObservable(this);
  }

  setUser = (user) => {
    runInAction(() => {
      this.user = user;
      this.role = user.role;
    });
  };

  goPrevPage = () => {
    runInAction(() => {
      if (this.currentPage > 1) {
        this.currentPage = this.currentPage - 1;
        this.setViewList(this.currentPage - 1);
        this.loadUserDetail(this.viewList[0].memberId);
      }
    });
  };

  goNextPage = () => {
    runInAction(() => {
      if (this.totalPages > this.currentPage) {
        this.currentPage = this.currentPage + 1;
        this.setViewList(this.currentPage - 1);
        this.loadUserDetail(this.viewList[0].memberId);
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

  setUserList = (list) => {
    runInAction(() => {
      this.userList = list;
    });
  };

  setViewList = (n) => {
    runInAction(() => {
      this.viewList = this.userList[n];
    });
  };

  loadUserList = async () => {
    await axios
      .get(`${SERVER_URL4}/members`)
      .then((res) => {
        runInAction(() => {
          this.userList = res.data;
          this.totalElements = res.data.length;
          // this.userDetail = res.data.data[0];
        });
      })
      .then(() => {
        this.convertList(this.userList, this.setUserList);
      })
      .then(() => {
        this.loadUserDetail(this.viewList[0].memberId);
      });
  };

  loadUserDetail = async (memberId) => {
    await axios.get(`${SERVER_URL4}/members/${memberId}`).then((res) => {
      runInAction(() => {
        this.userDetail = res.data;
      });
    });
  };

  postUser = async (data, callback) => {
    const body = {
      ...data,
      enabled: true,
    };
    return await axios
      .post(`${SERVER_URL4}/members`, body)
      .then((res) => {
        runInAction(() => {
          if (res.status === 201) {
            swalError("멤버가 생성되었습니다.", callback);
            return true;
          }
        });
      })
      .catch((err) => false);
  };
}

const userStore = new User();
export default userStore;
