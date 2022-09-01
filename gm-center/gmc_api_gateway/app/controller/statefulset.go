package controller

import (
	"fmt"
	"gmc_api_gateway/app/common"
	"gmc_api_gateway/app/model"
	"log"
	"net/http"

	"github.com/labstack/echo/v4"
)

func GetStatefulset(c echo.Context) (err error) {
	params := model.PARAMS{
		Kind:      "statefulsets",
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

	// fmt.Println("[###########ingress]", common.InterfaceToString(common.FindDataStr(getData, "status.loadBalancer.ingress.0", "ip")))
	statefulset := model.WORKLOAD{
		Name:      common.InterfaceToString(common.FindData(getData, "metadata", "name")),
		Namespace: common.InterfaceToString(common.FindData(getData, "metadata", "namespace")),
		// ClusterName:   common.InterfaceToString(common.FindData(getData, "clusterName", "")),
		CreateAt: common.InterfaceToTime(common.FindData(getData, "metadata", "creationTimestamp")),
		// UpdateAt:      common.InterfaceToTime(common.FindData(data[i], "status.conditions", "lastUpdateTime")),
		// Stauts:        c common.FindData(data[i], "status", ""),
		ClusterName:   params.Cluster,
		WorkspaceName: params.Workspace,
		// WorkspaceName: common.InterfaceToString(common.FindData(getData, "workspaceName", "")),
		// UpdateAt:        common.InterfaceToTime(common.FindData(getData, "metadata.managedFields.#", "time")),
	}
	statefulset_detail := model.STATEFULSET_DETAIL{
		WORKLOAD:        statefulset,
		Status:          common.FindData(getData, "status", ""),
		Containers:      common.FindData(getData, "spec.template.spec", "containers"),
		OwnerReferences: common.FindData(getData, "metadata", "ownerReferences"),
		Labels:          common.FindData(getData, "metadata", "labels"),
		Events:          getCallEvent(params),
		Annotation:      common.FindData(getData, "metadata", "annotations"),
		CreateAt:        common.InterfaceToTime(common.FindData(getData, "metadata", "creationTimestamp")),
	}

	involvesData, _ := common.GetModelRelatedList(params) // Pods, Deployments
	log.Printf("#####involvesData ", involvesData)

	return c.JSON(http.StatusOK, echo.Map{
		"data":         statefulset_detail,
		"involvesData": involvesData,
	})
}
func GetAllStatefulset(c echo.Context) (err error) {
	var daemonsets []model.WORKLOAD
	params := model.PARAMS{
		Kind:      "statefulsets",
		Name:      c.Param("name"),
		Cluster:   c.QueryParam("cluster"),
		Workspace: c.QueryParam("workspace"),
		Project:   c.QueryParam("project"),
		User:      c.QueryParam("user"),
		Method:    c.Request().Method,
		Body:      responseBody(c.Request().Body),
	}
	data := GetModelList(params)
	fmt.Printf("#################dataerr : %s", data)
	for i, _ := range data {
		var ReadyReplica string
		if common.InterfaceToString(common.FindData(data[i], "status", "readyReplicas")) != "" {
			ReadyReplica = common.InterfaceToString(common.FindData(data[i], "status", "readyReplicas"))
		} else {
			ReadyReplica = "0"
		}
		daemonset := model.WORKLOAD{
			Name:      common.InterfaceToString(common.FindData(data[i], "metadata", "name")),
			Namespace: common.InterfaceToString(common.FindData(data[i], "metadata", "namespace")),
			READY:     ReadyReplica + "/" + common.InterfaceToString(common.FindData(data[i], "spec", "replicas")),
			// Replica:       replicas,
			ClusterName: common.InterfaceToString(common.FindData(data[i], "clusterName", "")),
			CreateAt:    common.InterfaceToTime(common.FindData(data[i], "metadata", "creationTimestamp")),
			// UpdateAt:      common.InterfaceToTime(common.FindData(data[i], "status.conditions", "lastUpdateTime")),
			// Stauts:        common.FindData(data[i], "status", ""),
			WorkspaceName: common.InterfaceToString(common.FindData(data[i], "workspaceName", "")),
			UserName:      common.InterfaceToString(common.FindData(data[i], "userName", "")),
		}
		if params.User != "" {
			if params.User == daemonset.UserName {
				daemonsets = append(daemonsets, daemonset)
			}
		} else {
			daemonsets = append(daemonsets, daemonset)
		}
	}
	return c.JSON(http.StatusOK, echo.Map{
		"data": daemonsets,
	})
}

// func CreateDeployment(c echo.Context) (err error) {
// 	params := model.PARAMS{
// 		Kind:    "deployments",
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
// 		"info": common.StringToInterface(postData),
// 	})
// }

// func DeleteDeployment(c echo.Context) (err error) {
// 	params := model.PARAMS{
// 		Kind:    "deployments",
// 		Name:    c.Param("name"),
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
// 		"info": common.StringToInterface(postData),
// 	})
// }
