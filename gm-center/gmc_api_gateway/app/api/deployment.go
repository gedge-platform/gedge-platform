package api

import (
	"fmt"
	"gmc_api_gateway/app/common"
	"gmc_api_gateway/app/model"
	"net/http"

	"github.com/labstack/echo/v4"
)

func GetDeployment(c echo.Context) (err error) {
	// var ServicePorts []model.PORT
	params := model.PARAMS{
		Kind:      "deployments",
		Name:      c.Param("name"),
		Cluster:   c.QueryParam("cluster"),
		Workspace: c.QueryParam("workspace"),
		Project:   c.QueryParam("project"),
		Method:    c.Request().Method,
		Body:      responseBody(c.Request().Body),
	}

	deploymentName := params.Name
	params.Name = params.Project
	project := GetDBProject(params)
	params.Name = deploymentName
	getData, err := common.DataRequest(params)
	if err != nil {
		common.ErrorMsg(c, http.StatusNotFound, err)
		return nil
	}
	getData0 := common.FindData(getData, "", "")
	var Deployment model.Deployment
	common.Transcode(getData0, &Deployment)
	replicas := model.REPLICA{
		Replicas:            common.StringToInt(common.InterfaceToString(common.FindData(getData, "status", "replicas"))),
		ReadyReplicas:       common.StringToInt(common.InterfaceToString(common.FindData(getData, "status", "readyReplicas"))),
		UpdatedReplicas:     common.StringToInt(common.InterfaceToString(common.FindData(getData, "status", "updatedReplicas"))),
		AvailableReplicas:   common.StringToInt(common.InterfaceToString(common.FindData(getData, "status", "availableReplicas"))),
		UnavailableReplicas: common.StringToInt(common.InterfaceToString(common.FindData(getData, "status", "unavailableReplicas"))),
	}

	deployment := model.DEPLOYMENT{
		Name:          common.InterfaceToString(common.FindData(getData, "metadata", "name")),
		WorkspaceName: project.WorkspaceName,
		ClusterName:   params.Cluster,
		Namespace:     params.Project,
		Label:         common.FindData(getData, "metadata", "labels"),
		Annotation:    common.FindData(getData, "metadata", "annotations"),
		CreateAt:      common.InterfaceToTime(common.FindData(getData, "metadata", "creationTimestamp")),
		UpdateAt:      common.InterfaceToTime(common.FindData(getData, "status.conditions", "lastUpdateTime")),
		Replica:       replicas,
		Stauts:        common.InterfaceToString(common.FindData(getData, "status.conditions", "status")),
		Strategy:      common.FindData(getData, "spec", "strategy"),
		Containers:    common.FindData(getData, "spec.template.spec", "containers"),
		Events:        getCallEvent(params),
	}
	involvesData, _ := common.GetModelRelatedList(params)
	// fmt.Printf("[####]data : %+v\n", testData)
	return c.JSON(http.StatusOK, echo.Map{
		"data":         deployment,
		"involvesData": involvesData,
	})
}
func GetDeployments(c echo.Context) (err error) {
	var deployments []model.DEPLOYMENT
	params := model.PARAMS{
		Kind:      "deployments",
		Name:      c.Param("name"),
		Cluster:   c.QueryParam("cluster"),
		Workspace: c.QueryParam("workspace"),
		Project:   c.QueryParam("project"),
		Method:    c.Request().Method,
		Body:      responseBody(c.Request().Body),
	}
	data := GetModelList(params)
	fmt.Printf("#################dataerr : %s", data)
	for i, _ := range data {
		replicas := model.REPLICA{
			Replicas:            common.StringToInt(common.InterfaceToString(common.FindData(data[i], "status", "replicas"))),
			ReadyReplicas:       common.StringToInt(common.InterfaceToString(common.FindData(data[i], "status", "readyReplicas"))),
			UpdatedReplicas:     common.StringToInt(common.InterfaceToString(common.FindData(data[i], "status", "updatedReplicas"))),
			AvailableReplicas:   common.StringToInt(common.InterfaceToString(common.FindData(data[i], "status", "availableReplicas"))),
			UnavailableReplicas: common.StringToInt(common.InterfaceToString(common.FindData(data[i], "status", "unavailableReplicas"))),
		}
		deployment := model.DEPLOYMENT{
			Name:          common.InterfaceToString(common.FindData(data[i], "metadata", "name")),
			Namespace:     common.InterfaceToString(common.FindData(data[i], "metadata", "namespace")),
			Replica:       replicas,
			ClusterName:   common.InterfaceToString(common.FindData(data[i], "clusterName", "")),
			CreateAt:      common.InterfaceToTime(common.FindData(data[i], "metadata", "creationTimestamp")),
			UpdateAt:      common.InterfaceToTime(common.FindData(data[i], "status.conditions", "lastUpdateTime")),
			Stauts:        common.InterfaceToString(common.FindData(data[i], "status.conditions", "status")),
			WorkspaceName: common.InterfaceToString(common.FindData(data[i], "workspaceName", "")),
		}
		deployments = append(deployments, deployment)
	}
	return c.JSON(http.StatusOK, echo.Map{
		"data": deployments,
	})
}

func CreateDeployment(c echo.Context) (err error) {
	params := model.PARAMS{
		Kind:    "deployments",
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

func DeleteDeployment(c echo.Context) (err error) {
	params := model.PARAMS{
		Kind:    "deployments",
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
