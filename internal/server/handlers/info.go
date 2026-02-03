package handlers

import (
	"context"
	"net/http"
	"time"

	sys "github.com/bestruirui/bestsub/internal/core/system"
	"github.com/bestruirui/bestsub/internal/database/op"
	"github.com/bestruirui/bestsub/internal/models/system"
	"github.com/bestruirui/bestsub/internal/server/middleware"
	"github.com/bestruirui/bestsub/internal/server/resp"
	"github.com/bestruirui/bestsub/internal/server/router"
	"github.com/bestruirui/bestsub/internal/utils/info"
	"github.com/bestruirui/bestsub/internal/utils/log"
	"github.com/gin-gonic/gin"
)

func init() {
	router.NewGroupRouter("/api/v1/system").
		AddRoute(
			router.NewRoute("/health", router.GET).
				Handle(healthCheck),
		).
		AddRoute(
			router.NewRoute("/ready", router.GET).
				Handle(readinessCheck),
		).
		AddRoute(
			router.NewRoute("/live", router.GET).
				Handle(livenessCheck),
		)

	router.NewGroupRouter("/api/v1/system").
		Use(middleware.Auth()).
		AddRoute(
			router.NewRoute("/info", router.GET).
				Handle(systemInfo),
		).
		AddRoute(
			router.NewRoute("/version", router.GET).
				Handle(version),
		)
}

// healthCheck 健康检查
// @Summary 健康检查
// @Description 检查服务健康状态，包括数据库连接状态
// @Tags 系统
// @Accept json
// @Produce json
// @Success 200 {object} resp.ResponseStruct{data=system.HealthResponse} "服务正常"
// @Failure 503 {object} resp.ResponseStruct "服务不可用"
// @Router /api/v1/system/health [get]
func healthCheck(c *gin.Context) {
	// 检查数据库连接状态
	opStatus := "connected"

	// 尝试执行一个简单的数据库查询来检查连接
	authRepo := op.AuthRepo()
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := authRepo.IsInitialized(ctx)
	if err != nil {
		log.Errorf("Database health check failed: %v", err)
		opStatus = "disconnected"
	}

	response := system.HealthResponse{
		Status:    "ok",
		Timestamp: time.Now().Format(time.RFC3339),
		Version:   info.Version,
		Database:  opStatus,
	}

	// 如果数据库连接失败，返回503状态码
	if opStatus == "disconnected" {
		response.Status = "error"
		resp.Error(c, http.StatusServiceUnavailable, "database connection failed")
		return
	}

	resp.Success(c, response)
}

// readinessCheck 就绪检查
// @Summary 就绪检查
// @Description 检查服务是否准备好接收请求
// @Tags 系统
// @Accept json
// @Produce json
// @Success 200 {object} resp.ResponseStruct{data=system.HealthResponse} "服务就绪"
// @Failure 503 {object} resp.ResponseStruct "服务未就绪"
// @Router /api/v1/system/ready [get]
func readinessCheck(c *gin.Context) {
	// 检查关键组件是否就绪
	ready := true
	var errorMsg string

	authRepo := op.AuthRepo()
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	isInitialized, err := authRepo.IsInitialized(ctx)
	if err != nil || !isInitialized {
		ready = false
		errorMsg = "database not initialized"
		log.Errorf("Readiness check failed: op not initialized, error: %v", err)
	}

	response := system.HealthResponse{
		Status:    "ready",
		Timestamp: time.Now().Format(time.RFC3339),
		Version:   info.Version,
		Database:  "initialized",
	}

	if !ready {
		response.Status = "not ready"
		response.Database = "not initialized"
		resp.Error(c, http.StatusServiceUnavailable, errorMsg)
		return
	}

	resp.Success(c, response)
}

// livenessCheck 存活检查
// @Summary 存活检查
// @Description 检查服务是否存活（简单的ping检查）
// @Tags 系统
// @Accept json
// @Produce json
// @Success 200 {object} resp.ResponseStruct "服务存活"
// @Router /api/v1/system/live [get]
func livenessCheck(c *gin.Context) {
	resp.Success(c, map[string]interface{}{
		"status":    "alive",
		"timestamp": time.Now().Format(time.RFC3339),
	})
}

// systemInfo 系统信息
// @Summary 系统信息
// @Description 获取程序运行相关信息，包括内存使用、运行时长、网络流量、CPU信息等
// @Tags 系统
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {object} resp.ResponseStruct{data=system.Info} "获取成功"
// @Failure 401 {object} resp.ResponseStruct "未授权"
// @Failure 500 {object} resp.ResponseStruct "服务器内部错误"
// @Router /api/v1/system/info [get]
func systemInfo(c *gin.Context) {
	resp.Success(c, sys.GetSystemInfo())
}

// systemInfo 系统版本
// @Summary 系统版本
// @Description 获取程序版本信息
// @Tags 系统
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {object} resp.ResponseStruct{data=system.Version} "获取成功"
// @Failure 401 {object} resp.ResponseStruct "未授权"
// @Failure 500 {object} resp.ResponseStruct "服务器内部错误"
// @Router /api/v1/system/version [get]
func version(c *gin.Context) {
	resp.Success(c, system.Version{
		Version:   info.Version,
		BuildTime: info.BuildTime,
		Commit:    info.Commit,
		Author:    info.Author,
		Repo:      info.Repo,
	})
}
