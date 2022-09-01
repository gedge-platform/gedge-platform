package controller

import (
	"fmt"
	"gmc_api_gateway/app/common"
	"gmc_api_gateway/app/model"
	"log"
	"net/http"

	"github.com/labstack/echo/v4"
)

func GetServiceaccount(c echo.Context) error {
	params := model.PARAMS{
		Kind:      "serviceaccounts",
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
	fmt.Println("[##########serviceaccount", getData)
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

	involvesData, _ := common.GetModelRelatedList(params)
	log.Printf("#####involvesData", involvesData)
	return c.JSON(http.StatusOK, echo.Map{
		"data": serviceaccount,
	})
}

func GetAllServiceaccounts(c echo.Context) error {
	var serviceaccounts []model.SERVICEACCOUNT
	fmt.Printf("## Serviceaccounts", serviceaccounts)
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

	data := GetModelList(params)
	fmt.Printf("####Pod data confirm : %s", data)

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
