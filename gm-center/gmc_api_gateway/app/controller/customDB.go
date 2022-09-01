package controller

import (
	"context"
	"fmt"
	"gmc_api_gateway/app/common"
	"gmc_api_gateway/app/model"
	"log"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/mitchellh/mapstructure"
	"github.com/tidwall/gjson"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func GetDBList(params model.PARAMS, collectionName string, obj primitive.ObjectID, search_type string) []bson.M {
	cdb := GetClusterDB(collectionName)
	ctx, _ := context.WithTimeout(context.Background(), time.Second*10)
	search_val := obj

	cursor, err := cdb.Find(context.TODO(), bson.D{{search_type, search_val}})
	if err != nil {
		log.Fatal(err)
	}
	var results []bson.M
	if err = cursor.All(ctx, &results); err != nil {
		log.Fatal(err)
	}

	return results

}

func GetDB(collectionName string, obj interface{}, search_type string) bson.M {
	cdb := GetClusterDB(collectionName)
	ctx, _ := context.WithTimeout(context.Background(), time.Second*10)
	search_val := obj
	var result bson.M
	if err := cdb.FindOne(ctx, bson.M{search_type: search_val}).Decode(&result); err != nil {
		return nil
	}
	return result

}

func DuplicateCheckDB(c echo.Context) (err error) {
	search_val := c.Param("name")
	// var models interface{}
	if c.QueryParam("type") == "cluster" {
		cdb := GetWorkspaceDB("cluster")
		ctx, _ := context.WithTimeout(context.Background(), time.Second*10)
		models := model.Cluster{}
		if err := cdb.FindOne(ctx, bson.M{"clusterName": search_val}).Decode(&models); err != nil {
			common.ErrorMsg(c, http.StatusOK, common.ErrDuplicatedCheckOK)
		} else {
			common.ErrorMsg(c, http.StatusBadRequest, common.ErrDuplicated)
		}
	} else if c.QueryParam("type") == "project" {
		models := model.Project{}
		cdb := GetWorkspaceDB("project")
		ctx, _ := context.WithTimeout(context.Background(), time.Second*10)
		if err := cdb.FindOne(ctx, bson.M{"projectName": search_val}).Decode(&models); err != nil {
			common.ErrorMsg(c, http.StatusOK, common.ErrDuplicatedCheckOK)
		} else {
			common.ErrorMsg(c, http.StatusBadRequest, common.ErrDuplicated)
		}
	} else if c.QueryParam("type") == "workspace" {
		models := model.Workspace{}
		cdb := GetWorkspaceDB("workspace")
		ctx, _ := context.WithTimeout(context.Background(), time.Second*10)
		if err := cdb.FindOne(ctx, bson.M{"workspaceName": search_val}).Decode(&models); err != nil {
			common.ErrorMsg(c, http.StatusOK, common.ErrDuplicatedCheckOK)
		} else {
			common.ErrorMsg(c, http.StatusBadRequest, common.ErrDuplicated)
		}
	} else if c.QueryParam("type") == "member" {
		models := model.Workspace{}
		cdb := GetWorkspaceDB("member")
		ctx, _ := context.WithTimeout(context.Background(), time.Second*10)
		if err := cdb.FindOne(ctx, bson.M{"memberName": search_val}).Decode(&models); err != nil {
			common.ErrorMsg(c, http.StatusOK, common.ErrDuplicatedCheckOK)
		} else {
			common.ErrorMsg(c, http.StatusBadRequest, common.ErrDuplicated)
		}
	} else {
		common.ErrorMsg(c, http.StatusBadRequest, common.ErrTypeNotFound)
	}
	return nil
}

func ListDB(collection string) []primitive.M {
	var showsProject []bson.M
	cdb := GetProjectDB(collection)

	ctx, _ := context.WithTimeout(context.Background(), time.Second*10)

	findOptions := options.Find()

	cur, err := cdb.Find(context.TODO(), bson.D{{}}, findOptions)
	if err != nil {
		log.Fatal(err)
	}
	if err = cur.All(ctx, &showsProject); err != nil {
		panic(err)
	}
	if err := cur.Err(); err != nil {
		log.Fatal(err)
	}

	cur.Close(context.TODO())

	return showsProject
}

func GetUserProjectResource(params model.PARAMS, clusters []model.Cluster) (model.Resource_cnt, model.Resource_usage, interface{}) {
	// params := model.PARAMS{
	// 	Kind:      "namespaces",
	// 	Name:      c.Param("name"),
	// 	Cluster:   c.QueryParam("cluster"),
	// 	Workspace: c.QueryParam("workspace"),
	// 	Project:   c.QueryParam("project"),
	// 	Method:    c.Request().Method,
	// 	Body:      responseBody(c.Request().Body),
	// }
	var resourceCnt model.Resource_cnt
	var resourceUsage model.Resource_usage
	var deployment_count int
	var daemonset_count int
	var Statefulset_count int
	var pod_count int
	var service_count int
	var cronjob_count int
	var job_count int
	var volume_count int
	var cpu_usage float64
	var memory_usage float64
	var List []model.EVENT
	// for k := range projects {

	// selectCluster := projects[k].SelectCluster
	// slice := strings.Split(selectCluster, ",")

	for _, cluster := range clusters {

		params.Cluster = cluster.Name
		// params.Name =
		// params.Project = params.Project
		deployment_count += ResourceCnt(params, "deployments")
		daemonset_count += ResourceCnt(params, "daemonsets")
		Statefulset_count += ResourceCnt(params, "Statefulsets")
		pod_count += ResourceCnt(params, "pods")
		service_count += ResourceCnt(params, "services")
		cronjob_count += ResourceCnt(params, "cronjobs")
		job_count += ResourceCnt(params, "jobs")
		volume_count += ResourceCnt(params, "persistentvolumeclaims")
		tempMetric := []string{"namespace_cpu", "namespace_memory"}
		// tempMetric := []string{"namespace_cpu"}
		result := &model.Resource_usage{}
		tempresult := NowMonit("namespace", params.Cluster, params.Name, tempMetric)
		if err := mapstructure.Decode(tempresult, &result); err != nil {
			fmt.Println(err)
		}
		cpu_usage += result.Namespace_cpu
		memory_usage += result.Namespace_memory
		events := getCallEvent(params)
		if len(events) > 0 {
			List = append(List, events...)
		}
		ResourceUsage := model.Resource_usage{
			Namespace_cpu:    common.ToFixed(cpu_usage, 3),
			Namespace_memory: common.ToFixed(memory_usage, 3),
		}
		ResourceCnt := model.Resource_cnt{
			DeploymentCount:  deployment_count,
			DaemonsetCount:   daemonset_count,
			StatefulsetCount: Statefulset_count,
			PodCount:         pod_count,
			ServiceCount:     service_count,
			CronjobCount:     cronjob_count,
			JobCount:         job_count,
			VolumeCount:      volume_count,
		}
		resourceCnt = ResourceCnt
		resourceUsage = ResourceUsage
	}

	// }
	// fmt.Printf("[###List] : %s", List)
	eventList := List
	return resourceCnt, resourceUsage, eventList
}

func ResourceCnt(params model.PARAMS, kind string) int {
	fmt.Printf("[###Params] : %+v", params)
	params.Kind = kind
	params.Project = params.Name
	params.Name = ""
	cnt := 0
	deployment_cnt := 0
	deployments, _ := common.DataRequest(params)
	// fmt.Printf("[###Data] : %+v", deployments)
	deployment := common.FindingArray(common.Finding(deployments, "items"))
	if kind == "pods" {
		for i, _ := range deployment {
			phase := gjson.Get(deployment[i].String(), "status.phase").String()
			if phase == "Running" {
				cnt++
			}
		}
		deployment_cnt = cnt
	} else {
		deployment_cnt = common.FindingLen2(deployment)
	}
	deployment_cnt = common.FindingLen2(deployment)
	return deployment_cnt
}
