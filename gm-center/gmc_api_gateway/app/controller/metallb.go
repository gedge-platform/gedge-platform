package controller

import (
	"gmc_api_gateway/app/common"
	"gmc_api_gateway/app/model"
	"net/http"

	"github.com/labstack/echo/v4"
)

func GetMetallb(c echo.Context) error {
	params := model.PARAMS{
		Kind:      "metallb",
		Name:      c.Param("name"),
		Cluster:   c.QueryParam("cluster"),
		Workspace: c.QueryParam("workspace"),
		Project:   c.QueryParam("project"),
		Method:    c.Request().Method,
		Body:      responseBody(c.Request().Body),
	}
	var metallbDetail model.METALLB_DETAIL

	// data, err := common.DataRequest(params)
	// if err != nil {
	// 	common.ErrorMsg(c, http.StatusNotFound, err)
	// 	return nil
	// }
	data, err := GetModelList(params)
	if err != nil {
		common.ErrorMsg(c, http.StatusNotFound, err)
		return nil
	}
	// fmt.Printf("## data2", data2)
	// params.Name = "config"
	// params.Project = "metallb-system"
	for i, _ := range data {
		metallb := model.METALLB{
			Name:       common.InterfaceToString(common.FindData(data[i], "metadata", "name")),
			NameSpace:  common.InterfaceToString(common.FindData(data[i], "metadata", "namespace")),
			Addresses:  common.FindData(data[i], "spec", "addresses"),
			AutoAssign: common.FindData(data[i], "spec", "autoAssign"),
			// Annotations: common.FindData(data[i], "metadata", "annotations"),
			CreateAt: common.InterfaceToTime(common.FindData(data[i], "metadata", "creationTimestamp")),
			Cluster:  common.InterfaceToString(common.FindData(data[i], "clusterName", "")),
		}
		metallbDetail.METALLB = metallb
	}

	params2 := model.PARAMS{
		Kind:      "services",
		Name:      c.Param("name"),
		Cluster:   c.QueryParam("cluster"),
		Workspace: c.QueryParam("workspace"),
		User:      c.QueryParam("user"),
		Project:   c.QueryParam("project"),
		Method:    c.Request().Method,
		Body:      responseBody(c.Request().Body),
	}
	// serviceList, err := common.DataRequest(params2)

	// if err != nil {
	// 	common.ErrorMsg(c, http.StatusNotFound, err)
	// 	return nil
	// }
	var ServiceList []model.LoadBalancerService
	serviceList, err := GetModelList(params2)
	if err != nil {
		common.ErrorMsg(c, http.StatusNotFound, err)
		return nil
	}

	for _, service := range serviceList {
		if common.InterfaceToString(common.FindData(service, "spec", "type")) == "LoadBalancer" {
			Service := model.LoadBalancerService{
				Name:       common.InterfaceToString(common.FindData(service, "metadata", "name")),
				Workspace:  common.InterfaceToString(common.FindData(service, "workspaceName", "")),
				Cluster:    common.InterfaceToString(common.FindData(service, "clusterName", "")),
				Project:    common.InterfaceToString(common.FindData(service, "metadata", "namespace")),
				User:       common.InterfaceToString(common.FindData(service, "userName", "")),
				Type:       common.InterfaceToString(common.FindData(service, "spec", "type")),
				ClusterIp:  common.InterfaceToString(common.FindData(service, "spec", "clusterIP")),
				ExternalIp: common.FindData(service, "status", "loadBalancer"),
			}
			ServiceList = append(ServiceList, Service)
		}
	}

	metallbDetail.Service = ServiceList
	// justString := strings.Join(serviceList, "")
	// services, err := common.FindDataArrStr2(justString, "spec", "type", "LoadBalancer")
	// if err != nil {
	// 	return nil
	// }
	// fmt.Println("services : ", services)
	// FindDataArrStr2

	// for _, service := range serviceList {

	// }
	// data, err := common.DataRequest(params)
	// if err != nil {
	// 	common.ErrorMsg(c, http.StatusNotFound, err)
	// 	return nil
	// }	fmt.Printf("## serviceList", serviceList)
	return c.JSON(http.StatusOK, echo.Map{
		"data": metallbDetail,
		// "involvesData": "involvesData",
	})

}

func GetAllMetallb(c echo.Context) error {
	var metallbs []model.METALLB
	// fmt.Printf("## Configmaps", metallbs)

	params := model.PARAMS{
		Kind:      "metallb",
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
	// params.Name = "config"
	// params.Project = "metallb-system"
	data, err := GetModelList(params)
	if err != nil {
		common.ErrorMsg(c, http.StatusNotFound, err)
		return nil
	}

	for i, _ := range data {
		// IP := common.InterfaceToString(common.FindData(data[i], "spec", "addresses"))
		// fmt.Println("IP : ", IP)
		metallb := model.METALLB{
			Name:       common.InterfaceToString(common.FindData(data[i], "metadata", "name")),
			NameSpace:  common.InterfaceToString(common.FindData(data[i], "metadata", "namespace")),
			Addresses:  common.FindData(data[i], "spec", "addresses"),
			AutoAssign: common.FindData(data[i], "spec", "autoAssign"),
			// Annotations: common.FindData(data[i], "metadata", "annotations"),
			CreateAt: common.InterfaceToTime(common.FindData(data[i], "metadata", "creationTimestamp")),
			Cluster:  common.InterfaceToString(common.FindData(data[i], "clusterName", "")),
		}
		metallbs = append(metallbs, metallb)
	}
	// 	if params.User != "" {
	// 		if params.User == configmap.UserName {
	// 			configmaps = append(configmaps, configmap)
	// 		}
	// 	} else {
	// 		configmaps = append(configmaps, configmap)
	// 	}
	// }

	return c.JSON(http.StatusOK, echo.Map{
		"data": metallbs,
	})

}

// func CreateConfigmap(c echo.Context) (err error) {
// 	params := model.PARAMS{
// 		Kind:    "services",
// 		Cluster: c.QueryParam("cluster"),
// 		Project: c.QueryParam("project"),
// 		Method:  c.Request().Method,
// 		Body:    responseBody(c.Request().Body),
// 	}

// 	postData, err := common.DataRequest(params)
// 	if err != nil {
// 		common.ErrorMsg(c, http.StatusNotFound, err)
// 		return nil
// 	}

// 	return c.JSON(http.StatusOK, echo.Map{
// 				"status": http.StatusOK,
// "data":   postData,
// 	})
// }
