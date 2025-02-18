package config

import (
	"os"
	"time"
)

type AppConfig struct {
	JWTSecret       string
	AUTH_DB_URL     string
	AccessTokenTTL  time.Duration
	RefreshTokenTTL time.Duration
}

var cfg *AppConfig

func Load() {
	cfg = &AppConfig{
		JWTSecret:       getEnv("JWT_SECRET", "default-secret"),
		AUTH_DB_URL:     getEnv("AUTH_DB_URL", "postgres://admin:compsci@postgres:5432/auth_db?sslmode=disable"),
		AccessTokenTTL:  getEnvAsDuration("ACCESS_TOKEN_TTL", 15*time.Minute),
		RefreshTokenTTL: getEnvAsDuration("REFRESH_TOKEN_TTL", 168*time.Hour),
	}
}

func Get() *AppConfig {
	return cfg
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
