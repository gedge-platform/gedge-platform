package controller

import (
	"gmc_api_gateway/app/common"
	"gmc_api_gateway/app/model"
	"net/http"

	"github.com/labstack/echo/v4"
)

// Get Daemonset godoc
// @Summary Show detail Daemonset
// @Description get Daemonset Details
// @ApiImplicitParam
// @Accept  json
// @Produce  json
// @Security   Bearer
// @Param name path string true "name of the Daemonset"
// @Param workspace query string true "name of the Workspace"
// @Param cluster query string true "name of the Cluster"
// @Param project query string true "name of the Project"
// @Success 200 {object} model.DAEMONSET_DETAIL
// @Router /daemonsets/{name} [get]
// @Tags Kubernetes
func GetDaemonset(c echo.Context) (err error) {
	params := model.PARAMS{
		Kind:      "daemonsets",
		Name:      c.Param("name"),
		Cluster:   c.QueryParam("cluster"),
		Workspace: c.QueryParam("workspace"),
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

	daemonset := model.WORKLOAD{
		Name:         common.InterfaceToString(common.FindData(getData, "metadata", "name")),
		Namespace:    common.InterfaceToString(common.FindData(getData, "metadata", "namespace")),
		NodeSelector: common.FindData(getData, "spec.template.spec", "nodeSelector"),
		// Replica:       replicas,
		ClusterName: params.Cluster,
		CreateAt:    common.InterfaceToTime(common.FindData(getData, "metadata", "creationTimestamp")),
		// UpdateAt:      common.InterfaceToTime(common.FindData(data[i], "status.conditions", "lastUpdateTime")),
		// Stauts:        common.FindData(getData, "status", ""),
		WorkspaceName: common.InterfaceToString(common.FindData(getData, "workspaceName", "")),
		// UpdateAt:        common.InterfaceToTime(common.FindData(getData, "metadata.managedFields.#", "time")),
	}
	daemonset_detail := model.DAEMONSET_DETAIL{
		WORKLOAD:   daemonset,
		Status:     common.FindData(getData, "status", ""),
		Strategy:   common.FindData(getData, "spec", "updateStrategy"),
		Containers: common.FindData(getData, "spec.template.spec", "containers"),
		Labels:     common.FindData(getData, "metadata", "labels"),
		Events:     getCallEvent(params),
		Annotation: common.FindData(getData, "metadata", "annotations"),
		CreateAt:   common.InterfaceToTime(common.FindData(getData, "metadata", "creationTimestamp")),
	}
	involvesData, _ := common.GetModelRelatedList(params) // Pods, Deployments
	// log.Printf("#####involvesData ", involvesData)

	return c.JSON(http.StatusOK, echo.Map{
		"data":         daemonset_detail,
		"involvesData": involvesData,
	})
}

// Get Daemonset godoc
// @Summary Show List Daemonset
// @Description get Daemonset List
// @ApiImplicitParam
// @Accept  json
// @Produce  json
// @Security   Bearer
// @Param workspace query string false "name of the Workspace"
// @Param cluster query string false "name of the Cluster"
// @Param project query string false "name of the Project"
// @Success 200 {object} model.WORKLOAD
// @Router /daemonsets [get]
// @Tags Kubernetes
func GetAllDaemonsets(c echo.Context) (err error) {
	var daemonsets []model.WORKLOAD
	params := model.PARAMS{
		Kind:      "daemonsets",
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
	for i, _ := range data {
		daemonset := model.WORKLOAD{
			Name:         common.InterfaceToString(common.FindData(data[i], "metadata", "name")),
			Namespace:    common.InterfaceToString(common.FindData(data[i], "metadata", "namespace")),
			NodeSelector: common.FindData(data[i], "spec.template.spec", "nodeSelector"), // Replica:       replicas,
			ClusterName:  common.InterfaceToString(common.FindData(data[i], "clusterName", "")),
			UserName:     common.InterfaceToString(common.FindData(data[i], "userName", "")),

			CreateAt: common.InterfaceToTime(common.FindData(data[i], "metadata", "creationTimestamp")),
			// UpdateAt:      common.InterfaceToTime(common.FindData(data[i], "status.conditions", "lastUpdateTime")),
			// Stauts:        common.FindData(data[i], "status", ""),
			WorkspaceName: common.InterfaceToString(common.FindData(data[i], "workspaceName", "")),
		}
		if params.User != "" {
			if params.User == daemonset.UserName {
				daemonsets = append(daemonsets, daemonset)
			}
		} else {
			daemonsets = append(daemonsets, daemonset)
		}
	}
	return c.JSON(http.StatusOK, echo.Map{
		"data": daemonsets,
	})
}

// Create Daemonset godoc
// @Summary Create Daemonset
// @Description Create Daemonset
// @ApiImplicitParam
// @Accept  json
// @Produce  json
// @Security   Bearer
// @Param json body string true "Daemonset Info Body"
// @Param cluster query string true "name of the Cluster"
// @Param workspace query string true "name of the Workspace"
// @Param project query string true "name of the Project"
// @Success 200 {object} model.Error
// @Router /daemonsets [post]
// @Tags Kubernetes
func CreateDaemonset(c echo.Context) (err error) {
	params := model.PARAMS{
		Kind:    "daemonsets",
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

// Delete Daemonset godoc
// @Summary Delete Daemonset
// @Description Delete Daemonset
// @ApiImplicitParam
// @Accept  json
// @Produce  json
// @Security   Bearer
// @Param name path string true "name of the Daemonset"
// @Param workspace query string true "name of the Workspace"
// @Param cluster query string true "name of the Cluster"
// @Param project query string true "name of the Project"
// @Success 200 {object} model.Error
// @Router /daemonsets/{name} [delete]
// @Tags Kubernetes
func DeleteDaemonset(c echo.Context) (err error) {
	params := model.PARAMS{
		Kind:    "daemonsets",
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
