package auth

import (
	"errors"

	"gorm.io/gorm"
)

// defines method for user data access
type UserRepository interface {
	CreateUser(user *User) error
	GetUserByEmail(email string) (*User, error)
}

type userRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
	return &userRepository{db}
}

func (r *userRepository) CreateUser(user *User) error {
	return r.db.Create(user).Error
}

func (r *userRepository) GetUserByEmail(email string) (*User, error) {
	var user User
	err := r.db.Where("email = ?", email).First(&user).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil
	}

	return &user, err
}
