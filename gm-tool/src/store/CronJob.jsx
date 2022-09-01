import axios from "axios";
import { makeAutoObservable, runInAction, toJS } from "mobx";
import { BASIC_AUTH, SERVER_URL2 } from "../config";

class CronJob {
  currentPage = 1;
  totalPages = 1;
  resultList = {};
  viewList = [];
  pCronjobList = [];
  cronJobList = [];
  cronJobDetail = {};
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
  cronjobInvolvesJobs = [];

  constructor() {
    makeAutoObservable(this);
  }

  goPrevPage = () => {
    runInAction(() => {
      if (this.currentPage > 1) {
        this.currentPage = this.currentPage - 1;
        this.setViewList(this.currentPage - 1);
        this.loadCronJobDetail(this.viewList[0].name, this.viewList[0].cluster, this.viewList[0].project);
      }
    });
  };

  goNextPage = () => {
    runInAction(() => {
      if (this.totalPages > this.currentPage) {
        this.currentPage = this.currentPage + 1;
        this.setViewList(this.currentPage - 1);
        this.loadCronJobDetail(this.viewList[0].name, this.viewList[0].cluster, this.viewList[0].project);
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

      setPCronjobList = (list) => {
        runInAction(() => {
          this.pCronjobList = list;
        })
      };

      setViewList = (n) => {
        runInAction(() => {
          this.viewList = this.pCronjobList[n];
        });
      };

  loadCronJobList = async (type) => {
    await axios.get(`${SERVER_URL2}/cronjobs`).then(({ data: { data } }) => {
      runInAction(() => {
        const list = data.filter((item) => item.projectType === type);
        this.cronJobList = list;
        // this.cronJobDetail = list[0];
        this.totalElements = list.length;
      });
    }).then(() => {
      this.convertList(this.cronJobList, this.setPCronjobList);
    })
    this.loadCronJobDetail(
      this.cronJobList[0].name,
      this.cronJobList[0].cluster,
      this.cronJobList[0].project
    );
  };

  // loadCronJobDetail = async (name, cluster, project) => {
  //   await axios
  //     .get(
  //       `${SERVER_URL2}/cronjobs/${name}?cluster=${cluster}&project=${project}`
  //     )
  //     .then(({ data: { data, involvesData } }) => {
  //       runInAction(() => {
  //         this.cronJobDetail = data;
  //         this.label = data.label;
  //         this.annotations = data.annotations;
  //         this.cronjobInvolvesJobs = involvesData.jobs;
  //         if (data.events !== null) {
  //           this.events = data.events;
  //         } else {
  //           this.events = null;
  //         }
  //       });
  //     });
  // };
}

const cronJobStore = new CronJob();
export default cronJobStore;
