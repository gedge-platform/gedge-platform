import axios from "axios";
import { makeAutoObservable, runInAction, toJS } from "mobx";
import { BASIC_AUTH, SERVER_URL } from "../config";

class ServiceAccount {
  serviceAccountList = [];
  adminList = [];
  serviceAccountDetail = {
    name: "",
    namespace: "",
    cluster: "",
    secrets: [
      {
        name: "",
      },
    ],
    secretCnt: 0,
    label: {},
    annotations: {},
    createdAt: "",
  };

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
      this.currentPage = 1;
    });
  };

  goPrevPage = () => {
    runInAction(() => {
      if (this.currentPage > 1) {
        this.currentPage = this.currentPage - 1;
        this.paginationList();
        this.loadServiceAccountTabList(
          this.viewList[0].name,
          this.viewList[0].cluster,
          this.viewList[0].namespace
        );
      }
    });
  };

  goNextPage = () => {
    runInAction(() => {
      if (this.totalPages > this.currentPage) {
        this.currentPage = this.currentPage + 1;
        this.paginationList();
        this.loadServiceAccountTabList(
          this.viewList[0].name,
          this.viewList[0].cluster,
          this.viewList[0].namespace
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

  setServiceAccountList = (list) => {
    runInAction(() => {
      this.serviceAccountList = list;
    });
  };

  setViewList = (n) => {
    runInAction(() => {
      this.viewList = this.serviceAccountList[n];
    });
  };

  paginationList = () => {
    runInAction(() => {
      if (this.serviceAccountList !== null) {
        this.viewList = this.serviceAccountList.slice(
          (this.currentPage - 1) * 10,
          this.currentPage * 10
        );
      }
    });
  };

  loadServiceAccountList = async () => {
    await axios
      .get(`${SERVER_URL}/serviceaccounts`)
      .then((res) => {
        runInAction(() => {
          this.serviceAccountList = res.data.data;
          this.serviceAccountDetail = this.serviceAccountList[0];
          this.totalElements = this.serviceAccountList.length;
          this.totalPages = Math.ceil(this.serviceAccountList.length / 10);
        });
      })
      .then(() => {
        this.paginationList();
      })
      .then(() => {
        this.loadServiceAccountTabList(
          this.viewList[0].name,
          this.viewList[0].cluster,
          this.viewList[0].namespace
        );
      });
  };

  loadAdminServiceAccountList = async () => {
    await axios
      .get(`${SERVER_URL}/serviceaccounts`)
      .then(({ data: { data } }) => {
        runInAction(() => {
          this.adminList = data;
          this.serviceAccountList = this.adminList.filter(
            (data) => data.cluster === "gm-cluster"
          );
          if (this.serviceAccountList.length !== 0) {
            this.serviceAccountDetail = this.serviceAccountList[0];
            this.totalElements = this.serviceAccountList.length;
            this.totalPages = Math.ceil(this.serviceAccountList.length / 10);
          } else {
            this.serviceAccountList = [];
          }
        });
      })
      .then(() => {
        this.paginationList();
      })
      .then(() => {
        this.loadServiceAccountTabList(
          this.serviceAccountList[0].name,
          this.serviceAccountList[0].cluster,
          this.serviceAccountList[0].namespace
        );
      })
      .catch(() => {
        this.serviceAccountList = [];
        this.paginationList();
      });
  };

  loadServiceAccountTabList = async (name, cluster, namespace) => {
    await axios
      .get(
        `${SERVER_URL}/serviceaccounts/${name}?cluster=${cluster}&project=${namespace}`
      )
      .then((res) => {
        runInAction(() => {
          this.serviceAccountDetail = res.data.data;
        });
      });
  };
}

const serviceAccountStore = new ServiceAccount();
export default serviceAccountStore;
