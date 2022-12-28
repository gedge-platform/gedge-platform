import axios from "axios";
import { makeAutoObservable, runInAction, toJS } from "mobx";
import { SERVER_URL } from "../config";
import { swalError } from "../utils/swal-utils";
class Cluster {
  clusterList = [];
  clusterNameList = [];
  clusterName = "";
  totalElements = 0;
  cloudDashboardDetail = {
    clusterInfo: {
      address: "",
    },
  };
  clusterDetail = {
    clusterNum: 0,
    ipAddr: "",
    clusterName: "",
    clusterType: "",
    clusterEndpoint: "",
    clusterCreator: "",
    created_at: "",
    gpu: [],
    resource: {
      deployment_count: 0,
      pod_count: 0,
      service_count: 0,
      cronjob_count: 0,
      job_count: 0,
      volume_count: 0,
      Statefulset_count: 0,
      daemonset_count: 0,
    },
    nodes: [
      {
        name: "",
        type: "",
        nodeIP: "",
        os: "",
        kernel: "",
        labels: {},
        annotations: {},
        allocatable: {
          cpu: "",
          "ephemeral-storage": "",
          "hugepages-1Gi": "",
          "hugepages-2Mi": "",
          memory: "",
          pods: "",
        },
        capacity: {
          cpu: "",
          "ephemeral-storage": "",
          "hugepages-1Gi": "",
          "hugepages-2Mi": "",
          memory: "",
          pods: "",
        },
        containerRuntimeVersion: "",
      },
    ],
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
  };
  statusCode = 0;

  clusters = [];

  currentPage = 1;
  totalPages = 1;
  resultList = {};
  viewList = [];
  clusterListInWorkspace = [];
  ProviderName = {};

  constructor() {
    makeAutoObservable(this);
  }

  goPrevPage = () => {
    runInAction(() => {
      if (this.currentPage > 1) {
        this.currentPage = this.currentPage - 1;
        this.setViewList(this.currentPage - 1);
        this.loadCluster(this.viewList[0].clusterName);
      }
    });
  };

  goNextPage = () => {
    runInAction(() => {
      if (this.totalPages > this.currentPage) {
        this.currentPage = this.currentPage + 1;
        this.setViewList(this.currentPage - 1);
        this.loadCluster(this.viewList[0].clusterName);
      }
    });
  };

  setCurrentPage = n => {
    runInAction(() => {
      this.currentPage = n;
    });
  };

  setTotalPages = n => {
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

  setClusterList = list => {
    runInAction(() => {
      this.clusterList = list;
    });
  };

  setViewList = n => {
    runInAction(() => {
      this.viewList = this.clusterList[n];
    });
  };

  setInitViewList = n => {
    runInAction(() => {
      this.viewList = [];
    });
  };

  loadClusterList = async type => {
    await axios
      .get(`${SERVER_URL}/clusters`)
      .then(({ data: { data } }) => {
        runInAction(() => {
          this.clusterListInWorkspace = data;
          const list = type === "" ? data : data.filter(item => item.clusterType === type);
          console.log(list);
          this.clusterList = list;
          this.clusterNameList = list.map(item => item.clusterName);
          this.totalElements = list.length;
        });
      })
      .then(() => {
        this.convertList(this.clusterList, this.setClusterList);
      })
      .then(() => {
        this.loadCluster(this.viewList[0].clusterName);
        this.loadClusterDetail(this.viewList[0].clusterName);
      });
  };

  loadVMList = async () => {
    await axios
      .get(`${SERVER_URL}/spider/vmList`)
      .then(({ data: { data } }) => {
        runInAction(() => {
          console.log("data is : ", data);
          const list = data;
          this.clusterList = list;
          this.clusterNameList = list.map(item => item.IId.NameId);
          this.totalElements = list.length;
        });
      })
      .then(() => {
        this.convertList(this.clusterList, this.setClusterList);
      });
  };

  postVM = async (data, callback) => {
    const body = {
      ...data,
      enabled: true,
    };
    // return
    await axios
      .post(`${SERVER_URL}/spider/vm`, body)
      .then(res => {
        console.log(res);
        runInAction(() => {
          if (res.status === 201) {
            swalError("VM이 생성되었습니다.", callback);
            return true;
          }
        });
      })
      .catch(err => false);
  };

  deleteVM = async (vmName, callback) => {
    axios
      .delete(`${SERVER_URL}/spider/vm/${vmName}`)
      .then(res => {
        if (res.status === 201) swalError("VM을 삭제했습니다.", callback);
      })
      .catch(err => {
        swalError("삭제에 실패하였습니다.");
      });
  };

  /* TODO: 옳바르지 않은 클러스터 IP 예외처리 */
  loadCluster = async clusterName => {
    await axios.get(`${SERVER_URL}/clusters/${clusterName}`).then(({ data: { data } }) => {
      runInAction(() => {
        this.clusterDetail = data;
        this.nodes = this.clusterDetail.nodes !== null ? this.clusterDetail.nodes : 0;
      });
    });
    return this.clusterDetail;
  };

  loadClusterDetail = async clusterName => {
    await axios.get(`${SERVER_URL}/cloudDashboard?cluster=${clusterName}`).then(({ data: { data } }) => {
      runInAction(() => {
        console.log("data is ", data);
        this.clusterName = clusterName;
        this.cloudDashboardDetail = data;
        this.clusterInfo = data.ClusterInfo;
        this.address = data.ClusterInfo.address;
        this.nodeInfo = data.nodeInfo;
        this.type = this.nodeInfo.map(val => val.type);
        this.master = this.type.reduce((cnt, element) => cnt + ("master" === element), 0);
        this.worker = this.type.reduce((cnt, element) => cnt + ("worker" === element), 0);
        this.cpuUsage = data.cpuUsage;
        this.cpuUtil = data.cpuUtil;
        this.cpuTotal = data.cpuTotal;
        this.memoryUsage = data.memoryUsage;
        this.memoryUtil = data.memoryUtil;
        this.memoryTotal = data.memoryTotal;
        this.diskUsage = data.diskUsage;
        this.diskUtil = data.diskUtil;
        this.diskTotal = data.diskTotal;
        this.resourceCnt = data.resourceCnt;
        this.nodeRunning = data.nodeRunning;
      });
    });
  };

  loadClusterInProject = async project => {
    await axios.get(`${SERVER_URL}/clusterInfo?project=${project}`).then(res => runInAction(() => (this.clusters = res.data.data)));
  };
  loadClusterInWorkspace = async workspace => {
    await axios.get(`${SERVER_URL}/clusters?workspace=${workspace}`).then(res => runInAction(() => (this.clusters = res.data.data)));
  };

  setDetail = num => {
    runInAction(() => {
      this.clusterDetail = this.clusterList.find(item => item.clusterNum === num);
    });
  };

  setClusters = clusters => {
    runInAction(() => {
      this.clusters = clusters;
    });
  };

  setProviderName = n => {
    runInAction(() => {
      this.ProviderName = n;
    });
  };

  postCluster = async (data, callback) => {
    const body = {
      ...data,
      enabled: true,
    };
    // return
    await axios
      .post(`${SERVER_URL}/clusters`, body)
      .then(res => {
        console.log("## : ", res);
        runInAction(() => {
          if (res.status === 201) {
            swalError("클러스터를 추가하였습니다.", callback);
            return true;
          }
        });
      })
      .catch(err => false);
  };

  deleteCluster = async (ClusterName, callback) => {
    axios
      .delete(`${SERVER_URL}/clusters/${ClusterName}`)
      .then(res => {
        if (res.status === 200) swalError("클러스터를 제거하였습니다.", callback);
      })
      .catch(err => {
        swalError("제거에 실패하였습니다.");
      });
  };
}

const clusterStore = new Cluster();
export default clusterStore;
