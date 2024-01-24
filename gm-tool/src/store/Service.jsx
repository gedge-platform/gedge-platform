import axios from "axios";
import { makeAutoObservable, runInAction, toJS } from "mobx";
import { SERVER_URL } from "../config";
import { getItem } from "../utils/sessionStorageFn";
import { swalError } from "../utils/swal-utils";
import { stringify } from "json-to-pretty-yaml2";

class Service {
  currentPage = 1;
  totalPages = 1;
  resultList = {};
  viewList = null;
  adminList = [];
  pServiceList = [];
  serviceList = [];
  serviceDetail = {
    externalIp: "",
    selector: {
      app: "",
    },
  };
  nodePort = 0;
  totalElements = 0;
  portTemp = [];

  // 생성
  serviceName = "";
  appName = "";
  protocol = "TCP";
  port = 0;
  targetPort = 0;

  cluster = [];
  workspace = "";
  project = "";

  content = "";

  serviceInvolvesData = {};
  involvesPods = [];
  involvesWorkloads = [];

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
        this.loadServiceDetail(
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
        this.loadServiceDetail(
          this.viewList[0].name,
          this.viewList[0].cluster,
          this.viewList[0].project
        );
      }
    });
  };

  paginationList = () => {
    runInAction(() => {
      if (this.serviceList !== null) {
        this.viewList = this.serviceList.slice(
          (this.currentPage - 1) * 10,
          this.currentPage * 10
        );
      }
    });
  };

  loadServiceList = async () => {
    let { id, role } = getItem("user");
    role === "SA" ? (id = id) : (id = "");
    await axios
      .get(`${SERVER_URL}/services?user=${id}`)
      .then((res) => {
        runInAction(() => {
          if (res.data.data !== null) {
            this.serviceList = res.data.data;
            this.serviceDetail = res.data.data[0];
            this.totalPages = Math.ceil(res.data.data.length / 10);
            this.totalElements = res.data.data.length;
          } else {
            this.serviceList = [];
          }
        });
      })
      .then(() => {
        this.paginationList();
      })
      .catch(() => {
        this.serviceList = [];
        this.paginationList();
      });
    this.loadServiceDetail(
      this.viewList[0].name,
      this.viewList[0].cluster,
      this.viewList[0].project
    );
  };

  loadAdminServiceList = async () => {
    let { id, role } = getItem("user");
    role === "SA" ? (id = id) : (id = "");
    await axios
      .get(`${SERVER_URL}/services?user=${id}`)
      .then((res) => {
        runInAction(() => {
          this.adminList = res.data.data;
          this.serviceList = this.adminList.filter(
            (data) => data.cluster === "gm-cluster"
          );
          if (this.serviceList.length !== 0) {
            this.serviceDetail = this.serviceList[0];
            this.totalPages = Math.ceil(this.serviceList.length / 10);
            this.totalElements = this.serviceList.length;
          } else {
            this.serviceList = [];
          }
        });
      })
      .then(() => {
        this.paginationList();
      })
      .catch(() => {
        this.serviceList = [];
        this.paginationList();
      });
    this.loadServiceDetail(
      this.serviceList[0].name,
      this.serviceList[0].cluster,
      this.serviceList[0].project
    );
  };

  loadServiceDetail = async (name, cluster, project) => {
    await axios
      .get(
        `${SERVER_URL}/services/${name}?cluster=${cluster}&project=${project}`
      )
      .then(({ data: { data, involvesData } }) => {
        console.log(data);
        runInAction(() => {
          this.serviceDetail = data;
          this.portTemp = data.port ? data.port : 0;
          this.serviceInvolvesData = involvesData;
          this.involvesPods = involvesData.pods;
          this.involvesWorkloads = involvesData.workloads;
          this.nodePort = data.port[0].nodePort;
        });
      });
  };

  setServiceName = (serviceName) => {
    runInAction(() => {
      this.serviceName = serviceName;
    });
  };

  setAppName = (appName) => {
    runInAction(() => {
      this.appName = appName;
    });
  };

  setProtocol = (protocol) => {
    runInAction(() => {
      this.protocol = protocol;
    });
  };

  setPort = (port) => {
    runInAction(() => {
      this.port = port;
    });
  };

  setTargetPort = (targetPort) => {
    runInAction(() => {
      this.targetPort = targetPort;
    });
  };

  setClusterList = (clusterList) => {
    runInAction(() => {
      this.cluster = clusterList;
    });
  };

  setWorkspace = (workspace) => {
    runInAction(() => {
      this.workspace = workspace;
    });
  };

  setProject = (project) => {
    runInAction(() => {
      this.project = project;
    });
  };
  setContent = (content) => {
    runInAction(() => {
      this.content = content;
    });
  };

  clearAll = () => {
    this.setServiceName("");
    this.setPort(0);
    this.setTargetPort(0);
    this.setProtocol("TCP");
    this.setWorkspace("");
    this.setClusterList([]);
    this.setProject("");
  };

  postService = (callback) => {
    let count = 0;
    this.cluster.map(async (item) => {
      await axios
        .post(
          `${SERVER_URL}/services?cluster=${item}&workspace=${this.workspace}&project=${this.project}`,
          YAML.parse(this.content)
        )
        .then((res) => {
          if (res.status === 200) {
            count++;
            if (count === this.cluster.length) {
              swalError("Deployment가 생성되었습니다.", callback);
            }
          }
        });
    });
  };

  deleteService = async (serviceName, clusterName, projectName, callback) => {
    axios
      .delete(
        `${SERVER_URL}/services/${serviceName}?cluster=${clusterName}&project=${projectName}`
      )
      .then((res) => {
        if (res.status === 200) swalError("서비스가 삭제되었습니다.", callback);
      })
      .catch((err) => swalError("삭제에 실패하였습니다."));
  };
}

const serviceStore = new Service();
export default serviceStore;
