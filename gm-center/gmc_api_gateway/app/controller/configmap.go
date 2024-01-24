package controller

import (
	"gmc_api_gateway/app/common"
	"gmc_api_gateway/app/model"
	"net/http"

	"github.com/labstack/echo/v4"
)

// Get Configmap godoc
// @Summary Show detail Configmap
// @Description get Configmap Details
// @ApiImplicitParam
// @Accept  json
// @Produce  json
// @Security   Bearer
// @Param name path string true "name of the Configmap"
// @Param workspace query string true "name of the Workspace"
// @Param cluster query string true "name of the Cluster"
// @Param project query string true "name of the Project"
// @Success 200 {object} model.CONFIGMAP
// @Router /configmaps/{name} [get]
// @Tags Kubernetes
func GetConfigmap(c echo.Context) (err error) {
	params := model.PARAMS{
		Kind:      "configmaps",
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

	configmap := model.CONFIGMAP{
		Name:        common.InterfaceToString(common.FindData(getData, "metadata", "name")),
		NameSpace:   common.InterfaceToString(common.FindData(getData, "metadata", "namespace")),
		Data:        common.FindData(getData, "data", ""),
		DataCnt:     common.InterfaceOfLen(common.FindData(getData, "data", "")),
		Annotations: common.FindData(getData, "metadata", "annotations"),
		CreateAt:    common.InterfaceToTime(common.FindData(getData, "metadata", "creationTimestamp")),
		Cluster:     params.Cluster,
	}

	// involvesData, _ := common.GetModelRelatedList(params)
	return c.JSON(http.StatusOK, echo.Map{
		"data": configmap,
		// "involvesData": "involvesData",
	})

}

// Get Configmap godoc
// @Summary Show List Configmap
// @Description get Configmap List
// @ApiImplicitParam
// @Accept  json
// @Produce  json
// @Security   Bearer
// @Param workspace query string false "name of the Workspace"
// @Param cluster query string false "name of the Cluster"
// @Param project query string false "name of the Project"
// @Success 200 {object} model.CONFIGMAP
// @Router /configmaps [get]
// @Tags Kubernetes
func GetAllConfigmaps(c echo.Context) (err error) {
	var configmaps []model.CONFIGMAP
	params := model.PARAMS{
		Kind:      "configmaps",
		Name:      c.Param("name"),
		Cluster:   c.QueryParam("cluster"),
		Workspace: c.QueryParam("workspace"),
		User:      c.QueryParam("user"),
		Project:   c.QueryParam("project"),
		Method:    c.Request().Method,
		Body:      responseBody(c.Request().Body),
	}
	// getData, err := common.DataRequest(params)
	// if err != nil {
	// 	common.ErrorMsg(c, http.StatusNotFound, err)
	// 	return nil
	// }
	err = CheckParam(params)
	if err != nil {
		common.ErrorMsg(c, http.StatusNotFound, err)
		return nil
	}
	data, err := GetModelList(params)
	if err != nil {
		common.ErrorMsg(c, http.StatusNotFound, err)
		return nil
	}

	for i, _ := range data {
		configmap := model.CONFIGMAP{
			Name:      common.InterfaceToString(common.FindData(data[i], "metadata", "name")),
			NameSpace: common.InterfaceToString(common.FindData(data[i], "metadata", "namespace")),
			DataCnt:   common.InterfaceOfLen(common.FindData(data[i], "data", "")),
			// Annotations: common.FindData(data[i], "metadata", "annotations"),
			CreateAt:  common.InterfaceToTime(common.FindData(data[i], "metadata", "creationTimestamp")),
			Cluster:   common.InterfaceToString(common.FindData(data[i], "clusterName", "")),
			Workspace: common.InterfaceToString(common.FindData(data[i], "workspaceName", "")),
			UserName:  common.InterfaceToString(common.FindData(data[i], "userName", "")),
		}
		if params.User != "" {
			if params.User == configmap.UserName {
				configmaps = append(configmaps, configmap)
			}
		} else {
			configmaps = append(configmaps, configmap)
		}
	}

	return c.JSON(http.StatusOK, echo.Map{
		"data": configmaps,
	})

}

// Create Configmap godoc
// @Summary Create Configmap
// @Description Create Configmap
// @ApiImplicitParam
// @Accept  json
// @Produce  json
// @Security   Bearer
// @Param json body string true "Configmap Info Body"
// @Param cluster query string true "name of the Cluster"
// @Param workspace query string true "name of the Workspace"
// @Param project query string true "name of the Project"
// @Success 200 {object} model.Error
// @Router /configmaps [post]
// @Tags Kubernetes
func CreateConfigmap(c echo.Context) (err error) {
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

// Delete Configmap godoc
// @Summary Delete Configmap
// @Description Delete Configmap
// @ApiImplicitParam
// @Accept  json
// @Produce  json
// @Security   Bearer
// @Param name path string true "name of the Configmap"
// @Param workspace query string true "name of the Workspace"
// @Param cluster query string true "name of the Cluster"
// @Param project query string true "name of the Project"
// @Success 200 {object} model.Error
// @Router /configmaps/{name} [delete]
// @Tags Kubernetes
func DeleteConfigmap(c echo.Context) (err error) {
	params := model.PARAMS{
		Kind:    "configmaps",
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
