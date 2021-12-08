package routes

import (
	"os"

	"gmc_api_gateway/app/api"

	"github.com/dgrijalva/jwt-go"
	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

type jwtCustomClaims struct {
	Name string `json:"name"`
	Role string `json:"role"`
	jwt.StandardClaims
}

type DataValidator struct {
	validator *validator.Validate
}

func NewValidator() *DataValidator {
	return &DataValidator{
		validator: validator.New(),
	}
}

func (dv *DataValidator) Validate(i interface{}) error {
	return dv.validator.Struct(i)
}

func GEdgeRoute(e *echo.Echo) {
	e.Validator = NewValidator()

	e.POST("/gmcapi/v1/auth", api.LoginUser)

	r0 := e.Group("/gmcapi/v1/restricted")

	// decoded, err := base64.URLEncoding.DecodeString(os.Getenv("SIGNINGKEY"))
	// if err != nil {
	// 	fmt.Println("signingkey base64 decoded Error")
	// }

	config := middleware.JWTConfig{
		Claims:     &jwtCustomClaims{},
		SigningKey: []byte(os.Getenv("SIGNINGKEY")),
	}

	r0.Use(middleware.JWTWithConfig(config))
	r0.GET("/test", api.GetAllMembers)

	// /gmcapi/v1
	r := e.Group("/gmcapi/v1", middleware.BasicAuth(func(id, password string, c echo.Context) (bool, error) {
		userChk, _ := api.AuthenticateUser(id, password)
		return userChk, nil
	}))
	r.GET("/members", api.GetAllMembers)
	r.POST("/members", api.CreateMember)
	r.GET("/members/:id", api.GetMember)
	r.PUT("/members/:id", api.UpdateMember)
	r.DELETE("/members/:id", api.DeleteMember)

	r.GET("/apps", api.GetAllApps)
	r.POST("/apps", api.CreateApp)
	r.GET("/apps/:name", api.GetApp)
	r.PUT("/apps/:name", api.UpdateApp)
	r.DELETE("/apps/:name", api.DeleteApp)

	r.GET("/clusters", api.GetClusters)
	r.POST("/clusters", api.CreateCluster)
	r.GET("/clusters/:name", api.GetCluster)
	// r.PUT("/clusters/:name", api.UpdateCluster)
	r.DELETE("/clusters/:name", api.DeleteCluster)

	r.GET("/projects", api.GetProjects)
	r.GET("/projects/:name", api.GetProject)
	r.GET("/userprojects", api.GetAllProjects)
	r.POST("/projects", api.CreateProject)
	// r.PUT("/projects/:name", api.ReplaceProject)
	// r.PATCH("/projects/:name", api.UpdateProject)
	r.DELETE("/projects/:name", api.DeleteProject)

	r.GET("/deployments", api.GetDeployments)
	r.POST("/deployments", api.CreateDeployment)
	r.GET("/deployments/:name", api.GetDeployment)
	// r.PUT("/deployments/:name", api.UpdateDeployment)
	r.DELETE("/deployments/:name", api.DeleteDeployment)

	r.GET("/workspaces", api.GetAllWorkspaces)
	r.POST("/workspaces", api.CreateWorkspace)
	r.GET("/workspaces/:name", api.GetWorkspace)
	r.PUT("/workspaces/:name", api.UpdateWorkspace)
	r.DELETE("/workspaces/:name", api.DeleteWorkspace)

	r.GET("/pods", api.GetAllPods)
	r.POST("/pods", api.CreatePod)
	r.GET("/pods/:name", api.GetPods)
	// r.PUT("/pods/:name", api.UpdatePods)
	r.DELETE("/pods/:name", api.DeletePod)

	r.GET("/jobs", api.GetAllJobs)
	r.POST("/jobs", api.CreateJob)
	r.GET("/jobs/:name", api.GetJobs)
	// r.PUT("/jobs/:name", api.UpdateJob)
	r.DELETE("/jobs/:name", api.DeleteJob)

	r.GET("/cronjobs", api.GetCronAllJobs)
	r.POST("/cronjobs", api.CreateCronJob)
	r.GET("/cronjobs/:name", api.GetCronJobs)
	// r.PUT("/cronjobs/:name", api.UpdateCronJobs)
	r.DELETE("/cronjobs/:name", api.DeleteCronJob)

	r.GET("/services", api.GetServices)
	r.POST("/services", api.CreateService)
	r.GET("/services/:name", api.GetService)
	// r.PUT("/services/:name", api.UpdateService)
	r.DELETE("/services/:name", api.DeleteService)

	r2 := e.Group("/kube/v1", middleware.BasicAuth(func(id, password string, c echo.Context) (bool, error) {
		userChk, _ := api.AuthenticateUser(id, password)
		return userChk, nil
	}))
	r2.Any("/:cluster_name", api.Kubernetes)
	r2.Any("/:cluster_name/:namespace_name", api.Kubernetes)
	r2.Any("/:cluster_name/:namespace_name/:kind_name", api.Kubernetes)
	r2.Any("/:cluster_name/:namespace_name/:kind_name/*", api.Kubernetes)

	r2.GET("/metrics", echo.WrapHandler(promhttp.Handler()))
	r2.GET("/monitoring", echo.WrapHandler(promhttp.Handler()))
	r2.Any("/monitoring/:kind", api.Monit)
	// r2.Any("/monitoring/:kind/:name", api.Monit)
	r2.Any("/monitoring/realtime/:kind", api.RealMetrics)
	r2.Any("/monitoring/realtime", api.RealMetrics)
}
