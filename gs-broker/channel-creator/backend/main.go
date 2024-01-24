package main

import (
	"backend/model"
	"backend/router"
	"backend/util"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
)

func main() {
	log.Println("Server started on: server")

	env_err := godotenv.Load(".env")
	util.FailOnError(env_err, ".env Load fail")
	hostIP := os.Getenv("HOST_IP")
	db := model.DBInit()
	model.AppInit()
	defer db.Close()

	r := mux.NewRouter()
	corsConfig := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://" + hostIP + ":3000", "http://localhost:3000"},
		AllowCredentials: true,
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders:   []string{"*"},
	})

	handler := corsConfig.Handler(r)

	r.HandleFunc("/single", router.SingleClusterRouter).Methods("GET", "POST", "PUT")
	r.HandleFunc("/single/{id}", router.SingleClusterRouterWithID).Methods("GET", "DELETE")
	r.HandleFunc("/single/msg", router.SingleClusteMessage).Methods("POST", "DELETE")
	r.HandleFunc("/single/msg/{id}", router.SingleClusteMessageWithID).Methods("GET")

	http.ListenAndServe(":8000", handler)
}
