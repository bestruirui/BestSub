package handlers

import (
	"net/http"
	"strconv"
	"time"

	"github.com/bestruirui/bestsub/internal/database/op"
	shareModel "github.com/bestruirui/bestsub/internal/models/share"
	"github.com/bestruirui/bestsub/internal/modules/share"
	"github.com/bestruirui/bestsub/internal/server/middleware"
	"github.com/bestruirui/bestsub/internal/server/resp"
	"github.com/bestruirui/bestsub/internal/server/router"
	"github.com/bestruirui/bestsub/internal/utils/log"
	"github.com/gin-gonic/gin"
)

func init() {
	router.NewGroupRouter("/api/v1/share").
		Use(middleware.Auth()).
		AddRoute(
			router.NewRoute("", router.POST).
				Handle(createShare),
		).
		AddRoute(
			router.NewRoute("", router.GET).
				Handle(getShare),
		).
		AddRoute(
			router.NewRoute("/:id", router.PUT).
				Handle(updateShare),
		).
		AddRoute(
			router.NewRoute("/:id", router.DELETE).
				Handle(deleteShare),
		)
	router.NewGroupRouter("/api/v1/share").
		AddRoute(
			router.NewRoute("/node/:token", router.GET).
				Handle(getShareNodeContent),
		).
		AddRoute(
			router.NewRoute("/sub/:token", router.GET).
				Handle(getShareSubContent),
		)
}

// @Summary 创建分享链接
// @Description 创建分享链接
// @Tags 分享
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param data body shareModel.Request true "分享数据"
// @Success 200 {object} resp.ResponseStruct{data=shareModel.Response} "创建成功"
// @Failure 401 {object} resp.ResponseStruct "未授权"
// @Failure 500 {object} resp.ResponseStruct "服务器内部错误"
// @Router /api/v1/share [post]
func createShare(c *gin.Context) {
	var req shareModel.Request
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Errorf("createShare: %v", err)
		resp.ErrorBadRequest(c)
		return
	}
	data := req.GenData()
	if err := op.CreateShare(c.Request.Context(), &data); err != nil {
		resp.Error(c, http.StatusInternalServerError, err.Error())
		return
	}
	resp.Success(c, data.GenResponse())
}

// @Summary 获取分享链接
// @Description 获取分享链接
// @Tags 分享
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {object} resp.ResponseStruct{data=[]shareModel.Response} "获取成功"
// @Failure 401 {object} resp.ResponseStruct "未授权"
// @Failure 500 {object} resp.ResponseStruct "服务器内部错误"
// @Router /api/v1/share [get]
func getShare(c *gin.Context) {
	shares, err := op.GetShareList(c.Request.Context())
	if err != nil {
		resp.Error(c, http.StatusInternalServerError, err.Error())
		return
	}
	var result = make([]shareModel.Response, 0, len(shares))
	for _, v := range shares {
		result = append(result, v.GenResponse())
	}
	resp.Success(c, result)
}

// @Summary 更新分享链接
// @Description 更新分享链接
// @Tags 分享
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path string true "分享ID"
// @Param data body shareModel.Request true "分享数据"
// @Success 200 {object} resp.ResponseStruct{data=shareModel.Response} "更新成功"
// @Failure 401 {object} resp.ResponseStruct "未授权"
// @Failure 500 {object} resp.ResponseStruct "服务器内部错误"
// @Router /api/v1/share/{id} [put]
func updateShare(c *gin.Context) {
	var req shareModel.Request
	if err := c.ShouldBindJSON(&req); err != nil {
		resp.ErrorBadRequest(c)
		return
	}
	id := c.Param("id")
	idUint, err := strconv.ParseUint(id, 10, 16)
	if err != nil {
		resp.ErrorBadRequest(c)
		return
	}
	data := req.GenData()
	data.ID = uint16(idUint)
	if err := op.UpdateShare(c.Request.Context(), &data); err != nil {
		resp.Error(c, http.StatusInternalServerError, err.Error())
		return
	}
	resp.Success(c, data.GenResponse())
}

// @Summary 删除分享链接
// @Description 删除分享链接
// @Tags 分享
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path string true "分享ID"
// @Success 200 {object} resp.ResponseStruct "删除成功"
// @Failure 401 {object} resp.ResponseStruct "未授权"
// @Failure 500 {object} resp.ResponseStruct "服务器内部错误"
// @Router /api/v1/share/{id} [delete]
func deleteShare(c *gin.Context) {
	id := c.Param("id")
	idUint, err := strconv.ParseUint(id, 10, 16)
	if err != nil {
		resp.ErrorBadRequest(c)
		return
	}
	if err := op.DeleteShare(c.Request.Context(), uint16(idUint)); err != nil {
		resp.ErrorBadRequest(c)
		return
	}
	resp.Success(c, nil)
}

// @Summary 获取订阅内容 纯Mihomo格式的节点
// @Description 获取订阅内容 纯Mihomo格式的节点
// @Tags 分享
// @Accept json
// @Produce plain
// @Param token path string true "分享token"
// @Success 200 {string} string "获取成功，内容为yaml/plain格式"
// @Failure 500 {object} resp.ResponseStruct "服务器内部错误"
// @Router /api/v1/share/node/{token} [get]
func getShareNodeContent(c *gin.Context) {
	token := c.Param("token")
	clientIp := c.ClientIP()
	if token == "" {
		resp.Error(c, http.StatusInternalServerError, "token is required")
		return
	}
	shareData, err := op.GetShareByToken(c.Request.Context(), token)
	if err != nil {
		resp.Error(c, http.StatusInternalServerError, err.Error())
		return
	}
	if !shareData.Enable {
		resp.Error(c, http.StatusInternalServerError, "share not enable")
		return
	}
	if shareData.Expires < uint64(time.Now().Unix()) && shareData.Expires > 0 {
		resp.Error(c, http.StatusInternalServerError, "share expired")
		return
	}
	if shareData.MaxAccessCount > 0 && shareData.MaxAccessCount <= shareData.AccessCount {
		resp.Error(c, http.StatusInternalServerError, "share access count exceeded")
		return
	}
	if clientIp != "127.0.0.1" {
		op.UpdateShareAccessCount(c.Request.Context(), shareData.ID)
	}
	c.Data(http.StatusOK, "text/plain; charset=utf-8", share.GenNodeData(shareData.Gen))
}

// @Summary 获取订阅内容 带规则的订阅
// @Description 获取订阅内容 带规则的订阅
// @Tags 分享
// @Accept json
// @Produce plain
// @Param token path string true "分享token"
// @Success 200 {string} string "获取成功，内容为yaml/plain格式"
// @Failure 500 {object} resp.ResponseStruct "服务器内部错误"
// @Router /api/v1/share/sub/{token} [get]
func getShareSubContent(c *gin.Context) {
	token := c.Param("token")
	if token == "" {
		resp.Error(c, http.StatusInternalServerError, "token is required")
		return
	}
	target := c.Query("target")
	if target == "" {
		target = "mihomo"
	}
	shareData, err := op.GetShareByToken(c.Request.Context(), token)
	if err != nil {
		resp.Error(c, http.StatusInternalServerError, err.Error())
		return
	}
	if !shareData.Enable {
		resp.Error(c, http.StatusInternalServerError, "share not enable")
		return
	}
	if shareData.Expires < uint64(time.Now().Unix()) && shareData.Expires > 0 {
		resp.Error(c, http.StatusInternalServerError, "share expired")
		return
	}
	if shareData.MaxAccessCount > 0 && shareData.MaxAccessCount <= shareData.AccessCount {
		resp.Error(c, http.StatusInternalServerError, "share access count exceeded")
		return
	}
	op.UpdateShareAccessCount(c.Request.Context(), shareData.ID)
	c.Data(http.StatusOK, "text/plain; charset=utf-8", share.GenSubData(shareData.Gen, target))
}
