import axios from "axios";
import { makeAutoObservable, runInAction, toJS } from "mobx";
import { SERVER_URL } from "../config";
import { swalError } from "../utils/swal-utils";
import volumeStore from "./Volume";
import { getItem } from "../utils/sessionStorageFn";

class Deployment {
  currentPage = 1;
  totalPages = 1;
  resultList = {};
  viewList = [];
  pDeploymentList = [];
  deploymentList = [];
  deploymentDetail = {
    name: "",
    project: "",
    cluster: "",
    workspace: "",
    ready: "",
    createAt: "",
    replica: {
      replicas: 0,
      readyReplicas: 0,
      updatedReplicas: 0,
      availableReplicas: 0,
      unavailableReplicas: 0,
    },
    strategy: {
      rollingUpdate: {
        maxSurge: "",
        maxUnavailable: "",
      },
      type: "",
    },
    containers: [
      {
        env: [{ name: "", value: "" }],
        image: "",
        imagePullPolicy: "",
        name: "",
        ports: [{ containerPort: 0, protocol: "" }],
        resources: {},
        terminationMessagePath: "",
        terminationMessagePolicy: "",
      },
    ],
    lables: {},
    events: [
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
    ],
    annotations: {},
    involvesData: {},
  };

  deploymentEvents = [];

  deploymentInvolvesData = {};
  strategy = {
    type: {},
  };
  labels = {};
  annotations = {};

  containersTemp = [
    {
      image: "",
      imagePullPolicy: "",
      name: "",
      ports: [
        {
          containerPort: 0,
          protocol: "",
        },
      ],
      resources: {},
      terminationMessagePath: "",
      terminationMessagePolicy: "",
    },
  ];
  pods = [{}];
  totalElements = 0;
  deploymentName = "";

  podReplicas = "";
  containerImage = "";
  containerName = "";
  containerPort = "";
  podReplicas = 0;

  workspace = "";
  cluster = "";
  project = "";
  responseData = "";
  workspaceName = "";
  projectName = "";

  deploymentResource = {};
  pods = [];
  containerPortName = "";

  depServices = {};

  content = "";
  contentVolume = "";

  constructor() {
    makeAutoObservable(this);
  }

  goPrevPage = () => {
    runInAction(() => {
      if (this.currentPage > 1) {
        this.currentPage = this.currentPage - 1;
        this.setViewList(this.currentPage - 1);
        this.loadDeploymentDetail(
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
        this.loadDeploymentDetail(
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

  setPDeploymentList = (list) => {
    runInAction(() => {
      this.pDeploymentList = list;
    });
  };

  setViewList = (n) => {
    runInAction(() => {
      this.viewList = this.pDeploymentList[n];
    });
  };

  loadDeploymentList = async () => {
    let { id, role } = getItem("user");
    role === "SA" ? (id = id) : (id = "");
    await axios
      .get(`${SERVER_URL}/deployments?user=${id}`)
      .then((res) => {
        runInAction(() => {
          this.deploymentList = res.data.data;
          this.deploymentDetail = res.data.data[0];
          this.totalElements =
            res.data.data === null ? 0 : res.data.data.length;
        });
      })
      .then(() => {
        this.convertList(this.deploymentList, this.setPDeploymentList);
      });
    this.loadDeploymentDetail(
      this.deploymentList[0].name,
      this.deploymentList[0].cluster,
      this.deploymentList[0].project
    );
  };

  loadDeploymentDetail = async (name, cluster, project) => {
    await axios
      .get(
        `${SERVER_URL}/deployments/${name}?cluster=${cluster}&project=${project}`
      )
      .then(({ data: { data, involvesData } }) => {
        runInAction(() => {
          this.deploymentDetail = data;
          this.workspace = data.workspace;
          this.workspaceName = data.workspace;
          this.projectName = data.project;
          this.strategy = data.strategy;
          this.labels = data.labels;
          this.annotations = data.annotations;
          if (data.events !== null) {
            this.events = data.events;
          } else {
            this.events = null;
          }
          this.pods = involvesData.pods;
          this.depServices = involvesData.services;
          // this.depServicesPort = involvesData.services.port;
          this.deploymentEvents = data.events;
          this.containersTemp = data.containers;
          console.log(this.events);
        });
      });
  };

  setWorkspace = (workspace) => {
    runInAction(() => {
      this.workspace = workspace;
    });
  };
  setCluster = (cluster) => {
    runInAction(() => {
      this.cluster = cluster;
    });
  };
  setProject = (project) => {
    runInAction(() => {
      this.project = project;
    });
  };

  setDeployName = (name) => {
    runInAction(() => {
      this.deploymentName = name;
    });
  };

  setWorkspaceName = (workspace) => {
    runInAction(() => {
      this.workspaceName = workspace;
    });
  };

  setProjectName = (project) => {
    runInAction(() => {
      this.projectName = project;
    });
  };

  setPodReplicas = (type) => {
    if (type === "plus") {
      runInAction(() => {
        this.podReplicas++;
      });
    } else {
      runInAction(() => {
        this.podReplicas--;
      });
    }
  };

  setContainerName = (value) => {
    runInAction(() => {
      this.containerName = value;
    });
  };

  setContainerImage = (value) => {
    runInAction(() => {
      this.containerImage = value;
    });
  };

  setContainerPortName = (value) => {
    runInAction(() => {
      this.containerPortName = value;
    });
  };

  setContainerPort = (value) => {
    runInAction(() => {
      this.containerPort = value;
    });
  };

  setContent = (content) => {
    runInAction(() => {
      this.content = content;
    });
  };

  setContentVolume = (contentVolume) => {
    runInAction(() => {
      this.contentVolume = contentVolume;
    });
  };

  setResponseData = (data) => {
    runInAction(() => {
      this.responseData = data;
    });
  };

  clearAll = () => {
    runInAction(() => {
      this.deploymentName = "";
      this.podReplicas = 0;
      this.containerName = "";
      this.containerImage = "";
      this.containerPortName = "";
      this.containerPort = 0;
      this.content = "";
      this.workspace = "";
    });
  };

  postDeploymentGM = async (callback) => {
    const { selectClusters } = volumeStore;
    const YAML = require("yamljs");

    await axios
      .post(
        `${SERVER_URL}/deployments?workspace=${this.workspace}&project=${this.project}&cluster=${selectClusters}`,
        YAML.parse(this.content)
      )
      .then((res) => {
        if (res.status === 201) {
          swalError("Deployment가 생성되었습니다.", callback);
        }
      });
  };

  postDeploymentPVC = async () => {
    const YAML = require("yamljs");
    const { selectClusters } = volumeStore;

    await axios
      .post(
        `${SERVER_URL}/pvcs?cluster=${selectClusters}&project=${this.project}`,
        YAML.parse(this.contentVolume)
      )
      .then(() => {
        return;
      });
  };

  deleteDeployment = async (deploymentName, callback) => {
    axios
      .delete(`${SERVER_URL}/deployments/${deploymentName}`)
      .then((res) => {
        if (res.status === 201)
          swalError("Deployment가 삭제되었습니다.", callback);
      })
      .catch((err) => swalError("삭제에 실패하였습니다."));
  };
}

const deploymentStore = new Deployment();
export default deploymentStore;
