package controller

import (
	"fmt"
	"gmc_api_gateway/app/common"
	"gmc_api_gateway/app/model"
	"log"
	"net/http"

	"github.com/labstack/echo/v4"
)

func GetConfigmap(c echo.Context) error {
	params := model.PARAMS{
		Kind:      "configmaps",
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
	fmt.Println("[##########configmap", getData)
	configmap := model.CONFIGMAP{
		Name:        common.InterfaceToString(common.FindData(getData, "metadata", "name")),
		NameSpace:   common.InterfaceToString(common.FindData(getData, "metadata", "namespace")),
		Data:        common.FindData(getData, "data", ""),
		DataCnt:     common.InterfaceOfLen(common.FindData(getData, "data", "")),
		Annotations: common.FindData(getData, "metadata", "annotations"),
		CreateAt:    common.InterfaceToTime(common.FindData(getData, "metadata", "creationTimestamp")),
		Cluster:     params.Cluster,
	}

	involvesData, _ := common.GetModelRelatedList(params)
	log.Printf("#####involvesData", involvesData)
	return c.JSON(http.StatusOK, echo.Map{
		"data": configmap,
		// "involvesData": "involvesData",
	})

}

func GetAllConfigmaps(c echo.Context) error {
	var configmaps []model.CONFIGMAP
	fmt.Printf("## Configmaps", configmaps)
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

	data := GetModelList(params)
	fmt.Printf("####Pod data confirm : %s", data)

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

	return c.JSON(http.StatusOK, echo.Map{
		"info": common.StringToInterface(postData),
	})
}
