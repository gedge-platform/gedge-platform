package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	DB     *DBConfig
	COMMON *CommonConfig
	URL    *URLConfig
}

type DBConfig struct {
	Dialect  string
	Host     string
	Port     string
	Username string
	Password string
	Name     string
	Option   string
}

type CommonConfig struct {
	Port       string
	CorsOrigin string
}
type URLConfig struct {
	Spider string
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
			Option:   os.Getenv("DB_OPTION"),
		},
		COMMON: &CommonConfig{
			Port:       os.Getenv("PORT"),
			CorsOrigin: os.Getenv("CORS"),
		},
		URL: &URLConfig{
			Spider: os.Getenv("SPIDER_URL"),
		},
	}
}

func Init() {
	err := godotenv.Load()
	if err != nil {
		log.Println("Error loading .env file")
	}
}

// func Test() {
// 	config.Init()
// 	IP := os.Getenv("PROMETHEUS")
// }
