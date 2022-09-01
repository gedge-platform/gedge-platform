package controller

import (
	"context"
	"fmt"
	"gmc_api_gateway/app/common"
	"gmc_api_gateway/config"
	"log"
	"net/http"
	"os"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/prometheus/client_golang/api"
	v1 "github.com/prometheus/client_golang/api/prometheus/v1"
	"github.com/prometheus/common/model"
)

//memory -> GI / Disk -> GB / CPU -> Core / Net -> Kbps
var clusterMetric = map[string]string{
	"cpu_util":        "round(100 - (avg(irate(node_cpu_seconds_total{mode='idle', $1}[5m]))by(cluster) * 100),0.01)",
	"cpu_util_bak":    "round(100-(avg(irate(node_cpu_seconds_total{mode='idle', $1}[5m]))by(cluster)*100),0.1)",
	"cpu_usage":       "round(sum(rate(node_cpu_seconds_total{mode!='idle',mode!='iowait',$1}[5m]))by(cluster),0.01)",
	"cpu_usage_bak":   "round(sum(rate(container_cpu_usage_seconds_total{id='/', $1}[1m]))by(cluster),0.01)",
	"cpu_total":       "sum(machine_cpu_cores{$1})by(cluster)",
	"memory_util":     "round(avg((1 - (node_memory_MemAvailable_bytes{$1} / (node_memory_MemTotal_bytes{$1})))* 100)by(cluster),0.01)",
	"memory_util_bak": "round(sum(node_memory_MemTotal_bytes{$1}-node_memory_MemFree_bytes-node_memory_Buffers_bytes-node_memory_Cached_bytes-node_memory_SReclaimable_bytes)by(cluster)/sum(node_memory_MemTotal_bytes)by(cluster)*100,0.1)",
	"memory_usage":    "round(sum(node_memory_MemTotal_bytes{$1}-node_memory_MemFree_bytes-node_memory_Buffers_bytes-node_memory_Cached_bytes-node_memory_SReclaimable_bytes)by(cluster)/1024/1024/1024,0.01)",
	"memory_total":    "round(sum(node_memory_MemTotal_bytes{$1})by(cluster)/1024/1024/1024,0.01)",
	"disk_util":       "round(((sum(node_filesystem_size_bytes{mountpoint='/',fstype!='rootfs', $1})by(cluster)-sum(node_filesystem_avail_bytes{mountpoint='/',fstype!='rootfs', $1})by(cluster))/(sum(node_filesystem_size_bytes{mountpoint='/',fstype!='rootfs', $1})by(cluster)))*100,0.1)",
	"disk_usage":      "round((sum(node_filesystem_size_bytes{mountpoint='/',fstype!='rootfs', $1})by(cluster)-sum(node_filesystem_avail_bytes{mountpoint='/',fstype!='rootfs', $1})by(cluster))/1000/1000/1000,0.01)",
	"disk_total":      "round(sum(node_filesystem_size_bytes{mountpoint='/',fstype!='rootfs', $1})by(cluster)/1000/1000/1000,0.01)",
	"pod_running":     "sum(kube_pod_container_status_running{$1})by(cluster)",
	"pod_quota":       "sum(max(kube_node_status_capacity{resource='pods', $1})by(node,cluster)unless on(node,cluster)(kube_node_status_condition{condition='Ready',status=~'unknown|false'}>0))by(cluster)",
	"pod_util":        "round((count(count(container_spec_memory_reservation_limit_bytes{pod!='', $1})by(cluster,pod))by(cluster))/(sum(max(kube_node_status_capacity{resource='pods', $1})by(node,cluster)unless on(node,cluster)(kube_node_status_condition{condition='Ready',status=~'unknown|false'}>0))by(cluster))*100,0.1)",
	"pod_running_bak": "count(count(container_spec_memory_reservation_limit_bytes{pod!='', $1})by(cluster,pod))by(cluster)",
	"pod_quota_bak":   "sum(max(kube_node_status_capacity{resource='pods', $1})by(node,cluster)unless on(node,cluster)(kube_node_status_condition{condition='Ready',status=~'unknown|false'}>0))by(cluster)",
	"pod_util_bak":    "round((count(count(container_spec_memory_reservation_limit_bytes{pod!='', $1})by(cluster,pod))by(cluster))/(sum(max(kube_node_status_capacity{resource='pods', $1})by(node,cluster)unless on(node,cluster)(kube_node_status_condition{condition='Ready',status=~'unknown|false'}>0))by(cluster))*100,0.1)",

	"apiserver_request_rate": "round(sum(irate(apiserver_request_total{$1}[5m]))by(cluster),0.001)",
	// latency 보완 필요 (응답속도 느림)
	"apiserver_latency": "histogram_quantile(0.99, sum(rate(apiserver_request_duration_seconds_bucket{verb!~'CONNECT|WATCH',$1}[1m])) by (le,cluster))",

	"scheduler_attempts":       "sum(increase(scheduler_schedule_attempts_total{$1}[1m]))by(result,cluster)",
	"scheduler_attempts_total": "sum(scheduler_pod_scheduling_attempts_count{$1})by(cluster)",
	"scheduler_fail":           "sum(rate(scheduler_pending_pods{$1}[1m]))by(cluster)",
	"scheduler_fail_total":     "sum(scheduler_pending_pods{$1})by(cluster)",
	//에러
	// "scheduler_latency": "histogram_quantile(0.95,sum(rate(scheduler_e2e_scheduling_duration_seconds_bucket{$1}[5m]))by(le,cluster))",
	"scheduler_latency": "histogram_quantile(0.95,sum(scheduler_e2e_scheduling_duration_seconds_bucket{$1})by(le,cluster))",
}

var namespaceMetric = map[string]string{
	"namespace_cpu":       "round(sum(sum(irate(container_cpu_usage_seconds_total{job='kubelet',pod!='',image!='', $1}[5m]))by(namespace,pod,cluster))by(namespace,cluster),0.001)",
	"namespace_memory":    "round(sum(sum(container_memory_rss{job='kubelet',pod!='',image!='', $1})by(namespace,pod,cluster))by(namespace,cluster)/1024/1024/1024,0.1)",
	"namespace_pod_count": "count(count(container_spec_memory_reservation_limit_bytes{pod!='', $1})by(pod,cluster,namespace))by(cluster,namespace)",
}

var podMetric = map[string]string{
	"pod_cpu":    "round(sum(irate(container_cpu_usage_seconds_total{job='kubelet',pod!='',image!='', $1}[5m]))by(namespace,pod,cluster),0.001)",
	"pod_memory": "sum(container_memory_rss{job='kubelet',pod!='',image!='', $1})by(cluster,pod,namespace)",
	//1bytes -> 8bps / 1bps -> 0.125bytes / 현재 단위 1kbps -> 125bytes
	"pod_net_bytes_transmitted": "round(sum(irate(container_network_transmit_bytes_total{pod!='',interface!~'^(cali.+|tunl.+|dummy.+|kube.+|flannel.+|cni.+|docker.+|veth.+|lo.*)',job='kubelet', $1}[5m]))by(namespace,pod,cluster)/125,0.01)",
	"pod_net_bytes_received":    "round(sum(irate(container_network_receive_bytes_total{pod!='',interface!~'^(cali.+|tunl.+|dummy.+|kube.+|flannel.+|cni.+|docker.+|veth.+|lo.*)',job='kubelet', $1}[5m]))by(namespace,pod,cluster)/125,0.01)",
	//container 쿼리문 검증 필요
	"container_cpu":    "round(sum(irate(container_cpu_usage_seconds_total{job='kubelet',pod!='',container!='',image!='', $1}[5m]))by(namespace,pod,cluster,container),0.001)",
	"container_memory": "sum(container_memory_rss{job='kubelet',pod!='',container!='',image!='', $1})by(cluster,pod,namespace,container)",
	// "container_net_bytes_transmitted": "round(sum(irate(container_network_transmit_bytes_total{pod!='',container!='',interface!~'^(cali.+|tunl.+|dummy.+|kube.+|flannel.+|cni.+|docker.+|veth.+|lo.*)',job='kubelet', $1}[5m]))by(namespace,pod,cluster,container)/125,0.01)",
	// "container_net_bytes_received":    "round(sum(irate(container_network_receive_bytes_total{pod!='',container!='',interface!~'^(cali.+|tunl.+|dummy.+|kube.+|flannel.+|cni.+|docker.+|veth.+|lo.*)',job='kubelet', $1}[5m]))by(namespace,pod,cluster,container)/125,0.01)",
}

var nodeMetric = map[string]string{ //쿼리 수정 필요
	"node_cpu_util":              "100-avg(irate(node_cpu_seconds_total{mode='idle',$1}[5m]) * on(instance) group_left(nodename) node_uname_info)by(nodename,cluster)*100",
	"node_cpu_usage":             "sum (rate (container_cpu_usage_seconds_total{id='/',$1}[5m])) by (instance,cluster,node)",
	"node_cpu_total":             "sum(machine_cpu_cores{$1}) by (cluster,node)",
	"node_memory_util":           "((node_memory_MemTotal_bytes{$1} * on(instance) group_left(nodename) node_uname_info ) - (node_memory_MemAvailable_bytes{$1} * on(instance) group_left(nodename) node_uname_info ) ) / (node_memory_MemTotal_bytes{$1} * on(instance) group_left(nodename) node_uname_info) *100",
	"node_memory_usage":          "((node_memory_MemTotal_bytes{$1} * on(instance) group_left(nodename) node_uname_info ) - (node_memory_MemFree_bytes{$1}* on(instance) group_left(nodename) node_uname_info) - (node_memory_Buffers_bytes{$1}* on(instance) group_left(nodename) node_uname_info) - (node_memory_Cached_bytes{$1}* on(instance) group_left(nodename) node_uname_info) - (node_memory_SReclaimable_bytes{$1}* on(instance) group_left(nodename) node_uname_info))/1024/1024/1024",
	"node_memory_total":          "sum(node_memory_MemTotal_bytes{$1} * on(instance) group_left(nodename) node_uname_info)by(cluster,nodename)/1024/1024/1024",
	"node_disk_util":             "100- (node_filesystem_avail_bytes{mountpoint='/',fstype!='rootfs',$1}* on(instance) group_left(nodename) node_uname_info) /  (node_filesystem_size_bytes{mountpoint='/',fstype!='rootfs',$1}* on(instance) group_left(nodename) node_uname_info) *100",
	"node_disk_usage":            "((node_filesystem_size_bytes{mountpoint='/',fstype!='rootfs',$1}* on(instance) group_left(nodename) node_uname_info) - (node_filesystem_avail_bytes{mountpoint='/',fstype!='rootfs',$1}* on(instance) group_left(nodename) node_uname_info))/1000/1000/1000",
	"node_disk_total":            "((node_filesystem_size_bytes{mountpoint='/',fstype!='rootfs',$1})* on(instance) group_left(nodename) node_uname_info ) /1000/1000/1000",
	"node_pod_running":           "sum(kubelet_running_pods{node!='',$1}) by(cluster,node)",
	"node_pod_quota":             "max(kube_node_status_capacity{resource='pods',$1}) by (node,cluster) unless on (node,cluster) (kube_node_status_condition{condition='Ready',status=~'unknown|false',$1} > 0)",
	"node_disk_inode_util":       "100 - ((node_filesystem_files_free{mountpoint=`/`,$1}* on(instance) group_left(nodename) node_uname_info) / (node_filesystem_files{mountpoint='/',$1}* on(instance) group_left(nodename) node_uname_info) * 100)",
	"node_disk_inode_total":      "(node_filesystem_files{mountpoint='/',$1}* on(instance) group_left(nodename) node_uname_info)",
	"node_disk_inode_usage":      "((node_filesystem_files{mountpoint='/',$1}* on(instance) group_left(nodename) node_uname_info) - (node_filesystem_files_free{mountpoint='/',$1}* on(instance) group_left(nodename) node_uname_info))",
	"node_disk_read_iops":        "(rate(node_disk_reads_completed_total{device=~'vda',$1}[5m])* on(instance) group_left(nodename) node_uname_info)",
	"node_disk_write_iops":       "(rate(node_disk_writes_completed_total{device=~'vda',$1}[5m])* on(instance) group_left(nodename) node_uname_info)",
	"node_disk_read_throughput":  "(irate(node_disk_read_bytes_total{device=~'vda',$1}[5m])* on(instance) group_left(nodename) node_uname_info)",
	"node_disk_write_throughput": "(irate(node_disk_written_bytes_total{device=~'vda',$1}[5m])* on(instance) group_left(nodename) node_uname_info)",
	"node_net_bytes_transmitted": "(irate(node_network_transmit_bytes_total{device='ens3'}[5m])* on(instance) group_left(nodename) node_uname_info)/125",
	"node_net_bytes_received":    "(irate(node_network_receive_bytes_total{device='ens3'}[5m])* on(instance) group_left(nodename) node_uname_info)/125",
	"node_info":                  "kube_node_info{$1}",
}

var appMetric = map[string]string{
	"pod_count":        "count(count by (pod,cluster)(container_spec_memory_reservation_limit_bytes{pod!='',$1}))by(cluster)",
	"service_count":    "count(kube_service_created{$1})by(cluster)",
	"deployment_count": "count(kube_deployment_created{$1})by(cluster)",
	"cronjob_count":    "count(kube_cronjob_created{$1})by(cluster)",
	"job_count":        "count(kube_job_created{$1})by(cluster)",
	"pv_count":         "count(kube_persistentvolume_info{$1})by(cluster)",
	"pvc_count":        "count(kube_persistentvolumeclaim_info{$1})by(cluster)",
	"namespace_count":  "count(kube_namespace_created{$1})by(cluster)",
}
var resourceCntMetric = map[string]string{
	"pod_count":         "sum(kube_pod_labels{$1})",
	"cronjob_count":     "sum(kube_cronjob_labels{$1})",
	"job_count":         "sum(kube_job_labels{$1})",
	"service_count":     "sum(kube_service_labels{$1})",
	"daemonset_count":   "sum(kube_daemonset_labels{$1})",
	"statefulset_count": "sum(kube_statefulset_labels{$1})",
	"deployment_count":  "sum(kube_deployment_labels{$1})",
	"pv_count":          "sum(kube_persistentvolumeclaim_info{$1})",
	"namespace_count":   "sum(kube_namespace_labels{$1})",
}

var gpuMetric = map[string]string{
	"gpu_temperature":  "nvidia_smi_temperature_gpu{$1}",
	"gpu_power":        "nvidia_smi_power_draw_watts{$1}",
	"gpu_power_limit":  "nvidia_smi_power_limit_watts{$1}",
	"gpu_memory_total": "nvidia_smi_memory_total_bytes{$1}",
	"gpu_memory_used":  "nvidia_smi_memory_used_bytes{$1}",
	"gpu_memory_free":  "nvidia_smi_memory_free_bytes{$1}",
	"gpu_ratio":        "nvidia_smi_utilization_gpu_ratio{$1}",
	"gpu_memory_ratio": "nvidia_smi_utilization_memory_ratio{$1}",
	"gpu_fan_speed":    "nvidia_smi_fan_speed_ratio{$1}",
	"gpu_info":         "nvidia_smi_gpu_info{$1}",
}

func Monit(c echo.Context) (err error) {

	kind := c.Param("kind")

	if !validateParam(c) {
		return c.JSON(http.StatusBadRequest, echo.Map{
			"Error": "Bad Parameter",
		})
	}
	// fmt.Println("======GpuCheck 함수 테스트=====")
	// list, temp := GpuCheck(c.QueryParam("cluster_filter"))
	// fmt.Println("============")
	// fmt.Println(list, temp)

	// fmt.Println("======nowMonit 함수 테스트=====")
	// tempMetric := []string{"cpu_usage", "memory_usage", "pod_running"}
	// tempresult := NowMonit("cluster", "cluster2", "cluster2", tempMetric)
	// fmt.Println("============")
	// fmt.Println(tempresult)

	// 1. metric_filte를 parsing 한다
	metric_filter := c.QueryParam("metric_filter")
	metrics := metricParsing(metric_filter)
	//2. metric_filter가 clusterMetric, podMetric에 다 속해 있는지 검증한다.
	if !validateMetric(kind, metrics, c) {
		return c.JSON(http.StatusBadRequest, echo.Map{
			"Error": "Not found metric",
		})
	}

	//2/ 필터 입력값에 대해 검증한다.
	if !validateFilter(kind, c) {
		return c.JSON(http.StatusBadRequest, echo.Map{
			"Error": "Bad Filter",
		})
	}

	// 3. 처리 함수를 만든다 파라미터는 c,kind,metrics 를 입력.
	mericResult(c, kind, metrics)

	return nil
}

func mericResult(c echo.Context, kind string, a []string) error {
	config.Init()
	addr := os.Getenv("PROMETHEUS")

	cluster := c.QueryParam("cluster_filter")

	result := map[string]model.Value{}

	for k, metric := range a {
		if metric == "" {
			continue
		}

		var data model.Value
		var err error

		switch kind {
		case "cluster":
			temp_filter := map[string]string{
				"cluster": cluster,
			}
			data, err = QueryRange(addr, metricExpr(clusterMetric[a[k]], temp_filter), c)

		case "node":
			temp_filter := map[string]string{
				"cluster": cluster,
			}
			data, err = QueryRange(addr, metricExpr(nodeMetric[a[k]], temp_filter), c)

		case "pod":
			namespace := c.QueryParam("namespace_filter")
			pod := c.QueryParam("pod_filter")
			temp_filter := map[string]string{
				"cluster":   cluster,
				"namespace": namespace,
				"pod":       pod,
			}

			data, err = QueryRange(addr, metricExpr(podMetric[a[k]], temp_filter), c)

		case "app":
			temp_filter := map[string]string{
				"cluster": cluster,
			}
			data, err = QueryRange(addr, metricExpr(appMetric[a[k]], temp_filter), c)

		case "namespace":
			namespace := c.QueryParam("namespace_filter")
			temp_filter := map[string]string{
				"cluster":   cluster,
				"namespace": namespace,
			}

			data, err = QueryRange(addr, metricExpr(namespaceMetric[a[k]], temp_filter), c)
		case "resource":
			namespace := c.QueryParam("project")
			temp_filter := map[string]string{
				"namespace": namespace,
			}

			data, err = QueryRange(addr, metricExpr(resourceCntMetric[a[k]], temp_filter), c)

		case "gpu":
			temp_filter := map[string]string{
				"cluster": cluster,
			}
			data, err = QueryRange(addr, metricExpr(gpuMetric[a[k]], temp_filter), c)

		default:
			return c.JSON(http.StatusNotFound, echo.Map{
				"errors": echo.Map{
					"status_code": http.StatusNotFound,
					"message":     "Not Found",
				},
			})
		}
		if err != nil {
			return c.JSON(http.StatusNotFound, echo.Map{
				"errors": err,
			})
		}
		result[a[k]] = data
	}

	return c.JSON(http.StatusOK, echo.Map{
		"items": result,
	})

}

func metricParsing(m string) []string {
	slice := strings.Split(m, "|")
	var arrayMetric []string
	for _, v := range slice {
		if v != "" {
			arrayMetric = append(arrayMetric, v)
		}
	}

	return arrayMetric
}

func validateMetric(k string, m []string, c echo.Context) bool {

	switch k {
	case "cluster":

		for _, v := range m {
			if clusterMetric[v] == "" {
				return false
			}
		}
	case "node":
		for _, v := range m {
			if nodeMetric[v] == "" {
				return false
			}
		}
	case "pod":
		for _, v := range m {
			if podMetric[v] == "" {
				return false
			}
		}
	case "app":
		for _, v := range m {
			if appMetric[v] == "" {
				return false
			}
		}
	case "namespace":
		for _, v := range m {
			if namespaceMetric[v] == "" {
				return false
			}
		}
	case "gpu":
		for _, v := range m {
			if gpuMetric[v] == "" {
				return false
			}
		}
	default:
		return false
	}

	return true
}

func validateFilter(k string, c echo.Context) bool {

	switch k {
	case "cluster":
		cluster := c.QueryParam("cluster_filter")
		if check := strings.Compare(cluster, "") == 0; check {
			return false
		}
	case "node":
		cluster := c.QueryParam("cluster_filter")
		if check := strings.Compare(cluster, "") == 0; check {
			return false
		}
	case "pod":
		cluster := c.QueryParam("cluster_filter")
		pod := c.QueryParam("pod_filter")
		namespace := c.QueryParam("namespace_filter")
		if check := strings.Compare(cluster, "")*strings.Compare(pod, "")*strings.Compare(namespace, "") == 0; check {
			return false
		}
	case "app":
		cluster := c.QueryParam("cluster_filter")
		if check := strings.Compare(cluster, "") == 0; check {
			return false
		}
	case "namespace":
		cluster := c.QueryParam("cluster_filter")
		namespace := c.QueryParam("namespace_filter")
		// fmt.Println(cluster)
		if check := strings.Compare(cluster, "")*strings.Compare(namespace, "") == 0; check {
			return false
		}
	case "gpu":
		cluster := c.QueryParam("cluster_filter")
		if check := strings.Compare(cluster, "") == 0; check {
			return false
		}
	default:
		return false
	}

	return true
}

func validateParam(c echo.Context) bool {

	if c.QueryParam("start") == "" {
		return false
	}
	if c.QueryParam("end") == "" {
		return false
	}
	if c.QueryParam("step") == "" {
		return false
	}
	return true
}

func QueryRange(endpointAddr string, query string, c echo.Context) (model.Value, error) {
	fmt.Println("1")
	// log.Println("queryrange in")
	// log.Println(query)
	// log.Println(endpointAddr)
	var start_time time.Time
	var end_time time.Time
	var step time.Duration

	tm, _ := strconv.ParseInt(c.QueryParam("start"), 10, 64)
	start_time = time.Unix(tm, 0)

	tm2, _ := strconv.ParseInt(c.QueryParam("end"), 10, 64)
	end_time = time.Unix(tm2, 0)

	tm3, _ := time.ParseDuration(c.QueryParam("step"))
	step = tm3
	fmt.Println("2")
	client, err := api.NewClient(api.Config{
		Address: endpointAddr,
	})
	fmt.Println("3")
	if err != nil {
		log.Printf("Error creating client: %v\n", err)
		var tempResult model.Value
		return tempResult, err

	}
	fmt.Println("4")
	v1api := v1.NewAPI(client)
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)

	defer cancel()

	r := v1.Range{
		Start: start_time,
		End:   end_time,
		Step:  step,
	}

	result, warnings, err := v1api.QueryRange(ctx, query, r)

	if err != nil {
		log.Printf("Error querying Prometheus: %v\n", err)
		return result, err
		// os.Exit(1)
	}

	if len(warnings) > 0 {
		log.Printf("Warnings: %v\n", warnings)
	}
	fmt.Println("result : ", result)
	return result, nil
}

func metricExpr(val string, filter map[string]string) string {
	var returnVal string

	for k, v := range filter {

		switch v {
		case "all":
			returnVal += fmt.Sprintf(`%s!="",`, k)
		default:
			returnVal += fmt.Sprintf(`%s="%s",`, k, v)
		}

	}

	return strings.Replace(val, "$1", returnVal, -1)
}

var dashboardMetric = map[string]string{
	"dashboard_cpu_used_podList":     "topk(5,sum(rate(container_cpu_usage_seconds_total{$1}[30m])) by (cluster,pod,namespace))",
	"dashboard_mem_used_podList":     "topk(5,sum(container_memory_working_set_bytes{container!='POD',container!='',pod!='',$1}) by (cluster,pod,namespace))",
	"dashboard_cpu_used_clusterList": "round(sum(rate(container_cpu_usage_seconds_total[1m]))by(cluster),0.01)",
	"dashboard_mem_used_clusterList": "nvidia_smi_power_limit_watts{$1}",
	"node_status":                    "kube_node_status_condition{condition='Ready',status='true',$1}==1",
	"cpu_used_podList":               "topk(5,sum(rate(container_cpu_usage_seconds_total{$1}[5m]))by(pod,namespace,cluster))",
	"memory_used_podList":            "topk(5,sum(rate(container_memory_usage_bytes{$1}))by(pod,namespace,cluster))",
	"namespace_cpu":                  "round(sum(sum(irate(container_cpu_usage_seconds_total{job='kubelet',pod!='',image!='', $1}[5m]))by(namespace,pod,cluster))by(namespace),0.001)",
	"namespace_memory":               "sum(container_memory_working_set_bytes{$1})by(namespace)",
}

func node_status(c string) interface{} {
	var nodeList []map[string]interface{}
	config.Init()
	addr := os.Getenv("PROMETHEUS")
	temp_filter := map[string]string{
		"cluster": c,
	}
	data, err := nowQueryRange(addr, nowMetricExpr(dashboardMetric["node_status"], temp_filter))
	fmt.Println("err : ", err)
	if err != nil {
		fmt.Println("err : ", err)
	} else {
		if check := len(data.(model.Matrix)) != 0; check {
			// data.(model.Matrix)[0].Values
			for _, val := range data.(model.Matrix) {
				node := make(map[string]interface{})
				fmt.Println(val.Metric["name"])
				node["name"] = val.Metric["node"]
				node["status"] = val.Metric["condition"]
				nodeList = append(nodeList, node)
			}
		}

	}
	return nodeList
}

func dashboard_pod_monit(c, kind, query string) []map[string]interface{} {
	// var gpuList []interface{}
	var podList []map[string]interface{}
	config.Init()
	addr := os.Getenv("PROMETHEUS")
	temp_filter := make(map[string]string)
	if kind == "cluster" {
		temp_filter["cluster"] = c
	} else if kind == "namespaces" {
		temp_filter["namespace"] = c
	}

	data, err := nowQueryRange(addr, nowMetricExpr(query, temp_filter))
	fmt.Println("err : ", err)
	if err != nil {
		fmt.Println("err : ", err)
	} else {
		if check := len(data.(model.Matrix)) != 0; check {
			// data.(model.Matrix)[0].Values
			for _, val := range data.(model.Matrix) {
				value := val.Values[0].Value
				pod := make(map[string]interface{})
				fmt.Println(val.Metric["name"])
				pod["name"] = val.Metric["pod"]
				pod["namespace"] = val.Metric["namespace"]
				pod["cluster"] = val.Metric["cluster"]
				pod["value"] = value
				podList = append(podList, pod)
			}
		}
	}
	sort.SliceStable(podList, func(i, j int) bool {
		return common.InterfaceToFloat(podList[i]["value"]) > common.InterfaceToFloat(podList[j]["value"])
	})
	return podList
}

func dashboard_cluster_monit(c, query string) interface{} {
	var podList []map[string]interface{}
	var result interface{}
	config.Init()
	addr := os.Getenv("PROMETHEUS")

	temp_filter := map[string]string{
		"cluster": c,
	}

	data, err := nowQueryRange(addr, nowMetricExpr(query, temp_filter))
	fmt.Println("nowMetricExpr(query, temp_filter) : ", nowMetricExpr(query, temp_filter))
	fmt.Println("data : ", data)
	if err != nil {
		fmt.Println("err : ", err)
	} else {
		if check := len(data.(model.Matrix)) != 0; check {
			// data.(model.Matrix)[0].Values
			for _, val := range data.(model.Matrix) {
				value := val.Values[0].Value
				pod := make(map[string]interface{})
				fmt.Println(val.Metric["name"])
				if c == "all" {
					pod["cluster"] = val.Metric["cluster"]
				}
				pod["value"] = value
				result = pod
				podList = append(podList, pod)
			}
		}
	}
	sort.SliceStable(podList, func(i, j int) bool {
		return common.InterfaceToFloat(podList[i]["value"]) > common.InterfaceToFloat(podList[j]["value"])
	})
	if c == "all" {
		result = podList
	}
	fmt.Println("data : ", result)
	return result
}

func resourceCntList(c, n, kind string) map[string]interface{} {
	resource := make(map[string]interface{})
	config.Init()
	addr := os.Getenv("PROMETHEUS")
	temp_filter := make(map[string]string)
	if kind == "nodes" {
		temp_filter["cluster"] = c

	} else if kind == "namespaces" {
		temp_filter["namespace"] = n
		temp_filter["cluster"] = c
	}
	for key, _ := range resourceCntMetric {
		data, err := nowQueryRange(addr, nowMetricExpr(resourceCntMetric[key], temp_filter))
		if err != nil {
			fmt.Println("err : ", err)
		} else {
			if check := len(data.(model.Matrix)) != 0; check {
				data := data.(model.Matrix)
				// resource := make(map[string]interface{})
				// fmt.Println("data", data)
				value := data[0].Values[0].Value
				fmt.Println("value", value)
				// if value ==  {
				// 	value = 0
				// }

				resource[key] = common.InterfaceToInt(value)
				// resourceList = append(resourceList, resource)
			} else {
				resource[key] = 0
			}
		}
	}
	// fmt.Println("resourceCntMetric : ", resourceCntMetric)

	return resource
}
func resourceCnt(c, kind, key string) int {
	config.Init()
	temp_filter := make(map[string]string)
	addr := os.Getenv("PROMETHEUS")
	if kind == "nodes" {
		temp_filter["cluster"] = c

	} else if kind == "namespaces" {
		temp_filter["namespace"] = c
	}
	var result int
	data, err := nowQueryRange(addr, nowMetricExpr(resourceCntMetric[key], temp_filter))
	if err != nil {
		fmt.Println("err : ", err)
	} else {
		if check := len(data.(model.Matrix)) != 0; check {
			data := data.(model.Matrix)
			// resource := make(map[string]interface{})
			value := data[0].Values[0].Value
			resource := common.InterfaceToInt(value)
			result = resource
			fmt.Println("###########result", result)
		}
	}
	return result
}

func namespaceUsage(c, query string) float64 {
	config.Init()
	temp_filter := make(map[string]string)
	addr := os.Getenv("PROMETHEUS")

	temp_filter["namespace"] = c

	var result float64
	data, err := nowQueryRange(addr, nowMetricExpr(query, temp_filter))
	if err != nil {
		fmt.Println("err : ", err)
	} else {
		if check := len(data.(model.Matrix)) != 0; check {
			data := data.(model.Matrix)
			// resource := make(map[string]interface{})
			value := data[0].Values[0].Value
			resource := common.InterfaceToFloat(value)
			result = resource
		}
	}
	return result
}
