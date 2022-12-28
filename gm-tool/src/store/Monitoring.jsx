import axios from "axios";
import { makeAutoObservable, runInAction, toJS } from "mobx";
import { BASIC_AUTH, SERVER_URL, MONITORING_URL } from "../config";
import {
  ClusterMetricTypes,
  TargetTypes,
} from "@/pages/Gedge/Monitoring/Utils/MetricsVariables";

import {
  unixToTime,
  unixStartTime,
  stepConverter,
} from "@/pages/Gedge/Monitoring/Utils/MetricsVariableFormatter";
import { unixCurrentTime } from "@/pages/Gedge/Monitoring/Utils/MetricsVariableFormatter";
import {
  LastTimeList,
  IntervalList,
} from "@/pages/Gedge/Monitoring/Utils/MetricsVariableFormatter";

class Monitoring {
  clusterName = "";
  clusterNames = [];
  clusterMetrics = [];
  coPieCPU = [];
  coPieMemory = [];
  coPieDisk = [];
  coPiePod = [];
  coPieAPILatency = [];
  coPieAPIRate = [];
  coPieSchedulerAttempts = [];
  coPieSchedulerRate = [];
  allMetrics = {};
  appMetrics = {};
  lastTime = LastTimeList[1];
  interval = IntervalList[1];

  constructor() {
    makeAutoObservable(this);
  }

  setClusterName = (selectName) => {
    runInAction(() => {
      this.clusterName = selectName;
    });
  };

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

  getMonitURL = (
    target,
    start,
    end,
    step,
    clusterFilter,
    metricFilter,
    options
  ) => {
    switch (target) {
      case TargetTypes.CLUSTER:
      case TargetTypes.APPLICATION:
      case TargetTypes.NODE:
        return `${MONITORING_URL}/${target}?start=${start}&end=${end}&step=${step}&cluster_filter=${clusterFilter}&metric_filter=${metricFilter}`;
      case TargetTypes.NAMESPACE:
        return `${MONITORING_URL}/pod?start=${start}&end=${end}&step=${step}&cluster_filter=${clusterFilter}&namespace_filter=${options[0]}&metric_filter=${metricFilter}`;
      case TargetTypes.POD:
        return `${MONITORING_URL}/pod?start=${start}&end=${end}&step=${step}&cluster_filter=${clusterFilter}&namespace_filter=${options[0]}&pod_filter=${options[1]}&metric_filter=${metricFilter}`;

      default:
        break;
    }
  };

  // checkedNullValue = (res) => {
  //     console.log(res.data.items.length);
  // };

  convertResponseToMonit = (res) => {
    const array = [];
    runInAction(() => {
      Object.entries(res.data?.items).map(([key, value]) => {
        const clusterMetric = {
          metricType: "",
          metrics: [],
        };
        clusterMetric.metricType = key;

        if (value.length === 0) {
          for (
            let index = unixStartTime(60 * 6);
            index < unixCurrentTime();
            index = index + 60 * 5
          ) {
            console.log(clusterMetric);
            clusterMetric.metrics.push({
              time: unixToTime(index),
              value: 0,
            });
            console.log(array);
            array.push(clusterMetric);
          }

          return array;
        }

        value[0]?.values.forEach((element) => {
          clusterMetric.metrics.push({
            time: unixToTime(element[0]),
            value: element[1],
          });
        });
        array.push(clusterMetric);
      });
    });
    return array;
  };

  loadClusterNames = async (callback) => {
    await axios
      .get(`${SERVER_URL}/clusters`)
      .then((res) => {
        runInAction(() => {
          this.clusterNames = res.data.data?.map((item) => item.clusterName);
          this.clusterName = this.clusterNames[0];
        });
      })
      .then(() => callback());
  };

  loadCoCPU = async (target, start, end, step, metricFilter, ...options) => {
    await axios
      .get(
        this.getMonitURL(
          target,
          start,
          end,
          step,
          this.clusterName,
          metricFilter,
          options
        ),
        { auth: BASIC_AUTH }
      )
      .then((res) => {
        this.coPieCPU = this.convertResponseToMonit(res);
      });
  };

  loadCoMemory = async (target, start, end, step, metricFilter, ...options) => {
    await axios
      .get(
        this.getMonitURL(
          target,
          start,
          end,
          step,
          this.clusterName,
          metricFilter,
          options
        ),
        { auth: BASIC_AUTH }
      )
      .then((res) => {
        this.coPieMemory = this.convertResponseToMonit(res);
        // console.log(this.coPieMemory[2]?.metrics);
      });
  };

  loadCoDisk = async (target, start, end, step, metricFilter, ...options) => {
    await axios
      .get(
        this.getMonitURL(
          target,
          start,
          end,
          step,
          this.clusterName,
          metricFilter,
          options
        ),
        { auth: BASIC_AUTH }
      )
      .then((res) => {
        runInAction(() => {
          this.coPieDisk = this.convertResponseToMonit(res);
        });
      });
  };

  loadCoPod = async (target, start, end, step, metricFilter, ...options) => {
    await axios
      .get(
        this.getMonitURL(
          target,
          start,
          end,
          step,
          this.clusterName,
          metricFilter,
          options
        ),
        { auth: BASIC_AUTH }
      )
      .then((res) => {
        runInAction(() => {
          this.coPiePod = this.convertResponseToMonit(res);
        });
      });
  };

  loadCoAPILatency = async (
    target,
    start,
    end,
    step,
    metricFilter,
    ...options
  ) => {
    await axios
      .get(
        this.getMonitURL(
          target,
          start,
          end,
          step,
          this.clusterName,
          metricFilter,
          options
        ),
        { auth: BASIC_AUTH }
      )
      .then((res) => {
        runInAction(() => {
          this.coPieAPILatency = this.convertResponseToMonit(res);
        });
      });
  };

  loadCoAPIRate = async (
    target,
    start,
    end,
    step,
    metricFilter,
    ...options
  ) => {
    await axios
      .get(
        this.getMonitURL(
          target,
          start,
          end,
          step,
          this.clusterName,
          metricFilter,
          options
        ),
        { auth: BASIC_AUTH }
      )
      .then((res) => {
        runInAction(() => {
          this.coPieAPIRate = this.convertResponseToMonit(res);
        });
      });
  };

  loadCoSchedulerAttempts = async (
    target,
    start,
    end,
    step,
    metricFilter,
    ...options
  ) => {
    await axios
      .get(
        this.getMonitURL(
          target,
          start,
          end,
          step,
          this.clusterName,
          metricFilter,
          options
        ),
        { auth: BASIC_AUTH }
      )
      .then((res) => {
        runInAction(() => {
          this.coPieSchedulerAttempts = this.convertResponseToMonit(res);
        });
      });
  };

  loadCoSchedulerRate = async (
    target,
    start,
    end,
    step,
    metricFilter,
    ...options
  ) => {
    await axios
      .get(
        this.getMonitURL(
          target,
          start,
          end,
          step,
          this.clusterName,
          metricFilter,
          options
        ),
        { auth: BASIC_AUTH }
      )
      .then((res) => {
        runInAction(() => {
          this.coPieSchedulerRate = this.convertResponseToMonit(res);
        });
      });
  };

  loadAllMetrics = async (
    target,
    // start,
    end,
    // step,
    metricFilter,
    ...option
  ) => {
    await axios
      .get(
        this.getMonitURL(
          target,
          unixStartTime(this.lastTime.value),
          end,
          stepConverter(this.interval.value),
          this.clusterName,
          metricFilter,
          option
        ),
        { auth: BASIC_AUTH }
      )
      .then((res) => {
        runInAction(() => {
          this.allMetrics = res.data.items;
        });
      });
  };

  loadRealAllMetrics = async (
    target,
    // start,
    end,
    // step,
    metricFilter,
    ...option
  ) => {
    await axios
      .get(
        this.getMonitURL(
          target,
          unixStartTime(10),
          end,
          "5s",
          this.clusterName,
          metricFilter,
          option
        ),
        { auth: BASIC_AUTH }
      )
      .then((res) => {
        runInAction(() => {
          this.allMetrics = res.data.items;
        });
      });
  };

  loadAppMetrics = async (
    target,
    // start,
    end,
    // step,
    metricFilter,
    ...option
  ) => {
    await axios
      .get(
        this.getMonitURL(
          target,
          unixStartTime(this.lastTime.value),
          end,
          stepConverter(this.interval.value),
          this.clusterName,
          metricFilter,
          option
        ),
        { auth: BASIC_AUTH }
      )
      .then((res) => {
        runInAction(() => {
          this.appMetrics = res.data.items;
        });
      });
  };

  loadRealAppMetrics = async (
    target,
    // start,
    end,
    // step,
    metricFilter,
    ...option
  ) => {
    await axios
      .get(
        this.getMonitURL(
          target,
          unixStartTime(10),
          end,
          "5s",
          this.clusterName,
          metricFilter,
          option
        ),
        { auth: BASIC_AUTH }
      )
      .then((res) => {
        runInAction(() => {
          this.appMetrics = res.data.items;
        });
      });
  };

  // loadMetrics = async (
  //     target,
  //     start,
  //     end,
  //     step,
  //     clusterFilter,
  //     metricFilter,
  //     ...options
  // ) => {
  //     await axios
  //         .get(
  //             this.getMonitURL(
  //                 target,
  //                 start,
  //                 end,
  //                 step,
  //                 clusterFilter,
  //                 metricFilter,
  //                 options
  //             ),
  //             { auth: BASIC_AUTH }
  //         )
  //         .then((res) => {
  //             this.convertResponseToMonit(res);
  //         });
  // };
}

const monitoringStore = new Monitoring();
export default monitoringStore;
