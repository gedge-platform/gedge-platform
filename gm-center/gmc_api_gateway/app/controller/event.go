package controller

import (
	"gmc_api_gateway/app/common"
	"gmc_api_gateway/app/model"

	"github.com/tidwall/gjson"
)

func getCallEvent(params model.PARAMS) []model.EVENT {
	staticKind := params.Kind
	var List []model.EVENT
	searchName := params.Name
	params.Name = ""
	clusterName := params.Cluster
	params.Kind = "events"
	// fmt.Printf("[#]staticKind : %s\n", staticKind)
	getData, _ := common.DataRequest(params)
	// fmt.Printf("[###]getData : %+v\n", getData)
	if staticKind == "nodes" || staticKind == "namespaces" {
		params.Cluster = params.Name
		events := common.FindingArray(common.Finding(getData, "items"))
		for e, _ := range events {
			event := model.EVENT{
				Kind:      (gjson.Get(events[e].String(), "regarding.name")).String(),
				Name:      (gjson.Get(events[e].String(), "metadata.name")).String(),
				Namespace: (gjson.Get(events[e].String(), "metadata.namespace")).String(),
				Message:   (gjson.Get(events[e].String(), "note")).String(),
				Reason:    (gjson.Get(events[e].String(), "reason")).String(),
				Type:      (gjson.Get(events[e].String(), "type")).String(),
				Cluster:   clusterName,
				EventTime: (gjson.Get(events[e].String(), "metadata.creationTimestamp")).Time(),
			}
			List = append(List, event)
		}
		return List
	} else {
		// fmt.Printf("[#]searchName : %s\n", searchName)
		events, err := common.FindDataArrStr2(getData, "items", "name", searchName)
		if err != nil {
			return nil
		}
		// fmt.Printf("[#]events : %s\n", events)

		for e, _ := range events {
			event := model.EVENT{
				Kind:      common.InterfaceToString(common.FindData(events[e], "regarding", "kind")),
				Name:      common.InterfaceToString(common.FindData(events[e], "metadata", "name")),
				Namespace: common.InterfaceToString(common.FindData(events[e], "metadata", "namespace")),
				Message:   common.InterfaceToString(common.FindData(events[e], "note", "")),
				Reason:    common.InterfaceToString(common.FindData(events[e], "reason", "")),
				Type:      common.InterfaceToString(common.FindData(events[e], "type", "")),
				Cluster:   clusterName,
				EventTime: common.InterfaceToTime(common.FindData(events[e], "metadata", "creationTimestamp")),
			}
			List = append(List, event)
		}
		return List
	}
}
