package main

import (
  	"log"
  
	"github.com/gedge-platform/gm-center/develop/gmc_database_api_server/app"
	"github.com/gedge-platform/gm-center/develop/gmc_database_api_server/config"
)

func main() {
	config := config.GetConfig()

	app := &app.App{}
	app.Initialize(config)
    log.Println("Starting API server at http://127.0.0.1:8000/")
    log.Println("Quit the server with CONTROL-C.")
	app.Run(":8000")
}
