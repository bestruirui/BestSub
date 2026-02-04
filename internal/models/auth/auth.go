package auth

import "time"

type Data struct {
	ID       uint8  `db:"id" json:"-"`
	UserName string `db:"username" json:"username"`
	Password string `db:"password" json:"-"`
}

type LoginRequest struct {
	Username string `json:"username" binding:"required" example:"admin"`
	Password string `json:"password" binding:"required" example:"admin"`
}

type LoginResponse struct {
	AccessToken     string    `json:"access_token" example:"access_token_string"`
	AccessExpiresAt time.Time `json:"access_expires_at" example:"2024-01-01T12:00:00Z"`
}

type ChangePasswordRequest struct {
	Username    string `json:"username" binding:"required" example:"admin"`
	OldPassword string `json:"old_password" binding:"required" example:"old_password"`
	NewPassword string `json:"new_password" binding:"required" example:"new_password"`
}

type UpdateUserInfoRequest struct {
	Username string `json:"username" binding:"required" example:"admin"`
}
type LoginNotify struct {
	Username  string `json:"username"`
	IP        string `json:"ip"`
	Time      string `json:"time"`
	Msg       string `json:"msg"`
	UserAgent string `json:"user_agent"`
}
