package api

import (
	"fmt"
	"gmc_api_gateway/app/common"
	"gmc_api_gateway/app/model"
	"log"
	"net/http"

	"github.com/labstack/echo/v4"
)

// GetCronjobs godoc
// @Summary Show detail cronjob
// @Description get cronjob Details
// @Accept  json
// @Produce  json
// @Success 200 {object} model.CRONJOB
// @Header 200 {string} Token "qwerty"
// @Router /cronjob/:name [get]
func GetCronJobs(c echo.Context) (err error) {

	params := model.PARAMS{
		Kind:      "cronjobs",
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
	containerData := common.FindData(getData, "spec.jobTemplate.spec.template.spec", "containers")
	var containerInfo []model.Containers
	common.Transcode(containerData, &containerInfo)

	activeData := common.FindData(getData, "status", "active")
	var activeInfo []model.Active
	common.Transcode(activeData, &activeInfo)

	involvesData, _ := common.GetModelRelatedList(params)
	log.Printf("#####referDataJob ", involvesData)

	cronjob := model.CRONJOB{
		Workspace: params.Workspace,
		Cluster:   params.Cluster,
		// Project:                    params.Project,
		Name:                       common.InterfaceToString(common.FindData(getData, "metadata", "name")),
		Namespace:                  common.InterfaceToString(common.FindData(getData, "metadata", "namespace")),
		Lable:                      common.FindData(getData, "metadata", "labels"),
		Annotations:                common.FindData(getData, "metadata", "annotations"),
		Schedule:                   common.InterfaceToString(common.FindData(getData, "spec", "schedule")),
		ConcurrencyPolicy:          common.InterfaceToString(common.FindData(getData, "spec", "concurrencyPolicy")),
		SuccessfulJobsHistoryLimit: common.StringToInt(common.InterfaceToString(common.FindData(getData, "spec", "successfulJobsHistoryLimit"))),
		FailedJobsHistoryLimit:     common.StringToInt(common.InterfaceToString(common.FindData(getData, "spec", "failedJobsHistoryLimits"))),
		LastScheduleTime:           common.InterfaceToTime(common.FindData(getData, "status", "lastScheduleTime")),
		CreationTimestamp:          common.InterfaceToTime(common.FindData(getData, "metadata", "creationTimestamp")),
		Containers:                 containerInfo,
		Active:                     activeInfo,
		Events:                     getCallEvent(params),
	}
	return c.JSON(http.StatusOK, echo.Map{
		"data":         cronjob,
		"involvesData": involvesData,
	})
}

// GetCronAllJobs godoc
// @Summary Show List cronjob
// @Description get cronjob List
// @Accept  json
// @Produce  json
// @Success 200 {object} model.CRONJOB
// @Header 200 {string} Token "qwerty"
// @Router /cronjobs [get]
func GetCronAllJobs(c echo.Context) error {
	var cronjobs []model.CRONJOB
	fmt.Printf("## cronjobs", cronjobs)
	params := model.PARAMS{
		Kind:      "cronjobs",
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

		cronjob := model.CRONJOB{
			Name:              common.InterfaceToString(common.FindData(data[i], "metadata", "name")),
			Namespace:         common.InterfaceToString(common.FindData(data[i], "metadata", "namespace")),
			Cluster:           common.InterfaceToString(common.FindData(data[i], "clusterName", "")),
			Schedule:          common.InterfaceToString(common.FindData(data[i], "spec", "schedule")),
			LastScheduleTime:  common.InterfaceToTime(common.FindData(data[i], "status", "lastScheduleTime")),
			CreationTimestamp: common.InterfaceToTime(common.FindData(data[i], "metadata", "creationTimestamp"))}
		cronjobs = append(cronjobs, cronjob)

	}

	return c.JSON(http.StatusOK, echo.Map{
		"data": cronjobs,
	})
}

func CreateCronJob(c echo.Context) (err error) {
	params := model.PARAMS{
		Kind:    "cronjobs",
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

func DeleteCronJob(c echo.Context) (err error) {
	params := model.PARAMS{
		Kind:    "cronjobs",
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
