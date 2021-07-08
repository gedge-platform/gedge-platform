package handler

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/jinzhu/gorm"
	"github.com/gedge-platform/gm-center/develop/gmc_database_api_server/app/model"
)

func GetAllWorkspaces(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	workspaces := []model.Workspace{}
	db.Find(&workspaces)
	respondJSON(w, http.StatusOK, workspaces)
}

func CreateWorkspace(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	workspace := model.Workspace{}

	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&workspace); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}
	defer r.Body.Close()

	if err := db.Save(&workspace).Error; err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	respondJSON(w, http.StatusCreated, workspace)
}

func GetWorkspace(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	name := vars["name"]
	workspace := getWorkspaceOr404(db, name, w, r)
	if workspace == nil {
		return
	}
	respondJSON(w, http.StatusOK, workspace)
}

func UpdateWorkspace(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	name := vars["name"]
	workspace := getWorkspaceOr404(db, name, w, r)
	if workspace == nil {
		return
	}

	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&workspace); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}
	defer r.Body.Close()

	if err := db.Save(&workspace).Error; err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	respondJSON(w, http.StatusOK, workspace)
}

func DeleteWorkspace(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	name := vars["name"]
	workspace := getWorkspaceOr404(db, name, w, r)
	if workspace == nil {
		return
	}
	if err := db.Delete(&workspace).Error; err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	respondJSON(w, http.StatusNoContent, nil)
}

// getWorkspaceOr404 gets a workspace instance if exists, or respond the 404 error otherwise
func getWorkspaceOr404(db *gorm.DB, name string, w http.ResponseWriter, r *http.Request) *model.Workspace {
	workspace := model.Workspace{}
	if err := db.First(&workspace, model.Workspace{Name: name}).Error; err != nil {
		respondError(w, http.StatusNotFound, err.Error())
		return nil
	}
	return &workspace
}
