package db

import (
	"context"
	"fmt"
	"log"

	"gmc_api_gateway/config"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var cdb *mongo.Database

func ConnDB(config *config.Config) {
	dbURI := fmt.Sprintf("%s://%s:%s@%s:%s/?%s",
		config.DB.Dialect,
		config.DB.Username,
		config.DB.Password,
		config.DB.Host,
		config.DB.Port,
		config.DB.Option)

	log.Println("Database Connecting..")

	// Set client options
	clientOptions := options.Client().ApplyURI(dbURI)

	// Connect to MongoDB
	client, err := mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		log.Fatal("Could not connect database %d", err)
	}

	// Check the connection
	err = client.Ping(context.TODO(), nil)
	if err != nil {
		log.Fatal("Could not connect database ping %d", err)
	}

	// cdb = client.Database(config.DB.Name)
	cdb = client.Database(config.DB.Name)
	log.Println("DB Connection was successful!!")

}

func DbManager() *mongo.Database {
	return cdb
}
