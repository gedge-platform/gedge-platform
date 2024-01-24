package controller

import (
	"gmc_api_gateway/app/common"
	"gmc_api_gateway/app/model"
	"net/http"

	"github.com/labstack/echo/v4"
)

// Get ServiceAccount godoc
// @Summary Show List ServiceAccount
// @Description get ServiceAccount List
// @ApiImplicitParam
// @Accept  json
// @Produce  json
// @Security   Bearer
// @Param workspace query string false "name of the Workspace"
// @Param cluster query string false "name of the Cluster"
// @Param project query string false "name of the Project"
// @Success 200 {object} model.SERVICEACCOUNT
// @Router /serviceaccounts [get]
// @Tags Kubernetes
func GetServiceaccount(c echo.Context) (err error) {
	params := model.PARAMS{
		Kind:      "serviceaccounts",
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
	serviceaccount := model.SERVICEACCOUNT{
		Name:        common.InterfaceToString(common.FindData(getData, "metadata", "name")),
		NameSpace:   common.InterfaceToString(common.FindData(getData, "metadata", "namespace")),
		Secrets:     common.FindData(getData, "secrets", ""),
		SecretCnt:   common.InterfaceOfLen(common.FindData(getData, "secrets", "")),
		Annotations: common.FindData(getData, "metadata", "annotations"),
		Label:       common.FindData(getData, "metadata", "labels"),
		CreateAt:    common.InterfaceToTime(common.FindData(getData, "metadata", "creationTimestamp")),
		Cluster:     params.Cluster,
	}

	return c.JSON(http.StatusOK, echo.Map{
		"data": serviceaccount,
	})
}

// Get ServiceAccount godoc
// @Summary Show detail ServiceAccount
// @Description get ServiceAccount Details
// @ApiImplicitParam
// @Accept  json
// @Produce  json
// @Security   Bearer
// @Param name path string true "name of the ServiceAccount"
// @Param workspace query string true "name of the Workspace"
// @Param cluster query string true "name of the Cluster"
// @Param project query string true "name of the Project"
// @Success 200 {object} model.SERVICEACCOUNT
// @Router /serviceaccounts/{name} [get]
// @Tags Kubernetes
func GetAllServiceaccounts(c echo.Context) error {
	var serviceaccounts []model.SERVICEACCOUNT

	params := model.PARAMS{
		Kind:      "serviceaccounts",
		Name:      c.Param("name"),
		Cluster:   c.QueryParam("cluster"),
		Workspace: c.QueryParam("workspace"),
		Project:   c.QueryParam("project"),
		User:      c.QueryParam("user"),
		Method:    c.Request().Method,
		Body:      responseBody(c.Request().Body),
	}
	// getData, err := common.DataRequest(params)
	// if err != nil {
	// 	common.ErrorMsg(c, http.StatusNotFound, err)
	// 	return nil
	// }

	data, err := GetModelList(params)
	if err != nil {
		common.ErrorMsg(c, http.StatusNotFound, err)
		return nil
	}
	for i, _ := range data {
		serviceaccount := model.SERVICEACCOUNT{
			Name:      common.InterfaceToString(common.FindData(data[i], "metadata", "name")),
			NameSpace: common.InterfaceToString(common.FindData(data[i], "metadata", "namespace")),
			// Secrets:     common.FindData(data[i], "secrets", ""),
			SecretCnt: common.InterfaceOfLen(common.FindData(data[i], "secrets", "")),
			// Annotations: common.FindData(data[i], "metadata", "annotations"),
			// Label:       common.FindData(data[i], "metadata", "labels"),
			CreateAt:  common.InterfaceToTime(common.FindData(data[i], "metadata", "creationTimestamp")),
			Cluster:   common.InterfaceToString(common.FindData(data[i], "clusterName", "")),
			Workspace: common.InterfaceToString(common.FindData(data[i], "workspaceName", "")),
			UserName:  common.InterfaceToString(common.FindData(data[i], "userName", "")),
		}
		if params.User != "" {
			if params.User == serviceaccount.UserName {
				serviceaccounts = append(serviceaccounts, serviceaccount)
			} else if params.User == "all" {
				serviceaccounts = append(serviceaccounts, serviceaccount)
			}
		} else {
			if serviceaccount.UserName == "" {
				serviceaccounts = append(serviceaccounts, serviceaccount)
			}
		}
	}

	return c.JSON(http.StatusOK, echo.Map{
		"data": serviceaccounts,
	})

}

// Create ServiceAccount godoc
// @Summary Create ServiceAccount
// @Description Create ServiceAccount
// @ApiImplicitParam
// @Accept  json
// @Produce  json
// @Security   Bearer
// @Param json body string true "ServiceAccount Info Body"
// @Param cluster query string true "name of the Cluster"
// @Param workspace query string true "name of the Workspace"
// @Param project query string true "name of the Project"
// @Success 200 {object} model.Error
// @Router /serviceaccounts [post]
// @Tags Kubernetes
func CreateServiceAccount(c echo.Context) (err error) {
	params := model.PARAMS{
		Kind:    "serviceaccounts",
		Cluster: c.QueryParam("cluster"),
		Project: c.QueryParam("project"),
		Method:  c.Request().Method,
		Body:    responseBody(c.Request().Body),
	}
	postData, err := common.DataRequest(params)
	if err != nil {
		common.ErrorMsg(c, http.StatusNotFound, err)
		return nil
	} else {
		return c.JSON(http.StatusCreated, echo.Map{
			"status": "Created",
			"code":   http.StatusCreated,
			"data":   postData,
		})
	}

}

// Delete ServiceAccount godoc
// @Summary Delete ServiceAccount
// @Description Delete ServiceAccount
// @ApiImplicitParam
// @Accept  json
// @Produce  json
// @Security   Bearer
// @Param name path string true "name of the ServiceAccount"
// @Param workspace query string true "name of the Workspace"
// @Param cluster query string true "name of the Cluster"
// @Param project query string true "name of the Project"
// @Success 200 {object} model.Error
// @Router /serviceaccounts/{name} [delete]
// @Tags Kubernetes
func DeleteServiceAccount(c echo.Context) (err error) {
	params := model.PARAMS{
		Kind:    "serviceaccounts",
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
