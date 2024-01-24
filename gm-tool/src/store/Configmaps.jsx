import axios from "axios";
import { makeAutoObservable, runInAction, toJS } from "mobx";
import { BASIC_AUTH, SERVER_URL } from "../config";

class Configmaps {
  configmapsList = [];
  configmapsDetail = {};
  adminList = [];
  totalElements = 0;
  data = {};
  configmapsData = {};
  configmapsTabList = {
    data: {},
    annotations: {},
  };

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
        this.loadconfigmapsTabList(
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
        this.loadconfigmapsTabList(
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

  setConfigmapsList = (list) => {
    runInAction(() => {
      this.configmapsList = list;
    });
  };

  setViewList = (n) => {
    runInAction(() => {
      this.viewList = this.configmapsList[n];
    });
  };

  paginationList = () => {
    runInAction(() => {
      if (this.configmapsList !== null) {
        this.viewList = this.configmapsList.slice(
          (this.currentPage - 1) * 10,
          this.currentPage * 10
        );
      }
    });
  };

  loadconfigmapsList = async () => {
    await axios
      .get(`${SERVER_URL}/configmaps`)
      .then((res) => {
        runInAction(() => {
          this.configmapsList = res.data.data;
          this.configmapsDetail = this.configmapsList[0];
          this.totalElements = this.configmapsList.length;
          this.totalPages = Math.ceil(this.configmapsList.length / 10);
        });
      })
      .then(() => {
        this.paginationList();
      })
      .then(() => {
        this.loadconfigmapsTabList(
          this.viewList[0].name,
          this.viewList[0].cluster,
          this.viewList[0].namespace
        );
      });
  };

  loadAdminconfigmapsList = async () => {
    await axios
      .get(`${SERVER_URL}/configmaps`)
      .then(({ data: { data } }) => {
        runInAction(() => {
          this.adminList = data;
          this.configmapsList = this.adminList.filter(
            (data) => data.cluster === "gm-cluster"
          );
          if (this.configmapsList.length !== 0) {
            this.configmapsDetail = this.configmapsList[0];
            this.totalElements = this.configmapsList.length;
            this.totalPages = Math.ceil(this.configmapsList.length / 10);
          } else {
            this.configmapsList = [];
          }
        });
      })
      .then(() => {
        this.paginationList();
      })
      .then(() => {
        this.loadconfigmapsTabList(
          this.configmapsList[0].name,
          this.configmapsList[0].cluster,
          this.configmapsList[0].namespace
        );
      })
      .catch(() => {
        this.configmapsList = [];
        this.paginationList();
      });
  };

  loadconfigmapsTabList = async (name, cluster, namespace) => {
    await axios
      .get(
        `${SERVER_URL}/configmaps/${name}?cluster=${cluster}&project=${namespace}`
      )
      .then((res) => {
        runInAction(() => {
          this.configmapsTabList = res.data.data;
          // this.data = res.data.data;
          // this.annotations = res.data.annotations;
          this.configmapsData = {};

          Object.entries(this.configmapsTabList?.data).map(([key, value]) => {
            this.configmapsData[key] = value;
          });

          Object.entries(this.configmapsTabList?.annotations).map(
            ([key, value]) => {
              this.configmapsData[key] = value;
            }
          );
        });
      });
  };
}

const configmapsStore = new Configmaps();
export default configmapsStore;
