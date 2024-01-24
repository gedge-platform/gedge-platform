package controller

import (
	"gmc_api_gateway/app/common"
	"gmc_api_gateway/app/model"
	"net/http"

	"github.com/labstack/echo/v4"
)

// Get Statefulset godoc
// @Summary Show detail Statefulset
// @Description get Statefulset Details
// @ApiImplicitParam
// @Accept  json
// @Produce  json
// @Security   Bearer
// @Param name path string true "name of the Statefulset"
// @Param workspace query string true "name of the Workspace"
// @Param cluster query string true "name of the Cluster"
// @Param project query string true "name of the Project"
// @Success 200 {object} model.STATEFULSET_DETAIL
// @Router /statefulsets/{name} [get]
// @Tags Kubernetes
func GetStatefulset(c echo.Context) (err error) {
	params := model.PARAMS{
		Kind:      "statefulsets",
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

	statefulset := model.WORKLOAD{
		Name:      common.InterfaceToString(common.FindData(getData, "metadata", "name")),
		Namespace: common.InterfaceToString(common.FindData(getData, "metadata", "namespace")),
		// ClusterName:   common.InterfaceToString(common.FindData(getData, "clusterName", "")),
		CreateAt: common.InterfaceToTime(common.FindData(getData, "metadata", "creationTimestamp")),
		// UpdateAt:      common.InterfaceToTime(common.FindData(data[i], "status.conditions", "lastUpdateTime")),
		// Stauts:        c common.FindData(data[i], "status", ""),
		ClusterName:   params.Cluster,
		WorkspaceName: params.Workspace,
		// WorkspaceName: common.InterfaceToString(common.FindData(getData, "workspaceName", "")),
		// UpdateAt:        common.InterfaceToTime(common.FindData(getData, "metadata.managedFields.#", "time")),
	}
	statefulset_detail := model.STATEFULSET_DETAIL{
		WORKLOAD:        statefulset,
		Status:          common.FindData(getData, "status", ""),
		Containers:      common.FindData(getData, "spec.template.spec", "containers"),
		OwnerReferences: common.FindData(getData, "metadata", "ownerReferences"),
		Labels:          common.FindData(getData, "metadata", "labels"),
		Events:          getCallEvent(params),
		Annotation:      common.FindData(getData, "metadata", "annotations"),
		CreateAt:        common.InterfaceToTime(common.FindData(getData, "metadata", "creationTimestamp")),
	}

	involvesData, _ := common.GetModelRelatedList(params)

	return c.JSON(http.StatusOK, echo.Map{
		"data":         statefulset_detail,
		"involvesData": involvesData,
	})
}

// Get Statefulset godoc
// @Summary Show List Statefulset
// @Description get Statefulset List
// @ApiImplicitParam
// @Accept  json
// @Produce  json
// @Security   Bearer
// @Param workspace query string false "name of the Workspace"
// @Param cluster query string false "name of the Cluster"
// @Param project query string false "name of the Project"
// @Success 200 {object} model.WORKLOAD
// @Router /statefulsets [get]
// @Tags Kubernetes
func GetAllStatefulset(c echo.Context) (err error) {
	var daemonsets []model.WORKLOAD
	params := model.PARAMS{
		Kind:      "statefulsets",
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
		var ReadyReplica string
		if common.InterfaceToString(common.FindData(data[i], "status", "readyReplicas")) != "" {
			ReadyReplica = common.InterfaceToString(common.FindData(data[i], "status", "readyReplicas"))
		} else {
			ReadyReplica = "0"
		}
		daemonset := model.WORKLOAD{
			Name:      common.InterfaceToString(common.FindData(data[i], "metadata", "name")),
			Namespace: common.InterfaceToString(common.FindData(data[i], "metadata", "namespace")),
			READY:     ReadyReplica + "/" + common.InterfaceToString(common.FindData(data[i], "spec", "replicas")),
			// Replica:       replicas,
			ClusterName: common.InterfaceToString(common.FindData(data[i], "clusterName", "")),
			CreateAt:    common.InterfaceToTime(common.FindData(data[i], "metadata", "creationTimestamp")),
			// UpdateAt:      common.InterfaceToTime(common.FindData(data[i], "status.conditions", "lastUpdateTime")),
			// Stauts:        common.FindData(data[i], "status", ""),
			WorkspaceName: common.InterfaceToString(common.FindData(data[i], "workspaceName", "")),
			UserName:      common.InterfaceToString(common.FindData(data[i], "userName", "")),
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

// Create Statefulset godoc
// @Summary Create Statefulset
// @Description Create Statefulset
// @ApiImplicitParam
// @Accept  json
// @Produce  json
// @Security   Bearer
// @Param json body string true "Statefulset Info Body"
// @Param cluster query string true "name of the Cluster"
// @Param workspace query string true "name of the Workspace"
// @Param project query string true "name of the Project"
// @Success 200 {object} model.Error
// @Router /statefulsets [post]
// @Tags Kubernetes
func CreateStatefulset(c echo.Context) (err error) {
	params := model.PARAMS{
		Kind:    "statefulsets",
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

// Delete Statefulset godoc
// @Summary Delete Statefulset
// @Description Delete Statefulset
// @ApiImplicitParam
// @Accept  json
// @Produce  json
// @Security   Bearer
// @Param name path string true "name of the Statefulset"
// @Param workspace query string true "name of the Workspace"
// @Param cluster query string true "name of the Cluster"
// @Param project query string true "name of the Project"
// @Success 200 {object} model.Error
// @Router /statefulsets/{name} [delete]
// @Tags Kubernetes
func DeleteStatefulset(c echo.Context) (err error) {
	params := model.PARAMS{
		Kind:    "statefulsets",
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
