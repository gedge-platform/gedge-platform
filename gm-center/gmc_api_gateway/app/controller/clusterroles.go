package controller

import (
	"fmt"
	"gmc_api_gateway/app/common"
	"gmc_api_gateway/app/model"
	"net/http"

	"github.com/labstack/echo/v4"
)

func GetClusterRole(c echo.Context) error {
	params := model.PARAMS{
		Kind:      "clusterroles",
		Name:      c.Param("name"),
		Cluster:   c.QueryParam("cluster"),
		Workspace: c.QueryParam("workspace"),
		Project:   c.QueryParam("project"),
		Method:    c.Request().Method,
		Body:      responseBody(c.Request().Body),
	}
	getData, err := common.DataRequest(params)
	if err != nil {
		common.ErrorMsg(c, http.StatusNotFound, err)
		return nil
	}
	fmt.Printf("####clusterroles data confirm : %s", getData)
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
	data := GetModelList(params)
	fmt.Printf("#################clusterroles : %s", data)
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
