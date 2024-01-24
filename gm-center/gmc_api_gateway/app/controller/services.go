package controller

import (
	"errors"
	"gmc_api_gateway/app/common"
	"gmc_api_gateway/app/model"
	"net/http"

	"github.com/labstack/echo/v4"
)

// Get Service godoc
// @Summary Show detail Service
// @Description get Service Details
// @ApiImplicitParam
// @Accept  json
// @Produce  json
// @Security   Bearer
// @Param name path string true "name of the Service"
// @Param workspace query string true "name of the Workspace"
// @Param cluster query string true "name of the Cluster"
// @Param project query string true "name of the Project"
// @Success 200 {object} model.SERVICE
// @Router /services/{name} [get]
// @Tags Kubernetes
func GetService(c echo.Context) (err error) {
	params := model.PARAMS{
		Kind:      "services",
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
	if params.Cluster == "" || GetDB("cluster", params.Cluster, "clusterName") == nil {
		common.ErrorMsg(c, http.StatusNotFound, errors.New("Not Found Cluster"))
		return nil
	}
	if params.Project == "" {
		common.ErrorMsg(c, http.StatusNotFound, errors.New("Not Found Project"))
		return nil
	}
	getData, err := common.DataRequest(params)
	if err != nil || common.InterfaceToString(common.FindData(getData, "status", "")) == "Failure" {
		msg := common.ErrorMsg2(http.StatusNotFound, common.ErrNotFound)
		return c.JSON(http.StatusNotFound, echo.Map{
			"error": msg,
		})
	}

	// fmt.Println("[###########service]", getData)
	// fmt.Println("[###########ingress]", common.InterfaceToString(common.FindDataStr(getData, "status.loadBalancer.ingress.0", "ip")))
	service := model.SERVICE{
		Name:            common.InterfaceToString(common.FindData(getData, "metadata", "name")),
		Workspace:       params.Workspace,
		Cluster:         params.Cluster,
		Project:         params.Project,
		Type:            common.InterfaceToString(common.FindData(getData, "spec", "type")),
		ClusterIp:       common.InterfaceToString(common.FindData(getData, "spec", "clusterIP")),
		Selector:        common.FindData(getData, "spec", "selector"),
		Ports:           common.FindData(getData, "spec", "ports"),
		SessionAffinity: common.InterfaceToString(common.FindData(getData, "spec", "type")),
		Events:          getCallEvent(params),
		CreateAt:        common.InterfaceToTime(common.FindData(getData, "metadata", "creationTimestamp")),
		ExternalIp:      common.InterfaceToString(common.FindData(getData, "status.loadBalancer.ingress.0", "ip")),
		// UpdateAt:        common.InterfaceToTime(common.FindData(getData, "metadata.managedFields.#", "time")),
	}

	involvesData, _ := common.GetModelRelatedList(params) // Pods, Services
	// log.Printf("#####involvesData ", involvesData)

	return c.JSON(http.StatusOK, echo.Map{
		"data":         service,
		"involvesData": involvesData,
	})
}

// Get Service godoc
// @Summary Show List Service
// @Description get Service List
// @ApiImplicitParam
// @Accept  json
// @Produce  json
// @Security   Bearer
// @Param workspace query string true "name of the Workspace"
// @Param cluster query string true "name of the Cluster"
// @Param project query string true "name of the Project"
// @Success 200 {object} model.SERVICE
// @Router /services [get]
// @Tags Kubernetes
func GetServices(c echo.Context) (err error) {
	var services []model.SERVICE
	params := model.PARAMS{
		Kind:      "services",
		Name:      c.Param("name"),
		Cluster:   c.QueryParam("cluster"),
		Workspace: c.QueryParam("workspace"),
		User:      c.QueryParam("user"),
		Project:   c.QueryParam("project"),
		Method:    c.Request().Method,
		Body:      responseBody(c.Request().Body),
	}
	if params.Cluster != "" {
		if GetDB("cluster", params.Cluster, "clusterName") == nil {
			common.ErrorMsg(c, http.StatusNotFound, errors.New("Not Found Cluster"))
			return nil
		}
	}
	data, err := GetModelList(params)
	if err != nil {
		common.ErrorMsg(c, http.StatusNotFound, err)
		return nil
	}
	// fmt.Printf("#################dataerr : %s", data)
	for i, _ := range data {
		service := model.SERVICE{
			Name:       common.InterfaceToString(common.FindData(data[i], "metadata", "name")),
			Cluster:    common.InterfaceToString(common.FindData(data[i], "clusterName", "")),
			Project:    common.InterfaceToString(common.FindData(data[i], "metadata", "namespace")),
			Type:       common.InterfaceToString(common.FindData(data[i], "spec", "type")),
			ClusterIp:  common.InterfaceToString(common.FindData(data[i], "spec", "clusterIP")),
			Workspace:  common.InterfaceToString(common.FindData(data[i], "workspaceName", "")),
			User:       common.InterfaceToString(common.FindData(data[i], "userName", "")),
			Ports:      common.FindData(data[i], "spec", "ports"),
			ExternalIp: common.InterfaceToString(common.FindData(data[i], "status.loadBalancer.ingress.0", "ip")),
			CreateAt:   common.InterfaceToTime(common.FindData(data[i], "metadata", "creationTimestamp")),
		}
		if params.User != "" {
			userObj := FindMemberDB(params)
			if userObj.Name == "" {
				common.ErrorMsg(c, http.StatusNotFound, errors.New("Not Found User"))
				return
			}
			if params.User == service.User {
				services = append(services, service)
			}
		} else {
			services = append(services, service)
		}
	}
	return c.JSON(http.StatusOK, echo.Map{
		"data": services,
	})
}

// Create Service godoc
// @Summary Create Service
// @Description Create Service
// @Param json body string true "Service Info Body"
// @Param cluster query string true "cluster Name of the Service"
// @Param project query string true "project Name of the Service"
// @ApiImplicitParam(yaml = "appUserId", value = "service yaml", required = true)
// @Accept  json
// @Security Bearer
// @Produce  json
// @Success 200 {object} model.Error
// @Header 200 {string} Token "qwerty"
// @Router /services [post]
// @Tags Kubernetes
func CreateService(c echo.Context) (err error) {
	params := model.PARAMS{
		Kind:    "services",
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

// Delete Service godoc
// @Summary Delete Service
// @Description Delete Service
// @ApiImplicitParam
// @Accept  json
// @Produce  json
// @Security   Bearer
// @Param name path string true "name of the Service"
// @Param workspace query string true "name of the Workspace"
// @Param cluster query string true "name of the Cluster"
// @Param project query string true "name of the Project"
// @Success 200 {object} model.Error
// @Router /services/{name} [delete]
// @Tags Kubernetes
func DeleteService(c echo.Context) (err error) {
	params := model.PARAMS{
		Kind:    "services",
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
