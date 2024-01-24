package controller

import (
	"context"
	"fmt"
	"gmc_api_gateway/config"
	"log"
	"os"
	"strings"
	"time"

	"github.com/prometheus/client_golang/api"
	v1 "github.com/prometheus/client_golang/api/prometheus/v1"
	"github.com/prometheus/common/model"
)

var nowClusterMetric = map[string]string{
	"cpu_usage":    "round(sum(rate(node_cpu_seconds_total{mode!='idle',mode!='iowait',$1}[5m]))by(cluster),0.01)",
	"memory_usage": "round(sum(node_memory_MemTotal_bytes{$1}-node_memory_MemFree_bytes-node_memory_Buffers_bytes-node_memory_Cached_bytes-node_memory_SReclaimable_bytes)by(cluster)/1024/1024/1024,0.01)",
	"pod_running":  "sum(kube_pod_container_status_running{$1})by(cluster)",
}
var nowWorkspaceMetric = map[string]string{
	"namespace_cpu":    "round(sum(sum(irate(container_cpu_usage_seconds_total{job='kubelet',pod!='',image!='', $1}[5m]))by(namespace,pod,cluster))by(namespace),0.001)",
	"namespace_memory": "round(sum(sum(container_memory_rss{job='kubelet',pod!='',image!='',$1})by(namespace,pod,cluster))by(namespace)/1024/1024/1024,0.001)",
	"pod_running":      "sum(kube_pod_container_status_running{$1})by(namespace)",
}

var nowNamespaceMetric = map[string]string{
	"namespace_cpu":    "round(sum(sum(irate(container_cpu_usage_seconds_total{job='kubelet',pod!='',image!='', $1}[5m]))by(namespace,pod,cluster))by(namespace,cluster),0.001)",
	"namespace_memory": "round(sum(sum(container_memory_rss{job='kubelet',pod!='',image!='',$1})by(namespace,pod,cluster))by(namespace,cluster)/1024/1024/1024,0.001)",
	"pod_running":      "sum(kube_pod_container_status_running{$1})by(namespace)",
}

var nowGpuMetric = map[string]string{
	"gpu_info": "nvidia_smi_gpu_info{$1}",
}

func NowMonit(k string, c string, n string, m []string) interface{} {

	// log.Println("==================", c, n)

	switch k {
	case "namespace":
		//필요 파라미터 검증
		if check := strings.Compare(c, "")*strings.Compare(n, "")*len(m) == 0; check {
			return nil //에러 반환
		}

		//메트릭 검증
		for _, metric := range m {
			if metric == "" {
				continue
			}
			if check := strings.Compare(nowNamespaceMetric[metric], "") == 0; check {
				return nil
			}
		}
	case "cluster":
		if check := strings.Compare(c, "")*len(m) == 0; check {
			return nil //에러 반환
		}

		//메트릭 검증
		for _, metric := range m {
			if metric == "" {
				continue
			}
			if check := strings.Compare(nowClusterMetric[metric], "") == 0; check {
				return nil
			}
		}

	case "workspace":
		if check := strings.Compare(n, "")*len(m) == 0; check {
			return nil //에러 반환
		}

		//메트릭 검증
		for _, metric := range m {
			if metric == "" {
				continue
			}
			if check := strings.Compare(nowWorkspaceMetric[metric], "") == 0; check {
				return nil
			}
		}
	}
	//Prometheus call
	config.Init()
	addr := os.Getenv("PROMETHEUS")
	// result := map[string]model.Value{}
	result := map[string]interface{}{}
	for i, metric := range m {
		if metric == "" {
			continue
		}
		// var data model.Value
		// var jsonString interface{}
		// mapData := make(map[model.Time]model.SampleValue)
		var value interface{}
		switch k {
		case "namespace":
			temp_filter := map[string]string{
				"cluster":   c,
				"namespace": n,
			}
			data, err := nowQueryRange(addr, nowMetricExpr(nowNamespaceMetric[m[i]], temp_filter))
			if err != nil {
				log.Println("err : ", err)
			}
			if check := len(data.(model.Matrix)) != 0; check {
				for _, val := range data.(model.Matrix)[0].Values {
					// mapData[val.Timestamp] = val.Value'
					value = val.Value
					// if val.Value !=  {

					// } else {
					// 	value = 0
					// }

				}
			}
		case "workspace":
			temp_filter := map[string]string{
				"namespace": n,
			}
			data, err := nowQueryRange(addr, nowMetricExpr(nowWorkspaceMetric[m[i]], temp_filter))
			if err != nil {
				log.Println("err3 : ", err)
			}
			if check := len(data.(model.Matrix)) != 0; check {
				for _, val := range data.(model.Matrix)[0].Values {
					// mapData[val.Timestamp] = val.Value
					value = val.Value
				}
			}
		case "cluster":
			temp_filter := map[string]string{
				"cluster": c,
			}
			data, err := nowQueryRange(addr, nowMetricExpr(nowClusterMetric[m[i]], temp_filter))
			if err != nil {
				log.Println("err : ", err)
			}

			if check := len(data.(model.Matrix)) != 0; check {
				for _, val := range data.(model.Matrix)[0].Values {

					value = val.Value
				}
			}
		default:

			return result
		}
		result[m[i]] = value
		// fmt.Println("value2 : ", value)
		// result[m[i]] = value
	}
	// fmt.Println("=====result=====", result)
	return result
}

func nowQueryRange(endpointAddr string, query string) (result model.Value, err error) {
	var start_time time.Time
	var end_time time.Time
	var step time.Duration

	// fmt.Println(query)
	t := time.Now()

	start_time = time.Unix(t.Unix(), 0)

	end_time = time.Unix(t.Unix(), 0)

	tm3, _ := time.ParseDuration("1s")
	step = tm3

	client, err := api.NewClient(api.Config{
		Address: endpointAddr,
	})

	if err != nil {
		log.Printf("Error creating client: %v\n", err)
		return nil, err
		// os.Exit(1)
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
		return nil, err
		// os.Exit(1)
	}

	if len(warnings) > 0 {
		log.Printf("Warnings: %v\n", warnings)
	}
	// log.Printf("Result:\n%v\n", result)
	return result, nil
}

func nowMetricExpr(val string, filter map[string]string) string {
	var returnVal string

	for k, v := range filter {
		if v == "allCluster" {
			val = strings.Replace(val, "by(cluster)", "", -1)
		}
		switch v {
		case "all":
			returnVal += fmt.Sprintf(`%s!="",`, k)
		case "allCluster":
			returnVal += fmt.Sprintf(`%s!="",`, k)
		default:
			returnVal += fmt.Sprintf(`%s="%s",`, k, v)
		}

	}

	return strings.Replace(val, "$1", returnVal, -1)
}

func GpuCheck(c string) ([]map[string]interface{}, bool) {
	// var gpuList []interface{}
	var gpuList []map[string]interface{}

	if check := strings.Compare(c, "") == 0; check {
		return gpuList, false
	}
	config.Init()
	addr := os.Getenv("PROMETHEUS")

	temp_filter := map[string]string{
		"cluster": c,
	}

	data, err := nowQueryRange(addr, nowMetricExpr(nowGpuMetric["gpu_info"], temp_filter))
	log.Println("err : ", err)
	if err != nil {
		log.Println("err : ", err)
	} else {
		if check := len(data.(model.Matrix)) != 0; check {
			// for _, val := range data.(model.Matrix)[0].Values {
			// 	// value = val.Value
			// 	fmt.Println(val)
			// }
			for _, val := range data.(model.Matrix) {
				gpu := make(map[string]interface{})
				// value = val.Value
				// fmt.Println(val.Metric["name"])
				gpu["name"] = val.Metric["name"]
				gpu["node"] = val.Metric["node"]
				gpu["uuid"] = val.Metric["uuid"]
				gpu["container"] = val.Metric["container"]
				gpu["vbios_version"] = val.Metric["vbios_version"]
				gpuList = append(gpuList, gpu)

			}
		} else {
			return gpuList, false
		}
	}
	return gpuList, true
}
