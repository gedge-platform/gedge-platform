package api

import (
	"fmt"
	"gmc_api_gateway/app/common"
	"gmc_api_gateway/app/model"
	"log"
	"net/http"

	"github.com/labstack/echo/v4"
)

// GetJobs godoc
// @Summary Show detail job
// @Description get job Details
// @Accept  json
// @Produce  json
// @Success 200 {object} model.JOB
// @Header 200 {string} Token "qwerty"
// @Router /job/:name [get]
func GetJobs(c echo.Context) error {
	params := model.PARAMS{
		Kind:      "jobs",
		Name:      c.Param("name"),
		Cluster:   c.QueryParam("cluster"),
		Workspace: c.QueryParam("workspace"),
		Project:   c.QueryParam("project"),
		Method:    c.Request().Method,
		Body:      responseBody(c.Request().Body),
	}

	getData, err := common.DataRequest(params)
	if err != nil {
		common.ErrorMsg(c, http.StatusNotFound, err)
		return nil
	}
	containerData := common.FindData(getData, "spec.template.spec", "containers")
	var containerInfo []model.Containers
	common.Transcode(containerData, &containerInfo)

	conditionData := common.FindData(getData, "status", "conditions")
	var conditionInfo []model.Conditions
	common.Transcode(conditionData, &conditionInfo)

	ownerReferencesData := common.FindData(getData, "metadata", "ownerReferences")
	var ownerReferencesInfo []model.OwnerReference
	common.Transcode(ownerReferencesData, &ownerReferencesInfo)

	involvesData, _ := common.GetModelRelatedList(params)
	log.Printf("#####involvesData ", involvesData)

	jobinfos := model.JOB{
		Workspace: params.Workspace,
		Cluster:   params.Cluster,
		// Project:        params.Project,
		Name:           common.InterfaceToString(common.FindData(getData, "metadata", "name")),
		Namespace:      common.InterfaceToString(common.FindData(getData, "metadata", "namespace")),
		Lable:          common.FindData(getData, "metadata", "labels"),
		Annotations:    common.FindData(getData, "metadata", "annotations"),
		Kind:           common.InterfaceToString(common.FindData(getData, "kind", "")),
		OwnerReference: ownerReferencesInfo,
		BackoffLimit:   common.StringToInt(common.InterfaceToString(common.FindData(getData, "spec", "backoffLimit"))),
		Completions:    common.StringToInt(common.InterfaceToString(common.FindData(getData, "spec", "completions"))),
		Parallelism:    common.StringToInt(common.InterfaceToString(common.FindData(getData, "spe", "parallelism"))),
		Status:         common.StringToInt(common.InterfaceToString(common.FindData(getData, "status", "succeeded"))),
		CreationTime:   common.InterfaceToTime(common.FindData(getData, "metadata", "creationTimestamp")),
		StartTime:      common.InterfaceToTime(common.FindData(getData, "status", "startTime")),
		CompletionTime: common.InterfaceToTime(common.FindData(getData, "status", "completionTime")),
		Conditions:     conditionInfo,
		Containers:     containerInfo,
		Events:         getCallEvent(params),
	}

	return c.JSON(http.StatusOK, echo.Map{
		"data":     jobinfos,
		"involves": involvesData,
	})
}

// GetJobs godoc
// @Summary Show List job
// @Description get job List
// @Accept  json
// @Produce  json
// @Success 200 {object} model.JOB
// @Header 200 {string} Token "qwerty"
// @Router /jobs [get]
func GetAllJobs(c echo.Context) error {
	var jobs []model.JOB
	fmt.Printf("## jobs", jobs)
	params := model.PARAMS{
		Kind:      "jobs",
		Name:      c.Param("name"),
		Cluster:   c.QueryParam("cluster"),
		Workspace: c.QueryParam("workspace"),
		Project:   c.QueryParam("project"),
		Method:    c.Request().Method,
		Body:      responseBody(c.Request().Body),
	}
	data := GetModelList(params)
	fmt.Printf("####data confirm : %s", data)
	for i, _ := range data {

		job := model.JOB{
			Name:           common.InterfaceToString(common.FindData(data[i], "metadata", "name")),
			Namespace:      common.InterfaceToString(common.FindData(data[i], "metadata", "namespace")),
			Cluster:        common.InterfaceToString(common.FindData(data[i], "clusterName", "")),
			Status:         common.StringToInt(common.InterfaceToString(common.FindData(data[i], "status", "succeeded"))),
			CompletionTime: common.InterfaceToTime(common.FindData(data[i], "status", "completionTime")),
		}
		jobs = append(jobs, job)
	}

	return c.JSON(http.StatusOK, echo.Map{
		"data": jobs,
	})
}

func CreateJob(c echo.Context) (err error) {
	params := model.PARAMS{
		Kind:    "jobs",
		Cluster: c.QueryParam("cluster"),
		Project: c.QueryParam("project"),
		Method:  c.Request().Method,
		Body:    responseBody(c.Request().Body),
	}

	postData, err := common.DataRequest(params)
	if err != nil {
		common.ErrorMsg(c, http.StatusNotFound, err)
		return nil
	}

	return c.JSON(http.StatusOK, echo.Map{
		"info": common.StringToInterface(postData),
	})
}

func DeleteJob(c echo.Context) (err error) {
	params := model.PARAMS{
		Kind:    "jobs",
		Name:    c.Param("name"),
		Cluster: c.QueryParam("cluster"),
		Project: c.QueryParam("project"),
		Method:  c.Request().Method,
		Body:    responseBody(c.Request().Body),
	}

	postData, err := common.DataRequest(params)
	if err != nil {
		common.ErrorMsg(c, http.StatusNotFound, err)
		return nil
	}

	return c.JSON(http.StatusOK, echo.Map{
		"info": common.StringToInterface(postData),
	})
}
