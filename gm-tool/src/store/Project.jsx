import axios from "axios";
import { makeAutoObservable, runInAction, toJS } from "mobx";
import { SERVER_URL } from "../config";
import { getItem } from "@/utils/sessionStorageFn";
import { swalError } from "../utils/swal-utils";

class Project {
  projectList = [];
  projectDetail = {};
  resourceUsage = {};
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
  viewList = [];

  currentEvent = 1;
  totalEvents = 1;
  resultEvent = {};
  eventList = [];
  eventLength = 0;

  constructor() {
    makeAutoObservable(this);
  }

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

  loadProjectList = async () => {
    let { id, role } = getItem("user");
    role === "SA" ? (id = id) : (id = "");
    await axios
      .get(`${SERVER_URL}/userProjects?user=${id}`)
      .then((res) => {
        runInAction(() => {
          // const list = res.data.data.filter(
          //   (item) => item.projectType === type
          // );
          this.projectList = res.data.data;
          this.totalElements = res.data.data.length;
        });
      })
      .then(() => {
        console.log(this.projectList);
        this.convertList(this.projectList, this.setProjectList);
      })
      .then(() => {
        this.loadProjectDetail(this.viewList[0].projectName);
      });
  };

  loadProjectDetail = async (projectName) => {
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
      })
      .then(() => {
        // this.eventLength = this.events.length;
        // console.log(this.events);
        // this.convertEventList(this.events, this.setEventList);
      });
  };

  loadProjectListInWorkspace = async (workspaceName) => {
    await axios
      .get(`${SERVER_URL}/userProjects?workspace=${workspaceName}`)
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
        console.log(res);
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
    console.log(body);

    // // const body2 = {
    // //   projectName,
    // //   projectDescription,
    // //   memberName: getItem("user"),
    // //   clusterName: selectCluster,
    // //   projectType,
    // //   workspaceName,
    // // };
    // axios
    //   .post(`${SERVER_URL}/projects`, body2)
    //   .then((res) => console.log(res))
    //   .catch((err) => console.error(err));
    axios
      .post(`${SERVER_URL}/projects`, body)
      .then((res) => {
        console.log(res);
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

  // setTotalEvents = (n) => {
  //   runInAction(() => {
  //     this.totalEvents = n;
  //   });
  // };

  // setEventViewList = (n) => {
  //   runInAction(() => {
  //     this.eventList = this.events[n];
  //     console.log(this.eventList);
  //   });
  // };

  // setEventList = (list) => {
  //   runInAction(() => {
  //     this.events = list;
  //   });
  // };

  // convertEventList = (apiList, setFunc) => {
  //   runInAction(() => {
  //     let cnt = 1;
  //     let totalCnt = 0;
  //     let tempList = [];
  //     let cntCheck = true;
  //     this.resultEvent = {};

  //     Object.entries(apiList).map(([_, value]) => {
  //       cntCheck = true;
  //       tempList.push(toJS(value));
  //       cnt = cnt + 1;
  //       if (cnt > 5) {
  //         cntCheck = false;
  //         cnt = 1;
  //         this.resultEvent[totalCnt] = tempList;
  //         totalCnt = totalCnt + 1;
  //         tempList = [];
  //       }
  //     });

  //     if (cntCheck) {
  //       this.resultEvent[totalCnt] = tempList;
  //       totalCnt = totalCnt === 0 ? 1 : totalCnt + 1;
  //     }

  //     this.setTotalEvents(totalCnt);
  //     setFunc(this.resultEvent);
  //     this.setEventViewList(0);
  //   });
  // };
}

const projectStore = new Project();
export default projectStore;
