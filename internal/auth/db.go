package auth

import (
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {
	dsn := os.Getenv("AUTH_DB_URL")
	if dsn == "" {
		log.Fatal("Auth database not provided DSN in .env")
	}

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database: ", err)
	}
	log.Println("Connected to auth database successfully")

	err = DB.AutoMigrate(&User{})
	if err != nil {
		log.Fatal("Failed to migrate auth models: ", err)
	}
	log.Println("Migrated models successfully")
}
