package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	DB     *DBConfig
	COMMON *CommonConfig
}

type DBConfig struct {
	Dialect  string
	Host     string
	Port     string
	Username string
	Password string
	Name     string
	Charset  string
}

type CommonConfig struct {
	Port       string
	CorsOrigin string
}

func GetConfig() *Config {
	return &Config{
		DB: &DBConfig{
			Dialect:  os.Getenv("DB_DIALECT"),
			Host:     os.Getenv("DB_HOST"),
			Port:     os.Getenv("DB_PORT"),
			Username: os.Getenv("DB_USERNAME"),
			Password: os.Getenv("DB_PASSWORD"),
			Name:     os.Getenv("DB_NAME"),
			Charset:  os.Getenv("DB_CHARSET"),
		},
		COMMON: &CommonConfig{
			Port:       os.Getenv("PORT"),
			CorsOrigin: os.Getenv("CORS"),
		},
	}
}

func Init() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
}
