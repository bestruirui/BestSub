package handlers

import (
	"net/http"
	"time"

	"github.com/bestruirui/bestsub/internal/config"
	"github.com/bestruirui/bestsub/internal/database/op"
	authModel "github.com/bestruirui/bestsub/internal/models/auth"
	notifyModel "github.com/bestruirui/bestsub/internal/models/notify"
	"github.com/bestruirui/bestsub/internal/modules/notify"
	"github.com/bestruirui/bestsub/internal/server/auth"
	"github.com/bestruirui/bestsub/internal/server/middleware"
	"github.com/bestruirui/bestsub/internal/server/resp"
	"github.com/bestruirui/bestsub/internal/server/router"
	"github.com/bestruirui/bestsub/internal/utils/log"
	"github.com/gin-gonic/gin"
)

func init() {

	router.NewGroupRouter("/api/v1/auth").
		AddRoute(
			router.NewRoute("/login", router.POST).
				Handle(login),
		)

	router.NewGroupRouter("/api/v1/auth").
		Use(middleware.Auth()).
		AddRoute(
			router.NewRoute("/logout", router.POST).
				Handle(logout),
		).
		AddRoute(
			router.NewRoute("/user/password", router.POST).
				Handle(changePassword),
		).
		AddRoute(
			router.NewRoute("/user/name", router.POST).
				Handle(updateUsername),
		).
		AddRoute(
			router.NewRoute("/user", router.GET).
				Handle(getUserInfo),
		)
}

// login 用户登录
// @Summary 用户登录
// @Description 用户登录接口，验证用户名和密码，返回JWT令牌
// @Tags 认证
// @Accept json
// @Produce json
// @Param request body authModel.LoginRequest true "登录请求"
// @Success 200 {object} resp.ResponseStruct{data=authModel.LoginResponse} "登录成功"
// @Failure 400 {object} resp.ResponseStruct "请求参数错误"
// @Failure 401 {object} resp.ResponseStruct "用户名或密码错误"
// @Failure 500 {object} resp.ResponseStruct "服务器内部错误"
// @Router /api/v1/auth/login [post]
func login(c *gin.Context) {
	var req authModel.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		resp.ErrorBadRequest(c)
		return
	}

	err := op.AuthVerify(req.Username, req.Password)
	if err != nil {
		log.Warnf("Login failed for user %s: %v from %s", req.Username, err, c.ClientIP())
		go notify.SendSystemNotify(notifyModel.TypeLoginFailed, "登录失败", authModel.LoginNotify{
			Username:  req.Username,
			IP:        c.ClientIP(),
			Time:      time.Now().Format("2006-01-02 15:04:05"),
			Msg:       "登录失败，用户名或密码错误",
			UserAgent: c.GetHeader("User-Agent"),
		})
		resp.Error(c, http.StatusUnauthorized, "username or password error")
		return
	}

	token, err := auth.GenerateToken(req.Username, config.Base().JWT.Secret)
	if err != nil {
		log.Errorf("Failed to generate token: %v from %s", err, c.ClientIP())
		go notify.SendSystemNotify(notifyModel.TypeLoginFailed, "登录失败", authModel.LoginNotify{
			Username:  req.Username,
			IP:        c.ClientIP(),
			Time:      time.Now().Format("2006-01-02 15:04:05"),
			Msg:       "登录失败，生成令牌失败",
			UserAgent: c.GetHeader("User-Agent"),
		})
		resp.Error(c, http.StatusInternalServerError, "failed to generate token")
		return
	}

	log.Infof("User %s logged in successfully from %s", req.Username, c.ClientIP())
	go notify.SendSystemNotify(notifyModel.TypeLoginSuccess, "登录成功", authModel.LoginNotify{
		Username:  req.Username,
		IP:        c.ClientIP(),
		Time:      time.Now().Format("2006-01-02 15:04:05"),
		Msg:       "登录成功",
		UserAgent: c.GetHeader("User-Agent"),
	})

	resp.Success(c, token)
}

// logout 用户登出
// @Summary 用户登出
// @Description 用户登出接口，客户端清除令牌
// @Tags 认证
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {object} resp.ResponseStruct "登出成功"
// @Failure 401 {object} resp.ResponseStruct "未授权"
// @Failure 500 {object} resp.ResponseStruct "服务器内部错误"
// @Router /api/v1/auth/logout [post]
func logout(c *gin.Context) {
	log.Infof("User logged out successfully from %s", c.ClientIP())

	resp.Success(c, nil)
}

// changePassword 修改密码
// @Summary 修改密码
// @Description 修改当前用户的密码
// @Tags 认证
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param request body authModel.ChangePasswordRequest true "修改密码请求"
// @Success 200 {object} resp.ResponseStruct "密码修改成功"
// @Failure 400 {object} resp.ResponseStruct "请求参数错误"
// @Failure 401 {object} resp.ResponseStruct "未授权或旧密码错误"
// @Failure 500 {object} resp.ResponseStruct "服务器内部错误"
// @Router /api/v1/auth/user/password [post]
func changePassword(c *gin.Context) {
	var req authModel.ChangePasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		resp.ErrorBadRequest(c)
		return
	}

	err := op.AuthVerify(req.Username, req.OldPassword)
	if err != nil {
		log.Warnf("Change password failed for user %s: old password verification failed from %s", req.Username, c.ClientIP())
		resp.Error(c, http.StatusUnauthorized, "old password verification failed")
		return
	}

	err = op.AuthUpdatePassWord(req.NewPassword)
	if err != nil {
		log.Errorf("Failed to update password: %v", err)
		resp.Error(c, http.StatusInternalServerError, "failed to update password")
		return
	}

	log.Infof("Password changed successfully for user %s from %s", req.Username, c.ClientIP())

	resp.Success(c, nil)
}

// getUserInfo 获取当前用户信息
// @Summary 获取用户信息
// @Description 获取当前登录用户的详细信息
// @Tags 认证
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {object} resp.ResponseStruct{data=authModel.Data} "获取成功"
// @Failure 401 {object} resp.ResponseStruct "未授权"
// @Failure 500 {object} resp.ResponseStruct "服务器内部错误"
// @Router /api/v1/auth/user [get]
func getUserInfo(c *gin.Context) {
	authInfo, err := op.AuthGet()
	if err != nil {
		log.Errorf("Failed to get auth info from %s: %v", c.ClientIP(), err)
		resp.Error(c, http.StatusInternalServerError, "failed to get auth info")
		return
	}
	resp.Success(c, authInfo)
}

// updateUsername 修改用户名
// @Summary 修改用户名
// @Description 修改当前用户的用户名
// @Tags 认证
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param request body authModel.UpdateUserInfoRequest true "修改用户名请求"
// @Success 200 {object} resp.ResponseStruct "用户名修改成功"
// @Failure 400 {object} resp.ResponseStruct "请求参数错误"
// @Failure 401 {object} resp.ResponseStruct "未授权"
// @Failure 409 {object} resp.ResponseStruct "用户名已存在"
// @Failure 500 {object} resp.ResponseStruct "服务器内部错误"
// @Router /api/v1/auth/user/name [post]
func updateUsername(c *gin.Context) {
	var req authModel.UpdateUserInfoRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		resp.ErrorBadRequest(c)
		return
	}

	authInfo, err := op.AuthGet()
	if err != nil {
		log.Errorf("Failed to get auth info from %s: %v", c.ClientIP(), err)
		resp.Error(c, http.StatusInternalServerError, "failed to get auth info")
		return
	}

	if authInfo.UserName == req.Username {
		resp.Error(c, http.StatusBadRequest, "new username cannot be the same as current username")
		return
	}

	if err := op.AuthUpdateName(req.Username); err != nil {
		resp.Error(c, http.StatusInternalServerError, "failed to update username")
		return
	}

	log.Infof("Username changed successfully from %s to %s from %s", authInfo.UserName, req.Username, c.ClientIP())

	resp.Success(c, nil)
}
