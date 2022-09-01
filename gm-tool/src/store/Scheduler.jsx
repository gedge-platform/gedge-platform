import axios from "axios";
import { makeAutoObservable, runInAction } from "mobx";
import { SERVER_URL3, REQUEST_URL2 } from "../config";
import clusterStore from "./Cluster";
import * as FormData from "form-data";
import deploymentStore from "./Deployment";

class Scheduler {
  totalElements = 0;
  currentPage = 1;
  totalPages = 1;
  resultList = {};
  viewList = [];

  constructor() {
    makeAutoObservable(this);
  }

  postWorkload = (requestId, workspace, project, type) => {
    axios
      .post(SERVER_URL3, {
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
      .post(`http://101.79.4.15:32527/yaml`, formData)
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
