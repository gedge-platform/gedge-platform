import axios from "axios";
import { makeAutoObservable, runInAction, toJS } from "mobx";
import { BASIC_AUTH, SERVER_URL } from "../config";
import { getItem } from "../utils/sessionStorageFn";

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
  containers = [];
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
        this.loadCronJobDetail(
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
        this.setViewList(this.currentPage - 1);
        this.loadCronJobDetail(
          this.viewList[0].name,
          this.viewList[0].cluster,
          this.viewList[0].project
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
        ? "-"
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
      setFunc(this.resultList);
      this.setViewList(0);
    });
  };

  setPCronjobList = (list) => {
    runInAction(() => {
      this.pCronjobList = list;
    });
  };

  setViewList = (n) => {
    runInAction(() => {
      this.viewList = this.pCronjobList[n];
    });
  };

  loadCronJobList = async () => {
    let { id, role } = getItem("user");
    role === "SA" ? (id = id) : (id = "");
    await axios
      .get(`${SERVER_URL}/cronjobs?user=${id}`)
      .then((res) => {
        console.log(res);
        runInAction(() => {
          // const list = data.filter((item) => item.projectType === type);
          this.cronJobList = res.data.data;
          // this.cronJobDetail = list[0];
          res.data.data === null
            ? (this.totalElements = 0)
            : (this.totalElements = res.data.data.length);
        });
      })
      .then(() => {
        this.convertList(this.cronJobList, this.setPCronjobList);
        // await axios.get(`${SERVER_URL}/cronjobs`).then(({ data: { data } }) => {
        //   runInAction(() => {
        //     const list = data.filter((item) => item.projectType === type);
        //     this.cronJobList = list;
        //     // this.cronJobDetail = list[0];
        //     this.totalElements = list.length;
      });
    this.cronJobList === null
      ? ((this.containers = null),
        (this.label = null),
        (this.cronJobDetail = null),
        (this.annotations = null),
        (this.cronjobInvolvesJobs = null),
        (this.events = null))
      : this.loadCronJobDetail(
          this.cronJobList[0].name,
          this.cronJobList[0].cluster,
          this.cronJobList[0].project
        );
    console.log(this.label);
  };

  loadCronJobDetail = async (name, cluster, project) => {
    await axios
      .get(
        `${SERVER_URL}/cronjobs/${name}?cluster=${cluster}&project=${project}`
      )
      .then(({ data: { data, involvesData } }) => {
        runInAction(() => {
          console.log(data);
          this.cronJobDetail = data;
          this.containers = data.containers;
          this.label = data.label;
          this.annotations = data.annotations;
          this.cronjobInvolvesJobs = involvesData.jobs;
          if (data.events !== null) {
            this.events = data.events;
          } else {
            this.events = null;
          }
        });
      });
  };

  deleteCronJob = async (cronjobName, callback) => {
    axios
      .delete(`${SERVER_URL}/cronjobs/${cronjobName}`)
      .then((res) => {
        if (res.status === 201)
          swalError("CronJob이 삭제되었습니다.", callback);
      })
      .catch((err) => swalError("삭제에 실패하였습니다."));
  };
}

const cronJobStore = new CronJob();
export default cronJobStore;
