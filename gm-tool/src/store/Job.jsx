import axios from "axios";
import { makeAutoObservable, runInAction, toJS } from "mobx";
import { SERVER_URL } from "../config";
import { swalError } from "../utils/swal-utils";
import { getItem } from "../utils/sessionStorageFn";

class Job {
  currentPage = 1;
  totalPages = 1;
  resultList = {};
  viewList = null;
  adminList = [];
  pJobList = [];
  jobList = [];
  containers = [];
  jobDetailData = [];
  // jobDetailData = {
  //   containers: [
  //     {
  //       name: "",
  //       image: "",
  //     },
  //   ],
  //   ownerReferences: [
  //     {
  //       name: "",
  //       apiVersion: "",
  //       kind: "",
  //     },
  //   ],
  //   conditions: [
  //     {
  //       status: "",
  //       type: "",
  //       lastProbeTime: "",
  //     },
  //   ],
  // };
  depServicesPort = [
    {
      name: "",
      port: 0,
      protocol: "",
    },
  ];
  involvesPodList = [];
  ownerReferences = [];

  totalElements = 0;
  labels = [];
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
        this.loadJobDetail(
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
        this.paginationList();
        this.loadJobDetail(
          this.viewList[0].name,
          this.viewList[0].cluster,
          this.viewList[0].project
        );
      }
    });
  };

  paginationList = () => {
    if (this.jobList !== null) {
      this.viewList = this.jobList.slice(
        (this.currentPage - 1) * 10,
        this.currentPage * 10
      );
    }
  };

  loadJobList = async () => {
    let { id, role } = getItem("user");
    role === "SA" ? (id = id) : (id = "");
    await axios
      .get(`${SERVER_URL}/jobs?user=${id}`)
      .then((res) => {
        runInAction(() => {
          if (res.data.data !== null) {
            this.jobList = res.data.data;
            this.jobDetail = res.data.data[0];
            this.totalPages = Math.ceil(res.data.data.length / 10);
            this.totalElements = res.data.data.length;
          } else {
            this.jobList = [];
          }
        });
      })
      .then(() => {
        this.paginationList();
        this.jobList.length === 0
          ? this.jobDetailData === null
          : this.loadJobDetail(
              this.jobList[0].name,
              this.jobList[0].cluster,
              this.jobList[0].project
            );
      });
  };

  loadAdminJobList = async () => {
    let { id, role } = getItem("user");
    role === "SA" ? (id = id) : (id = "");
    await axios
      .get(`${SERVER_URL}/jobs?user=${id}`)
      .then((res) => {
        runInAction(() => {
          this.adminList = res.data.data;
          this.jobList = this.adminList.filter(
            (data) => data.cluster === "gm-cluster"
          );
          if (this.jobList.length !== 0) {
            this.jobDetailData = this.jobList[0];
            this.totalPages = Math.ceil(this.jobList.length / 10);
            this.totalElements = this.jobList.length;
          } else {
            this.jobList = [];
          }
        });
      })
      .then(() => {
        this.paginationList();
      });
    this.loadJobDetail(
      this.jobList[0].name,
      this.jobList[0].cluster,
      this.jobList[0].project
    );
  };

  loadJobDetail = async (name, cluster, project) => {
    await axios
      .get(`${SERVER_URL}/jobs/${name}?cluster=${cluster}&project=${project}`)
      .then(({ data: { data, involves } }) => {
        runInAction(() => {
          this.jobDetailData = data;
          this.containers = data.containers;
          this.jobDetailInvolves = involves;
          this.labels = data.label;
          this.annotations = data.annotations;
          this.involvesPodList = involves.podList;
          this.ownerReferences = involves.ownerReferences;
          this.containers = data.containers;
          this.events = data.events;
        });
      });
  };

  deleteJob = async (jobName, callback) => {
    axios
      .delete(`${SERVER_URL}/jobs/${jobName}`)
      .then((res) => {
        if (res.status === 201) swalError("Job이 삭제되었습니다.", callback);
      })
      .catch((err) => swalError("삭제에 실패하였습니다."));
  };
}

const jobStore = new Job();
export default jobStore;
