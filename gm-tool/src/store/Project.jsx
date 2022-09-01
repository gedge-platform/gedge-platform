import axios from "axios";
import { makeAutoObservable, runInAction, toJS } from "mobx";
import { BASIC_AUTH, SERVER_URL2, SERVER_URL4 } from "../config";
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

  loadProjectList = async (type = "user") => {
    await axios
      .get(`${SERVER_URL4}/userProjects`)
      .then((res) => {
        runInAction(() => {
          const list = res.data.data.filter(
            (item) => item.projectType === type
          );
          this.projectList = list;
          this.totalElements = list.length;
        });
      })
      .then(() => {
        this.convertList(this.projectList, this.setProjectList);
      })
      .then(() => {
        this.loadProjectDetail(this.viewList[0].projectName);
      });
  };

  loadProjectDetail = async (projectName) => {
    await axios
      .get(`${SERVER_URL4}/userProjects/${projectName}`)
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
  };

  loadProjectListInWorkspace = async (workspaceName) => {
    await axios
      .get(`${SERVER_URL4}/userProjects?workspace=${workspaceName}`)
      .then((res) => {
        runInAction(() => {
          this.projectListinWorkspace = res.data.data;
        });
      });
  };

  loadSystemProjectList = async (type) => {
    await axios.get(`${SERVER_URL4}/systemProjects`).then((res) => {
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
    //   .post(`${SERVER_URL2}/projects`, body2)
    //   .then((res) => console.log(res))
    //   .catch((err) => console.error(err));
    axios
      .post(`${SERVER_URL4}/projects`, body)
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

  deleteProject = (projectName, callback) => {
    axios
      .delete(`${SERVER_URL4}/projects/${projectName}`)
      .then((res) => {
        if (res.status === 200)
          swalError("프로젝트가 삭제되었습니다.", callback);
      })
      .catch((err) => swalError("삭제에 실패하였습니다."));
  };
}

const projectStore = new Project();
export default projectStore;
