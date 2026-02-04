package config

type Base struct {
	Server   ServerConfig   `json:"server"`
	Database DatabaseConfig `json:"database"`
	Log      LogConfig      `json:"log"`
	JWT      JWTConfig      `json:"jwt"`
	Session  SessionConfig  `json:"-"`
}

type ServerConfig struct {
	Port   int    `json:"port"`
	Host   string `json:"host"`
	UIPath string `json:"-"`
}

type DatabaseConfig struct {
	Type string `json:"type"`
	Path string `json:"-"`
}

type LogConfig struct {
	Level  string `json:"level"`
	Output string `json:"output"`
	Path   string `json:"-"`
}

type JWTConfig struct {
	Secret string `json:"secret"`
}

type SessionConfig struct {
	AuthPath string `json:"-"`
	NodePath string `json:"-"`
}
