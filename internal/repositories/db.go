package repositories

import (
	"log"

	"github.com/team-getafix/notate/internal/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {
	var err error
	dsn := "host=postgres user=admin password=compsci dbname=auth_db port=5432 sslmode=disable"
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	log.Println("Database connected successfully")
	DB.AutoMigrate(&models.User{})
	log.Println("Migrated models successfully")
}
