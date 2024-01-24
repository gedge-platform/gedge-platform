package controller

import (
	"encoding/json"
	"fmt"
	"gmc_api_gateway/app/common"
	"gmc_api_gateway/app/model"
	"log"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/tidwall/gjson"
)

func GetGpu(c echo.Context) (err error) {
	params := model.PARAMS{
		Kind:      "",
		Name:      c.Param("name"),
		Cluster:   c.QueryParam("cluster"),
		Workspace: c.QueryParam("workspace"),
		Project:   c.QueryParam("project"),
		Method:    c.Request().Method,
		Body:      responseBody(c.Request().Body),
	}
	params.Kind = "pods"
	PodList, err := GetModelList(params)
	if err != nil {
		log.Println(err)
	}
	params.Kind = "nodes"
	NodeList, err := GetModelList(params)
	if err != nil {
		log.Println(err)
	}
	var gNodeList []map[string]interface{}
	gNodeStatus := make(map[string]map[string]map[string]int)

	for _, pod := range PodList {
		nodeName := common.InterfaceToString(common.FindData(common.InterfaceToString(pod), "spec", "nodeName"))
		if _, ok := gNodeStatus[nodeName]; !ok {
			gNodeStatus[nodeName] = make(map[string]map[string]int)
			gNodeStatus[nodeName]["requests"] = make(map[string]int)
			gNodeStatus[nodeName]["limits"] = make(map[string]int)
		}
		// containers := common.FindData(pod, "spec", "containers")
		containers := common.FindingArray(common.Finding(pod, "spec.containers"))
		for _, container := range containers {
			limitsData := gjson.Get(container.String(), "resources.limits")
			requestsData := gjson.Get(container.String(), "resources.requests")
			var limitsDataMap map[string]interface{}
			var requestsDataMap map[string]interface{}
			if limitsData.Exists() {
				err := json.Unmarshal([]byte(limitsData.String()), &limitsDataMap)
				if err != nil {
					fmt.Println("Error:", err)
				} else if limitsDataMap["nvidia.com/gpu"] != nil {
					gNodeStatus[nodeName]["limits"]["nvidia.com/gpu"] += common.InterfaceToInt(limitsDataMap["nvidia.com/gpu"])
				}
			}
			if requestsData.Exists() {
				err = json.Unmarshal([]byte(requestsData.String()), &requestsDataMap)
				if err != nil {
					fmt.Println("Error:", err)
				} else if requestsDataMap["nvidia.com/gpu"] != nil {
					gNodeStatus[nodeName]["requests"]["nvidia.com/gpu"] += common.InterfaceToInt(requestsDataMap["nvidia.com/gpu"])
				}
			}
		}
	}

	for _, node := range NodeList {
		gNode := make(map[string]interface{})
		// gNodeStatus := make(map[string]map[string]map[string]int)
		nodeName := common.InterfaceToString(common.FindData(node, "metadata", "name"))
		gNode["node_name"] = common.InterfaceToString(common.FindData(node, "metadata", "name"))
		gNode["capacity"] = map[string]int{"nvidia.com/gpu": 0}
		gNode["allocatable"] = map[string]int{"nvidia.com/gpu": 0}

		capacityValue := common.FindData(node, "status", "capacity")
		allocatableValue := common.FindData(node, "status", "allocatable")
		containerCapacity := capacityValue.(map[string]interface{})
		contanerAllocatable := allocatableValue.(map[string]interface{})
		if containerCapacity["nvidia.com/gpu"] != nil {
			gNode["capacity"].(map[string]int)["nvidia.com/gpu"] = common.InterfaceToInt(containerCapacity["nvidia.com/gpu"])
		}
		if contanerAllocatable["nvidia.com/gpu"] != nil {
			gNode["allocatable"].(map[string]int)["nvidia.com/gpu"] = common.InterfaceToInt(containerCapacity["nvidia.com/gpu"])
		}
		nodeStatus, ok := gNodeStatus[nodeName]
		if !ok {
			gNode["requests"] = nil
			gNode["limits"] = nil
		} else {
			gNode["requests"] = nodeStatus["requests"]
			gNode["limits"] = nodeStatus["requests"]
		}

		gNodeList = append(gNodeList, gNode)
	}

	return c.JSON(http.StatusOK, echo.Map{
		"data": gNodeList,
	})
}
