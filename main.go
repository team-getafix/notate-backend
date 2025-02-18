// uses all services, good for local development

package main

import (
	"log"
	"os"

	"github.com/team-getafix/notate/internal/auth"
	"github.com/team-getafix/notate/internal/middleware"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found, using defaults.")
	}

	auth.ConnectDatabase()

	r := gin.Default()
	authGroup := r.Group("/auth")
	{
		authGroup.POST("/login", auth.Login)
		authGroup.POST("/refresh", auth.Refresh)
		authGroup.POST("/register", auth.Register).Use(middleware.JWTMiddleware("admin"))
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	log.Fatal(r.Run(":" + port))
}
