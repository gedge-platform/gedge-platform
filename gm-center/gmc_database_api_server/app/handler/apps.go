package handler

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/jinzhu/gorm"
	"github.com/gedge-platform/gm-center/develop/gmc_database_api_server/app/model"
)

func GetAllApps(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	apps := []model.App{}
	db.Find(&apps)
	respondJSON(w, http.StatusOK, apps)
}

func CreateApp(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	app := model.App{}

	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&app); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}
	defer r.Body.Close()

	if err := db.Save(&app).Error; err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	respondJSON(w, http.StatusCreated, app)
}

func GetApp(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	name := vars["name"]
	app := getAppOr404(db, name, w, r)
	if app == nil {
		return
	}
	respondJSON(w, http.StatusOK, app)
}

func UpdateApp(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	name := vars["name"]
	app := getAppOr404(db, name, w, r)
	if app == nil {
		return
	}

	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&app); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}
	defer r.Body.Close()

	if err := db.Save(&app).Error; err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	respondJSON(w, http.StatusOK, app)
}

func DeleteApp(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	name := vars["name"]
	app := getAppOr404(db, name, w, r)
	if app == nil {
		return
	}
	if err := db.Delete(&app).Error; err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	respondJSON(w, http.StatusNoContent, nil)
}

// getAppOr404 gets a app instance if exists, or respond the 404 error otherwise
func getAppOr404(db *gorm.DB, name string, w http.ResponseWriter, r *http.Request) *model.App {
	app := model.App{}
	if err := db.First(&app, model.App{Name: name}).Error; err != nil {
		respondError(w, http.StatusNotFound, err.Error())
		return nil
	}
	return &app
}
