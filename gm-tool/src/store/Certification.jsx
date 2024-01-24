import axios from "axios";
import { makeAutoObservable, runInAction, toJS } from "mobx";
import { SERVER_URL } from "../config";
import { swalError } from "../utils/swal-utils";

class Certification {
  credential = [];
  credentialList = [];
  certificationDetail = {};
  CredentialName = "";
  // credentialName = "";
  DomainName = "";
  IdentityEndPoint = "";
  Password = "";
  ProjectID = "";
  Username = "";
  ClientId = "";
  ClientSecret = "";
  Region = "";
  Zone = "";
  KeyValueInfoList = [];
  ProviderName = {};
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
        this.loadCertificationDetail(this.viewList[0].name);
      }
    });
  };

  goNextPage = () => {
    runInAction(() => {
      if (this.totalPages > this.currentPage) {
        this.currentPage = this.currentPage + 1;
        this.setViewList(this.currentPage - 1);
        this.loadCertificationDetail(this.viewList[0].name);
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
      this.setCurrentPage(1);
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

  setCredentialName = (n) => {
    runInAction(() => {
      this.CredentialName = n;
    });
  };

  setDomainName = (n) => {
    runInAction(() => {
      this.DomainName = n;
    });
  };

  setIdentityEndPoint = (n) => {
    runInAction(() => {
      this.IdentityEndPoint = n;
    });
  };

  setPassword = (n) => {
    runInAction(() => {
      this.Password = n;
    });
  };

  setProjectID = (n) => {
    runInAction(() => {
      this.ProjectID = n;
    });
  };

  setUsername = (n) => {
    runInAction(() => {
      this.Username = n;
    });
  };

  setAccessId = (n) => {
    runInAction(() => {
      this.AccessId = n;
    });
  };

  setAccessToken = (n) => {
    runInAction(() => {
      this.AccessToken = n;
    });
  };

  setClientId = (n) => {
    runInAction(() => {
      this.ClientId = n;
    });
  };

  setClientSecret = (n) => {
    runInAction(() => {
      this.ClientSecret = n;
    });
  };

  setRegion = (n) => {
    runInAction(() => {
      this.Region = n;
    });
  };

  setZone = (n) => {
    runInAction(() => {
      this.Zone = n;
    });
  };

  setProviderName = (n) => {
    runInAction(() => {
      this.ProviderName = n;
    });
  };

  loadCredentialList = async () => {
    await axios
      .get(`${SERVER_URL}/spider/credentialList`)
      .then(({ data: { data } }) => {
        runInAction(() => {
          this.credential = data;
          this.credentialList = data;
          this.totalElements = this.credential.length;
          this.CredentialName = this.credential.map((list) => list.name);
          this.ProviderName = this.credential.map((list) => list.type);
        });
      })
      .then(() => {
        this.convertList(this.credential, this.setCredentialList);
      })
      .then(() => {
        this.loadCertificationDetail(this.viewList[0].name);
      });
  };

  loadTypeCredentialList = async (provider) => {
    await axios
      .get(`${SERVER_URL}/spider/credentialList/${provider}`)
      .then(({ data: { data } }) => {
        runInAction(() => {
          this.credential = data;
        });
      });
  };

  loadCertificationDetail = async (certId) => {
    await axios.get(`${SERVER_URL}/certifications/${certId}`).then((res) => {
      runInAction(() => {
        this.certificationDetail = res.data;
      });
    });
  };

  postCredential = async (data, callback) => {
    const body = {
      ...data,
      enabled: true,
    };

    await axios
      .post(`${SERVER_URL}/spider/credentials`, body)
      .then((res) => {
        runInAction(() => {
          if (res.status === 200) {
            swalError("인증이 생성되었습니다.", callback);
            return true;
          }
        });
      })
      .catch((err) => {
        swalError("생성이 실패하였습니다.");
        return false;
      });
  };

  deleteCredential = async (CredentialName, callback) => {
    axios
      .delete(`${SERVER_URL}/spider/credentials/${CredentialName}`)
      .then((res) => {
        if (res.status === 200) swalError("Credential 삭제 완료", callback);
      })
      .catch((err) => {
        swalError("삭제에 실패하였습니다.");
      });
  };

  loadClusterList = async (type = "") => {
    await axios
      .get(`${SERVER_URL}/clusters`)
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
    await axios.get(`${SERVER_URL}/clusters/${clusterName}`).then((res) => {
      runInAction(() => {
        this.clusterDetail = res.data;
      });
    });
  };

  loadClusterInProject = async (project) => {
    await axios
      .get(`${SERVER_URL}/clusterInfo?project=${project}`)
      .then((res) => runInAction(() => (this.clusters = res.data.data)));
  };
  loadClusterInWorkspace = async (workspace) => {
    await axios
      .get(`${SERVER_URL}/clusters?workspace=${workspace}`)
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
