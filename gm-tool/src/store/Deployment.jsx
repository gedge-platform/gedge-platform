import axios from "axios";
import { makeAutoObservable, runInAction, toJS } from "mobx";
import { SERVER_URL } from "../config";
import { swalError } from "../utils/swal-utils";
import volumeStore from "./Volume";
import { getItem } from "../utils/sessionStorageFn";
import { useState } from "react";
import { stringify } from "json-to-pretty-yaml2";

class Deployment {
  currentPage = 1;
  totalPages = 1;
  resultList = {};
  viewList = null;
  adminViewList = [];
  pDeploymentList = [];
  adminList = [];
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

  labels = [];
  annotations = [];

  command = [];

  setCommand = (e) => {
    runInAction(() => {
      console.log(e.value);
    });
  };

  selectedCluster = "";
  setSelectedCluster = (value) => {
    runInAction(() => {
      this.selectedCluster = value;
    });
  };

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
  adminTotalElements = 0;
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

  podName = "";

  keyValuePair = [];
  secretConfigmap = [];

  workspaceList = [];
  projectList = [];
  labelList = [];
  annotationList = [];

  labelInput = [];
  labelKey = "";
  labelValue = "";

  labelInputKey = "";
  labelInputValue = "";

  annotationInput = [];
  annotationKey = "";
  annotationValue = "";

  appName = "";
  appWorkspace = "";
  appProject = "";
  appPort = "";

  appInfo = {
    app: "",
    appVersion: "",
    appName: "",
    workspacetag: "",
    workspaceuuid: "",
    appWorkspace: "",
    appProject: "",
    appReplicas: 1,
    appPort: "",
    appContainersName: "",
    appEnv: [],
    priority: {
      name: "GLowLatencyPriority", //GLowLatencyPriority
      mode: "from_node", //cluster
      sourceCluster: "",
      sourceNode: "",
    },
  };

  initAppInfo = () => {
    this.appInfo = {
      app: "",
      appVersion: "",
      appName: "",
      appWorkspace: "",
      workspacetag: "",
      workspaceuuid: "",
      appProject: "",
      appReplicas: 1,
      appPort: "",
      appContainersName: "",
      appEnv: [],
      priority: {
        name: "GLowLatencyPriority", //GLowLatencyPriority
        mode: "from_node", //cluster
        sourceCluster: "",
        sourceNode: "",
      },
    };
  };

  setAppInfo = (name, value) => {
    this.appInfo[name] = value;
  };

  deployment = {
    deploymentName: "",
    workspace: "",
    workspacetag: "",
    workspaceuuid: "",
    project: "",
    replicas: 1,
    pvcName: "",
    volume: "",
    containers: [],
    labels: [],
    annotations: [],
    priority: {
      name: "GLowLatencyPriority",
      mode: "from_node",
      sourceCluster: "",
      sourceNode: "",
    },
    targetClusters: "",
  };

  setDeployment = (name, value) => {
    this.deployment[name] = value;
  };

  setDeploymentPriority = (name, value) => {
    this.deployment.priority[name] = value;
  };

  resetDeployment = () => {
    runInAction(() => {
      this.deployment = {
        deploymentName: "",
        workspace: "",
        project: "",
        replicas: 1,
        pvcName: "",
        volume: "",
        containers: [],
        labels: [],
        annotations: [],
        priority: {
          name: "GLowLatencyPriority",
          mode: "from_node",
          sourceCluster: "",
          sourceNode: "",
        },
        targetClusters: "",
        workspacetag: "",
        workspaceuuid: "",
      };
    });
  };

  hpaWorkspaceList = [
    {
      name: "workspace1",
    },
    {
      name: "workspace2",
    },
    {
      name: "workspace3",
    },
    {
      name: "workspace4",
    },
  ];
  hpaProjectList = [
    {
      name: "project1",
    },
    {
      name: "project2",
    },
    {
      name: "project3",
    },
    {
      name: "project4",
    },
  ];
  hpaClusterList = [
    {
      name: "cluster1",
    },
    {
      name: "cluster2",
    },
    {
      name: "cluster3",
    },
    {
      name: "cluster4",
    },
  ];
  hpaDeploymentList = [
    {
      name: "deployment1",
    },
    {
      name: "deployment2",
    },
    {
      name: "deployment3",
    },
    {
      name: "deployment4",
    },
  ];

  targetClusters = [];
  unselectedClusters = [];

  initTargetClusters = (defaultUnselectedClusters) => {
    runInAction(() => {
      this.targetClusters = [];
      this.unselectedClusters = defaultUnselectedClusters;
    });
  };

  setTargetClusters = (value) => {
    runInAction(() => {
      this.targetClusters = value;
    });
  };

  setUnselectedClusters = (value) => {
    runInAction(() => {
      this.unselectedClusters = value;
    });
  };

  resetTargetClusters = () => {
    runInAction(() => {
      this.unselectedClusters = [
        ...this.unselectedClusters,
        ...[].concat(...this.targetClusters),
      ];
      this.targetClusters = [];
    });
  };

  loadClustersList = () => {
    runInAction(() => {
      clusterList = [];
    });
  };

  setTemplate = (template) => {
    runInAction(() => {
      delete template.metadata.labels[""];
      delete template.metadata.annotations[""];
      delete template.spec.template.metadata.labels[""];
      delete template.spec.template.metadata.annotations[""];
      delete template.spec.selector.matchLabels[""];
    });
  };

  setTemplateLabel = () => {
    runInAction(() => {
      this.labels.map((data) => {
        this.labelInput[data.labelKey] = data.labelValue;
      });
    });
  };

  setTemplateAnnotation = () => {
    runInAction(() => {
      this.annotations.map((data) => {
        this.annotationInput[data.annotationKey] = data.annotationValue;
      });
    });
  };

  setLabelInput = (value) => {
    runInAction(() => {
      this.labelInput = value;
    });
  };

  setLabels = (value) => {
    runInAction(() => {
      this.labels = value;
    });
  };

  setClearLA = () => {
    runInAction(() => {
      this.labelKey = "";
      this.labelValue = "";
      this.annotationKey = "";
      this.annotationValue = "";
      this.labels = [];
      this.annotations = [];
    });
  };

  inputLabelKey = "";

  setInputLabelKey = (value) => {
    runInAction(() => {
      this.labelKey = value;
    });
  };

  setInputLabelValue = (value) => {
    runInAction(() => {
      this.labelValue = value;
    });
  };

  setAnnotations = (value) => {
    runInAction(() => {
      this.annotations = value;
    });
  };

  setInputAnnotationKey = (value) => {
    runInAction(() => {
      this.annotationKey = value;
    });
  };

  setInputAnnotationValue = (value) => {
    runInAction(() => {
      this.annotationValue = value;
    });
  };

  setAnnotationInput = (value) => {
    runInAction(() => {
      this.annotationInput = value;
    });
  };

  loadProjectList = (workspace) => {
    runInAction(() => {
      this.projectList = [
        {
          name: "project1",
        },
        {
          name: "project2",
        },
        {
          name: "project3",
        },
        {
          name: "project4",
        },
      ];
    });
  };

  loadVolumeList = (pvcName) => {
    runInAction(() => {
      this.volumeList = [
        {
          name: "volume1",
        },
        {
          name: "volume2",
        },
        {
          name: "volume3",
        },
        {
          name: "volume4",
        },
      ];
    });
  };

  initLabelList = () => {
    runInAction(() => {
      this.labelList = [];
    });
  };

  initAnnotationList = () => {
    runInAction(() => {
      this.annotationList = [];
    });
  };

  initContainer = () => {
    runInAction(() => {
      this.deployment.containers = [];
    });
  };
  addContainer = async (container) => {
    runInAction(() => {
      this.deployment.containers.push(container);
    });
  };
  editContainer = (editIndex, container) => {
    runInAction(() => {
      this.deployment.containers[editIndex] = container;
    });
  };
  removeContainer = (removeIndex) => {
    runInAction(() => {
      this.deployment.containers = this.deployment.containers.filter(
        (_, index) => removeIndex !== index
      );
    });
  };

  priorityNodes = [];
  setPriorityNodes = (value) => {
    runInAction(() => {
      this.priorityNodes = value;
    });
  };

  constructor() {
    makeAutoObservable(this);
  }

  // viewList, 현재 페이지 초기화
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
        this.paginationList();
        this.loadDeploymentDetail(
          this.viewList[0].name,
          this.viewList[0].cluster,
          this.viewList[0].project
        );
      }
    });
  };

  // deploymentList를 페이지에 맞게 잘라서 viewList에 할당
  paginationList = () => {
    runInAction(() => {
      if (this.deploymentList !== null) {
        this.viewList = this.deploymentList.slice(
          (this.currentPage - 1) * 10,
          this.currentPage * 10
        );
      }
    });
  };

  loadDeploymentList = async () => {
    let { id, role } = getItem("user");
    role === "SA" ? (id = id) : (id = "");
    await axios
      .get(`${SERVER_URL}/deployments?user=${id}`)
      .then((res) => {
        runInAction(() => {
          // 응답 data를 deploymentList에 넣고 총 페이지와 개수 입력
          if (res.data.data !== null) {
            this.deploymentList = res.data.data;
            this.deploymentDetail = res.data.data[0];
            this.totalPages = Math.ceil(res.data.data.length / 10);
            this.totalElements = res.data.data.length;
          } else {
            this.deploymentList = [];
          }
        });
      })
      .then(() => {
        this.paginationList();
      })
      .catch(() => {
        this.deploymentList = [];
        this.paginationList();
      });
    this.loadDeploymentDetail(
      this.deploymentList[0].name,
      this.deploymentList[0].cluster,
      this.deploymentList[0].project
    );
  };

  loadAdminDeploymentList = async () => {
    let { id, role } = getItem("user");
    role === "SA" ? (id = id) : (id = "");
    await axios
      .get(`${SERVER_URL}/deployments?user=${id}`)
      .then((res) => {
        runInAction(() => {
          this.adminList = res.data.data;
          this.deploymentList = this.adminList.filter(
            (data) => data.cluster === "gm-cluster"
          );
          if (this.deploymentList.length !== 0) {
            this.deploymentDetail = this.deploymentList[0];
            this.totalPages = Math.ceil(this.deploymentList.length / 10);
            this.totalElements = this.deploymentList.length;
          } else {
            this.deploymentList = [];
          }
        });
      })
      .then(() => {
        this.paginationList();
      })
      .catch((err) => {
        this.requestList = [];
        this.paginationList();
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
        });
      });
  };

  loadDeploymentInCluster = async (cluster) => {
    await axios
      .get(`${SERVER_URL}/deployments?cluster=${cluster}`)
      .then((res) => runInAction(() => (this.deploymentList = res.data.data)));
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

  postGLowLatencyPriority = async (callback) => {
    const body = this.content;

    const randomNumber = Math.floor(Math.random() * (10000 - 1)) + 1;

    const option = () => {
      if (this.deployment.priority.name === "GLowLatencyPriority") {
        if (this.deployment.priority.mode === "from_node") {
          return {
            user_name: JSON.parse(localStorage.getItem("user")).id,
            workspace_name: this.deployment.workspacetag,
            workspace_uid: this.deployment.workspaceuuid,
            project_name: this.deployment.project.replace(
              "-" + this.deployment.workspaceuuid,
              ""
            ),
            mode: "from_node",
            parameters: {
              source_cluster: this.deployment.priority.sourceCluster,
              source_node: this.deployment.priority.sourceNode,
              select_clusters: this.targetClusters,
            },
          };
        } else {
          return {
            user_name: JSON.parse(localStorage.getItem("user")).id,
            workspace_name: this.deployment.workspacetag,
            workspace_uid: this.deployment.workspaceuuid,
            project_name: this.deployment.project.replace(
              "-" + this.deployment.workspaceuuid,
              ""
            ),
            mode: "from_pod",
            parameters: {
              source_cluster: this.deployment.priority.sourceCluster,
              pod_name: this.deployment.priority.podName,
              select_clusters: this.targetClusters,
            },
          };
        }
      }
    };

    const options = encodeURI(JSON.stringify(option()));
    const requestId = "requestId" + randomNumber;

    await axios
      .post(
        `http://101.79.4.15:31701/gmcapi/v2/gs-scheduler?requestId=${requestId}&callbackUrl=http://zento.co.kr/callback&priority=GLowLatencyPriority&options=${options}`,
        body,
        {
          headers: {
            "Content-Type": "application/x-yaml",
          },
        }
      )
      .then((res) => {
        if (res.status === 201) {
          swalError("Deployment가 생성되었습니다.");
        } else {
          swalError("Deployment 생성 실패", callback);
        }
      });
  };

  postGMostRequestPriority = async (callback) => {
    const body = this.content;

    const randomNumber = Math.floor(Math.random() * (10000 - 1)) + 1;

    const option = () => {
      if (this.deployment.priority.name === "GMostRequestPriority") {
        return {
          user_name: JSON.parse(localStorage.getItem("user")).id,
          workspace_name: this.deployment.workspacetag,
          workspace_uid: this.deployment.workspaceuuid,
          project_name: this.deployment.project.replace(
            "-" + this.deployment.workspaceuuid,
            ""
          ),
          mode: this.deployment.priority.mode,
          parameters: {
            select_clusters: this.targetClusters,
          },
        };
      }
    };

    const options = encodeURI(JSON.stringify(option()));
    const requestId = "requestId" + randomNumber;

    await axios
      .post(
        `http://101.79.4.15:31701/gmcapi/v2/gs-scheduler?requestId=${requestId}&callbackUrl=http://zento.co.kr/callback&priority=GMostRequestPriority&options=${options}`,
        body,
        {
          headers: {
            "Content-Type": "application/x-yaml",
          },
        }
      )
      .then((res) => {
        if (res.status === 201) {
          swalError("Deployment가 생성되었습니다.");
        } else {
          swalError("Deployment 생성 실패", callback);
        }
      });
  };

  postGSelectedClusterPriority = async (callback) => {
    const body = this.content;

    const randomNumber = Math.floor(Math.random() * (10000 - 1)) + 1;
    const userName = JSON.parse(localStorage.getItem("user")).id;

    const option = () => {
      if (this.deployment.priority.name === "GSelectedClusterPriority") {
        if (this.deployment.priority.mode === "cluster") {
          return {
            user_name: JSON.parse(localStorage.getItem("user")).id,
            workspace_name: this.deployment.workspacetag,
            workspace_uid: this.deployment.workspaceuuid,
            project_name: this.deployment.project.replace(
              "-" + this.deployment.workspaceuuid,
              ""
            ),
            mode: "cluster",
            parameters: {
              select_clusters: this.targetClusters,
            },
          };
        } else {
          return {
            user_name: JSON.parse(localStorage.getItem("user")).id,
            workspace_name: this.deployment.workspacetag,
            workspace_uid: this.deployment.workspaceuuid,
            project_name: this.deployment.project.replace(
              "-" + this.deployment.workspaceuuid,
              ""
            ),
            mode: "node",
            parameters: {
              select_cluster: this.targetClusters[0],
              select_node: this.deployment.priority.sourceNode,
            },
          };
        }
      }
    };

    const options = encodeURI(JSON.stringify(option()));

    const requestId = "requestId" + randomNumber;

    await axios
      .post(
        `http://101.79.4.15:31701/gmcapi/v2/gs-scheduler?requestId=${requestId}&callbackUrl=http://zento.co.kr/callback&priority=GSelectedCluster&options=${options}`,
        body,
        {
          headers: {
            "Content-Type": "application/x-yaml",
          },
        }
      )
      .then((res) => {
        if (res.status === 201) {
          swalError("Deployment가 생성되었습니다.");
        } else {
          swalError("Deployment 생성 실패", callback);
        }
      });
  };

  postGSetClusterPriority = async (callback) => {
    const body = this.content;

    const randomNumber = Math.floor(Math.random() * (10000 - 1)) + 1;

    const option = () => {
      if (this.deployment.priority.name === "GSetClusterPriority") {
        return {
          user_name: JSON.parse(localStorage.getItem("user")).id,
          workspace_name: this.deployment.workspacetag,
          workspace_uid: this.deployment.workspaceuuid,
          project_name: this.deployment.project.replace(
            "-" + this.deployment.workspaceuuid,
            ""
          ),
          parameters: {
            select_clusters: this.targetClusters,
          },
        };
      }
    };

    const options = encodeURI(JSON.stringify(option()));
    const requestId = "requestId" + randomNumber;

    await axios
      .post(
        `http://101.79.4.15:31701/gmcapi/v2/gs-scheduler?requestId=${requestId}&callbackUrl=http://zento.co.kr/callback&priority=GSetCluster&options=${options}`,
        body,
        {
          headers: {
            "Content-Type": "application/x-yaml",
          },
        }
      )
      .then((res) => {
        if (res.status === 201) {
          swalError("Deployment가 생성되었습니다.");
        } else {
          swalError("Deployment 생성 실패", callback);
        }
      });
  };

  postTemplateGLowLatency = async (callback) => {
    const body = this.content;

    const randomNumber = Math.floor(Math.random() * (10000 - 1)) + 1;

    const option = () => {
      if (this.deployment.priority.name === "GLowLatencyPriority") {
        if (this.deployment.priority.mode === "from_node") {
          return {
            user_name: JSON.parse(localStorage.getItem("user")).id,
            workspace_name: this.appInfo.workspacetag,
            workspace_uid: this.appInfo.workspaceuuid,
            project_name: this.appInfo.appProject.replace(
              "-" + this.appInfo.workspaceuuid,
              ""
            ),
            mode: this.deployment.priority.mode,
            parameters: {
              source_cluster: this.deployment.priority.sourceCluster,
              source_node: this.deployment.priority.sourceNode,
              select_clusters: this.targetClusters,
            },
          };
        } else {
          return {
            user_name: JSON.parse(localStorage.getItem("user")).id,
            workspace_name: this.appInfo.workspacetag,
            workspace_uid: this.appInfo.workspaceuuid,
            project_name: this.appInfo.appProject.replace(
              "-" + this.appInfo.workspaceuuid,
              ""
            ),
            mode: "from_pod",
            parameters: {
              source_cluster: this.deployment.priority.sourceCluster,
              pod_name: this.deployment.priority.podName,
              select_clusters: this.targetClusters,
            },
          };
        }
      }
    };

    const options = encodeURI(JSON.stringify(option()));
    const requestId = "requestId" + randomNumber;

    await axios
      .post(
        `http://101.79.4.15:31701/gmcapi/v2/gs-scheduler?requestId=${requestId}&callbackUrl=http://zento.co.kr/callback&priority=GLowLatencyPriority&options=${options}`,
        body,
        {
          headers: {
            "Content-Type": "application/x-yaml",
          },
        }
      )
      .then((res) => {
        if (res.status === 201) {
          swalError("Deployment가 생성되었습니다.");
        } else {
          swalError("Deployment 생성 실패", callback);
        }
      });
  };

  postTemplateGMostRequest = async (callback) => {
    const body = this.content;

    const randomNumber = Math.floor(Math.random() * (10000 - 1)) + 1;

    const option = () => {
      if (this.deployment.priority.name === "GMostRequestPriority") {
        return {
          user_name: JSON.parse(localStorage.getItem("user")).id,
          workspace_name: this.appInfo.workspacetag,
          workspace_uid: this.appInfo.workspaceuuid,
          project_name: this.appInfo.appProject.replace(
            "-" + this.appInfo.workspaceuuid,
            ""
          ),
          mode: this.deployment.priority.mode,
          parameters: {
            select_clusters: this.targetClusters,
          },
        };
      }
    };

    const options = encodeURI(JSON.stringify(option()));
    const requestId = "requestId" + randomNumber;

    await axios
      .post(
        `http://101.79.4.15:31701/gmcapi/v2/gs-scheduler?requestId=${requestId}&callbackUrl=http://zento.co.kr/callback&priority=GMostRequestPriority&options=${options}`,
        body,
        {
          headers: {
            "Content-Type": "application/x-yaml",
          },
        }
      )
      .then((res) => {
        if (res.status === 201) {
          swalError("Deployment가 생성되었습니다.");
        } else {
          swalError("Deployment 생성 실패", callback);
        }
      });
  };

  postTemplateSelected = async (callback) => {
    const body = this.content;

    const randomNumber = Math.floor(Math.random() * (10000 - 1)) + 1;

    const option = () => {
      if (this.deployment.priority.name === "GSelectedClusterPriority") {
        if (this.deployment.priority.mode === "cluster") {
          return {
            user_name: JSON.parse(localStorage.getItem("user")).id,
            workspace_name: this.appInfo.workspacetag,
            workspace_uid: this.appInfo.workspaceuuid,
            project_name: this.appInfo.appProject.replace(
              "-" + this.appInfo.workspaceuuid,
              ""
            ),
            mode: "cluster",
            parameters: {
              select_clusters: this.targetClusters,
            },
          };
        } else {
          return {
            user_name: JSON.parse(localStorage.getItem("user")).id,
            workspace_name: this.appInfo.appWorkspace,
            workspace_uid: this.appInfo.workspaceuuid,
            project_name: this.appInfo.appProject.replace(
              "-" + this.appInfo.workspaceuuid,
              ""
            ),
            mode: "node",
            parameters: {
              select_cluster: this.targetClusters[0],
              select_node: this.deployment.priority.sourceNode,
            },
          };
        }
      }
    };

    const options = encodeURI(JSON.stringify(option()));
    const requestId = "requestId" + randomNumber;

    await axios
      .post(
        `http://101.79.4.15:31701/gmcapi/v2/gs-scheduler?requestId=${requestId}&callbackUrl=http://zento.co.kr/callback&priority=GSelectedCluster&options=${options}`,
        body,
        {
          headers: {
            "Content-Type": "application/x-yaml",
          },
        }
      )
      // .post(
      //   `http://101.79.4.15:31701/gmcapi/v2/gs-scheduler?requestId=${requestId}&callbackUrl=http://zento.co.kr/callback&priority=GSelectedClusterPriority&options=${options}`,
      //   body
      // )
      .then((res) => {
        if (res.status === 201) {
          swalError("Deployment가 생성되었습니다.");
        } else {
          swalError("Deployment 생성 실패", callback);
        }
      });
  };

  postTemplateGSetCluster = async () => {
    const body = this.content;

    const randomNumber = Math.floor(Math.random() * (10000 - 1)) + 1;

    const option = () => {
      if (this.deployment.priority.name === "GSetClusterPriority") {
        return {
          user_name: JSON.parse(localStorage.getItem("user")).id,
          workspace_name: this.appInfo.workspacetag,
          workspace_uid: this.appInfo.workspaceuuid,
          project_name: this.appInfo.appProject.replace(
            "-" + this.appInfo.workspaceuuid,
            ""
          ),
          parameters: {
            select_clusters: this.targetClusters,
          },
        };
      }
    };

    const options = encodeURI(JSON.stringify(option()));
    const requestId = "requestId" + randomNumber;

    await axios
      .post(
        `http://101.79.4.15:31701/gmcapi/v2/gs-scheduler?requestId=${requestId}&callbackUrl=http://zento.co.kr/callback&priority=GSetCluster&options=${options}`,
        body,
        {
          headers: {
            "Content-Type": "application/x-yaml",
          },
        }
      )
      .then((res) => {
        if (res.status === 201) {
          swalError("Deployment가 생성되었습니다.");
        } else {
          swalError("Deployment 생성 실패", callback);
        }
      });
  };

  postDeploymentPVC = async () => {
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

  deleteDeployment = async (
    deploymentName,
    clusterName,
    projectName,
    callback
  ) => {
    axios
      .delete(
        `${SERVER_URL}/deployments/${deploymentName}?cluster=${clusterName}&project=${projectName} `
      )
      .then((res) => {
        if (res.status === 200)
          swalError("Deployment가 삭제되었습니다.", callback);
      })
      .catch((err) => swalError("삭제에 실패하였습니다."));
  };
}

const deploymentStore = new Deployment();
export default deploymentStore;
