import axios from "axios";
import { makeAutoObservable, runInAction, toJS } from "mobx";
import { BASIC_AUTH, SERVER_URL2 } from "../config";
import { getItem } from "../utils/sessionStorageFn";

class Pod {
  totalYElements = 0;
  currentYPage = 1;
  totalYPages = 1;
  resultYList = {};
  viewYList = [];

  currentPage = 1;
  totalPages = 1;
  resultList = {};
  viewList = [];
  pPodList = [];
  podList = [];
  podDetail = {};
  totalElements = 0;
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
  podName = "";
  containerName = "";
  containerImage = "";
  containerPort = 0;
  containerPortName = "";
  workspace = "";
  project = "";
  content = "";
  containerResources = [];
  podContainers = [
    {
      name: "",
      image: "",
      ports: [
        {
          name: "",
          containerPort: 0,
          protocol: "",
        },
      ],
      volumemounts: [
        {
          mountpath: "",
          name: "",
          readonly: true,
        },
      ],
      env: [
        {
          name: "",
          value: "",
          valueFrom: {},
        },
      ],
    },
  ];
  containerStatuses = [
    {
      containerID: "",
      name: "",
      ready: true,
      restartCount: 0,
      image: "",
      started: true,
    },
  ];
  involvesData = {
    workloadList: {
      name: "",
      kind: "",
      replicaName: "",
    },
    serviceList: [
      {
        metadata: {
          name: "",
          namespace: "",
          creationTimestamp: "",
        },
        subsets: [
          {
            addresses: [
              {
                nodename: "",
                ip: "",
              },
            ],
            ports: [
              {
                port: 0,
                protocol: "",
              },
            ],
          },
        ],
      },
    ],
  };

  constructor() {
    makeAutoObservable(this);
  }

  goPrevPage = () => {
    runInAction(() => {
      if (this.currentPage > 1) {
        this.currentPage = this.currentPage - 1;
        this.setViewList(this.currentPage - 1);
        this.loadPodDetail(
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
        this.loadPodDetail(
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
      this.totalYPages = n;
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

  yamlList = (apiList, setFunc) => {
    runInAction(() => {
      let cnt = 1;
      let totalCnt = 0;
      let tempList = [];
      let cntCheck = true;
      this.resultYListList = {};

      Object.entries(apiList).map(([_, value]) => {
        cntCheck = true;
        tempList.push(toJS(value));
        cnt = cnt + 1;
        if (cnt > 21) {
          cntCheck = false;
          cnt = 1;
          this.resultYList[totalCnt] = tempList;
          totalCnt = totalCnt + 1;
          tempList = [];
        }
      });

      if (cntCheck) {
        this.resultYList[totalCnt] = tempList;
        totalCnt = totalCnt === 0 ? 1 : totalCnt + 1;
      }

      this.setTotalPages(totalCnt);
      setFunc(this.resultYList);
      this.setYViewList(0);
    });
  };

  setPPodList = (list) => {
    runInAction(() => {
      this.pPodList = list;
    });
  };

  setYViewList = (n) => {
    runInAction(() => {
      this.viewYList = this.pPodList[n];
    });
  };

  setViewList = (n) => {
    runInAction(() => {
      this.viewList = this.pPodList[n];
    });
  };

  loadPodDetail = async (name, cluster, project) => {
    await axios
      .get(`${SERVER_URL2}/pods/${name}?cluster=${cluster}&project=${project}`)
      .then(({ data: { data, involvesData } }) => {
        runInAction(() => {
          this.podDetail = data;
          this.involvesData = involvesData;
          this.workloadList = involvesData.workloadList;
          if (involvesData.serviceList !== null) {
            this.serviceList = involvesData.serviceList;
          } else {
            this.serviceList = null;
          }

          this.label = data.label;
          this.annotations = data.annotations;

          this.podContainers = data.Podcontainers;
          this.containerStatuses = data.containerStatuses;
          if (data.events !== null) {
            this.events = data.events;
          } else {
            this.events = null;
          }
        });
      });
  };

  loadPodList = async () => {
    await axios
      .get(`${SERVER_URL2}/pods`)
      .then((res) => {
        runInAction(() => {
          const { user } = getItem("user");
          const list = res.data.data.filter((item) => item.user !== user);
          // const list = res.data.data.filter((item) => item.projectType === type);
          this.podList = list;
          this.podDetail = list[0];
          this.totalElements = list.length;
          this.totalYElements = list.length;
        });
      })
      .then(() => {
        this.convertList(this.podList, this.setPPodList);
        this.yamlList(this.podList, this.setPPodList);
      });
    this.loadPodDetail(
      this.podList[0].name,
      this.podList[0].cluster,
      this.podList[0].project
    );
  };

  setPodName = (podName) => {
    runInAction(() => {
      this.podName = podName;
    });
  };

  setContainerName = (containerName) => {
    runInAction(() => {
      this.containerName = containerName;
    });
  };

  setContainerImage = (containerImage) => {
    runInAction(() => {
      this.containerImage = containerImage;
    });
  };

  setContainerPort = (containerPort) => {
    runInAction(() => {
      this.containerPort = containerPort;
    });
  };
  setContainerPortName = (containerPortName) => {
    runInAction(() => {
      this.containerPortName = containerPortName;
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
    runInAction(() => {
      this.setPodName("");
      this.setContainerImage("");
      this.setContainerName("");
      this.setContainerPort(0);
    });
  };

  createPod = async () => {};
}

const podStore = new Pod();
export default podStore;
