import axios from "axios";
import { makeAutoObservable, runInAction, toJS } from "mobx";
import { SERVER_URL } from "../config";
import { getItem } from "../utils/sessionStorageFn";

class StatefulSet {
  currentPage = 1;
  totalPages = 1;
  resultList = {};
  viewList = null;
  adminList = [];
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
  containers = [];
  // containers = [{}];

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
        this.paginationList();
        this.loadStatefulSetDetail(
          this.viewList[0].name,
          this.viewList[0].cluster,
          this.viewList[0].project
        );
      }
    });
  };

  paginationList = () => {
    runInAction(() => {
      if (this.statefulSetList !== null) {
        this.viewList = this.statefulSetList.slice(
          (this.currentPage - 1) * 10,
          this.currentPage * 10
        );
      }
    });
  };

  loadStatefulSetList = async () => {
    let { id, role } = getItem("user");
    role === "SA" ? (id = id) : (id = "");
    await axios
      .get(`${SERVER_URL}/statefulsets?user=${id}`)
      .then((res) => {
        runInAction(() => {
          if (res.data.data !== null) {
            this.statefulSetList = res.data.data;
            this.statefulSetDetail = res.data.data[0];
            this.totalPages = Math.ceil(res.data.data.length / 10);
            this.totalElements = res.data.data.length;
          } else {
            this.statefulSetList = [];
          }
        });
      })
      .then(() => {
        this.paginationList();
      })
      .catch(() => {
        this.statefulSetList = [];
        this.paginationList();
      });
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

  loadAdminStatefulSetList = async () => {
    let { id, role } = getItem("user");
    role === "SA" ? (id = id) : (id = "");
    await axios
      .get(`${SERVER_URL}/statefulsets?user=${id}`)
      .then((res) => {
        runInAction(() => {
          this.adminList = res.data.data;
          this.statefulSetList = this.adminList.filter(
            (data) => data.cluster === "gm-cluster"
          );
          if (this.statefulSetList.length !== 0) {
            this.statefulSetDetail = this.statefulSetList[0];
            this.totalPages = Math.ceil(this.statefulSetList.length / 10);
            this.totalElements = this.statefulSetList.length;
          } else {
            this.statefulSetList = [];
          }
        });
      })
      .then(() => {
        this.paginationList();
      })
      .catch(() => {
        this.statefulSetList = [];
        this.paginationList();
      });
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
