package handler

import (
	"encoding/json"
	"net/http"
	// "fmt"

	"github.com/gorilla/mux"
	"github.com/jinzhu/gorm"
	"github.com/gedge-platform/gm-center/develop/gmc_database_api_server/app/model"
)

func GetAllMembers(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	members := []model.Member{}
	db.Find(&members)
	respondJSON(w, http.StatusOK, members)
}

func CreateMember(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	member := model.MemberWithPassword{}

	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&member); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}
	defer r.Body.Close()

	if err := db.Save(&member).Error; err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	respondJSON(w, http.StatusCreated, member)
}

func GetMember(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	id := vars["id"]
	member := getMemberOr404(db, id, w, r)
	if member == nil {
		return
	}
	respondJSON(w, http.StatusOK, member)
}

func UpdateMember(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	id := vars["id"]
	member := getMemberOr404(db, id, w, r)
	if member == nil {
		return
	}

	decoder := json.NewDecoder(r.Body)

	if err := decoder.Decode(&member); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}
	defer r.Body.Close()

	if err := db.Save(&member).Error; err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	respondJSON(w, http.StatusOK, member)
}

func DeleteMember(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	id := vars["id"]
	member := getMemberOr404(db, id, w, r)
	if member == nil {
		return
	}
	if err := db.Delete(&member).Error; err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	respondJSON(w, http.StatusNoContent, nil)
}

func EnabledMember(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	id := vars["id"]
	member := getMemberOr404(db, id, w, r)
	if member == nil {
		return
	}
	member.Enable()
	if err := db.Save(&member).Error; err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	respondJSON(w, http.StatusOK, member)
}

func DisabledMember(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	id := vars["id"]
	member := getMemberOr404(db, id, w, r)
	if member == nil {
		return
	}
	member.Disable()
	if err := db.Save(&member).Error; err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	respondJSON(w, http.StatusOK, member)
}

// getMemberOr404 gets a member instance if exists, or respond the 404 error otherwise
func getMemberOr404(db *gorm.DB, id string, w http.ResponseWriter, r *http.Request) *model.Member {
	member := model.Member{}
	if err := db.First(&member, model.Member{Id: id}).Error; err != nil {
		respondError(w, http.StatusNotFound, err.Error())
		return nil
	}
	return &member
}
