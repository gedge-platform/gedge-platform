import axios from "axios";
import { makeAutoObservable, runInAction, toJS } from "mobx";
import { SERVER_URL } from "../config";
import { getItem } from "@/utils/sessionStorageFn";
import { swalError } from "../utils/swal-utils";

class Workspace {
  workSpaceList = [];
  workSpaceDetail = [];
  totalElements = 0;
  adminList = [];
  adminLists = [];
  test = [];
  events = [
    {
      kind: "",
      name: "",
      namespace: "",
      cluster: "",
      mesage: "",
      reason: "",
      type: "",
      eventTime: "",
    },
  ];
  projectList = [{}];
  clusterList = [];
  detailInfo = [{}];
  selectProject = "";
  selectCluster = [];
  dataUsage = {};
  selectClusterInfo = [];
  workspace = [];

  viewList = [];
  currentPage = 1;
  totalPages = 1;

  check = false;
  workspaceName = "";
  workspaceDescription = "";

  sourceClusterList = [];
  setSourceClusterList = (value) => {
    runInAction(() => {
      this.sourceClusterList = value;
    });
  };

  setCheck = () => {
    this.check = true;
  };

  setWorkspaceName = (value) => {
    runInAction(() => {
      this.workspaceName = value;
    });
  };

  setWorkspaceDescription = (value) => {
    runInAction(() => {
      this.workspaceDescription = value;
    });
  };

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
        this.loadWorkspaceDetail(this.viewList[0].workspaceName);
      }
    });
  };

  goNextPage = () => {
    runInAction(() => {
      if (this.totalPages > this.currentPage) {
        this.currentPage = this.currentPage + 1;
        this.paginationList();
        this.loadWorkspaceDetail(this.viewList[0].workspaceName);
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

  setWorkSpaceList = (list = []) => {
    runInAction(() => {
      this.workSpaceList = list;
    });
  };

  // setWorkSpaceList = (workSpaceList = []) => {
  //   runInAction(() => {
  //     this.workSpaceList = workSpaceList;
  //   });
  // };

  setViewList = (n) => {
    runInAction(() => {
      this.viewList = this.workSpaceList[n];
    });
  };

  setMetricsLastTime = (time) => {
    runInAction(() => {
      this.lastTime = time;
    });
  };

  paginationList = () => {
    runInAction(() => {
      if (this.workSpaceList !== null) {
        this.viewList = this.workSpaceList.slice(
          (this.currentPage - 1) * 10,
          this.currentPage * 10
        );
      } else if (this.adminLists !== null) {
        this.viewList = this.adminLists.slice(
          (this.currentPage - 1) * 10,
          this.currentPage * 10
        );
      }
    });
  };

  loadWorkSpaceList = async (type = false) => {
    let { id, role } = getItem("user");
    role === "SA" ? (id = id) : (id = "");
    await axios
      .get(`${SERVER_URL}/workspaces?user=${id}`)
      .then((res) => {
        runInAction(() => {
          this.workSpaceList = res.data.data;
          this.totalPages = Math.ceil(this.workSpaceList.length / 10);
          this.totalElements = this.workSpaceList.length;
          this.loadWorkspaceDetail(this.workSpaceList[0].workspaceName);
          this.workspace = this.workSpaceList
            ? this.workSpaceList.map((item) => item.workspaceName)
            : null;
        });
      })
      .then(() => {
        // this.convertList(this.workSpaceList, this.setWorkSpaceList);
        this.paginationList();
      })
      .catch(() => {
        this.workSpaceList = [];
        this.paginationList();
      });
  };

  loadAdminWorkSpaceList = async () => {
    let { id, role } = getItem("user");
    role === "SA" ? (id = id) : (id = "");
    await axios
      .get(`${SERVER_URL}/workspaces?user=${id}`)
      .then((res) => {
        runInAction(() => {
          this.adminList = res.data.data;
          this.adminLists = this.adminList.filter((workspace) =>
            workspace.selectCluster.some(
              (cluster) => cluster.clusterName === "gm-cluster"
            )
          );
          this.workSpaceList = res.data.data;
          if (this.workSpaceList.length !== 0) {
            this.totalPages = Math.ceil(this.workSpaceList.length / 10);
            this.totalElements = this.workSpaceList.length;
            this.loadWorkspaceDetail(this.workSpaceList[0].workspaceName);
          }
          if (this.adminLists.length !== 0) {
            this.totalPages = Math.ceil(this.adminLists.length / 10);
            this.totalElements = this.adminLists.length;
            this.loadWorkspaceDetail(this.adminLists[0].workspaceName);
          } else {
            // 두 경우 모두 해당하지 않는 경우
            this.adminLists = [];
            this.workSpaceList = [];
          }
          // else {
          //   this.workSpaceList = [];
          // }
        });
      })
      .then((res) => {
        runInAction(() => {
          this.paginationList();
        });
      })
      .catch(() => {
        this.workSpaceList = [];
        this.paginationList();
      });
  };

  // 워크스페이스에서 클러스터 불러오면 된다
  loadWorkspaceDetail = async (workspaceName) => {
    await axios.get(`${SERVER_URL}/workspaces/${workspaceName}`).then((res) => {
      runInAction(() => {
        this.workSpaceDetail = res.data;
        this.dataUsage = this.workSpaceDetail.resourceUsage;
        if (res.data.events !== null) {
          this.events = this.workSpaceDetail.events;
        } else {
          this.events = null;
        }
        this.detailInfo = res.data.projectList ? res.data.projectList : 0;
        this.selectClusterInfo = res.data.selectCluster;
        this.projectList = res.data.projectList ? res.data.projectList : 0;
      });
    });
  };

  loadSourceCluster = async (workspaceName) => {
    await axios.get(`${SERVER_URL}/workspaces/${workspaceName}`).then((res) => {
      runInAction(() => {
        this.sourceClusterList = res.data.selectCluster;
      });
    });
  };

  createWorkspace = (
    workspaceName,
    workspaceDescription,
    selectCluster,
    callback
  ) => {
    const body = {
      workspaceName,
      workspaceDescription,
      clusterName: selectCluster,
      memberName: getItem("user").id,
      // workspaceCreator: getItem("user").id,
    };

    axios
      .post(`${SERVER_URL}/workspaces`, body)
      .then((res) => {
        if (res.status === 201) {
          swalError("워크스페이스를 생성하였습니다.", callback);
        }
      })
      .catch((err) => {
        swalError("워크스페이스 생성에 실패하였습니다.");
      });
  };

  changeCluster = (cluster) => {
    runInAction(() => {
      this.selectCluster = cluster;
    });
  };

  changeProject = (project) => {
    runInAction(() => {
      this.selectProject = project;
    });
  };

  setWorkspace = (workspace) => {
    runInAction(() => {
      this.workspace = workspace;
    });
  };

  setProjectList = (value) => {
    runInAction(() => {
      this.projectList = value;
    });
  };

  deleteWorkspace = async (workspaceName, callback) => {
    axios
      .delete(`${SERVER_URL}/workspaces/${workspaceName}`)
      .then((res) => {
        if (res.status === 200)
          swalError("워크스페이스가 삭제되었습니다.", callback);
      })
      .catch((err) => {
        swalError("삭제에 실패하였습니다.");
      });
  };

  setSelectClusterInfo = (selectClusterInfo) => {
    runInAction(() => {
      this.selectClusterInfo = selectClusterInfo;
    });
  };
}

const workspaceStore = new Workspace();
export default workspaceStore;
