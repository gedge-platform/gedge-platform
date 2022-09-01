import axios from "axios";
import { makeAutoObservable, runInAction, toJS } from "mobx";
import { BASIC_AUTH, SERVER_URL2 } from "../config";

class StatefulSet {
  currentPage = 1;
  totalPages = 1;
  resultList = {};
  viewList = [];
  pStatefulSetList = [];
  statefulSetList = [];
  statefulSetDetail = {
    name: "",
    project: "",
    cluster: "",
    status: {
      availableReplicas: 0,
      collisionCount: 0,
      currentReplicas: 0,
      currentRevision: "",
      observedGeneration: 0,
      readyReplicas: 0,
      replicas: 0,
      updateRevision: "",
      updatedReplicas: 0,
    },
    containers: [{ env: [], ports: [], volumeMounts: [] }],
    ownerReferences: [],
    label: {},
    events: [],
    annotations: {},
    createAt: "",
  };
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
  totalElements = 0;

  constructor() {
    makeAutoObservable(this);
  }

  goPrevPage = () => {
    runInAction(() => {
      if (this.currentPage > 1) {
        this.currentPage = this.currentPage - 1;
        this.setViewList(this.currentPage - 1);
        this.loadStatefulSetDetail(this.viewList[0].name, this.viewList[0].cluster, this.viewList[0].project);
      }
    });
  };

  goNextPage = () => {
    runInAction(() => {
      if (this.totalPages > this.currentPage) {
        this.currentPage = this.currentPage + 1;
        this.setViewList(this.currentPage - 1);
        this.loadStatefulSetDetail(this.viewList[0].name, this.viewList[0].cluster, this.viewList[0].project);
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

  setPStatefulSetList = (list) => {
    runInAction(() => {
      this.pStatefulSetList = list;
    })
  };

  setViewList = (n) => {
    runInAction(() => {
      this.viewList = this.pStatefulSetList[n];
    });
  };

  loadStatefulSetList = async (type) => {
    await axios.get(`${SERVER_URL2}/statefulsets`).then((res) => {
      runInAction(() => {
        const list = res.data.data.filter((item) => item.projectType === type);
        this.statefulSetList = list;
        // this.statefulSetDetail = list[0];
        this.totalElements = list.length;
      });
    })
    .then(() => {
      this.convertList(this.statefulSetList, this.setPStatefulSetList);
    })
    this.loadStatefulSetDetail(
      this.statefulSetList[0].name,
      this.statefulSetList[0].cluster,
      this.statefulSetList[0].project
    );
  };

  loadStatefulSetDetail = async (name, cluster, project) => {
    await axios
      .get(
        `${SERVER_URL2}/statefulsets/${name}?cluster=${cluster}&project=${project}`
      )
      .then((res) => {
        runInAction(() => {
          this.statefulSetDetail = res.data.data;
          this.label = res.data.data.label;
          this.annotations = res.data.data.annotations;
          if (res.data.data.events !== null) {
            this.events = res.data.data.events;
          } else {
            this.events = null;
          }
        });
      });
  };
}

const statefulSetStore = new StatefulSet();
export default statefulSetStore;
