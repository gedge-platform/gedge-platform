import axios from "axios";
import { makeAutoObservable, runInAction, toJS } from "mobx";
import { BASIC_AUTH, SERVER_URL2 } from "../config";

class Job {
  currentPage = 1;
  totalPages = 1;
  resultList = {};
  viewList = [];
  pJobList = [];
  jobList = [];
  jobDetailData = {
    containers: [
      {
        name: "",
        image: "",
      },
    ],
    ownerReferences: [
      {
        name: "",
        apiVersion: "",
        kind: "",
      },
    ],
    conditions: [
      {
        status: "",
        type: "",
        lastProbeTime: "",
      },
    ],
  };
  depServicesPort = [
    {
      name: "",
      port: 0,
      protocol: "",
    },
  ];
  involvesPodList = [
    {
      metadata: {
        name: "",
      },
      status: {
        phase: "",
        hostIP: "",
        podIP: "",
      },
      spec: {
        nodeName: "",
      },
    },
  ];
  ownerReferences = {};

  totalElements = 0;
  labels = {};
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

  constructor() {
    makeAutoObservable(this);
  }

  goPrevPage = () => {
    runInAction(() => {
      if (this.currentPage > 1) {
        this.currentPage = this.currentPage - 1;
        this.setViewList(this.currentPage - 1);
        this.loadDeploymentDetail(this.viewList[0].name, this.viewList[0].cluster, this.viewList[0].project);
      }
    });
  };

  goNextPage = () => {
    runInAction(() => {
      if (this.totalPages > this.currentPage) {
        this.currentPage = this.currentPage + 1;
        this.setViewList(this.currentPage - 1);
        this.loadDeploymentDetail(this.viewList[0].name, this.viewList[0].cluster, this.viewList[0].project);
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

      setPJobList = (list) => {
        runInAction(() => {
          this.pJobList = list;
        })
      };

      setViewList = (n) => {
        runInAction(() => {
          this.viewList = this.pJobList[n];
        });
      };

  loadJobList = async (type) => {
    await axios.get(`${SERVER_URL2}/jobs`).then((res) => {
      runInAction(() => {
        const list = res.data.data.filter((item) => item.projectType === type);
        this.jobList = list;
        // this.jobDetail = list[0];
        this.totalElements = list.length;
      });
    }).then(() => {
      this.convertList(this.jobList, this.setPJobList);
    })
    this.loadJobDetail(
      this.jobList[0].name,
      this.jobList[0].cluster,
      this.jobList[0].project
    );
  };

  loadJobDetail = async (name, cluster, project) => {
    await axios
      .get(`${SERVER_URL2}/jobs/${name}?cluster=${cluster}&project=${project}`)
      .then(({ data: { data, involves } }) => {
        runInAction(() => {
          this.jobDetailData = data;
          this.jobDetailInvolves = involves;
          this.labels = data.label;
          this.annotations = data.annotations;
          this.involvesPodList = involves.podList;
          this.ownerReferences = involves.ownerReferences;

          if (data.events !== null) {
            this.events = data.events;
          } else {
            this.events = null;
          }
        });
      });
  };
}

const jobStore = new Job();
export default jobStore;
