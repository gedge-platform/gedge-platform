package api

import (
	"net/http"
	"strings"

	"gmc_api_gateway/app/common"
	"gmc_api_gateway/app/db"
	"gmc_api_gateway/app/model"

	"github.com/jinzhu/gorm"
	"github.com/labstack/echo/v4"
)

func GetAllWorkspaces(c echo.Context) (err error) {
	db := db.DbManager()
	models := []model.Workspace{}
	db.Find(&models)

	if db.Find(&models).RowsAffected == 0 {
		common.ErrorMsg(c, http.StatusOK, common.ErrNoData)
	}

	return c.JSON(http.StatusOK, echo.Map{"data": models})
}

func GetWorkspace(c echo.Context) (err error) {
	db := db.DbManager()
	search_val := c.Param("name")
	models := FindWorkspaceDB(db, "Name", search_val)

	if models == nil {
		common.ErrorMsg(c, http.StatusNotFound, common.ErrNotFound)
	}

	return c.JSON(http.StatusOK, echo.Map{"data": models})
}
func GetDBWorkspace(params model.PARAMS) *model.Workspace {
	db := db.DbManager()
	search_val := params.Workspace
	models := FindWorkspaceDB(db, "Name", search_val)
	if models == nil {
		// common.ErrorMsg(c, http.StatusNotFound, common.ErrNotFound)
		return nil
	}

	return models
}

func CreateWorkspace(c echo.Context) (err error) {
	db := db.DbManager()
	models := new(model.Workspace)

	if err = c.Bind(models); err != nil {
		return c.JSON(http.StatusBadRequest, err)
		// common.ErrorMsg(c, http.StatusBadRequest, err)

		// return nil
	}
	if err = c.Validate(models); err != nil {
		return c.JSON(http.StatusUnprocessableEntity, err)
	}
	// if err != nil {
	// 	panic(err)
	// }

	if err := db.Create(&models).Error; err != nil {
		common.ErrorMsg(c, http.StatusExpectationFailed, err)
		return nil
	}

	return c.JSON(http.StatusCreated, echo.Map{"data": models})
}

func UpdateWorkspace(c echo.Context) (err error) {
	db := db.DbManager()
	search_val := c.Param("name")
	models := model.Workspace{}

	if err := c.Bind(&models); err != nil {
		return c.NoContent(http.StatusBadRequest)
	}

	if err := FindWorkspaceDB(db, "Name", search_val); err == nil {
		common.ErrorMsg(c, http.StatusNotFound, common.ErrNotFound)
	} else {
		models.Name = search_val
	}

	models2 := FindWorkspaceDB(db, "Name", search_val)

	if models.Description != "" {
		models2.Description = models.Description
	}
	if models.SelectCluster != "" {
		models2.SelectCluster = models.SelectCluster
	}
	if models.Owner != "" {
		models2.Owner = models.Owner
	}
	if models.Creator != "" {
		models2.Creator = models.Creator
	}

	if err := db.Save(&models2).Error; err != nil {
		common.ErrorMsg(c, http.StatusExpectationFailed, err)
	}

	return c.JSON(http.StatusOK, echo.Map{"data": models2})
}

func DeleteWorkspace(c echo.Context) (err error) {
	db := db.DbManager()
	search_val := c.Param("name")

	if err := FindWorkspaceDB(db, "Name", search_val); err == nil {
		common.ErrorMsg(c, http.StatusNotFound, common.ErrNotFound)
	}

	models := FindWorkspaceDB(db, "Name", search_val)

	if err := db.Delete(&models).Error; err != nil {
		common.ErrorMsg(c, http.StatusInternalServerError, err)
	}

	return c.JSON(http.StatusOK, echo.Map{"data": models})
}

func FindWorkspaceDB(db *gorm.DB, select_val string, search_val string) *model.Workspace {
	models := model.Workspace{}
	if strings.Compare(select_val, "Name") == 0 {
		if err := db.First(&models, model.Workspace{Name: search_val}).Error; err != nil {
			return nil
		}
	}
	return &models
}
