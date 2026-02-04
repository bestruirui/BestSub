package middleware

import (
	"net/http"
	"strings"

	"github.com/bestruirui/bestsub/internal/config"
	"github.com/bestruirui/bestsub/internal/server/auth"
	"github.com/bestruirui/bestsub/internal/server/resp"
	"github.com/bestruirui/bestsub/internal/utils/log"
	"github.com/gin-gonic/gin"
)

// Auth JWT认证中间件
func Auth() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			resp.Error(c, http.StatusUnauthorized, "Authorization header is required")
			c.Abort()
			return
		}
		if !strings.HasPrefix(authHeader, "Bearer ") {
			resp.Error(c, http.StatusUnauthorized, "Invalid Authorization header")
			c.Abort()
			return
		}
		token := strings.TrimSpace(strings.TrimPrefix(authHeader, "Bearer "))
		if token == "" {
			resp.Error(c, http.StatusUnauthorized, "Invalid Authorization header")
			c.Abort()
			return
		}

		claims, err := auth.ValidateToken(token, config.Base().JWT.Secret)
		if err != nil {
			log.Warnf("JWT validation failed: %v", err)
			resp.Error(c, http.StatusUnauthorized, "Invalid or expired token")
			c.Abort()
			return
		}
		c.Set("username", claims.Username)
		c.Next()
	}
}

// WSAuth WebSocket专用认证中间件
// WebSocket连接的认证处理与普通HTTP请求不同，需要特殊处理
func WSAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.Query("token")

		if token == "" {
			log.Warnf("WebSocket authentication failed: missing token, IP=%s", c.ClientIP())
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		claims, err := auth.ValidateToken(token, config.Base().JWT.Secret)
		if err != nil {
			log.Warnf("WebSocket JWT validation failed: %v, IP=%s", err, c.ClientIP())
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}
		c.Set("username", claims.Username)
		c.Next()
	}
}
