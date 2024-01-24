package controller

import (
	// "fmt"

	"gmc_api_gateway/app/common"
	"gmc_api_gateway/app/model"
	"net/http"

	"github.com/labstack/echo/v4"
)

// Get StorageClass godoc
// @Summary Show detail StorageClass
// @Description get StorageClass Details
// @ApiImplicitParam
// @Accept  json
// @Produce  json
// @Security   Bearer
// @Param name path string true "name of the StorageClass"
// @Param workspace query string true "name of the Workspace"
// @Param cluster query string true "name of the Cluster"
// @Param project query string true "name of the Project"
// @Success 200 {object} model.STORAGECLASS
// @Router /storageclasses/{name} [get]
// @Tags Kubernetes
func GetStorageclass(c echo.Context) (err error) {
	// var storageclasses []model.STORAGECLASS
	params := model.PARAMS{
		Kind:      "storageclasses",
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
	var allowVolumeExpansion string
	if common.InterfaceToString(common.FindData(getData, "allowVolumeExpansion", "")) != "" {
		allowVolumeExpansion = common.InterfaceToString(common.FindData(getData, "allowVolumeExpansion", ""))
	} else {
		allowVolumeExpansion = "false"
	}
	// fmt.Println("[###########storageclass]", getData)
	storageclass := model.STORAGECLASS{
		Name:                 common.InterfaceToString(common.FindData(getData, "metadata", "name")),
		Cluster:              c.QueryParam("cluster"),
		ReclaimPolicy:        common.InterfaceToString(common.FindData(getData, "reclaimPolicy", "")),
		Provisioner:          common.InterfaceToString(common.FindData(getData, "provisioner", "")),
		VolumeBindingMode:    common.InterfaceToString(common.FindData(getData, "volumeBindingMode", "")),
		AllowVolumeExpansion: allowVolumeExpansion,
		Parameters:           common.FindData(getData, "parameters", ""),
		CreateAt:             common.InterfaceToTime(common.FindData(getData, "metadata", "creationTimestamp")),
		Labels:               common.FindData(getData, "metadata", "labels"),
		Annotations:          common.FindData(getData, "metadata", "annotations"),
		//Age:                  common.InterfaceToString(common.FindData(getData, "age", "")),
	}

	return c.JSON(http.StatusOK, echo.Map{
		"data": storageclass,
	})
}

// Get StorageClass godoc
// @Summary Show List StorageClass
// @Description get StorageClass List
// @ApiImplicitParam
// @Accept  json
// @Produce  json
// @Security   Bearer
// @Param workspace query string false "name of the Workspace"
// @Param cluster query string false "name of the Cluster"
// @Param project query string false "name of the Project"
// @Success 200 {object} model.STORAGECLASS
// @Router /storageclasses [get]
// @Tags Kubernetes
func GetStorageclasses(c echo.Context) (err error) {
	var storageclasses []model.STORAGECLASS
	params := model.PARAMS{
		Kind:      "storageclasses",
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

	for i, _ := range data {
		var allowVolumeExpansion string
		if common.InterfaceToString(common.FindData(data[i], "allowVolumeExpansion", "")) != "" {
			allowVolumeExpansion = common.InterfaceToString(common.FindData(data[i], "allowVolumeExpansion", ""))
		} else {
			allowVolumeExpansion = "false"
		}
		storageclass := model.STORAGECLASS{
			Name:                 common.InterfaceToString(common.FindData(data[i], "metadata", "name")),
			Cluster:              common.InterfaceToString(common.FindData(data[i], "clusterName", "")),
			Workspace:            common.InterfaceToString(common.FindData(data[i], "workspaceName", "")),
			UserName:             common.InterfaceToString(common.FindData(data[i], "userName", "")),
			ReclaimPolicy:        common.InterfaceToString(common.FindData(data[i], "reclaimPolicy", "")),
			Provisioner:          common.InterfaceToString(common.FindData(data[i], "provisioner", "")),
			VolumeBindingMode:    common.InterfaceToString(common.FindData(data[i], "volumeBindingMode", "")),
			AllowVolumeExpansion: allowVolumeExpansion,
			CreateAt:             common.InterfaceToTime(common.FindData(data[i], "metadata", "creationTimestamp")),
		}
		if params.User != "" {
			if params.User == storageclass.UserName {
				storageclasses = append(storageclasses, storageclass)
			}
		} else {
			storageclasses = append(storageclasses, storageclass)
		}
	}

	return c.JSON(http.StatusOK, echo.Map{
		"data": storageclasses,
	})
}

// Create StorageClass godoc
// @Summary Create StorageClass
// @Description Create StorageClass
// @ApiImplicitParam
// @Accept  json
// @Produce  json
// @Security   Bearer
// @Param json body string true "StorageClass Info Body"
// @Param cluster query string true "name of the Cluster"
// @Param workspace query string true "name of the Workspace"
// @Param project query string true "name of the Project"
// @Success 200 {object} model.Error
// @Router /storageclasses [post]
// @Tags Kubernetes
func CreateStorageclasses(c echo.Context) (err error) {
	params := model.PARAMS{
		Kind:    "storageclasses",
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

	return c.JSON(http.StatusCreated, echo.Map{
		"status": "Created",
		"code":   http.StatusCreated,
		"data":   postData,
	})
}

// Delete StorageClass godoc
// @Summary Delete StorageClass
// @Description Delete StorageClass
// @ApiImplicitParam
// @Accept  json
// @Produce  json
// @Security   Bearer
// @Param name path string true "name of the StorageClass"
// @Param workspace query string true "name of the Workspace"
// @Param cluster query string true "name of the Cluster"
// @Param project query string true "name of the Project"
// @Success 200 {object} model.Error
// @Router /storageclasses/{name} [delete]
// @Tags Kubernetes
func DeleteStorageclasses(c echo.Context) (err error) {
	params := model.PARAMS{
		Kind:    "storageclasses",
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
