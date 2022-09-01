import axios from "axios";
import { template } from "lodash";
import { makeAutoObservable, runInAction, toJS } from "mobx";
import { SERVER_URL2, BEARER_TOKEN } from "../config";
import { swalError } from "../utils/swal-utils";

class Claim {
  viewList = [];
  currentPage = 1;
  totalPages = 1;
  totalElements = 0;
  pvClaims = [];
  pvClaim = {};
  pvClaimList = [];
  pvClaimYamlFile = "";
  pvClaimAnnotations = {};
  pvClaimLables = {};
  pvClaimEvents = [];
  getYamlFile = "";
  resultList = {};
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
  label = {};
  claimName = "";
  project = "";
  clusterName = "";
  cluster = "";
  selectClusters = "";
  storageClass = "";
  accessMode = "";
  volumeCapacity = "";
  content = ""; //초기화를 잘 합시다2

  constructor() {
    makeAutoObservable(this);
  }

  goPrevPage = () => {
    runInAction(() => {
      if (this.currentPage > 1) {
        this.currentPage = this.currentPage - 1;
        this.setViewList(this.currentPage - 1);
        this.loadPVClaim(
          this.viewList[0].name,
          this.viewList[0].clusterName,
          this.viewList[0].namespace
        );
      }
    });
  };

  goNextPage = () => {
    runInAction(() => {
      if (this.totalPages > this.currentPage) {
        this.currentPage = this.currentPage + 1;
        this.setViewList(this.currentPage - 1);
        this.loadPVClaim(
          this.viewList[0].name,
          this.viewList[0].clusterName,
          this.viewList[0].namespace
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

  setPvClaimList = (list) => {
    runInAction(() => {
      this.pvClaims = list;
    });
  };

  setViewList = (n) => {
    runInAction(() => {
      this.viewList = this.pvClaims[n];
    });
  };

  setMetricsLastTime = (time) => {
    runInAction(() => {
      this.lastTime = time;
    });
  };

  setVolumeName = (value) => {
    runInAction(() => {
      this.volumeName = value;
    });
  };

  setClaimName = (value) => {
    runInAction(() => {
      this.claimName = value;
    });
  };

  setAccessMode = (name) => {
    runInAction(() => {
      this.accessMode = name;
    });
  };

  setVolumeCapacity = (value) => {
    runInAction(() => {
      this.volumeCapacity = value;
    });
  };

  setContent = (content) => {
    runInAction(() => {
      this.content = content;
    });
  };

  setResponseData = (data) => {
    runInAction(() => {
      this.responseData = data;
    });
  };

  setCluster = (cluster) => {
    runInAction(() => {
      this.cluster = cluster;
    });
  };

  setProject = (value) => {
    runInAction(() => {
      this.project = value;
    });
  };

  setSelectClusters = (value) => {
    runInAction(() => {
      this.selectClusters = value;
    });
  };

  clearAll = () => {
    runInAction(() => {
      // this.volumeName = "";
      this.content = "";
      this.volumeCapacity = 0;
      this.projectList = "";
    });
  };

  closeTab = () => {
    window.close();
  };

  loadVolumeYaml = async (name, clusterName, projectName, kind) => {
    await axios
      .get(
        `${SERVER_URL2}/view/${name}?cluster=${clusterName}&project=${projectName}&kind=${kind}`
      )
      .then((res) => {
        runInAction(() => {
          const YAML = require("json-to-pretty-yaml");
          this.getYamlFile = YAML.stringify(res.data.data);
        });
      });
  };

  // 클레임 관리
  loadPVClaims = async () => {
    await axios
      .get(`${SERVER_URL2}/pvcs`)
      .then((res) => {
        runInAction(() => {
          this.pvClaims = res.data.data;
          this.totalElements = res.data.data.length;
        });
      })
      .then(() => {
        this.convertList(this.pvClaims, this.setPvClaimList);
      })
      .then(() => {
        this.loadPVClaim(
          this.viewList[0].name,
          this.viewList[0].clusterName,
          this.viewList[0].namespace
        );
      });
  };

  loadPVClaim = async (name, clusterName, namespace) => {
    await axios
      .get(
        `${SERVER_URL2}/pvcs/${name}?cluster=${clusterName}&project=${namespace}`
      )
      .then(({ data: { data } }) => {
        runInAction(() => {
          this.pvClaim = data;
          this.pvClaimYamlFile = "";
          this.pvClaimAnnotations = {};
          this.pvClaimLables = {};
          this.events = data.events;
          this.label = data.label;
          Object.entries(this.pvClaim?.label).map(([key, value]) => {
            this.pvClaimLables[key] = value;
          });

          Object.entries(this.pvClaim?.annotations).forEach(([key, value]) => {
            try {
              const YAML = require("json-to-pretty-yaml");
              this.pvClaimYamlFile = YAML.stringify(JSON.parse(value));
            } catch (e) {
              if (key && value) {
                this.pvClaimAnnotations[key] = value;
              }
            }
          });
        });
      });
  };

  createVolumeClaim = (template, callback) => {
    const YAML = require("yamljs");
    axios
      .post(
        `${SERVER_URL2}/pvcs?cluster=${this.selectClusters}&project=${this.project}`,

        YAML.parse(this.content)
      )
      .then((res) => {
        if (res.status === 201) {
          swalError("Volume이 생성되었습니다!", callback);
        }
      })
      .catch((err) => {
        swalError("Volume 생성에 실패하였습니다.", callback);
        console.error(err);
      });
  };
}

const claimStore = new Claim();
export default claimStore;
