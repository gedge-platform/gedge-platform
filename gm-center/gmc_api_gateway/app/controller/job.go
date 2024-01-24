package controller

import (
	"gmc_api_gateway/app/common"
	"gmc_api_gateway/app/model"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
)

// Get Job godoc
// @Summary Show detail Job
// @Description get Job Details
// @ApiImplicitParam
// @Accept  json
// @Produce  json
// @Security   Bearer
// @Param name path string true "name of the Job"
// @Param workspace query string true "name of the Workspace"
// @Param cluster query string true "name of the Cluster"
// @Param project query string true "name of the Project"
// @Success 200 {object} model.JOB_DETAIL
// @Router /jobs/{name} [get]
// @Tags Kubernetes
func GetJobs(c echo.Context) (err error) {
	params := model.PARAMS{
		Kind:      "jobs",
		Name:      c.Param("name"),
		Cluster:   c.QueryParam("cluster"),
		Workspace: c.QueryParam("workspace"),
		Project:   c.QueryParam("project"),
		User:      c.QueryParam("user"),
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
	// log.Printf("#####involvesData ", involvesData)

	var durationTime time.Duration

	var succeeded string
	if common.InterfaceToString(common.FindData(getData, "status", "succeeded")) != "" {
		succeeded = common.InterfaceToString(common.FindData(getData, "status", "succeeded"))
		durationTime = common.InterfaceToTime(common.FindData(getData, "status", "completionTime")).Sub(common.InterfaceToTime(common.FindData(getData, "status", "startTime")))
	} else {
		durationTime = time.Now().Sub(common.InterfaceToTime(common.FindData(getData, "status", "startTime")))
		succeeded = "0"
	}
	jobInfo := model.JOB{
		Name:         common.InterfaceToString(common.FindData(getData, "metadata", "name")),
		Namespace:    common.InterfaceToString(common.FindData(getData, "metadata", "namespace")),
		Workspace:    common.InterfaceToString(common.FindData(getData, "workspaceName", "")),
		Cluster:      common.InterfaceToString(common.FindData(getData, "clusterName", "")),
		Completions:  succeeded + "/" + common.InterfaceToString(common.FindData(getData, "spec", "completions")),
		Duration:     durationTime.Seconds(),
		CreationTime: common.InterfaceToTime(common.FindData(getData, "status", "completionTime")),
	}

	jobDetail := model.JOB_DETAIL{
		Lable:       common.FindData(getData, "metadata", "labels"),
		Annotations: common.FindData(getData, "metadata", "annotations"),
		// Kind:           common.InterfaceToString(common.FindData(getData, "kind", "")),
		BackoffLimit: common.StringToInt(common.InterfaceToString(common.FindData(getData, "spec", "backoffLimit"))),
		Parallelism:  common.StringToInt(common.InterfaceToString(common.FindData(getData, "spe", "parallelism"))),
		Status:       common.StringToInt(common.InterfaceToString(common.FindData(getData, "status", "succeeded"))),
		// CreationTime:   common.InterfaceToTime(common.FindData(getData, "metadata", "creationTimestamp")),
		StartTime:      common.InterfaceToTime(common.FindData(getData, "status", "startTime")),
		CompletionTime: common.InterfaceToTime(common.FindData(getData, "status", "completionTime")),
		Conditions:     conditionInfo,
		Containers:     common.FindData(getData, "spec.template.spec", "containers"),
		Events:         getCallEvent(params),
	}

	jobDetail.JOB = jobInfo

	return c.JSON(http.StatusOK, echo.Map{
		"data":     jobDetail,
		"involves": involvesData,
	})
}

// Get Job godoc
// @Summary Show List Job
// @Description get Job List
// @ApiImplicitParam
// @Accept  json
// @Produce  json
// @Security   Bearer
// @Param workspace query string false "name of the Workspace"
// @Param cluster query string false "name of the Cluster"
// @Param project query string false "name of the Project"
// @Success 200 {object} model.JOB
// @Router /jobs [get]
// @Tags Kubernetes
func GetAllJobs(c echo.Context) error {
	var jobs []model.JOB
	// fmt.Printf("## jobs", jobs)
	params := model.PARAMS{
		Kind:      "jobs",
		Name:      c.Param("name"),
		Cluster:   c.QueryParam("cluster"),
		Workspace: c.QueryParam("workspace"),
		Project:   c.QueryParam("project"),
		User:      c.QueryParam("user"),
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
		var durationTime time.Duration

		var succeeded string
		if common.InterfaceToString(common.FindData(data[i], "status", "succeeded")) != "" {
			succeeded = common.InterfaceToString(common.FindData(data[i], "status", "succeeded"))
			durationTime = common.InterfaceToTime(common.FindData(data[i], "status", "completionTime")).Sub(common.InterfaceToTime(common.FindData(data[i], "status", "startTime")))
		} else {
			durationTime = time.Now().Sub(common.InterfaceToTime(common.FindData(data[i], "status", "startTime")))
			succeeded = "0"
		}
		job := model.JOB{
			Name:        common.InterfaceToString(common.FindData(data[i], "metadata", "name")),
			Namespace:   common.InterfaceToString(common.FindData(data[i], "metadata", "namespace")),
			Workspace:   common.InterfaceToString(common.FindData(data[i], "workspaceName", "")),
			Cluster:     common.InterfaceToString(common.FindData(data[i], "clusterName", "")),
			UserName:    common.InterfaceToString(common.FindData(data[i], "userName", "")),
			Completions: succeeded + "/" + common.InterfaceToString(common.FindData(data[i], "spec", "completions")),
			Duration:    durationTime.Seconds(),
			// Status:         common.StringToInt(common.InterfaceToString(common.FindData(data[i], "status", "succeeded"))),
			CreationTime: common.InterfaceToTime(common.FindData(data[i], "status", "completionTime")),
		}
		if params.User != "" {
			if params.User == job.UserName {
				jobs = append(jobs, job)
			}
		} else {
			jobs = append(jobs, job)
		}
	}

	return c.JSON(http.StatusOK, echo.Map{
		"data": jobs,
	})
}

// Create Job godoc
// @Summary Create Job
// @Description Create Job
// @ApiImplicitParam
// @Accept  json
// @Produce  json
// @Security   Bearer
// @Param json body string true "Job Info Body"
// @Param cluster query string true "name of the Cluster"
// @Param workspace query string true "name of the Workspace"
// @Param project query string true "name of the Project"
// @Success 200 {object} model.Error
// @Router /jobs [post]
// @Tags Kubernetes
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

	return c.JSON(http.StatusCreated, echo.Map{
		"status": "Created",
		"code":   http.StatusCreated,
		"data":   postData,
	})
}

// Delete Job godoc
// @Summary Delete Job
// @Description Delete Job
// @ApiImplicitParam
// @Accept  json
// @Produce  json
// @Security   Bearer
// @Param name path string true "name of the Job"
// @Param workspace query string true "name of the Workspace"
// @Param cluster query string true "name of the Cluster"
// @Param project query string true "name of the Project"
// @Success 200 {object} model.Error
// @Router /jobs/{name} [delete]
// @Tags Kubernetes
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
		"status": "Deleted",
		"code":   http.StatusOK,
		"data":   postData,
	})
}
