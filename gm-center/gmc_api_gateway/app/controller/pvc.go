package controller

import (
	"gmc_api_gateway/app/common"
	"gmc_api_gateway/app/model"
	"log"

	"net/http"
	// "github.com/tidwall/sjson"
	"github.com/labstack/echo/v4"
)

// Get PVC godoc
// @Summary Show List PVC
// @Description get PVC List
// @ApiImplicitParam
// @Accept  json
// @Produce  json
// @Security   Bearer
// @Param workspace query string false "name of the Workspace"
// @Param cluster query string false "name of the Cluster"
// @Param project query string false "name of the Project"
// @Success 200 {object} model.PVC
// @Router /pvcs [get]
// @Tags Kubernetes
func GetAllPVCs(c echo.Context) error {
	var pvcs []model.PVC
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
	data, err := GetModelList(params)
	if err != nil {
		common.ErrorMsg(c, http.StatusNotFound, err)
		return nil
	}
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

// Get PVC godoc
// @Summary Show detail PVC
// @Description get PVC Details
// @ApiImplicitParam
// @Accept  json
// @Produce  json
// @Security   Bearer
// @Param name path string true "name of the PVC"
// @Param workspace query string true "name of the Workspace"
// @Param cluster query string true "name of the Cluster"
// @Param project query string true "name of the Project"
// @Success 200 {object} model.PVC
// @Router /pvcs/{name} [get]
// @Tags Kubernetes
func GetPVC(c echo.Context) (err error) {
	params := model.PARAMS{
		Kind:      "persistentvolumeclaims",
		Name:      c.Param("name"),
		Cluster:   c.QueryParam("cluster"),
		Workspace: c.QueryParam("workspace"),
		Project:   c.QueryParam("project"),
		Method:    c.Request().Method,
		Body:      responseBody(c.Request().Body),
	}
	err = CheckParam(params)
	if err != nil {
		common.ErrorMsg(c, http.StatusNotFound, err)
		return nil
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

// Create PVC godoc
// @Summary Create PVC
// @Description Create PVC
// @ApiImplicitParam
// @Accept  json
// @Produce  json
// @Security   Bearer
// @Param json body string true "PVC Info Body"
// @Param cluster query string true "name of the Cluster"
// @Param workspace query string true "name of the Workspace"
// @Param project query string true "name of the Project"
// @Success 200 {object} model.Error
// @Router /pvcs [post]
// @Tags Kubernetes
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
		log.Println("err : ", err)
		common.ErrorMsg(c, http.StatusNotFound, err)
		return nil
	} else {
		return c.JSON(http.StatusCreated, echo.Map{
			"status": "Created",
			"code":   http.StatusCreated,
			"data":   postData,
		})
	}

}

// Delete PVC godoc
// @Summary Delete PVC
// @Description Delete PVC
// @ApiImplicitParam
// @Accept  json
// @Produce  json
// @Security   Bearer
// @Param name path string true "name of the PVC"
// @Param workspace query string true "name of the Workspace"
// @Param cluster query string true "name of the Cluster"
// @Param project query string true "name of the Project"
// @Success 200 {object} model.Error
// @Router /pvcs/{name} [delete]
// @Tags Kubernetes
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
		"status": "Deleted",
		"code":   http.StatusOK,
		"data":   postData,
	})
}
