import axios from "axios";
import { makeAutoObservable, runInAction, toJS } from "mobx";
import { BASIC_AUTH, SERVER_URL2, SERVER_URL4 } from "../config";
import { getItem } from "@/utils/sessionStorageFn";
import { swalError } from "../utils/swal-utils";
import { ThirtyFpsRounded } from "@mui/icons-material";

class Workspace {
  workSpaceList = [];
  workSpaceDetail = [];
  totalElements = 0;
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

  constructor() {
    makeAutoObservable(this);
  }

  goPrevPage = () => {
    runInAction(() => {
      if (this.currentPage > 1) {
        this.currentPage = this.currentPage - 1;
        this.setViewList(this.currentPage - 1);
        this.loadWorkspaceDetail(this.viewList[0].workspaceName);
      }
    });
  };

  goNextPage = () => {
    runInAction(() => {
      if (this.totalPages > this.currentPage) {
        this.currentPage = this.currentPage + 1;
        this.setViewList(this.currentPage - 1);
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

  setWorkSpaceList = (list = []) => {
    runInAction(() => {
      this.workSpaceList = list;
    });
  };

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

  // loadWorkSpaceList = async (type = "user") => {
  //   await axios
  //     .get(`${SERVER_URL2}/workspace`)
  //     .then((res) => {
  //       runInAction(() => {
  //         this.workSpaceList = res.data;
  //         // this.workSpaceDetail = res.data[0];
  //         this.totalElements = res.data.length;
  //       });
  //     })
  //     .then(() => {
  //       this.loadWorkspaceDetail(this.workSpaceList[0].workspaceName);
  //     });
  // };

  loadWorkSpaceList = async (type = false) => {
    await axios
      .get(`${SERVER_URL4}/workspaces`)
      .then(({ data: { data } }) => {
        runInAction(() => {
          this.workSpaceList = data;
          this.totalElements = data.length;
          this.workspace = this.workSpaceList.map((item) => item.workspaceName);
        });
      })
      .then(() => {
        this.convertList(this.workSpaceList, this.setWorkSpaceList);
      })
      // .then(() => {
      //   this.loadWorkspaceDetail(this.viewList[0].workspaceName);
      // });
      .then(() => {
        type ? null : this.loadWorkspaceDetail(this.viewList[0].workspaceName);
      });
  };

  // 워크스페이스에서 클러스터 불러오면 된다
  loadWorkspaceDetail = async (workspaceName) => {
    await axios
      .get(`${SERVER_URL4}/workspaces/${workspaceName}`)
      .then((res) => {
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

  setWorkSpaceList = (workSpaceList = []) => {
    runInAction(() => {
      this.workSpaceList = workSpaceList;
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
      MemberName: getItem("user").id,
      // workspaceCreator: getItem("user"),
    };
    // const body2 = {
    //   workspaceName,
    //   workspaceDescription,
    //   memberName: getItem("user"),
    //   clusterName: selectCluster,
    // };
    // axios
    //   .post(`${SERVER_URL2}/workspaces`, body2)
    //   .then((res) => console.log(res))
    //   .catch((err) => console.error(err));
    // return
    axios
      .post(`${SERVER_URL4}/workspaces`, body)
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

  deleteWorkspace = (workspaceName, callback) => {
    axios
      .delete(`${SERVER_URL4}/workspaces/${workspaceName}`)
      .then((res) => console.log(res))
      .catch((err) => console.error(err));

    axios
      .delete(`${SERVER_URL4}/workspaces/${workspaceName}`)
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

const workspacestore = new Workspace();
export default workspacestore;
