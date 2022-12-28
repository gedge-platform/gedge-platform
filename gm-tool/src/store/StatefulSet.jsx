import axios from "axios";
import { makeAutoObservable, runInAction, toJS } from "mobx";
import { SERVER_URL } from "../config";
import { getItem } from "../utils/sessionStorageFn";

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
    // containers: [{ env: [], ports: [], volumeMounts: [] }],
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
  containers = [{ env: [], ports: [], volumeMounts: [] }];

  constructor() {
    makeAutoObservable(this);
  }

  goPrevPage = () => {
    runInAction(() => {
      if (this.currentPage > 1) {
        this.currentPage = this.currentPage - 1;
        this.setViewList(this.currentPage - 1);
        this.loadStatefulSetDetail(
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
        this.loadStatefulSetDetail(
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

  setPStatefulSetList = (list) => {
    runInAction(() => {
      this.pStatefulSetList = list;
    });
  };

  setViewList = (n) => {
    runInAction(() => {
      this.viewList = this.pStatefulSetList[n];
    });
  };

  loadStatefulSetList = async () => {
    let { id, role } = getItem("user");
    role === "SA" ? (id = id) : (id = "");
    await axios
      .get(`${SERVER_URL}/statefulsets?user=${id}`)
      .then((res) => {
        runInAction(() => {
          // this.totalElements =
          //   res.data.data === null ? 0 : res.data.data.length;
          this.statefulSetList = res.data.data;
          // this.statefulSetDetail = list[0];
          res.data.data === null
            ? (this.totalElements = 0)
            : (this.totalElements = this.statefulSetList.length);
        });
        console.log(this.statefulSetList);
      })
      .then(() => {
        this.convertList(this.statefulSetList, this.setPStatefulSetList);
      });
    // await axios.get(`${SERVER_URL}/statefulsets`).then((res) => {
    //   runInAction(() => {
    //     const list = res.data.data.filter((item) => item.projectType === type);
    //     this.statefulSetList = list;
    //     // this.statefulSetDetail = list[0];
    //     this.totalElements = list.length;
    //   });
    // })
    //   .then(() => {
    //     this.convertList(this.statefulSetList, this.setPStatefulSetList);
    //   })
    this.statefulSetList === null
      ? ((this.statefulSetDetail = null),
        (this.label = null),
        (this.annotations = null))
      : this.loadStatefulSetDetail(
          this.statefulSetList[0].name,
          this.statefulSetList[0].cluster,
          this.statefulSetList[0].project
        );
  };

  loadStatefulSetDetail = async (name, cluster, project) => {
    await axios
      .get(
        `${SERVER_URL}/statefulsets/${name}?cluster=${cluster}&project=${project}`
      )
      .then(({ data: { data } }) => {
        runInAction(() => {
          this.statefulSetDetail = data;
          this.containers = data.containers;
          this.label = data.label;
          this.annotations = data.annotations;
          if (data.events !== null) {
            this.events = data.events;
          } else {
            this.events = null;
          }
        });
      });
  };

  deleteStatefulSet = async (statefulsetName, callback) => {
    axios
      .delete(`${SERVER_URL}/statefulsets/${statefulsetName}`)
      .then((res) => {
        if (res.status === 201)
          swalError("StatefulSet가 삭제되었습니다.", callback);
      })
      .catch((err) => swalError("삭제에 실패하였습니다."));
  };
}

const statefulSetStore = new StatefulSet();
export default statefulSetStore;
