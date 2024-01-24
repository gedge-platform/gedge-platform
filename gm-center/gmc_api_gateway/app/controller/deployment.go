package controller

import (
	"gmc_api_gateway/app/common"
	"gmc_api_gateway/app/model"
	"net/http"

	"github.com/labstack/echo/v4"
)

// Get Deployment godoc
// @Summary Show detail Deployment
// @Description get Deployment Details
// @ApiImplicitParam
// @Accept  json
// @Produce  json
// @Security   Bearer
// @Param name path string true "name of the Deployment"
// @Param workspace query string true "name of the Workspace"
// @Param cluster query string true "name of the Cluster"
// @Param project query string true "name of the Project"
// @Success 200 {object} model.DEPLOYMENT_DETAIL
// @Router /deployments/{name} [get]
// @Tags Kubernetes
func GetDeployment(c echo.Context) (err error) {
	// var ServicePorts []model.PORT
	params := model.PARAMS{
		Kind:      "deployments",
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

	if err != nil || common.InterfaceToString(common.FindData(getData, "status", "")) == "Failure" {
		msg := common.ErrorMsg2(http.StatusNotFound, common.ErrNotFound)
		return c.JSON(http.StatusNotFound, echo.Map{
			"error": msg,
		})
	}
	getData0 := common.FindData(getData, "", "")
	var Deployment model.Deployment
	common.Transcode(getData0, &Deployment)
	var ReadyReplica string
	if common.InterfaceToString(common.FindData(getData, "status", "readyReplicas")) != "" {
		ReadyReplica = common.InterfaceToString(common.FindData(getData, "status", "readyReplicas"))
	} else {
		ReadyReplica = "0"
	}
	replicas := model.REPLICA{
		Replicas:            common.StringToInt(common.InterfaceToString(common.FindData(getData, "status", "replicas"))),
		ReadyReplicas:       common.StringToInt(common.InterfaceToString(common.FindData(getData, "status", "readyReplicas"))),
		UpdatedReplicas:     common.StringToInt(common.InterfaceToString(common.FindData(getData, "status", "updatedReplicas"))),
		AvailableReplicas:   common.StringToInt(common.InterfaceToString(common.FindData(getData, "status", "availableReplicas"))),
		UnavailableReplicas: common.StringToInt(common.InterfaceToString(common.FindData(getData, "status", "unavailableReplicas"))),
	}
	deployment := model.WORKLOAD{
		Name: common.InterfaceToString(common.FindData(getData, "metadata", "name")),
		// WorkspaceName: project.WorkspaceName,
		ClusterName: params.Cluster,
		Namespace:   params.Project,
		READY:       ReadyReplica + "/" + common.InterfaceToString(common.FindData(getData, "spec", "replicas")),
		CreateAt:    common.InterfaceToTime(common.FindData(getData, "metadata", "creationTimestamp")),
	}
	deployment_detail := model.DEPLOYMENT_DETAIL{
		WORKLOAD:   deployment,
		Label:      common.FindData(getData, "metadata", "labels"),
		Annotation: common.FindData(getData, "metadata", "annotations"),
		UpdateAt:   common.InterfaceToTime(common.FindData(getData, "status.conditions", "lastUpdateTime")),
		Replica:    replicas,
		Strategy:   common.FindData(getData, "spec", "strategy"),
		Containers: common.FindData(getData, "spec.template.spec", "containers"),
		// Events:     getCallEvent(params),
	}
	involvesData, _ := common.GetModelRelatedList(params)
	// fmt.Printf("[####]data : %+v\n", testData)
	return c.JSON(http.StatusOK, echo.Map{
		"data":         deployment_detail,
		"involvesData": involvesData,
	})
}

// Get Deployment godoc
// @Summary Show List Deployment
// @Description get Deployment List
// @ApiImplicitParam
// @Accept  json
// @Produce  json
// @Security   Bearer
// @Param workspace query string false "name of the Workspace"
// @Param cluster query string false "name of the Cluster"
// @Param project query string false "name of the Project"
// @Success 200 {object} model.WORKLOAD
// @Router /deployments [get]
// @Tags Kubernetes
func GetDeployments(c echo.Context) (err error) {
	var deployments []model.WORKLOAD
	params := model.PARAMS{
		Kind:      "deployments",
		Name:      c.Param("name"),
		Cluster:   c.QueryParam("cluster"),
		Workspace: c.QueryParam("workspace"),
		Project:   c.QueryParam("project"),
		User:      c.QueryParam("user"),
		Method:    c.Request().Method,
		Body:      responseBody(c.Request().Body),
	}
	// msg := CheckParam(c, params)
	// if msg != nil {
	// 	common.ErrorMsg(c, http.StatusNotFound, msg)
	// 	return nil
	// }

	data, err := GetModelList(params)
	if err != nil {
		common.ErrorMsg(c, http.StatusNotFound, err)
		return nil
	}

	for i, _ := range data {
		var ReadyReplica string
		if common.InterfaceToString(common.FindData(data[i], "status", "readyReplicas")) != "" {
			ReadyReplica = common.InterfaceToString(common.FindData(data[i], "status", "readyReplicas"))
		} else {
			ReadyReplica = "0"
		}
		deployment := model.WORKLOAD{
			Name:          common.InterfaceToString(common.FindData(data[i], "metadata", "name")),
			Namespace:     common.InterfaceToString(common.FindData(data[i], "metadata", "namespace")),
			ClusterName:   common.InterfaceToString(common.FindData(data[i], "clusterName", "")),
			CreateAt:      common.InterfaceToTime(common.FindData(data[i], "metadata", "creationTimestamp")),
			READY:         ReadyReplica + "/" + common.InterfaceToString(common.FindData(data[i], "spec", "replicas")),
			WorkspaceName: common.InterfaceToString(common.FindData(data[i], "workspaceName", "")),
			UserName:      common.InterfaceToString(common.FindData(data[i], "userName", "")),
		}
		if params.User != "" {
			if params.User == deployment.UserName {
				deployments = append(deployments, deployment)
			}
		} else {
			deployments = append(deployments, deployment)
		}
	}
	return c.JSON(http.StatusOK, echo.Map{
		"data": deployments,
	})
}

// Create Deployment godoc
// @Summary Create Deployment
// @Description Create Deployment
// @ApiImplicitParam
// @Accept  json
// @Produce  json
// @Security   Bearer
// @Param json body string true "Deployment Info Body"
// @Param cluster query string true "name of the Cluster"
// @Param workspace query string true "name of the Workspace"
// @Param project query string true "name of the Project"
// @Success 200 {object} model.Error
// @Router /deployments [post]
// @Tags Kubernetes
func CreateDeployment(c echo.Context) (err error) {
	params := model.PARAMS{
		Kind:    "deployments",
		Cluster: c.QueryParam("cluster"),
		Project: c.QueryParam("project"),
		Method:  c.Request().Method,
		Body:    responseBody(c.Request().Body),
	}
	postData, err := common.DataRequest(params)
	if err != nil {
		// fmt.Println("err : ", err)
		common.ErrorMsg(c, http.StatusNotFound, err)
		return nil
	}

	return c.JSON(http.StatusCreated, echo.Map{
		"status": "Created",
		"code":   http.StatusCreated,
		"data":   postData,
	})
}

// Delete Deployment godoc
// @Summary Delete Deployment
// @Description Delete Deployment
// @ApiImplicitParam
// @Accept  json
// @Produce  json
// @Security   Bearer
// @Param name path string true "name of the Deployment"
// @Param workspace query string true "name of the Workspace"
// @Param cluster query string true "name of the Cluster"
// @Param project query string true "name of the Project"
// @Success 200 {object} model.Error
// @Router /deployments/{name} [delete]
// @Tags Kubernetes
func DeleteDeployment(c echo.Context) (err error) {
	params := model.PARAMS{
		Kind:    "deployments",
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
