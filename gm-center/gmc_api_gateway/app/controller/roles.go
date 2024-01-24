package controller

import (
	"gmc_api_gateway/app/common"
	"gmc_api_gateway/app/model"
	"net/http"

	"github.com/labstack/echo/v4"
)

// Get Role godoc
// @Summary Show detail Role
// @Description get Role Details
// @ApiImplicitParam
// @Accept  json
// @Produce  json
// @Security   Bearer
// @Param name path string true "name of the Role"
// @Param workspace query string true "name of the Workspace"
// @Param cluster query string true "name of the Cluster"
// @Param project query string true "name of the Project"
// @Success 200 {object} model.ROLE
// @Router /roles/{name} [get]
// @Tags Kubernetes
func GetRole(c echo.Context) (err error) {
	params := model.PARAMS{
		Kind:      "roles",
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
	role := model.ROLE{
		Name:        common.InterfaceToString(common.FindData(getData, "metadata", "name")),
		Project:     common.InterfaceToString(common.FindData(getData, "metadata", "namespace")),
		Lable:       common.FindData(getData, "metadata", "labels"),
		Annotations: common.FindData(getData, "metadata", "annotations"),
		Rules:       common.FindData(getData, "rules", ""),
		CreateAt:    common.InterfaceToTime(common.FindData(getData, "metadata", "creationTimestamp")),
	}

	// involvesData, _ := common.GetModelRelatedList(params)
	return c.JSON(http.StatusOK, echo.Map{
		"data": role,
		// "involvesData": "involvesData",
	})
}

// Get Role godoc
// @Summary Show List Role
// @Description get Role List
// @ApiImplicitParam
// @Accept  json
// @Produce  json
// @Security   Bearer
// @Param workspace query string false "name of the Workspace"
// @Param cluster query string false "name of the Cluster"
// @Param project query string false "name of the Project"
// @Success 200 {object} model.ROLE
// @Router /roles [get]
// @Tags Kubernetes
func GetRoles(c echo.Context) (err error) {
	var roles []model.ROLE
	params := model.PARAMS{
		Kind:      "roles",
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
		role := model.ROLE{
			Name:        common.InterfaceToString(common.FindData(data[i], "metadata", "name")),
			Project:     common.InterfaceToString(common.FindData(data[i], "metadata", "namespace")),
			Cluster:     common.InterfaceToString(common.FindData(data[i], "clusterName", "")),
			Workspace:   common.InterfaceToString(common.FindData(data[i], "clusterName", "")),
			UserName:    common.InterfaceToString(common.FindData(data[i], "clusterName", "")),
			Lable:       common.FindData(data[i], "metadata", "labels"),
			Annotations: common.FindData(data[i], "metadata", "annotations"),
			Rules:       common.FindData(data[i], "rules", ""),
			CreateAt:    common.InterfaceToTime(common.FindData(data[i], "metadata", "creationTimestamp")),
		}
		if params.User != "" {
			if params.User == role.UserName {
				roles = append(roles, role)
			}
		} else {
			roles = append(roles, role)
		}
	}

	return c.JSON(http.StatusOK, echo.Map{
		"data": roles,
	})
}

// Create Role godoc
// @Summary Create Role
// @Description Create Role
// @ApiImplicitParam
// @Accept  json
// @Produce  json
// @Security   Bearer
// @Param json body string true "Role Info Body"
// @Param cluster query string true "name of the Cluster"
// @Param workspace query string true "name of the Workspace"
// @Param project query string true "name of the Project"
// @Success 200 {object} model.Error
// @Router /roles [post]
// @Tags Kubernetes
func CreateRole(c echo.Context) (err error) {
	params := model.PARAMS{
		Kind:    "roles",
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

// Delete Role godoc
// @Summary Delete Role
// @Description Delete Role
// @ApiImplicitParam
// @Accept  json
// @Produce  json
// @Security   Bearer
// @Param name path string true "name of the Role"
// @Param workspace query string true "name of the Workspace"
// @Param cluster query string true "name of the Cluster"
// @Param project query string true "name of the Project"
// @Success 200 {object} model.Error
// @Router /roles/{name} [delete]
// @Tags Kubernetes
func DeleteRole(c echo.Context) (err error) {
	params := model.PARAMS{
		Kind:    "roles",
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
