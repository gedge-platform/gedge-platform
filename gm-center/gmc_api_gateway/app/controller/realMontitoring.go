package controller

import (
	"context"
	"gmc_api_gateway/app/common"
	"gmc_api_gateway/config"
	"log"
	"net/http"
	"os"
	"sort"
	"strings"

	influxdb2 "github.com/influxdata/influxdb-client-go/v2"
	"github.com/labstack/echo/v4"
)

var realMetricTemplate = map[string]string{
	"cpu": `from(bucket:"monitoring")
	|> range(start: -$1)
	|> filter(fn: (r) => r["_measurement"] == "cpu")
	|> filter(fn: (r) => r["_field"] == "$2") 
	|> filter(fn: (r) => r["cluter"] == "$3") 
	|> filter(fn: (r) => r["cpu"] == "cpu-total")
	|> aggregateWindow(every: 500ms, fn: mean, createEmpty: false)`,
	"memory": `from(bucket: "monitoring")
  |> range(start: -$1)
  |> filter(fn: (r) => r["_measurement"] == "mem")
  |> filter(fn: (r) => r["_field"] == "$2")
  |> filter(fn: (r) => r["cluter"] == "$3")
  |> aggregateWindow(every: 500ms, fn: mean, createEmpty: false)`,
	"disk": `from(bucket: "monitoring")
  |> range(start: -$1)
  |> filter(fn: (r) => r["_measurement"] == "disk")
  |> filter(fn: (r) => r["_field"] == "$2")
  |> filter(fn: (r) => r["cluter"] == "$3")
//   |> timeShift(duration: 9h)
  |> aggregateWindow(every: 500ms, fn: mean, createEmpty: false)`,
	"gpu": `from(bucket:"monitoring")
	|> range(start: -$1)
	|> filter(fn: (r) => r["_measurement"] == "nvidia_smi")
	|> filter(fn: (r) => r["_field"] == "$2") 
	|> filter(fn: (r) => r["cluter"] == "$3") 
	|> aggregateWindow(every: 500ms, fn: mean, createEmpty: false)`,
}

var realCpuMetric = map[string]string{
	"cpu_idle":    "usage_idle",
	"cpu_guest":   "usage_guest",
	"cpu_iowait":  "usage_iowait",
	"cpu_irq":     "usage_irq",
	"cpu_nice":    "usage_nice",
	"cpu_softirq": "usage_softirq",
	"cpu_steal":   "usage_steal",
	"cpu_system":  "usage_system",
	"cpu_user":    "usage_user",
}

var realMemMetric = map[string]string{
	"memory_total":             "total",
	"memory_active":            "active",
	"memory_available":         "available",
	"memory_available_percent": "available_percent",
	"memory_buffered":          "buffered",
	"memory_cached":            "cached",
	"memory_commit_limit":      "commit_limit",
	"memory_committed_as":      "committed_as",
	"memory_dirty":             "dirty",
	"memory_free":              "free",
	"memory_high_free":         "high_free",
	"memory_high_total":        "high_total",
	"memory_huge_page_size":    "huge_page_size",
	"memory_huge_page_free":    "huge_page_free",
	"memory_huge_page_total":   "huge_page_total",
	"memory_inactive":          "inactive",
	"memory_low_free":          "low_free",
	"memory_low_total":         "low_total",
	"memory_mapped":            "mapped",
	"memory_page_tables":       "page_tables",
	"memory_shared":            "shared",
	"memory_slab":              "slab",
	"memory_sreclaimable":      "sreclaimable",
	"memory_sunreclaim":        "sunreclaim",
	"memory_swap_cached":       "swap_cached",
	"memory_swap_free":         "swap_free",
	"memory_swap_total":        "swap_total",
	"memory_used":              "used",
	"memory_used_percent":      "used_percent",
	"memory_vmalloc_chunk":     "vmalloc_chunk",
	"memory_vmalloc_total":     "vmalloc_total",
	"memory_vmalloc_used":      "vmalloc_used",
	"memory_write_back":        "write_back",
	"memory_write_back_tmp":    "write_back_tmp",
}

var realDiskMetric = map[string]string{
	"disk_free":         "free",
	"disk_inodes_free":  "inodes_free",
	"disk_inodes_total": "inodes_total",
	"disk_inodes_used":  "inodes_used",
	"disk_total":        "total",
	"disk_used":         "used",
	"disk_used_percent": "used_percent",
}

var realGpuMetric = map[string]string{
	"gpu_clocks_graphics":               "clocks_current_graphics",
	"gpu_clocks_memory":                 "clocks_current_memory",
	"gpu_clocks_sm":                     "clocks_current_sm",
	"gpu_clocks_video":                  "clocks_current_video",
	"gpu_encoder_stats_average_fps":     "encoder_stats_average_fps",
	"gpu_encoder_stats_average_latency": "encoder_stats_average_latency",
	"gpu_encoder_stats_session_count":   "encoder_stats_session_count",
	"gpu_fan_speed":                     "fan_speed",
	"gpu_memory_total":                  "memory_total",
	"gpu_memory_free":                   "memory_free",
	"gpu_memory_used":                   "memory_used",
	"gpu_pcie_link_gen_current":         "pcie_link_gen_current",
	"gpu_pcie_link_width_current":       "pcie_link_width_current",
	"gpu_power_draw":                    "power_draw",
	"gpu_temperature":                   "temperature_gpu",
	"gpu_utilization_decoder":           "utilization_decoder",
	"gpu_utilization_encoder":           "utilization_encoder",
	"gpu_utilization_gpu":               "utilization_gpu",
	"gpu_utilization_memory":            "utilization_memory",
}

var allMetric = map[string]string{
	"cpu_idle":                          "usage_idle",
	"cpu_guest":                         "usage_guest",
	"cpu_iowait":                        "usage_iowait",
	"cpu_irq":                           "usage_irq",
	"cpu_nice":                          "usage_nice",
	"cpu_softirq":                       "usage_softirq",
	"cpu_steal":                         "usage_steal",
	"cpu_system":                        "usage_system",
	"cpu_user":                          "usage_user",
	"memory_total":                      "total",
	"memory_active":                     "active",
	"memory_available":                  "available",
	"memory_available_percent":          "available_percent",
	"memory_buffered":                   "buffered",
	"memory_cached":                     "cached",
	"memory_commit_limit":               "commit_limit",
	"memory_committed_as":               "committed_as",
	"memory_dirty":                      "dirty",
	"memory_free":                       "free",
	"memory_high_free":                  "high_free",
	"memory_high_total":                 "high_total",
	"memory_huge_page_size":             "huge_page_size",
	"memory_huge_page_free":             "huge_page_free",
	"memory_huge_page_total":            "huge_page_total",
	"memory_inactive":                   "inactive",
	"memory_low_free":                   "low_free",
	"memory_low_total":                  "low_total",
	"memory_mapped":                     "mapped",
	"memory_page_tables":                "page_tables",
	"memory_shared":                     "shared",
	"memory_slab":                       "slab",
	"memory_sreclaimable":               "sreclaimable",
	"memory_sunreclaim":                 "sunreclaim",
	"memory_swap_cached":                "swap_cached",
	"memory_swap_free":                  "swap_free",
	"memory_swap_total":                 "swap_total",
	"memory_used":                       "used",
	"memory_used_percent":               "used_percent",
	"memory_vmalloc_chunk":              "vmalloc_chunk",
	"memory_vmalloc_total":              "vmalloc_total",
	"memory_vmalloc_used":               "vmalloc_used",
	"memory_write_back":                 "write_back",
	"memory_write_back_tmp":             "write_back_tmp",
	"disk_free":                         "free",
	"disk_inodes_free":                  "inodes_free",
	"disk_inodes_total":                 "inodes_total",
	"disk_inodes_used":                  "inodes_used",
	"disk_total":                        "total",
	"disk_used":                         "used",
	"disk_used_percent":                 "used_percent",
	"gpu_clocks_graphics":               "clocks_current_graphics",
	"gpu_clocks_memory":                 "clocks_current_memory",
	"gpu_clocks_sm":                     "clocks_current_sm",
	"gpu_clocks_video":                  "clocks_current_video",
	"gpu_encoder_stats_average_fps":     "encoder_stats_average_fps",
	"gpu_encoder_stats_average_latency": "encoder_stats_average_latency",
	"gpu_encoder_stats_session_count":   "encoder_stats_session_count",
	"gpu_fan_speed":                     "fan_speed",
	"gpu_memory_total":                  "memory_total",
	"gpu_memory_free":                   "memory_free",
	"gpu_memory_used":                   "memory_used",
	"gpu_pcie_link_gen_current":         "pcie_link_gen_current",
	"gpu_pcie_link_width_current":       "pcie_link_width_current",
	"gpu_power_draw":                    "power_draw",
	"gpu_temperature":                   "temperature_gpu",
	"gpu_utilization_decoder":           "utilization_decoder",
	"gpu_utilization_encoder":           "utilization_encoder",
	"gpu_utilization_gpu":               "utilization_gpu",
	"gpu_utilization_memory":            "utilization_memory",
}

type InfluxDBModel struct {
	Metric map[string]string
	Values [][]string
}

func RealMetrics(c echo.Context) (err error) {

	kind := c.Param("kind")
	// fmt.Println(kind)

	//1. Parameter Validate
	if !realValidateParam(c) {
		return c.JSON(http.StatusBadRequest, echo.Map{
			"Error": "Bad Parameter",
		})
	}
	//3. Filter Validate
	if !realValidateFilter(kind, c) {
		return c.JSON(http.StatusBadRequest, echo.Map{
			"Error": "Bad Filter",
		})
	}
	//2. Metric Validate

	metric_filter := c.QueryParam("metric_filter")
	metrics := realMetricParsing(metric_filter)

	if !realValidateMetric(kind, metrics, c) {
		return c.JSON(http.StatusBadRequest, echo.Map{
			"Error": "Not Found Metric",
		})
	}

	//4. InfluxDB Query 요청 Teset

	if check := strings.Compare(kind, "") == 0; check {
		kind = findKind(metrics)
	}

	// fmt.Println(kind, "-kind check-")

	var result []interface{}
	for _, v := range metrics {
		switch kind {
		case "cpu":
			temp_filter := map[string]string{
				"cluster": c.QueryParam("cluster_filter"),
				"time":    c.QueryParam("time"),
			}
			data := realQueryMetric(v, realMetricExpr(realCpuMetric[v], realMetricTemplate[kind], temp_filter), kind)
			result = append(result, data)
		case "memory":
			temp_filter := map[string]string{
				"cluster": c.QueryParam("cluster_filter"),
				"time":    c.QueryParam("time"),
			}
			data := realQueryMetric(v, realMetricExpr(realMemMetric[v], realMetricTemplate[kind], temp_filter), kind)
			result = append(result, data)
		case "disk":
			temp_filter := map[string]string{
				"cluster": c.QueryParam("cluster_filter"),
				"time":    c.QueryParam("time"),
			}
			data := realQueryMetric(v, realMetricExpr(realDiskMetric[v], realMetricTemplate[kind], temp_filter), kind)
			result = append(result, data)
		case "gpu":
			temp_filter := map[string]string{
				"cluster": c.QueryParam("cluster_filter"),
				"time":    c.QueryParam("time"),
			}
			data := realQueryMetric(v, realMetricExpr(realGpuMetric[v], realMetricTemplate[kind], temp_filter), kind)
			result = append(result, data)
		default:
		}
	}

	return c.JSON(http.StatusOK, echo.Map{
		"result": result,
	})

}

func findKind(m []string) string {

	for _, v := range m {
		if realCpuMetric[v] != "" {
			return "cpu"
		}
		if realMemMetric[v] != "" {
			return "memory"
		}
		if realDiskMetric[v] != "" {
			return "disk"
		}
		if realGpuMetric[v] != "" {
			return "gpu"
		}
	}
	return ""
}

func rowModel(m string) (map[string]string, []string) {
	slice := strings.Split(m, ",")

	metricMap := map[string]string{}

	valueMap := []string{}
	sort.Strings(slice)
	for _, v := range slice {
		slice2 := strings.Split(v, ":")

		switch slice2[0] {
		case "_time":
			valueMap = append(valueMap, slice2[1]+":"+slice2[2]+":"+slice2[3])
		case "_value":
			valueMap = append(valueMap, slice2[1])
		case "_start":
			metricMap[slice2[0]] = slice2[1] + ":" + slice2[2] + ":" + slice2[3]
		case "_stop":
			metricMap[slice2[0]] = slice2[1] + ":" + slice2[2] + ":" + slice2[3]
		default:
			metricMap[slice2[0]] = slice2[1]
		}
	}

	return metricMap, valueMap
}

func realMetricParsing(m string) []string {
	slice := strings.Split(m, "|")
	var arrayMetric []string
	for _, v := range slice {
		if v != "" {
			arrayMetric = append(arrayMetric, v)
		}
	}

	return arrayMetric
}

func realValidateMetric(k string, m []string, c echo.Context) bool {

	switch k {
	case "cpu":
		for _, v := range m {
			if realCpuMetric[v] == "" {
				return false
			}
		}
	case "memory":
		for _, v := range m {
			if realMemMetric[v] == "" {
				return false
			}
		}
	case "disk":
		for _, v := range m {
			if realDiskMetric[v] == "" {
				return false
			}
		}
	case "":
		for _, v := range m {
			if allMetric[v] == "" {
				return false
			}
		}
	default:
		return false
	}

	return true
}

func realValidateFilter(k string, c echo.Context) bool {

	cluster := c.QueryParam("cluster_filter")
	if check := strings.Compare(cluster, "") == 0; check {
		return false
	}
	// db := db.DbManager()
	models := FindClusterDB(cluster)

	if models == nil {
		log.Println(cluster, "models Not find !")
		common.ErrorMsg(c, http.StatusNotFound, common.ErrNotFound)
		return false
	} else {
		log.Println("models find it !")
	}

	metric := c.QueryParam("metric_filter")
	if check := strings.Compare(metric, "") == 0; check {
		return false
	}

	return true
}

func realValidateParam(c echo.Context) bool {

	return !(c.QueryParam("time") == "")
}

func realQueryMetric(m string, q string, k string) map[string]interface{} {
	config.Init()
	client := influxdb2.NewClient(os.Getenv("INFLUXDB"), os.Getenv("INFLUX_TOKEN"))
	queryAPI := client.QueryAPI("influxdata")

	var valueResult []InfluxDBModel

	// fmt.Println(m,q,k)
	switch k {
	case "disk":
		result, err := queryAPI.Query(context.Background(), q)

		if err == nil {
			// Use Next() to iterate over query result lines
			var tempMetric map[string]string
			var tempValues [][]string
			var t InfluxDBModel
			var init [][]string

			prevHost := ""
			var prevMetric map[string]string
			var prevValues [][]string

			for result.Next() {
				var value []string
				tempMetric, value = rowModel(result.Record().String())
				tempValues = append(tempValues, value)
				// fmt.Println(tempMetric,"==disk test=")
				if prevHost != tempMetric["host"] {
					if prevHost != "" {
						t.Metric = prevMetric
						t.Values = prevValues
						valueResult = append(valueResult, t)
						tempValues = init
					}
				}
				prevHost = tempMetric["host"]
				prevMetric = tempMetric
				prevValues = tempValues
			}
			t.Metric = tempMetric
			t.Values = tempValues
			valueResult = append(valueResult, t)

			if result.Err() != nil {
				log.Printf("Query error: %s\n", result.Err().Error())
			}

		} else {
			log.Println(err)
		}
		// Ensures background processes finishes
		client.Close()
	case "gpu":
		result, err := queryAPI.Query(context.Background(), q)

		if err == nil {
			// Use Next() to iterate over query result lines
			var tempMetric map[string]string
			var tempValues [][]string
			var t InfluxDBModel
			var init [][]string

			prevHost := ""
			var prevMetric map[string]string
			var prevValues [][]string

			for result.Next() {
				var value []string
				tempMetric, value = rowModel(result.Record().String())
				tempValues = append(tempValues, value)
				// fmt.Println(tempMetric)
				if prevHost != tempMetric["uuid"] {
					if prevHost != "" {
						t.Metric = prevMetric
						t.Values = prevValues
						valueResult = append(valueResult, t)
						tempValues = init
					}
				}
				prevHost = tempMetric["uuid"]
				prevMetric = tempMetric
				prevValues = tempValues
			}
			t.Metric = tempMetric
			t.Values = tempValues
			valueResult = append(valueResult, t)

			if result.Err() != nil {
				log.Printf("Query error: %s\n", result.Err().Error())
			}

		}
		client.Close()
	default:
		result, err := queryAPI.Query(context.Background(), q)

		if err == nil {
			// Use Next() to iterate over query result lines
			var tempMetric map[string]string
			var tempValues [][]string
			var t InfluxDBModel
			var init [][]string

			prevHost := ""
			var prevMetric map[string]string
			var prevValues [][]string

			for result.Next() {
				// Observe when there is new grouping key producing new table
				// if result.TableChanged() {
				// 	fmt.Printf("table")
				// }
				var value []string
				tempMetric, value = rowModel(result.Record().String())
				tempValues = append(tempValues, value)
				if prevHost != tempMetric["host"] {
					if prevHost != "" {
						t.Metric = prevMetric
						t.Values = prevValues
						valueResult = append(valueResult, t)
						tempValues = init
					}
				}
				prevHost = tempMetric["host"]
				prevMetric = tempMetric
				prevValues = tempValues
			}
			t.Metric = tempMetric
			t.Values = tempValues
			valueResult = append(valueResult, t)

			if result.Err() != nil {
				log.Printf("Query error: %s\n", result.Err().Error())
			}

		}
		// Ensures background processes finishes
		client.Close()

	}

	r := map[string]interface{}{}
	r[m] = valueResult
	return r
}

func realMetricExpr(m string, val string, filter map[string]string) string {

	queryString := strings.Replace(val, "$1", filter["time"], -1)
	queryString = strings.Replace(queryString, "$2", m, -1)
	queryString = strings.Replace(queryString, "$3", filter["cluster"], -1)

	return queryString
}
