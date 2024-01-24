package controller

import (
	"gmc_api_gateway/app/common"
	"log"
	"net/http"

	"github.com/labstack/echo/v4"
)

// func CephAPI(path string, methodType string, token string) (result string) {
// 	url := os.Getenv("CEPH") + path
// 	method := methodType
// 	data := ""
// 	payload, _ := json.Marshal(data)
// 	payloadstr := strings.NewReader(string(payload))

// 	client := &http.Client{}
// 	req, err := http.NewRequest(method, url, payloadstr)
// 	req.Header.Add("Accept", "application/vnd.ceph.api.v1.0+json")
// 	req.Header.Add("Content-Type", "application/json")
// 	req.Header.Add("Authorization", "Bearer "+token)

// 	res, err := client.Do(req)
// 	if err != nil {
// 		fmt.Println(err)
// 		return
// 	}
// 	defer res.Body.Close()

// 	body, err := ioutil.ReadAll(res.Body)
// 	if err != nil {
// 		fmt.Println(err)
// 		return
// 	}
// 	if err != nil {
// 		fmt.Println(err)
// 		return
// 	}
// 	body_str := string(body)
// // 	return body_str
// }

// func GetCephAuthToken() (token string, err error) {
// 	url := os.Getenv("CEPH") + "api/auth"
// 	Id := os.Getenv("CEPH_ID")
// 	Pw := os.Getenv("CEPH_PW")
// 	method := "POST"
// 	data := make(map[string]interface{})
// 	data["username"] = Id
// 	data["password"] = Pw
// 	payload, _ := json.Marshal(data)
// 	payloadstr := strings.NewReader(string(payload))

// 	client := &http.Client{}
// 	req, err := http.NewRequest(method, url, payloadstr)
// 	req.Header.Add("Accept", "application/vnd.ceph.api.v1.0+json")
// 	req.Header.Add("Content-Type", "application/json")
// 	res, err := client.Do(req)
// 	if err != nil {
// 		fmt.Println(err)
// 		return "errer", err
// 	}
// 	defer res.Body.Close()

// 	body, err := ioutil.ReadAll(res.Body)
// 	if err != nil {
// 		fmt.Println(err)
// 		return "errer", err
// 	}

// 	if err != nil {
// 		fmt.Println(err)
// 		return "errer", err
// 	}

// 	body_str := string(body)
// 	temp := common.StringToMapInterface(body_str)
// 	result := temp["token"]
// 	return common.InterfaceToString(result), nil
// }

// // Get Ceph Health
// // @Summary Show Ceph volume Health
// // @Description get Ceph volume Health info
// // @Accept  json
// // @Produce  json
// // @Success 200 {object} model.CEPH
// // @Security Bearer
// // @Router /ceph/health [get]
// // @Tags Volume
// func GetCephHealth(c echo.Context) (err error) {
// 	fmt.Println("test")
// 	token, err := GetCephAuthToken()
// 	if err != nil || token == "errer" {
// 		msg := common.ErrorMsg2(http.StatusNotFound, common.ErrNotFound)
// 		return c.JSON(http.StatusNotFound, echo.Map{
// 			"error": msg,
// 		})
// 	}

// 	result := CephAPI("api/health/minimal", "GET", token)
// 	temp := common.StringToMapInterface(result)
// 	osds := common.Finding(result, "osd_map.osds")
// 	osd_arr := gjson.Parse(osds).Array()
// 	var In, Up, Total int64
// 	for _, osd := range osd_arr {
// 		In += osd.Get("in").Int()
// 		Up += osd.Get("up").Int()
// 		Total = In + Up
// 	}
// 	OSD := model.OSD{
// 		Total: Total,
// 		In:    In,
// 		Up:    Up}
// 	mon_status := common.FindData(result, "mon_status", "quorum")

// 	Monitor := model.Monitor{
// 		Total:  len(common.InterfaceToArray(mon_status)),
// 		Quorum: mon_status,
// 	}

// 	Capacity := model.Capacity{
// 		Total: common.InterfaceToFloat(common.FindData(result, "df.stats", "total_bytes")) / 1024 / 1024 / 1024,
// 		Used:  common.InterfaceToFloat(common.FindData(result, "df.stats", "total_used_raw_bytes")) / 1024 / 1024 / 1024,
// 		Avail: common.InterfaceToFloat(common.FindData(result, "df.stats", "total_avail_bytes")) / 1024 / 1024 / 1024,
// 	}
// 	total_obj := common.InterfaceToFloat(common.FindData(result, "pg_info.object_stats", "num_objects"))
// 	Object := model.Object{
// 		Degraded:  common.InterfaceToFloat(common.FindData(result, "pg_info.object_stats", "num_objects_degraded")),
// 		Misplaced: common.InterfaceToFloat(common.FindData(result, "pg_info.object_stats", "num_objects_misplaced")),
// 		Unfound:   common.InterfaceToFloat(common.FindData(result, "pg_info.object_stats", "num_objects_unfound")),
// 	}
// 	Object.Healthy = total_obj - Object.Degraded - Object.Misplaced - Object.Unfound
// 	ClientPerformance := model.ClientPerformance{
// 		Read_op_per_sec:  common.InterfaceToFloat(common.FindData(result, "client_perf", "read_op_per_sec")),
// 		Write_op_per_sec: common.InterfaceToFloat(common.FindData(result, "client_perf", "write_op_per_sec")),
// 		Read_bytes_sec:   common.InterfaceToFloat(common.FindData(result, "client_perf", "read_bytes_sec")),
// 		Write_bytes_sec:  common.InterfaceToFloat(common.FindData(result, "client_perf", "write_bytes_sec")),
// 	}
// 	ceph := model.CEPH{
// 		ClusterStatus:     common.InterfaceToString(common.FindData(result, "health", "status")),
// 		Hosts:             common.InterfaceToInt(temp["hosts"]),
// 		Pgs_per_osd:       common.InterfaceToFloat(common.FindData(result, "pg_info", "pgs_per_osd")),
// 		PoolNum:           common.InterfaceOfLen(common.FindData(result, "pools", "")),
// 		PGstatus:          (common.FindData(result, "pg_info", "statuses")),
// 		OSD:               OSD,
// 		Monitor:           Monitor,
// 		Capacity:          Capacity,
// 		Object:            Object,
// 		ClientPerformance: ClientPerformance,
// 	}

// 	return c.JSON(http.StatusOK, echo.Map{
// 		"data": ceph,
// 	})
// }

// Get Ceph Dashboard godoc
// @Summary Show Ceph Dashboard info
// @Description get Ceph Dashboard info
// @ApiImplicitParam
// @Accept  json
// @Produce  json
// @Security   Bearer
// @Success 200 {object} model.CEPH
// @Router /ceph/monit [get]
// @Tags Ceph
func CephDashboard(c echo.Context) (err error) {
	log.Println("test1")
	clusterNum := common.InterfaceToString(monitDashboard(cephMetric["clusterCount"]))
	healthCluster := common.InterfaceToString(monitDashboard(cephMetric["clusterHealth"]))

	ceph := map[string]interface{}{
		// "clusterStatus":                  strconv.Itoa(healthCluster) + "/" + strconv.Itoa(clusterNum),
		"clusterStatus":                  healthCluster + "/" + clusterNum,
		"ceph_objects_healthy":           monitDashboard(cephMetric["ceph_objects_healthy"]),
		"ceph_objects_degraded":          monitDashboard(cephMetric["ceph_objects_degraded"]),
		"ceph_objects_misplaced":         monitDashboard(cephMetric["ceph_objects_misplaced"]),
		"ceph_objects_unfound":           monitDashboard(cephMetric["ceph_objects_unfound"]),
		"ceph_mds_count":                 monitDashboard(cephMetric["ceph_mds_count"]),
		"ceph_osd_in":                    monitDashboard(cephMetric["ceph_osd_in"]),
		"ceph_osd_up":                    monitDashboard(cephMetric["ceph_osd_up"]),
		"ceph_osd_out":                   monitDashboard(cephMetric["ceph_osd_out"]),
		"ceph_osd_down":                  monitDashboard(cephMetric["ceph_osd_down"]),
		"ceph_pg_total":                  monitDashboard(cephMetric["ceph_pg_total"]),
		"ceph_pg_active":                 monitDashboard(cephMetric["ceph_pg_active"]),
		"ceph_pg_clean":                  monitDashboard(cephMetric["ceph_pg_clean"]),
		"ceph_pg_incomplete":             monitDashboard(cephMetric["ceph_pg_incomplete"]),
		"ceph_unclean_pgs":               monitDashboard(cephMetric["ceph_unclean_pgs"]),
		"ceph_mon_quorum_status":         monitDashboard(cephMetric["ceph_mon_quorum_status"]),
		"ceph_pool_num":                  monitDashboard(cephMetric["ceph_pool_num"]),
		"ceph_pg_per_osd":                monitDashboard(cephMetric["ceph_pg_per_osd"]),
		"cluster_avail_capacity":         monitDashboard(cephMetric["cluster_avail_capacity"]),
		"cluster_used_capacity":          monitDashboard(cephMetric["cluster_used_capacity"]),
		"ceph_cluster_total_bytes":       monitDashboard(cephMetric["ceph_cluster_total_bytes"]),
		"ceph_cluster_total_used_bytes":  monitDashboard(cephMetric["ceph_cluster_total_used_bytes"]),
		"overwrite_iops":                 monitDashboard(cephMetric["overwrite_iops"]),
		"write_iops":                     monitDashboard(cephMetric["write_iops"]),
		"read_iops":                      monitDashboard(cephMetric["read_iops"]),
		"write_throughput":               monitDashboard(cephMetric["write_throughput"]),
		"read_throughput":                monitDashboard(cephMetric["read_throughput"]),
		"ceph_cluster_total_avail_bytes": monitDashboard(cephMetric["ceph_cluster_total_avail_bytes"]),
		"osd_read_latency":               monitDashboard(cephMetric["osd_read_latency"]),
		"osd_write_latency":              monitDashboard(cephMetric["osd_write_latency"]),
	}

	return c.JSON(http.StatusOK, echo.Map{
		"data": ceph,
	})
}

func CephMonit(c echo.Context) (err error) {
	metric_filter := "write_iops|read_iops|write_throughput|overwrite_iops|read_throughput|osd_read_latency|osd_write_latency"
	metrics := metricParsing(metric_filter)
	mericResult(c, "ceph", metrics)

	return nil
}
