package middleware

import (
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/team-getafix/notate/config"
)

type CustomClaims struct {
	UserID uint   `json:"user_id"`
	Role   string `json:"role"`

	jwt.RegisteredClaims
}

func JWTMiddleware(allowedRoles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString := extractToken(c)
		if tokenString == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "authorization required"})

			return
		}

		claims, err := validateToken(tokenString)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
		}

		if !isRoleAllowed(claims.Role, allowedRoles) {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "insufficient permissions"})
		}

		c.Set("userID", claims.UserID)
		c.Set("role", claims.Role)
		c.Next()
	}
}

func extractToken(c *gin.Context) string {
	bearerToken := c.GetHeader("Authorization")
	if bearerToken == "" {
		return ""
	}

	parts := strings.SplitN(bearerToken, " ", 2)
	if len(parts) != 2 || parts[0] != "Bearer" {
		return ""
	}

	return strings.TrimSpace(parts[1])
}

func validateToken(tokenString string) (*CustomClaims, error) {
	cfg := config.Get()

	token, err := jwt.ParseWithClaims(tokenString, &CustomClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, jwt.ErrSignatureInvalid
		}
		return []byte(cfg.JWTSecret), nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(*CustomClaims); ok && token.Valid {
		if claims.ExpiresAt != nil && claims.ExpiresAt.Time.Before(time.Now()) {
			return nil, jwt.ErrTokenExpired
		}

		return claims, nil
	}

	return nil, jwt.ErrTokenInvalidClaims
}

func isRoleAllowed(userRole string, allowedRoles []string) bool {
	if len(allowedRoles) == 0 {
		return true
	}

	for _, role := range allowedRoles {
		if userRole == role {
			return true
		}
	}

	return false
}
