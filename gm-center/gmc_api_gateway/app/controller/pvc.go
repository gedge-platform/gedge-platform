package controller

import (
	"fmt"
	"gmc_api_gateway/app/common"
	"gmc_api_gateway/app/model"

	// "log"
	"net/http"
	// "github.com/tidwall/sjson"
	"github.com/labstack/echo/v4"
)

// GetPvs godoc
// @Summary Show app PVCs
// @Description get pvc List
// @Requestbody
// @Accept  json
// @Produce  json
// @Success 200 {object} model.PVC
// @Header 200 {string} Token "qwerty"
// @Router /pvcs [get]
func GetAllPVCs(c echo.Context) error {
	var pvcs []model.PVC
	fmt.Printf("## PVCs", pvcs)
	params := model.PARAMS{
		Kind:      "persistentvolumeclaims",
		Name:      c.Param("name"),
		Cluster:   c.QueryParam("cluster"),
		Workspace: c.QueryParam("workspace"),
		Project:   c.QueryParam("project"),
		User:      c.QueryParam("user"),
		Method:    c.Request().Method,
		Body:      responseBody(c.Request().Body),
	}
	data := GetModelList(params)
	fmt.Printf("####Pod data confirm : %s", data)
	// Name        string           `json:"name"`
	// Capacity   string           `json:"capacity"`
	// AccessMode      []string `json:"accessMode"`
	// Status    interface{}      `json:"status"`
	// Volume   interface{}        `json:"volume"`
	// StorageClass       string           `json:"storageClass"`
	// // Reason        []EVENT          `json:"events"`
	// CreateAt time.Time          `json:"createAt"`
	// Events  []EVENT          `json:"events"`
	for i, _ := range data {
		pvc := model.PVC{
			Name:         common.InterfaceToString(common.FindData(data[i], "metadata", "name")),
			Namespace:    common.InterfaceToString(common.FindData(data[i], "metadata", "namespace")),
			Capacity:     common.InterfaceToString(common.FindData(data[i], "spec.resources", "requests.storage")),
			AccessMode:   common.InterfaceToArray(common.FindData(data[i], "spec", "accessModes")),
			Status:       common.InterfaceToString(common.FindData(data[i], "status", "phase")),
			StorageClass: common.InterfaceToString(common.FindData(data[i], "spec", "storageClassName")),
			Volume:       common.InterfaceToString(common.FindData(data[i], "spec", "volumeName")),
			Cluster:      common.InterfaceToString(common.FindData(data[i], "clusterName", "")),
			Workspace:    common.InterfaceToString(common.FindData(data[i], "workspaceName", "")),
			CreateAt:     common.InterfaceToTime(common.FindData(data[i], "metadata", "creationTimestamp")),
			UserName:     common.InterfaceToString(common.FindData(data[i], "userName", "")),
		}
		if params.User != "" {
			if params.User == pvc.UserName {
				pvcs = append(pvcs, pvc)
			}
		} else {
			pvcs = append(pvcs, pvc)
		}
	}

	return c.JSON(http.StatusOK, echo.Map{
		"data": pvcs,
	})
}

// GetPvs godoc
// @Summary Show detail PVs
// @Description get PVs Details
// @Accept  json
// @Produce  json
// @Success 200 {object} model.POD
// @Header 200 {string} Token "qwerty"
// @Router /pvs/:name [get]
func GetPVC(c echo.Context) error {
	var pvcs []model.PVC
	fmt.Printf("## PVCs", pvcs)
	params := model.PARAMS{
		Kind:      "persistentvolumeclaims",
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

	fmt.Printf("####PV data confirm : %s", getData)
	pvc := model.PVC{
		Name:         common.InterfaceToString(common.FindData(getData, "metadata", "name")),
		Namespace:    common.InterfaceToString(common.FindData(getData, "metadata", "namespace")),
		Capacity:     common.InterfaceToString(common.FindData(getData, "spec.resources", "requests.storage")),
		AccessMode:   common.InterfaceToArray(common.FindData(getData, "spec", "accessModes")),
		Status:       common.InterfaceToString(common.FindData(getData, "status", "phase")),
		StorageClass: common.InterfaceToString(common.FindData(getData, "spec", "storageClassName")),
		Volume:       common.InterfaceToString(common.FindData(getData, "spec", "volumeName")),
		Cluster:      c.QueryParam("cluster"),
		CreateAt:     common.InterfaceToTime(common.FindData(getData, "metadata", "creationTimestamp")),
		Finalizers:   common.InterfaceToArray(common.FindData(getData, "metadata", "finalizers")),
		Lable:        common.FindData(getData, "metadata", "labels"),

		Annotations: common.FindData(getData, "metadata", "annotations"),
		Events:      getCallEvent(params),
	}

	return c.JSON(http.StatusOK, echo.Map{
		"data": pvc,
	})
}

func CreatePVC(c echo.Context) (err error) {
	params := model.PARAMS{
		Kind:    "persistentvolumeclaims",
		Cluster: c.QueryParam("cluster"),
		Project: c.QueryParam("project"),
		Method:  c.Request().Method,
		Body:    responseBody(c.Request().Body),
	}
	postData, err := common.DataRequest(params)
	if err != nil {
		common.ErrorMsg(c, http.StatusNotFound, err)
		return nil
	} else {
		return c.JSON(http.StatusCreated, echo.Map{
			"info": common.StringToInterface(postData),
		})
	}

}

func DeletePVC(c echo.Context) (err error) {
	params := model.PARAMS{
		Kind:    "persistentvolumeclaims",
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
