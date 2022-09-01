import axios from "axios";
import { makeAutoObservable, runInAction, toJS } from "mobx";
import { apiV2, SERVER_URL2, SERVER_URL4 } from "../config";
import { swalError } from "../utils/swal-utils";

class Certification {
  credential = [];
  CredentialName = "";
  DomainName = "";
  IdentityEndPoint = "";
  Password = "";
  ProjectID = "";
  Username = "";
  KeyValueInfoList = [];
  ProviderName = "";
  totalElements = 0;
  currentPage = 1;
  totalPages = 1;
  resultList = {};
  viewList = [];

  content = "";

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
        if (cnt > 20) {
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

  setContent = (content) => {
    runInAction(() => {
      this.content = content;
    });
  };

  setClusterList = (list) => {
    runInAction(() => {
      this.clusterList = list;
    });
  };

  setCredentialList = (list) => {
    runInAction(() => {
      this.credential = list;
    });
  };

  setViewList = (n) => {
    runInAction(() => {
      this.viewList = this.credential[n];
    });
  };

  loadCredentialList = async () => {
    await axios
      .get(`${SERVER_URL4}/spider/credentials`)
      .then(({ data: { data } }) => {
        runInAction(() => {
          this.credential = data.credential;
          this.totalElements = this.credential.length;
          this.CredentialName = this.credential.map(
            (list) => list.CredentialName
          );
          this.ProviderName = this.credential.map((list) => list.ProviderName);
          this.KeyValueInfoList = this.credential.map(
            (list) => list.KeyValueInfoList
          );
          // this.DomainName = this.KeyValueInfoList.map(
          //   (val) => Object.values(val[0])[1]
          // );
        });
        console.log(Object.values(this.KeyValueInfoList[0][0])[1]);
      })
      .then(() => {
        this.convertList(this.credential, this.setCredentialList);
      });
  };

  postCredential = async (data, callback) => {
    const YAML = require("yamljs");
    // const body = {
    //   ...data,
    //   enabled: true,
    // };
    console.log(YAML);
    return await axios
      .post(`${SERVER_URL4}/spider/credentials`, YAML.parse(this.content))
      .then((res) => {
        console.log(res);
        if (res.status === 201) {
          swalError("Credential 생성 완료", callback);
        }
      });
  };

  loadClusterList = async (type = "") => {
    await axios
      .get(`${SERVER_URL2}/clusters`)
      .then((res) => {
        runInAction(() => {
          const list =
            type === ""
              ? res.data
              : res.data.filter((item) => item.clusterType === type);
          this.clusterList = list;
          this.clusterNameList = list.map((item) => item.clusterName);
          this.totalElements = list.length;
        });
      })
      .then(() => {
        this.convertList(this.clusterList, this.setClusterList);
      })
      .then(() => {
        this.loadCluster(this.viewList[0].clusterName);
      });
    // this.clusterDetail = list[0];
  };

  loadCluster = async (clusterName) => {
    await axios.get(`${SERVER_URL2}/clusters/${clusterName}`).then((res) => {
      runInAction(() => {
        this.clusterDetail = res.data;
      });
    });
  };

  loadClusterInProject = async (project) => {
    await axios
      .get(`${apiV2}/clusterInfo?project=${project}`)
      .then((res) => runInAction(() => (this.clusters = res.data.data)));
  };
  loadClusterInWorkspace = async (workspace) => {
    await axios
      .get(`${SERVER_URL2}/clusters?workspace=${workspace}`)
      .then((res) => runInAction(() => (this.clusters = res.data.data)));
  };

  setDetail = (num) => {
    runInAction(() => {
      this.clusterDetail = this.clusterList.find(
        (item) => item.clusterNum === num
      );
    });
  };

  setClusters = (clusters) => {
    runInAction(() => {
      this.clusters = clusters;
    });
  };

  setCredentialName = (name) => {
    runInAction(() => {
      this.CredentialName = name;
    });
  };

  setProviderName = (name) => {
    runInAction(() => {
      this.ProviderName = name;
    });
  };

  setDomainName = (name) => {
    runInAction(() => {
      this.DomainName = name;
    });
  };
}

const certificationStore = new Certification();
export default certificationStore;
