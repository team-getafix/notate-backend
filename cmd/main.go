package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/team-getafix/notate/internal/handlers"
	"github.com/team-getafix/notate/internal/repositories"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found, using defaults.")
	}

	repositories.ConnectDatabase()

	r := gin.Default()
	auth := r.Group("/auth")
	{
		auth.POST("/login", handlers.Login)
		auth.POST("/refresh", handlers.Refresh)
		auth.POST("/register", handlers.Register).Use(handlers.AuthMiddleware("admin"))
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	log.Fatal(r.Run(":" + port))
}
