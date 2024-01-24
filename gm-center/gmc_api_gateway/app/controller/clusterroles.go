package controller

import (
	"gmc_api_gateway/app/common"
	"gmc_api_gateway/app/model"
	"net/http"

	"github.com/labstack/echo/v4"
)

// Get Clusterroles godoc
// @Summary Show detail Clusterroles
// @Description get Clusterroles Details
// @ApiImplicitParam
// @Accept  json
// @Produce  json
// @Security   Bearer
// @Param name path string true "name of the Clusterroles"
// @Param cluster query string true "name of the Cluster"
// @Param workspace query string true "name of the Workspace"
// @Success 200 {object} model.CLUSTERROLE
// @Router /clusterroles/{name} [get]
// @Tags Kubernetes
func GetClusterRole(c echo.Context) (err error) {
	params := model.PARAMS{
		Kind:      "clusterroles",
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
	if err != nil {
		common.ErrorMsg(c, http.StatusNotFound, err)
		return nil
	}
	clusterrole := model.CLUSTERROLE{
		Name:        common.InterfaceToString(common.FindData(getData, "metadata", "name")),
		Lable:       common.FindData(getData, "metadata", "labels"),
		Annotations: common.FindData(getData, "metadata", "annotations"),
		Rules:       common.FindData(getData, "rules", ""),
		CreateAt:    common.InterfaceToTime(common.FindData(getData, "metadata", "creationTimestamp")),
	}

	return c.JSON(http.StatusOK, echo.Map{
		"data": clusterrole,
	})
}

// GetClusterroles godoc
// @Summary Show List Clusterroles
// @Description get Clusterroles List
// @ApiImplicitParam
// @Accept  json
// @Produce  json
// @Security   Bearer
// @Param cluster query string false "name of the Cluster"
// @Param workspace query string false "name of the Workspace"
// @Success 200 {object} model.CLUSTERROLE
// @Router /clusterroles [get]
// @Tags Kubernetes
func GetClusterRoles(c echo.Context) (err error) {
	var clusterroles []model.CLUSTERROLE
	params := model.PARAMS{
		Kind:      "clusterroles",
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
		clusterrole := model.CLUSTERROLE{
			Name:        common.InterfaceToString(common.FindData(data[i], "metadata", "name")),
			Lable:       common.FindData(data[i], "metadata", "labels"),
			Annotations: common.FindData(data[i], "metadata", "annotations"),
			Rules:       common.FindData(data[i], "rules", ""),
			Cluster:     common.InterfaceToString(common.FindData(data[i], "clusterName", "")),
			Workspace:   common.InterfaceToString(common.FindData(data[i], "workspaceName", "")),
			UserName:    common.InterfaceToString(common.FindData(data[i], "userName", "")),
			CreateAt:    common.InterfaceToTime(common.FindData(data[i], "metadata", "creationTimestamp")),
		}
		if params.User != "" {
			if params.User == clusterrole.UserName {
				clusterroles = append(clusterroles, clusterrole)
			}
		} else {
			clusterroles = append(clusterroles, clusterrole)
		}
	}

	return c.JSON(http.StatusOK, echo.Map{
		"data": clusterroles,
	})
}

// Create Clusterrole godoc
// @Summary Create Clusterrole
// @Description Create Clusterrole
// @ApiImplicitParam
// @Accept  json
// @Produce  json
// @Security   Bearer
// @Param json body string true "Clusterrole Info Body"
// @Param cluster query string true "name of the Cluster"
// @Param workspace query string true "name of the Workspace"
// @Param project query string true "name of the Project"
// @Success 200 {object} model.Error
// @Router /clusterroles [post]
// @Tags Kubernetes
func CreateClusterrole(c echo.Context) (err error) {
	params := model.PARAMS{
		Kind:    "clusterroles",
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

// Delete Clusterrole godoc
// @Summary Delete Clusterrole
// @Description Delete Clusterrole
// @ApiImplicitParam
// @Accept  json
// @Produce  json
// @Security   Bearer
// @Param name path string true "name of the Clusterrole"
// @Param workspace query string true "name of the Workspace"
// @Param cluster query string true "name of the Cluster"
// @Param project query string true "name of the Project"
// @Success 200 {object} model.Error
// @Router /clusterroles/{name} [delete]
// @Tags Kubernetes
func DeleteClusterrole(c echo.Context) (err error) {
	params := model.PARAMS{
		Kind:    "clusterroles",
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
