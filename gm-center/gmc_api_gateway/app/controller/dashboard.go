package controller

import (
	"context"
	"fmt"
	"gmc_api_gateway/app/common"
	"gmc_api_gateway/app/model"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"os"
	"sort"
	"time"

	"encoding/json"

	"github.com/labstack/echo/v4"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func TotalDashboard(c echo.Context) (err error) {
	clusters := GetClusterDB("cluster")
	ctx, _ := context.WithTimeout(context.Background(), time.Second*10)
	ClusterCount, err := clusters.CountDocuments(context.Background(), bson.D{})
	if err != nil {
		log.Fatal(err)
	}
	workspaces := GetClusterDB("workspace")
	workspaceCount, err := workspaces.CountDocuments(context.Background(), bson.D{})
	projects := GetClusterDB("project")
	projectCount, err := projects.CountDocuments(context.Background(), bson.D{})
	cursor, err := clusters.Find(context.TODO(), bson.D{{"clusterType", "core"}})
	if err != nil {
		log.Fatal(err)
	}

	var coreClouds []bson.M

	if err = cursor.All(ctx, &coreClouds); err != nil {
		log.Fatal(err)
	}
	cursor2, err := clusters.Find(context.TODO(), bson.D{{"clusterType", "edge"}})
	if err != nil {
		log.Fatal(err)
	}
	var edgeClouds []bson.M
	if err = cursor2.All(ctx, &edgeClouds); err != nil {
		log.Fatal(err)
	}

	Credentialparams := model.PARAMS{
		Kind:   "credential",
		Method: c.Request().Method,
	}

	CredentialgetData, err := common.DataRequest_spider(Credentialparams)

	var CredentialCount model.CredentialCount

	json.Unmarshal([]byte(CredentialgetData), &CredentialCount)

	dashbaordData := model.TOTAL_DASHBOARD{
		ClusterCnt:     ClusterCount,
		CoreClusterCnt: len(coreClouds),
		EdgeClusterCnt: len(edgeClouds),
		ProjectCnt:     projectCount,
		WorkspaceCnt:   workspaceCount,
		PodCpuTop5:     dashboard_pod_monit("all", "cluster", dashboardMetric["dashboard_cpu_used_podList"]),
		PodMemTop5:     dashboard_pod_monit("all", "cluster", dashboardMetric["dashboard_mem_used_podList"]),
		ClusterCpuTop5: dashboard_cluster_monit("all", dashboardMetric["dashboard_cpu_used_clusterList"]),
		ClusterMemTop5: dashboard_cluster_monit("all", clusterMetric["memory_usage"]),
		EdgeCloud:      edgeClouds,
		CredentialCnt:  len(CredentialCount.CredentialNames),
	}
	return c.JSON(http.StatusOK, echo.Map{
		"data": dashbaordData,
	})
}
func CloudDashboard(c echo.Context) (err error) {
	params := model.PARAMS{
		Kind:      "nodes",
		Name:      c.Param("name"),
		Cluster:   c.QueryParam("cluster"),
		Workspace: c.QueryParam("workspace"),
		User:      c.QueryParam("user"),
		Project:   c.QueryParam("project"),
		Method:    c.Request().Method,
		Body:      responseBody(c.Request().Body),
	}
	cluster := GetDB("cluster", params.Cluster, "clusterName")
	workspaces := GetDBList(params, "workspace", cluster["_id"].(primitive.ObjectID), "selectCluster")
	projects := GetDBList(params, "project", cluster["_id"].(primitive.ObjectID), "selectCluster")
	resourceCnt := resourceCntList(params.Cluster, "", params.Kind)
	resourceCnt["workspace_count"] = len(workspaces)
	resourceCnt["project_count"] = len(projects)

	// workspaceCnt := map[string]interface{}{
	// 	"workspace_count": len(workspaces),
	// }
	// projectCnt := map[string]interface{}{
	// 	"project_count": len(projects),
	// }
	// resourceCnt = append(resourceCnt, workspaceCnt)
	// resourceCnt = append(resourceCnt, projectCnt)
	// nodeStatus := node_status(params.Cluster)
	getData, err := common.DataRequest(params)
	if err != nil {
		common.ErrorMsg(c, http.StatusNotFound, err)
		return nil
	}
	Nodes, _ := common.FindDataLabelKey(getData, "items", "labels", "node-role.kubernetes.io/master")
	var NodeList []model.NODE
	for n, _ := range Nodes {
		Node := model.NODE{
			Name:                    common.InterfaceToString(common.FindData(Nodes[n], "metadata", "name")),
			NodeType:                common.InterfaceToString(common.FindData(Nodes[n], "nodeType", "")),
			CreateAt:                common.InterfaceToTime(common.FindData(Nodes[n], "metadata", "creationTimestamp")),
			Version:                 common.InterfaceToString(common.FindData(Nodes[n], "status.nodeInfo", "kubeletVersion")),
			IP:                      common.InterfaceToString(common.FindData(Nodes[n], "status", "addresses.0.address")),
			Os:                      common.InterfaceToString(common.FindData(Nodes[n], "status.nodeInfo", "operatingSystem")) + " / " + common.InterfaceToString(common.FindData(Nodes[n], "status.nodeInfo", "osImage")),
			ContainerRuntimeVersion: common.InterfaceToString(common.FindData(Nodes[n], "status.nodeInfo", "containerRuntimeVersion")),
		}
		NodeList = append(NodeList, Node)
	}
	// resourceCnt := resourceCnt(params.Cluster)

	dashbaordData := model.CLOUD_DASHBOARD{
		ClusterInfo: cluster,
		NodeRunning: node_status(params.Cluster),
		CpuUtil:     dashboard_cluster_monit(params.Cluster, clusterMetric["cpu_util"]),
		CpuUsage:    dashboard_cluster_monit(params.Cluster, clusterMetric["cpu_usage"]),
		CpuTotal:    dashboard_cluster_monit(params.Cluster, clusterMetric["cpu_total"]),
		MemoryTotal: dashboard_cluster_monit(params.Cluster, clusterMetric["memory_total"]),
		MemoryUsage: dashboard_cluster_monit(params.Cluster, clusterMetric["memory_usage"]),
		MemoryUtil:  dashboard_cluster_monit(params.Cluster, clusterMetric["memory_util"]),
		DiskTotal:   dashboard_cluster_monit(params.Cluster, clusterMetric["disk_total"]),
		DiskUsage:   dashboard_cluster_monit(params.Cluster, clusterMetric["disk_usage"]),
		DiskUtil:    dashboard_cluster_monit(params.Cluster, clusterMetric["disk_util"]),
		ResourceCnt: resourceCnt,
		NodeInfo:    NodeList,
	}
	return c.JSON(http.StatusOK, echo.Map{
		"data": dashbaordData,
	})
}

func SADashboard(c echo.Context) (err error) {
	params := model.PARAMS{
		Kind:      "namespaces",
		Name:      c.Param("name"),
		Cluster:   c.QueryParam("cluster"),
		Workspace: c.QueryParam("workspace"),
		User:      c.QueryParam("user"),
		Project:   c.QueryParam("project"),
		Method:    c.Request().Method,
		Body:      responseBody(c.Request().Body),
	}
	var podCpuList []map[string]interface{}
	var podMemList []map[string]interface{}
	var namespaceCpuList []map[string]interface{}
	var namespaceMemList []map[string]interface{}
	userObj := FindMemberDB(params).ObjectId
	workspaces := GetDBList(params, "workspace", userObj, "workspaceOwner")
	workspace := GetDBWorkspace(params)
	projects := GetDBList(params, "project", workspace.ObjectID, "workspace")
	fmt.Println("workspace : ", workspace)
	allProject := GetDBList(params, "project", userObj, "projectOwner")

	var resource model.Resource_cnt
	for _, project := range projects {
		projectName := common.InterfaceToString(project["projectName"])
		namespaceCpu := map[string]interface{}{
			"name":  projectName,
			"value": namespaceUsage(projectName, dashboardMetric["namespace_cpu"]),
		}
		namespaceMem := map[string]interface{}{
			"name":  projectName,
			"value": namespaceUsage(projectName, dashboardMetric["namespace_memory"]),
		}
		resource.DeploymentCount += resourceCnt(common.InterfaceToString(project["projectName"]), params.Kind, "deployment_count")
		resource.DaemonsetCount += resourceCnt(common.InterfaceToString(project["projectName"]), params.Kind, "daemonset_count")
		resource.StatefulsetCount += resourceCnt(common.InterfaceToString(project["projectName"]), params.Kind, "statefulset_count")
		resource.PodCount += resourceCnt(common.InterfaceToString(project["projectName"]), params.Kind, "pod_count")
		resource.ServiceCount += resourceCnt(common.InterfaceToString(project["projectName"]), params.Kind, "service_count")
		resource.CronjobCount += resourceCnt(common.InterfaceToString(project["projectName"]), params.Kind, "cronjob_count")
		resource.JobCount += resourceCnt(common.InterfaceToString(project["projectName"]), params.Kind, "job_count")
		resource.VolumeCount += resourceCnt(common.InterfaceToString(project["projectName"]), params.Kind, "pv_count")
		cpuList := dashboard_pod_monit(common.InterfaceToString(project["projectName"]), params.Kind, dashboardMetric["cpu_used_podList"])
		memoryList := dashboard_pod_monit(common.InterfaceToString(project["projectName"]), params.Kind, podMetric["pod_memory"])
		podCpuList = append(podCpuList, cpuList...)
		podMemList = append(podMemList, memoryList...)
		namespaceCpuList = append(namespaceCpuList, namespaceCpu)
		namespaceMemList = append(namespaceMemList, namespaceMem)
	}
	resource.NamespaceCount = len(projects)
	sort.SliceStable(podCpuList, func(i, j int) bool {
		return common.InterfaceToFloat(podCpuList[i]["value"]) > common.InterfaceToFloat(podCpuList[j]["value"])
	})
	sort.SliceStable(podMemList, func(i, j int) bool {
		return common.InterfaceToFloat(podMemList[i]["value"]) > common.InterfaceToFloat(podMemList[j]["value"])
	})
	sort.SliceStable(namespaceCpuList, func(i, j int) bool {
		return common.InterfaceToFloat(namespaceCpuList[i]["value"]) > common.InterfaceToFloat(namespaceCpuList[j]["value"])
	})
	sort.SliceStable(namespaceMemList, func(i, j int) bool {
		return common.InterfaceToFloat(namespaceMemList[i]["value"]) > common.InterfaceToFloat(namespaceMemList[j]["value"])
	})
	dashboardData := model.SERVICE_DASHBOARD{
		ProjectList:    projects,
		WorkspaceCnt:   len(workspaces),
		ProjectCnt:     len(allProject),
		Resource:       resource,
		PodCpuTop5:     common.ListSlice(podCpuList, 5),
		PodMemTop5:     common.ListSlice(podMemList, 5),
		ProjectCpuTop5: common.ListSlice(namespaceCpuList, 5),
		ProjectMemTop5: common.ListSlice(namespaceMemList, 5),
	}
	return c.JSON(http.StatusOK, echo.Map{
		"data": dashboardData,
	})
}
func ResourceMonit(c echo.Context) (err error) {
	metric_filter := "pod_count|cronjob_count|job_count|service_count|daemonset_count|statefulset_count|deployment_count|pv_count"
	metrics := metricParsing(metric_filter)
	mericResult(c, "resource", metrics)

	return nil
}

func GeoCoder(add string) (result string) {

	key := os.Getenv("GEO_KEY")
	baseUrl := "http://api.vworld.kr/req/address?service=address&request=getcoord&version=2.0&crs=epsg:4326&refine=true&simple=true&format=json&type=road&errorFormat=json"

	adderss := url.QueryEscape(add)
	httpUrl := baseUrl + "&address=" + adderss + "&key=" + key
	method := "GET"

	client := &http.Client{}
	req, err := http.NewRequest(method, httpUrl, nil)
	if err != nil {
		fmt.Println(err)
		return
	}
	res, err := client.Do(req)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer res.Body.Close()

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		fmt.Println(err)
		return
	}
	body_str := string(body)
	return body_str
}
