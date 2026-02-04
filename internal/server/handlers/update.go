package handlers

import (
	"net/http"

	"github.com/bestruirui/bestsub/internal/core/update"
	"github.com/bestruirui/bestsub/internal/server/middleware"
	"github.com/bestruirui/bestsub/internal/server/resp"
	"github.com/bestruirui/bestsub/internal/server/router"
	"github.com/gin-gonic/gin"
)

func init() {
	router.NewGroupRouter("/api/v1/update").
		Use(middleware.Auth()).
		AddRoute(
			router.NewRoute("", router.GET).
				Handle(latest),
		).
		AddRoute(
			router.NewRoute("/:name", router.POST).
				Handle(updateFunc),
		)
}

// latest 最新版本
// @Summary 最新版本
// @Description 获取程序最新版本信息
// @Tags 更新
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {object} resp.ResponseStruct{data=map[string]update.LatestInfo} "获取成功"
// @Failure 401 {object} resp.ResponseStruct "未授权"
// @Failure 500 {object} resp.ResponseStruct "服务器内部错误"
// @Router /api/v1/update [get]
func latest(c *gin.Context) {
	latestInfo := make(map[string]update.LatestInfo, 3)
	bestsub, err := update.GetLatestBestsubInfo()
	if err != nil {
		resp.Error(c, http.StatusInternalServerError, err.Error())
		return
	}
	ui, err := update.GetLatestUIInfo()
	if err != nil {
		resp.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	latestInfo["bestsub"] = *bestsub
	latestInfo["webui"] = *ui
	resp.Success(c, latestInfo)
}

// update 更新
// @Summary 更新
// @Description 更新程序
// @Tags 更新
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {object} resp.ResponseStruct{data=string} "获取成功"
// @Failure 401 {object} resp.ResponseStruct "未授权"
// @Failure 500 {object} resp.ResponseStruct "服务器内部错误"
// @Router /api/v1/update/:name [post]
func updateFunc(c *gin.Context) {
	name := c.Param("name")
	switch name {
	case "webui":
		err := update.UpdateUI()
		if err != nil {
			resp.Error(c, http.StatusInternalServerError, err.Error())
			return
		}
	case "bestsub":
		err := update.UpdateCore()
		if err != nil {
			resp.Error(c, http.StatusInternalServerError, err.Error())
			return
		}
	default:
		resp.ErrorBadRequest(c)
	}
	resp.Success(c, nil)
}
