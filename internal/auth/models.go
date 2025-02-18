package auth

const (
	RoleStudent = "student"
	RoleTeacher = "teacher"
	RoleAdmin   = "admin"
)

// represents a user in the database
type User struct {
	ID       uint   `json:"id" gorm:"primaryKey"`
	Email    string `json:"email" gorm:"unique" binding:"required"`
	Password string `json:"password" binding:"required"` // hashed
	Role     string `json:"role" binding:"required"`
}

// payload for /auth/register
type RegisterInput struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
	Role     string `json:"role" binding:"required,oneof=student teacher admin"`
}

// payload for /auth/login
type LoginInput struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// payload for /auth/refresh
type RefreshInput struct {
	RefreshToken string `json:"refresh_token" binding:"required"`
}
