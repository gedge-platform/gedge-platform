package model

import (
	"backend/util"
	"database/sql"
	"fmt"
	"log"
	"os"
	"time"

	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
)

var db *sql.DB

func DBInit() *sql.DB {
	env_err := godotenv.Load(".env")
	util.FailOnError(env_err, ".env Load fail")
	dbContainer := os.Getenv("DB_CONTAINER_IP")
	dbDriver := os.Getenv("DB_DRIVER")
	dbUser := os.Getenv("DB_USER")
	dbPass := os.Getenv("DB_PASSWD")
	dbName := os.Getenv("DB_NAME")
	var db_err error
	db, db_err = sql.Open(dbDriver, dbUser+":"+dbPass+"@tcp("+dbContainer+")/")
	if db_err != nil {
		panic(db_err.Error())
	} else {
		db.Exec("CREATE DATABASE IF NOT EXISTS " + dbName + ";")
		db.Exec("USE Application;")
		db.Query("CREATE TABLE IF NOT EXISTS Clusters (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL, ip VARCHAR(255) NOT NULL, dashboardPort INT NOT NULL, apiPort INT NOT NULL, rpcPort INT NOT NULL, state BOOLEAN NOT NULL, date DATETIME NOT NULL, local BOOLEAN NOT NULL);")
		db.Exec("USE Application;")
		db.Query("CREATE TABLE IF NOT EXISTS Messages (id INT AUTO_INCREMENT PRIMARY KEY, protocol VARCHAR(255) NOT NULL, channel VARCHAR(255) NOT NULL, clientId VARCHAR(255) NOT NULL, metadata VARCHAR(255) NOT NULL, msg JSON, ClusterId INT, FOREIGN KEY (ClusterId) REFERENCES Clusters(id));")
		log.Println("init db")
	}
	db.Close()

	db, db_err = sql.Open(dbDriver, dbUser+":"+dbPass+"@tcp("+dbContainer+")/"+dbName)
	if db_err != nil {
		panic(db_err.Error())
	} else {
		db.Query("USE Application;")
	}

	return db
}
func AppInit() {
	db := DBConn()
	var count int
	queryErr := db.QueryRow("SELECT COUNT(*) FROM Clusters").Scan(&count)
	if queryErr != nil {
		panic(queryErr.Error())
	}

	if count == 0 {
		hostIp := os.Getenv("HOST_IP")
		pingErr := util.CheckCondition(hostIp, 50000)
		if pingErr != nil {
			panic(pingErr.Error())
		}
		date := time.Now().Format("2006-01-02 15:04:05")
		insert, dbInsterErr := db.Query("INSERT INTO Clusters (name, ip, dashboardPort, apiPort, rpcPort, state, date, local) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
			"Main Cluster", hostIp, 8080, 9090, 50000, true, date, true)
		if dbInsterErr != nil {
			fmt.Println(dbInsterErr)
			panic(dbInsterErr.Error())
		}
		defer insert.Close()
	}
}

func DBConn() *sql.DB {
	return db
}