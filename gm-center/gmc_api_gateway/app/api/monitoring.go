package api

import (
	"context"
	"fmt"
	"log"
	"net/http"
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
	"cpu_util":     "round(100-(avg(irate(node_cpu_seconds_total{mode='idle', $1}[1m]))by(cluster)*100),0.1)",
	"cpu_usage":    "round(sum(rate(container_cpu_usage_seconds_total{id='/', $1}[1m]))by(cluster),0.01)",
	"cpu_total":    "sum(machine_cpu_cores{$1})by(cluster)",
	"memory_util":  "round(sum(node_memory_MemTotal_bytes{$1}-node_memory_MemFree_bytes-node_memory_Buffers_bytes-node_memory_Cached_bytes-node_memory_SReclaimable_bytes)by(cluster)/sum(node_memory_MemTotal_bytes)by(cluster)*100,0.1)",
	"memory_usage": "round(sum(node_memory_MemTotal_bytes{$1}-node_memory_MemFree_bytes-node_memory_Buffers_bytes-node_memory_Cached_bytes-node_memory_SReclaimable_bytes)by(cluster)/1024/1024/1024,0.01)",
	"memory_total": "round(sum(node_memory_MemTotal_bytes{$1})by(cluster)/1024/1024/1024,0.01)",
	"disk_util":    "round(((sum(node_filesystem_size_bytes{mountpoint='/',fstype!='rootfs', $1})by(cluster)-sum(node_filesystem_avail_bytes{mountpoint='/',fstype!='rootfs', $1})by(cluster))/(sum(node_filesystem_size_bytes{mountpoint='/',fstype!='rootfs', $1})by(cluster)))*100,0.1)",
	"disk_usage":   "round((sum(node_filesystem_size_bytes{mountpoint='/',fstype!='rootfs', $1})by(cluster)-sum(node_filesystem_avail_bytes{mountpoint='/',fstype!='rootfs', $1})by(cluster))/1000/1000/1000,0.01)",
	"disk_total":   "round(sum(node_filesystem_size_bytes{mountpoint='/',fstype!='rootfs', $1})by(cluster)/1000/1000/1000,0.01)",
	"pod_running":  "count(count(container_spec_memory_reservation_limit_bytes{pod!='', $1})by(cluster,pod))by(cluster)",
	"pod_quota":    "sum(max(kube_node_status_capacity{resource='pods', $1})by(node,cluster)unless on(node,cluster)(kube_node_status_condition{condition='Ready',status=~'unknown|false'}>0))by(cluster)",
	"pod_util":     "round((count(count(container_spec_memory_reservation_limit_bytes{pod!='', $1})by(cluster,pod))by(cluster))/(sum(max(kube_node_status_capacity{resource='pods', $1})by(node,cluster)unless on(node,cluster)(kube_node_status_condition{condition='Ready',status=~'unknown|false'}>0))by(cluster))*100,0.1)",

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

	addr := "http://101.79.4.15:32548/"

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

	client, err := api.NewClient(api.Config{
		Address: endpointAddr,
	})

	if err != nil {
		log.Printf("Error creating client: %v\n", err)
		var tempResult model.Value
		return tempResult, err

	}

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
