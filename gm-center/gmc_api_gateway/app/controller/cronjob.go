package controller

import (
	"gmc_api_gateway/app/common"
	"gmc_api_gateway/app/model"
	"net/http"

	"github.com/labstack/echo/v4"
)

// Get Cronjob godoc
// @Summary Show detail Cronjob
// @Description get Cronjob Details
// @ApiImplicitParam
// @Accept  json
// @Produce  json
// @Security   Bearer
// @Param name path string true "name of the Cronjob"
// @Param workspace query string true "name of the Workspace"
// @Param cluster query string true "name of the Cluster"
// @Param project query string true "name of the Project"
// @Success 200 {object} model.CRONJOB
// @Router /cronjobs/{name} [get]
// @Tags Kubernetes
func GetCronJobs(c echo.Context) (err error) {

	params := model.PARAMS{
		Kind:      "cronjobs",
		Name:      c.Param("name"),
		Cluster:   c.QueryParam("cluster"),
		Workspace: c.QueryParam("workspace"),
		User:      c.QueryParam("user"),
		Project:   c.QueryParam("project"),
		Method:    c.Request().Method,
		Body:      responseBody(c.Request().Body),
	}
	err = CheckParam(params)
	if err != nil {
		common.ErrorMsg(c, http.StatusNotFound, err)
		return nil
	}

	getData, err := common.DataRequest(params)
	// if err != nil {
	// 	common.ErrorMsg(c, http.StatusNotFound, err)
	// 	return nil
	// }
	if err != nil || common.InterfaceToString(common.FindData(getData, "status", "")) == "Failure" {
		msg := common.ErrorMsg2(http.StatusNotFound, common.ErrNotFound)
		return c.JSON(http.StatusNotFound, echo.Map{
			"error": msg,
		})
	}
	containerData := common.FindData(getData, "spec.jobTemplate.spec.template.spec", "containers")
	var containerInfo []model.Containers
	common.Transcode(containerData, &containerInfo)

	activeData := common.FindData(getData, "status", "active")
	var activeInfo []model.Active
	common.Transcode(activeData, &activeInfo)

	involvesData, _ := common.GetModelRelatedList(params)

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

// Get Cronjob godoc
// @Summary Show List Cronjob
// @Description get Cronjob List
// @ApiImplicitParam
// @Accept  json
// @Produce  json
// @Security   Bearer
// @Param workspace query string false "name of the Workspace"
// @Param cluster query string false "name of the Cluster"
// @Param project query string false "name of the Project"
// @Success 200 {object} model.CRONJOB
// @Router /cronjobs [get]
// @Tags Kubernetes
func GetCronAllJobs(c echo.Context) error {
	var cronjobs []model.CRONJOB
	// fmt.Printf("## cronjobs", cronjobs)
	params := model.PARAMS{
		Kind:      "cronjobs",
		Name:      c.Param("name"),
		Cluster:   c.QueryParam("cluster"),
		Workspace: c.QueryParam("workspace"),
		User:      c.QueryParam("user"),
		Project:   c.QueryParam("project"),
		Method:    c.Request().Method,
		Body:      responseBody(c.Request().Body),
	}
	data, err := GetModelList(params)
	if err != nil {
		common.ErrorMsg(c, http.StatusNotFound, err)
		return nil
	}
	// fmt.Printf("####data confirm : %s", data)
	for i, _ := range data {

		cronjob := model.CRONJOB{
			Name:              common.InterfaceToString(common.FindData(data[i], "metadata", "name")),
			Namespace:         common.InterfaceToString(common.FindData(data[i], "metadata", "namespace")),
			Cluster:           common.InterfaceToString(common.FindData(data[i], "clusterName", "")),
			Workspace:         common.InterfaceToString(common.FindData(data[i], "workspaceName", "")),
			UserName:          common.InterfaceToString(common.FindData(data[i], "userName", "")),
			Schedule:          common.InterfaceToString(common.FindData(data[i], "spec", "schedule")),
			LastScheduleTime:  common.InterfaceToTime(common.FindData(data[i], "status", "lastScheduleTime")),
			CreationTimestamp: common.InterfaceToTime(common.FindData(data[i], "metadata", "creationTimestamp"))}
		if params.User != "" {
			if params.User == cronjob.UserName {
				cronjobs = append(cronjobs, cronjob)
			}
		} else {
			cronjobs = append(cronjobs, cronjob)
		}

	}

	return c.JSON(http.StatusOK, echo.Map{
		"data": cronjobs,
	})
}

// Create Cronjob godoc
// @Summary Create Cronjob
// @Description Create Cronjob
// @ApiImplicitParam
// @Accept  json
// @Produce  json
// @Security   Bearer
// @Param json body string true "Cronjob Info Body"
// @Param cluster query string true "name of the Cluster"
// @Param workspace query string true "name of the Workspace"
// @Param project query string true "name of the Project"
// @Success 200 {object} model.Error
// @Router /cronjobs [post]
// @Tags Kubernetes
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

	return c.JSON(http.StatusCreated, echo.Map{
		"status": "Created",
		"code":   http.StatusCreated,
		"data":   postData,
	})
}

// Delete Cronjob godoc
// @Summary Delete Cronjob
// @Description Delete Cronjob
// @ApiImplicitParam
// @Accept  json
// @Produce  json
// @Security   Bearer
// @Param name path string true "name of the Cronjob"
// @Param workspace query string true "name of the Workspace"
// @Param cluster query string true "name of the Cluster"
// @Param project query string true "name of the Project"
// @Success 200 {object} model.Error
// @Router /cronjobs/{name} [delete]
// @Tags Kubernetes
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
		"status": "Deleted",
		"code":   http.StatusOK,
		"data":   postData,
	})
}
