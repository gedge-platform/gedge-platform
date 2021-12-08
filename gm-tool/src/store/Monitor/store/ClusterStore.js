import { makeAutoObservable, runInAction } from "mobx";
import ClusterMonitApi from "../api/ClusterMonitApi";

class ClusterStore {

  //요청 전체 결과값
  cluster_res = [];
  cluster_list = [];
  cur_cluster = "";

  cpu_util = [];
  cpu_usage = [];
  cpu_total = [];

  memory_util = [];
  memory_usage = [];
  memory_total = [];

  disk_util = [];
  disk_usage = [];
  disk_total = [];

  apiserver_request_rate = [];
  apiserver_latency = [];

  scheduler_attempts_total = [];
  scheduler_fail_total = [];
  scheduler_attempts = [];
  scheduler_fail = [];
  scheulder_latency = [];

  pod_running = [];
  pod_quota = [];
  pod_util = [];

  gpu_temperature = [];
  gpu_power = [];
  gpu_power_limit = [];
  gpu_memory_total = [];
  gpu_memory_used = [];
  gpu_memory_free = [];
  gpu_ratio = [];
  gpu_memory_ratio = [];
  gpu_fan_speed = [];
  gpu_info = [];

  test_arr = [];

  pod_count = [];
  service_count = [];
  deployment_count = [];
  cronjob_count = [];
  job_count = [];
  pv_count = [];
  pvc_count = [];
  namespace_count = [];

  container_cpu = [];
  container_memory = [];
  container_net_bytes_transmitted = [];
  container_net_bytes_received = [];

  //모니터링 지속 저장 값을 위한 변수
  constructor() {
    makeAutoObservable(this);
    this.clusterApi = new ClusterMonitApi();
  }

  //cluster list ranage

  async cluster_lists() {
    const res = await this.clusterApi.cluster_list();
    // console.log(res)
    runInAction(() => {
      this.cluster_list = res
      this.cluster_list = this.cluster_list.data
      this.cur_cluster = this.cluster_list[0].clusterName
    });
  }

  //예외처리 전부 필요. 각 메트릭 요청을 보냈지만 메트릭이 안오는 경우도 발생할 수 있음.

  async physical_request(interval, step, cluster, metric, kind) {
    const res = await this.clusterApi.cluster_api(interval, step, cluster, metric, kind);
    runInAction(() => {
      if (cluster === "all") {
        this.cluster_res = res
        this.cpu_util = this.cluster_res.items.cpu_util
        this.cpu_usage = this.cluster_res.items.cpu_usage
        this.cpu_total = this.cluster_res.items.cpu_total
        this.memory_util = this.cluster_res.items.memory_util
        this.memory_usage = this.cluster_res.items.memory_usage
        this.memory_total = this.cluster_res.items.memory_total
        this.disk_util = this.cluster_res.items.disk_util
        this.disk_usage = this.cluster_res.items.disk_usage
        this.disk_total = this.cluster_res.items.disk_total
      }
      else {
        this.cluster_res = res
        console.log(this.cpu_util)
        if (this.cpu_util !== undefined && this.cpu_util.filter(item => item.metric.cluster === cluster).length > 0) {
          this.cpu_util.filter(item => item.metric.cluster === cluster)[0].values = this.cluster_res.items.cpu_util[0].values
        }
        if (this.cpu_usage !== undefined && this.cpu_usage.filter(item => item.metric.cluster === cluster).length > 0) {
          this.cpu_usage.filter(item => item.metric.cluster === cluster)[0].values = this.cluster_res.items.cpu_usage[0].values
        }
        if (this.cpu_total !== undefined && this.cpu_total.filter(item => item.metric.cluster === cluster).length > 0) {
          this.cpu_total.filter(item => item.metric.cluster === cluster)[0].values = this.cluster_res.items.cpu_total[0].values
        }
        if (this.memory_util !== undefined && this.memory_util.filter(item => item.metric.cluster === cluster).length > 0) {
          this.memory_util.filter(item => item.metric.cluster === cluster)[0].values = this.cluster_res.items.memory_util[0].values
        }
        if (this.memory_usage !== undefined && this.memory_usage.filter(item => item.metric.cluster === cluster).length > 0) {
          this.memory_usage.filter(item => item.metric.cluster === cluster)[0].values = this.cluster_res.items.memory_usage[0].values
        }
        if (this.memory_total !== undefined && this.memory_total.filter(item => item.metric.cluster === cluster).length > 0) {
          this.memory_total.filter(item => item.metric.cluster === cluster)[0].values = this.cluster_res.items.memory_total[0].values
        }
        if (this.disk_util !== undefined && this.disk_util.filter(item => item.metric.cluster === cluster).length > 0) {
          this.disk_util.filter(item => item.metric.cluster === cluster)[0].values = this.cluster_res.items.disk_util[0].values
        }
        if (this.disk_usage !== undefined && this.disk_usage.filter(item => item.metric.cluster === cluster).length > 0) {
          this.disk_usage.filter(item => item.metric.cluster === cluster)[0].values = this.cluster_res.items.disk_usage[0].values
        }
        if (this.disk_total !== undefined && this.disk_total.filter(item => item.metric.cluster === cluster).length > 0) {
          this.disk_total.filter(item => item.metric.cluster === cluster)[0].values = this.cluster_res.items.disk_total[0].values
        }
      }
    });
  }

  async real_physical_request(interval, step, cluster, metric, kind) {
    const res5s = await this.clusterApi.cluster_api(interval, step, cluster, metric, kind);

    let cpu_util = res5s.items.cpu_util
    let cpu_usage = res5s.items.cpu_usage
    let cpu_total = res5s.items.cpu_total
    let memory_util = res5s.items.memory_util
    let memory_usage = res5s.items.memory_usage
    let memory_total = res5s.items.memory_total
    let disk_util = res5s.items.disk_util
    let disk_usage = res5s.items.disk_usage
    let disk_total = res5s.items.disk_total

    runInAction(() => {
      if (this.cpu_util !== undefined && cpu_util.length > 0 && this.cpu_util.length > 0) {
        this.cpu_util.filter(item => item.metric.cluster === cluster)[0].values.push(cpu_util[0].values[0])
      }
      if (this.cpu_usage !== undefined && cpu_usage.length > 0 && this.cpu_usage.length > 0) {
        this.cpu_usage.filter(item => item.metric.cluster === cluster)[0].values.push(cpu_usage[0].values[0])
      }
      if (this.cpu_total !== undefined && cpu_total.length > 0 && this.cpu_total.length > 0) {
        this.cpu_total.filter(item => item.metric.cluster === cluster)[0].values.push(cpu_total[0].values[0])
      }
      if (this.memory_util !== undefined && memory_util.length > 0 && this.memory_util.length > 0) {
        this.memory_util.filter(item => item.metric.cluster === cluster)[0].values.push(memory_util[0].values[0])
      }
      if (this.memory_usage !== undefined && memory_usage.length > 0 && this.memory_usage.length > 0) {
        this.memory_usage.filter(item => item.metric.cluster === cluster)[0].values.push(memory_usage[0].values[0])
      }
      if (this.memory_total !== undefined && memory_total.length > 0 && this.memory_total.length > 0) {
        this.memory_total.filter(item => item.metric.cluster === cluster)[0].values.push(memory_total[0].values[0])
      }
      if (this.disk_util !== undefined && disk_util.length > 0 && this.disk_util.length > 0) {
        this.disk_util.filter(item => item.metric.cluster === cluster)[0].values.push(disk_util[0].values[0])
      }
      if (this.disk_usage !== undefined && disk_usage.length > 0 && this.disk_usage.length > 0) {
        this.disk_usage.filter(item => item.metric.cluster === cluster)[0].values.push(disk_usage[0].values[0])
      }
      if (this.disk_total !== undefined && disk_total.length > 0 && this.disk_total.length > 0) {
        this.disk_total.filter(item => item.metric.cluster === cluster)[0].values.push(disk_total[0].values[0])
      }
    });
  }

  async apiserver_request(interval, step, cluster, metric, kind) {
    const res = await this.clusterApi.cluster_api(interval, step, cluster, metric, kind);
    runInAction(() => {
      if (cluster === "all") {
        this.cluster_res = res
        this.apiserver_request_rate = this.cluster_res.items.apiserver_request_rate
        // this.apiserver_latency = this.cluster_res.items.apiserver_latency
      }
      else {
        this.cluster_res = res
        if (this.apiserver_request_rate.filter(item => item.metric.cluster === cluster).length > 0) {
          this.apiserver_request_rate.filter(item => item.metric.cluster === cluster)[0].values = this.cluster_res.items.apiserver_request_rate[0].values
          // this.apiserver_latency.filter(item => item.metric.cluster == cluster)[0].values = this.cluster_res.items.apiserver_latency[0].values
        }
      }
    });
  }

  async real_apiserver_request(interval, step, cluster, metric, kind) {
    const res5s = await this.clusterApi.cluster_api(interval, step, cluster, metric, kind);

    let apiserver_request_rate = res5s.items.apiserver_request_rate
    // let apiserver_latency = res5s.items.apiserver_latency

    runInAction(() => {
      if (apiserver_request_rate.length > 0 && this.apiserver_request_rate.length > 0) {
        this.apiserver_request_rate.filter(item => item.metric.cluster === cluster)[0].values.push(apiserver_request_rate[0].values[0])
        // this.apiserver_latency.filter(item => item.metric.cluster == cluster)[0].values.push(apiserver_latency[0].values[0])
      }
    });
  }

  async shceduler_request(interval, step, cluster, metric, kind) {
    const res = await this.clusterApi.cluster_api(interval, step, cluster, metric, kind);

    runInAction(() => {
      if (cluster === "all") {
        this.cluster_res = res
        this.scheduler_attempts_total = this.cluster_res.items.scheduler_attempts_total
        this.scheduler_fail_total = this.cluster_res.items.scheduler_fail_total
        // this.scheulder_latency = this.cluster_res.items.scheulder_latency
        this.pod_running = this.cluster_res.items.pod_running
        this.pod_quota = this.cluster_res.items.pod_quota
        this.pod_util = this.cluster_res.items.pod_util
        this.scheduler_fail = this.cluster_res.items.scheduler_fail
        this.scheduler_attempts = this.cluster_res.items.scheduler_attempts
      }
      else {
        if (this.scheduler_attempts_total.filter(item => item.metric.cluster === cluster).length > 0) {
          this.cluster_res = res
          this.scheduler_attempts_total.filter(item => item.metric.cluster === cluster)[0].values = this.cluster_res.items.scheduler_attempts_total[0].values
          this.scheduler_fail_total.filter(item => item.metric.cluster === cluster)[0].values = this.cluster_res.items.scheduler_fail_total[0].values
          // this.scheulder_latency.filter(item => item.metric.cluster == cluster)[0].values = this.cluster_res.items.scheulder_latency[0].values
          this.pod_running.filter(item => item.metric.cluster === cluster)[0].values = this.cluster_res.items.pod_running[0].values
          this.pod_quota.filter(item => item.metric.cluster === cluster)[0].values = this.cluster_res.items.pod_quota[0].values
          this.pod_util.filter(item => item.metric.cluster === cluster)[0].values = this.cluster_res.items.pod_util[0].values
          this.scheduler_fail.filter(item => item.metric.cluster === cluster)[0].values = this.cluster_res.items.scheduler_fail[0].values
          this.scheduler_attempts.filter(item => item.metric.cluster === cluster)[0].values = this.cluster_res.items.scheduler_attempts[0].values
        }
      }
    });
  }

  async real_shceduler_request(interval, step, cluster, metric, kind) {
    const res5s = await this.clusterApi.cluster_api(interval, step, cluster, metric, kind);

    let scheduler_attempts_total = res5s.items.scheduler_attempts_total
    let scheduler_fail_total = res5s.items.scheduler_fail_total
    // let scheulder_latency = res5s.items.scheulder_latency
    let pod_running = res5s.items.pod_running
    let pod_quota = res5s.items.pod_quota
    let pod_util = res5s.items.pod_util
    let scheduler_fail = res5s.items.scheduler_fail
    let scheduler_attempts = res5s.items.scheduler_attempts

    runInAction(() => {
      if (scheduler_attempts_total.length > 0 && this.scheduler_attempts_total.length > 0) {
        this.scheduler_attempts_total.filter(item => item.metric.cluster === cluster)[0].values.push(scheduler_attempts_total[0].values[0])
        this.scheduler_fail_total.filter(item => item.metric.cluster === cluster)[0].values.push(scheduler_fail_total[0].values[0])
        // this.scheulder_latency.filter(item => item.metric.cluster == cluster)[0].values.push(scheulder_latency[0].values[0])
        this.pod_running.filter(item => item.metric.cluster === cluster)[0].values.push(pod_running[0].values[0])
        this.pod_quota.filter(item => item.metric.cluster === cluster)[0].values.push(pod_quota[0].values[0])
        this.pod_util.filter(item => item.metric.cluster === cluster)[0].values.push(pod_util[0].values[0])
        this.scheduler_fail.filter(item => item.metric.cluster === cluster)[0].values.push(scheduler_fail[0].values[0])
        this.scheduler_attempts.filter(item => item.metric.cluster === cluster)[0].values.push(scheduler_attempts[0].values[0])
      }
    });
  }

  async gpu_request(interval, step, cluster, metric, kind) {

    const res = await this.clusterApi.cluster_api(interval, step, cluster, metric, kind);

    runInAction(() => {
      this.cluster_res = res
      this.gpu_temperature = this.cluster_res.items.gpu_temperature
      this.gpu_power = this.cluster_res.items.gpu_power
      this.gpu_power_limit = this.cluster_res.items.gpu_power_limit
      this.gpu_memory_total = this.cluster_res.items.gpu_memory_total
      this.gpu_memory_used = this.cluster_res.items.gpu_memory_used
      this.gpu_memory_free = this.cluster_res.items.gpu_memory_free
      this.gpu_ratio = this.cluster_res.items.gpu_ratio
      this.gpu_memory_ratio = this.cluster_res.items.gpu_memory_ratio
      this.gpu_fan_speed = this.cluster_res.items.gpu_fan_speed
      this.gpu_info = this.cluster_res.items.gpu_info
    });
  }


  async resource_request(interval, step, cluster, metric, kind) {

    const res = await this.clusterApi.cluster_api(interval, step, cluster, metric, kind);

    runInAction(() => {
      if (cluster === "all") {
        this.cluster_res = res
        this.pod_count = this.cluster_res.items.pod_count
        this.service_count = this.cluster_res.items.service_count
        this.deployment_count = this.cluster_res.items.deployment_count
        this.cronjob_count = this.cluster_res.items.cronjob_count
        this.job_count = this.cluster_res.items.job_count
        this.pv_count = this.cluster_res.items.pv_count
        this.pvc_count = this.cluster_res.items.pvc_count
        this.namespace_count = this.cluster_res.items.namespace_count
      }
      else {
        this.cluster_res = res
        if (this.pod_count.filter(item => item.metric.cluster === cluster).length > 0) {
          this.pod_count.filter(item => item.metric.cluster === cluster)[0].values = this.cluster_res.items.pod_count[0].values
        }
        if (this.service_count.filter(item => item.metric.cluster === cluster).length > 0) {
          this.service_count.filter(item => item.metric.cluster === cluster)[0].values = this.cluster_res.items.service_count[0].values
        }
        if (this.deployment_count.filter(item => item.metric.cluster === cluster).length > 0) {
          this.deployment_count.filter(item => item.metric.cluster === cluster)[0].values = this.cluster_res.items.deployment_count[0].values
        }
        if (this.cronjob_count.filter(item => item.metric.cluster === cluster).length > 0) {
          this.cronjob_count.filter(item => item.metric.cluster === cluster)[0].values = this.cluster_res.items.cronjob_count[0].values
        }
        if (this.job_count.filter(item => item.metric.cluster === cluster).length > 0) {
          this.job_count.filter(item => item.metric.cluster === cluster)[0].values = this.cluster_res.items.job_count[0].values
        }
        if (this.pv_count.filter(item => item.metric.cluster === cluster).length > 0) {
          this.pv_count.filter(item => item.metric.cluster === cluster)[0].values = this.cluster_res.items.pv_count[0].values
        }
        if (this.pvc_count.filter(item => item.metric.cluster === cluster).length > 0) {
          this.pvc_count.filter(item => item.metric.cluster === cluster)[0].values = this.cluster_res.items.pvc_count[0].values
        }
        if (this.namespace_count.filter(item => item.metric.cluster === cluster).length > 0) {
          this.namespace_count.filter(item => item.metric.cluster === cluster)[0].values = this.cluster_res.items.namespace_count[0].values
        }
      }
    });
  }

  async real_resource_request(interval, step, cluster, metric, kind) {
    const res5s = await this.clusterApi.cluster_api(interval, step, cluster, metric, kind);

    let pod_count = res5s.items.pod_count
    let service_count = res5s.items.service_count
    let deployment_count = res5s.items.deployment_count
    let cronjob_count = res5s.items.cronjob_count
    let job_count = res5s.items.job_count
    let pv_count = res5s.items.pv_count
    let pvc_count = res5s.items.pvc_count
    let namespace_count = res5s.items.namespace_count

    runInAction(() => {

      if (pod_count.length > 0 && this.pod_count.length > 0) {
        this.pod_count.filter(item => item.metric.cluster === cluster)[0].values.push(pod_count[0].values[0])
      }
      if (service_count.length > 0 && this.service_count.length > 0) {
        this.service_count.filter(item => item.metric.cluster === cluster)[0].values.push(service_count[0].values[0])
      }
      if (deployment_count.length > 0 && this.deployment_count.length > 0) {
        this.deployment_count.filter(item => item.metric.cluster === cluster)[0].values.push(deployment_count[0].values[0])
      }
      if (cronjob_count.length > 0 && this.cronjob_count.length > 0) {
        this.cronjob_count.filter(item => item.metric.cluster === cluster)[0].values.push(cronjob_count[0].values[0])
      }
      if (job_count.length > 0 && this.job_count.length > 0) {
        this.job_count.filter(item => item.metric.cluster === cluster)[0].values.push(job_count[0].values[0])
      }
      if (pv_count.length > 0 && this.pv_count.length > 0) {
        this.pv_count.filter(item => item.metric.cluster === cluster)[0].values.push(pv_count[0].values[0])
      }
      if (pvc_count.length > 0 && this.pvc_count.length > 0) {
        this.pvc_count.filter(item => item.metric.cluster === cluster)[0].values.push(pvc_count[0].values[0])
      }
      if (namespace_count.length > 0 && this.namespace_count.length > 0) {
        this.namespace_count.filter(item => item.metric.cluster === cluster)[0].values.push(namespace_count[0].values[0])
      }
    });
  }

  async pod_request(interval, step, cluster, namespace, pod, metric, kind) {

    const res = await this.clusterApi.pod_api(interval, step, cluster, namespace, pod, metric, kind);

    runInAction(() => {

      this.cluster_res = res
      this.pod_cpu = this.cluster_res.items.pod_cpu
      this.pod_memory = this.cluster_res.items.pod_memory
      this.pod_net_bytes_transmitted = this.cluster_res.items.pod_net_bytes_transmitted
      this.pod_net_bytes_received = this.cluster_res.items.pod_net_bytes_received
      this.container_cpu = this.cluster_res.items.container_cpu
      this.container_memory = this.cluster_res.items.container_memory

      // this.container_net_bytes_received = this.cluster_res.items.container_net_bytes_received
      // this.container_net_bytes_transmitted = this.cluster_res.items.container_net_bytes_transmitted

    });
  }

}

const clusterStore = new ClusterStore();
export default clusterStore;
