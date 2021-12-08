import axios from "axios";

function Unix_timestamp(t) {
  var date = new Date(t * 1000);
  var year = date.getFullYear();
  var month = "0" + (date.getMonth() + 1);
  var day = "0" + date.getDate();
  var hour = "0" + date.getHours();
  var minute = "0" + date.getMinutes();
  var second = "0" + date.getSeconds();

  return (
    year +
    "-" +
    month.substr(-2) +
    "-" +
    day.substr(-2) +
    " " +
    hour.substr(-2) +
    ":" +
    minute.substr(-2) +
    ":" +
    second.substr(-2)
  );
}

function Unix_timestampConv() {
  return Math.floor(new Date().getTime() / 1000);
}

function string_time(time) {
  let str = "";

  if (time < 1) {
    str = time * 60 + "s"
  } else if (time < 60) {
    str = time + "m"
  } else {
    str = time / 60 + "h"
  }

  return str;
}

class ClusterMonitApi {
  // URL = "http://192.168.150.115:31298/api/v1/query_range";
  // Query =
  //   '?query=sum (rate (container_cpu_usage_seconds_total{id="/"}[5m])) by (cluster)';
  URL = "http://192.168.150.114:8008/kube/v1/monitoring/";

  cluster_list() {
    let URL2 = "http://192.168.150.114:8008/gmcapi/v1/clusters"
    return axios({
      method: "get",
      auth: {
        username: "admin",
        password: "qwe1212!Q"
      },
      url:
        URL2
    }).then((response) => (response && response.data) || null);
  }

  cluster_api(interval, step, cluster, metric, kind) {
    let cur_time = Math.ceil(new Date().getTime() / 1000);

    let start_time = Math.ceil(cur_time - interval * 60);
    let time_step = string_time(step);

    return axios({
      method: "get",
      auth: {
        username: "admin",
        password: "qwe1212!Q"
      },
      url:
        this.URL + kind + "?" +
        `start=${start_time}` +
        `&end=${cur_time}` +
        `&step=${time_step}` +
        `&cluster_filter=${cluster}` +
        `&metric_filter=${metric}`
    }).then((response) => (response && response.data) || null);
  }

  pod_api(interval, step, cluster, namespace, pod, metric, kind) {
    let cur_time = Math.ceil(new Date().getTime() / 1000);
    let start_time = Math.ceil(cur_time - interval * 60);
    let time_step = string_time(step);

    return axios({
      method: "get",
      auth: {
        username: "admin",
        password: "qwe1212!Q"
      },
      url:
        this.URL + kind + "?" +
        `start=${start_time}` +
        `&end=${cur_time}` +
        `&step=${time_step}` +
        `&cluster_filter=${cluster}` +
        `&namespace_filter=${namespace}` +
        `&pod_filter=${pod}` +
        `&metric_filter=${metric}`
    }).then((response) => (response && response.data) || null);
  }

}

export default ClusterMonitApi;
