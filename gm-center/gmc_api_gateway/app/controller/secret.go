package controller

import (
	"gmc_api_gateway/app/common"
	"gmc_api_gateway/app/model"

	// "log"
	"net/http"
	// "github.com/tidwall/sjson"
	"github.com/labstack/echo/v4"
)

// Get Secret godoc
// @Summary Show List Secret
// @Description get Secret List
// @ApiImplicitParam
// @Accept  json
// @Produce  json
// @Security   Bearer
// @Param workspace query string false "name of the Workspace"
// @Param cluster query string false "name of the Cluster"
// @Param project query string false "name of the Project"
// @Success 200 {object} model.SECRET
// @Router /secrets [get]
// @Tags Kubernetes
func GetAllSecrets(c echo.Context) error {
	var secrets model.SECRETS
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
	data, err := GetModelList(params)
	if err != nil {
		common.ErrorMsg(c, http.StatusNotFound, err)
		return nil
	}
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

// Get Secret godoc
// @Summary Show detail Secret
// @Description get Secret Details
// @ApiImplicitParam
// @Accept  json
// @Produce  json
// @Security   Bearer
// @Param name path string true "name of the Secret"
// @Param workspace query string true "name of the Workspace"
// @Param cluster query string true "name of the Cluster"
// @Param project query string true "name of the Project"
// @Success 200 {object} model.SECRET
// @Router /secrets/{name} [get]
// @Tags Kubernetes
func GetSecret(c echo.Context) (err error) {
	params := model.PARAMS{
		Kind:      "secrets",
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

// Create Secret godoc
// @Summary Create Secret
// @Description Create Secret
// @ApiImplicitParam
// @Accept  json
// @Produce  json
// @Security   Bearer
// @Param json body string true "Secret Info Body"
// @Param cluster query string true "name of the Cluster"
// @Param workspace query string true "name of the Workspace"
// @Param project query string true "name of the Project"
// @Success 200 {object} model.Error
// @Router /secrets [post]
// @Tags Kubernetes
func CreateSecret(c echo.Context) (err error) {
	params := model.PARAMS{
		Kind:    "secrets",
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
			"status": "Created",
			"code":   http.StatusCreated,
			"data":   postData,
		})
	}

}

// Delete Secret godoc
// @Summary Delete Secret
// @Description Delete Secret
// @ApiImplicitParam
// @Accept  json
// @Produce  json
// @Security   Bearer
// @Param name path string true "name of the Secret"
// @Param workspace query string true "name of the Workspace"
// @Param cluster query string true "name of the Cluster"
// @Param project query string true "name of the Project"
// @Success 200 {object} model.Error
// @Router /secrets/{name} [delete]
// @Tags Kubernetes
func DeleteSecret(c echo.Context) (err error) {
	params := model.PARAMS{
		Kind:    "secrets",
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
