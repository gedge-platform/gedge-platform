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
// @Accept  json
// @Produce  json
// @Success 200 {object} model.PVC
// @Header 200 {string} Token "qwerty"
// @Router /pvcs [get]
func GetAllSecrets(c echo.Context) error {
	var secrets model.SECRETS
	fmt.Printf("## SECRETS", secrets)
	params := model.PARAMS{
		Kind:      "secrets",
		Name:      c.Param("name"),
		Cluster:   c.QueryParam("cluster"),
		User:      c.QueryParam("user"),
		Workspace: c.QueryParam("workspace"),
		Project:   c.QueryParam("project"),
		Method:    c.Request().Method,
		Body:      responseBody(c.Request().Body),
	}
	data := GetModelList(params)
	for i, _ := range data {
		secret := model.SECRET{
			Name:      common.InterfaceToString(common.FindData(data[i], "metadata", "name")),
			Namespace: common.InterfaceToString(common.FindData(data[i], "metadata", "namespace")),
			Type:      common.InterfaceToString(common.FindData(data[i], "type", "")),
			DataCnt:   common.InterfaceOfLen(common.FindData(data[i], "data", "")),
			Cluster:   common.InterfaceToString(common.FindData(data[i], "clusterName", "")),
			Workspace: common.InterfaceToString(common.FindData(data[i], "workspaceName", "")),
			UserName:  common.InterfaceToString(common.FindData(data[i], "userName", "")),
			CreateAt:  common.InterfaceToTime(common.FindData(data[i], "metadata", "creationTimestamp")),
		}
		if params.User != "" {
			if params.User == secret.UserName {
				secrets = append(secrets, secret)
			} else if params.User == "all" {
				secrets = append(secrets, secret)
			}
		} else {
			if secret.UserName == "" {
				secrets = append(secrets, secret)
			}
		}
	}

	return c.JSON(http.StatusOK, echo.Map{
		"data": secrets,
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
func GetSecret(c echo.Context) error {
	params := model.PARAMS{
		Kind:      "secrets",
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
	fmt.Printf("####Secret data confirm : %s", getData)
	secret := model.SECRET{
		Name:            common.InterfaceToString(common.FindData(getData, "metadata", "name")),
		Namespace:       common.InterfaceToString(common.FindData(getData, "metadata", "namespace")),
		Type:            common.InterfaceToString(common.FindData(getData, "type", "")),
		OwnerReferences: common.FindData(getData, "metadata", "ownerReferences"),
		Data:            common.FindData(getData, "data", ""),
		Cluster:         common.InterfaceToString(common.FindData(getData, "clusterName", "")),
		Lable:           common.FindData(getData, "metadata", "labels"),
		Annotations:     common.FindData(getData, "metadata", "annotations"),
		CreateAt:        common.InterfaceToTime(common.FindData(getData, "metadata", "creationTimestamp")),
	}

	return c.JSON(http.StatusOK, echo.Map{
		"data": secret,
	})
}
