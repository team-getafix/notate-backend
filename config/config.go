package config

import (
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
)

var (
	JWTSecretKey    string
	AccessTokenTTL  time.Duration
	RefreshTokenTTL time.Duration
)

func LoadConfig() {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found, using default values")
	}

	// defaults here are being used more as development values. production values will be set in the .env file
	JWTSecretKey = getEnv("JWT_SECRET_KEY", "randomsecretkey")
	AccessTokenTTL = getEnvAsDuration("ACCESS_TOKEN_TTL", 15*time.Minute)
	RefreshTokenTTL = getEnvAsDuration("REFRESH_TOKEN_TTL", 7*24*time.Hour)
}

func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}

	return defaultValue
}

func getEnvAsDuration(key string, defaultValue time.Duration) time.Duration {
	if valueStr, exists := os.LookupEnv(key); exists {
		value, err := time.ParseDuration(valueStr)
		if err != nil {
			return value
		}
	}

	return defaultValue
}
