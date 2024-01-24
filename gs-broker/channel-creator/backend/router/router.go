package router

import (
	"backend/controller"
	"net/http"
)

func SingleClusterRouter(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		controller.GetSingleClusterList(w, r)
	case "POST":
		controller.AddSingleCluster(w, r)
	case "PUT":
		controller.UpdateSingleCluster(w, r)
	}
}

func SingleClusterRouterWithID(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		controller.GetSingleCluster(w, r)
	case "DELETE":
		controller.DelSingleCluster(w, r)
	}
}

func SingleClusteMessage(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "POST":
		controller.SendMessage(w, r)
	case "DELETE":
		controller.DeleteMessage(w, r)
	}
}
func SingleClusteMessageWithID(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		controller.GetMessages(w, r)
	}
}