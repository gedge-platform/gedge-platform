package handler

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/jinzhu/gorm"
	"github.com/gedge-platform/gm-center/develop/gmc_database_api_server/app/model"
)

func GetAllClusters(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	clusters := []model.Cluster{}
	db.Find(&clusters)
	respondJSON(w, http.StatusOK, clusters)
}

func CreateCluster(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	cluster := model.Cluster{}

	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&cluster); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}
	defer r.Body.Close()

	if err := db.Save(&cluster).Error; err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	respondJSON(w, http.StatusCreated, cluster)
}

func GetCluster(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	name := vars["name"]
	cluster := getClusterOr404(db, name, w, r)
	if cluster == nil {
		return
	}
	respondJSON(w, http.StatusOK, cluster)
}

func UpdateCluster(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	name := vars["name"]
	cluster := getClusterOr404(db, name, w, r)
	if cluster == nil {
		return
	}

	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&cluster); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}
	defer r.Body.Close()

	if err := db.Save(&cluster).Error; err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	respondJSON(w, http.StatusOK, cluster)
}

func DeleteCluster(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	name := vars["name"]
	cluster := getClusterOr404(db, name, w, r)
	if cluster == nil {
		return
	}
	if err := db.Delete(&cluster).Error; err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	respondJSON(w, http.StatusNoContent, nil)
}

// getClusterOr404 gets a cluster instance if exists, or respond the 404 error otherwise
func getClusterOr404(db *gorm.DB, name string, w http.ResponseWriter, r *http.Request) *model.Cluster {
	cluster := model.Cluster{}
	if err := db.First(&cluster, model.Cluster{Name: name}).Error; err != nil {
		respondError(w, http.StatusNotFound, err.Error())
		return nil
	}
	return &cluster
}
