package app

import (
	"log"
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/jinzhu/gorm"
	"github.com/gedge-platform/gm-center/develop/gmc_database_api_server/app/handler"
	"github.com/gedge-platform/gm-center/develop/gmc_database_api_server/app/model"
	"github.com/gedge-platform/gm-center/develop/gmc_database_api_server/config"
)

// App has router and db instances
type App struct {
	Router *mux.Router
	DB     *gorm.DB
}

// Initialize initializes the app with predefined configuration
func (a *App) Initialize(config *config.Config) {
	dbURI := fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?charset=%s&parseTime=True",
		config.DB.Username,
		config.DB.Password,
		config.DB.Host,
		config.DB.Port,
		config.DB.Name,
		config.DB.Charset)

	db, err := gorm.Open(config.DB.Dialect, dbURI)
	if err != nil {
		log.Fatal("Could not connect database")
		panic(err.Error())
	}
	log.Println("DB Connection was successful!!")

	a.DB = model.DBMigrate(db)
	a.Router = mux.NewRouter()
	a.setRouters()
}

// setRouters sets the all required routers
func (a *App) setRouters() {

	// Routing for handling the members
	a.Get("/members", a.handleRequest(handler.GetAllMembers))
	a.Post("/members", a.handleRequest(handler.CreateMember))
	a.Get("/members/{id}", a.handleRequest(handler.GetMember))
	a.Put("/members/{id}", a.handleRequest(handler.UpdateMember))
	a.Delete("/members/{id}", a.handleRequest(handler.DeleteMember))
	a.Put("/members/{id}/enabled", a.handleRequest(handler.EnabledMember))
	a.Delete("/members/{id}/enabled", a.handleRequest(handler.DisabledMember))

	// Routing for handling the members
	a.Get("/clusters", a.handleRequest(handler.GetAllClusters))
	a.Post("/clusters", a.handleRequest(handler.CreateCluster))
	a.Get("/clusters/{name}", a.handleRequest(handler.GetCluster))
	a.Put("/clusters/{name}", a.handleRequest(handler.UpdateCluster))
	a.Delete("/clusters/{name}", a.handleRequest(handler.DeleteCluster))

	// Routing for handling the workspaces
	a.Get("/workspaces", a.handleRequest(handler.GetAllWorkspaces))
	a.Post("/workspaces", a.handleRequest(handler.CreateWorkspace))
	a.Get("/workspaces/{name}", a.handleRequest(handler.GetWorkspace))
	a.Put("/workspaces/{name}", a.handleRequest(handler.UpdateWorkspace))
	a.Delete("/workspaces/{name}", a.handleRequest(handler.DeleteWorkspace))

	// Routing for handling the projects
	a.Get("/projects", a.handleRequest(handler.GetAllProjects))
	a.Post("/projects", a.handleRequest(handler.CreateProject))
	a.Get("/projects/{name}", a.handleRequest(handler.GetProject))
	a.Put("/projects/{name}", a.handleRequest(handler.UpdateProject))
	a.Delete("/projects/{name}", a.handleRequest(handler.DeleteProject))

	// Routing for handling the projects
	a.Get("/apps", a.handleRequest(handler.GetAllApps))
	a.Post("/apps", a.handleRequest(handler.CreateApp))
	a.Get("/apps/{name}", a.handleRequest(handler.GetApp))
	a.Put("/apps/{name}", a.handleRequest(handler.UpdateApp))
	a.Delete("/apps/{name}", a.handleRequest(handler.DeleteApp))

}

// Get wraps the router for GET method
func (a *App) Get(path string, f func(w http.ResponseWriter, r *http.Request)) {
	a.Router.HandleFunc(path, f).Methods("GET")
}

// Post wraps the router for POST method
func (a *App) Post(path string, f func(w http.ResponseWriter, r *http.Request)) {
	a.Router.HandleFunc(path, f).Methods("POST")
}

// Put wraps the router for PUT method
func (a *App) Put(path string, f func(w http.ResponseWriter, r *http.Request)) {
	a.Router.HandleFunc(path, f).Methods("PUT")
}

// Delete wraps the router for DELETE method
func (a *App) Delete(path string, f func(w http.ResponseWriter, r *http.Request)) {
	a.Router.HandleFunc(path, f).Methods("DELETE")
}

// Run the app on it's router
func (a *App) Run(host string) {
	log.Fatal(http.ListenAndServe(host, a.Router))
}

type RequestHandlerFunction func(db *gorm.DB, w http.ResponseWriter, r *http.Request)

func (a *App) handleRequest(handler RequestHandlerFunction) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		handler(a.DB, w, r)
	}
}
