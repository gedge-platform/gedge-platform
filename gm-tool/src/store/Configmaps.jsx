import axios from "axios";
import { makeAutoObservable, runInAction, toJS } from "mobx";
import { BASIC_AUTH, SERVER_URL2 } from "../config";

class Configmaps {
  configmapsList = [];
  configmapsDetail = {};
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
  viewList = [];

  constructor() {
    makeAutoObservable(this);
  }

  goPrevPage = () => {
    runInAction(() => {
      if (this.currentPage > 1) {
        this.currentPage = this.currentPage - 1;
        this.setViewList(this.currentPage - 1);
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
        this.setViewList(this.currentPage - 1);
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

  loadconfigmapsList = async () => {
    await axios
      .get(`${SERVER_URL2}/configmaps`)
      .then(({ data: { data } }) => {
        runInAction(() => {
          this.configmapsList = data;
          this.configmapsDetail = data[0];
          this.totalElements = data.length;
        });
      })
      .then(() => {
        this.convertList(this.configmapsList, this.setConfigmapsList);
      })
      .then(() => {
        this.loadconfigmapsTabList(
          this.viewList[0].name,
          this.viewList[0].cluster,
          this.viewList[0].namespace
        );
      });
  };

  loadconfigmapsTabList = async (name, cluster, namespace) => {
    await axios
      .get(
        `${SERVER_URL2}/configmaps/${name}?cluster=${cluster}&project=${namespace}`
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
