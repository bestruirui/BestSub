package auth

import (
	"fmt"
	"time"

	"github.com/bestruirui/bestsub/internal/models/auth"
	"github.com/golang-jwt/jwt/v5"
)

// Claims JWT声明结构
type Claims struct {
	Username  string `json:"username"`
	jwt.RegisteredClaims
}

// GenerateToken 生成访问令牌
func GenerateToken(username, secret string) (*auth.LoginResponse, error) {

	now := time.Now()

	accessExpiresAt := now.Add(7 * 24 * time.Hour)

	claims := &Claims{
		Username: username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(accessExpiresAt),
			IssuedAt:  jwt.NewNumericDate(now),
			NotBefore: jwt.NewNumericDate(now),
			Issuer:    "bestsub",
			Subject:   username,
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	accessToken, err := token.SignedString([]byte(secret))
	if err != nil {
		return nil, fmt.Errorf("failed to sign token: %w", err)
	}

	return &auth.LoginResponse{
		AccessToken:     accessToken,
		AccessExpiresAt: accessExpiresAt,
	}, nil
}

// ValidateToken 验证JWT令牌
func ValidateToken(tokenString, secret string) (*Claims, error) {

	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(secret), nil
	})

	if err != nil {
		return nil, fmt.Errorf("failed to parse token: %w", err)
	}

	if claims, ok := token.Claims.(*Claims); ok && token.Valid {
		if claims.ExpiresAt != nil && time.Now().After(claims.ExpiresAt.Time) {
			return nil, fmt.Errorf("token has expired")
		}
		return claims, nil
	}

	return nil, fmt.Errorf("invalid token")
}
