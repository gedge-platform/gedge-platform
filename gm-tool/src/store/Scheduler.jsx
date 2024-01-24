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
  viewList = null;
  yamlList = [];
  yamlLists = [];

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
      }
    });
  };

  goNextPage = () => {
    runInAction(() => {
      if (this.totalPages > this.currentPage) {
        this.currentPage = this.currentPage + 1;
        this.paginationList();
      }
    });
  };

  paginationList = () => {
    runInAction(() => {
      if (this.yamlList !== null) {
        this.viewList = this.yamlList.slice(
          (this.currentPage - 1) * 20,
          this.currentPage * 20
        );
      }
    });
  };

  loadYamlList = async () => {
    let { id, role } = getItem("user");
    role === "SA" ? (id = id) : (id = "");
    await axios
      .get(`${SERVER_URL}/pods?user=${id}`)
      .then((res) => {
        runInAction(() => {
          if (res.data.data !== null) {
            this.yamlList = res.data.data;
            this.yamlLists = res.data.data;
            this.yamlDetail = res.data.data[0];
            this.totalPages = Math.ceil(res.data.data.length / 20);
            this.totalElements = res.data.data.length;
          } else {
            this.yamlList = [];
          }
        });
      })
      .then(() => {
        this.paginationList();
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
      .then((res) => {})
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
