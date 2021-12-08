package api

import (
	"errors"
	"log"
	"net/http"
	"strings"

	"gmc_api_gateway/app/common"
	"gmc_api_gateway/app/db"
	"gmc_api_gateway/app/model"

	"github.com/jinzhu/gorm"
	"github.com/labstack/echo/v4"
)

// GetAllApps godoc
// @Summary Show all apps
// @Description get App Lists
// @Accept  json
// @Produce  json
// @Success 200 {object} model.App
// @Header 200 {string} Token "qwerty"
// @Router /apps [get]
func GetAllApps(c echo.Context) (err error) {
	db := db.DbManager()
	models := []model.App{}
	db.Find(&models)

	if db.Find(&models).RowsAffected == 0 {
		common.ErrorMsg(c, http.StatusOK, common.ErrNoData)
		return
	}

	return c.JSON(http.StatusOK, echo.Map{"data": models})
}

// GetApp godoc
// @Summary Show App
// @Description get App
// @Accept  json
// @Produce  json
// @Param name path string true "App Name"
// @Success 200 {object} model.App
// @Header 200 {string} Token "qwerty"
// @Router /apps/{name} [get]
func GetApp(c echo.Context) (err error) {
	db := db.DbManager()
	search_val := c.Param("name")
	models := FindAppDB(db, "Name", search_val)

	if models == nil {
		common.ErrorMsg(c, http.StatusNotFound, common.ErrNotFound)
		return
	}

	return c.JSON(http.StatusOK, echo.Map{"data": models})
}

// CreateApp godoc
// @Summary Create App
// @Description create App
// @Accept  json
// @Produce  json
// @Param appName path string true "App Name"
// @Param appCategory path string true "App Category"
// @Param appDescription path string true "App Description"
// @Success 200 {object} model.App
// @Header 200 {string} Token "qwerty"
// @Router /apps [POST]
func CreateApp(c echo.Context) (err error) {
	db := db.DbManager()
	models := new(model.App)

	if err = c.Bind(models); err != nil {
		common.ErrorMsg(c, http.StatusBadRequest, err)
		return nil
	}

	if err = AppValidate(models, ""); err != nil {
		common.ErrorMsg(c, http.StatusUnprocessableEntity, err)
		return nil
	}

	if err != nil {
		panic(err)
	}

	if err := db.Create(&models).Error; err != nil {
		common.ErrorMsg(c, http.StatusExpectationFailed, err)
		return nil
	}

	return c.JSON(http.StatusCreated, echo.Map{"data": models})
}

func UpdateApp(c echo.Context) (err error) {
	db := db.DbManager()
	search_val := c.Param("name")
	models := model.App{}

	if err := c.Bind(&models); err != nil {
		common.ErrorMsg(c, http.StatusBadRequest, err)
		return nil
	}

	if err := FindAppDB(db, "Name", search_val); err == nil {
		common.ErrorMsg(c, http.StatusNotFound, common.ErrNotFound)
		return nil
	} else {
		models.Name = search_val
	}

	models2 := FindAppDB(db, "Name", search_val)

	if models.Name != "" {
		models2.Name = models.Name
	}
	if models.Description != "" {
		models2.Description = models.Description
	}
	if models.Category != "" {
		models2.Category = models.Category
	}
	if models.Installed != models2.Installed {
		models2.Installed = models.Installed
	}

	if err := db.Save(&models2).Error; err != nil {
		common.ErrorMsg(c, http.StatusExpectationFailed, err)
		return nil
	}

	return c.JSON(http.StatusOK, echo.Map{"data": models2})
}

func DeleteApp(c echo.Context) (err error) {
	db := db.DbManager()
	search_val := c.Param("name")

	if err := FindAppDB(db, "Name", search_val); err == nil {
		common.ErrorMsg(c, http.StatusExpectationFailed, common.ErrNotFound)
	}

	models := FindAppDB(db, "Name", search_val)

	if err := db.Delete(&models).Error; err != nil {
		common.ErrorMsg(c, http.StatusInternalServerError, err)
	}

	return c.JSON(http.StatusOK, echo.Map{"data": models})
}

func FindAppDB(db *gorm.DB, select_val string, search_val string) *model.App {
	models := model.App{}
	if strings.Compare(select_val, "Name") == 0 {
		if err := db.First(&models, model.App{Name: search_val}).Error; err != nil {
			return nil
		}
	}
	return &models
}

func AppValidate(m *model.App, action string) error {
	log.Println("m is", m)
	switch strings.ToLower(action) {
	default:
		if m.Name == "" {
			return errors.New("Required Name")
		}
		if m.Category == "" {
			return errors.New("Required Category")
		}
		if m.Description == "" {
			return errors.New("Required Description")
		}
		if m.Installed == 0 {
			return errors.New("Required Installed")
		}
	}
	return nil
}
