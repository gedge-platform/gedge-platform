package controller

import (
	"fmt"
	"gmc_api_gateway/app/common"
	"gmc_api_gateway/app/model"
	"log"
	"net/http"

	"github.com/labstack/echo/v4"
)

func GetRole(c echo.Context) error {
	params := model.PARAMS{
		Kind:      "roles",
		Name:      c.Param("name"),
		Cluster:   c.QueryParam("cluster"),
		Workspace: c.QueryParam("workspace"),
		Project:   c.QueryParam("project"),
		Method:    c.Request().Method,
		Body:      responseBody(c.Request().Body),
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
	fmt.Printf("####roles data confirm : %s", getData)
	role := model.ROLE{
		Name:        common.InterfaceToString(common.FindData(getData, "metadata", "name")),
		Project:     common.InterfaceToString(common.FindData(getData, "metadata", "namespace")),
		Lable:       common.FindData(getData, "metadata", "labels"),
		Annotations: common.FindData(getData, "metadata", "annotations"),
		Rules:       common.FindData(getData, "rules", ""),
		CreateAt:    common.InterfaceToTime(common.FindData(getData, "metadata", "creationTimestamp")),
	}

	involvesData, _ := common.GetModelRelatedList(params)
	log.Printf("#####involvesData", involvesData)
	return c.JSON(http.StatusOK, echo.Map{
		"data": role,
		// "involvesData": "involvesData",
	})
}

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
	data := GetModelList(params)
	fmt.Printf("#################roles : %s", data)
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
