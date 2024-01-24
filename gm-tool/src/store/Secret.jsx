import axios from "axios";
import { BASIC_AUTH, SERVER_URL } from "../config";
//Pagenation Import toJS
import { makeAutoObservable, runInAction, toJS } from "mobx";

class Secret {
  secretList = [];
  secretDetail = {};
  adminList = [];
  totalElements = 0;
  secretTabList = [];
  data = [];
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

  //Pagenation Variable
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

  //Pagenation Default Function
  goPrevPage = () => {
    runInAction(() => {
      if (this.currentPage > 1) {
        this.currentPage = this.currentPage - 1;
        this.paginationList();
        this.loadsecretTabList(
          this.viewList[0].name,
          this.viewList[0].clusterName,
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
        this.loadsecretTabList(
          this.viewList[0].name,
          this.viewList[0].clusterName,
          this.viewList[0].namespace
        );
      }
    });
  };

  // setCurrentPage = (n) => {
  //   runInAction(() => {
  //     this.currentPage = n;
  //   });
  // };

  // setTotalPages = (n) => {
  //   runInAction(() => {
  //     this.totalPages = n;
  //   });
  // };

  // convertList = (apiList, setFunc) => {
  //   runInAction(() => {
  //     let cnt = 1;
  //     let totalCnt = 0;
  //     let tempList = [];
  //     let cntCheck = true;
  //     this.resultList = {};

  //     Object.entries(apiList).map(([_, value]) => {
  //       cntCheck = true;
  //       tempList.push(toJS(value));
  //       cnt = cnt + 1;
  //       if (cnt > 10) {
  //         cntCheck = false;
  //         cnt = 1;
  //         this.resultList[totalCnt] = tempList;
  //         totalCnt = totalCnt + 1;
  //         tempList = [];
  //       }
  //     });

  //     if (cntCheck) {
  //       this.resultList[totalCnt] = tempList;
  //       totalCnt = totalCnt === 0 ? 1 : totalCnt + 1;
  //     }

  //     this.setTotalPages(totalCnt);
  //     this.setCurrentPage(1);
  //     setFunc(this.resultList);
  //     this.setViewList(0);
  //   });
  // };

  // // Pagenation Custom Function Start
  // setSecretList = (list) => {
  //   runInAction(() => {
  //     this.secretList = list;
  //   });
  // };

  // setViewList = (n) => {
  //   runInAction(() => {
  //     this.viewList = this.secretList[n];
  //   });
  // };

  paginationList = () => {
    runInAction(() => {
      if (this.secretList !== null) {
        this.viewList = this.secretList.slice(
          (this.currentPage - 1) * 10,
          this.currentPage * 10
        );
      }
    });
  };

  loadsecretList = async () => {
    await axios
      .get(`${SERVER_URL}/secrets`)
      .then((res) => {
        runInAction(() => {
          this.secretList = res.data.data;
          this.secretDetail = this.secretList[0];
          this.totalElements = this.secretList.length;
          this.totalPages = Math.ceil(this.secretList.length / 10);
        });
      })
      .then(() => {
        this.paginationList();
      })
      .then(() => {
        this.loadsecretTabList(
          this.viewList[0].name,
          this.viewList[0].clusterName,
          this.viewList[0].namespace
        );
      });
  };

  loadAdminsecretList = async () => {
    await axios
      .get(`${SERVER_URL}/secrets`)
      .then((res) => {
        runInAction(() => {
          this.adminList = res.data.data;
          this.secretList = this.adminList.filter(
            (data) => data.clusterName === "gm-cluster"
          );
          if (this.secretList.length !== 0) {
            this.secretDetail = this.secretList[0];
            this.totalElements = this.secretList.length;
            this.totalPages = Math.ceil(this.secretList.length / 10);
          } else {
            this.secretList = [];
          }
        });
      })
      .then(() => {
        this.paginationList();
        this.adminList.length === 0
          ? this.secretTabList === null
          : this.loadsecretTabList(
              this.secretList[0].name,
              this.secretList[0].clusterName,
              this.secretList[0].namespace
            );
      })
      .catch(() => {
        this.secretList = [];
        this.paginationList();
      });
  };

  // Pagenation Custom Function End
  //Backup

  // loadsecretList = async () => {
  //   await axios
  //     .get(`${SERVER_URL}/secrets`, {
  //       auth: BASIC_AUTH,
  //     })
  //     .then(({ data: { data } }) => {
  //       runInAction(() => {
  //         this.secretList = data;
  //         this.secretDetail = data[0];
  //         this.totalElements = data.length;
  //       });
  //     });
  //   this.loadsecretTabList(
  //     this.secretList[0].name,
  //     this.secretList[0].clusterName,
  //     this.secretList[0].namespace
  //   );
  // };
  loadsecretTabList = async (name, clusterName, namespace) => {
    await axios
      .get(
        `${SERVER_URL}/secrets/${name}?cluster=${clusterName}&project=${namespace}`
      )
      .then(({ data: { data } }) => {
        runInAction(() => {
          this.secretTabList = data;
          this.data = data.data;
          this.label = data.label;
          this.annotations = data.annotations;
          this.events = data.events;
        });
      });
  };
}

const secretStore = new Secret();
export default secretStore;
