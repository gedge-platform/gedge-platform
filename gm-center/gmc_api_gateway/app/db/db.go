package db

import (
	"fmt"
	"log"

	// "net/http"

	"gmc_api_gateway/config"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
)

// App has router and db instances
type DB struct {
	DB *gorm.DB
}

var cdb *gorm.DB

// Initialize initializes the app with predefined configuration
func (a *DB) Initialize(config *config.Config) {
	dbURI := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=%s&parseTime=True",
		config.DB.Username,
		config.DB.Password,
		config.DB.Host,
		config.DB.Port,
		config.DB.Name,
		config.DB.Charset)

	db, err := gorm.Open(config.DB.Dialect, dbURI)
	if err != nil {
		log.Fatal("Could not connect database %d", err)
		panic(err.Error())
	}
	log.Println("DB Connection was successful!!")

	a.DB = db.AutoMigrate()
	cdb = db
}

func DbManager() *gorm.DB {
	return cdb
}
