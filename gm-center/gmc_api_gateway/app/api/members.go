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

func GetAllMembers(c echo.Context) (err error) {
	db := db.DbManager()
	models := []model.Member{}
	db.Find(&models)
	log.Println("Hello")

	if db.Find(&models).RowsAffected == 0 {
		common.ErrorMsg(c, http.StatusNotFound, errors.New("Not Found"))
		return
	}

	return c.JSON(http.StatusOK, echo.Map{"data": models})
}

func GetMember(c echo.Context) (err error) {
	db := db.DbManager()
	search_val := c.Param("id")

	models := FindDB(db, "Id", search_val)

	if models == nil {
		common.ErrorMsg(c, http.StatusNotFound, errors.New("Not Found"))
		return
	}

	return c.JSON(http.StatusOK, echo.Map{"data": models})
}

func CreateMember(c echo.Context) (err error) {
	db := db.DbManager()
	models := new(model.MemberWithPassword)

	if err = c.Bind(models); err != nil {
		common.ErrorMsg(c, http.StatusBadRequest, err)
		return nil
	}
	if err = c.Validate(models); err != nil {
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

func UpdateMember(c echo.Context) (err error) {
	db := db.DbManager()
	search_val := c.Param("id")
	models := model.MemberWithPassword{}

	if err := c.Bind(&models); err != nil {
		return c.NoContent(http.StatusBadRequest)
	}

	if err := FindDBwithPW(db, "Id", search_val); err == nil {
		common.ErrorMsg(c, http.StatusNotFound, common.ErrNotFound)
		return nil
	} else {
		models.Id = search_val
	}

	models2 := FindDBwithPW(db, "Id", search_val)

	if models.Name != "" {
		models2.Name = models.Name
	}
	if models.Email != "" {
		models2.Email = models.Email
	}
	if models.Contact != "" {
		models2.Contact = models.Contact
	}
	if models.Description != "" {
		models2.Description = models.Description
	}
	if models.Password != "" {
		models2.Password = models.Password
	}

	if err := db.Save(&models2).Error; err != nil {
		common.ErrorMsg(c, http.StatusExpectationFailed, err)
		return nil
	}

	return c.JSON(http.StatusOK, echo.Map{"data": models2})
}

func DeleteMember(c echo.Context) (err error) {
	db := db.DbManager()
	search_val := c.Param("id")

	if err := FindDB(db, "Id", search_val); err == nil {
		common.ErrorMsg(c, http.StatusNotFound, common.ErrNotFound)
		return nil
	}

	models := FindDB(db, "Id", search_val)

	if err := db.Delete(&models).Error; err != nil {
		common.ErrorMsg(c, http.StatusInternalServerError, err)
		return nil
	}

	return c.JSON(http.StatusOK, echo.Map{"data": models})
}

func FindDB(db *gorm.DB, select_val string, search_val string) *model.Member {
	models := model.Member{}
	if strings.Compare(select_val, "Id") == 0 {
		if err := db.First(&models, model.Member{Id: search_val}).Error; err != nil {
			return nil
		}
	} else if strings.Compare(select_val, "Name") == 0 {
		if err := db.First(&models, model.Member{Name: search_val}).Error; err != nil {
			return nil
		}
	}
	return &models
}

func FindDBwithPW(db *gorm.DB, select_val string, search_val string) *model.MemberWithPassword {
	models := model.MemberWithPassword{}
	if strings.Compare(select_val, "Id") == 0 {
		if err := db.First(&models, model.MemberWithPassword{Member: model.Member{Id: search_val}}).Error; err != nil {
			return nil
		}
	} else if strings.Compare(select_val, "Name") == 0 {
		if err := db.First(&models, model.MemberWithPassword{Member: model.Member{Name: search_val}}).Error; err != nil {
			return nil
		}
	}
	return &models
}
