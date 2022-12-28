import axios from "axios";
import { makeAutoObservable, runInAction, toJS } from "mobx";
import { SERVER_URL, REQUEST_URL2 } from "../config";
import clusterStore from "./Cluster";
import * as FormData from "form-data";
import deploymentStore from "./Deployment";
import { getItem } from "../utils/sessionStorageFn";

class Scheduler {
  totalElements = 0;
  currentPage = 1;
  totalPages = 1;
  resultList = {};
  viewList = [];
  yamlList = [];

  constructor() {
    makeAutoObservable(this);
  }

  setYamlList = (list) => {
    runInAction(() => {
      this.yamlList = list;
    });
  };

  setViewList = (n) => {
    runInAction(() => {
      this.viewList = this.yamlList[n];
    });
  };

  goPrevPage = () => {
    runInAction(() => {
      if (this.currentPage > 1) {
        this.currentPage = this.currentPage - 1;
        this.setViewList(this.currentPage - 1);
      }
    });
  };

  goNextPage = () => {
    runInAction(() => {
      if (this.totalPages > this.currentPage) {
        this.currentPage = this.currentPage + 1;
        this.setViewList(this.currentPage - 1);
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

  loadYamlList = async () => {
    let { id, role } = getItem("user");
    role === "SA" ? (id = id) : (id = "");
    await axios
      .get(`${SERVER_URL}/pods?user=${id}`)
      .then((res) => {
        runInAction(() => {
          console.log(res);

          this.yamlList = res.data.data;
          this.totalElements =
            res.data.data === null ? 0 : res.data.data.length;
        });
      })
      .then(() => {
        this.convertList(this.yamlList, this.setYamlList);
      });
  };

  postWorkload = (requestId, workspace, project, type) => {
    axios
      .post(SERVER_URL, {
        request_id: requestId,
        workspaceName: workspace,
        projectName: project,
        type: type,
        status: "CREATED",
        date: new Date(),
      })
      .then((res) => {
        console.log(res);
      })
      .catch((e) => console.log(e.message));
  };

  // deplotment에서 생성하면 이걸로 post
  postScheduler = (requestId, yaml, callback) => {
    const { clusters } = clusterStore;

    let formData = new FormData();

    formData.append("callbackUrl", `${REQUEST_URL2}`); // 수정 필요
    formData.append("requestId", requestId);
    formData.append("yaml", yaml);
    formData.append("clusters", JSON.stringify(clusters));

    axios
      // .post(`http://101.79.4.15:32527/yaml`, formData)
      .post(`http://101.79.1.173:8012/yaml`, formData)
      .then(function (response) {
        if (response.status === 200) {
          const popup = window.open(
            "",
            "Gedge scheduler",
            `width=1552,height=900`,
            "fullscreen=yes"
          );
          popup.document.open().write(response.data);
          popup.document.close();

          callback();
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // Load YAML에서 생성하면 이걸로 post
  postScheduler2 = (requestId, yaml, callback) => {
    const { clusters } = clusterStore;
    const { project } = deploymentStore;
    let formData = new FormData();

    formData.append("callbackUrl", `${REQUEST_URL2}`); // 수정 필요
    formData.append("requestId", requestId);
    formData.append("yaml", yaml);
    formData.append("clusters", JSON.stringify(clusters));
    formData.append("project", project);

    axios
      .post(`http://101.79.4.15:32527/yaml2`, formData)
      .then(function (response) {
        if (response.status === 200) {
          const popup = window.open(
            "",
            "Gedge scheduler",
            `width=1552,height=900`,
            "fullscreen=yes"
          );
          popup.document.open().write(response.data);
          popup.document.close();

          callback();
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
}

const schedulerStore = new Scheduler();
export default schedulerStore;
