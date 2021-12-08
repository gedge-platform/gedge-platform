package api

import (
	"fmt"
	"gmc_api_gateway/app/common"
	"gmc_api_gateway/app/model"
	"log"
	"net/http"

	"github.com/labstack/echo/v4"
)

// GetPods godoc
// @Summary Show detail pods
// @Description get pods Details
// @Accept  json
// @Produce  json
// @Success 200 {object} model.POD
// @Header 200 {string} Token "qwerty"
// @Router /pod/:name [get]
func GetPods(c echo.Context) (err error) {
	params := model.PARAMS{
		Kind:      "pods",
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

	ownerReferencesData := common.FindData(getData, "metadata", "ownerReferences")
	var ownerReferencesInfo []model.OwnerReference
	common.Transcode(ownerReferencesData, &ownerReferencesInfo)

	podIPsData := common.FindData(getData, "status", "podIPs")
	var podIPsInfo []model.PodIPs
	common.Transcode(podIPsData, &podIPsInfo)

	containerStatusesData := common.FindData(getData, "status", "containerStatuses")
	var containerStatusesInfo []model.ContainerStatuses
	common.Transcode(containerStatusesData, &containerStatusesInfo)

	podcontainersData := common.FindData(getData, "spec", "containers")
	var podcontainersDataInfo []model.PODCONTAINERS
	common.Transcode(podcontainersData, &podcontainersDataInfo)

	StatusConditionsData := common.FindData(getData, "status", "conditions")
	var StatusConditionsInfo []model.StatusConditions
	common.Transcode(StatusConditionsData, &StatusConditionsInfo)

	// volumeMountsData := common.FindData(getData, "spec.containers", "volumeMounts")
	// var volumeMountsInfo []model.VolumeMounts
	// common.Transcode(volumeMountsData, &volumeMountsInfo)
	involvesData, _ := common.GetModelRelatedList(params)
	log.Printf("#####getdata99 ", involvesData)
	project := GetDBProject(params)
	pod := model.POD{
		Workspace: project.WorkspaceName,
		Cluster:   params.Cluster,

		// Project:           params.Project,
		Name:              common.InterfaceToString(common.FindData(getData, "metadata", "name")),
		Namespace:         common.InterfaceToString(common.FindData(getData, "metadata", "namespace")),
		CreationTimestamp: common.InterfaceToTime(common.FindData(getData, "metadata", "creationTimestamp")),
		NodeName:          common.InterfaceToString(common.FindData(getData, "spec", "nodeName")),
		Lable:             common.FindData(getData, "metadata", "labels"),
		Annotations:       common.FindData(getData, "metadata", "annotations"),
		QosClass:          common.InterfaceToString(common.FindData(getData, "status", "qosClass")),
		OwnerReference:    ownerReferencesInfo,
		StatusConditions:  StatusConditionsInfo,
		Status:            common.InterfaceToString(common.FindData(getData, "status", "phase")),
		HostIP:            common.InterfaceToString(common.FindData(getData, "status", "hostIP")),
		PodIP:             common.InterfaceToString(common.FindData(getData, "status", "podIP")),
		PodIPs:            podIPsInfo,
		ContainerStatuses: containerStatusesInfo,
		Podcontainers:     podcontainersDataInfo,
		// VolumeMounts:      volumeMountsInfo,
		Events: getCallEvent(params),
	}
	return c.JSON(http.StatusOK, echo.Map{
		"data":         pod,
		"involvesData": involvesData,
	})
}

// GetPods godoc
// @Summary Show List pods
// @Description get pods List
// @Accept  json
// @Produce  json
// @Success 200 {object} model.POD
// @Header 200 {string} Token "qwerty"
// @Router /pods [get]
func GetAllPods(c echo.Context) error {
	var pods []model.POD
	fmt.Printf("## pods", pods)
	params := model.PARAMS{
		Kind:      "pods",
		Name:      c.Param("name"),
		Cluster:   c.QueryParam("cluster"),
		Workspace: c.QueryParam("workspace"),
		Project:   c.QueryParam("project"),
		Method:    c.Request().Method,
		Body:      responseBody(c.Request().Body),
	}
	data := GetModelList(params)
	fmt.Printf("####Pod data confirm : %s", data)

	for i, _ := range data {

		pod := model.POD{
			Name:              common.InterfaceToString(common.FindData(data[i], "metadata", "name")),
			Namespace:         common.InterfaceToString(common.FindData(data[i], "metadata", "namespace")),
			Cluster:           common.InterfaceToString(common.FindData(data[i], "clusterName", "")),
			CreationTimestamp: common.InterfaceToTime(common.FindData(data[i], "metadata", "creationTimestamp")),
			Status:            common.InterfaceToString(common.FindData(data[i], "status", "phase")),
			NodeName:          common.InterfaceToString(common.FindData(data[i], "spec", "nodeName")),
			PodIP:             common.InterfaceToString(common.FindData(data[i], "status", "podIP")),
			HostIP:            common.InterfaceToString(common.FindData(data[i], "status", "hostIP")),
		}
		pods = append(pods, pod)
	}

	return c.JSON(http.StatusOK, echo.Map{
		"data": pods,
	})
}

func CreatePod(c echo.Context) (err error) {
	params := model.PARAMS{
		Kind:    "pods",
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

func DeletePod(c echo.Context) (err error) {
	params := model.PARAMS{
		Kind:    "pods",
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
		"info": common.StringToInterface(postData),
	})
}
