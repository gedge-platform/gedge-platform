package main

import (
	"net/http"
	"os"
	"strconv"

	db "gmc_api_gateway/app/database"
	"gmc_api_gateway/app/routes"
	"gmc_api_gateway/config"

	_ "gmc_api_gateway/docs"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	echoSwagger "github.com/swaggo/echo-swagger" // echo-swagger middleware
)

// @title Gedge GM-Center Swagger API
// @version 2.0
// @description This is a Gedge GM-Center Swagger API.

// @contact.name GM-Center
// @contact.url https://gedge-platform.github.io/gm-center/

// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html

// @host 192.168.160.230:8013
// @BasePath /gmcapi/v2
// @schemes http
// @query.collection.format multi

// @securitydefinitions.apikey  Bearer
// @in                          header
// @name                        Authorization
// @description "Type \"Bearer \" and then your API Token"
func main() {
	// docs.SwaggerInfo.BasePath = "/gmcapi/v2"
	config.Init()
	config := config.GetConfig()

	db.ConnDB(config)

	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORS())
	// e.Use(middleware.GzipWithConfig(middleware.GzipConfig{
	// 	Skipper: func(c echo.Context) bool {
	// 		if strings.Contains(c.Path(), "swagger") { // Change "swagger" for your own path
	// 			return true
	// 		}
	// 		return false
	// 	},
	// }))

	// e.GET("/", func(c echo.Context) error {
	// 	return c.HTML(http.StatusOK, `
	// 			<h1>Welcome to GEdge API-Gateway!</h1>
	// 			<h3>GEdge Platform :: GM-Center API Server :)</h3>
	// 	`)
	// })
	e.GET("/", func(c echo.Context) error {
		return c.HTML(http.StatusOK, `
				<h1>Welcome to GEdge API-Gateway!</h1>
				<h3>GEdge Platform :: GM-Center API Server :)</h3>
		`)
	})

	e.GET("/swagger/*any", echoSwagger.WrapHandler)

	routes.GEdgeRoute(e)

	if err := e.Start(GetListenPort(config)); err != nil {
		panic(err)
	}
}

// Environment Value ("LISTEN_PORT")
func GetListenPort(config *config.Config) string {
	port := os.Getenv("LISTEN_PORT")

	if len(port) == 0 {
		port = config.COMMON.Port
	}
	intPort, err := strconv.Atoi(port)
	if err != nil || intPort < 1 || 65535 < intPort {
		port = config.COMMON.Port
	}

	return ":" + port
}
