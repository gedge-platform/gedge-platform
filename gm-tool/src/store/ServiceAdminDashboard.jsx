import axios from "axios";
import { makeAutoObservable, runInAction, toJS } from "mobx";
import { BASIC_AUTH, SERVER_URL2, SERVER_URL4 } from "../config";
import { getItem } from "@/utils/sessionStorageFn";
import { swalError } from "../utils/swal-utils";

class ServiceAdminDashboard {
  dashboardData = {};
  workspaceNameList = [];
  workspaceName = "";
  projectList = [];
  podCpuTop = [];
  podMemTop = [];
  projectCpuTop = [
    {
      name: "",
      value: 0,
    },
  ];

  projectMemTop = [];
  resource = {};

  setWorkspaceName = (value) => {
    runInAction(() => {
      this.workspaceName = value;
    });
  };

  setWorkspaceNameList = (value) => {
    runInAction(() => {
      this.workspaceNameList = value;
    });
  };

  constructor() {
    makeAutoObservable(this);
  }

  loadWorkspaceName = async () => {
    const { id } = getItem("user");
    await axios
      .get(`${SERVER_URL4}/workspaces?user=${id}`)
      .then(({ data: { data } }) => {
        runInAction(() => {
          this.workspaceNameList = data.map((item) => item.workspaceName);
          const tmp = this.workspaceNameList.map((name) => name);
          this.workspaceName = tmp.map((workspaceName) => workspaceName);
        });
      })
      .then(() => {
        this.loadServiceAdminDashboard(this.workspaceName[0]);
      });
  };

  loadServiceAdminDashboard = async (workspaceName) => {
    const { id } = getItem("user");
    await axios
      .get(
        `${SERVER_URL4}/serviceDashboard?user=${id}&workspace=${workspaceName}`
      )
      .then(({ data: { data } }) => {
        runInAction(() => {
          this.dashboardData = data;
          this.projectList = data?.projectList ? data?.projectList : 0;
          this.projectName = this.projectList
            ? this.projectList?.map((name) => name.projectName)
            : 0;

          this.podCpuTop = data?.podCpuTop5 ? data?.podCpuTop5 : 0;
          this.podMemTop = data?.podMemTop5 ? data?.podMemTop5 : 0;

          this.projectCpuTop = data?.projectCpuTop5 ? data?.projectCpuTop5 : 0;
          this.projectMemTop = data?.projectMemTop5 ? data?.projectMemTop5 : 0;
          this.resource = data?.resource ? data?.resource : 0;
        });
      });
  };

  //   loadServiceAdminDashboard = async () => {
  //     const { id } = getItem("user");
  //     const urls = axios.get(`${SERVER_URL4}/workspaces?user=${id}`);
  //     const result = await Promise.all([urls]).then((res) => {
  //       return res;
  //     });

  //     const workspaceData = result.map((item) => item.data.data);
  //     this.workspaceNameList = workspaceData[0].map((item) => item.workspaceName);

  //     await this.workspaceNameList.map((item) => {
  //       let workspaceName = item;
  //       axios
  //         .get(
  //           `${SERVER_URL4}/serviceDashboard?user=${id}&workspace=${workspaceName}`
  //         )

  //         .then((res) => {
  //           runInAction(() => {
  //             console.log(res);
  //             this.dashboardData = res.data;
  //           });
  //         })
  //         .then(() => {
  //           this.loadServiceAdminDashboard(this.workspaceName[0]);
  //         });
  //     });
  //   };
}

const serviceAdminDashboardStore = new ServiceAdminDashboard();
export default serviceAdminDashboardStore;
