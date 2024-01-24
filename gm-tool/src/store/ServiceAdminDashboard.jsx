import axios from "axios";
import { makeAutoObservable, runInAction, toJS } from "mobx";
import { SERVER_URL } from "../config";
import { getItem } from "@/utils/sessionStorageFn";
import { swalError } from "../utils/swal-utils";
import {
  unixToTime,
  unixStartTime,
  stepConverter,
  unixCurrentTime,
  LastTimeList,
  IntervalList,
} from "@/pages/Gedge/Monitoring/Utils/MetricsVariableFormatter";

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
  allMetrics = [];
  deploymentMetrics = [];
  setDeploymentMetrics = (value) => {
    runInAction(() => {
      this.deploymentMetrics = value;
    });
  };
  jobMetrics = [];
  podMetrics = [];
  volumeMetrics = [];
  cronjobMetrics = [];
  daemonsetMetrics = [];
  serviceMetrics = [];
  statefulsetMetrics = [];
  lastTime = LastTimeList[1];
  interval = IntervalList[1];
  projectName = "";
  projectNameList = [];

  constructor() {
    makeAutoObservable(this);
  }

  setMetricsLastTime = (time) => {
    runInAction(() => {
      this.lastTime = time;
    });
  };

  setMetricsInterval = (interval) => {
    runInAction(() => {
      this.interval = interval;
    });
  };

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

  setProjectNameInMonitoring = (value) => {
    runInAction(() => {
      this.projectNameInMonitoring = value;
    });
  };

  loadProjectName = async (workspaceName) => {
    const { id } = getItem("user");
    await axios
      .get(`${SERVER_URL}/userProjects?user=${id}&workspace=${workspaceName}`)
      .then(({ data: { data } }) => {
        runInAction(() => {
          this.projectNameList = data.map((item) => item.projectName);
          this.projectNameInMonitoring = this.projectNameList[0];
        });
      })
      .then(() => {
        this.serviceAdminMonitoring(
          this.projectNameInMonitoring,
          unixStartTime(60),
          unixCurrentTime(),
          stepConverter(5)
        );
      });
  };

  resourceMetric = [];
  resourceMetricData = [];

  serviceAdminMonitoring = async (
    projectNameInMonitoring,
    start,
    end,
    step
  ) => {
    await axios
      .get(
        `${SERVER_URL}/resourceMonitoring?project=${projectNameInMonitoring}&start=${start}&end=${end}&step=${step}`
      )
      .then((res) => {
        runInAction(() => {
          this.allMetrics = res.data?.items;
          this.deploymentMetrics = res.data?.items?.deployment_count[0].values;
          this.podMetrics = res.data?.items?.pod_count[0].values;
          this.volumeMetrics = res.data?.items?.pv_count[0].values;
          this.serviceMetrics = res.data?.items?.service_count[0].values;
          this.cronjobMetrics = res.data?.items?.cronjob_count[0].values;
          this.daemonsetMetrics = res.data?.items?.daemonset_count[0].values;
          this.statefulsetMetrics =
            res.data?.items?.statefulset_count[0].values;
        });
      });
  };

  loadWorkspaceName = async () => {
    const { id } = getItem("user");
    await axios
      .get(`${SERVER_URL}/workspaces?user=${id}`)
      .then(({ data: { data } }) => {
        runInAction(() => {
          this.workspaceNameList = data.map((item) => item.workspaceName);
          const tmp = this.workspaceNameList.map((name) => name);
          this.workspaceName = tmp.map((workspaceName) => workspaceName);
        });
      })
      .then(() => {
        this.loadServiceAdminDashboard(this.workspaceName[0]);
        this.loadProjectName(this.workspaceName[0]);
      });
  };

  loadServiceAdminDashboard = async (workspaceName) => {
    const { id } = getItem("user");
    await axios
      .get(
        `${SERVER_URL}/serviceDashboard?user=${id}&workspace=${workspaceName}`
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
}

const serviceAdminDashboardStore = new ServiceAdminDashboard();
export default serviceAdminDashboardStore;
