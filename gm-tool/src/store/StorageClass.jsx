import axios from "axios";
import { makeAutoObservable, runInAction, toJS } from "mobx";
import { SERVER_URL } from "../config";
import { swalError } from "../utils/swal-utils";
import { getItem } from "../utils/sessionStorageFn";
import {
  unixToTime,
  unixStartTime,
  stepConverter,
} from "@/pages/Gedge/Monitoring/Utils/MetricsVariableFormatter";
import { unixCurrentTime } from "@/pages/Gedge/Monitoring/Utils/MetricsVariableFormatter";
import { stringify } from "json-to-pretty-yaml2";
class StorageClass {
  viewList = null;
  adminList = [];
  currentPage = 1;
  totalPages = 1;
  totalElements = 0;
  storageClasses = [];
  storageClassess = [];
  storageClass = {};
  scYamlFile = "";
  scParameters = {};
  scLables = {};
  scAnnotations = {};
  getYamlFile = "";
  resultList = {};
  storageMonit = {};
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
  annotations = {};

  currentPage = 1;
  totalPages = 1;
  resultList = {};
  storageClassName = "";
  storageClassNameData = [];
  selectStorageClass = "";
  content = "";
  storageSystem = "";
  volumeExpansion = "";
  reclaimPolicy = "";
  accessMode = "";
  volumeBindingMode = "";
  selectClusters = "";
  parametersData = {};
  osd_read_latency = [];
  osd_write_latency = [];
  overwrite_iops = [];
  read_iops = [];
  read_throughput = [];
  write_iops = [];
  write_throughput = [];
  cephDashboard = {
    ceph_cluster_total_bytes: 0,
    ceph_cluster_total_used_bytes: 0,
    ceph_cluster_total_avail_bytes: 0,
    ceph_mon_quorum_status: 0,
    ceph_objects_healthy: 0,
    ceph_objects_misplaced: 0,
    ceph_objects_degraded: 0,
    ceph_objects_unfound: 0,
    ceph_osd_in: 0,
    ceph_osd_out: 0,
    ceph_osd_up: 0,
    ceph_osd_down: 0,
    ceph_pg_active: 0,
    ceph_pg_clean: 0,
    ceph_pg_incomplete: 0,
    ceph_pg_total: 0,
    ceph_pg_per_osd: 0,
    ceph_pool_num: 0,
    ceph_unclean_pgs: 0,
    ceph_mds_count: 0,
    clusterStatus: "",
    cluster_avail_capacity: 0,
    cluster_used_capacity: 0,
    read_iops: 0,
    read_throughput: 0,
    write_iops: 0,
    write_throughput: 0,
    osd_read_latency: 0,
    osd_write_latency: 0,
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

  setContent = (content) => {
    runInAction(() => {
      this.content = content;
    });
  };

  goPrevPage = () => {
    runInAction(() => {
      if (this.currentPage > 1) {
        this.currentPage = this.currentPage - 1;
        this.paginationList();
        this.loadStorageClass(this.viewList[0].name, this.viewList[0].cluster);
      }
    });
  };

  goNextPage = () => {
    runInAction(() => {
      if (this.totalPages > this.currentPage) {
        this.currentPage = this.currentPage + 1;
        this.paginationList();
        this.loadStorageClass(this.viewList[0].name, this.viewList[0].cluster);
      }
    });
  };

  setMetricsLastTime = (time) => {
    runInAction(() => {
      this.lastTime = time;
    });
  };

  setStorageClassNameData = (value) => {
    runInAction(() => {
      this.storageClassNameData = value;
    });
  };

  setStorageClass = (value) => {
    runInAction(() => {
      this.storageClass = value;
    });
  };

  setSelectStorageClass = (value) => {
    runInAction(() => {
      this.selectStorageClass = value;
    });
  };

  setStorageClassName = (value) => {
    runInAction(() => {
      this.storageClassName = value;
    });
  };

  setStorageSystem = (value) => {
    runInAction(() => {
      this.storageSystem = value;
    });
  };

  setVolumeExpansion = (value) => {
    runInAction(() => {
      this.volumeExpansion = value;
    });
  };

  setReclaimPolicy = (value) => {
    runInAction(() => {
      this.reclaimPolicy = value;
    });
  };

  setAccessMode = (value) => {
    runInAction(() => {
      this.accessMode = value;
    });
  };

  setVolumeBindingMode = (value) => {
    runInAction(() => {
      this.volumeBindingMode = value;
    });
  };

  setResponseData = (data) => {
    runInAction(() => {
      this.responseData = data;
    });
  };

  setSelectClusters = (value) => {
    runInAction(() => {
      this.selectClusters = value;
    });
  };

  paginationList = () => {
    runInAction(() => {
      if (this.storageClasses !== null) {
        this.viewList = this.storageClasses.slice(
          (this.currentPage - 1) * 10,
          this.currentPage * 10
        );
      }
    });
  };

  loadStorageClassYaml = async (name, clusterName, kind) => {
    await axios
      .get(`${SERVER_URL}/view/${name}?cluster=${clusterName}&kind=${kind}`)
      .then((res) => {
        runInAction(() => {
          this.getYamlFile = stringify(res.data.data);
        });
      });
  };

  loadStorageClasses = async () => {
    let { id, role } = getItem("user");
    role === "SA" ? (id = id) : (id = "");
    await axios
      .get(`${SERVER_URL}/storageclasses`)
      .then((res) => {
        runInAction(() => {
          if (res.data.data !== null) {
            this.storageClasses = res.data.data;
            this.storageClassess = res.data.data;
            this.totalPages = Math.ceil(res.data.data.length / 10);
            this.totalElements = res.data.data.length;
          } else {
            this.storageClasses = [];
          }
        });
      })
      .then(() => {
        this.paginationList();
      })
      .then(() => {
        this.loadStorageClass(this.viewList[0].name, this.viewList[0].cluster);
      })
      .catch(() => {
        this.storageClasses = [];
        this.paginationList();
      });
  };

  loadAdminStorageClasses = async () => {
    let { id, role } = getItem("user");
    role === "SA" ? (id = id) : (id = "");
    await axios
      .get(`${SERVER_URL}/storageclasses`)
      .then((res) => {
        runInAction(() => {
          this.adminList = res.data.data;
          this.storageClasses = this.adminList.filter(
            (data) => data.cluster === "gm-cluster"
          );
          if (this.storageClasses.length !== 0) {
            this.storageClass = this.storageClasses[0];
            this.totalPages = Math.ceil(this.storageClasses.length / 10);
            this.totalElements = this.storageClasses.length;
          } else {
            this.storageClasses = [];
          }
        });
      })
      .then(() => {
        this.paginationList();
      })
      .then(() => {
        this.loadStorageClass(
          this.storageClasses[0].name,
          this.storageClasses[0].cluster
        ).catch(() => {
          this.storageClasses = [];
          this.paginationList();
        });
      });
  };

  loadStorageClass = async (name, cluster) => {
    await axios
      .get(`${SERVER_URL}/storageclasses/${name}?cluster=${cluster}`)
      .then(({ data: { data } }) => {
        runInAction(() => {
          this.storageClass = data;
          this.scYamlFile = "";
          this.scAnnotations = {};
          this.scLables = {};
          this.scParameters = data.parameters;
          this.label = data.labels;
          this.annotations = data.annotations;
          this.storageClassList = data.name;

          Object.entries(this.storageClass?.annotations).forEach(
            ([key, value]) => {
              try {
                if (value === "true" || value === "false") {
                  throw e;
                }
                this.scYamlFile = stringify(JSON.parse(value));
              } catch (e) {
                if (key && value) {
                  this.scAnnotations[key] = value;
                }
              }
            }
          );

          Object.entries(this.storageClass?.labels).map(([key, value]) => {
            this.scLables[key] = value;
          });

          Object.entries(this.storageClass?.parameters).map(([key, value]) => {
            this.scParameters[key] = value;
          });
        });
      });
  };

  loadStorageClassName = async (cluster) => {
    await axios
      .get(`${SERVER_URL}/storageclasses?cluster=${cluster}`)
      .then((res) => {
        runInAction(() => {
          this.storageClassNameData = res.data.data;
        });
      });
  };

  postStorageClass = (callback) => {
    const body = this.content;

    axios
      .post(`${SERVER_URL}/storageclasses?cluster=${this.selectClusters}`, body)
      .then((res) => {
        if (res.status === 201) {
          swalError("StorageClass가 생성되었습니다", callback);
        }
      })
      .catch((err) => {
        swalError("StorageClass 생성에 실패하였습니다.", callback);
      });
  };

  loadStorageMonit = async () => {
    await axios.get(`${SERVER_URL}/ceph/monit`).then((res) => {
      runInAction(() => {
        this.cephDashboard = res.data.data;
      });
    });
  };
  loadCephMonit = async (start, end, step) => {
    await axios
      .get(
        `${SERVER_URL}/ceph/monitoring?start=${start}&end=${end}&step=${step}`
      )
      .then((res) => {
        runInAction(() => {
          this.osd_read_latency = res.data.items.osd_read_latency[0].values;
          this.osd_write_latency = res.data.items.osd_write_latency[0].values;
          this.overwrite_iops = res.data.items.overwrite_iops[0].values;
          this.read_iops = res.data.items.read_iops[0].values;
          this.read_throughput = res.data.items.read_throughput[0].values;
          this.write_iops = res.data.items.write_iops[0].values;
          this.write_throughput = res.data.items.write_throughput[0].values;
        });
      });
  };
}

const StorageClassStore = new StorageClass();
export default StorageClassStore;
