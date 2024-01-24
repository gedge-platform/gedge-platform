import axios from "axios";
import { makeAutoObservable, runInAction, toJS } from "mobx";
import { SERVER_URL } from "../config";
import { getItem } from "@/utils/sessionStorageFn";
import { swalError } from "../utils/swal-utils";

class Project {
  projectList = [];
  projectLists = [];
  projectDetail = {};
  resourceUsage = {};
  adminList = [];
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

  projectListinWorkspace = [];
  totalElements = 0;
  systemProjectList = [];

  detailInfo = [{}];
  clusterList = [];
  selectCluster = "";

  selectClusterInfo = [
    {
      clusterEndpoint: "",
      clusterType: "",
      clusterName: "",
      token: "",
    },
  ];
  workspace = {};

  currentPage = 1;
  totalPages = 1;
  resultList = {};
  viewList = null;

  currentEvent = 1;
  totalEvents = 1;
  resultEvent = {};
  eventList = [];
  eventLength = 0;

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
        this.setViewList(this.currentPage - 1);
        this.loadProjectDetail(this.viewList[0].projectName);
      }
    });
  };

  goNextPage = () => {
    runInAction(() => {
      if (this.totalPages > this.currentPage) {
        this.currentPage = this.currentPage + 1;
        this.setViewList(this.currentPage - 1);
        this.loadProjectDetail(this.viewList[0].projectName);
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

  setProjectList = (list) => {
    runInAction(() => {
      this.projectList = list;
    });
  };

  setViewList = (n) => {
    runInAction(() => {
      this.viewList = this.projectList[n];
    });
  };

  paginationList = () => {
    runInAction(() => {
      if (this.projectList !== null) {
        this.viewList = this.projectList.slice(
          (this.currentPage - 1) * 10,
          this.currentPage * 10
        );
      }
    });
  };

  loadProjectList = async () => {
    let { id, role } = getItem("user");
    role === "SA" ? (id = id) : (id = "");
    await axios
      .get(`${SERVER_URL}/userProjects?user=${id}`)
      .then((res) => {
        runInAction(() => {
          this.projectList = res.data.data;
          this.projectLists = res.data.data;
          this.totalElements = res.data.data.length;
        });
      })
      .then(() => {
        this.convertList(this.projectList, this.setProjectList);
      })
      .then(() => {
        this.loadProjectDetail(this.viewList[0].projectName);
      });
  };

  loadAdminProjectList = async () => {
    let { id, role } = getItem("user");
    role === "SA" ? (id = id) : (id = "");
    await axios
      .get(`${SERVER_URL}/userProjects?user=${id}`)
      .then((res) => {
        runInAction(() => {
          this.adminList = res.data.data;
          this.projectList = this.adminList.filter((project) =>
            project.selectCluster.some(
              (cluster) => cluster.clusterName === "gm-cluster"
            )
          );
          if (this.projectList.length !== 0) {
            this.totalPages = Math.ceil(this.projectList.length / 10);
            this.totalElements = this.projectList.length;
          } else {
            this.projectList = [];
          }
        });
      })
      .then(() => {
        this.paginationList();
      })
      .then(() => {
        this.loadProjectDetail(
          this.projectList[0] ? this.adminList[0].projectName : null
        );
      })
      .catch(() => {
        this.projectList = [];
        this.paginationList();
      });
  };

  loadProjectDetail = async (projectName) => {
    try {
      await axios
        .get(`${SERVER_URL}/userProjects/${projectName}`)
        .then(({ data: { data } }) => {
          runInAction(() => {
            this.projectDetail = data;
            this.detailInfo = data.DetailInfo;
            this.workspace = data.workspace;
            this.labels = data.DetailInfo[0].labels;
            this.annotations = data.DetailInfo[0].annotations;
            if (data.events !== null) {
              this.events = data.events;
            } else {
              this.events = null;
            }
            this.selectClusterInfo = data.selectCluster;

            const tempSelectCluster = data.selectCluster;
            this.clusterList = tempSelectCluster.map(
              (cluster) => cluster.clusterName
            );
            this.selectCluster = this.clusterList[0];
            this.resourceUsage = this.detailInfo.map(
              (data) => data.resourceUsage
            );
            // const temp = new Set(res.data.map((cluster) => cluster.clusterName));
            // this.clusterList = [...temp];
          });
        });
    } catch (e) {
      this.projectDetail = null;
      this.detailInfo = [{}];
      this.workspace = {};
      this.labels = null;
      this.annotations = null;
      this.events = null;
      this.selectClusterInfo = null;
      this.clusterList = null;
      this.selectCluster = null;
      this.resourceUsage = { namespace_cpu: null, namespace_memory: null };
    }
  };

  loadProjectListInWorkspace = async (workspaceName) => {
    let { id, role } = getItem("user");
    role === "SA" ? (id = id) : (id = "");
    await axios
      .get(`${SERVER_URL}/userProjects?user=${id}&workspace=${workspaceName}`)
      .then((res) => {
        runInAction(() => {
          this.projectListinWorkspace = res.data.data;
        });
      });
  };

  loadSystemProjectList = async () => {
    let { id, role } = getItem("user");
    role === "SA" ? (id = id) : (id = "");
    await axios.get(`${SERVER_URL}/systemProjects?user=${id}`).then((res) => {
      runInAction(() => {
        this.systemProjectList = res.data.data;
        this.totalElements = res.data.length;
      });
    });
  };

  setProjectListinWorkspace = (projectList = []) => {
    runInAction(() => {
      this.projectListinWorkspace = projectList;
    });
  };

  changeCluster = (cluster) => {
    runInAction(() => {
      this.selectCluster = cluster;
    });
  };

  setSelectClusterInfo = (selectClusterInfo) => {
    runInAction(() => {
      this.selectClusterInfo = selectClusterInfo;
    });
  };

  createProject = (
    projectName,
    projectDescription,
    projectType,
    workspaceName,
    selectCluster,
    istioCheck,
    callback
  ) => {
    const { id } = getItem("user");

    const body = {
      projectName: projectName,
      projectDescription,
      projectType,
      clusterName: selectCluster,
      workspaceName,
      memberName: id,
      istioCheck: istioCheck ? "enabled" : "disabled",
    };

    axios
      .post(`${SERVER_URL}/projects`, body)
      .then((res) => {
        if (res.status === 201) {
          swalError("Project가 생성되었습니다!", callback);
        }
      })
      .catch((err) => {
        swalError("프로젝트 생성에 실패하였습니다.", callback);
        console.error(err);
      });
  };

  deleteProject = async (projectName, callback) => {
    axios
      .delete(`${SERVER_URL}/projects/${projectName}`)
      .then((res) => {
        if (res.status === 200)
          swalError("프로젝트가 삭제되었습니다.", callback);
      })
      .catch((err) => swalError("삭제에 실패하였습니다."));
  };

  setCurrentEvent = (n) => {
    runInAction(() => {
      this.currentEvent = n;
    });
  };

  goPrevEvent = () => {
    runInAction(() => {
      if (this.currentEvent > 1) {
        this.currentEvent = this.currentEvent - 1;
        this.setEventViewList(this.currentEvent - 1);
      }
    });
  };

  goNextEvent = () => {
    runInAction(() => {
      if (this.totalEvents > this.currentEvent) {
        this.currentEvent = this.currentEvent + 1;
        this.setEventViewList(this.currentEvent - 1);
      }
    });
  };
}

const projectStore = new Project();
export default projectStore;
